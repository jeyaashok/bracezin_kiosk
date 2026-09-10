import { state } from '@angular/animations';
import { Component, Input, effect, OnInit, OnChanges, OnDestroy, Output, EventEmitter, ChangeDetectorRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import worldJson from 'countrycitystatejson';

import { Customer, CustomerService, CustomerModel, UserService } from 'src/@bracezin/_dbShare';

@UntilDestroy()
@Component({
	selector: 'app-customer-form',
	templateUrl: './form.component.html',
	styleUrls: ['./form.component.scss'],
	standalone: false
})

export class FormComponent implements OnInit, OnChanges, OnDestroy {
	
	breadCrumbItems: Array<{}> = [
		{ label: 'Application' },
		{ label: 'Customer' },
		{ label: 'Create', active: true }
	];

	sideView: string = 'view';
	@ViewChild('sideBar') public sideBar;

	dialogTitle: string = 'Create';
	@Input() action: string = 'new';
	@Output() onClose: EventEmitter<any> = new EventEmitter<any>();

	@Input() customer: Customer;
	form: UntypedFormGroup;
	paymentMethods: Array<string> = ['cash', 'card', 'upi', 'netbanking', 'other'];
	locationData: Record<string, unknown> = worldJson.getAll();
	countries: Array<any> = worldJson.getCountries();
	states: Array<string> = [];
	cities: Array<string> = [];

	constructor(
		public customerService: CustomerService,
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
		this.customerService.unSubscribe();
		this.customerService.unSubscribeFilter();
	}

	getInit() {
		this.action = (this.customer && this.customer.id) ? 'edit' : 'new';
		switch (this.action) {
			case 'new':
				this.dialogTitle = 'New customer';
				break;
			case 'edit':
				this.dialogTitle = 'Edit customer';
				break;
			default:
				break;
		}
	}

	dataInit() {
		this.customerService.isStored.pipe(untilDestroyed(this)).subscribe((data) => { if (data && data == true) { this.closeView(); } });
		this.customerService.isUpdated.pipe(untilDestroyed(this)).subscribe((data) => { if (data && data == true) { this.closeView(); } });
		effect(() => {
			let customer = this.customerService.item();
			this.customer =  (customer && customer.id) ? customer : new CustomerModel({});
      this.getInit();
		});
	}

	getData() {
		this.customerService.getAllItems();
	}

	createForm(): UntypedFormGroup {
		return this.formBuilder.group({
			name: [this.customer?.name || null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
			email: [this.customer?.email || null, [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(120)]],
			mobile: [this.customer?.mobile || null, [Validators.required, Validators.minLength(8), Validators.maxLength(15)]],
			company_name: [this.customer?.detail?.company_name || null, [Validators.minLength(1), Validators.maxLength(50)]],
			company_register_no: [this.customer?.detail?.company_register_no || null, [Validators.minLength(1), Validators.maxLength(50)]],
			vat_number: [this.customer?.detail?.vat_number || null, [Validators.minLength(1), Validators.maxLength(50)]],
			ein_number: [this.customer?.detail?.ein_number || null, [Validators.minLength(1), Validators.maxLength(50)]],
			type: [this.customer?.type || 'customer', [Validators.required]],
			address_line1: [this.customer?.detail?.address_line1 || null, [Validators.minLength(1), Validators.maxLength(120)]],
			address_line2: [this.customer?.detail?.address_line2 || null, [Validators.minLength(1), Validators.maxLength(120)]],
			land_mark: [this.customer?.detail?.landmark || null, [Validators.minLength(1), Validators.maxLength(120)]],
			city: [this.customer?.detail?.city || null, [Validators.minLength(1), Validators.maxLength(50)]],
			state: [this.customer?.detail?.state || null, [Validators.minLength(1), Validators.maxLength(50)]],
			country: [this.customer?.detail?.country || null, [Validators.minLength(1), Validators.maxLength(50)]],
			pincode: [this.customer?.detail?.pincode || null, [Validators.minLength(1), Validators.maxLength(10)]],
		});
	}

	selectCustomer() {
		this.sideView = 'customer';
		this.sideBar?.toggle();
	}

	onSelectCustomer(event: any) {
		const customer = event.data;
		this.customer = customer;
		this.sideView = 'view';
		this.sideBar?.toggle();
	}

	cancel() {
		this.customer = new CustomerModel({});
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
			this.update(this.customer);
		}
	}

	create() {
		this.customerService.store(this.form.value);
	}

	update(customer: Customer) {
		this.customerService.update(customer.id, this.form.value);
	}

	closeView() {
		if (this.action === 'edit') {
			this.form = this.createForm();
		}
		this.refreshForm();
		this.onClose.emit();
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
