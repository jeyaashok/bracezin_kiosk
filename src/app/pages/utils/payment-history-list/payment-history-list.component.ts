import { Component, Input, effect, OnInit, OnChanges, OnDestroy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { Wallet, WalletModel, WalletService, PayoutService, User } from 'src/@bracezin/_dbShare';
import { ConfirmComponent } from '@bracezin/components/confirm/confirm.component';

@UntilDestroy()
@Component({
  selector: 'utils-payment-history-list',
  templateUrl: './payment-history-list.component.html',
  styleUrls: ['./payment-history-list.component.scss'],
  standalone: false
})

export class PaymentHistoryListComponent implements OnInit, OnChanges, OnDestroy {

  @Output() onSelect: EventEmitter<any> = new EventEmitter<any>(null);
  @Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>(null);
  param: any;
  itemsAll: Wallet[] = [];
  items: Wallet[] = [];
  item: Wallet = null;

  @Input() user: User = null;
  @Input() resource: any = null;
  @Input() resourceString: string = null;
  @Input() customerId!: number
  @Input() vendorId!: number
  @Input() staffId!: number
  @Input() enableSelect: boolean = false;
  @Input() itemIds: Array<any> = [];
  selectedItem: Wallet = null;

  @Input() enableReset: boolean = false;
  @Input() enableMultiSelect: boolean = false;
  @Input() selectedItems: Array<any> = [];
  @Input() newSelectedItems: Array<any> = [];
  @Output() onMultiSelect: EventEmitter<any> = new EventEmitter<any>(null);
  isTouched: boolean = false;

  @Input() onSync: boolean = false;
  viewMode: string = 'list';

  form: UntypedFormGroup;

  constructor(
    public walletService: WalletService,
    public payoutService: PayoutService,
    private formBuilder: UntypedFormBuilder,
    private matDialog: MatDialog,
    private cd: ChangeDetectorRef) {
    this.dataInit();
    this.form = this.createForm();
  }

  ngOnInit(): void {
    this.viewMode = 'list';
    if (this.onSync == false) {
      this.getData();
      this.searchClear();
    }
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
    this.walletService.resetParams();
    this.walletService.params.pipe(untilDestroyed(this)).subscribe(data => this.param = data);
    this.walletService.isStored.pipe(untilDestroyed(this)).subscribe(data => {
      if (data) { this.viewMode = 'list'; }
    });
    this.walletService.isUpdated.pipe(untilDestroyed(this)).subscribe(data => {
      if (data) {
        this.viewMode = 'list'; 
      }
    });
    this.payoutService.isStored.pipe(untilDestroyed(this)).subscribe(data => {
      if (data) { 
        this.viewMode = 'list'; 
        this.walletService.getAllItems();
      }
    });
    this.payoutService.isUpdated.pipe(untilDestroyed(this)).subscribe(data => {
      if (data) {
        this.viewMode = 'list'; 
        this.walletService.getAllItems();
      }
    });
    effect(() => {
      let items = this.walletService.allItems();
      this.items = this.filterItems(items);
      this.itemsAll = this.items;
      let item = this.walletService.item();
      if (item) { 
        this.item = item; 
        this.form = this.createForm();
      }
    });
  }

  getData() {
    this.searchClear();
    this.walletService.resetParams();
    this.param["search"] = null;
    this.param.limit = 50;
    this.param.paginate = 50;
    this.param.order = 'id|desc';
    if (this.user && this.user.id) {
      this.param.user_id = this.user?.id ?? null;
    } else if (this.customerId || this.vendorId || this.staffId) {
      this.param.user_id = this.customerId || this.vendorId || this.staffId;
    }
    if(this.resourceString) {
      this.param.resource = this.resourceString;
    } else if(this.resource && this.resource.id) {
      this.param.resource = this.resource?.id +'|'+this.resource?.tableName;
    }
    this.walletService.changeAllItems([]);
    this.walletService.getAllItems();
  }

  get maxAmount(): number {
    if(this.resource && this.resource.total_amount) {
      return this.resource.total_amount;
    }
    if(this.user && this.user.walletBalance) {
      return this.user.walletBalance;
    }
    return 0;
  }

  filterItems(items: Wallet[]): Wallet[] {
    let output: Wallet[] = items;
    if (items && items.length > 0) {
        output = items;
    }
    return output;
  }

  onReset() {
    this.onSelect.emit({ 'status': true, 'data': null });
  }

  isSelected(item: Wallet): boolean {
    let output: boolean = false;
    if (this.itemIds && this.itemIds.length > 0 && item && item.id && this.itemIds.includes(Number(item.id))) {
      output = true;
    }
    return output;
  }

  isMultiSelected(item: Wallet): boolean {
    let output: boolean = false;
    let selectedItems = (this.newSelectedItems && this.newSelectedItems.length > 0) ? this.newSelectedItems : this.selectedItems;
    if (this.enableMultiSelect && item && item.id && selectedItems && selectedItems.length > 0 && selectedItems.includes(item.id)) {
      output = true;
    }
    return output;
  }

  chooseItem(item: Wallet, status: boolean = true) {
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
    this.walletService.allSearchItems.set(null);
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
      amount: [null, [Validators.required, Validators.min(1), Validators.max(this.maxAmount), Validators.required]],
      method: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      description: [null, [Validators.minLength(1), Validators.maxLength(200)]],
      date: [new Date(), [Validators.required]],
      referenceNumber: [null, [Validators.minLength(1), Validators.maxLength(50)]]
    });
  }

  addItem() {
    // this.walletService.changeItem(new WalletModel({'user_id': this.user?.id}));
    this.viewMode = 'form';
  }

  editItem(item: Wallet) {
    // this.walletService.changeItem(item);
    this.viewMode = 'form';
  }

  save() {
    let saveData: any = this.form.value;
    saveData.user_id = this.user?.id || this.customerId || this.vendorId || this.staffId;
    saveData.resource_id = this.resource?.id;
    saveData.resource_type = this.resource?.tableName;
    if(saveData && saveData.referanceNumber) {
      let jsonData: any = {
        'referanceNumber': saveData.referanceNumber
      };
      saveData.json = JSON.stringify(jsonData);
    }
    // this.walletService.store(saveData);
    this.payoutService.store(saveData);
  }

  update(item: Wallet) {
    let updateData: any = this.form.value;
    updateData.user_id = this.user?.id || this.customerId || this.vendorId || this.staffId;
    updateData.resource_id = this.resource?.id;
    updateData.resource_type = this.resource?.tableName;
    if(updateData && updateData.referanceNumber) {
      let jsonData: any = {
        'referanceNumber': updateData.referanceNumber
      };
      updateData.json = JSON.stringify(jsonData);
    }
    updateData.id = item.id;
    this.walletService.update(item.id, updateData);
  }

  delete(wallet: Wallet): void {
    let dialogRef = this.matDialog.open(ConfirmComponent, {
      disableClose: false,
      width: '600px',
      data: {
        type: 'delete',
        title: 'Delete Wallet  !!!',
        message: 'Are you sure you want to delete this Wallet ?',
        item: wallet
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.data === true) {
        this.walletService.destroy(wallet.id);
      }
    });
  }

  closeForm() {
    this.viewMode = 'list';
    // this.walletService.changeItem(null);
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

  makePayment() {
    // this.walletService.changeItem(item);
    this.viewMode = 'form';
  }

}
