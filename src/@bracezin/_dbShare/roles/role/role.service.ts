import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Resolve } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Subject } from 'rxjs';

import { AlertService } from 'src/@bracezin/_dbShare/alert/alert/alert.service';
import { BaseService, CommonService, GlobalService } from 'src/@bracezin/_dbShare/general';
import { Role, RoleModel, RoleMapModel } from 'src/@bracezin/_dbShare/roles/role';

@Injectable({
	providedIn: 'root',
})
@UntilDestroy()
export class RoleService extends BaseService implements Resolve<any> {
	assignTorole(
		add: { team_id: any; user_id: any },
		arg1: string,
		role: Role,
		agentId: any
	) {
		throw new Error('Method not implemented.');
	}
	constructor(
		public globalService: GlobalService,
		public commonService: CommonService,
		public alertService: AlertService,
		public dialog: MatDialog) {
		super('role',
			globalService,
			commonService,
			RoleModel,
			RoleMapModel,
			alertService,
			// snackBar,
			dialog,
			null
		);
		this._unsubscribeAll = new Subject();
	}

}
