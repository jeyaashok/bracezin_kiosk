import { Injectable, Inject, signal, EventEmitter } from '@angular/core'
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Resolve } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { GlobalService, CommonService, BaseService } from 'src/@bracezin/_dbShare/general';
import { TableColumn } from 'src/@bracezin/_dbShare/utils';
import { AlertService } from 'src/@bracezin/_dbShare/alert/alert/alert.service';
import { Media, MediaModel, MediaMapModel, MediaPanelConfig, MediaPanelConfigModel } from 'src/@bracezin/_dbShare/directory/media';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
@UntilDestroy()

export class MediaService extends BaseService implements Resolve<any> {

	config = signal<MediaPanelConfig>(new MediaPanelConfigModel({}));
	onSelectItem = signal<Media>(new MediaModel({}));

	constructor(public globalService: GlobalService,
		public commonService: CommonService,
		public alertService: AlertService,
		// public snackBar: MatSnackBar,
		public dialog: MatDialog, private http: HttpClient) {
		super('media',
			globalService,
			commonService,
			MediaModel,
			MediaMapModel,
			alertService,
			// snackBar,
			dialog,
			null);
		this._unsubscribeAll = new Subject();
	}

	mediaUsage = signal<any>(0);

	changeMediaUsage(count: any) {
		this.mediaUsage.set(count);
	}

	changeConfig(config: MediaPanelConfig = null) {
		config = (config) ? config : new MediaPanelConfigModel({});
		this.config.set(config);
	}

	onSelectItemEvent(item: Media) {
		this.onSelectItem.set(item);
	}

	addMedia(data: any = null) {
		return this.commonService.fileUpload('media/upload', data, true, 'optionOne');
	}

	getDocumentUrl(url: string): Observable<Blob> {
		return this.commonService.convertBlob(url, { responseType: 'blob' });
	}

	onGetAllItemsResponse(response: any, input: any = null) {
		let additional = (response && response.additional) ? response.additional : null;
		var mediaUsage = additional?.MediaUsage ? additional?.MediaUsage : 0;
		let sizeInMB = (mediaUsage / 1024).toFixed(3);
		this.changeMediaUsage(this.formatSizeFromKB(sizeInMB));
	}

	formatSizeFromKB(kb: any): string {
		if (kb === undefined || kb === null || isNaN(kb)) {
			return '0 KB';
		}
		kb = Number(kb);
		const units = ['KB', 'MB', 'GB', 'TB'];
		let unitIndex = 0;
		while (kb >= 1024 && unitIndex < units.length - 1) {
			kb /= 1024;
			unitIndex++;
		}
		return kb.toFixed(3) + ' ' + units[unitIndex];
	}

	storeManagetag(data) {
		this.commonService.storeItem('media/managetag', data, true, 'optionOne')
			.pipe(untilDestroyed(this, 'unSubscribe'))
			.subscribe((data: any) => {
				if (data && data.success) {
					 
				} 
			},
				error => console.log('Error ::' + error)
			);
	}

}
