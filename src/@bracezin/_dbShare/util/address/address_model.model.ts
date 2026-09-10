import { Address } from './address.interface';

export class AddressModel {
	id: number;
	user_id: number;
	title?: string;
	door_no?: string;
	line_1?: string;
	line_2?: string;
	landmark?: string;
	city?: string;
	state?: string;
	region?: string;
	country?: string;
	pincode?: string;
	is_active: boolean;

	created_by?: number;
	updated_by?: number;
	created_at?: Date;
	updated_at?: Date;
	
	tableName?: string;
	resource_type?: string;
	resource_id?: string;
	address_id?: number;
	fullAddress?: string;

	/**
	 * Constructor
	 *
	 * @param address
	 */
	constructor(address, additional: any = null) {
		this.id = address.id || null;
		this.user_id = address.user_id || null;
		this.title = address.title || null;
		this.door_no = address.door_no || null;
		this.line_1 = address.line_1 || null;
		this.line_2 = address.line_2 || null;
		this.landmark = address.landmark || null;
		this.city = address.city || null;
		this.state = address.state || null;
		this.region = address.region || null;
		this.country = address.country || null;
		this.pincode = address.pincode || null;
		this.landmark = address.landmark || null;
		this.is_active = address.is_active || false;

		this.created_by = address.created_by || null;
		this.updated_by = address.updated_by || null;
		this.created_at = address.created_at || null;
		this.updated_at = address.updated_at || null;

		this.tableName = address.tableName || null;
		this.resource_type = address.resource_type || null;
		this.resource_id = address.resource_id || null;
		this.address_id = address.address_id || null;
		this.fullAddress = address.fullAddress || this.getFullAddress();
	}

	private getFullAddress(): string {
		return `${this.door_no || ''} ${this.line_1 || ''} ${this.line_2 || ''} ${this.landmark || ''} ${this.city || ''} ${this.state || ''} ${this.region || ''} ${this.country || ''} ${this.pincode || ''}`.trim();
	}
}


export class AddressMapModel {
	data: any;

	/** Constructor */
	constructor(response) {

		let datas = (response && response.data && response.data.length > 0) ? response.data : [];
		datas = (datas && datas.length < 1 && response && response.data && response.data.data && response.data.data.length > 0) ? response.data.data : datas;
		let additional = (response && response.additional) ? response.additional : null;
		let items: Address[] = [];
		if (datas && datas.length > 0) {
			for (let i = 0; i <= datas.length; i++) {
				let item = datas[i];
				if (item && item.id) {
					items[i] = new AddressModel(datas[i], additional);
				}
			}
		}

		this.data = {};
		this.data.data = items;
	}
}
