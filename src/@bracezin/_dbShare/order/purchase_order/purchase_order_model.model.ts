import { PurchaseOrder } from '.';
import { QuoteRequestItem } from '../quote_request_item';
import { User } from 'src/@bracezin/_dbShare/user';
import { PaymentTerm, DeliveryTerm, Address } from 'src/@bracezin/_dbShare/util';

export class PurchaseOrderModel {
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
		childrens?: PurchaseOrder[];
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
	 * @param purchaseOrder
	 */
	constructor(purchaseOrder, additional: any = null) {
		this.id = purchaseOrder.id || null;
		this.parent_id = purchaseOrder.parent_id || null;
		this.code = purchaseOrder.code || null;
		this.po_code = purchaseOrder.po_code || null;
		this.vendor_id = purchaseOrder.vendor_id || null;
		this.agent_id = purchaseOrder.agent_id || null;
		this.payment_term_id = purchaseOrder.payment_term_id || null;
		this.delivery_term_id = purchaseOrder.delivery_term_id || null;
		this.sub_total = purchaseOrder.sub_total || null;
		this.discount_percentage = purchaseOrder.discount_percentage || null;
		this.discount = purchaseOrder.discount || null;
		this.tax_percentage = purchaseOrder.tax_percentage || null;
		this.tax = purchaseOrder.tax || null;
		this.commission_percentage = purchaseOrder.commission_percentage || null;
		this.commission = purchaseOrder.commission || null;
		this.total = purchaseOrder.total || null;
		this.currency_value = purchaseOrder.currency_value || 1;
		this.currency = purchaseOrder.currency || 'USD';
		this.order_date = purchaseOrder.order_date || null;
		this.delivery_date = purchaseOrder.delivery_date || null;
		this.note = purchaseOrder.note || null;
		this.ref_doc = purchaseOrder.ref_doc || null;
		this.state = purchaseOrder.state || null;

		this.isSeparateTax = purchaseOrder.isSeparateTax || false;
		this.isSeparateCommission = purchaseOrder.isSeparateCommission || false;
		this.isSeparateDiscount = purchaseOrder.isSeparateDiscount || false;

		this.created_by = purchaseOrder.created_by || null;
		this.updated_by = purchaseOrder.updated_by || null;
		this.created_at = purchaseOrder.created_at || null;
		this.updated_at = purchaseOrder.updated_at || null;

		this.tableName = purchaseOrder.tableName || null;
		this.childrens = purchaseOrder.childrens || null;
		this.vendor = purchaseOrder.vendor || null;
		this.agent = purchaseOrder.agent || null;
		this.payment_term = purchaseOrder.payment_term || null;
		this.paymentTermDescription = purchaseOrder.paymentTermDescription || null;
		this.delivery_term = purchaseOrder.delivery_term || null;
		this.deliveryTermDescription = purchaseOrder.deliveryTermDescription || null;
		this.quote_request_items = purchaseOrder.quote_request_items || null;
		this.delivery_address = purchaseOrder.delivery_address || null;
		this.itemsCount = purchaseOrder.itemsCount || 0;
    this.walletBalance = purchaseOrder.walletBalance || 0;
	}
}


export class PurchaseOrderMapModel {
	data: any;

	/** Constructor */
	constructor(response) {

		let datas = (response && response.data && response.data.length > 0) ? response.data : [];
		datas = (datas && datas.length < 1 && response && response.data && response.data.data && response.data.data.length > 0) ? response.data.data : datas;
		let additional = (response && response.additional) ? response.additional : null;
		let items: PurchaseOrder[] = [];
		if (datas && datas.length > 0) {
			for (let i = 0; i <= datas.length; i++) {
				let item = datas[i];
				if (item && item.id) {
					items[i] = new PurchaseOrderModel(datas[i], additional);
				}
			}
		}

		this.data = {};
		this.data.data = items;
	}
}
