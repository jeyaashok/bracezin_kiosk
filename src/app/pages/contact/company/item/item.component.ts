import { Component, OnInit, effect, ViewChild } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '@bracezin/components/confirm/confirm.component';
import { PasswordChangeComponent } from '../../card/password-change/password-change.component';

import { Address, CompanyService, AddressService, User, AddressModel, PayoutService, UserService } from 'src/@bracezin/_dbShare';

@Component({
  selector: 'app-company-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  standalone: false
})
@UntilDestroy()
export class ItemComponent implements OnInit {

  @ViewChild('sideBar') sideBar: MatDrawer;
  sideView: string = null;
  
  breadCrumbItems!: Array<{}>;
  
  id: string = this.route.snapshot.params['id'] || null;
  company!: User;
  selectedAddress!: Address;
  
  constructor(
    private route: ActivatedRoute,
    public location: Location,
    public companyService: CompanyService,
    public userService: UserService,
    public addressService: AddressService,
    public payoutService: PayoutService,
		private matDialog: MatDialog) {
      this.dataInit();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Companies' },
      { label: 'Company Dashboard', active: true }
    ];
    this.getData();
  }

  dataInit() {
    this.companyService.isUpdated.pipe(untilDestroyed(this)).subscribe(data => this.getData());
    this.addressService.isStored.pipe(untilDestroyed(this)).subscribe(data => this.getData());
    this.addressService.isUpdated.pipe(untilDestroyed(this)).subscribe(data => this.getData());
    this.addressService.isDeleted.pipe(untilDestroyed(this)).subscribe(data => this.getData());
    this.payoutService.isStored.pipe(untilDestroyed(this)).subscribe(data => this.getData());
    effect(() => {
      let company = this.companyService.item();
      if (company && company.id) {
        this.company = company;
      }
    });
  }

  getData() {
    if(this.id) {
      this.companyService.getItem({id: this.id, with: 'detail', appends: 'userPermissions'});
    }
  }

  editForm(): void {
    this.sideView = 'form';
    this.sideBar?.toggle();
  }

  onAddAddress(address: Address = null) {
    this.selectedAddress = (address && address.id) ? address : new AddressModel({});
    this.sideView = 'address';
    this.sideBar?.toggle();
  } 

  makePayment() {
    this.sideView = 'payment-form';
    this.sideBar?.toggle();
  }

  changePassword(): void {
      if(this.company && this.company.id) {
        let dialogRef = this.matDialog.open(PasswordChangeComponent, {
          disableClose: false,
          width: '400px'
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result && result.data === true && result.password && result.password.length > 0) {
            this.companyService.storeByPost('update-password', {id: this.company.id, user_id: this.company.id, password: result.password});
          }
        });
      }
    }
  
    doChangePassword(): void {
      if (this.userService.permissionMatch(['manage company'])) {
        let dialogRef = this.matDialog.open(ConfirmComponent, {
          disableClose: false,
          width: '600px',
          data: {
            type: 'info',
            title: 'Force to Change Password  !!!',
            message: 'Are you sure want to Ask the User to change the password forcefully ?',
            item: this.company
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result && result.data === true) {
            let updateData = {'do_change_password': 1};
            this.companyService.update(this.company.id, updateData);
          }
        });
      }
    }
  
    doVerifyEmail(): void {
      if (this.userService.permissionMatch(['manage company'])) {
        let dialogRef = this.matDialog.open(ConfirmComponent, {
          disableClose: false,
          width: '600px',
          data: {
            type: 'info',
            title: 'Force to Verfiy Email  !!!',
            message: 'Are you sure want to Ask the User to verify the Email forcefully ?',
            item: this.company
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result && result.data === true) {
            let updateData = {'is_email_verified': 0, email_verified_at: null };
            this.companyService.update(this.company.id, updateData);
          }
        });
      }
    }
  
    doVerifyMobile(): void {
      if (this.userService.permissionMatch(['manage company'])) {
        let dialogRef = this.matDialog.open(ConfirmComponent, {
          disableClose: false,
          width: '600px',
          data: {
            type: 'info',
            title: 'Force to Verfiy Mobile  !!!',
            message: 'Are you sure want to Ask the User to verify the Mobile forcefully ?',
            item: this.company
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result && result.data === true) {
            let updateData = {'is_mobile_verified': 0, mobile_verified_at: null };
            this.companyService.update(this.company.id, updateData);
          }
        });
      }
    }
  
}