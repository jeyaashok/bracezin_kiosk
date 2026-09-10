import { Wallet } from './wallet.interface';
import { User } from 'src/@bracezin/_dbShare/user';
import { Payout } from 'src/@bracezin/_dbShare/wallet/payout';

export class WalletModel {
	id: number;
	code: string;
	user_id: number;
	resource_id: number;
	resource_type: string;
	type: string;
	price: number;
	recent_balance: number;
	json: any;
	description: string;

	created_by?: number;
	updated_by?: number;
	created_at?: Date;
	updated_at?: Date;

	tableName?: string;
	user?: User;
	resource?: any;
  payout?: Payout;

	/**
	 * Constructor
	 *
	 * @param wallet
	 */
	constructor(wallet, additional: any = null) {
		this.id = wallet.id || null;
		this.code = wallet.code || null;
		this.user_id = wallet.user_id || null;
		this.resource_id = wallet.resource_id || null;
		this.resource_type = wallet.resource_type || null;
		this.type = wallet.type || null;
		this.price = wallet.price || null;
		this.recent_balance = wallet.recent_balance || null;
		this.json = wallet.json || null;
		this.description = wallet.description || null;

		this.created_by = wallet.created_by || null;
		this.updated_by = wallet.updated_by || null;
		this.created_at = wallet.created_at || null;
		this.updated_at = wallet.updated_at || null;

		this.tableName = wallet.tableName || null;
		this.user = wallet.user || null;
		this.resource = wallet.resource || null;
    this.payout = wallet.payout || null;
	}
}


export class WalletMapModel {
	data: any;

	/** Constructor */
	constructor(response) {

		let datas = (response && response.data && response.data.length > 0) ? response.data : [];
		datas = (datas && datas.length < 1 && response && response.data && response.data.data && response.data.data.length > 0) ? response.data.data : datas;
		let additional = (response && response.additional) ? response.additional : null;
		let items: Wallet[] = [];
		if (datas && datas.length > 0) {
			for (let i = 0; i <= datas.length; i++) {
				let item = datas[i];
				if (item && item.id) {
					items[i] = new WalletModel(datas[i], additional);
				}
			}
		}

		this.data = {};
		this.data.data = items;
	}
}
