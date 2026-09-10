import { Permission } from 'src/@bracezin/_dbShare/roles/permission';
import { Role } from 'src/@bracezin/_dbShare/roles/role';
import moment from 'moment';

export class RoleModel {
    id: number;
	name: string;
	guard_name: string;
	created_at: Date | any;
	updated_at: Date | any;
 
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

    /**
     * Constructor
     *
     * @param role
     */
    constructor(role, additional: any = null) {
 
    	let users = role?.users || [];
    	let userIds = (users && users.length > 0) ? users.map((value, index) => { return Number(value.model_id); }) : [];

    	let permissions = role?.permission || role?.permissions || [];
    	let permissionIds = (permissions && permissions.length > 0) ? permissions.map((value, index) => { return Number(value.id); }) : [];
    	let allAgents: Array<any> = (additional && additional.length > 0) ? additional.map((value, index) => { return (value && value.id) ? value : null; }) : [];

        this.id = role.id || null;
        this.name = role.name || null;
        this.guard_name = role.guard_name || null;
        this.created_at = moment(role.created_at + '.000+0300').local() || null;
        this.updated_at = moment(role.updated_at + '.000+0300').local() || null;

        this.permission = role.permission || role.permissions || [];
        this.permissions = role.permissions || role.permission || [];
        this.activeUsersCount = role.activeUsersCount || users.length || 0;
        this.permissionIdArray = role.permissionIdArray || permissionIds || [];

        this.tableName = role.tableName || 'role';

        this.person_id = role.person_id || null;
        this.person_type = role.person_type || null;
        this.users = role?.users || [];
        this.userIds = role?.userIds || userIds || [];
        this.allAgents = role?.allAgents || allAgents || [];
    }
}


export class RoleMapModel {
    data: any;

    /** Constructor */
    constructor(response) {

        let datas = (response && response.data && response.data.length > 0) ? response.data : [];
				datas = (datas && datas.length < 1 && response && response.data && response.data.data && response.data.data.length > 0) ? response.data.data : datas;
				let additional = (response && response.additional) ? response.additional : null;
				let items: Role[] = [];
				if (datas && datas.length > 0) {
					for (let i = 0; i <= datas.length; i++) {
						let item = datas[i];
						if (item && item.id) {
							items[i] = new RoleModel(datas[i], additional);
						}
					}
				}
		
				this.data = {};
				this.data.data = items;
    }
}
