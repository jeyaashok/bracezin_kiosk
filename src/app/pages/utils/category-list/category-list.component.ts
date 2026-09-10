import { Component, Input, effect, OnInit, OnChanges, OnDestroy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { Category, CategoryModel, CategoryService, User } from 'src/@bracezin/_dbShare';
import { ConfirmComponent } from '@bracezin/components/confirm/confirm.component';

@UntilDestroy()
@Component({
	selector: 'utils-category-list',
	templateUrl: './category-list.component.html',
	styleUrls: ['./category-list.component.scss'],
	standalone: false
})

export class CategoryListComponent implements OnInit, OnChanges, OnDestroy {

	@Output() onSelect: EventEmitter<any> = new EventEmitter<any>(null);
	@Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>(null);
	param: any;
	itemsAll: Category[] = [];
	items: Category[] = [];
	item: Category = null;

	@Input() enableSelect: boolean = false;
	@Input() itemIds: Array<any> = [];
	selectedItem: Category = null;

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
		public categoryService: CategoryService,
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
		this.categoryService.resetParams();
		this.categoryService.params.pipe(untilDestroyed(this)).subscribe(data => this.param = data);
		this.categoryService.isStored.pipe(untilDestroyed(this)).subscribe(data => {
			if (data) { this.viewMode = 'list'; }
		});
		this.categoryService.isUpdated.pipe(untilDestroyed(this)).subscribe(data => {
			if (data) {
				this.viewMode = 'list'; 
			}
		});
		this.categoryService.filterColumns.set(['name', 'code']);
		effect(() => {
			let items = this.categoryService.filteredLibraries();
			this.items = this.filterItems(items);
			this.itemsAll = this.items;
			let item = this.categoryService.item();
			if (item) { 
				this.item = item; 
				this.form = this.createForm();
			}
		});
	}

	getData() {
		this.searchClear();
		this.categoryService.resetParams();
		this.param["search"] = null;
		this.param.limit = 200;
		this.param.paginate = 200;
		this.param.user_id = this.user?.id ?? null;
		this.categoryService.changeAllItems([]);
		this.categoryService.getAllItems();
	}

	filterItems(items: Category[]): Category[] {
		let output: Category[] = items;
		if (items && items.length > 0) {
				output = items;
		}
		return output;
	}

	onReset() {
		this.onSelect.emit({ 'status': true, 'data': null });
	}

	isSelected(item: Category): boolean {
		let output: boolean = false;
		if (this.itemIds && this.itemIds.length > 0 && item && item.id && this.itemIds.includes(Number(item.id))) {
			output = true;
		}
		return output;
	}

	isMultiSelected(item: Category): boolean {
		let output: boolean = false;
		let selectedItems = (this.newSelectedItems && this.newSelectedItems.length > 0) ? this.newSelectedItems : this.selectedItems;
		if (this.enableMultiSelect && item && item.id && selectedItems && selectedItems.length > 0 && selectedItems.includes(item.id)) {
			output = true;
		}
		return output;
	}

	chooseItem(item: Category, status: boolean = true) {
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
		this.categoryService.allSearchItems.set(null);
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
			name: [this.item?.name || null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
			code: [this.item?.code || null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
			description: [this.item?.description || null, [Validators.minLength(1), Validators.maxLength(50)]],
			is_active: [this.item?.is_active || true, [Validators.required]],
		});
	}

	addItem() {
		this.categoryService.changeItem(new CategoryModel({}));
		this.viewMode = 'form';
	}

	editItem(item: Category) {
		this.categoryService.changeItem(item);
		this.viewMode = 'form';
	}

	save() {
		let saveData: any = this.form.value;
		this.categoryService.store(saveData);
	}

	update(item: Category) {
		let updateData: any = this.form.value;
		updateData.id = item.id;
		this.categoryService.update(item.id, updateData);
	}

	delete(category: Category): void {
		let dialogRef = this.matDialog.open(ConfirmComponent, {
			disableClose: false,
			width: '600px',
			data: {
				type: 'delete',
				title: 'Delete Category  !!!',
				message: 'Are you sure you want to delete this Category ?',
				item: category
			}
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result && result.data === true) {
				this.categoryService.destroy(category.id);
			}
		});
	}

	closeForm() {
		this.viewMode = 'list';
		this.categoryService.changeItem(null);
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
