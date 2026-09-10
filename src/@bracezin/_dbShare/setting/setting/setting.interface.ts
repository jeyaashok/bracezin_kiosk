export interface Setting {
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
}
