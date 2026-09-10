export interface Notify {
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
}
