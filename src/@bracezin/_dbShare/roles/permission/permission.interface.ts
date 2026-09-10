export interface Permission {
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

}


export interface RolePermission {
		role_id: number;
		permission_id: number;
		has_permission: boolean;
}