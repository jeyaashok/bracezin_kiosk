import { Enquiry } from '../enquiry';
import { QuoteRequestItem } from '../quote_request_item';
import { SaleOrder } from '../sale_order';

export interface EnquiryItem {
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
}