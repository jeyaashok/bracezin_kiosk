import { Menu, MenuModel } from '../menu';
import { MenuGroup } from '../menuGroup';

export class MenuGroupModel {
	id: number;
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

	menus?: Menu[];
	isPermitted?: boolean;
	children?: Menu[];
	roles?: Array<any>;
	permissions?: Array<any>;
	image?: string;
	tableName?: string;
	isCollapsed?: boolean;
	isTitle?: boolean;

	/**
	 * Constructor
	 *
	 * @param menuGroup
	 */
    constructor(menuGroup, additional: any = null) {
		this.id = menuGroup.id || null;
		this.title = menuGroup.title || null;
		this.slug = menuGroup.slug || null;
		this.type = menuGroup.type || null;
		this.translate = menuGroup.translate || null;
		this.icon = menuGroup.icon || null;
		this.url = menuGroup.url || null;
		this.route = menuGroup.route || null;
		this.external_url = menuGroup.external_url || null;
		this.classes = menuGroup.classes || null;
		this.function = menuGroup.function || null;
		this.order = menuGroup.order || null;
		this.role = menuGroup.role || null;
		this.permission = menuGroup.permission || null;
		this.json = menuGroup.json || null;
		this.is_hidden = menuGroup.is_hidden || null;
		this.is_active = menuGroup.is_active || null;
		this.is_exact_match = menuGroup.is_exact_match || null;
		this.is_open_new_tab = menuGroup.is_open_new_tab || null;
		this.created_by = menuGroup.created_by || null;
		this.updated_by = menuGroup.updated_by || null;
		this.created_at = menuGroup.created_at || null;
		this.updated_at = menuGroup.updated_at || null;

		this.exactMatch = menuGroup.exactMatch || false;
		this.tableName = menuGroup.tableName || 'menu_group';
		this.isCollapsed = menuGroup.isCollapsed || false;
		this.isTitle = menuGroup.isTitle || true;

		if(menuGroup && menuGroup.children && menuGroup.children.length > 0) {
			let menuChildrens = [];
			for (let j = 0; j <= menuGroup.children.length; j++) {
                let item = menuGroup.children[j];
                if (item && item.id) {
                    menuChildrens[j] = new MenuModel(menuGroup.children[j], null);
                }
            }
			this.children = menuChildrens;
			this.menus = menuChildrens;
		}
	}
}


export class MenuGroupMapModel {
    data: any;

    /** Constructor */
    constructor(response) {

        let datas = (response && response.data && response.data.length > 0) ? response.data : [];
		datas = (datas && datas.length > 0) ? datas : response.data.data;
        let additional = (response && response.additional) ? response.additional : null;
        let items: MenuGroup[] = [];
        if (datas && datas.length > 0) {
            for (let i = 0; i <= datas.length; i++) {
                let item = datas[i];
                if (item && item.id) {
                    items[i] = new MenuGroupModel(datas[i], additional);
                }
            }
        }

        this.data = {};
        this.data.data = items;
    }
}
