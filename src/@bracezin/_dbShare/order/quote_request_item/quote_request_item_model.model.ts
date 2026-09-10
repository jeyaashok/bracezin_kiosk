import { QuoteRequestItem } from '../quote_request_item';
import { QuoteRequest } from '../quote_request';
import { Enquiry } from '../enquiry';
import { EnquiryItem } from '../enquiry_item';
import { Product } from '@bracezin/_dbShare/product/product';

export class QuoteRequestItemModel {
	id: number;
	quote_request_id: number;
	enquiry_id?: number;
	enquiry_item_id?: number;
	product_id: number;
	uom: string;
	total_weight: number;
	pcs: number;
	qty: number;
	price_per_uom: number;
	discount_percentage: number;
	discount: number;
	tax_percentage: number;
	tax: number;
	commission_percentage: number;
	commission: number;
	amount: number;
	state: string;
  description?: string;

	created_by?: number;
	updated_by?: number;
	created_at?: Date;
	updated_at?: Date;

	tableName?: string;
	quote_request?: QuoteRequest;
	enquiry?: Enquiry;
	enquiry_item?: EnquiryItem;
	enquiryCode?: string;
	product?: Product;

	/**
	 * Constructor
	 *
	 * @param quoteRequestItem
	 */
	constructor(quoteRequestItem, additional: any = null) {
		this.id = quoteRequestItem.id || null;
		this.quote_request_id = quoteRequestItem.quote_request_id || null;
		this.enquiry_id = quoteRequestItem.enquiry_id || null;
		this.enquiry_item_id = quoteRequestItem.enquiry_item_id || null;
		this.product_id = quoteRequestItem.product_id || null;
		this.uom = quoteRequestItem.uom || null;
		this.total_weight = quoteRequestItem.total_weight || null;
		this.pcs = quoteRequestItem.pcs || null;
		this.qty = quoteRequestItem.qty || null;
		this.price_per_uom = quoteRequestItem.price_per_uom || null;
		this.discount_percentage = quoteRequestItem.discount_percentage || null;
		this.discount = quoteRequestItem.discount || null;
		this.tax_percentage = quoteRequestItem.tax_percentage || null;
		this.tax = quoteRequestItem.tax || null;
		this.commission_percentage = quoteRequestItem.commission_percentage || null;
		this.commission = quoteRequestItem.commission || null;
		this.amount = quoteRequestItem.amount || null;
		this.state = quoteRequestItem.state || null;
		this.description = quoteRequestItem.description || null;

		this.created_by = quoteRequestItem.created_by || null;
		this.updated_by = quoteRequestItem.updated_by || null;
		this.created_at = quoteRequestItem.created_at || null;
		this.updated_at = quoteRequestItem.updated_at || null;

		this.tableName = quoteRequestItem.tableName || null;
		this.quote_request = quoteRequestItem.quote_request || null;
		this.enquiry = quoteRequestItem.enquiry || null;
		this.enquiry_item = quoteRequestItem.enquiry_item || null;
		this.enquiryCode = quoteRequestItem.enquiryCode || null;
		this.product = quoteRequestItem.product || null;
	}
}


export class QuoteRequestItemMapModel {
	data: any;

	/** Constructor */
	constructor(response) {

		let datas = (response && response.data && response.data.length > 0) ? response.data : [];
		datas = (datas && datas.length < 1 && response && response.data && response.data.data && response.data.data.length > 0) ? response.data.data : datas;
		let additional = (response && response.additional) ? response.additional : null;
		let items: QuoteRequestItem[] = [];
		if (datas && datas.length > 0) {
			for (let i = 0; i <= datas.length; i++) {
				let item = datas[i];
				if (item && item.id) {
					items[i] = new QuoteRequestItemModel(datas[i], additional);
				}
			}
		}

		this.data = {};
		this.data.data = items;
	}
}
