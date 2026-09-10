import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef, effect } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

// import { MENU } from './menu';
// import { MenuItem } from './menu.model';
import { environment } from 'src/environments/environment';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MenuGroupService, MenuGroup, UserService } from 'src/@bracezin/_dbShare';

@UntilDestroy()
@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    standalone: false
})
export class SidebarComponent implements OnInit {

  menu: any;
  toggle: any = true;
  menuItems: MenuGroup[] = [];
  @ViewChild('sideMenu') sideMenu!: ElementRef;
  @Output() mobileMenuButtonClicked = new EventEmitter();

  constructor(private router: Router, 
            public translate: TranslateService,
            private menuGroupService: MenuGroupService,
            public userService: UserService) {
    translate.setDefaultLang('en');
    this.dataInit();
    this.getMenus();
  }

  ngOnInit(): void {
    // Menu Items
    this.router.events.pipe(untilDestroyed(this)).subscribe((event) => {
      if (document.documentElement.getAttribute('data-layout') != "twocolumn") {
        if (event instanceof NavigationEnd) {
          this.initActiveMenu();
        }
      }
    });
  }

  /***
   * Activate droup down set
   */
  ngAfterViewInit() {
    setTimeout(() => {
      this.initActiveMenu();
    }, 0);
  }

  dataInit() {
    effect(() => {
      let menuGroups: MenuGroup[] = this.menuGroupService.allItems();
      this.menuItems = menuGroups;
    })
  }

  getMenus() {
		if(this.menuItems && this.menuItems.length < 1) {
			this.menuGroupService.getAllItems();
		}
	}

  isCollapsible(menu: any): boolean {
    return !!(menu && menu.type === 'subheading');
  }

  removeActivation(items: any) {
    items.forEach((item: any) => {
      item.classList.remove("active");
    });
  }
 

  toggleItem(item: any, on: string) {
    switch(on) {
      case 'menu':
        this.menuItems.forEach((menuGroup: any) => {
          if (menuGroup.children && menuGroup.children.length > 0) {
            menuGroup.children.forEach((menu: any) => {
              if(menu && menu === item) {
                menu.isCollapsed = !menu.isCollapsed;
              } else {
                menu.isCollapsed = true;
              }
            });
          }
        });
        break;
      case 'subMenu':
        this.menuItems.forEach((menuGroup: any) => {
          if (menuGroup.children && menuGroup.children.length > 0) {
            menuGroup.children.forEach((menu: any) => {
              if (menu.children && menu.children.length > 0) {
                menu.children.forEach((subMenu: any) => {
                  if(subMenu && subMenu === item) {
                    subMenu.isCollapsed = !subMenu.isCollapsed;
                  } else {
                    subMenu.isCollapsed = true;
                  }
                });
              }
            });
          }
        });
        break;
      case 'subSubMenu':
        this.menuItems.forEach((menuGroup: any) => {
          if (menuGroup.children && menuGroup.children.length > 0) {
            menuGroup.children.forEach((menu: any) => {
              if (menu.children && menu.children.length > 0) {
                menu.children.forEach((subMenu: any) => {
                  if (subMenu.children && subMenu.children.length > 0) {
                    subMenu.children.forEach((subSubMenu: any) => {
                      if(subSubMenu && subSubMenu === item) {
                        subSubMenu.isCollapsed = !subSubMenu.isCollapsed;
                      } else {
                        subSubMenu.isCollapsed = true;
                      }
                    });
                  }
                });
              }
            });
          }
        });
        break;
      default:
        break;
    }
  }

  // remove active items of two-column-menu
  activateParentDropdown(item: any) {
    item.classList.add("active");
    let parentCollapseDiv = item.closest(".collapse.menu-dropdown");

    if (parentCollapseDiv) {
      // to set aria expand true remaining
      parentCollapseDiv.parentElement.children[0].classList.add("active");

      if (parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown")) {
        parentCollapseDiv.parentElement.closest(".collapse").classList.add("show");
        if (parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling)
          parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.classList.add("active");
        if (parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.closest(".collapse")) {
          parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.closest(".collapse").classList.add("show");
          parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.closest(".collapse").previousElementSibling.classList.add("active");
        }
      }
      return false;
    }
    return false;
  }

  updateActive(event: any) {
    const ul = document.getElementById("navbar-nav");
    if (ul) {
      const items = Array.from(ul.querySelectorAll("a.nav-link"));
      this.removeActivation(items);
    }
    this.activateParentDropdown(event.target);
  }

  initActiveMenu() {
    let pathName = window.location.pathname;
    // Check if the application is running in production
    if (environment.production) {
      // Modify pathName for production build
      pathName = pathName.replace('/velzon/angular/material', '');
    }

    const active = this.findMenuItem(pathName, this.menuItems)
    this.toggleItem(active, 'menuGroup');
    const ul = document.getElementById("navbar-nav");
    if (ul) {
      const items = Array.from(ul.querySelectorAll("a.nav-link"));
      let activeItems = items.filter((x: any) => x.classList.contains("active"));
      this.removeActivation(activeItems);

      let matchingMenuItem = items.find((x: any) => {
        if (environment.production) {
          let path = x.pathname
          path = path.replace('/velzon/angular/material', '');
          return path === pathName;
        } else {
          return x.pathname === pathName;
        }

      });
      if (matchingMenuItem) {
        this.activateParentDropdown(matchingMenuItem);
      }
    }
  }

  private findMenuItem(pathname: string, menuItems: any[]): any {
    for (const menuItem of menuItems) {
      if (menuItem.link && menuItem.link === pathname) {
        return menuItem;
      }

      if (menuItem.subItems) {
        const foundItem = this.findMenuItem(pathname, menuItem.subItems);
        if (foundItem) {
          return foundItem;
        }
      }
    }

    return null;
  }

  /**
   * Toggles the collapse state of a menu item
   * @param item menuItem
   */
  hasItems(item: MenuGroup) {
    return item.children !== undefined ? item.children.length > 0 : false;
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    var sidebarsize = document.documentElement.getAttribute("data-sidebar-size");
    if (sidebarsize == 'sm-hover-active') {
      document.documentElement.setAttribute("data-sidebar-size", 'sm-hover')
    } else {
      document.documentElement.setAttribute("data-sidebar-size", 'sm-hover-active')
    }
  }

  /**
   * SidebarHide modal
   * @param content modal content
   */
  SidebarHide() {
    document.body.classList.remove('vertical-sidebar-enable');
  }


}
