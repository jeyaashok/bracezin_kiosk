export interface FinancialYear {
	id: number;
	name: string;
	start_date: Date;
	end_date: Date;
	is_active: boolean;
	description: string;

	created_by?: number;
	updated_by?: number;
	created_at?: Date;
	updated_at?: Date;

	tableName?: string;
}
