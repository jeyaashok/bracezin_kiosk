import { MenuGroup, MenuGroupModel } from '../menuGroup';
import { SubMenu, SubMenuModel } from '../subMenu';
import { Menu } from '../menu';

export class MenuModel {
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
  children?: SubMenu[];
  subItems?: SubMenu[];
  isPermitted?: boolean;
  roles?: Array<any>;
  permissions?: Array<any>;
  image?: string;

  active?: boolean;
  disabled?: boolean;
  link?: string;
  tableName?: string;
  isCollapsed?: boolean;

  /**
   * Constructor
   *
   * @param menu
   */
  constructor(menu, additional: any = null) {
    this.id = menu.id || null;
    this.title = menu.title || null;
    this.slug = menu.slug || null;

    this.type = ((menu && menu.menus && menu.menus.length > 0 && menu.type && (menu.type === 'collapse' || menu.type === 'Collapse')) ? 'aside' : menu.type) || null;
    // this.type = ((menu && menu.menus && menu.menus.length > 0 && menu.type && menu.type === 'collapse') ? 'group' : menu.type) || null;

    this.translate = menu.translate || null;
    this.icon = menu.icon || 'chat-pie';
    this.url = menu.url || null;
    this.route = menu.route || null;
    this.external_url = menu.external_url || null;
    this.classes = menu.classes || null;
    this.function = menu.function || null;
    this.order = menu.order || null;
    this.json = menu.json || null;
    this.role = menu.role || null;
    this.permission = menu.permission || null;
    this.is_hidden = (menu.is_hidden || !menu.is_active) ? true : false;
    this.is_active = menu.is_active || false;
    this.is_exact_match = menu.is_exact_match || null;
    this.is_open_new_tab = menu.is_open_new_tab || null;
    this.created_by = menu.created_by || null;
    this.updated_by = menu.updated_by || null;
    this.created_at = menu.created_at || null;
    this.updated_at = menu.updated_at || null;

    this.exactMatch = menu.exactMatch || false;
    this.isPermitted = menu.isPermitted || false;

    this.disabled = !menu.is_active || false;
    this.link = menu.route || null;
    this.tableName = menu.tableName || 'menu_group';
    this.roles = menu.roles || [];
    this.permissions = menu.permissions || [];
    this.isCollapsed = menu.isCollapsed || false;

    // if(menu.menus && menu.menus.length > 0) {
    //     let menusChild = [];
    //     for (let i = 0; i <= menu.menus.length; i++) {
    //         let menusChildItem = menu.menus[i];
    //         if (menusChildItem && menusChildItem.id) {
    //             menusChild[i] = new MenuModel(menusChildItem, additional);
    //             menusChild[i].tableName = 'menu';
    //     	}
    //     }
    //     this.children = menusChild || [];
    // }

    // if(menu.sub_menus && menu.sub_menus.length > 0) {
    //     let subMenusChild = [];
    //     for (let j = 0; j <= menu.sub_menus.length; j++) {
    //         let subMenusChildItem = menu.sub_menus[j];
    //         if (subMenusChildItem && subMenusChildItem.id) {
    //             subMenusChild[j] = new MenuModel(subMenusChildItem, additional);
    //             subMenusChild[j].tableName = 'sub_menu';
    //     	}
    //     }
    //     this.children = subMenusChild || [];
    // }

    if (menu && menu.children && menu.children.length > 0) {
      let subMenuChildrens = [];
      for (let j = 0; j <= menu.children.length; j++) {
        let item = menu.children[j];
        if (item && item.id) {
          subMenuChildrens[j] = new MenuModel(menu.children[j], null);
        }
      }
      this.children = subMenuChildrens;
      this.subMenus = subMenuChildrens;
      this.subItems = subMenuChildrens;
    }
  }
}


export class MenuMapModel {
  data: any;

  /** Constructor */
  constructor(response) {

    let datas = (response && response.items && response.items.length > 0) ? response.items : [];
    let additional = (response && response.additional) ? response.additional : null;
    let items: Menu[] = [];
    if (datas && datas.length > 0) {
      for (let i = 0; i <= datas.length; i++) {
        let item = datas[i];
        if (item && item.id) {
          items[i] = new MenuModel(datas[i], additional);
        }
      }
    }

    this.data = {};
    this.data.data = items;
  }
}
