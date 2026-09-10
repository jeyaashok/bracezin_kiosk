export interface DeliveryTerm {
	id: number;
  code: string;
  name: string;
  nation: string;
  city: string;
  state: string;
  country: string;
  description?: string;
  // type?: string;
  // estimated_min_days?: number
  // estimated_max_days?: number;
  // estimated_cost?: number;
  is_active: boolean;

	created_by?: number;
	updated_by?: number;
	created_at?: Date;
	updated_at?: Date;

	tableName?: string;
}