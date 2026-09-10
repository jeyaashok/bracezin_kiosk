import { Notify } from 'src/@bracezin/_dbShare/notify';

export class NotifyModel {
	id: number;
	person_id: number;
	Person_type: string;
	from_id: number;
	from_type: string;
	type_id: number;
	title: string;
	description: string;
	created_by?: number;
	updated_by?: number;
	created_at?: Date;
	updated_at?: Date;

	tableName: string;
	data?: any;

	/**
	 * Constructor
	 *
	 * @param notify
	 */
    constructor(notify, additional: any = null) {
		this.id = notify.id || null;
		this.person_id = notify.person_id || null;
		this.Person_type = notify.Person_type || null;
		this.from_id = notify.from_id || null;
		this.from_type = notify.from_type || null;
		this.type_id = notify.type_id || null;
		this.title = notify.title || null;
		this.description = notify.description || null;
		this.created_by = notify.created_by || null;
		this.updated_by = notify.updated_by || null;
		this.created_at = notify.created_at || null;
		this.updated_at = notify.updated_at || null;

		this.tableName = notify.tableName || null;
	}
}


export class NotifyMapModel {
    data: any;

    /** Constructor */
    constructor(response) {

        let datas = (response && response.data && response.data.length > 0) ? response.data : [];
        let additional = (response && response.additional) ? response.additional : null;
        let items: Notify[] = [];
        if (datas && datas.length > 0) {
            for (let i = 0; i <= datas.length; i++) {
                let item = datas[i];
                if (item && item.id) {
                    items[i] = new NotifyModel(datas[i], additional);
                }
            }
        }

        this.data = {};
        this.data.data = items;
    }
}
