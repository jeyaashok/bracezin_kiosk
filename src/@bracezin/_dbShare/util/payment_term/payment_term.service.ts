import { Injectable, Inject, signal } from '@angular/core'
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Resolve } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { GlobalService, CommonService, BaseService } from 'src/@bracezin/_dbShare/general';
import { TableColumn } from 'src/@bracezin/_dbShare/utils';
import { AlertService } from 'src/@bracezin/_dbShare/alert/alert/alert.service';
import { PaymentTerm, PaymentTermModel, PaymentTermMapModel } from 'src/@bracezin/_dbShare/util/payment_term';
import { DatePipe } from '@angular/common';
import moment from 'moment';

@Injectable({
	providedIn: 'root',
})
@UntilDestroy()

export class PaymentTermService extends BaseService implements Resolve<any> {

	defaultParams: any = {
		'paginate': 25,
		'page': 1,
		'limit': 25,
		'current': 1,
		'order': 'id|desc',
		'search': null,
	};

	constructor(public globalService: GlobalService,
		public commonService: CommonService,
		public alertService: AlertService,
		// public snackBar: MatSnackBar,
		public datepipe: DatePipe,
		public dialog: MatDialog) {
		super('payment-term',
			globalService,
			commonService,
			PaymentTermModel,
			PaymentTermMapModel,
			alertService,
			// snackBar,
			dialog,
			null);
			this.changeParams(this.defaultParams);
			this._unsubscribeAll = new Subject();
	}

}
