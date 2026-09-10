import { User } from 'src/@bracezin/_dbShare/user';
import { QuoteRequestItem } from '../quote_request_item';
import { PaymentTerm, DeliveryTerm, Address } from 'src/@bracezin/_dbShare/util';

export interface PurchaseOrder {
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
}