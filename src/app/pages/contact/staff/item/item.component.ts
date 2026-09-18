import { Component, OnInit, effect, ViewChild } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { ConfirmComponent } from '@bracezin/components/confirm/confirm.component';
import { PasswordChangeComponent } from '../../card/password-change/password-change.component';

import { Address, StaffService, AddressService, User, AddressModel, PayoutService, PermissionService, Permission, UserService } from 'src/@bracezin/_dbShare';

@Component({
  selector: 'app-staff-item',
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
  staff!: User;
  selectedAddress!: Address;

  permissions: Permission[] = [];
  permissionParams: any;
  
  constructor(
    private route: ActivatedRoute,
    public location: Location,
    public staffService: StaffService,
    public userService: UserService,
    public permissionService: PermissionService,
    public addressService: AddressService,
    public payoutService: PayoutService,
		private matDialog: MatDialog) {
      this.dataInit();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Staffs' },
      { label: 'Staff Dashboard', active: true }
    ];
    this.getData();
  }

  dataInit() {
    this.permissionService.params.pipe(untilDestroyed(this)).subscribe(data => this.permissionParams = data);
    this.staffService.isUpdated.pipe(untilDestroyed(this)).subscribe(data => this.getData());
    this.addressService.isStored.pipe(untilDestroyed(this)).subscribe(data => this.getData());
    this.addressService.isUpdated.pipe(untilDestroyed(this)).subscribe(data => this.getData());
    this.addressService.isDeleted.pipe(untilDestroyed(this)).subscribe(data => this.getData());
    this.payoutService.isStored.pipe(untilDestroyed(this)).subscribe(data => this.getData());
    effect(() => {
      let staff = this.staffService.item();
      if (staff && staff.id) {
        this.staff = staff;
      }
    });
    effect(() => {
      let permissions = this.permissionService.libraries();
      this.permissions = (permissions && permissions.length > 0) ? permissions : [];
    });
  }

  getData() {
    if(this.id) {
      this.staffService.getItem({id: this.id, with: 'detail', appends: 'userPermissions'});
    }
    this.permissionParams.all = 1;
		this.permissionParams.paginate = null;
		this.permissionParams.page = null;
		this.permissionService.getAllItems();
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
    if(this.staff && this.staff.id) {
      let dialogRef = this.matDialog.open(PasswordChangeComponent, {
        disableClose: false,
        width: '400px'
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.data === true && result.password && result.password.length > 0) {
          this.staffService.storeByPost('update-password', {id: this.staff.id, user_id: this.staff.id, password: result.password});
        }
      });
    }
  }

  doChangePassword(): void {
    if (this.userService.permissionMatch(['manage staff'])) {
      let dialogRef = this.matDialog.open(ConfirmComponent, {
        disableClose: false,
        width: '600px',
        data: {
          type: 'info',
          title: 'Force to Change Password  !!!',
          message: 'Are you sure want to Ask the User to change the password forcefully ?',
          item: this.staff
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.data === true) {
          let updateData = {'do_change_password': 1};
          this.staffService.update(this.staff.id, updateData);
        }
      });
    }
  }

  doVerifyEmail(): void {
    if (this.userService.permissionMatch(['manage staff'])) {
      let dialogRef = this.matDialog.open(ConfirmComponent, {
        disableClose: false,
        width: '600px',
        data: {
          type: 'info',
          title: 'Force to Verfiy Email  !!!',
          message: 'Are you sure want to Ask the User to verify the Email forcefully ?',
          item: this.staff
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.data === true) {
          let updateData = {'is_email_verified': 0, email_verified_at: null };
          this.staffService.update(this.staff.id, updateData);
        }
      });
    }
  }

  doVerifyMobile(): void {
    if (this.userService.permissionMatch(['manage staff'])) {
      let dialogRef = this.matDialog.open(ConfirmComponent, {
        disableClose: false,
        width: '600px',
        data: {
          type: 'info',
          title: 'Force to Verfiy Mobile  !!!',
          message: 'Are you sure want to Ask the User to verify the Mobile forcefully ?',
          item: this.staff
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.data === true) {
          let updateData = {'is_mobile_verified': 0, mobile_verified_at: null };
          this.staffService.update(this.staff.id, updateData);
        }
      });
    }
  }

  
}