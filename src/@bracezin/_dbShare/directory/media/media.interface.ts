export interface Media {
	id: string | number;
	user_id: number;
	resource_id: number;
	resource_type: string;
	model_id: number;
	model_type: string;
	shared_by: number;
	document_type: string;
	name: string;
	filename: string;
	location: string;
	dirname: string;
	mime: string;
	size: number;
	fileSize?: string;
	extension: string;
	etag: string;
	disk: string;
	url: string;
	thumb_url?: string;
	type: string;
	is_active: boolean;
	is_primary: boolean;
    is_favorite: boolean;
    is_local_server: boolean;
	created_by?: number;
	updated_by?: number;
	created_at?: Date;
	updated_at?: Date;

	tableName?: string;
    sharedByName?: string;
}

export interface MediaPanelConfig {
	showCaption: boolean;
	showSelect: boolean;
	isChatMedia: boolean;
}
