import { Component, Input, effect, OnInit, OnChanges, OnDestroy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { PaymentTerm, PaymentTermModel, PaymentTermService, User } from 'src/@bracezin/_dbShare';
import { ConfirmComponent } from '@bracezin/components/confirm/confirm.component';

@UntilDestroy()
@Component({
	selector: 'utils-payment-term-list',
	templateUrl: './payment-term-list.component.html',
	styleUrls: ['./payment-term-list.component.scss'],
	standalone: false
})

export class PaymentTermListComponent implements OnInit, OnChanges, OnDestroy {

	@Output() onSelect: EventEmitter<any> = new EventEmitter<any>(null);
	@Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>(null);
	param: any;
	itemsAll: PaymentTerm[] = [];
	items: PaymentTerm[] = [];
	item: PaymentTerm = null;

	@Input() enableSelect: boolean = false;
	@Input() itemIds: Array<any> = [];
	selectedItem: PaymentTerm = null;

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

	constructor(
		public paymentTermService: PaymentTermService,
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
		this.paymentTermService.resetParams();
		this.paymentTermService.params.pipe(untilDestroyed(this)).subscribe(data => this.param = data);
		this.paymentTermService.isStored.pipe(untilDestroyed(this)).subscribe(data => {
			if (data) { this.viewMode = 'list'; }
		});
		this.paymentTermService.isUpdated.pipe(untilDestroyed(this)).subscribe(data => {
			if (data) {
				this.viewMode = 'list'; 
			}
		});
		this.paymentTermService.filterColumns.set(['name', 'email', 'mobile']);
		effect(() => {
			let items = this.paymentTermService.filteredLibraries();
			this.items = this.filterItems(items);
			this.itemsAll = this.items;
			let item = this.paymentTermService.item();
			if (item) { 
				this.item = item; 
				this.form = this.createForm();
			}
		});
	}

	getData() {
		this.searchClear();
		this.paymentTermService.resetParams();
		this.param["search"] = null;
		this.param.limit = 200;
		this.param.paginate = 200;
		this.param.user_id = this.user?.id ?? null;
		this.paymentTermService.changeAllItems([]);
		this.paymentTermService.getAllItems();
	}

	filterItems(items: PaymentTerm[]): PaymentTerm[] {
		let output: PaymentTerm[] = items;
		if (items && items.length > 0) {
				output = items;
		}
		return output;
	}

	onReset() {
		this.onSelect.emit({ 'status': true, 'data': null });
	}

	isSelected(item: PaymentTerm): boolean {
		let output: boolean = false;
		if (this.itemIds && this.itemIds.length > 0 && item && item.id && this.itemIds.includes(Number(item.id))) {
			output = true;
		}
		return output;
	}

	isMultiSelected(item: PaymentTerm): boolean {
		let output: boolean = false;
		let selectedItems = (this.newSelectedItems && this.newSelectedItems.length > 0) ? this.newSelectedItems : this.selectedItems;
		if (this.enableMultiSelect && item && item.id && selectedItems && selectedItems.length > 0 && selectedItems.includes(item.id)) {
			output = true;
		}
		return output;
	}

	chooseItem(item: PaymentTerm, status: boolean = true) {
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
		this.paymentTermService.allSearchItems.set(null);
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
			// due_days: [this.item?.due_days || null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
			// discount_days: [this.item?.discount_days || null, [Validators.minLength(3), Validators.maxLength(100)]],
			// discount_percentage: [this.item?.discount_percentage || null, [Validators.minLength(3), Validators.maxLength(100)]],
			// late_fee_percentage: [this.item?.late_fee_percentage || null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
			is_active: [this.item?.is_active || true, [Validators.required]],
		});
	}

	addItem() {
		this.paymentTermService.changeItem(new PaymentTermModel({'user_id': this.user?.id}));
		this.viewMode = 'form';
	}

	editItem(item: PaymentTerm) {
		this.paymentTermService.changeItem(item);
		this.viewMode = 'form';
	}

	save() {
		let saveData: any = this.form.value;
		this.paymentTermService.store(saveData);
	}

	update(item: PaymentTerm) {
		let updateData: any = this.form.value;
		updateData.id = item.id;
		this.paymentTermService.update(item.id, updateData);
	}

	delete(paymentTerm: PaymentTerm): void {
		let dialogRef = this.matDialog.open(ConfirmComponent, {
			disableClose: false,
			width: '600px',
			data: {
				type: 'delete',
				title: 'Delete Payment Term  !!!',
				message: 'Are you sure you want to delete this Payment Term ?',
				item: paymentTerm
			}
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result && result.data === true) {
				this.paymentTermService.destroy(paymentTerm.id);
			}
		});
	}

	closeForm() {
		this.viewMode = 'list';
		this.paymentTermService.changeItem(null);
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
