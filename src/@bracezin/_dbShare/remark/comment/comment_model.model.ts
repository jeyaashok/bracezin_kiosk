import { Comment } from '../comment';

export class CommentModel {
	id: number;
	resource_id: number;
	resource_type: string;
	comment_id: number;
	user_id: number;
	type: string;
	title: string;
	description: string;
	rating: number;

	created_by?: number;
	updated_by?: number;
	created_at?: Date;
	updated_at?: Date;

	tableName?: string;
	resource?: any;

	/**
	 * Constructor
	 *
	 * @param comment
	 */
	constructor(comment, additional: any = null) {
		this.id = comment.id || null;
		this.resource_id = comment.resource_id || null;
		this.resource_type = comment.resource_type || null;
		this.comment_id = comment.comment_id || null;
		this.user_id = comment.user_id || null;
		this.type = comment.type || null;
		this.title = comment.title || null;
		this.description = comment.description || null;
		this.rating = comment.rating || null;

		this.created_by = comment.created_by || null;
		this.updated_by = comment.updated_by || null;
		this.created_at = comment.created_at || null;
		this.updated_at = comment.updated_at || null;

		this.tableName = comment.tableName || null;
		this.resource = comment.resource || null;
	}
}


export class CommentMapModel {
	data: any;

	/** Constructor */
	constructor(response) {

		let datas = (response && response.data && response.data.length > 0) ? response.data : [];
		datas = (datas && datas.length < 1 && response && response.data && response.data.data && response.data.data.length > 0) ? response.data.data : datas;
		let additional = (response && response.additional) ? response.additional : null;
		let items: Comment[] = [];
		if (datas && datas.length > 0) {
			for (let i = 0; i <= datas.length; i++) {
				let item = datas[i];
				if (item && item.id) {
					items[i] = new CommentModel(datas[i], additional);
				}
			}
		}

		this.data = {};
		this.data.data = items;
	}
}
