import { Menu, MenuModel } from '../menu';
import { SubMenu } from '../subMenu';

export class SubMenuModel {
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
	isCollapsed?: boolean;
	parentId?: number;

	/**
	 * Constructor
	 *
	 * @param subMenu
	 */
    constructor(subMenu, additional: any = null) {
		this.id = subMenu.id || null;
		this.menu_id = subMenu.menu_id || null;
		this.title = subMenu.title || null;
		this.slug = subMenu.slug || null;
		this.type = subMenu.type || null;
		this.translate = subMenu.translate || null;
		this.icon = subMenu.icon || null;
		this.url = subMenu.url || null;
		this.external_url = subMenu.external_url || null;
		this.classes = subMenu.classes || null;
		this.function = subMenu.function || null;
		this.order = subMenu.order || null;
		this.role = subMenu.role || null;
		this.permission = subMenu.permission || null;
		this.json = subMenu.json || null;
		this.is_hidden = subMenu.is_hidden || null;
		this.is_active = subMenu.is_active || null;
		this.is_exact_match = subMenu.is_exact_match || null;
		this.is_open_new_tab = subMenu.is_open_new_tab || null;
		this.created_by = subMenu.created_by || null;
		this.updated_by = subMenu.updated_by || null;
		this.created_at = subMenu.created_at || null;
		this.updated_at = subMenu.updated_at || null;

		this.exactMatch = subMenu.exactMatch || false;
		this.tableName = subMenu.tableName || 'sub_menu';
		this.isCollapsed = subMenu.isCollapsed || false;
		this.parentId = subMenu.menu_id || null;
	}
}

export class SubMenuMapModel {
    data: any;

    /** Constructor */
    constructor(response) {

        let datas = (response && response.items && response.items.length > 0) ? response.items : [];
        let additional = (response && response.additional) ? response.additional : null;
        let items: SubMenu[] = [];
        if (datas && datas.length > 0) {
            for (let i = 0; i <= datas.length; i++) {
                let item = datas[i];
                if (item && item.id) {
                    items[i] = new SubMenuModel(datas[i], additional);
                }
            }
        }

        this.data = {};
        this.data.data = items;
    }
}
