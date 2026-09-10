import { InputDialog } from 'src/@bracezin/_dbShare/utils';

export class InputDialogModel {
    title: string;
    message: string;
    type: string;
    for?: string;
    format?: string;
    options?: Array<any>;
    item?: any;
    items?: any;

	/**
	 * Constructor
	 *
	 * @param dialog
	 */
    constructor(dialog, additional: any = null) {
        this.title = dialog.title || null;
        this.message = dialog.message || null;
        this.type = dialog.type || null;
        this.for = dialog.for || null;
        this.format = dialog.format || null;
        this.options = dialog.options || [];
        this.item = dialog.item || null;
	}
}


export class InputDialogMapModel {
	data: any;

	/** Constructor */
	constructor(response) {

		let datas = (response && response.data && response.data.length > 0) ? response.data : [];
		let additional = (response && response.additional) ? response.additional : null;
		let items: InputDialog[] = [];
		if (datas && datas.length > 0) {
			for (let i = 0; i <= datas.length; i++) {
				let item = datas[i];
				if (item && item.id) {
					items[i] = new InputDialogModel(datas[i], additional);
				}
			}
		}

		this.data = {};
		this.data.data = items;
	}
}
