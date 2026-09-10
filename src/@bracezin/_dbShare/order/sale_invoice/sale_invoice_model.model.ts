import { SaleInvoice } from './sale_invoice.interface';
import { SaleOrder } from '../sale_order';
import { User } from '../../user';
import { PaymentTerm } from 'src/@bracezin/_dbShare/util';

export class SaleInvoiceModel {
	id: number;
	code: string;
	sale_order_id?: number;
	customer_id?: number;
	payment_term_id?: number;
	state: string;

	created_by?: number;
	updated_by?: number;
	created_at?: Date;
	updated_at?: Date;

	tableName?: string;
	sale_order?: SaleOrder;
	customer?: User;
	payment_term?: PaymentTerm;
	walletBalance?: number;

	/**
	 * Constructor
	 *
	 * @param enquiryItem
	 */
	constructor(enquiryItem, additional: any = null) {
		this.id = enquiryItem.id || null;
		this.code = enquiryItem.code || null;
		this.sale_order_id = enquiryItem.sale_order_id || null;
		this.customer_id = enquiryItem.customer_id || null;
		this.payment_term_id = enquiryItem.payment_term_id || null;
		this.state = enquiryItem.state || null;

		this.created_by = enquiryItem.created_by || null;
		this.updated_by = enquiryItem.updated_by || null;
		this.created_at = enquiryItem.created_at || null;
		this.updated_at = enquiryItem.updated_at || null;

		this.tableName = enquiryItem.tableName || null;
		this.sale_order = enquiryItem.sale_order || enquiryItem.sale_order || null;
		this.customer = enquiryItem.customer || null;
		this.payment_term = enquiryItem.payment_term || enquiryItem.payment_term || null;
		this.walletBalance = enquiryItem.walletBalance || 0;
	}
}


export class SaleInvoiceMapModel {
	data: any;

	/** Constructor */
	constructor(response) {

		let datas = (response && response.data && response.data.length > 0) ? response.data : [];
		datas = (datas && datas.length < 1 && response && response.data && response.data.data && response.data.data.length > 0) ? response.data.data : datas;
		let additional = (response && response.additional) ? response.additional : null;
		let items: SaleInvoice[] = [];
		if (datas && datas.length > 0) {
			for (let i = 0; i <= datas.length; i++) {
				let item = datas[i];
				if (item && item.id) {
					items[i] = new SaleInvoiceModel(datas[i], additional);
				}
			}
		}

		this.data = {};
		this.data.data = items;
	}
}
