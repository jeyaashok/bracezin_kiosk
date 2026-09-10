import { PersonDetail } from "src/@bracezin/_dbShare/person/person_details/person_detail.interface";
import { Address } from "src/@bracezin/_dbShare/util/address";

export interface User {
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

	tableName?: string;
	roleNames: Array<any>;
	permissionNames: Array<any>;
	token?: string;
	isOnline?: boolean;
	imageUrl?: string;

	detail?: PersonDetail;
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
  userPermissions?: any;
  latest_wallets?: Array<any>;
  latest_sale_invoices?: Array<any>;
  latest_sale_orders?: Array<any>;
  latest_enquiries?: Array<any>;
  latest_quote_requests?: Array<any>;
  latest_purchase_orders?: Array<any>;
  latest_agent_sale_orders?: Array<any>;
  latest_agent_purchase_orders?: Array<any>;
}
