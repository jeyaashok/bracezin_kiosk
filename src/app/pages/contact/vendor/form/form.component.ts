import { state } from '@angular/animations';
import { Component, Input, effect, OnInit, OnChanges, OnDestroy, Output, EventEmitter, ChangeDetectorRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import worldJson from 'countrycitystatejson';

import { Vendor, VendorService, VendorModel, UserService } from 'src/@bracezin/_dbShare';

@UntilDestroy()
@Component({
	selector: 'app-vendor-form',
	templateUrl: './form.component.html',
	styleUrls: ['./form.component.scss'],
	standalone: false
})

export class FormComponent implements OnInit, OnChanges, OnDestroy {
	
	breadCrumbItems: Array<{}> = [
		{ label: 'Application' },
		{ label: 'Vendor' },
		{ label: 'Create', active: true }
	];

	sideView: string = 'view';
	@ViewChild('sideBar') public sideBar;

	dialogTitle: string = 'Create';
	@Input() action: string = 'new';
	@Output() onClose: EventEmitter<any> = new EventEmitter<any>();

	@Input() vendor: Vendor;
	form: UntypedFormGroup;
	paymentMethods: Array<string> = ['cash', 'card', 'upi', 'netbanking', 'other'];
  locationData: Record<string, unknown> = worldJson.getAll();
  countries: Array<any> = worldJson.getCountries();
  states: Array<string> = [];
  cities: Array<string> = [];

	constructor(
		public vendorService: VendorService,
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
		this.vendorService.unSubscribe();
		this.vendorService.unSubscribeFilter();
	}

	getInit() {
		this.action = (this.vendor && this.vendor.id) ? 'edit' : 'new';
		switch (this.action) {
			case 'new':
				this.dialogTitle = 'New vendor';
				break;
			case 'edit':
				this.dialogTitle = 'Edit vendor';
				break;
			default:
				break;
		}
	}

	dataInit() {
		this.vendorService.isStored.pipe(untilDestroyed(this)).subscribe((data) => { if (data && data == true) { this.closeView(); } });
		this.vendorService.isUpdated.pipe(untilDestroyed(this)).subscribe((data) => { if (data && data == true) { this.closeView(); } });
		effect(() => {
			let vendor = this.vendorService.item();
			this.vendor =  (vendor && vendor.id) ? vendor : new VendorModel({});
		});
	}

	getData() {
		this.vendorService.getAllItems();
	}

	createForm(): UntypedFormGroup {
		return this.formBuilder.group({
			name: [this.vendor?.name || null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
			email: [this.vendor?.email || null, [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(120)]],
			mobile: [this.vendor?.mobile || null, [Validators.required, Validators.minLength(8), Validators.maxLength(15)]],
			company_name: [this.vendor?.detail?.company_name || null, [Validators.minLength(3), Validators.maxLength(50)]],
			company_register_no: [this.vendor?.detail?.company_register_no || null, [Validators.minLength(1), Validators.maxLength(50)]],
			vat_number: [this.vendor?.detail?.vat_number || null, [Validators.minLength(1), Validators.maxLength(50)]],
			ein_number: [this.vendor?.detail?.ein_number || null, [Validators.minLength(1), Validators.maxLength(50)]],
			type: [this.vendor?.type || 'vendor', [Validators.required]],
			address_line1: [this.vendor?.detail?.address_line1 || null, [Validators.minLength(1), Validators.maxLength(120)]],
			address_line2: [this.vendor?.detail?.address_line2 || null, [Validators.minLength(1), Validators.maxLength(120)]],
			land_mark: [this.vendor?.detail?.landmark || null, [Validators.minLength(1), Validators.maxLength(120)]],
			city: [this.vendor?.detail?.city || null, [Validators.minLength(1), Validators.maxLength(50)]],
			state: [this.vendor?.detail?.state || null, [Validators.minLength(1), Validators.maxLength(50)]],
			country: [this.vendor?.detail?.country || null, [Validators.minLength(1), Validators.maxLength(50)]],
			pincode: [this.vendor?.detail?.pincode || null, [Validators.minLength(1), Validators.maxLength(10)]],
		});
	}

	selectVendor() {
		this.sideView = 'vendor';
		this.sideBar?.toggle();
	}

	onSelectVendor(event: any) {
		const vendor = event.data;
		this.vendor = vendor;
		this.sideView = 'view';
		this.sideBar?.toggle();
	}

	cancel() {
		this.vendor = new VendorModel({});
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
			this.update(this.vendor);
		}
	}

	create() {
		this.vendorService.store(this.form.value);
	}

	update(vendor: Vendor) {
		this.vendorService.update(vendor.id, this.form.value);
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
