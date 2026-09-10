import { Expense } from "../expense";

export interface ExpenseCategory {
	id: number;
	name: string;
	type: string;
	description: string;
	is_active: boolean;

	created_by?: number;
	updated_by?: number;
	created_at?: Date;
	updated_at?: Date;

	tableName?: string;
	expenses?: Expense[];
}
