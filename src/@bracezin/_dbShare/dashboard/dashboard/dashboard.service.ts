import { Injectable, Inject, signal } from '@angular/core'
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Resolve } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { GlobalService, CommonService, BaseService } from 'src/@bracezin/_dbShare/general';
import { TableColumn } from 'src/@bracezin/_dbShare/utils';
import { AlertService } from 'src/@bracezin/_dbShare/alert/alert/alert.service';
import { Dashboard, DashboardModel, DashboardMapModel } from 'src/@bracezin/_dbShare/dashboard/dashboard';
import { DatePipe } from '@angular/common';
import moment from 'moment';

@Injectable({
	providedIn: 'root',
})
@UntilDestroy()

export class DashboardService extends BaseService implements Resolve<any> {

  dashboard = signal<Dashboard>(new DashboardModel({}));

	constructor(public globalService: GlobalService,
		public commonService: CommonService,
		public alertService: AlertService,
		// public snackBar: MatSnackBar,
		public datepipe: DatePipe,
		public dialog: MatDialog) {
		super('dashboard',
			globalService,
			commonService,
			DashboardModel,
			DashboardMapModel,
			alertService,
			// snackBar,
			dialog,
			null);
		this._unsubscribeAll = new Subject();
	}

  changeDashboard(dashboard: Dashboard) {
    this.dashboard.set(dashboard);
  }

  getItemByUrl(itemUrl: string = null, params: any = null) {
    this.commonService.getItemByPost(itemUrl, null, params)
      .pipe(untilDestroyed(this, 'unSubscribe'))
      .subscribe(data => {
        let item = (data && data.data) ? new DashboardModel(data.data) : new DashboardModel({});
        this.changeDashboard(item);
        this.onGetItemResponse(data);
      },
        error => console.log('Error ::' + error)
      );
	}

}
