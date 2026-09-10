import { Expense } from '../expense';
import { ExpenseCategory } from '../expense_category';

export class ExpenseCategoryModel {
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

	/**
	 * Constructor
	 *
	 * @param category
	 */
	constructor(category, additional: any = null) {
		this.id = category.id || null;
		this.name = category.name || null;
		this.type = category.type || null;
		this.description = category.description || null;
		this.is_active = category.is_active || false;

		this.created_by = category.created_by || null;
		this.updated_by = category.updated_by || null;
		this.created_at = category.created_at || null;
		this.updated_at = category.updated_at || null;

		this.tableName = category.tableName || null;
		this.expenses = category.expenses || null;
	}
}


export class ExpenseCategoryMapModel {
	data: any;

	/** Constructor */
	constructor(response) {

		let datas = (response && response.data && response.data.length > 0) ? response.data : [];
		datas = (datas && datas.length < 1 && response && response.data && response.data.data && response.data.data.length > 0) ? response.data.data : datas;
		let additional = (response && response.additional) ? response.additional : null;
		let items: ExpenseCategory[] = [];
		if (datas && datas.length > 0) {
			for (let i = 0; i <= datas.length; i++) {
				let item = datas[i];
				if (item && item.id) {
					items[i] = new ExpenseCategoryModel(datas[i], additional);
				}
			}
		}

		this.data = {};
		this.data.data = items;
	}
}
