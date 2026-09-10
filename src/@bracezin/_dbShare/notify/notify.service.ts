import { Injectable, Inject } from '@angular/core'
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Resolve } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { GlobalService, CommonService, BaseService } from 'src/@bracezin/_dbShare/general';
import { TableColumn } from 'src/@bracezin/_dbShare/utils';
import { AlertService } from 'src/@bracezin/_dbShare/alert/alert/alert.service';
import { Notify, NotifyModel, NotifyMapModel } from 'src/@bracezin/_dbShare/notify';
import { UnreadCount } from './unreadCount.interface';
import { UnreadCountModel } from './unreadCount_model.model';

@Injectable({
	providedIn: 'root',
})
@UntilDestroy()

export class NotifyService extends BaseService implements Resolve<any> {

    private unreadCountsSource = new BehaviorSubject<UnreadCount[]>([]);
    unreadCounts = this.unreadCountsSource.asObservable();

	constructor(public globalService: GlobalService,
		public commonService: CommonService,
        public alertService: AlertService,
        // public snackBar: MatSnackBar,
		public dialog: MatDialog) {
		super('notify',
			globalService,
			commonService,
			NotifyModel,
			NotifyMapModel,
			alertService,
            // snackBar,
            dialog,
            null);
		this._unsubscribeAll = new Subject();
	}

    changeUnreadCounts(allCounts: UnreadCount[]) {
        this.unreadCountsSource.next(allCounts);
    }

    increment(site:string, name: string) {
        // let unreadCounts = [];
        // this.unreadCounts.pipe(untilDestroyed(this, 'unSubscribe')).subscribe(data => unreadCounts = data);
        // if (unreadCounts && unreadCounts.length > 0) {
        //     for (var i = 0; i < unreadCounts.length; ++i) {
        //         if (unreadCounts[i].site.toLowerCase() === site.toLowerCase() &&
        //             unreadCounts[i].name.toLowerCase() === name.toLowerCase()) {
        //             unreadCounts[i].count++;
        //         }
        //     }
        // }
        // this.changeAllItems(unreadCounts);
        return;
    }

    decrement(site:string, name: string) {
        // let unreadCounts = [];
        // this.unreadCounts.pipe(untilDestroyed(this, 'unSubscribe')).subscribe(data => unreadCounts = data);
        // if (unreadCounts && unreadCounts.length > 0) {
        //     for (var i = 0; i < unreadCounts.length; ++i) {
        //         if (unreadCounts[i].site.toLowerCase() === site.toLowerCase() &&
        //             unreadCounts[i].name.toLowerCase() === name.toLowerCase()) {
        //             unreadCounts[i].count--;
        //             if(unreadCounts[i].count < 0) { unreadCounts[i].count = 0; }
        //         }
        //     }
        // }
        // this.changeAllItems(unreadCounts);
        return;
    }
}
