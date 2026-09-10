import { Status } from './status.interface';

export class StatusModel {
	id: number;
	model_id: number;
	model_type: string;
	name: string;
	reason: string;

	created_by?: number;
	updated_by?: number;
	created_at?: Date;
	updated_at?: Date;

	tableName?: string;

	/**
	 * Constructor
	 *
	 * @param status
	 */
	constructor(status, additional: any = null) {
		this.id = status.id || null;
		this.model_id = status.model_id || null;
		this.model_type = status.model_type || null;
		this.name = status.name || null;
		this.reason = status.reason || null;

		this.created_by = status.created_by || null;
		this.updated_by = status.updated_by || null;
		this.created_at = status.created_at || null;
		this.updated_at = status.updated_at || null;

		this.tableName = status.tableName || null;
	}
}


export class StatusMapModel {
	data: any;

	/** Constructor */
	constructor(response) {

		let datas = (response && response.data && response.data.length > 0) ? response.data : [];
		datas = (datas && datas.length < 1 && response && response.data && response.data.data && response.data.data.length > 0) ? response.data.data : datas;
		let additional = (response && response.additional) ? response.additional : null;
		let items: Status[] = [];
		if (datas && datas.length > 0) {
			for (let i = 0; i <= datas.length; i++) {
				let item = datas[i];
				if (item && item.id) {
					items[i] = new StatusModel(datas[i], additional);
				}
			}
		}

		this.data = {};
		this.data.data = items;
	}
}
