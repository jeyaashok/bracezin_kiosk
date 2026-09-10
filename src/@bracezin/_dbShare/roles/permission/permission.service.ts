import { Injectable, Inject, signal } from '@angular/core'
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Resolve } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { GlobalService, CommonService, BaseService } from 'src/@bracezin/_dbShare/general';
import { TableColumn } from 'src/@bracezin/_dbShare/utils';
import { AlertService } from 'src/@bracezin/_dbShare/alert/alert/alert.service';
import { Permission, PermissionModel, PermissionMapModel } from 'src/@bracezin/_dbShare/roles/permission';

@Injectable({
	providedIn: 'root',
})
@UntilDestroy()

export class PermissionService extends BaseService implements Resolve<any> {

	modules = signal<any>([]);
	userRoles = signal<any>([]);

	constructor(public globalService: GlobalService,
		public commonService: CommonService,
		public alertService: AlertService,
		// public snackBar: MatSnackBar,
		public dialog: MatDialog) {
		super('permission',
			globalService,
			commonService,
			PermissionModel,
			PermissionMapModel,
			alertService,
			// snackBar,
			dialog,
			'optionOne');
		this._unsubscribeAll = new Subject();
	}

	changeModules(modules: Array<any>) {
		this.modules.set(modules);
	}

	onGetAllItemsResponse(response: any, input: any = null) {
		let userRoles = (response && response.data && response.data.user_roles) ? response.data.user_roles : null;
		if (userRoles && userRoles.length > 0) {
			this.userRoles.set(userRoles);
		} else {
			this.userRoles.set([]);
		}
	}
}
