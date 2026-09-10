import { Brand } from '../brand';
import { Product } from '../product/product.interface';

export class BrandModel {
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

	/**
	 * Constructor
	 *
	 * @param brand
	 */
	constructor(brand, additional: any = null) {
		this.id = brand.id || null;
		this.code = brand.code || null;
		this.name = brand.name || null;
		this.description = brand.description || null;
		this.is_active = brand.is_active || true;

		this.created_by = brand.created_by || null;
		this.updated_by = brand.updated_by || null;
		this.created_at = brand.created_at || null;
		this.updated_at = brand.updated_at || null;

		this.tableName = brand.tableName || null;
		this.image = brand.image || null;
		this.products = brand.products || null;
		this.productsCount = brand.productsCount ?? (brand.products ? brand.products.length : 0);
	}
}


export class BrandMapModel {
	data: any;

	/** Constructor */
	constructor(response) {

		let datas = (response && response.data && response.data.length > 0) ? response.data : [];
		datas = (datas && datas.length < 1 && response && response.data && response.data.data && response.data.data.length > 0) ? response.data.data : datas;
		let additional = (response && response.additional) ? response.additional : null;
		let items: Brand[] = [];
		if (datas && datas.length > 0) {
			for (let i = 0; i <= datas.length; i++) {
				let item = datas[i];
				if (item && item.id) {
					items[i] = new BrandModel(datas[i], additional);
				}
			}
		}

		this.data = {};
		this.data.data = items;
	}
}
