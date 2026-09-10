import { Injectable, Inject } from '@angular/core'
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Resolve } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { GlobalService, CommonService, BaseService } from 'src/@bracezin/_dbShare/general';
import { TableColumn } from 'src/@bracezin/_dbShare/utils';
import { AlertService } from 'src/@bracezin/_dbShare/alert/alert/alert.service';
import { MenuGroupModel, MenuGroupMapModel } from 'src/@bracezin/_dbShare/layout/menuGroup/menuGroup_model.model';

@Injectable({
    providedIn: 'root',
})
@UntilDestroy()

export class MenuGroupService extends BaseService implements Resolve<any> {

    constructor(public globalService: GlobalService,
        public commonService: CommonService,
        public alertService: AlertService,
        // public snackBar: MatSnackBar,
        public dialog: MatDialog) {
        super('menu-group',
            globalService,
            commonService,
            MenuGroupModel,
            MenuGroupMapModel,
            alertService,
            // snackBar,
            dialog,
            null);
        this._unsubscribeAll = new Subject();
    }

}
