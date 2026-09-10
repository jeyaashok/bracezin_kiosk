import { EnquiryItem } from '../enquiry_item';
import { Enquiry } from '../enquiry';
import { SaleOrder } from '../sale_order';
import { QuoteRequestItem } from '../quote_request_item';

export class EnquiryItemModel {
	id: number;
	enquiry_id: number;
	sale_order_id?: number;
	product_id: number;
	code_text: string;
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
  productName?: string;
  quoteRequestCode?: string;
  productCode?: string;
  enquiryCode?: string;
  saleOrderCode?: string;
  enquiry?: Enquiry;
  sale_order?: SaleOrder;
  product?: any;
  vendorName?: string;
  vendorCode?: string;
  accepted_quote_request_item?: QuoteRequestItem;

	/**
	 * Constructor
	 *
	 * @param enquiryItem
	 */
	constructor(enquiryItem, additional: any = null) {
		this.id = enquiryItem.id || null;
		this.enquiry_id = enquiryItem.enquiry_id || null;
		this.sale_order_id = enquiryItem.sale_order_id || null;
		this.product_id = enquiryItem.product_id || null;
		this.code_text = enquiryItem.code_text || null;
		this.uom = enquiryItem.uom || null;
		this.total_weight = enquiryItem.total_weight || null;
		this.pcs = enquiryItem.pcs || null;
		this.qty = enquiryItem.qty || 1;
		this.price_per_uom = enquiryItem.price_per_uom || null;
		this.discount_percentage = enquiryItem.discount_percentage || null;
		this.discount = enquiryItem.discount || null;
		this.tax_percentage = enquiryItem.tax_percentage || null;
		this.tax = enquiryItem.tax || null;
		this.commission_percentage = enquiryItem.commission_percentage || null;
		this.commission = enquiryItem.commission || null;
		this.amount = enquiryItem.amount || null;
		this.state = enquiryItem.state || null;
		this.description = enquiryItem.description || null;

		this.created_by = enquiryItem.created_by || null;
		this.updated_by = enquiryItem.updated_by || null;
		this.created_at = enquiryItem.created_at || null;
		this.updated_at = enquiryItem.updated_at || null;

		this.tableName = enquiryItem.tableName || null;
		this.productName = enquiryItem.productName || null;
    this.quoteRequestCode = enquiryItem.quoteRequestCode || null;
		this.productCode = enquiryItem.productCode || null;
		this.enquiryCode = enquiryItem.enquiryCode || null; 
		this.saleOrderCode = enquiryItem.saleOrderCode || null;
		this.enquiry = enquiryItem.enquiry || null;
		this.sale_order = enquiryItem.saleOrder || null;
		this.product = enquiryItem.product || null;
    this.vendorName = enquiryItem.vendorName || null;
    this.vendorCode = enquiryItem.vendorCode || null;
    this.accepted_quote_request_item = enquiryItem.accepted_quote_request_item || null;
	}
}


export class EnquiryItemMapModel {
	data: any;

	/** Constructor */
	constructor(response) {

		let datas = (response && response.data && response.data.length > 0) ? response.data : [];
		datas = (datas && datas.length < 1 && response && response.data && response.data.data && response.data.data.length > 0) ? response.data.data : datas;
		let additional = (response && response.additional) ? response.additional : null;
		let items: EnquiryItem[] = [];
		if (datas && datas.length > 0) {
			for (let i = 0; i <= datas.length; i++) {
				let item = datas[i];
				if (item && item.id) {
					items[i] = new EnquiryItemModel(datas[i], additional);
				}
			}
		}

		this.data = {};
		this.data.data = items;
	}
}
