import { Payout } from './payout.interface';
import { User } from 'src/@bracezin/_dbShare/user';

export class PayoutModel {
	id: number;
  code: string;
  user_id: number;
  resource_id: number;
  resource_type: string;
  amount: number;
  method: string;
  state: string;
  description: number;
  date: Date;
  json: any;

  created_by?: number;
  updated_by?: number;
  created_at?: Date;
  updated_at?: Date;

  tableName?: string;
  user?: User;
  resource?: any;

	/**
	 * Constructor
	 *
	 * @param payout
	 */
	constructor(payout, additional: any = null) {
		this.id = payout.id || null;
		this.code = payout.code || null;
		this.user_id = payout.user_id || null;
		this.resource_id = payout.resource_id || null;
		this.resource_type = payout.resource_type || null;
		this.amount = payout.amount || null;
		this.method = payout.method || null;
		this.date = payout.date || null;
		this.json = payout.json || null;
		this.description = payout.description || null;
    this.state = payout.state || 'paid';

		this.created_by = payout.created_by || null;
		this.updated_by = payout.updated_by || null;
		this.created_at = payout.created_at || null;
		this.updated_at = payout.updated_at || null;

		this.tableName = payout.tableName || null;
		this.user = payout.user || null;
		this.resource = payout.resource || null;
	}
}


export class PayoutMapModel {
	data: any;

	/** Constructor */
	constructor(response) {

		let datas = (response && response.data && response.data.length > 0) ? response.data : [];
		datas = (datas && datas.length < 1 && response && response.data && response.data.data && response.data.data.length > 0) ? response.data.data : datas;
		let additional = (response && response.additional) ? response.additional : null;
		let items: Payout[] = [];
		if (datas && datas.length > 0) {
			for (let i = 0; i <= datas.length; i++) {
				let item = datas[i];
				if (item && item.id) {
					items[i] = new PayoutModel(datas[i], additional);
				}
			}
		}

		this.data = {};
		this.data.data = items;
	}
}
