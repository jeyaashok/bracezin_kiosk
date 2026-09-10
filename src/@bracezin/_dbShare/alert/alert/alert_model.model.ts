export class AlertModel {
	type   : string;
	title  : string;
	message: string;
	image  : string;
	icon   : string;
	faIcon : string;

	/**
	 * Constructor
	 *
	 * @param alert
	 */
	constructor(alert) {
		this.type   = alert.type || null;
		this.title  = alert.title || null;
		this.message= alert.message || null;
		this.image  = alert.image || null;
		this.icon   = alert.icon || null;
		this.faIcon = alert.faIcon || null;
	}
}
