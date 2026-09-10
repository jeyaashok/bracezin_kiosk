import { PaymentTerm } from './payment_term.interface';

export class PaymentTermModel {
	id: number;
	code: string;
	name: string;
	description?: string;
	// due_days?: number;
	// discount_days?: number;
	// discount_percentage?: number;
	// late_fee_percentage?: number;
	is_active: boolean;

	created_by?: number;
	updated_by?: number;
	created_at?: Date;
	updated_at?: Date;

	tableName?: string;

	/**
	 * Constructor
	 *
	 * @param paymentTerm
	 */
	constructor(paymentTerm, additional: any = null) {
		this.id = paymentTerm.id || null;
		this.code = paymentTerm.code || null;
		this.name = paymentTerm.name || null;
		this.description = paymentTerm.description || null;
		// this.due_days = paymentTerm.due_days || null;
		// this.discount_days = paymentTerm.discount_days || null;
		// this.discount_percentage = paymentTerm.discount_percentage || null;
		// this.late_fee_percentage = paymentTerm.late_fee_percentage || null;
		this.is_active = paymentTerm.is_active || false;

		this.created_by = paymentTerm.created_by || null;
		this.updated_by = paymentTerm.updated_by || null;
		this.created_at = paymentTerm.created_at || null;
		this.updated_at = paymentTerm.updated_at || null;

		this.tableName = paymentTerm.tableName || null;
	}
}


export class PaymentTermMapModel {
	data: any;

	/** Constructor */
	constructor(response) {

		let datas = (response && response.data && response.data.length > 0) ? response.data : [];
		datas = (datas && datas.length < 1 && response && response.data && response.data.data && response.data.data.length > 0) ? response.data.data : datas;
		let additional = (response && response.additional) ? response.additional : null;
		let items: PaymentTerm[] = [];
		if (datas && datas.length > 0) {
			for (let i = 0; i <= datas.length; i++) {
				let item = datas[i];
				if (item && item.id) {
					items[i] = new PaymentTermModel(datas[i], additional);
				}
			}
		}

		this.data = {};
		this.data.data = items;
	}
}
