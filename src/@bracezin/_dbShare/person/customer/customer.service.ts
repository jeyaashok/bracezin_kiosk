import { Injectable, Inject, signal } from '@angular/core'
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Resolve } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { GlobalService, CommonService, BaseService } from 'src/@bracezin/_dbShare/general';
import { TableColumn } from 'src/@bracezin/_dbShare/utils';
import { AlertService } from 'src/@bracezin/_dbShare/alert/alert/alert.service';
import { Customer, CustomerModel, CustomerMapModel } from 'src/@bracezin/_dbShare/person/customer';
import { DatePipe } from '@angular/common';
import moment from 'moment';

@Injectable({
	providedIn: 'root',
})
@UntilDestroy()

export class CustomerService extends BaseService implements Resolve<any> {

	constructor(public globalService: GlobalService,
		public commonService: CommonService,
		public alertService: AlertService,
		// public snackBar: MatSnackBar,
		public datepipe: DatePipe,
		public dialog: MatDialog) {
		super('customer',
			globalService,
			commonService,
			CustomerModel,
			CustomerMapModel,
			alertService,
			// snackBar,
			dialog,
			null);
		this._unsubscribeAll = new Subject();
	}

	export(Dates, client_site_id = null, clientSite) {
		this.commonService.storeItem(this.url + '/export', Dates, true, 'optionOne')
			.pipe(untilDestroyed(this, 'unSubscribe'))
			.subscribe(data => {
				if (data.success) {
					if (data.data == 0) {
						this.alert('Danger', 'Datas are not available for selected dates !!!');
					}
					var clientSites = data.additional.clientSiteInfo ? data.additional.clientSiteInfo : null;
					var labelInfo = data.additional.labelInfo ? data.additional.labelInfo : null;
					if (data.data && data.data.length > 0 && clientSites && clientSites.length > 0) {
						var excelprint = data.data;
						let excelData = [];
						if (excelprint && excelprint.length > 0) {
							data.data.forEach(elementKey => {
								var dataIn = {
									"Name": elementKey.name ? elementKey.name.replace(/^"+|"+$/g, '').trim(): '',
									"Date and Time": moment(elementKey.updated_at).local().format("DD-MM-YYYY, h:mm:ss a"), // moment.unix(elementKey.updated_at).local().format("yyyy-MM-dd h:mm:ss a"), // this.datepipe.transform(elementKey.updated_at * 1000, 'yyyy-MM-dd hh:mm'),//moment(elementKey.created_at).format('DD-MM-YYYY'), // moment(elementKey.created_at + '.000+0300').local(),
									"Contact No": elementKey.unique_ref
								}
								if (clientSites && clientSites.length > 0) {
									clientSites.forEach(clientSitesKey => {
										if (client_site_id && clientSitesKey.id == client_site_id) {
											dataIn["Account For"] = clientSitesKey.account_name;
											dataIn["Site Name"] = clientSitesKey.details.name;
										} else {
											if (clientSitesKey.id == elementKey.client_site_id) {
												dataIn["Account For"] = clientSitesKey.account_name;
												dataIn["Site Name"] = clientSitesKey.details.name;
											}
										}
									});
								}
								if (labelInfo && labelInfo.length > 0) {
									labelInfo.forEach(label => {
										if (label && label.id == elementKey.CustomerLabelId) {
											dataIn["Label Name"] = label.name;
										}
									});
								}
								excelData.push(dataIn);
							});
							this.downloadFile(excelData);
						}
					}
					this.isUpdated.emit(true);
				}
			});
		error => { console.log('Error ::' + error); }
	}

	// download files
	downloadFile(excelData) {
		let arrHeader = ["Date and Time", "Name", "Site Name", "Account For", "Contact No", "Label Name"];
		let csvData = this.ConvertToCSV(excelData, arrHeader);
		let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
		let dwldLink = document.createElement("a");
		let url = URL.createObjectURL(blob);
		let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
		if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
			dwldLink.setAttribute("target", "_blank");
		}
		dwldLink.setAttribute("href", url);
		var currentTime = new Date().toJSON();
		dwldLink.setAttribute("download", 'lead-' + currentTime + '.csv');
		dwldLink.style.visibility = "hidden";
		document.body.appendChild(dwldLink);
		dwldLink.click();
		document.body.removeChild(dwldLink);
	}

	ConvertToCSV(objArray, headerList) {
		let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
		let str = '';
		let row = 'S.No,';
		let newHeaders = ["Date and Time", "Name", "Site Name", "Account For", "Contact No", "Label Name"];
		for (let index in newHeaders) {
			row += newHeaders[index] + ',';
		}
		row = row.slice(0, -1);
		str += row + '\r\n';
		for (let i = 0; i < array.length; i++) {
			let line = (i + 1) + '';
			for (let index in headerList) {
				let head = headerList[index];

				line += ',' + this.strRep(array[i][head]);
			}
			str += line + '\r\n';
		}
		return str;
	}

	strRep(data) {
		if (typeof data == "string") {
			let newData = data.replace(/,/g, " ");
			return newData;
		}
		else if (typeof data == "undefined") {
			return "-";
		}
		else if (typeof data == "number") {
			return data.toString();
		}
		else {
			return data;
		}
	}
}
