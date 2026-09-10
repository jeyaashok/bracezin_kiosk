import { Component, OnInit, OnChanges, Input, Output, EventEmitter, effect } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActivatedRoute, Router } from '@angular/router';
import { User, PermissionService, Permission, UserService, StaffService } from 'src/@bracezin/_dbShare';

@Component({
  selector: 'app-contact-card-roles-permissions',
  templateUrl: './roles-permissions.component.html',
  styleUrls: ['./roles-permissions.component.scss'],
  standalone: false
})
@UntilDestroy()
export class RolesPermissionsComponent implements OnInit, OnChanges {

  @Input() user: User;
  @Input() permissions: Permission[] = [];

  groupedPermissions: Record<string, Permission[]> = {};
	rolePermissions: Permission[] = [];
	userPermissionNames: Array<string> = [];
	userDirectPermissionNames: Array<string> = [];
	userRolePermissionNames: Array<string> = [];

  constructor(
    public permissionService: PermissionService,
    public userService: UserService,
    public staffService: StaffService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.dataInit();
  }

  ngOnChanges(): void {
    this.dataInit();
  }

  dataInit() {
    if (this.user && this.user?.id) {
      this.userPermissionNames = (this.user && this.user?.id && this.user?.userPermissions && this.user?.userPermissions.allPermissions && this.user?.userPermissions.allPermissions.length > 0) ? this.user?.userPermissions.allPermissions : [];
      this.userDirectPermissionNames = (this.user && this.user?.id && this.user?.userPermissions && this.user?.userPermissions.directPermissions && this.user?.userPermissions.directPermissions.length > 0) ? this.user?.userPermissions.directPermissions : [];
      this.userRolePermissionNames = (this.user && this.user?.id && this.user?.userPermissions && this.user?.userPermissions.rolePermissions && this.user?.userPermissions.rolePermissions.length > 0) ? this.user?.userPermissions.rolePermissions : [];
    }
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
	}

  getKey(item): string {
		let output: string = '';
		if (item && item.key) {
			output = item.key;
		}
		return output;
	}

	getValue(item): Permission[] {
		let output: [] = [];
		if (item && item.value) {
			output = item.value;
		}
		return output;
	}

  groupByKey(array, key) {
		return array
		.reduce((hash, obj) => {
			if (obj[key] === undefined) return hash;
			return Object.assign(hash, { [obj[key]]: (hash[obj[key]] || []).concat(obj) })
		}, {})
	}

	hasPermission(item: Permission): boolean {
		let output: boolean = false;
    for (let i = 0; i < this.userPermissionNames.length; i++) {
      if (this.userPermissionNames[i] === item.name) {
        output = true;
        break;
      }
    }
		return output;
	}

	hasDirectPermission(item: Permission): boolean {
		let output: boolean = false;
    for (let i = 0; i < this.userDirectPermissionNames.length; i++) {
      if (this.userDirectPermissionNames[i] === item.name) {
        output = true;
        break;
      }
    }
		return output;
	}

	hasUserRolePermission(item: Permission): boolean {
		let output: boolean = false;
    for (let i = 0; i < this.userRolePermissionNames.length; i++) {
      if (this.userRolePermissionNames[i] === item.name) {
        output = true;
        break;
      }
    }
		return output;
	}

  toggleSelection(item: any, status: boolean) {
		if (!this.hasUserRolePermission(item)) {
			let data = {
				user_id: this.user.id,
				permission_id: item.id,
				permission_name: item.name,
				state: status,
			};
			this.staffService.storeByUrl('user-map-permission', data);
			this.hasPermission(item);
    }
	}

}