export interface Address {
	id: number;
	user_id: number;
	title?: string;
	door_no?: string;
	line_1?: string;
	line_2?: string;
	landmark?: string;
	city?: string;
	state?: string;
	region?: string;
	country?: string;
	pincode?: string;
	is_active: boolean;

	created_by?: number;
	updated_by?: number;
	created_at?: Date;
	updated_at?: Date;
	
	tableName?: string;
	resource_type?: string;
	resource_id?: string;
	address_id?: number;
}