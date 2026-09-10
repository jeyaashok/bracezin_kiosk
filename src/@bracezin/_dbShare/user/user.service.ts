import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatSnackBar } from '@angular/material/snack-bar';

import { GlobalService } from 'src/@bracezin/_dbShare/general/global.service';
import { CommonService } from 'src/@bracezin/_dbShare/general/common.service';
import { AudioService } from 'src/@bracezin/_dbShare/alert/audio.service';
import { environment } from 'src/environments/environment';
// import { UnSubscribeService } from 'src/@bracezin/_dbShare/unSubscribe';
import { User } from './user.interface';
import { UserModel } from './user_model.model';

import { AlertService } from 'src/@bracezin/_dbShare/alert/alert/alert.service';
import { AvatarService } from 'src/@bracezin/_dbShare/avatar';
import { PermissionService } from 'src/@bracezin/_dbShare/roles/permission';
@Injectable({
	providedIn: 'root'
})

export class UserService {
	item: any;
	private userSource = new BehaviorSubject<User>(new UserModel({}));
	user = this.userSource.asObservable();
	checkedUser: any;

	private checkMandiatoryRes = new BehaviorSubject<boolean>(false);
	checkMandiatoryResponse = this.checkMandiatoryRes.asObservable();

	public checkServerErrorRes = new BehaviorSubject<number>(0);
	checkServerErrorResponse = this.checkServerErrorRes.asObservable();

	onChanged: BehaviorSubject<any>;
	onSelected: BehaviorSubject<any>;
	private _unsubscribeAll: Subject<any>;

	storedUser: User = null;
	storedPermissions: Array<string> = [];
	storedRoles: Array<string> = [];

	authResellerId: number = null;
	playSound: string = 'disable';

	constructor(private httpClient: HttpClient,
		private cookieService: CookieService,
		private commonService: CommonService,
		// private unSubscribeService: UnSubscribeService,
		// private router: Router,
		private audioService: AudioService,
		private alertService: AlertService,
		private snackBar: MatSnackBar,
		private avatarService: AvatarService,
		private permissionService: PermissionService) {
		this._unsubscribeAll = new Subject();
		this.onChanged = new BehaviorSubject([]);
		localStorage.setItem('currentVersion', "1.0.0");
	}

	tji_domain: string = this.commonService.backendUrl;

	noAuthHeader = new HttpHeaders({
		'Content-Type': 'application/json',
		'No-Auth': 'True'
	});

	header = new HttpHeaders({ 'Content-Type': 'application/json' });

	changeUser(user: User) {
		this.userSource.next(user);
		if (user && user.enable_sound) {
			this.audioService.changePlaySound(user.enable_sound);
		} else {
			this.audioService.changePlaySound(false);
		}
		this.setUserNotify(user);
		this.commonService.changeIsAuthStaff((user && user.type && user.type === 'staff') ? true : false);
	}

	changeAuthUser(user: User) {
		localStorage.setItem('tji_user', JSON.stringify(user));
		let data = user || null;
		let availability = data?.availability || 0;
		localStorage.setItem('availability', JSON.stringify(availability));

		this.cookieService.set('tji_roles', JSON.stringify(user.roleNames));
		this.cookieService.set('tji_permissions', JSON.stringify(user.permissionNames));
		this.userSource.next(user);
		this.setUserNotify(user);
		this.commonService.changeIsAuthStaff((user && user.type && user.type === 'staff') ? true : false);
	}

	// Get Item by Selected ID
	register(postUrl: string, data: any) {
		const body = JSON.stringify(data);
		return this.httpClient.post(this.tji_domain + postUrl, body, { headers: this.noAuthHeader }).pipe(
			map((response: Response) => {
        this.handleAuthResponse(response);
				this.item = response;
				return this.item.data;
			}));
	}

	// Get Item by Selected ID
	login(getUrl: string, data: any): Observable<any> {
		const body = JSON.stringify(data);
		return this.httpClient.post(this.tji_domain + getUrl, body, { headers: this.noAuthHeader }).pipe(
			map((response: Response) => {
				this.handleAuthResponse(response);
        this.item = response;
				return this.item.data;
			}));
	}

  handleAuthResponse(response: any) {
    if (response && response['data'] && response['data'].token) {
      response["roleNames"] = response['data'].roleNames || [];
      this.item = response;

      this.commonService.tji_token = this.item.data.token;
      localStorage.setItem('tji_token', JSON.stringify(this.item.data.token));
      localStorage.setItem('tji_user', JSON.stringify(this.item.data));
      let data = this.item.data || null;
      let availability = data?.availability || 0;
      localStorage.setItem('availability', JSON.stringify(availability));
      
      this.cookieService.set('tji_token', JSON.stringify(this.item.data.token));
      this.cookieService.set('tji_roles', JSON.stringify(this.item.data.roleNames));
      let lang = (this.item.data.default_lang) ? this.item.data.default_lang : 'en';
      this.cookieService.set('language', lang);
      localStorage.setItem('language', lang);
      this.onChanged.next(this.item);
      this.storedUser = this.item.data;
      this.storedRoles = this.item.data.roleNames;
      this.storedPermissions = this.item.data.permissionNames;
    }
  }

	keepLiveAuthUser(url = null) {
		let newUrl: string = (url) ? url : 'profile/keepAlive';
		this.commonService.getData(newUrl, {from:'W'}, 'optionOne')
			.pipe()
			.subscribe(data => {
				var newVersion: any = localStorage.getItem('currentVersion');
				if (data.success && data.data.token) {
					localStorage.setItem('tji_token', JSON.stringify(data.data.token));
					this.cookieService.set('tji_token', JSON.stringify(data.data.token));
				}
				if (data.success && data.web_version) {
					if (data.web_version && data.web_version != newVersion) {
						localStorage.setItem('currentVersion', data.web_version);
						setTimeout(() => {
							document.location.reload();
						}, 100);
					}
				}
			},
				error => console.log('Error ::' + error)
			);
	}

	renewUser(url = null) {
		let newUrl: string = (url) ? url : 'user';
		this.commonService.hitUrl(newUrl)
			.pipe()
			.subscribe(data => {
				this.checkedUser = data;
			},
				error => console.log('Error ::' + error)
			);
	}

	// Get Item by Selected ID
	sendResetLink(url: string, data: any) {
		const body = JSON.stringify(data);
		return this.httpClient.post(this.tji_domain + url, body, { headers: this.noAuthHeader }).pipe(
			map((response: Response) => {
				return response;
			}));
	}

	// Get Item by Selected ID
	passwordReset(url: string, data: any) {
		const body = JSON.stringify(data);
		return this.httpClient.post(this.tji_domain + url, body, { headers: this.noAuthHeader }).pipe(
			map((response: Response) => {
				this.item = response;
				return this.item.data;
			}));
	}

  verifyUser(getUrl: string, data: any): Observable<any> {
		const body = JSON.stringify(data);
		return this.httpClient.post(this.tji_domain + getUrl, body, { headers: this.header }).pipe(
			map((response: Response) => {
				this.handleAuthResponse(response);
        this.item = response;
				return this.item.data;
			}));
	}

	// Do Change Password
	changePassword(url: string, data: any) {
		let postUrl = (url) ? url : 'change-password';
		this.commonService.storeItem(postUrl, data, true, 'optionOne')
			.subscribe(data => {
				if (data.success) {
					this.alert('Success', 'Password Changed Successfully');
				} else {
					this.alertService.webErrorShow(data);
				}
			},
				error => {
					console.log('Error ::' + error);
					this.alert('Danger', 'Something Wrong. Please Try after sometimes !!!');
				}
			);
	}

	// Do Change Password
	updateByPost(url: string = null, id: number, data: any, authUser: User = null) {
		if (url) {
			this.commonService.updateItemByPost(url, id, data, true, 'optionOne')
				.subscribe(data => {
					let message: string = data?.data?.message || null;
					if (data.success) {
						if (authUser && authUser.id) { this.changeAuthUser(authUser); }
						this.alert('Success', message || 'Updated Successfully');
					} else {
						this.alertService.webErrorShow(data);
					}
				},
					error => {
						console.log('Error ::' + error);
						this.alert('Danger', 'Something Wrong. Please Try after sometimes !!!');
					}
				);
		}
	}

	logout(url: string, data: any = null) {
		const body = JSON.stringify(data);
		return this.httpClient.post(this.tji_domain + url, body, { headers: this.header }).pipe(
			map((response: any) => {
				if (response && response.success) {
					this.cookieService.deleteAll();
					this.clearCookie();
					localStorage.clear();
					window.location.href = '/';
					this.storedUser = null;
					this.storedRoles = [];
					this.storedPermissions = [];
				}
				return response;
			}));
	}

	authUser() {
		var user: any = JSON.parse(localStorage.getItem('tji_user'));
		// var user: any = (this.cookieService.check('tji_user')) ? JSON.parse(this.cookieService.get('tji_user')) : null;
		this.changeUser(user);
		return user;
	} 

	authCheck(): boolean {
		let authUser = this.authUser();
		return (authUser && authUser.id) ? true : false;
	}

	authUserId(): number {
		let authUser = this.authUser();
		return (authUser && authUser.id) ? authUser.id : null;
	}

	isAuthUserIsSuperAdmin(): boolean {
		let authUser = this.authUser();
		return (authUser && authUser.roleNames && authUser.roleNames[0] === 'Super Admin') ? true : false;
	}

	isAuthUserIsAdmin(): boolean {
		let authUser = this.authUser();
		return (authUser && authUser.roleNames && authUser.roleNames[0] === 'Admin') ? true : false;
	}

	isAuthUserIsStaff(): boolean {
		let authUser = this.authUser();
		return (authUser && authUser.type && authUser.type === 'staff') ? true : false;
	}

	isAuthUserIsCustomer(): boolean {
		let authUser = this.authUser();
		return (authUser && authUser.type && authUser.type === 'customer') ? true : false;
	}

	isAuthUserIsVendor(): boolean {
		let authUser = this.authUser();
		return (authUser && authUser.type && authUser.type === 'vendor') ? true : false;
	}

	getAuthUserType(): string {
		let output: string = 'agent';
		let authUser = this.authUser();
		if (authUser && authUser.roleNames && authUser.roleNames[0] === 'Super Admin') {
			output = 'super-admin';
		} else if (authUser && authUser.roleNames && authUser.roleNames[0] === 'Admin') {
			output = 'admin';
		} else if (authUser && authUser.type && authUser.type === 'staff') {
			output = 'staff';
		} else if (authUser && authUser.type && authUser.type === 'vendor') {
			output = 'vendor';
		} else if (authUser && authUser.type && authUser.type === 'customer') {
			output = 'customer';
		}
		return output;
	}

	canViewAdminDashboard(): boolean {
		return (this.roleMatch(['Admin']) || this.isAuthUserIsAdmin()) ? true : false;
	}

	canViewSuperAdminDashboard(): boolean {
		return (this.roleMatch(['Super Admins']) || this.isAuthUserIsAdmin()) ? true : false;
	}

	setCookieAuthUser(authUser) {
		this.cookieService.set('tji_user', JSON.stringify(authUser));
	}

	setCookieToken(token) {
		this.cookieService.set('tji_token', JSON.stringify(token));
		this.commonService.tji_token = token;
	}

	setCookieRoles(roles) {
		this.cookieService.set('tji_roles', JSON.stringify(roles));
	}

	setCookiePermissions(permissions) {
		this.cookieService.set('tji_permissions', JSON.stringify(permissions));
	}

	getStoredUser() {
		var user = this.storedUser;
		if (user && user.id) { return user; }
		user = JSON.parse(localStorage.getItem('tji_user'));
		if (user && user.id) {
			this.storedUser = user;
			this.storedRoles = user.roleNames;
			this.storedPermissions = user.permissionNames;
			if (!this.cookieService.check('tji_user')) { this.cookieService.set('tji_user', JSON.stringify(user)); }
			if (!this.cookieService.check('tji_roles')) { this.cookieService.set('tji_roles', JSON.stringify(user.roleNames)); }
			if (!this.cookieService.check('tji_permissions')) { this.cookieService.set('tji_permissions', JSON.stringify(user.permissionNames)); }
			if (!this.cookieService.check('language')) {
				let lang = (user.default_lang) ? user.default_lang : 'en';
				this.cookieService.set('language', lang);
			}
			return user;
		}
		user = (this.cookieService.check('tji_user')) ? JSON.parse(this.cookieService.get('tji_user')) : null;
		if (user && user.id) {
			this.storedUser = user;
			this.storedRoles = user.roleNames;
			this.storedPermissions = user.permissionNames;
			this.commonService.tji_token = user.token;
			let lang1 = (user.default_lang) ? JSON.stringify(user.default_lang) : 'en';
			localStorage.setItem('tji_token', JSON.stringify(user.token));
			localStorage.setItem('tji_user', JSON.stringify(user));
			localStorage.setItem('language', lang1);

			let data = user || null;
			let availability = data?.availability || 0;
			localStorage.setItem('availability', JSON.stringify(availability));

			if (!this.cookieService.check('tji_roles')) { this.cookieService.set('tji_roles', JSON.stringify(user.roleNames)); }
			if (!this.cookieService.check('tji_permissions')) { this.cookieService.set('tji_permissions', JSON.stringify(user.permissionNames)); }
			if (!this.cookieService.check('language')) {
				let lang2 = (user.default_lang) ? user.default_lang : 'en';
				this.cookieService.set('language', lang2);
			}
			return user;
		} else {
			this.cookieService.deleteAll();
			this.clearCookie();
			localStorage.clear();
			this.storedUser = null;
			this.storedRoles = [];
			this.storedPermissions = [];
			window.location.href = '/';
			window.location.reload();
			return null;
		}
		return null;
	}

	getStoredRoles() {
		var roleNames: Array<string> = this.storedRoles;
		if (roleNames && roleNames.length > 0) {
			return roleNames;
		} else {
			var user = this.getStoredUser();
			roleNames = (user && user.id) ? user.roleNames : this.storedRoles;
			return roleNames;
		}
		return [];
	}

	getStoredPermissions() {
		var permissionNames: Array<string> = this.storedPermissions;
		if (permissionNames && permissionNames.length > 0) {
			return permissionNames;
		} else {
			var user = this.getStoredUser();
			permissionNames = (user && user.id) ? user.permissionNames : this.storedPermissions;
			return permissionNames;
		}
		return [];
	}

	personTypeMatch(allowedPersonTypes): boolean {
		var isMatch = false;
		if (allowedPersonTypes && allowedPersonTypes.length === 0) { return true; }
		var userPersonType: string = this.storedUser?.type;
		if (userPersonType) {
			for (var i = 0; i < allowedPersonTypes.length; i++) {
				if (userPersonType === allowedPersonTypes[i].toLowerCase()) {
					isMatch = true;
					break;
				}
			}
		} else {
			return true;
		}
		return isMatch;
	}

	roleMatch(allowedRoles): boolean {
    let authUser = this.getStoredUser();
    if (!authUser || !authUser.id) {
      return false; // No authenticated user, so no permissions
    } else if (authUser && authUser.roleNames && authUser.roleNames.includes('Super Admin')) {
      return true; // Super Admin has all permissions
    } else if (authUser && authUser.is_sysAdmin) {
      return true; // System Admin has all permissions
    }
		var userRoles: Array<any> = this.getStoredRoles();
		if (userRoles) {
			return allowedRoles.some(element => 
				userRoles.indexOf(element.toLowerCase()) > -1 || userRoles.indexOf(element) > -1
			);
		}
		return false;
	}

	permissionMatch(allowedPermissions): boolean {
    let authUser = this.getStoredUser();
    if (!authUser || !authUser.id) {
      return false; // No authenticated user, so no permissions
    } else if (authUser && authUser.roleNames && authUser.roleNames.includes('Super Admin')) {
      return true; // Super Admin has all permissions
    } else if (authUser && authUser.is_sysAdmin) {
      return true; // System Admin has all permissions
    }
		var userPermissions: Array<any> = this.getStoredPermissions();
		if (userPermissions && userPermissions.length > 0) {
			return allowedPermissions.some(element => 
				userPermissions.indexOf(element) > -1 || userPermissions.indexOf(element.toLowerCase()) > -1
			);
		}
		return false;
	}

	public setUserNotify(user: User) {
		if (user && user.enable_sound) {
			this.audioService.changePlaySound(user.enable_sound ? true : false);
		} else {
			this.audioService.changePlaySound(false);
		}

		if (user && user.is_web_notify) {
			this.alertService.changeWebNotify(user.is_web_notify ? true : false);
		} else {
			this.alertService.changeWebNotify(false);
		}

		if (user && user.is_desktop_notify) {
			this.alertService.changeDesktopNotify(user.is_desktop_notify ? true : false);
		} else {
			this.alertService.changeDesktopNotify(false);
		}
		return;
	}

	alert(type: string, message) {
		this.alertService.webShow(type, message);
		// let capitalType = type ? type.charAt(0).toUpperCase() + type.substr(1).toLowerCase() : null;
		// this.audioService.playAudio();
		// this.snackBar.openFromComponent(AlertComponent, {
		// 	panelClass: ['alert' + capitalType],
		// 	data: {
		// 		message: message,
		// 		type: type.toLowerCase(),
		// 	}
		// });
	}

	public clearAllMemory() {
		this.cookieService.deleteAll();
		this.clearCookie();
		localStorage.clear();
		window.location.href = '/';
		window.location.reload();
	}

	public clearCookie() {
		if (this.cookieService.check("tji_token")) {
			this.cookieService.delete("tji_token");
			this.commonService.tji_token = null;
		}
		if (this.cookieService.check("tji_user")) {
			this.cookieService.delete("tji_user");
		}
		if (this.cookieService.check("tji_permissions")) {
			this.cookieService.delete("tji_permissions");
		}
		if (this.cookieService.check("tji_roles")) {
			this.cookieService.delete("tji_roles");
		}
		if (this.cookieService.check("language")) {
			this.cookieService.delete("language");
		}
	}

	public isDefaultShowAutoMsg(): boolean {
		let authUser = this.authUser();
		let status: boolean = false;
		status = (authUser && (authUser.clientSetting.default_show_auto_message === true || authUser.clientSetting.default_show_auto_message === 'true')) ? true : false;
		return status;
	}

	public isDefaultShowHistory(): boolean {
		let authUser = this.authUser();
		let status: boolean = false;
		status = (authUser && (authUser.clientSetting.default_show_history_message === true || authUser.clientSetting.default_show_history_message === 'true')) ? true : false;
		return status;
	}

	public isSetFlagMandatory(): boolean {
		let authUser = this.authUser();
		let status: boolean = false;
		status = (authUser && (authUser.clientSetting.set_flag_mandatory === true || authUser.clientSetting.set_flag_mandatory === 'true')) ? true : false;
		return status;
	}

	public isSetCommentMandatory(): boolean {
		let authUser = this.authUser();
		let status: boolean = false;
		status = (authUser && (authUser.clientSetting.set_comment_mandatory === true || authUser.clientSetting.set_comment_mandatory === 'true')) ? true : false;
		return status;
	}

	public getProfileCompletePercentage(): number {
		let authUser = this.authUser();
		let output = (authUser && authUser.id) ? 0 : 100;
		output = (authUser && authUser.profileCompletePercentage) ? authUser.profileCompletePercentage : output;
		return output;
	}

	public checkMandatoryInputs(): boolean {
		let authUser = this.authUser();
		let output = false;

		if (authUser && authUser.person.person_details && authUser.person.person_details) {

			for (var i = 0; i < authUser.person.person_details.length; i++) {
				var requiredInputs = authUser.person.person_details;
				switch (requiredInputs) {
					case 'address':
						output = (authUser.person.detail.address != null && authUser.person.detail.address != null) ? true : false
						break;
					case 'mobile':
						output = (authUser.person.detail.mobile != null && authUser.person.detail.mobile != null) ? true : false
						break;
					case 'company_name':
						output = (authUser.person.detail.company_name != null && authUser.person.detail.company_name != null) ? true : false
						break;
					case 'image_api':
						if (authUser.person.detail.image_api != null && authUser.person.detail.image_api != null) {
							output = true;
						} else {
							output = false;
						}
						break;
					case 'business_brand_name':
						if (authUser.person.detail.business_brand_name != null && authUser.person.detail.business_brand_name != null) {
							output = true;
						} else {
							output = false;
						}
						break;
					case 'business_category':
						if (authUser.person.detail.business_category != null && authUser.person.detail.business_category != null) {
							output = true;
						} else {
							output = false;
						}
						break;
					case 'country':
						if (authUser.person.detail.country != null && authUser.person.detail.country != null) {
							output = true;
						} else {
							output = false;

						}
						break;
					case 'email_verified_at':
						if (authUser.email_verified_at != null && authUser.email_verified_at != null) {
							output = true;
						} else {
							output = false;
						}
						break;
					case 'email':
						if (authUser.email != null && authUser.email != null) {
							output = true;
						} else {
							output = false;
						}
						break;
					default:
						break;
				}

				if (output == true) {
					continue;
				} else {
					break;
				}
			}
		}

		this.checkMandiatoryRes.next(output);

		return output;
	}

	// Check Expired User
	logoutExpiredUser(url = null) {
		let newHeader = new HttpHeaders({
			'Content-Type': 'application/json'
		});
		let newUrl: string = (url) ? url : 'logout-expired';
		return this.httpClient.get(this.tji_domain + newUrl, { headers: newHeader }).pipe(
			map((response: any) => {
				return response;
			}));
	}

	// logout Agent User
	logoutAgentUser(url = null) {
		let newHeader = new HttpHeaders({
			'Content-Type': 'application/json'
		});
		let newUrl: string = (url) ? url : 'forcelogoutall';
		return this.httpClient.get(this.tji_domain + newUrl, { headers: newHeader }).pipe(
			map((response: any) => {
				return response;
			}));
	}

	unSubscribe() {
		// console.log('UnSubscribed YoutubeTicketService');
	}
	getPermission() {
		this.commonService.hitUrl('permission/me', 'optionOne')
			.pipe(untilDestroyed(this, 'unSubscribe'))
			.subscribe(data => {
				if (data.success) {
					if (data && data.data && data.data.permissionNames) {
						this.item.data["permissionNames"] = data.data.permissionNames;
						this.item.data.person.directPermissionArray = data.data.permissionNames;
						this.item.data.person.directPermissionIdArray = data.data.permissionIds;
						this.item.data.person.enabledSitesName = data.data.mysites;
						this.item.data.person.permissionArray = data.data.permissionNames;
						this.item.data.person.permissionIdArray = data.data.permissionIds;
						this.item.data.person.sitesName = data.data.mysites;
						this.cookieService.set('tji_permissions', JSON.stringify(data.data.permissionNames));
						this.storedPermissions = data.data.permissionNames;
						this.cookieService.set('tji_user', JSON.stringify(this.item.data));
						localStorage.setItem('tji_user', JSON.stringify(this.item.data));

						let userData = this.item.data || null;
						let availability = userData?.availability || 0;
						localStorage.setItem('availability', JSON.stringify(availability));

						if (this.item.data.clientId) {
							localStorage.setItem('client_id', JSON.stringify(this.item.data.clientId));
						}
						if (this.item.data.resellerId) {
							localStorage.setItem('reseller_id', JSON.stringify(this.item.data.resellerId));
						}
						if (this.item.data.default_lang) {
							localStorage.setItem('language', this.item.data.default_lang);
							this.cookieService.set('language', this.item.data.default_lang);
						} else {
							localStorage.setItem('language', 'en');
							this.cookieService.set('language', 'en');
						}
						this.storedUser = this.item.data;
						this.storedRoles = this.item.data.roleNames;
						this.storedPermissions = this.item.data.permissionNames;
						this.changeUser(this.item.data);
						let user = this.item.data;
						if (user && user.person) { user.person.user = null };
						this.cookieService.set('tji_user', JSON.stringify(user));
						if (data.data.ClientSettings) {
							localStorage.setItem('client_settings', JSON.stringify(data.data.ClientSettings));
						}
						return this.item.data;
					}
				}
			},
				error => { console.log('Error ::' + error) }
			);
	}

	getPermissionAll() {
		this.commonService.hitUrl('permission/me', 'optionOne')
			.pipe(untilDestroyed(this, 'unSubscribe'))
			.subscribe(data => {
				if (data.success) {
					if (data && data.data && data.data.permissionNames) {
						var user: any = JSON.parse(localStorage.getItem('tji_user'));
						user["permissionNames"] = data.data.permissionNames;
						user.person.directPermissionArray = data.data.permissionNames;
						user.person.directPermissionIdArray = data.data.permissionIds;
						user.person.enabledSitesName = data.data.mysites;
						user.person.permissionArray = data.data.permissionNames;
						user.person.permissionIdArray = data.data.permissionIds;
						user.person.sitesName = data.data.mysites;
						this.cookieService.set('tji_permissions', JSON.stringify(data.data.permissionNames));
						this.storedPermissions = data.data.permissionNames;

						if (data.data.ClientSettings) {
							localStorage.setItem('client_settings', JSON.stringify(data.data.ClientSettings));
						}

						localStorage.setItem('tji_user', JSON.stringify(user));
					}
				}
			},
				error => { console.log('Error ::' + error) }
			);
	}

	getClientAvatar(): string {
		let output: string = this.avatarService.randomGifImage('agents');
		let client = null;
		if (this.isAuthUserIsAdmin()) {
			client = this.authUser()?.clientInfo;
			output = client?.details?.image_api || output;
		} else if (this.isAuthUserIsStaff()) {
			client = this.authUser()?.clientInfo;
			output = client?.details?.image_api || output;
		}
		return output;
	}

	setLanguage(lang: string = 'en') {
		this.cookieService.set('language', lang);
		localStorage.setItem('language', lang);
	}

	getLanguage(): string {
		let lang: string = localStorage.getItem('language') || 'en';
		return lang;
	} 
	
	notificationPermissionMatch(notificationEventName) {
		const storedSettings = localStorage.getItem("tji_notificationSettings");
		if (storedSettings) {
			try {
				const parsedSettings = JSON.parse(storedSettings);

				if (Array.isArray(parsedSettings)) {
					const notification = parsedSettings.find(notify => notify.eventName === notificationEventName);
					return notification ? !!notification.notification : false;
				}
			} catch (error) {
				console.error("Error parsing stored settings:", error);
			}
		}

		return true; 
	}
}

