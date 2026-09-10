import { Permission } from 'src/@bracezin/_dbShare/roles/permission';

export interface Role {
	id: number;
	name: string;
	guard_name: string;
	created_at?: Date;
	updated_at?: Date;

	permission?: Permission[];
	permissions?: Permission[];
	permissionIdArray?: Array<any>;

	tableName?: string;

	activeUsersCount?: number;
	person_id?: number;
	person_type?: string;
	users?: Array<any>;
	userIds?: Array<any>;
	allAgents?: Array<any>;
}
