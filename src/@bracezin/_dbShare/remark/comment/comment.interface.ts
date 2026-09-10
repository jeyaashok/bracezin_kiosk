export interface Comment {
	id: number;
	resource_id: number;
	resource_type: string;
	comment_id: number;
	user_id: number;
	type: string;
	title: string;
	description: string;
	rating: number;

	created_by?: number;
	updated_by?: number;
	created_at?: Date;
	updated_at?: Date;

	tableName?: string;
	resource?: any;
}
