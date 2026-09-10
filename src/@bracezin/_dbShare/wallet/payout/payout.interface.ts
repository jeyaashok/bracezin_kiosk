import { User } from 'src/@bracezin/_dbShare/user';

export interface Payout {
	id: number;
	code: string;
	user_id: number;
	resource_id: number;
	resource_type: string;
	amount: number;
	method: string;
	state: string;
	description: number;
	date: Date;
	json: any;

	created_by?: number;
	updated_by?: number;
	created_at?: Date;
	updated_at?: Date;

	tableName?: string;
	user?: User;
	resource?: any;
}