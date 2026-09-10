import { WalletBalance } from './wallet_balance.interface';
import { User } from 'src/@bracezin/_dbShare/user';

export class WalletBalanceModel {
	id: number;
	user_id: number;
	amount: number;

	created_by?: number;
	updated_by?: number;
	created_at?: Date;
	updated_at?: Date;

	tableName?: string;
	user?: User;

	/**
	 * Constructor
	 *
	 * @param walletBalance
	 */
	constructor(walletBalance, additional: any = null) {
		this.id = walletBalance.id || null;
		this.user_id = walletBalance.user_id || null;
		this.amount = walletBalance.amount || null;

		this.created_by = walletBalance.created_by || null;
		this.updated_by = walletBalance.updated_by || null;
		this.created_at = walletBalance.created_at || null;
		this.updated_at = walletBalance.updated_at || null;

		this.tableName = walletBalance.tableName || null;
		this.user = walletBalance.user || null;
	}
}


export class WalletBalanceMapModel {
	data: any;

	/** Constructor */
	constructor(response) {

		let datas = (response && response.data && response.data.length > 0) ? response.data : [];
		datas = (datas && datas.length < 1 && response && response.data && response.data.data && response.data.data.length > 0) ? response.data.data : datas;
		let additional = (response && response.additional) ? response.additional : null;
		let items: WalletBalance[] = [];
		if (datas && datas.length > 0) {
			for (let i = 0; i <= datas.length; i++) {
				let item = datas[i];
				if (item && item.id) {
					items[i] = new WalletBalanceModel(datas[i], additional);
				}
			}
		}

		this.data = {};
		this.data.data = items;
	}
}
