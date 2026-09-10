import { Pclass } from '../pclass';
import { Product } from '../product/product.interface';

export class PclassModel {
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
	 * @param pclass
	 */
	constructor(pclass, additional: any = null) {
		this.id = pclass.id || null;
		this.code = pclass.code || null;
		this.name = pclass.name || null;
		this.description = pclass.description || null;
		this.is_active = pclass.is_active || true;

		this.created_by = pclass.created_by || null;
		this.updated_by = pclass.updated_by || null;
		this.created_at = pclass.created_at || null;
		this.updated_at = pclass.updated_at || null;

		this.tableName = pclass.tableName || null;
		this.image = pclass.image || null;
		this.products = pclass.products || null;
		this.productsCount = pclass.productsCount ?? (pclass.products ? pclass.products.length : 0);
	}
}


export class PclassMapModel {
	data: any;

	/** Constructor */
	constructor(response) {

		let datas = (response && response.data && response.data.length > 0) ? response.data : [];
		datas = (datas && datas.length < 1 && response && response.data && response.data.data && response.data.data.length > 0) ? response.data.data : datas;
		let additional = (response && response.additional) ? response.additional : null;
		let items: Pclass[] = [];
		if (datas && datas.length > 0) {
			for (let i = 0; i <= datas.length; i++) {
				let item = datas[i];
				if (item && item.id) {
					items[i] = new PclassModel(datas[i], additional);
				}
			}
		}

		this.data = {};
		this.data.data = items;
	}
}
