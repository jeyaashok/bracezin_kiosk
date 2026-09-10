export class ToastModel {
	id: number;
	type: string;
	title: string;
	message: string;
	image: string;
	icon: string;
	faIcon: string;
	site: string;
	category: string;

	/**
	 * Constructor
	 *
	 * @param toast
	 */
	constructor(toast) {
		this.id = toast.id || null;
		this.type = toast.type || null;
		this.title = toast.title || null;
		this.message = toast.message || null;
		this.image = toast.image || null;
		this.icon = toast.icon || null;
		this.faIcon = toast.faIcon || null;
		this.site = toast.site || null;
		this.category = toast.category || null;
	}
}
