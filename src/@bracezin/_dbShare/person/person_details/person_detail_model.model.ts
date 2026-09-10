import { PersonDetail } from 'src/@bracezin/_dbShare/person/person_details';

export class PersonDetailModel {
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

	/**
	 * Constructor
	 *
	 * @param person_detail
	 */
    constructor(person_detail, additional: any = null) {
		this.id = person_detail.id || null;
		this.code = person_detail.code || null;
		this.user_id = person_detail.user_id || null;
		this.company_name = person_detail.company_name || null;
		this.company_register_no = person_detail.company_register_no || null;
		this.initial = person_detail.initial || null;
		this.surname = person_detail.surname || null;
		this.firstname = person_detail.firstname || null;
		this.lastname = person_detail.lastname || null;
		
		this.father_name = person_detail.father_name || null;
		this.mother_name = person_detail.mother_name || null;
		this.mobile = person_detail.mobile || null;
		this.home_phone = person_detail.home_phone || null;
		this.emergency_phone = person_detail.emergency_phone || null;
		this.date_of_birth = person_detail.date_of_birth || null;
		this.blood_group = person_detail.blood_group || null;
		this.age = person_detail.age || null;
		this.gender = person_detail.gender || null;
		this.marital_status = person_detail.marital_status || null;
		this.vat_number = person_detail.vat_number || null;
		this.ein_number = person_detail.ein_number || null;
		
		this.address_doorno = person_detail.address_doorno || null;
		this.address_line1 = person_detail.address_line1 || null;
		this.address_line2 = person_detail.address_line2 || null;
		this.landmark = person_detail.landmark || null;
		this.city = person_detail.city || null;
		this.state = person_detail.state || null;
		this.country = person_detail.country || null;
		this.pincode = person_detail.pincode || null;
		this.latitude = person_detail.latitude || null;
		this.longitude = person_detail.longitude || null;
		this.geo_location = person_detail.geo_location || null;
		
		this.qualification = person_detail.qualification || null;
		this.business_brand_name = person_detail.business_brand_name || null;
		this.business_category = person_detail.business_category || null;
		this.office_phone = person_detail.office_phone || null;
		this.department = person_detail.department || null;
		this.designation = person_detail.designation || null;
		this.authority_person = person_detail.authority_person || null;
		this.authority_email = person_detail.authority_email || null;
		this.authority_mobile = person_detail.authority_mobile || null;
		
		this.image_api = person_detail.image_api || null;
		this.json = person_detail.json || null;
		this.short_note = person_detail.short_note || null;
		this.detail_about = person_detail.detail_about || null;
		
		this.created_by = person_detail.created_by || null;
		this.updated_by = person_detail.updated_by || null;
		this.created_at = person_detail.created_at || null;
		this.updated_at = person_detail.updated_at || null;

		this.tableName = person_detail.tableName || null;
	}
}


export class PersonDetailMapModel {
    data: any;

    /** Constructor */
    constructor(response) {

        let datas = (response && response.data && response.data.length > 0) ? response.data : [];
        let additional = (response && response.additional) ? response.additional : null;
        let items: PersonDetail[] = [];
        if (datas && datas.length > 0) {
            for (let i = 0; i <= datas.length; i++) {
                let item = datas[i];
                if (item && item.id) {
                    items[i] = new PersonDetailModel(datas[i], additional);
                }
            }
        }

        this.data = {};
        this.data.data = items;
    }
}
