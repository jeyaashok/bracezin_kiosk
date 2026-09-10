import { QuoteRequest } from '../quote_request';
import { QuoteRequestItem } from '../quote_request_item';
import { User } from 'src/@bracezin/_dbShare/user';
import { PaymentTerm, DeliveryTerm, Address } from 'src/@bracezin/_dbShare/util';

export class QuoteRequestModel {
	id: number;
		parent_id?: number;
		code: string;
		po_code: string;
		vendor_id: number;
		agent_id: number;
		payment_term_id: number;
		delivery_term_id: number;
		sub_total: number;
		discount_percentage: number;
		discount: number;
		tax_percentage: number;
		tax: number;
		commission_percentage: number;
		commission: number;
		total: number;
		currency_value: number;
		currency: string;
		order_date: Date;
		delivery_date: Date;
		note: string;
		ref_doc: string;
		state: string;
	
		isSeparateTax?: boolean;
		isSeparateCommission?: boolean;
		isSeparateDiscount?: boolean;
	
		created_by?: number;
		updated_by?: number;
		created_at?: Date;
		updated_at?: Date;
	
		tableName?: string;
		childrens?: QuoteRequest[];
		vendor?: User;
		agent?: User;
		payment_term?: PaymentTerm;
		paymentTermDescription?: string;
		delivery_term?: DeliveryTerm;
		deliveryTermDescription?: string;
		quote_request_items?: QuoteRequestItem[];
		delivery_address?: Address;
		itemsCount?: number;
	  walletBalance?: number;

	/**
	 * Constructor
	 *
	 * @param quoteRequest
	 */
	constructor(quoteRequest, additional: any = null) {
		this.id = quoteRequest.id || null;
		this.parent_id = quoteRequest.parent_id || null;
		this.code = quoteRequest.code || null;
		this.po_code = quoteRequest.po_code || null;
		this.vendor_id = quoteRequest.vendor_id || null;
		this.agent_id = quoteRequest.agent_id || null;
		this.payment_term_id = quoteRequest.payment_term_id || null;
		this.delivery_term_id = quoteRequest.delivery_term_id || null;
		this.sub_total = quoteRequest.sub_total || null;
		this.discount_percentage = quoteRequest.discount_percentage || null;
		this.discount = quoteRequest.discount || null;
		this.tax_percentage = quoteRequest.tax_percentage || null;
		this.tax = quoteRequest.tax || null;
		this.commission_percentage = quoteRequest.commission_percentage || null;
		this.commission = quoteRequest.commission || null;
		this.total = quoteRequest.total || null;
		this.currency_value = quoteRequest.currency_value || 1;
		this.currency = quoteRequest.currency || 'USD';
		this.order_date = quoteRequest.order_date || null;
		this.delivery_date = quoteRequest.delivery_date || null;
		this.note = quoteRequest.note || null;
		this.ref_doc = quoteRequest.ref_doc || null;
		this.state = quoteRequest.state || null;

		this.isSeparateTax = quoteRequest.isSeparateTax || false;
		this.isSeparateCommission = quoteRequest.isSeparateCommission || false;
		this.isSeparateDiscount = quoteRequest.isSeparateDiscount || false;

		this.created_by = quoteRequest.created_by || null;
		this.updated_by = quoteRequest.updated_by || null;
		this.created_at = quoteRequest.created_at || null;
		this.updated_at = quoteRequest.updated_at || null;

		this.tableName = quoteRequest.tableName || null;
		this.childrens = quoteRequest.childrens || null;
		this.vendor = quoteRequest.vendor || null;
		this.agent = quoteRequest.agent || null;
		this.payment_term = quoteRequest.payment_term || null;
		this.paymentTermDescription = quoteRequest.paymentTermDescription || null;
		this.delivery_term = quoteRequest.delivery_term || null;
		this.deliveryTermDescription = quoteRequest.deliveryTermDescription || null;
		this.quote_request_items = quoteRequest.quote_request_items || null;
		this.delivery_address = quoteRequest.delivery_address || null;
		this.itemsCount = quoteRequest.itemsCount || 0;
		this.walletBalance = quoteRequest.walletBalance || 0;
	}
}


export class QuoteRequestMapModel {
	data: any;

	/** Constructor */
	constructor(response) {

		let datas = (response && response.data && response.data.length > 0) ? response.data : [];
		datas = (datas && datas.length < 1 && response && response.data && response.data.data && response.data.data.length > 0) ? response.data.data : datas;
		let additional = (response && response.additional) ? response.additional : null;
		let items: QuoteRequest[] = [];
		if (datas && datas.length > 0) {
			for (let i = 0; i <= datas.length; i++) {
				let item = datas[i];
				if (item && item.id) {
					items[i] = new QuoteRequestModel(datas[i], additional);
				}
			}
		}

		this.data = {};
		this.data.data = items;
	}
}
