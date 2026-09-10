import { Component, QueryList, ViewChildren, effect, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Role, RoleService, RoleModel, Permission, PermissionService, PermissionModel, RolePermission, AlertService, UserService } from 'src/@bracezin/_dbShare';
import { ConfirmComponent } from '@bracezin/components/confirm/confirm.component';

@UntilDestroy()
@Component({
	selector: 'app-role-permissions-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.scss'],
	standalone: false
})

export class ListComponent implements OnInit, OnDestroy {
	// bread crumb items
	breadCrumbItems!: Array<{}>;

	roles!: Role[];
	role!: Role;
	permissions!: Permission[];
	permission!: Permission;
	groupedPermissions: Record<string, Permission[]> = {};
	filteredRoles: Role[] = [];
	dataSource = new MatTableDataSource(this.roleService.allItems());
	displayedColumns = ['image', 'date', 'role', 'tax', 'amount', 'payment_method', 'action'];
	dataLength: number = 0;
	roleParam: any;
	param: any;
	pageEvent: PageEvent;
	rolePermissions: RolePermission[] = [];

  orderSetting: Array<any> = ['Dashboard', 'Enquiry', 'Request for Quote', 'Quotation', 'Sale Order', 'Sale Invoice', 'Purchase Order', 'Packing', 'Expense', 'Expense Category', 'Product', 'Category', 
    'Customer', 'Vendor', 'Agent', 'Staff', 'Report', 'Role Permission', 'System Setting'];

	sideView: string = 'form';
	@ViewChild('sideBar') public sideBar;

	constructor(
		public roleService: RoleService,
		public permissionService: PermissionService,
		public userService: UserService,
		public alertService: AlertService,
		private matDialog: MatDialog,
		private router: Router,
		private formBuilder: UntypedFormBuilder) {
		this.roleService.unSubscribe();
		this.roleService.unSubscribeFilter();
		this.permissionService.unSubscribe();
		this.permissionService.unSubscribeFilter();
		this.dataInit();
	}

	ngOnInit(): void {
		this.getData();
		this.breadCrumbItems = [
			{ label: 'Application' },
			{ label: 'Categories' },
			{ label: 'List', active: true }
		];
	}

	ngOnDestroy(): void {
		this.roleService.unSubscribe();
		this.roleService.unSubscribeFilter();
		this.permissionService.unSubscribe();
		this.permissionService.unSubscribeFilter();
	}

	dataInit() {
		this.roleService.params.pipe(untilDestroyed(this)).subscribe(data => this.roleParam = data);
		this.permissionService.params.pipe(untilDestroyed(this)).subscribe(data => this.param = data);
		effect(() => {
			this.dataSource = new MatTableDataSource(this.roleService.allItems());
			this.roles = this.roleService.allItems();
			this.permissions = this.permissionService.allItems();
			this.dataLength = this.permissionService.totalItem();
			if (this.permissions && this.permissions.length > 0) {
				this.groupedPermissions = this.permissions.reduce((groups, permission) => {
					const module = permission.module || 'Other';
					if (!groups[module]) {
						groups[module] = [];
					}
					groups[module].push(permission);
					return groups;
				}, {});
			}
			if (this.roles && this.roles.length > 0) {
				this.filteredRoles = this.roles.filter(role => (role.name.toLocaleLowerCase() !== 'super admin' && role.name.toLocaleLowerCase() !== 'vendor' && role.name.toLocaleLowerCase() !== 'customer' && role.name.toLocaleLowerCase() !== 'agent'));
			}
		});
	}

	getData() {
		this.roleService.getAllItems();
		this.permissionService.getAllItems();
	}

	viewItem(role: Role = new RoleModel({})): void {
		this.role = role;
		if (role && role.id) { this.roleService.changeItem(role); }
		this.sideView = 'view';
		this.sideBar?.toggle();
	}

  matchOrder(moduleKey: string, order: string): boolean {
    return moduleKey.toLowerCase() === order.toLowerCase();
  }

	addRole(role: Role = new RoleModel({})): void {
    if(this.userService.permissionMatch(['add role permission', 'manage role permission'])) {
      this.role = role;
      if (role && role.id) { this.roleService.changeItem(role); }
      this.sideView = 'form';
      this.sideBar?.toggle();
    }
	}

	delete(role: Role): void {
		let dialogRef = this.matDialog.open(ConfirmComponent, {
			disableClose: false,
			width: '600px',
			data: {
				type: 'delete',
				title: 'Delete Role  !!!',
				message: 'Are you sure you want to delete this Role ?',
				item: role
			}
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result && result.data === true && this.userService.permissionMatch(['delete role permission'])) {
				this.roleService.destroy(role.id);
			}
		});
	}

	toggleStatus(isActive: boolean, item: Role): void {
    if(!this.userService.permissionMatch(['manage role permission'])) {
      this.alertService.webShow('error', 'You do not have permission to manage role permissions.');
      return;
    }
		let dialogRef = this.matDialog.open(ConfirmComponent, {
			disableClose: false,
			width: '600px',
			data: {
				type: 'update',
				title: 'Update Role  Status',
				message: 'Are you sure you want to update the status of this role?',
				item: item
			}
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result && result.data === true) {
				let updateData = { is_active: isActive };
				this.roleService.update(item.id, updateData);
			}
		});
	}

	checkPermission(permission: Permission, role: Role): boolean {
		if (permission && permission.id && role && role.id && role.permissions && role.permissions.length > 0) {
			return role.permissions.some(p => p.id === permission.id);
		}
		return false;
	}

	togglePermission(permission: Permission, role: Role, event:any): void {
    if(!this.userService.permissionMatch(['manage role permission'])) {
      this.alertService.webShow('error', 'You do not have permission to manage role permissions.');
      return;
    }
		event.preventDefault();
		let dialogRef = this.matDialog.open(ConfirmComponent, {
			disableClose: false,
			width: '600px',
			data: {
				type: 'update',
				title: 'Update Role Permission',
				message: `Are you sure you want to ${permission.has_permission ? 'remove' : 'assign'} the permission "${permission.name}" for the role "${role.name}"?`,
				item: { permission, role }
			}
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result && result.data === true) {
				let state: boolean = event.target.checked;
				let rolePermission: RolePermission = {
					role_id: role.id,
					permission_id: permission.id,
					has_permission: state
				};
				if(this.rolePermissions.some(rp => rp.role_id === rolePermission.role_id && rp.permission_id === rolePermission.permission_id)) {
					let index = this.rolePermissions.findIndex(rp => rp.role_id === rolePermission.role_id && rp.permission_id === rolePermission.permission_id);
					this.rolePermissions[index] = rolePermission;
				} else {
					this.rolePermissions.push(rolePermission);
				}
			} else {
				event.target.checked = !event.target.checked;
			}
		});
	}

	saveChanges(): void {
    if(!this.userService.permissionMatch(['manage role permission'])) {
      this.alertService.webShow('error', 'You do not have permission to manage role permissions.');
      return;
    }
		if (this.rolePermissions.length > 0) {
			this.roleService.post('update-role-permissions', {data: this.rolePermissions});
		} 
	}

}
