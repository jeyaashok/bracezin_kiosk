export interface Media {
	id: string | number;
    _id: string | number;
	user_id: number;
	client_id: number;
	name: string;
	file_name: string;
	mime: string;
	type: string;
	url: string;
	preview_url: string;
	size: string;
	is_active: boolean;
    is_favorite: boolean;
	shared_by: number;
	created_by?: number;
	updated_by?: number;
	created_at?: Date;
	updated_at?: Date;
	sharedWith: any;
	sharedId: number;
	tableName?: string;
    sharedByName?: string;
	extention?:any;
	favorite?:any;
	sizeData?: string;
	isSelected: boolean;
	isAccess: boolean
	createdBy: any;
	rawUrl: string;
	mediatags: any;
}

export interface MediaPanelConfig {
	showCaption: boolean;
	showSelect: boolean;
	isChatMedia: boolean;
}
