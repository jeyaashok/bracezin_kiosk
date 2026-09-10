import { Category } from '../category';
import { Brand } from '../brand';
import { Pclass } from '../pclass';
import { Section } from '../section';
import { Product } from '../product';

export class ProductModel {
	id: number;
	category_id: number;
	brand_id?: number;
	pclass_id?: number;
	section_id?: number;
	code: string;
	art_code: string;
	name: string;
	description: string;
	uom: string;
	total_weight: number;
	pcs: number;
	image: string;
	json: JSON;
	is_active: boolean;

	created_by?: number;
	updated_by?: number;
	created_at?: Date;
	updated_at?: Date;

	tableName?: string;
  categoryName?: string;
  brandName?: string;
  pclassName?: string;
  sectionName?: string;

	category?: Category;
	brand?: Brand;
	pclass?: Pclass;
	section?: Section;

	/**
	 * Constructor
	 *
	 * @param product
	 */
	constructor(product, additional: any = null) {
		this.id = product.id || null;
		this.category_id = product.category_id || null;
		this.brand_id = product.brand_id || null;
		this.pclass_id = product.pclass_id || null;
		this.section_id = product.section_id || null;
		this.code = product.code || null;
		this.art_code = product.art_code || null;
		this.name = product.name || null;
		this.description = product.description || null;
		this.uom = product.uom || null;
		this.total_weight = product.total_weight || 0;
		this.pcs = product.pcs || 0;
		this.image = product.image || null;
		this.json = product.json || null;
		this.is_active = product.is_active || true;

		this.created_by = product.created_by || null;
		this.updated_by = product.updated_by || null;
		this.created_at = product.created_at || null;
		this.updated_at = product.updated_at || null;

		this.tableName = product.tableName || null;
		this.categoryName = product.categoryName || product?.category?.name || null;
    this.brandName = product.brandName || product?.brand?.name || null;
    this.pclassName = product.pclassName || product?.pclass?.name || null;
    this.sectionName = product.sectionName || product?.section?.name || null;

		this.category = product.category || null;
		this.brand = product.brand || null;
		this.pclass = product.pclass || null;
		this.section = product.section || null;
	}
}


export class ProductMapModel {
	data: any;

	/** Constructor */
	constructor(response) {

		let datas = (response && response.data && response.data.length > 0) ? response.data : [];
		datas = (datas && datas.length < 1 && response && response.data && response.data.data && response.data.data.length > 0) ? response.data.data : datas;
		let additional = (response && response.additional) ? response.additional : null;
		let items: Product[] = [];
		if (datas && datas.length > 0) {
			for (let i = 0; i <= datas.length; i++) {
				let item = datas[i];
				if (item && item.id) {
					items[i] = new ProductModel(datas[i], additional);
				}
			}
		}

		this.data = {};
		this.data.data = items;
	}
}
