import { Injectable, Inject } from '@angular/core'
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Resolve } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { GlobalService, CommonService, BaseService } from 'src/@bracezin/_dbShare/general';
import { TableColumn } from 'src/@bracezin/_dbShare/utils';
import { AlertService } from 'src/@bracezin/_dbShare/alert/alert/alert.service';
import { SubMenuModel, SubMenuMapModel } from 'src/@bracezin/_dbShare/layout/subMenu/subMenu_model.model';

@Injectable({
    providedIn: 'root',
})
@UntilDestroy()

export class SubMenuService extends BaseService implements Resolve<any> {

    constructor(public globalService: GlobalService,
        public commonService: CommonService,
        public alertService: AlertService,
        // public snackBar: MatSnackBar,
        public dialog: MatDialog) {
        super('sub-menu',
            globalService,
            commonService,
            SubMenuModel,
            SubMenuMapModel,
            alertService,
            // snackBar,
            dialog,
            null);
        this._unsubscribeAll = new Subject();
    }

}
