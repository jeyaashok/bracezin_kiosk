import { Component, Input, effect, OnInit, OnChanges, OnDestroy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { Address, AddressModel, AddressService, User } from 'src/@bracezin/_dbShare';
import { ConfirmComponent } from '@bracezin/components/confirm/confirm.component';
import worldJson from 'countrycitystatejson';

@UntilDestroy()
@Component({
	selector: 'utils-address-list',
	templateUrl: './address-list.component.html',
	styleUrls: ['./address-list.component.scss'],
	standalone: false
})

export class AddressListComponent implements OnInit, OnChanges, OnDestroy {

	@Output() onSelect: EventEmitter<any> = new EventEmitter<any>(null);
	@Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>(null);
	param: any;
	itemsAll: Address[] = [];
	items: Address[] = [];
	item: Address = null;

	@Input() enableSelect: boolean = false;
	@Input() itemIds: Array<any> = [];
	selectedItem: Address = null;

	@Input() enableReset: boolean = false;
	@Input() enableMultiSelect: boolean = false;
	@Input() selectedItems: Array<any> = [];
	@Input() newSelectedItems: Array<any> = [];
	@Output() onMultiSelect: EventEmitter<any> = new EventEmitter<any>(null);
	isTouched: boolean = false;

	@Input() user!: User;
	@Input() onSync: boolean = false;
	viewMode: string = 'list';

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

	ngOnInit(): void {
		this.viewMode = 'list';
		this.getData();
		this.searchClear();
	}

	ngOnChanges() {
		this.viewMode = 'list';
		this.newSelectedItems = [];
		this.isTouched = false;
		if (this.onSync == true) {
			this.getData();
		}
	}

	ngOnDestroy(): void {
		this.searchClear();
	}

	dataInit() {
		this.addressService.resetParams();
		this.addressService.params.pipe(untilDestroyed(this)).subscribe(data => this.param = data);
		this.addressService.isStored.pipe(untilDestroyed(this)).subscribe(data => {
			if (data) { this.viewMode = 'list'; }
		});
		this.addressService.isUpdated.pipe(untilDestroyed(this)).subscribe(data => {
			if (data) {
				this.viewMode = 'list'; 
			}
		});
		this.addressService.filterColumns.set(['name', 'email', 'mobile']);
		effect(() => {
			let items = this.addressService.filteredLibraries();
			this.items = this.filterItems(items);
			this.itemsAll = this.items;
			let item = this.addressService.item();
			if (item) { 
				this.item = item; 
				this.form = this.createForm();
			}
		});
	}

	getData() {
		this.searchClear();
		this.addressService.resetParams();
		this.param["search"] = null;
		this.param.limit = 200;
		this.param.paginate = 200;
		this.param.user_id = this.user?.id ?? null;
		this.addressService.changeAllItems([]);
		this.addressService.getAllItems();
	}

	filterItems(items: Address[]): Address[] {
		let output: Address[] = items;
		if (items && items.length > 0) {
				output = items;
		}
		return output;
	}

	onReset() {
		this.onSelect.emit({ 'status': true, 'data': null });
	}

	isSelected(item: Address): boolean {
		let output: boolean = false;
		if (this.itemIds && this.itemIds.length > 0 && item && item.id && this.itemIds.includes(Number(item.id))) {
			output = true;
		}
		return output;
	}

	isMultiSelected(item: Address): boolean {
		let output: boolean = false;
		let selectedItems = (this.newSelectedItems && this.newSelectedItems.length > 0) ? this.newSelectedItems : this.selectedItems;
		if (this.enableMultiSelect && item && item.id && selectedItems && selectedItems.length > 0 && selectedItems.includes(item.id)) {
			output = true;
		}
		return output;
	}

	chooseItem(item: Address, status: boolean = true) {
		if (!this.enableMultiSelect) {
			this.selectedItem = item;
			if (this.enableSelect) {
				this.onSelect.emit({ 'status': status, 'data': item });
			}
		} else {
			if (!this.isTouched) {
				this.newSelectedItems = this.selectedItems;
				this.isTouched = true;
			}
			if (status) {
				this.newSelectedItems.push(item.id);
			} else {
				this.newSelectedItems.splice(this.newSelectedItems.indexOf(item.id), 1);
			}
		}
	}

	/* Temporary search function */
	searchItemData(searchData) {
		var filterData = [];
		var itemDataSearch: any = [];
		var filterInteractiveKeys = ['name']
		itemDataSearch = this.itemsAll;
		if (searchData === '') {
			filterData = null;
			itemDataSearch = this.itemsAll;
			this.items = itemDataSearch;
		} else {
			if (itemDataSearch.length > 0) {
				for (let i = 0; i < itemDataSearch.length; i++) {
					if (filterInteractiveKeys.length > 0) {
						filterInteractiveKeys.forEach((key) => {
							if (typeof itemDataSearch[i][key] === 'string' && typeof searchData === 'string') {
								if (itemDataSearch[i][key].toLowerCase().indexOf(searchData.toLowerCase()) > -1) {
									const found = filterData.some(el => el._id === itemDataSearch[i]._id);
									if (!found) {
										filterData.push(itemDataSearch[i]);
									}
								}
							}
						});
					} else {
						if (itemDataSearch[i].name.toLowerCase().indexOf(searchData.toLowerCase()) > -1) {
							filterData.push(itemDataSearch[i]);
						}
					}
				}
			}
			this.items = filterData;
		}
	}

	searchClear() {
		this.items = this.itemsAll;
		this.addressService.allSearchItems.set(null);
	}

	canUpdateMultiSelect(): boolean {
		let output: boolean = false;
		output = (this.enableMultiSelect && this.isTouched) ? true : false;
		return output;
	}

	doMultiSelect() {
		if (this.enableMultiSelect && this.isTouched) {
			this.onMultiSelect.emit({ 'status': true, 'data': this.newSelectedItems });
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

	addItem() {
		this.addressService.changeItem(new AddressModel({'user_id': this.user?.id}));
		this.viewMode = 'form';
	}

	editItem(item: Address) {
		this.addressService.changeItem(item);
		this.viewMode = 'form';
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
	
	delete(address: Address): void {
		let dialogRef = this.matDialog.open(ConfirmComponent, {
			disableClose: false,
			width: '600px',
			data: {
				type: 'delete',
				title: 'Delete Address  !!!',
				message: 'Are you sure you want to delete this Address ?',
				item: address
			}
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result && result.data === true) {
				this.addressService.destroy(address.id);
			}
		});
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

	closeForm() {
		this.viewMode = 'list';
		this.addressService.changeItem(null);
		this.refreshForm();
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
