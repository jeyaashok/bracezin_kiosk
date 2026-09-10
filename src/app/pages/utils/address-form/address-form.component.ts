import { Component, Input, effect, OnInit, OnChanges, OnDestroy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { Address, AddressModel, AddressService, User } from 'src/@bracezin/_dbShare';
import { ConfirmComponent } from '@bracezin/components/confirm/confirm.component';
import worldJson from 'countrycitystatejson';

@UntilDestroy()
@Component({
	selector: 'utils-address-form',
	templateUrl: './address-form.component.html',
	styleUrls: ['./address-form.component.scss'],
	standalone: false
})

export class AddressFormComponent implements OnInit, OnChanges, OnDestroy {

	@Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>(null);

	@Input() item: Address = null;
	@Input() user!: User;

  isTouched: boolean = false;
  dialogTitle: string = 'New Delivery Address';
  action: string = 'new';

	form: UntypedFormGroup;
	locationData: Record<string, unknown> = worldJson.getAll();
	countries: Array<any> = worldJson.getCountries();
	states: Array<string> = [];
	cities: Array<string> = [];

	constructor(
		public addressService: AddressService,
		private formBuilder: UntypedFormBuilder,
		private matDialog: MatDialog,
		private cd: ChangeDetectorRef) {
		this.dataInit();
		this.form = this.createForm();
	}

	ngOnInit(): void { }

	ngOnChanges() {
		this.isTouched = false;
	}

	ngOnDestroy(): void { }

	dataInit() {
		this.addressService.isStored.pipe(untilDestroyed(this)).subscribe(data => {
			if (data) { this.closeView(); }
		});
		this.addressService.isUpdated.pipe(untilDestroyed(this)).subscribe(data => {
			if (data) { this.closeView(); }
		});
		effect(() => {
			let item = this.addressService.item();
			if (item) { 
				this.item = item; 
				this.form = this.createForm();
			}
		});
	}

  getInit() {
		this.action = (this.item && this.item.id) ? 'edit' : 'new';
		switch (this.action) {
			case 'new':
				this.dialogTitle = 'New Delivery Address';
				break;
			case 'edit':
				this.dialogTitle = 'Update Delivery Address';
				break;
			default:
				break;
		}
	}

	closeView() {
		this.onClose.emit(true);
	}

	createForm(): UntypedFormGroup {
		return this.formBuilder.group({
			user_id: [this.user?.id || null, [Validators.required]],
			title: [this.item?.title || null, [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
			door_no: [this.item?.door_no || null, [Validators.minLength(1), Validators.maxLength(50)]],
			line_1: [this.item?.line_1 || null, [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
			line_2: [this.item?.line_2 || null, [Validators.minLength(1), Validators.maxLength(100)]],
			landmark: [this.item?.landmark || null, [Validators.minLength(1), Validators.maxLength(100)]],
			city: [this.item?.city || null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
			state: [this.item?.state || null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
			region: [this.item?.region || null, [Validators.minLength(1), Validators.maxLength(50)]],
			country: [this.item?.country || null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
			pincode: [this.item?.pincode || null, [Validators.required, Validators.minLength(1), Validators.maxLength(15)]],
		});
	}

	save() {
		let saveData: any = this.form.value;
		this.addressService.store(saveData);
	}

	update(item: Address) {
		let updateData: any = this.form.value;
		updateData.id = item.id;
		this.addressService.update(item.id, updateData);
	}

	onCountryChange(country: string) {
		let currentCountry = this.countries.find(c => c.name === country);
		let countryShortName = currentCountry?.shortName;
		const selectedCountry = this.locationData[countryShortName] ? countryShortName : null;
		this.states = selectedCountry ? (worldJson.getStatesByShort(countryShortName) ?? []) : [];

		const currentState = this.form?.get('state')?.value;
		const keepState = !!currentState && this.states.includes(currentState);
		this.form?.patchValue({
			state: keepState ? currentState : null,
			city: null
		}, { emitEvent: false });

		this.cities = keepState && selectedCountry ? (worldJson.getCities(countryShortName, currentState) ?? []) : [];
	}

	onStateChange(state: string) {
		const selectedCountry = this.getSelectedCountry();
		const selectedState = selectedCountry && this.states.includes(state) ? state : null;
		this.cities = selectedCountry && selectedState ? (worldJson.getCities(selectedCountry, selectedState) ?? []) : [];

		const currentCity = this.form?.get('city')?.value;
		if (currentCity && !this.cities.includes(currentCity)) {
			this.form?.patchValue({ city: null }, { emitEvent: false });
		}
	}

	private getSelectedCountry(): string | null {
		const country = this.form?.get('country')?.value;
		const currentCountry = this.countries.find(c => c.name === country);
		const countryShortName = currentCountry?.shortName;
		return countryShortName && this.locationData[countryShortName] ? countryShortName : null;
	}

	private getSelectedState(): string | null {
		const state = this.form?.get('state')?.value;
		return state && this.states.includes(state) ? state : null;
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
