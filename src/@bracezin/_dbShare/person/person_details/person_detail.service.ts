import { Injectable, Inject } from '@angular/core'
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Resolve } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { GlobalService, CommonService, BaseService } from 'src/@bracezin/_dbShare/general';
import { TableColumn } from 'src/@bracezin/_dbShare/utils';
import { AlertService } from 'src/@bracezin/_dbShare/alert/alert/alert.service';
import { PersonDetail, PersonDetailModel, PersonDetailMapModel } from 'src/@bracezin/_dbShare/person/person_details';

@Injectable({
	providedIn: 'root',
})
@UntilDestroy()

export class PersonDetailService extends BaseService implements Resolve<any> {

	constructor(public globalService: GlobalService,
		public commonService: CommonService,
        public alertService: AlertService,
        // public snackBar: MatSnackBar,
		public dialog: MatDialog) {
		super('person-detail',
			globalService,
			commonService,
			PersonDetailModel,
			PersonDetailMapModel,
			alertService,
            // snackBar,
            dialog,
            null);
		this._unsubscribeAll = new Subject();
	}

    updateDetail(id: number, data: any) {
        this.commonService.storeItem('peoplen/addPeopleDetails', data, true, 'optionOne')
            .pipe(untilDestroyed(this, 'unSubscribe'))
            .subscribe((data: any) => {
                if (data && data.success) {
                    this.isUpdated.emit(true);
                } else {
                    this.isUpdated.emit(false);
                    this.alertService.webErrorShow(data);
                }
            }, error => {
                this.isUpdated.emit(false);
                console.log('Error ::' + error);
                this.alert('Danger', 'Something Wrong. Try after Sometimes !!!');
            });
    }

}
