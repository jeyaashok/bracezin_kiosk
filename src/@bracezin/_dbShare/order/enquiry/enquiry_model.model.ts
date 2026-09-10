import { Enquiry } from '../enquiry';
import { User, Address, DeliveryTerm, PaymentTerm, EnquiryItem } from 'src/@bracezin/_dbShare';

export class EnquiryModel {
	id: number;
	code: string;
	quote_code?: string;
	customer_id?: number;
	agent_id?: number;
	payment_term_id?: number;
	delivery_term_id?: number;
	sub_total?: number;
	discount_percentage?: number;
	discount?: number;
	tax_percentage?: number;
	tax?: number;
	commission_percentage?: number;
	commission?: number;
	total?: number;
	currency_value?: number;
	currency?: string;
	order_date?: Date;
	delivery_date?: Date;
	note?: string;
	ref_doc?: string;
	state?: string;
	isSeparateTax?: boolean;
	isSeparateCommission?: boolean;
	isSeparateDiscount?: boolean;

	created_by?: number;
	updated_by?: number;
	created_at?: Date;
	updated_at?: Date;

	tableName?: string;
	customer?: User;
	agent?: User;
	payment_term?: PaymentTerm;
	paymentTermDescription?: string;
	delivery_term?: DeliveryTerm;
	deliveryTermDescription?: string;
	enquiry_items?: Array<EnquiryItem>;
	delivery_address?: Address;
	itemsCount?: number;

	customerName?: string;
	customerCode?: string;

	/**
	 * Constructor
	 *
	 * @param enquiry
	 */
	constructor(enquiry, additional: any = null) {
		this.id = enquiry.id || null;
		this.code = enquiry.code || null;
		this.quote_code = enquiry.quote_code || null;
		this.customer_id = enquiry.customer_id || null;
		this.agent_id = enquiry.agent_id || null;
		this.payment_term_id = enquiry.payment_term_id || null;
		this.delivery_term_id = enquiry.delivery_term_id || null;
		this.sub_total = enquiry.sub_total || null;
		this.discount_percentage = enquiry.discount_percentage || null;
		this.discount = enquiry.discount || null;
		this.tax_percentage = enquiry.tax_percentage || null;
		this.tax = enquiry.tax || null;
		this.commission_percentage = enquiry.commission_percentage || null;
		this.commission = enquiry.commission || null;
		this.total = enquiry.total || null;
		this.currency_value = enquiry.currency_value || 1;
		this.currency = enquiry.currency || 'USD';
		this.order_date = enquiry.order_date || null;
		this.delivery_date = enquiry.delivery_date || null;
		this.note = enquiry.note || null;
		this.ref_doc = enquiry.ref_doc || null;
		this.state = enquiry.state || null;
		this.isSeparateTax = enquiry.isSeparateTax || false;
		this.isSeparateCommission = enquiry.isSeparateCommission || false;
		this.isSeparateDiscount = enquiry.isSeparateDiscount || false;

		this.created_by = enquiry.created_by || null;
		this.updated_by = enquiry.updated_by || null;
		this.created_at = enquiry.created_at || null;
		this.updated_at = enquiry.updated_at || null;

		this.tableName = enquiry.tableName || null;
		this.customer = enquiry.customer || null;
		this.agent = enquiry.agent || null;
		this.payment_term = enquiry.payment_term || null;
		this.paymentTermDescription = enquiry.paymentTermDescription || null;
		this.delivery_term = enquiry.delivery_term || null;
		this.deliveryTermDescription = enquiry.deliveryTermDescription || null;
		this.enquiry_items = enquiry.enquiry_items || [];
		this.delivery_address = enquiry.delivery_address || null;
		this.itemsCount = enquiry.itemsCount || null;
	
		this.customerName = enquiry.customerName || null;
		this.customerCode = enquiry.customerCode || null;
	}
}


export class EnquiryMapModel {
	data: any;

	/** Constructor */
	constructor(response) {

		let datas = (response && response.data && response.data.length > 0) ? response.data : [];
		datas = (datas && datas.length < 1 && response && response.data && response.data.data && response.data.data.length > 0) ? response.data.data : datas;
		let additional = (response && response.additional) ? response.additional : null;
		let items: Enquiry[] = [];
		if (datas && datas.length > 0) {
			for (let i = 0; i <= datas.length; i++) {
				let item = datas[i];
				if (item && item.id) {
					items[i] = new EnquiryModel(datas[i], additional);
				}
			}
		}

		this.data = {};
		this.data.data = items;
	}
}
