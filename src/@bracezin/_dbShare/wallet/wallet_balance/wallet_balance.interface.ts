import { User } from 'src/@bracezin/_dbShare/user';

export interface WalletBalance {
	id: number;
	user_id: number;
	amount: number;

	created_by?: number;
	updated_by?: number;
	created_at?: Date;
	updated_at?: Date;

	tableName?: string;
	user?: User;
}