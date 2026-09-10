import { User } from 'src/@bracezin/_dbShare/user';
import { PersonDetail } from "src/@bracezin/_dbShare/person/person_details/person_detail.interface";
import { Address } from "src/@bracezin/_dbShare/util/address";

export class UserModel {
  id: number;
	name: string;
	username: string;
	email: string;
	type: string;
	mobile: number;
	password: string;
	otp: string;
	avatar_url: string;
	remember_token: string;
	is_sysAdmin: boolean;
	is_active: boolean;
	do_change_password: boolean;
	do_reset_password: boolean;
	is_email_verified: boolean;
	is_mobile_verified: boolean;
	email_verified_at?: Date;
	mobile_verified_at?: Date;
	is_sound_notify: boolean;
	is_desktop_notify: boolean;
	is_web_notify: boolean;
	default_lang?: string;
	default_currency?: string;
  commission_ratio?: number;

	detail?: PersonDetail;
	tableName?: string;
	roleNames: Array<any>;
	permissionNames: Array<any>;
	token?: string;
	isOnline?: boolean;
	imageUrl?: string;

	roles: Array<any>;
	permissions: Array<any>;
	profilePercentage?: number;
	enable_sound?: any;
	availability?: any;
	fullAddress?: string;

	created_at?: Date;
	updated_at?: Date;
	created_by?: number;
	updated_by?: number;

	walletBalance?: number;
	addresses?: Address[];
	code?: string;
	info?: any;
  userPermissions?: Array<any>;
  latest_wallets?: any;
  latest_sale_invoices?: Array<any>;
  latest_sale_orders?: Array<any>;
  latest_enquiries?: Array<any>;
  latest_quote_requests?: Array<any>;
  latest_purchase_orders?: Array<any>;
  latest_agent_sale_orders?: Array<any>;
  latest_agent_purchase_orders?: Array<any>;

    /**
     * user
     *
     * @param user
     */
    constructor(user, additional: any = null) {
        this.id = user.id || null;
        this.name = user.name || null;
        this.username = user.username || null;
        this.email = user.email || null;
        this.mobile = user.mobile || null;
        this.type = user.type || null;
        this.password = user.password || null;
        this.otp = user.otp || null;
        this.avatar_url = user.avatar_url || null;
        this.remember_token = user.remember_token || null;
        this.is_sysAdmin = user.is_sysAdmin || false;
        this.is_active = user.is_active || false;
        this.do_change_password = user?.do_change_password || false;
        this.do_reset_password = user?.do_reset_password || false;
        this.is_email_verified = user.is_email_verified || false;
        this.is_mobile_verified = user.is_mobile_verified || false;
        this.email_verified_at = user.email_verified_at || null;
        this.mobile_verified_at = user.mobile_verified_at || null;
        this.is_sound_notify = user.is_sound_notify || false;
        this.is_desktop_notify = user.is_desktop_notify || false;
        this.is_web_notify = user.is_web_notify || false;
        this.default_lang = user.default_lang || 'en';
        this.default_currency = user.default_currency || 'usd';
        this.commission_ratio = user.commission_ratio || 0;
        
        this.tableName = user.tableName || 'users';
        this.token = user.token || null;
        this.isOnline = user.isOnline || false;
				this.imageUrl = user.imageUrl || null;

				this.detail = user.detail || null;
        this.roles = user.roles || [];
        this.permissions = user.permissions || [];
        this.roleNames = user.roleNames || [];
        this.permissionNames = user.permissionNames || [];
        this.profilePercentage = user.profilePercentage || 0;
        this.enable_sound = user.enable_sound || 1;
        this.availability = user.availability || 1;
				this.fullAddress = user.fullAddress || null;

				this.created_at = user.created_at || null;
				this.updated_at = user.updated_at || null;
				this.created_by = user.created_by || null;
				this.updated_by = user.updated_by || null;

				this.walletBalance = user.walletBalance || 0;
				this.addresses = user.addresses || [];
        this.code = user.code || user?.detail?.code || null;
        this.info = user.info || null;
        this.userPermissions = user.userPermissions || null;
        this.latest_wallets = user.latest_wallets || [];
        this.latest_sale_invoices = user.latest_sale_invoices || [];
        this.latest_sale_orders = user.latest_sale_orders || [];
        this.latest_enquiries = user.latest_enquiries || [];
        this.latest_quote_requests = user.latest_quote_requests || [];
        this.latest_purchase_orders = user.latest_purchase_orders || [];
        this.latest_agent_sale_orders = user.latest_agent_sale_orders || [];
        this.latest_agent_purchase_orders = user.latest_agent_purchase_orders || [];
    }
}


export class UserMapModel {
	data: any;

	/** Constructor */
	constructor(response) {

		let datas = (response && response.data && response.data.length > 0) ? response.data : [];
		datas = (datas && datas.length < 1 && response && response.data && response.data.data && response.data.data.length > 0) ? response.data.data : datas;
		let additional = (response && response.additional) ? response.additional : null;
		let items: User[] = [];
		if (datas && datas.length > 0) {
			for (let i = 0; i <= datas.length; i++) {
				let item = datas[i];
				if (item && item.id) {
					items[i] = new UserModel(datas[i], additional);
				}
			}
		}

		this.data = {};
		this.data.data = items;
	}
}
