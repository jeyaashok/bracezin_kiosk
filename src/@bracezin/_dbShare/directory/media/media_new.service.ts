import { Injectable, Inject,signal,EventEmitter } from '@angular/core'
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Resolve } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatDialog } from '@angular/material/dialog';

import { GlobalService, CommonService, BaseService } from 'src/@bracezin/_dbShare/general';
import { TableColumn } from 'src/@bracezin/_dbShare/utils';
import { AlertService } from 'src/@bracezin/_dbShare/alert/alert/alert.service';
import { Media,MediaModel,MediaMapModel,MediaPanelConfig,MediaPanelConfigModel } from 'src/@bracezin/_dbShare/directory/media';

@Injectable({
	providedIn: 'root',
})
@UntilDestroy()

export class MediaNewService extends BaseService implements Resolve<any> {

	config = signal<MediaPanelConfig>(new MediaPanelConfigModel({}));
	onSelectItem = signal<Media>(new MediaModel({}));

	constructor(public globalService: GlobalService,
		public commonService: CommonService,
        public alertService: AlertService,
		public dialog: MatDialog) {
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

	changeConfig(config: MediaPanelConfig = null) {
		config = (config) ? config : new MediaPanelConfigModel({});
		this.config.set(config);
	}

	onSelectItemEvent(item: Media) {
		this.onSelectItem.set(item);
	}

	addMedia(data: any = null) {
		return this.commonService.storeItem('media/add', data, true, 'optionOne');
	}
}
