import { DeliveryTerm } from './delivery_term.interface';

export class DeliveryTermModel {
	id: number;
	code: string;
	name: string;
  nation: string;
  city: string;
  state: string;
  country: string;
	description?: string;
	// type?: string;
	// estimated_min_days?: number
	// estimated_max_days?: number;
	// estimated_cost?: number;
	is_active: boolean;

	created_by?: number;
	updated_by?: number;
	created_at?: Date;
	updated_at?: Date;

	tableName?: string;

	/**
	 * Constructor
	 *
	 * @param deliveryTerm
	 */
	constructor(deliveryTerm, additional: any = null) {
		this.id = deliveryTerm.id || null;
		this.code = deliveryTerm.code || null;
		this.name = deliveryTerm.name || null;
    this.nation = deliveryTerm.nation || null;
    this.city = deliveryTerm.city || null;
    this.state = deliveryTerm.state || null;
    this.country = deliveryTerm.country || null;
		this.description = deliveryTerm.description || null;
		// this.type = deliveryTerm.type || 'standard';
		// this.estimated_min_days = deliveryTerm.estimated_min_days || null;
		// this.estimated_max_days = deliveryTerm.estimated_max_days || null;
		// this.estimated_cost = deliveryTerm.estimated_cost || null;
		this.is_active = deliveryTerm.is_active || false;

		this.created_by = deliveryTerm.created_by || null;
		this.updated_by = deliveryTerm.updated_by || null;
		this.created_at = deliveryTerm.created_at || null;
		this.updated_at = deliveryTerm.updated_at || null;

		this.tableName = deliveryTerm.tableName || null;
	}
}


export class DeliveryTermMapModel {
	data: any;

	/** Constructor */
	constructor(response) {

		let datas = (response && response.data && response.data.length > 0) ? response.data : [];
		datas = (datas && datas.length < 1 && response && response.data && response.data.data && response.data.data.length > 0) ? response.data.data : datas;
		let additional = (response && response.additional) ? response.additional : null;
		let items: DeliveryTermModel[] = [];
		if (datas && datas.length > 0) {
			for (let i = 0; i <= datas.length; i++) {
				let item = datas[i];
				if (item && item.id) {
					items[i] = new DeliveryTermModel(datas[i], additional);
				}
			}
		}

		this.data = {};
		this.data.data = items;
	}
}
