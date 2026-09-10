import { FinancialYear } from 'src/@bracezin/_dbShare/setting/financial_year';

export class FinancialYearModel {
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

    /**
     * Constructor
     *
     * @param financialYear
     */
    constructor(financialYear, additional: any = null) {
            this.id = financialYear.id || null;
						this.name = financialYear.name || null;
						this.start_date = financialYear.start_date || null;
						this.end_date = financialYear.end_date || null;
						this.is_active = financialYear.is_active || null;
            this.description = financialYear.description || null;

            this.created_by = financialYear.created_by || null;
            this.updated_by = financialYear.updated_by || null;
            this.created_at = financialYear.created_at || null;
            this.updated_at = financialYear.updated_at || null;

						this.tableName = financialYear.tableName || null;

    }
}


export class FinancialYearMapModel {
	data: any;

	/** Constructor */
	constructor(response) {

		let datas = (response && response.data && response.data.length > 0) ? response.data : [];
		datas = (datas && datas.length < 1 && response && response.data && response.data.data && response.data.data.length > 0) ? response.data.data : datas;
		let additional = (response && response.additional) ? response.additional : null;
		let items: FinancialYear[] = [];
		if (datas && datas.length > 0) {
			for (let i = 0; i <= datas.length; i++) {
				let item = datas[i];
				if (item && item.id) {
					items[i] = new FinancialYearModel(datas[i], additional);
				}
			}
		}

		this.data = {};
		this.data.data = items;
	}
}