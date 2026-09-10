import { Component, Input, effect, OnInit, OnChanges, OnDestroy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { Wallet, WalletModel, WalletService, PayoutService, User } from 'src/@bracezin/_dbShare';
import { ConfirmComponent } from '@bracezin/components/confirm/confirm.component';

@UntilDestroy()
@Component({
  selector: 'utils-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss'],
  standalone: false
})

export class PaymentFormComponent implements OnInit, OnChanges, OnDestroy {

  @Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>(null);
  item: Wallet = null;

  @Input() user: User = null;
  @Input() resource: any = null;
  @Input() resourceString: string = null;
  @Input() customerId!: number
  @Input() vendorId!: number
  @Input() staffId!: number

  isTouched: boolean = false;

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

  ngOnInit(): void { }

  ngOnChanges() {
    this.isTouched = false;
  }

  ngOnDestroy(): void { }

  dataInit() {
    this.walletService.isStored.pipe(untilDestroyed(this)).subscribe(data => {
      if (data) { this.closeView(); }
    });
    this.walletService.isUpdated.pipe(untilDestroyed(this)).subscribe(data => {
      if (data) { this.closeView(); }
    });
    this.payoutService.isStored.pipe(untilDestroyed(this)).subscribe(data => {
      if (data) { this.closeView(); }
    });
    this.payoutService.isUpdated.pipe(untilDestroyed(this)).subscribe(data => {
      if (data) { this.closeView(); }
    });
    effect(() => {
      let item = this.walletService.item();
      if (item) { 
        this.item = item; 
        this.form = this.createForm();
      }
    });
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
    if(this.resource && this.resource.id && this.resource.tableName) {
      this.payoutService.store(saveData);
    } else {
      this.payoutService.storeByUrl('payout-by-user', saveData);
    }
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
