import { EventEmitter, Injectable, signal } from '@angular/core'
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { MatSnackBar } from '@angular/material/snack-bar';

import { GlobalService } from 'src/@bracezin/_dbShare/general/global.service';
import { CommonService } from 'src/@bracezin/_dbShare/general/common.service';
import { UserService } from 'src/@bracezin/_dbShare/user/user.service';

import { User } from './user.interface';
import { UserModel } from './user_model.model';

import { AlertService } from 'src/@bracezin/_dbShare/alert/alert/alert.service';
 
@Injectable({
	providedIn: 'root',
})
@UntilDestroy()

export class UserProfileService implements Resolve<any> {
	url: string = 'person/user';
	routeParams: any;
	user = this.userService.authUser();
	defaultParams: any = {
		'all': 1,
		'search': null,
	};

	sortIdentity: any = {
		'name': 'name'
	};

	// isNotificationSettings = signal<boolean>(false);
	
	private allItemsSource = new BehaviorSubject<User[]>([]);
	allItems = this.allItemsSource.asObservable();

	private itemSource = new BehaviorSubject<User>(new UserModel({}));
	item = this.itemSource.asObservable();

	private paramsSource = new BehaviorSubject<any>(this.defaultParams);
	params = this.paramsSource.asObservable();

	private _unsubscribeAll: Subject<any>;
	isUpdated: EventEmitter<boolean> = new EventEmitter();

	constructor(private globalService: GlobalService,
		private commonService: CommonService,
		private userService: UserService,
		private alertService: AlertService,
		private snackBar: MatSnackBar) {
		this._unsubscribeAll = new Subject();
	}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
		this.routeParams = route.params;
		return new Promise((resolve, reject) => {
			Promise.all([
				this.resetParams(),
				// this.getAllItems(),
				// this.getItem(),
				this.changeItem(this.user)
			])
				.then(() => {
					resolve(null);
				}, reject
				);
		});
	}

	unSubscribe() {

	}

	unSubscribeFilter() {

	}

	changeAllItems(allItems: User[]) {
		this.allItemsSource.next(allItems);
	}

	changeItem(item: User) {
		this.itemSource.next(item);
	}

	changeParams(parms: any) {
		this.paramsSource.next(parms);
	}

	changeAllItemsByItem(item: User) {
		let allItems = [];
		this.allItems.pipe(untilDestroyed(this, 'unSubscribe')).subscribe(data => allItems = data);
		if (allItems && allItems.length > 0) {
			for (var i = 0; i < allItems.length; ++i) {
				if (allItems[i].id === item.id) { allItems.splice(i, 1, item); }
			}
		}
		this.changeAllItems(allItems);
	}

	paramsInit(params: any) {
		let newParams: any;
		let key: any;
		if (params !== null) {
			newParams = params;
		} else {
			this.params.pipe(untilDestroyed(this, 'unSubscribe')).subscribe(data => { newParams = data; });
		}

		for (key in newParams) {
			if (newParams[key] === null || newParams[key] === null || newParams[key] === undefined) {
				delete newParams[key];
			}
		}
		return newParams;
	}

	resetParams() {
		const defaultParams: any = {
			'paginate': 25,
			'page': 1,
			'search': null,
		};
		this.changeParams(this.paramsInit(defaultParams));
	}

	getAllItems(params: any = null) {
		params = this.paramsInit(params);
		this.commonService.getAll(this.url, params)
			.pipe(untilDestroyed(this, 'unSubscribe'))
			.subscribe(data => {
				if (params.all && params.all === 1) {
					this.changeAllItems(data.items);
				} else {
					this.changeAllItems(data.items.data);
				}
			},
				error => console.log('Error ::' + error)
			);
	}

	concatAllItems(params: any = null) {
		params = this.paramsInit(params);
		this.commonService.getAll(this.url, params)
			.pipe(untilDestroyed(this, 'unSubscribe'))
			.subscribe(data => {
				let lists = [];
				this.allItems.pipe(untilDestroyed(this, 'unSubscribe')).subscribe(result => {
					lists = result.concat(data.items.data);
					if (data.items.last_page <= data.items.current_page) {
						params.page = data.items.last_page;
						this.changeParams(params);
					}
				});
				this.changeAllItems(lists);
			},
				error => console.log('Error ::' + error)
			);
	}

	concatItem(item: User) {
		let lists = [];
		this.allItems.pipe(untilDestroyed(this, 'unSubscribe')).subscribe(result => {
			lists = result.concat([item]);
		});
		this.changeAllItems(lists);
	}

	spliceItem(id: number) {
		let allItems = [];
		this.allItems.pipe(untilDestroyed(this, 'unSubscribe')).subscribe(data => allItems = data);
		if (allItems && allItems.length > 0) {
			for (var i = 0; i < allItems.length; ++i) {
				if (allItems[i].id === id) { allItems.splice(i, 1); }
			}
		}
		this.changeAllItems(allItems);
	}

	getItem(params: any = null) {
		this.routeParams = (params) ? params : this.routeParams;
		if (this.routeParams && this.routeParams.id > 0) {
			this.commonService.getItem(this.url, this.routeParams.id)
				.pipe(untilDestroyed(this, 'unSubscribe'))
				.subscribe(data => {
					this.changeAllItemsByItem(data.item);
					this.changeItem(data.item);
				},
					error => console.log('Error ::' + error)
				);
		}
		else {
			this.changeItem(new UserModel({}));
		}
	}

	store(data: any) {
		data.permission = data.permission.toString();
		data.slug = data.title;
		this.commonService.storeItem(this.url, data)
			.pipe(untilDestroyed(this, 'unSubscribe'))
			.subscribe(data => {
				this.concatItem(data.item);
				this.changeItem(data.item);
				this.alert('Success', 'Created Successfully !!!');
			},
				error => {
					console.log('Error ::' + error);
					this.alert('Danger', 'Something Wrong. Try after Sometimes !!!');
				}
			);
	}

	update(id: number, data: any) {
		this.commonService.updateItem(this.url, id, data)
			.pipe(untilDestroyed(this, 'unSubscribe'))
			.subscribe(data => {
				if (data.success) {
					this.changeAllItemsByItem(data.data);
					this.changeItem(data.data);
					this.userService.changeAuthUser(data.data);
					this.alert('Info', 'Updated Successfully !!!');
				} else {
					this.alertService.webErrorShow(data);
				}
			},
				error => {
					console.log('Error ::' + error);
					this.alert('Danger', 'Something Wrong. Try after Sometimes !!!');
				}
			);
	}

	updateProfile(profileData: any) {
		this.commonService.storeItem("profile/profileData", profileData, true, 'optionOne')
			.pipe(untilDestroyed(this, 'unSubscribe'))
			.subscribe(data => {
				if (data.success) {
					this.user.person.name = profileData.name;
					this.user.username = profileData.userName;
					this.user.email = profileData.email;
					this.user.person.person_details.mobile = profileData.mobile;
					this.user.person.person_details.company_name = profileData.company_name;
					this.user.person.person_details.business_brand_name = profileData.business_brand_name;
					this.user.person.person_details.business_category = profileData.business_category;
					this.user.person.person_details.address = profileData.address;
					this.user.person.person_details.country = profileData.country;
					this.user.person.person_details.gender = profileData.gender;
					this.user.person.person_details.date_of_birth = profileData.date_of_birth;
					this.user.person.person_details.blood_group = profileData.blood_group;

					this.changeAllItemsByItem(this.user);
					this.changeItem(this.user);
					this.userService.changeAuthUser(this.user);
					this.isUpdated.emit(true);
					this.alert('Info', 'Updated Successfully !!!');
				} else {
					this.alertService.webErrorShow(data);
				}
			},
				error => {
					console.log('Error ::' + error);
					this.alert('Danger', 'Something Wrong. Try after Sometimes !!!');
				}
			);
	}

	updateProfileSettings(profileData: any, params: any) {
		this.commonService.storeItem("profile/settings", profileData, true, 'optionOne')
			.pipe(untilDestroyed(this, 'unSubscribe'))
			.subscribe(data => {
				if (data.success) {
					if (params == 'enable_sound') {
						this.user.enable_sound = (profileData.value == '1') ? true : false;
					}
					if (params == 'is_desktop_notify') {
						this.user.is_desktop_notify = (profileData.value == '1') ? true : false;
					}
					if (params == 'is_web_notify') {
						this.user.is_web_notify = (profileData.value == '1') ? true : false;
					}
					if (params == 'default_lang') {
						this.user.default_lang = profileData.value;
						this.commonService.setLanguage(profileData.value);
					}

					this.changeAllItemsByItem(this.user);
					this.changeItem(this.user);
					this.userService.changeAuthUser(this.user);
				} else {
					this.alertService.webErrorShow(data);
				}
			},
				error => {
					console.log('Error ::' + error);
					this.alert('Danger', 'Something Wrong. Try after Sometimes !!!');
				}
			);
	}


	destroy(id: number) {
		this.commonService.deleteItem(this.url, id)
			.pipe(untilDestroyed(this, 'unSubscribe'))
			.subscribe(data => {
				this.spliceItem(id);
				this.alert('Danger', 'Destroyed Successfully !!!');
			},
				error => {
					console.log('Error ::' + error);
					this.alert('Danger', 'Something Wrong. Try after Sometimes !!!');
				}
			);
	}

	/** Scroll Event */
	onScroll() {
		let newParams: any;
		this.params
			.pipe(debounceTime(300), distinctUntilChanged(), untilDestroyed(this, 'unSubscribe'), untilDestroyed(this, 'unSubscribeFilter'))
			.subscribe(data => {
				newParams = data;
				newParams.page += 1;
				this.changeParams(newParams);
				this.concatAllItems();
			});
	}

	/** Search Event */
	onSearch(input: string) {
		let newParams: any;
		this.params
			.pipe(debounceTime(500), distinctUntilChanged(), untilDestroyed(this, 'unSubscribe'), untilDestroyed(this, 'unSubscribeFilter'))
			.subscribe(data => {
				newParams = data;
				newParams.page = 1;
				newParams.search = input;
				this.changeParams(newParams);
				this.getAllItems();
			});
	}

	pageEvent(event) {
		let newParams: any;
		this.params
			.pipe(debounceTime(100), distinctUntilChanged(), untilDestroyed(this, 'unSubscribe'), untilDestroyed(this, 'unSubscribeFilter'))
			.subscribe(data => {
				newParams = data;
				newParams.page = event.pageIndex + 1;
				newParams.paginate = event.pageSize;
				this.changeParams(newParams);
				this.getAllItems();
			});
	}

	getSortName(input: string) {
		let sortName = 'name';
		sortName = (input) ? this.sortIdentity[input] : sortName;
		return sortName;
	}

	sortData(event) {
		let newParams: any;
		this.params
			.pipe(debounceTime(200), distinctUntilChanged(), untilDestroyed(this, 'unSubscribe'), untilDestroyed(this, 'unSubscribeFilter'))
			.subscribe(data => {
				newParams = data;
				newParams.page = 1;
				newParams.order = this.getSortName(event.active) + '|' + event.direction;
				this.changeParams(newParams);
				this.getAllItems();
			});
	}

	alert(type: string, message) {
		this.alertService.webShow(type, message);
		// let capitalType = type ? type.charAt(0).toUpperCase() + type.substr(1).toLowerCase() : null;
		// this.snackBar.openFromComponent(AlertComponent, {
		// 	panelClass: ['alert' + capitalType],
		// 	data: {
		// 		message: message,
		// 		type: type.toLowerCase(),
		// 	}
		// });
	}

	storeProfileImage(data: any) {
		this.commonService.storeItem('profile/userProfileImage', data, true, 'optionOne')
			.pipe(untilDestroyed(this, 'unSubscribe'))
			.subscribe(data => {
				if (data.success) {
					this.user.person.person_details.image_api = data.data.url;
					this.user.person.person_details.image_api = data.data.url;
					this.userService.changeAuthUser(this.user);
					this.alert('Info', 'Profile Image Updated Successfully !!!');
					this.changeAllItemsByItem(this.user);
					this.changeItem(this.user);
				} else {
					this.alertService.webErrorShow(data);
				}
			},
				error => {
					console.log('Error ::' + error);
					this.alert('Danger', 'Something Wrong. Try after Sometimes !!!');
				}
			);
	}

	sendVerifyMail(url = null) {
		let newUrl: string = 'profile/verifyemail';
		this.commonService.storeItem(newUrl, {}, true, 'optionOne')
			.pipe(untilDestroyed(this, 'unSubscribe'))
			.subscribe(data => {
				if (data.success) {
					this.alert('Info', data.data.message);
				} else {
					this.alertService.webErrorShow(data);
				}
			},
				error => {
					console.log('Error ::' + error);
					this.alert('Danger', 'Something Wrong. Try after Sometimes !!!');
				}
			);
	}

	updateNotification(notificationSettings: any) {
		this.commonService.storeItem("notification/addSettings", notificationSettings, true, 'optionOne')
			.pipe(untilDestroyed(this, 'unSubscribe'))
			.subscribe(data => {
				if (data.success && data.data && data.data.notification_settings) {
					//  localStorage.setItem('tji_notificationSettings',  this.item.data.notification_settings);
					if (data.data && data.data.notification_settings) {
							var notificationSettings = JSON.parse(data.data.notification_settings)
							
							localStorage.setItem('tji_notificationSettings',  data.data.notification_settings);
						}
					this.isUpdated.emit(true);
					this.alert('Info', 'Updated Successfully !!!');
				} else {
					this.isUpdated.emit(false);
					this.alertService.webErrorShow(data);
				}
			},
				error => {
					console.log('Error ::' + error);
					this.alert('Danger', 'Something Wrong. Try after Sometimes !!!');
				}
			);
	}
}
