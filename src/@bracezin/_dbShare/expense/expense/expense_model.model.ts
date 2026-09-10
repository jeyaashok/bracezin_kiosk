import { Expense } from '../expense';
import { ExpenseCategory } from '../expense_category';

export class ExpenseModel {
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

	/**
	 * Constructor
	 *
	 * @param expense
	 */
	constructor(expense, additional: any = null) {
		this.id = expense.id || null;
		this.expense_category_id = expense.expense_category_id || null;
		this.date = expense.date || null;
		this.amount = expense.amount || null;
		this.payment_method = expense.payment_method || null;
		this.is_taxable = expense.is_taxable || null;
		this.tax_percentage = expense.tax_percentage || null;
		this.tax = expense.tax || null;
		this.note = expense.note || null;

		this.created_by = expense.created_by || null;
		this.updated_by = expense.updated_by || null;
		this.created_at = expense.created_at || null;
		this.updated_at = expense.updated_at || null;

		this.tableName = expense.tableName || null;
		this.expense_category = expense.expense_category || null;
	}
}


export class ExpenseMapModel {
	data: any;

	/** Constructor */
	constructor(response) {

		let datas = (response && response.data && response.data.length > 0) ? response.data : [];
		datas = (datas && datas.length < 1 && response && response.data && response.data.data && response.data.data.length > 0) ? response.data.data : datas;
		let additional = (response && response.additional) ? response.additional : null;
		let items: Expense[] = [];
		if (datas && datas.length > 0) {
			for (let i = 0; i <= datas.length; i++) {
				let item = datas[i];
				if (item && item.id) {
					items[i] = new ExpenseModel(datas[i], additional);
				}
			}
		}

		this.data = {};
		this.data.data = items;
	}
}
