import { Component, Input, effect, OnInit, OnChanges, OnDestroy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { Role, RoleService, UserService } from 'src/@bracezin/_dbShare';

@UntilDestroy()
@Component({
	selector: 'app-role-form',
	templateUrl: './form.component.html',
	styleUrls: ['./form.component.scss'],
	standalone: false
})

export class FormComponent implements OnInit, OnChanges, OnDestroy {

	dialogTitle: string = 'Create';
	@Input() action: string = 'new';
	@Output() onClose: EventEmitter<any> = new EventEmitter<any>();

	@Input() role: Role;
	form: UntypedFormGroup;

	constructor(
		public roleService: RoleService,
		public userService: UserService,
		private formBuilder: UntypedFormBuilder,
		private cd: ChangeDetectorRef) {
		this.getInit();
		this.dataInit();
	}

	ngOnInit(): void {
		this.dataInit();
	}

	ngOnChanges() {
		this.getData();
		this.getInit();
		this.form = this.createForm();
	}

	ngOnDestroy(): void {
		this.roleService.unSubscribe();
		this.roleService.unSubscribeFilter();
	}

	getInit() {
		this.action = (this.role && this.role.id) ? 'edit' : 'new';
		switch (this.action) {
			case 'new':
				this.dialogTitle = 'New Role';
				break;
			case 'edit':
				this.dialogTitle = 'Edit Role';
				break;
			default:
				break;
		}
	}

	getData() {
		this.roleService.getAllItems();
	}

	dataInit() {
		this.roleService.isStored.pipe(untilDestroyed(this)).subscribe((data) => { if (data && data == true) { this.closeView(); } });
		this.roleService.isUpdated.pipe(untilDestroyed(this)).subscribe((data) => { if (data && data == true) { this.closeView(); } });
		effect(() => {
			this.role = this.roleService.item();
		});
	}

	createForm(): UntypedFormGroup {
		return this.formBuilder.group({
			name: [this.role?.name || null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
			guard_name: [this.role?.guard_name || 'admin', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
		});
	}

	create() {
		this.roleService.store(this.form.value);
	}

	update(role: Role) {
		let updateData: any = this.form.value;
		updateData.id = role.id;
		this.roleService.update(role.id, this.form.value);
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
