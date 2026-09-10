import { Permission } from 'src/@bracezin/_dbShare/roles/permission';

export class PermissionModel {
	id: number;
	name: string;
	guard_name: string;
	created_at?: Date;
	updated_at?: Date;
	module: string;
	modules: any;
	is_admin?: boolean;
	is_default?: boolean;
	has_permission?: boolean;

	/**
	 * Constructor
	 *
	 * @param permission
	 */
	constructor(permission, additional: any = null) {
		var inputDefault = additional?.inputDefault ? additional?.inputDefault : [];
		let isInputDefault: boolean = false;
		isInputDefault = Array.isArray(inputDefault) && permission?.id ? inputDefault.some(x => x === permission.id) : false;
		this.id = permission.id || null;
		this.name = permission.name || null;
		this.guard_name = permission.guard_name || null;
		this.created_at = permission.created_at || null;
		this.updated_at = permission.updated_at || null;
		this.module = permission.module || null;
		this.modules = permission.modules || null;
		this.is_admin = permission.is_admin || false;
		this.is_default = permission.is_default || false;
		this.has_permission = isInputDefault;
	}
}


export class PermissionMapModel {
	data: any;

	/** Constructor */
	constructor(response) {
		let datas = (response && response.data && response.data.length > 0) ? response.data : [];
		datas = (datas && datas.length < 1 && response && response.data && response.data.data && response.data.data.length > 0) ? response.data.data : datas;
		let additional = (response && response.additional) ? response.additional : null;
		let items: Permission[] = [];
		if (datas && datas.length > 0) {
			for (let i = 0; i <= datas.length; i++) {
				let item = datas[i];
				if (item && item.id) {
					items[i] = new PermissionModel(datas[i], additional);
				}
			}
		}

		this.data = {};
		this.data.data = items;
	}
}


export class RolePermissionModel {
	role_id: number;
	permission_id: number;
	has_permission: boolean;

	/** Constructor */
	constructor(rolePermission) {
		this.role_id = rolePermission.role_id || null;
		this.permission_id = rolePermission.permission_id || null;
		this.has_permission = rolePermission.has_permission || false;
	}
}