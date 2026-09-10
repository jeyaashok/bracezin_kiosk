import { Setting } from 'src/@bracezin/_dbShare/setting/setting';

export class SettingModel {
    id: number;
    field: string;
    slug: string;
    value: string;
    field_type: string;
    category: string;
    is_editable: boolean;
    description: string;
    created_by?: number;
    updated_by?: number;
    created_at?: Date;
    updated_at?: Date;
    field_type_name: string;

    /**
     * Constructor
     *
     * @param setting
     */
    constructor(setting, additional: any = null) {
            this.id = setting.id || null;
            this.field = setting.field || null;
            this.slug = setting.slug || null;
            this.value = setting.value || null;
            this.field_type = setting.field_type || null;
            this.category = setting.category || null;
            this.is_editable = setting.is_editable || null;
            this.description = setting.description || null;
            this.created_by = setting.created_by || null;
            this.updated_by = setting.updated_by || null;
            this.created_at = setting.created_at || null;
            this.updated_at = setting.updated_at || null;

            this.field_type_name = setting.field_type_name || null;
    }
}


export class SettingMapModel {
	data: any;

	/** Constructor */
	constructor(response) {

		let datas = (response && response.data && response.data.length > 0) ? response.data : [];
		datas = (datas && datas.length < 1 && response && response.data && response.data.data && response.data.data.length > 0) ? response.data.data : datas;
		let additional = (response && response.additional) ? response.additional : null;
		let items: Setting[] = [];
		if (datas && datas.length > 0) {
			for (let i = 0; i <= datas.length; i++) {
				let item = datas[i];
				if (item && item.id) {
					items[i] = new SettingModel(datas[i], additional);
				}
			}
		}

		this.data = {};
		this.data.data = items;
	}
}
