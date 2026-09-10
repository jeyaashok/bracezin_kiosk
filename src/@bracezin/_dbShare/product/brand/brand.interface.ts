import { Product } from '../product/product.interface';

export interface Brand {
	id: number;
	code: string;
	name: string;
	description?: string;
	is_active: boolean;

	created_by?: number;
	updated_by?: number;
	created_at?: Date;
	updated_at?: Date;

	tableName?: string;
	image?: string;
	products?: Product[];
	productsCount?: number;
}
