import { Dashboard } from '../dashboard';

export class DashboardModel {
	countWidget: Array<any>;
	salesData: any;
	saleOrderData: any;
	purchaseOrderData: any;
	recentEnquiries: Array<any>;
	recentRequestForQuote: Array<any>;
	recentTransaction: Array<any>;

	/**
	 * Constructor
	 *
	 * @param dashboard
	 */
	constructor(dashboard, additional: any = null) {
		this.countWidget = dashboard.countWidget || [];
		this.salesData = dashboard.salesData || {};
		this.saleOrderData = dashboard.saleOrderData || {};
		this.purchaseOrderData = dashboard.purchaseOrderData || {};
		this.recentEnquiries = dashboard.recentEnquiries || [];
		this.recentRequestForQuote = dashboard.recentRequestForQuote || [];
		this.recentTransaction = dashboard.recentTransaction || [];
	}
}


export class DashboardMapModel {
	data: any;

	/** Constructor */
	constructor(response) {

		let datas = (response && response.data && response.data.length > 0) ? response.data : [];
		datas = (datas && datas.length < 1 && response && response.data && response.data.data && response.data.data.length > 0) ? response.data.data : datas;
		let additional = (response && response.additional) ? response.additional : null;
		let items: Dashboard[] = [];
		if (datas && datas.length > 0) {
			for (let i = 0; i <= datas.length; i++) {
				let item = datas[i];
				if (item && item.id) {
					items[i] = new DashboardModel(datas[i], additional);
				}
			}
		}

		this.data = {};
		this.data.data = items;
	}
}
