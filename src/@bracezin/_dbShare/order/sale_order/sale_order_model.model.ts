import { SaleOrder } from './sale_order.interface';
import { User } from '../../user';
import { Enquiry } from '../enquiry';
import { Address, DeliveryTerm, PaymentTerm, EnquiryItem } from 'src/@bracezin/_dbShare';
export class SaleOrderModel {
	id: number;
		code: string;
		registration_number: string;
		enquiry_id?: number;
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
		sale_order_items?: Array<EnquiryItem>;
		enquiry_items?: Array<EnquiryItem>;
		delivery_address?: Address;
		itemsCount?: number;

		customerName?: string;
		customerCode?: string;
    saleInvoiceId?: number;
    walletBalance?: number;

	/**
	 * Constructor
	 *
	 * @param saleOrder
	 */
	constructor(saleOrder, additional: any = null) {
		this.id = saleOrder.id || null;
		this.code = saleOrder.code || null;
		this.registration_number = saleOrder.registration_number || null;
		this.enquiry_id = saleOrder.enquiry_id || null;
		this.customer_id = saleOrder.customer_id || null;
		this.agent_id = saleOrder.agent_id || null;
		this.payment_term_id = saleOrder.payment_term_id || null;
		this.delivery_term_id = saleOrder.delivery_term_id || null;
		this.sub_total = saleOrder.sub_total || null;
		this.discount_percentage = saleOrder.discount_percentage || null;
		this.discount = saleOrder.discount || null;
		this.tax_percentage = saleOrder.tax_percentage || null;
		this.tax = saleOrder.tax || null;
		this.commission_percentage = saleOrder.commission_percentage || null;
		this.commission = saleOrder.commission || null;
		this.total = saleOrder.total || null;
		this.currency_value = saleOrder.currency_value || 1;
		this.currency = saleOrder.currency || 'USD';
		this.order_date = saleOrder.order_date || null;
		this.delivery_date = saleOrder.delivery_date || null;
		this.note = saleOrder.note || null;
		this.ref_doc = saleOrder.ref_doc || null;
		this.state = saleOrder.state || null;
		this.isSeparateTax = saleOrder.isSeparateTax || null;
		this.isSeparateCommission = saleOrder.isSeparateCommission || null;
		this.isSeparateDiscount = saleOrder.isSeparateDiscount || null;

		this.created_by = saleOrder.created_by || null;
		this.updated_by = saleOrder.updated_by || null;
		this.created_at = saleOrder.created_at || null;
		this.updated_at = saleOrder.updated_at || null;

		this.tableName = saleOrder.tableName || null;
		this.customer = saleOrder.customer || null;
		this.agent = saleOrder.agent || null;
		this.payment_term = saleOrder.payment_term || null;
		this.paymentTermDescription = saleOrder.paymentTermDescription || null;
		this.delivery_term = saleOrder.delivery_term || null;
		this.deliveryTermDescription = saleOrder.deliveryTermDescription || null;
		this.sale_order_items = saleOrder.sale_order_items || [];
    this.enquiry_items = saleOrder.enquiry_items || [];
		this.delivery_address = saleOrder.delivery_address || null;
		this.itemsCount = saleOrder.itemsCount || null;

		this.customerName = saleOrder.customerName || null;
		this.customerCode = saleOrder.customerCode || null;
    this.saleInvoiceId = saleOrder.saleInvoiceId || null;
    this.walletBalance = saleOrder.walletBalance || 0;
	}
}
export class SaleOrderMapModel {
	data: any;
	/** Constructor */
	constructor(response) {
		let datas = (response && response.data && response.data.length > 0) ? response.data : [];
		datas = (datas && datas.length < 1 && response && response.data && response.data.data && response.data.data.length > 0) ? response.data.data : datas;
		let additional = (response && response.additional) ? response.additional : null;
		let items: SaleOrder[] = [];
		if (datas && datas.length > 0) {
			for (let i = 0; i < datas.length; i++) {
				let item = datas[i];
				if (item && item.id) {
					items[i] = new SaleOrderModel(datas[i], additional);
				}
			}
		}
		this.data = {};
		this.data.data = items;
	}
}