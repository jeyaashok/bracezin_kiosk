import { Section } from '../section';
import { Product } from '../product/product.interface';

export class SectionModel {
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
	 * @param section
	 */
	constructor(section, additional: any = null) {
		this.id = section.id || null;
		this.code = section.code || null;
		this.name = section.name || null;
		this.description = section.description || null;
		this.is_active = section.is_active || true;

		this.created_by = section.created_by || null;
		this.updated_by = section.updated_by || null;
		this.created_at = section.created_at || null;
		this.updated_at = section.updated_at || null;

		this.tableName = section.tableName || null;
		this.image = section.image || null;
		this.products = section.products || null;
		this.productsCount = section.productsCount ?? (section.products ? section.products.length : 0);
	}
}


export class SectionMapModel {
	data: any;

	/** Constructor */
	constructor(response) {

		let datas = (response && response.data && response.data.length > 0) ? response.data : [];
		datas = (datas && datas.length < 1 && response && response.data && response.data.data && response.data.data.length > 0) ? response.data.data : datas;
		let additional = (response && response.additional) ? response.additional : null;
		let items: Section[] = [];
		if (datas && datas.length > 0) {
			for (let i = 0; i <= datas.length; i++) {
				let item = datas[i];
				if (item && item.id) {
					items[i] = new SectionModel(datas[i], additional);
				}
			}
		}

		this.data = {};
		this.data.data = items;
	}
}
