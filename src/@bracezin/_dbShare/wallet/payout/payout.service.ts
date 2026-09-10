import { Injectable, Inject, signal } from '@angular/core'
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Resolve } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { GlobalService, CommonService, BaseService } from 'src/@bracezin/_dbShare/general';
import { TableColumn } from 'src/@bracezin/_dbShare/utils';
import { AlertService } from 'src/@bracezin/_dbShare/alert/alert/alert.service';
import { Payout, PayoutModel, PayoutMapModel } from 'src/@bracezin/_dbShare/wallet/payout';
import { DatePipe } from '@angular/common';
import moment from 'moment';

@Injectable({
	providedIn: 'root',
})
@UntilDestroy()

export class PayoutService extends BaseService implements Resolve<any> {

	constructor(public globalService: GlobalService,
		public commonService: CommonService,
		public alertService: AlertService,
		// public snackBar: MatSnackBar,
		public datepipe: DatePipe,
		public dialog: MatDialog) {
		super('payout',
			globalService,
			commonService,
			PayoutModel,
			PayoutMapModel,
			alertService,
			// snackBar,
			dialog,
			null);
		this._unsubscribeAll = new Subject();
	}

}
