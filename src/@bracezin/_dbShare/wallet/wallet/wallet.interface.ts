import { User } from 'src/@bracezin/_dbShare/user';
import { Payout } from 'src/@bracezin/_dbShare/wallet/payout';

export interface Wallet {
	id: number;
	code: string;
	user_id: number;
	resource_id: number;
	resource_type: string;
	type: string;
	price: number;
	recent_balance: number;
	json: any;
	description: string;

	created_by?: number;
	updated_by?: number;
	created_at?: Date;
	updated_at?: Date;

	tableName?: string;
	user?: User;
	resource?: any;
  payout?: Payout;
}
