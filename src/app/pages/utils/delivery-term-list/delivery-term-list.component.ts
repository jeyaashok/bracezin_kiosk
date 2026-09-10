import { Component, Input, effect, OnInit, OnChanges, OnDestroy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import worldJson from 'countrycitystatejson';

import { DeliveryTerm, DeliveryTermModel, DeliveryTermService, User } from 'src/@bracezin/_dbShare';
import { ConfirmComponent } from '@bracezin/components/confirm/confirm.component';

@UntilDestroy()
@Component({
	selector: 'utils-delivery-term-list',
	templateUrl: './delivery-term-list.component.html',
	styleUrls: ['./delivery-term-list.component.scss'],
	standalone: false
})

export class DeliveryTermListComponent implements OnInit, OnChanges, OnDestroy {

	@Output() onSelect: EventEmitter<any> = new EventEmitter<any>(null);
	@Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>(null);
	param: any;
	itemsAll: DeliveryTerm[] = [];
	items: DeliveryTerm[] = [];
	item: DeliveryTerm = null;

	@Input() enableSelect: boolean = false;
	@Input() itemIds: Array<any> = [];
	selectedItem: DeliveryTerm = null;

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
	types: Array<any> = [
		{ 'id': 'standard', 'name': 'Standard' },
		{ 'id': 'express', 'name': 'Express' },
		{ 'id': 'same_day', 'name': 'Same Day' },
		{ 'id': 'next_day', 'name': 'Next Day' },
		{ 'id': 'other', 'name': 'Other' },
	];
  locationData: Record<string, unknown> = worldJson.getAll();
  countries: Array<any> = worldJson.getCountries();
  states: Array<string> = [];
  cities: Array<string> = [];

	constructor(
		public deliveryTermService: DeliveryTermService,
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
		this.deliveryTermService.resetParams();
		this.deliveryTermService.params.pipe(untilDestroyed(this)).subscribe(data => this.param = data);
		this.deliveryTermService.isStored.pipe(untilDestroyed(this)).subscribe(data => {
			if (data) { this.viewMode = 'list'; }
		});
		this.deliveryTermService.isUpdated.pipe(untilDestroyed(this)).subscribe(data => {
			if (data) {
				this.viewMode = 'list'; 
			}
		});
		this.deliveryTermService.filterColumns.set(['name', 'email', 'mobile']);
		effect(() => {
			let items = this.deliveryTermService.filteredLibraries();
			this.items = this.filterItems(items);
			this.itemsAll = this.items;
			let item = this.deliveryTermService.item();
			if (item) { 
				this.item = item; 
				this.form = this.createForm();
			}
		});
	}

	getData() {
		this.searchClear();
		this.deliveryTermService.resetParams();
		this.param["search"] = null;
		this.param.limit = 200;
		this.param.paginate = 200;
		this.param.user_id = this.user?.id ?? null;
		this.deliveryTermService.changeAllItems([]);
		this.deliveryTermService.getAllItems();
	}

	filterItems(items: DeliveryTerm[]): DeliveryTerm[] {
		let output: DeliveryTerm[] = items;
		if (items && items.length > 0) {
				output = items;
		}
		return output;
	}

	onReset() {
		this.onSelect.emit({ 'status': true, 'data': null });
	}

	isSelected(item: DeliveryTerm): boolean {
		let output: boolean = false;
		if (this.itemIds && this.itemIds.length > 0 && item && item.id && this.itemIds.includes(Number(item.id))) {
			output = true;
		}
		return output;
	}

	isMultiSelected(item: DeliveryTerm): boolean {
		let output: boolean = false;
		let selectedItems = (this.newSelectedItems && this.newSelectedItems.length > 0) ? this.newSelectedItems : this.selectedItems;
		if (this.enableMultiSelect && item && item.id && selectedItems && selectedItems.length > 0 && selectedItems.includes(item.id)) {
			output = true;
		}
		return output;
	}

	chooseItem(item: DeliveryTerm, status: boolean = true) {
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
		this.deliveryTermService.allSearchItems.set(null);
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
			code: [this.item?.code || null, [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
			name: [this.item?.name || null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
			description: [this.item?.description || null, [Validators.minLength(1), Validators.maxLength(150)]],
			nation: [this.item?.nation || null, [Validators.minLength(1), Validators.maxLength(100)]],
			city: [this.item?.city || null, [Validators.minLength(1), Validators.maxLength(100)]],
			state: [this.item?.state || null, [Validators.minLength(1), Validators.maxLength(100)]],
			country: [this.item?.country || null, [Validators.minLength(1), Validators.maxLength(100)]],
			// type: [this.item?.type || 'standard', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
			// estimated_min_days: [this.item?.estimated_min_days || null, [Validators.minLength(3), Validators.maxLength(100)]],
			// estimated_max_days: [this.item?.estimated_max_days || null, [Validators.minLength(3), Validators.maxLength(100)]],
			// estimated_cost: [this.item?.estimated_cost || null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
			is_active: [this.item?.is_active || true, [Validators.required]],
		});
	}

	addItem() {
		this.deliveryTermService.changeItem(new DeliveryTermModel({'user_id': this.user?.id}));
		this.viewMode = 'form';
	}

	editItem(item: DeliveryTerm) {
		this.deliveryTermService.changeItem(item);
		this.viewMode = 'form';
	}

	save() {
		let saveData: any = this.form.value;
		this.deliveryTermService.store(saveData);
	}

	update(item: DeliveryTerm) {
		let updateData: any = this.form.value;
		updateData.id = item.id;
		this.deliveryTermService.update(item.id, updateData);
	}

	delete(deliveryTerm: DeliveryTerm): void {
		let dialogRef = this.matDialog.open(ConfirmComponent, {
			disableClose: false,
			width: '600px',
			data: {
				type: 'delete',
				title: 'Delete Delivery Term  !!!',
				message: 'Are you sure you want to delete this Delivery Term ?',
				item: deliveryTerm
			}
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result && result.data === true) {
				this.deliveryTermService.destroy(deliveryTerm.id);
			}
		});
	}

	closeForm() {
		this.viewMode = 'list';
		this.deliveryTermService.changeItem(null);
		this.refreshForm();
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
