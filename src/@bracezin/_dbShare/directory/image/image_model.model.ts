import { Image } from 'src/@bracezin/_dbShare/directory/image';

export class ImageModel {
	id: number;
	code: string;
	resource_id: number;
	resource_type: string;
	name: string;
	file_name: string;
	location: string;
	mime: string;
	size: number;
	is_active: boolean;
	is_primary: boolean;
	is_sysImage: boolean;
	description: string;
	created_by?: number;
	updated_by?: number;
	created_at?: Date;
	updated_at?: Date;

	tableName?: string;
	url?: string;

	/**
	 * image
	 *
	 * @param image
	 */
    constructor(image, additional: any = null) {
		this.id = image.id || null;
		this.code = image.code || null;
		this.resource_id = image.resource_id || null;
		this.resource_type = image.resource_type || null;
		this.name = image.name || null;
		this.file_name = image.file_name || null;
		this.location = image.location || null;
		this.mime = image.mime || null;
		this.size = image.size || null;
		this.is_active = image.is_active || null;
		this.is_primary = image.is_primary || null;
		this.is_sysImage = image.is_sysImage || null;
		this.description = image.description || null;
		this.created_by = image.created_by || null;
		this.updated_by = image.updated_by || null;
		this.created_at = image.created_at || null;
		this.updated_at = image.updated_at || null;
	}
}


export class ImageMapModel {
    data: any;

    /** Constructor */
    constructor(response) {

        let datas = (response && response.data && response.data.length > 0) ? response.data : [];
        let additional = (response && response.additional) ? response.additional : null;
        let items: Image[] = [];
        if (datas && datas.length > 0) {
            for (let i = 0; i <= datas.length; i++) {
                let item = datas[i];
                if (item && item.id) {
                    items[i] = new ImageModel(datas[i], additional);
                }
            }
        }

        this.data = {};
        this.data.data = items;
    }
}
