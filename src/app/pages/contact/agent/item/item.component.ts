import { Component, OnInit, effect, ViewChild } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '@bracezin/components/confirm/confirm.component';
import { PasswordChangeComponent } from '../../card/password-change/password-change.component';

import { Address, AgentService, AddressService, User, AddressModel, PayoutService, PermissionService, Permission, UserService } from 'src/@bracezin/_dbShare';

@Component({
  selector: 'app-agent-item',
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
  agent!: User;
  selectedAddress!: Address;

  permissions: Permission[] = [];
  permissionParams: any;
  
  constructor(
    private route: ActivatedRoute,
    public location: Location,
    public agentService: AgentService,
    public userService: UserService,
    public permissionService: PermissionService,
    public addressService: AddressService,
    public payoutService: PayoutService,
		private matDialog: MatDialog) {
      this.dataInit();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Agents' },
      { label: 'Agent Dashboard', active: true }
    ];
    this.getData();
  }

  dataInit() {
    this.permissionService.params.pipe(untilDestroyed(this)).subscribe(data => this.permissionParams = data);
    this.agentService.isUpdated.pipe(untilDestroyed(this)).subscribe(data => this.getData());
    this.addressService.isStored.pipe(untilDestroyed(this)).subscribe(data => this.getData());
    this.addressService.isUpdated.pipe(untilDestroyed(this)).subscribe(data => this.getData());
    this.addressService.isDeleted.pipe(untilDestroyed(this)).subscribe(data => this.getData());
    this.payoutService.isStored.pipe(untilDestroyed(this)).subscribe(data => this.getData());
    effect(() => {
      let agent = this.agentService.item();
      if (agent && agent.id) {
        this.agent = agent;
      }
    });
    effect(() => {
      let permissions = this.permissionService.libraries();
      this.permissions = (permissions && permissions.length > 0) ? permissions : [];
    });
  }

  getData() {
    if(this.id) {
      this.agentService.getItem({id: this.id, with: 'detail', appends: 'userPermissions'});
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
    if(this.agent && this.agent.id) {
      let dialogRef = this.matDialog.open(PasswordChangeComponent, {
        disableClose: false,
        width: '400px'
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.data === true && result.password && result.password.length > 0) {
          this.agentService.storeByPost('update-password', {id: this.agent.id, user_id: this.agent.id, password: result.password});
        }
      });
    }
  }

  doChangePassword(): void {
    if (this.userService.permissionMatch(['manage agent'])) {
      let dialogRef = this.matDialog.open(ConfirmComponent, {
        disableClose: false,
        width: '600px',
        data: {
          type: 'info',
          title: 'Force to Change Password  !!!',
          message: 'Are you sure want to Ask the User to change the password forcefully ?',
          item: this.agent
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.data === true) {
          let updateData = {'do_change_password': 1};
          this.agentService.update(this.agent.id, updateData);
        }
      });
    }
  }

  doVerifyEmail(): void {
    if (this.userService.permissionMatch(['manage agent'])) {
      let dialogRef = this.matDialog.open(ConfirmComponent, {
        disableClose: false,
        width: '600px',
        data: {
          type: 'info',
          title: 'Force to Verfiy Email  !!!',
          message: 'Are you sure want to Ask the User to verify the Email forcefully ?',
          item: this.agent
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.data === true) {
          let updateData = {'is_email_verified': 0, email_verified_at: null };
          this.agentService.update(this.agent.id, updateData);
        }
      });
    }
  }

  doVerifyMobile(): void {
    if (this.userService.permissionMatch(['manage agent'])) {
      let dialogRef = this.matDialog.open(ConfirmComponent, {
        disableClose: false,
        width: '600px',
        data: {
          type: 'info',
          title: 'Force to Verfiy Mobile  !!!',
          message: 'Are you sure want to Ask the User to verify the Mobile forcefully ?',
          item: this.agent
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.data === true) {
          let updateData = {'is_mobile_verified': 0, mobile_verified_at: null };
          this.agentService.update(this.agent.id, updateData);
        }
      });
    }
  }
  
}