import { SaleOrder } from '../sale_order';
import { User } from '../../user';
import { PaymentTerm } from 'src/@bracezin/_dbShare/util';

export interface SaleInvoice {
	id: number;
	code: string;
	sale_order_id?: number;
	customer_id?: number;
	payment_term_id?: number;
	state: string;

	created_by?: number;
	updated_by?: number;
	created_at?: Date;
	updated_at?: Date;

	tableName?: string;
	sale_order?: SaleOrder;
	customer?: User;
	payment_term?: PaymentTerm;
	walletBalance?: number;
}
