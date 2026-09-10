import { Menu } from '../menu';

export interface SubMenu {
	id: number;
	menu_id: number;
	title: string;
	slug: string;
	type: string;
	translate: string;
	icon: string;
	url: string;
	route: string;
	external_url: string;
	classes: string;
	function: string;
	order: number;
	role: string;
	permission: string;
	json: string;
	is_hidden: boolean;
	is_active: boolean;
	is_exact_match: boolean;
	is_open_new_tab: boolean;
	created_by?: number;
	updated_by?: number;
	created_at?: Date;
	updated_at?: Date;

	exactMatch: boolean;

	menu?: Menu;
	roles?: Array<any>;
	permissions?: Array<any>;
	isPermitted?: boolean;
	image?: string;
	tableName?: string;
	link?: string;
	isCollapsed?: boolean;
	parentId?: number;
}
