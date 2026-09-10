import { User } from '../../user';
import { Enquiry } from '../enquiry';
import { Address, DeliveryTerm, PaymentTerm, EnquiryItem } from 'src/@bracezin/_dbShare';
export interface SaleOrder {
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
}