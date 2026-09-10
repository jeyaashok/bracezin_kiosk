import { QuoteRequest } from '../quote_request';
import { Enquiry } from '../enquiry';
import { EnquiryItem } from '../enquiry_item';
import { Product } from '@bracezin/_dbShare/product/product';

export interface QuoteRequestItem {
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
}