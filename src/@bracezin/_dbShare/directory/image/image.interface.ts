export interface Image {
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
}
