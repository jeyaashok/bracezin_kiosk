import { MenuGroup } from '../menuGroup';
import { SubMenu } from '../subMenu';

export interface Menu {
	id: number;
	menu_group_id: number;
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

	menu_group?: MenuGroup;
	subMenus?: SubMenu[];
	sub_menus?: SubMenu[];
	children?: SubMenu[];
	subItems?: SubMenu[];
	isPermitted?: boolean;
	roles?: Array<any>;
	permissions?: Array<any>;
	image?: string;
	tableName?: string;

	active?: boolean;
	disabled?: boolean;
	link?: string;
	isCollapsed?: boolean;
}
