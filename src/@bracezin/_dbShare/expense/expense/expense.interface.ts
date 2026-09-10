import { ExpenseCategory } from "../expense_category";

export interface Expense {
	id: number;
	expense_category_id: number;
	date: Date;
	amount: number;
	payment_method: string;
	is_taxable: boolean;
	tax_percentage: number;
	tax: number;
	note: string;

	created_by?: number;
	updated_by?: number;
	created_at?: Date;
	updated_at?: Date;

	tableName?: string;
	expense_category?: ExpenseCategory;
}