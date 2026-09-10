import { Component, inject, OnInit, OnDestroy, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoadingService } from 'src/@bracezin/_dbShare';

export interface Button {
	title: string;
	icon?: string;
	color?: string;
}

@Component({
	selector: 'lib-norecord',
	templateUrl: './norecord.component.html',
	styleUrls: ['./norecord.component.scss'],
	standalone: true,
	imports: [CommonModule, FlexLayoutModule, MatButtonModule, MatIconModule]
})

export class NoRecordComponent implements OnInit, OnDestroy {

	private loadingService = inject(LoadingService);

	@Input() icon: string = 'default';
	@Input() title: string = 'No Records';
	@Input() subTitle: string = 'No Records Founded, Please try after sometimes...';

	@Input() addButton: Button = null;
	@Input() showAddButton: boolean = true;
	@Output() addNew = new EventEmitter();

	@Input() backButton: Button = null;
	@Input() showBackButton: boolean = true;
	@Output() back = new EventEmitter();

	@Input() showLoader: boolean = true;
	loader: boolean = false;
	private _unsubscribeAll: Subject<any> = new Subject<any>();

	constructor() {
		this.getInit();
	}

	ngOnInit() { }

	ngOnDestroy(): void {
		// Unsubscribe from all subscriptions
		this._unsubscribeAll.next(null);
		this._unsubscribeAll.complete();
	}

	getInit() {
		this.loadingService.show$
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((value) => {
				let loader = (value && (value === true || value === 'true' || value === 'TRUE' || value === 'True' || value > 0 || value === '1')) ? true : false;
				this.loader = (this.showLoader) ? loader : false;
			});
	}

}
