import { state } from '@angular/animations';
import { Component, Input, effect, OnInit, OnChanges, OnDestroy, Output, EventEmitter, ChangeDetectorRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { email } from '@angular/forms/signals';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { start } from '@popperjs/core';
import { ei } from 'node_modules/@fullcalendar/core/internal-common';

import { FinancialYear, FinancialYearService, FinancialYearModel, UserService } from 'src/@bracezin/_dbShare';

@UntilDestroy()
@Component({
	selector: 'app-financial-year-form',
	templateUrl: './form.component.html',
	styleUrls: ['./form.component.scss'],
	standalone: false
})

export class FormComponent implements OnInit, OnChanges, OnDestroy {
	
	breadCrumbItems: Array<{}> = [
		{ label: 'Account' },
		{ label: 'Tools' },
		{ label: 'Financial Year' },
		{ label: 'Create', active: true }
	];

	sideView: string = 'view';
	@ViewChild('sideBar') public sideBar;

	dialogTitle: string = 'Create';
	@Input() action: string = 'new';
	@Output() onClose: EventEmitter<any> = new EventEmitter<any>();

	@Input() financialYear: FinancialYear;
	form: UntypedFormGroup;
	paymentMethods: Array<string> = ['cash', 'card', 'upi', 'netbanking', 'other'];

	constructor(
		public financialYearService: FinancialYearService,
		public userService: UserService,
		private formBuilder: UntypedFormBuilder,
		private cd: ChangeDetectorRef) {
			this.getInit();
			this.dataInit();
			this.getData();
	}

	ngOnInit(): void { }

	ngOnChanges() {
		this.form = this.createForm();
	}

	ngOnDestroy(): void {
		this.financialYearService.unSubscribe();
		this.financialYearService.unSubscribeFilter();
	}

	getInit() {
		this.action = (this.financialYear && this.financialYear.id) ? 'edit' : 'new';
		switch (this.action) {
			case 'new':
				this.dialogTitle = 'New Financial Year';
				break;
			case 'edit':
				this.dialogTitle = 'Edit Financial Year';
				break;
			default:
				break;
		}
	}

	dataInit() {
		this.financialYearService.isStored.pipe(untilDestroyed(this)).subscribe((data) => { if (data && data == true) { this.closeView(); } });
		this.financialYearService.isUpdated.pipe(untilDestroyed(this)).subscribe((data) => { if (data && data == true) { this.closeView(); } });
		effect(() => {
			let financialYear = this.financialYearService.item();
			this.financialYear =  (financialYear && financialYear.id) ? financialYear : new FinancialYearModel({});
		});
	}

	getData() {
		this.financialYearService.getAllItems();
	}

	createForm(): UntypedFormGroup {
		return this.formBuilder.group({
			name: [this.financialYear?.name || null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
			start_date: [this.financialYear?.start_date || null, [Validators.required]],
			end_date: [this.financialYear?.end_date || null, [Validators.required]],
			description: [this.financialYear?.description || null, [Validators.maxLength(200)]],
			is_active: [this.financialYear?.is_active || true, [Validators.required]],
		});
	}

	selectFinancialYear() {
		this.sideView = 'financialYear';
		this.sideBar?.toggle();
	}

	onSelectFinancialYear(event: any) {
		const financialYear = event.data;
		this.financialYear = financialYear;
		this.sideView = 'view';
		this.sideBar?.toggle();
	}

	cancel() {
		this.financialYear = new FinancialYearModel({});
	}

	imageHandler(event: any) {
		const file = (event.target as HTMLInputElement).files![0];
		const reader = new FileReader();
		reader.onload = () => {
			(document.getElementById('member-img') as HTMLImageElement).src = reader.result as string;
		};
		reader.readAsDataURL(file);
	}

	save() {
		if (this.action === 'new') {
			this.create();
		} else if (this.action === 'edit') {
			this.update(this.financialYear);
		}
	}

	create() {
		this.financialYearService.store(this.financialYear);
	}

	update(financialYear: FinancialYear) {
		this.financialYearService.update(financialYear.id, financialYear);
	}

	closeView() {
		if (this.action === 'edit') {
			this.form = this.createForm();
		}
		this.refreshForm();
		this.onClose.emit();
	}

	refreshForm() {
		this.form.setErrors(null);
		this.form.markAsPristine();
		this.form.markAsPending();
		this.form.markAsUntouched();
		Object.keys(this.form.controls).forEach((key) => {
			const control = this.form.controls[key];
			control.setErrors(null);
		});
		this.cd.markForCheck();
	}
}