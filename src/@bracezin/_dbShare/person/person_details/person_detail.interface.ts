export interface PersonDetail {
	id: number;
	code: string;
	user_id: number;
	company_name: string;
	company_register_no: string;
	initial: string;
	surname: string;
	firstname: string;
	lastname: string;

	father_name: string;
	mother_name: string;
	mobile: string;
	home_phone: string;
	emergency_phone: string;
	date_of_birth: Date;
	blood_group: string;
	age: number;
	gender: string;
	marital_status: string;
	vat_number: string;
	ein_number: string;

	address_doorno: string;
	address_line1: string;
	address_line2: string;
	landmark: string;
	city: string;
	state: string;
	country: string;
	pincode: string;
	latitude: string;
	longitude: string;
	geo_location: any;

	qualification: string;
	business_brand_name: string;
	business_category: string;
	office_phone: string;
	department: string;
	designation: string;
	authority_person: string;
	authority_email: string;
	authority_mobile: string;

	image_api: string;
	json: string;
	short_note: string;
	detail_about: string;

	created_by?: number;
	updated_by?: number;
	created_at?: Date;
	updated_at?: Date;

	tableName?: string;
}