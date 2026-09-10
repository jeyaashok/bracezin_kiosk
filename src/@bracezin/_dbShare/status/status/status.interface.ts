export interface Status {
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
}