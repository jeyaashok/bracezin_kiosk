export interface PaymentTerm {
	id: number;
	code: string;
	name: string;
	description?: string;
	// due_days?: number;
	// discount_days?: number;
	// discount_percentage?: number;
	// late_fee_percentage?: number;
	is_active: boolean;

	created_by?: number;
	updated_by?: number;
	created_at?: Date;
	updated_at?: Date;

	tableName?: string;
}