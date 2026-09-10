import { map } from 'rxjs/operators';
import { Injectable, Pipe } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, throwError, timer, TimeoutError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { finalize, share, shareReplay, tap, retryWhen, take } from 'rxjs/operators';

import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

import { AudioService } from 'src/@bracezin/_dbShare/alert/audio.service';
// import { LoaderService } from '@octopus/library/loader/loader.service';
import { environment } from 'src/environments/environment';
import { AlertService } from 'src/@bracezin/_dbShare/alert/alert/alert.service';
import { Alert } from '../alert';

import { timeout } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})

export class CommonService {
	public logo_image: string = 'images/ai-octopus-logo.png' // environment.domainSecured + '/api/directory/image/1';
	public backendUrlRaw: string = environment.domainSecured + '/';
	public backendUrl: string = environment.domainSecured + '/api/';
	public backendUrlOptionOneRaw: string = environment.domain + '/';
	public backendUrlOptionOne: string = environment.domain + '/api/';
	public backendUrlOptionTwo: string = environment.domain + '/apime/';
	public backendUrlDevRaw: string = environment.domain + '/';
	public backendUrlDev: string = environment.domain + '/api/';
	public baseUrlPrint: string = environment.domain + '/';

	public backendUrlAiProd: string = environment.domain + '/';
	public backendUrlAiDev: string = environment.domain + '/';

	public logo: string = 'img/scrm/scrm-logo_bg.png';
	public logoBlank: string = 'img/scrm/scrm-logo.png';
	public logoAvatar: string = 'img/scrm/logo_avatar.png';
	public logoAvatarGrey: string = 'img/scrm/logo_avatar_grey.png';
	public noUser: string = 'img/no-user.jpg';
	public audioSource: string = "audio/octopus-notification.mp3";

	items: any;
	item: any;
	onChanged: BehaviorSubject<any>;
	onSelected: BehaviorSubject<any>;

	constructor(private httpClient: HttpClient,
		// private loaderService: LoaderService,
		private alertService: AlertService,
		private cookieService: CookieService,
		private router: Router,
		private audioService: AudioService) {
		this.onChanged = new BehaviorSubject([]);
	}

	// tji_domain: string = this.backendUrl;
	tji_domain: string = null;
	client_id: number = Number(localStorage.getItem('client_id'));
	reseller_id: number = Number(localStorage.getItem('reseller_id'));
	isStaff: boolean = false;
	// tji_token: string = (localStorage.getItem('tji_token')) ? localStorage.getItem('tji_token').replace('"', null).replace('"', null) : null;
	tji_token: string = (localStorage.getItem('tji_token')) ? localStorage.getItem('tji_token').slice(1, -1) : null;
	timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	header = new HttpHeaders({
		'Content-Type': 'application/json',
		'X-Timezone': this.timezone
	});

	premiumHeader = new HttpHeaders({
		'Content-Type': 'application/json; charset=utf-8',
		'Accept': 'application/json',
		'X-Timezone': this.timezone
	});

	private showLoader(): void {
		// this.loaderService.show();
	}

	private hideLoader(): void {
		// this.loaderService.hide();
	}

	changeIsAuthStaff(status: boolean) {
		this.isStaff = status;
	}

	changeClientId(clientId: number) {
		localStorage.setItem('client_id', JSON.stringify(clientId));
		this.client_id = Number(localStorage.getItem('client_id'));
	}

	changeResellerId(resellerId: number) {
		localStorage.setItem('reseller_id', JSON.stringify(resellerId));
		this.reseller_id = Number(localStorage.getItem('reseller_id'));
	}

	private getBackendUrl(e: any): void {
		// this.tji_domain = (e == 'optionOne' ? this.backendUrlOptionOne : this.backendUrl);
		if ((e && e == 'optionAiOne') || (e && e == 'optionAiOct')) {
			this.tji_domain = e == 'optionAiOne' ? this.backendUrlAiProd : this.backendUrlAiProd && e == 'optionAiOct' ? this.backendUrlAiDev : this.backendUrlAiDev;
		} else {
			switch (e) {
				case 'optionOneRaw':
					this.tji_domain = this.backendUrlOptionOneRaw;
					break;
				case 'optionOne':
					this.tji_domain = this.backendUrlOptionOne;
					break;
				case 'optionTwo':
					this.tji_domain = this.backendUrlOptionTwo;
					break;
				case 'optionOctRaw':
					this.tji_domain = this.backendUrlDevRaw;
					break;
				case 'optionOct':
					this.tji_domain = this.backendUrlDev;
					break;
				case 'raw':
					this.tji_domain = this.backendUrlRaw;
					break;
				default:
					this.tji_domain = this.backendUrl;
					break;
			}
		}
	}

	// Get All Items
	getAll(url: string, input: any = null, withResellerId: boolean = true, urlOption: any = null): Observable<any> {
		this.showLoader();
		this.getBackendUrl(urlOption);
		if (this.client_id && this.client_id !== null && this.client_id > 0) {
			if (input === null) { input = {}; }
			input.client_id = (input && input.client_id) ? input.client_id : this.client_id;
		}
		if (!this.isStaff && withResellerId && this.reseller_id && this.reseller_id !== null && this.reseller_id > 0) { input.reseller_id = this.reseller_id; }
		return this.httpClient.get(this.tji_domain + url, { headers: this.header, params: input })
			.pipe(map((response: any) => {
				this.items = response;
				this.onChanged.next(this.items);
				return this.items;
			}),
			share(),
			finalize(() => {
				this.hideLoader();
			}),
			retry({ count: 2, delay: 1000 }),
			catchError(error => this.handleError(error))
		);
	}

	// Store New Item Data
	getAllbyPost(url: string, data: any, withResellerId: boolean = true, urlOption: any = null): Observable<any> {
		this.getBackendUrl(urlOption);
		if (this.client_id && this.client_id !== null && this.client_id > 0) {
			if (data === null) { data = {}; }
			data.client_id = (data && data.client_id) ? data.client_id : this.client_id;
		}
		if (data === null) { data = {}; }
		if (!this.isStaff && withResellerId && this.reseller_id && this.reseller_id !== null && this.reseller_id > 0) { data.reseller_id = this.reseller_id; }
		const body = JSON.stringify(data);
		return this.httpClient.post(this.tji_domain + url, body, { headers: this.header })
			.pipe(timeout(25000), map((response: any) => {
				return response;
			}),
				retry({ count: 2, delay: 1000 }), // catchError(error => this.handleError(error)),
				catchError(error => this.handleError(error))
			);
	}

	// Get Item by Selected ID
	getItem(url: string, id: number | string, params: any = null, urlOption: any = null): Observable<any> {
		this.getBackendUrl(urlOption);
		return this.httpClient.get(this.tji_domain + url + '/' + id, { headers: this.header, params: params })
			.pipe(map((response: any) => {
				this.item = response;
				this.onChanged.next(this.item);
				return this.item;
			}),
				share(),
				retry({ count: 2, delay: 1000 }),
				catchError(error => this.handleError(error))
			);
	}

	// Get Item by Selected ID
	getItemByPost(url: string, id: number | string, params: any = null, urlOption: any = null): Observable<any> {
		this.getBackendUrl(urlOption);
		return this.httpClient.post(this.tji_domain + url, params, { headers: this.header })
			.pipe(map((response: any) => {
				this.item = response;
				this.onChanged.next(this.item);
				return this.item;
			}),
				share(),
				retry({ count: 2, delay: 1000 }),
				catchError(error => this.handleError(error))
			);
	}

	// Store New Item Data
	storeItem(url: string, data: any, withResellerId: boolean = true, urlOption: any = null): Observable<any> {
		this.getBackendUrl(urlOption);
		if (this.client_id && this.client_id !== null && this.client_id > 0) {
			if (data === null) { data = {}; }
			data.client_id = (data && data.client_id) ? data.client_id : this.client_id;
		}
		if (data === null) { data = {}; }
		if (!this.isStaff && withResellerId && this.reseller_id && this.reseller_id !== null && this.reseller_id > 0) { data.reseller_id = this.reseller_id; }
		const body = JSON.stringify(data);
		return this.httpClient.post(this.tji_domain + url, body, { headers: this.header })
			.pipe(timeout(25000), map((response: any) => {
				return response;
			}),
				retry({ count: 2, delay: 1000 }), // catchError(error => this.handleError(error)),
				catchError(error => this.handleError(error))
			);
	}

	// Update Item by Selected ID
	updateItem(url: string, id: number | string, data: any, withResellerId: boolean = true, urlOption: any = null): Observable<any> {
		this.getBackendUrl(urlOption);
		if (this.client_id && this.client_id !== null && this.client_id > 0) {
			if (data === null) { data = {}; }
			data.client_id = (data && data.client_id) ? data.client_id : this.client_id;
		}
		if (!this.isStaff && withResellerId && this.reseller_id && this.reseller_id !== null && this.reseller_id > 0) { data.reseller_id = this.reseller_id; }
		const body = JSON.stringify(data);
		return this.httpClient.put(this.tji_domain + url + '/' + id, body, { headers: this.header })
			.pipe(map((response: any) => {
				return response;
			}),
				share(),
				retry({ count: 2, delay: 1000 }),
				catchError(error => this.handleError(error))
			);
	}

	// Update Item by Selected ID
	updateItemByPost(url: string, id: number | string, data: any, withResellerId: boolean = true, urlOption: any = null): Observable<any> {
		this.getBackendUrl(urlOption);
		if (this.client_id && this.client_id !== null && this.client_id > 0) {
			if (data === null) { data = {}; }
			data.client_id = (data && data.client_id) ? data.client_id : this.client_id;
		}
		if (data) { data.id = (data && data.id) ? data.id : id; }
		else { data = { 'id': id }; }

		if (!this.isStaff && withResellerId && this.reseller_id && this.reseller_id !== null && this.reseller_id > 0) { data.reseller_id = this.reseller_id; }
		const body = JSON.stringify(data);
		return this.httpClient.post(this.tji_domain + url, body, { headers: this.header })
			.pipe(map((response: any) => {
				return response;
			}),
				share(),
				retry({ count: 2, delay: 1000 }),
				catchError(error => this.handleError(error))
			);
	}

	// Delete Item by Selected ID
	deleteItem(url: string, id: number | string, urlOption: any = null): Observable<any> {
		this.getBackendUrl(urlOption);
		return this.httpClient.delete(this.tji_domain + url + '/' + id, { headers: this.header })
			.pipe(map((response: any) => {
				return response;
			}),
				share());
	}

	// Delete Item by Selected ID
	deleteItemByPost(url: string, id: number | string, data: any, withResellerId: boolean = true, urlOption: any = null): Observable<any> {
		this.getBackendUrl(urlOption);
		if (this.client_id && this.client_id !== null && this.client_id > 0) {
			if (data === null) { data = {}; }
			data.client_id = (data && data.client_id) ? data.client_id : this.client_id;
		}
		if (data) { data.id = (data && data.id) ? data.id : id; }
		else { data = { 'id': id }; }
		const body = JSON.stringify(data);
		return this.httpClient.post(this.tji_domain + url, body, { headers: this.header })
			.pipe(map((response: any) => {
				return response;
			}),
				share());
	}

	// MultiDelete Items by Selected IDs
	multiDeleteItems(url: string, data: any, urlOption: any = null): Observable<any> {
		this.getBackendUrl(urlOption);
		let body = JSON.stringify(data);
		body = this.cleanParams(body);
		return this.httpClient.post(this.tji_domain + url, body, { headers: this.header }).pipe(
			map((response: any) => {
				return response;
			}),
			share());
	}

	// Get Item by Selected ID
	hitUrl(url: string, urlOption: any = null): Observable<any> {
		this.getBackendUrl(urlOption);
		return this.httpClient.get(this.tji_domain + url, { headers: this.header })
			.pipe(map((response: any) => {
				return response;
			}),
				share(),
				retry({ count: 2, delay: 1000 }),
				catchError(error => this.handleError(error))
			);
	}

	// Get Url
	getUrl(url: string, urlOption: any = null) {
		this.getBackendUrl(urlOption);
		let newHeader = new HttpHeaders({
			'Content-Type': 'application/xlsx',
			responseType: 'blob',
			Accept: 'application/xlsx',
			observe: 'response',
			 'X-Timezone': this.timezone
		});
		return this.httpClient.get(this.tji_domain + url, { headers: newHeader })
			.pipe(map((response: any) => {
				return response;
			}),
				share());
	}

	// Get Url
	getRawUrl(url: string, urlOption: any = null) {
		this.getBackendUrl(urlOption);
		let newHeader = new HttpHeaders({
			'Content-Type': 'application/xlsx',
			skip: 'true',
			'X-Timezone': this.timezone
		});
		return this.httpClient.get(url, { headers: newHeader })
			.pipe(map((response: any) => {
				return response;
			}),
				share());
	}

	// Get Url
	getRawUrlWithAuth(url: string, urlOption: any = null) {
		this.getBackendUrl(urlOption);
		let newHeader = new HttpHeaders({
			'Content-Type': 'application/json',
			'X-Timezone': this.timezone
		});
		return this.httpClient.get(url, { headers: newHeader })
			.pipe(map((response: any) => {
				return response;
			}),
				share());
	}

	// Get Item by Selected name
	getItemByName(url: string, name: string, urlOption: any = null) {
		this.getBackendUrl(urlOption);
		return this.httpClient.get(this.tji_domain + url + '/' + name, { headers: this.header })
			.pipe(map((response: any) => {
				this.item = response;
				this.onChanged.next(this.item);
				return this.item;
			}),
				share());
	}

	// Get Item by Selected Code
	getItemByCode(url: string, code: string, urlOption: any = null) {
		this.getBackendUrl(urlOption);
		return this.httpClient.get(this.tji_domain + url + '/' + code, { headers: this.header })
			.pipe(map((response: any) => {
				this.item = response;
				this.onChanged.next(this.item);
				return this.item;
			}),
				share());
	}

	// Get Item by Selected Code
	getItemByParam(url: string, param: any = null, withResellerId: boolean = true, urlOption: any = null) {
		this.getBackendUrl(urlOption);
		if (this.client_id && this.client_id !== null && this.client_id > 0) {
			if (param === null) { param = {}; }
			param.client_id = (param && param.client_id) ? param.client_id : Number(this.client_id);
		}
		if (!this.isStaff && withResellerId && this.reseller_id && this.reseller_id !== null && this.reseller_id > 0) { param.reseller_id = this.reseller_id; }
		return this.httpClient.get(this.tji_domain + url, { headers: this.header, params: param })
			.pipe(map((response: any) => {
				this.item = response;
				this.onChanged.next(this.item);
				return this.item;
			}),
				share());
	}

	// Store New Item Data
	storeMedia(url: string, data: any, withResellerId: boolean = true, urlOption: any = null): Observable<any> {
		this.getBackendUrl(urlOption);
		if (this.client_id && this.client_id !== null && this.client_id > 0) {
			if (data === null) { data = {}; }
			data.client_id = (data && data.client_id) ? data.client_id : this.client_id;
		}
		if (data === null) { data = {}; }
		if (!this.isStaff && withResellerId && this.reseller_id && this.reseller_id !== null && this.reseller_id > 0) { data.reseller_id = this.reseller_id; }
		const body = JSON.stringify(data);
		return this.httpClient.post(this.tji_domain + url, body, { headers: this.header })
			.pipe(timeout(30000),
				map((response: any) => {
					return response;
				}),
				retry({ count: 2, delay: 1000 }),
				catchError(error => this.handleError(error))
			);
	}

	// Store New Item Data
	replayChat(url: string, data: any, withResellerId: boolean = true, urlOption: any = null): Observable<any> {
		this.getBackendUrl(urlOption);
		if (this.client_id && this.client_id !== null && this.client_id > 0) {
			if (data === null) { data = {}; }
			data.client_id = (data && data.client_id) ? data.client_id : this.client_id;
		}
		if (data === null) { data = {}; }
		if (!this.isStaff && withResellerId && this.reseller_id && this.reseller_id !== null && this.reseller_id > 0) { data.reseller_id = this.reseller_id; }
		const body = JSON.stringify(data);
		return this.httpClient.post(this.tji_domain + url, body, { headers: this.header })
			.pipe(timeout(30000),
				map((response: any) => {
					return response;
				}),
				retry({ count: 2, delay: 1000 }),
				catchError(error => this.handleError(error))
			);
	}

	handleError(error: any) {
		let errorStatusText: string = error?.statusText || null;
		let errorStatus: number = error?.status || null;
		if (error === 'Unauthenticated' || error === 'Unauthenticated.' || error === 'Unauthorized' || error === 'Token invalid or missing') {
			this.clearMemory();
		}
		// if (errorStatusText && (errorStatusText === 'Unauthenticated' || errorStatusText === 'Unauthorized' || errorStatusText === 'Token invalid or missing')) {
		// 	this.clearMemory();
		// }
		// if (errorStatus && (errorStatus === 401)) {
		// 	this.clearMemory();
		// }
		if (error instanceof HttpErrorResponse) {
			this.alertService.showHttpErrorFromResponse(error);
		} else if (error instanceof TimeoutError) {
			this.alertService.webShow('Info', 'The request timed out. Please try again.');
		}
		return throwError(() => error);
	}

	apiAlertResponse(alertType = 'info', response: any) {
		let defaultMsg: string;
		switch (alertType) {
			case 'success':
			case 'Success':
				defaultMsg = "Process Completed Successfully !!!";
				break;
			case 'info':
			case 'Info':
				defaultMsg = "You May have a Information Message !!!";
				break;
			case 'danger':
			case 'Danger':
				defaultMsg = "Something Wrong. Try after Sometimes !!!";
				break;
			case 'warning':
			case 'Warning':
			case 'warn':
			case 'Warn':
				defaultMsg = "This Process may Alert You Something !!!";
				break;
			default:
				defaultMsg = "Something Wrong. Try after Sometimes !!!";
				break;
		}
		let responseMsg = (response && response.message) ? response.message : defaultMsg;
		this.alertService.webShow(alertType, responseMsg);
	}

	alert(data: Alert) {
		let type = (data.type) ? data.type : 'info';
		// let capitalType = type ? type.charAt(0).toUpperCase() + type.substr(1).toLowerCase() : null;
		this.audioService.playAudio();
		this.alertService.websocketShow(type, data);
		// this.snackBar.openFromComponent(AlertComponent, {
		// 	panelClass: ['alert' + capitalType],
		// 	data: {
		// 		type: type.toLowerCase(),
		// 		title: data.title,
		// 		message: data.message,
		// 		image: data.image,
		// 		icon: data.icon
		// 	}
		// });
	}

	playAudio() {
		this.audioService.playAudio();
	}

	clearMemory() {
		this.cookieService.deleteAll();
		if (this.cookieService.check('tji_token')) {
			this.cookieService.delete('tji_token', '/');
		}
		if (this.cookieService.check('tji_user')) {
			this.cookieService.delete('tji_user', '/');
		}
		if (this.cookieService.check('tji_permissions')) {
			this.cookieService.delete('tji_permissions', '/');
		}
		if (this.cookieService.check('tji_roles')) {
			this.cookieService.delete('tji_roles', '/');
		}
		if (this.cookieService.check('language')) {
			this.cookieService.delete('language', 'en');
		}
		localStorage.clear();
        this.cookieService.deleteAll();
		this.router.navigate(["/auth/signin"]);
		window.location.reload();
		// this.client_id = Number(localStorage.getItem('client_id'));
		// this.reseller_id = Number(localStorage.getItem('reseller_id'));
		// if (location.origin == 'http://localhost:4200' || location.origin == 'https://ui.ai-octopus.com/' || location.origin == 'https://stage.ai-octopus.com/') {
		// 	window.location.reload();
		// 	this.router.navigate(["/"]);
		// }else{
		// 	window.location.href = 'https://ai-octopus.com/';
		// }
	}

	setLanguage(lang: string = 'en') {
		this.cookieService.set('language', lang);
		localStorage.setItem('language', lang);
	}

	getLanguage(): string {
		let lang: string = null;
		if (this.cookieService.check('language')) {
			lang = this.cookieService.get('language');
		}
		return lang;
	}

	// Get Item by Selected ID
	getItrsData(url: string, data, urlOption: any = null): Observable<any> {
		const body = JSON.stringify(data);
		this.getBackendUrl(urlOption);
		return this.httpClient.post(this.tji_domain + url, body, { headers: this.header })
			.pipe(timeout(25000),
				map((response: any) => {
					return response;
				}),
				share(),
				retry({ count: 2, delay: 1000 }),
				catchError(error => this.handleError(error))
			);
	}
	// create Item by tamplate based on the itrs data.
	createItrsData(url: string, data, urlOption: any = null): Observable<any> {
		const body = JSON.stringify(data);
		this.getBackendUrl(urlOption);
		return this.httpClient.post(this.tji_domain + url, body, { headers: this.header })
			.pipe(timeout(25000),
				map((response: any) => {
					return response;
				}),
				share(),
				retry({ count: 2, delay: 1000 }),
				catchError(error => this.handleError(error))
			);
	}

	deleteData(data, url: string, urlOption: any = null): Observable<any> {
		this.getBackendUrl(urlOption);
		return this.httpClient.post(this.tji_domain + url, data)
			.pipe(timeout(25000),
				map((response: any) => {
					return response;
				}),
				retry({ count: 2, delay: 1000 }),
				catchError(error => this.handleError(error))
			);
	}

	// Store New Item Data
	getData(url: string, data: any, urlOption: any = null): Observable<any> {
		this.getBackendUrl(urlOption);
		const body = JSON.stringify(data);
		return this.httpClient.post(this.tji_domain + url, body, { headers: this.header })
			.pipe(timeout(25000),
				map((response: any) => {
					return response;
				}),
				share(),
				retry({ count: 2, delay: 1000 }),
				catchError(error => this.handleError(error))
			);
	}

	// Store New Item Data
	getPremium(url: string, data: any, urlOption: any = null): Observable<any> {
		this.getBackendUrl(urlOption);
		let body = {}
		// body = JSON.stringify(data);
		// let headers = new HttpHeaders();
		// this.header = this.header.append('Authorization', "Bearer " + data['token']);
		// headers = headers.append('x-Flatten', 'true');
		// headers = headers.append('Content-Type', 'application/json');


		// if (data['token']) {
		// 	// this.premiumHeader['Authorization'] = "Bearer " + data['token'];
		// 	this.premiumHeader.set('Authorization',  "Bearer " + data['token'])
		// } else {
		// 	body = {}
		// }

		// 	let headersToSend = new HttpHeaders();
		// headersToSend = headersToSend
		//   .set('Bearer', "Bearer " + data['token'])
		//   .set('Accept','application/json');

		const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + data['token'] });
		return this.httpClient.post(this.tji_domain + url, body, { headers: this.header })
			.pipe(timeout(25000),
				map((response: any) => {
					return response;
				}),
				share(),
				retry({ count: 2, delay: 1000 }),
				catchError(error => this.handleError(error))
			);
	}

	// Get Item by Selected Code
	getPremiumLogin(url: string, data: any = null, urlOption: any = null) {
		this.getBackendUrl(urlOption);
		const body = JSON.stringify(data);
		return this.httpClient.post(this.tji_domain + url, data, { headers: { skip: "true",'X-Timezone': this.timezone } })
			.pipe(timeout(25000),
				map((response: any) => {
					return response;
				}),
				share(),
				retry({ count: 2, delay: 1000 }),
				catchError(error => this.handleError(error))
			);
	}

	cleanParams(obj) {
		for (var propName in obj) {
			if (obj[propName] === "null" || obj[propName] === null ||
				obj[propName] === "undefined" || obj[propName] === undefined ||
				obj[propName] === null) {
				delete obj[propName];
			}
		}
		return obj
	} 

	// Store New Item Data
	storeItemTimeDelay(url: string, data: any, withResellerId: boolean = true, urlOption: any = null): Observable<any> {
		this.getBackendUrl(urlOption);
		if (this.client_id && this.client_id !== null && this.client_id > 0) {
			if (data === null) { data = {}; }
			data.client_id = (data && data.client_id) ? data.client_id : this.client_id;
		}
		if (!this.isStaff && withResellerId && this.reseller_id && this.reseller_id !== null && this.reseller_id > 0) { data.reseller_id = this.reseller_id; }
		const body = JSON.stringify(data);
		return this.httpClient.post(this.tji_domain + url, body, { headers: this.header }).pipe(
			map((response: any) => {
				return response;
			}),
			share(),
			catchError(errors => this.handleError(errors))
		);
	}

	// convert Blob Item Data
	convertBlob(url: string, data: any): Observable<any> {
		if (this.client_id && this.client_id !== null && this.client_id > 0) {
			if (data === null) { data = {}; }
			data.client_id = (data && data.client_id) ? data.client_id : this.client_id;
		}
		if (data === null) { data = {}; }
		const body = JSON.stringify(data);
		return this.httpClient.get(url, { headers: this.header, responseType: 'blob' })
			.pipe(timeout(25000), map((response: any) => {
				return response;
			}),
				retry({ count: 2, delay: 1000 }), // catchError(error => this.handleError(error)),
				catchError(error => this.handleError(error))
			);
	}


	fileUploadNew(url: string, data: any, withResellerId: boolean = true, urlOption: any = null): Observable<any> {
		var tji_domain = this.getBaseUrl(urlOption);
		if (this.client_id && this.client_id !== null && this.client_id > 0) {
			data.append('client_id', this.client_id);
		}
		if (!this.isStaff && withResellerId && this.reseller_id && this.reseller_id !== null && this.reseller_id > 0) { data.reseller_id = this.reseller_id; }
		const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tji_token});

		return this.httpClient.post(tji_domain + url, data, { headers: headers })
			.pipe(map((response: any) => {

				return response;
			}),
				// retry({ count: 2, delay: 1000 }), // catchError(error => this.handleError(error)),
				catchError(error => this.handleError(error))
			);
	}

	// Store Multiform File Data
	fileUpload(url: string, data: any, withResellerId: boolean = true, urlOption: any = null): Observable<any> {
		// this.getBackendUrl(urlOption);
		var tji_domain = this.getBaseUrl(urlOption);
		// if (this.client_id && this.client_id !== null && this.client_id > 0) {
		// 	data.append('client_id', this.client_id);
		// }
		if (!this.isStaff && withResellerId && this.reseller_id && this.reseller_id !== null && this.reseller_id > 0) { data.reseller_id = this.reseller_id; }
		const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tji_token });

		return this.httpClient.post(tji_domain + url, data, { headers: headers })
			.pipe(map((response: any) => {
				return response;
			}),
				// retry({ count: 2, delay: 1000 }), // catchError(error => this.handleError(error)),
				catchError(error => this.handleError(error))
			);
	}
	getBaseUrl(urlOption){
		var tji_domain = 'https://bhmi.ai-octopus.com/api/';
		var hostStr = localStorage.getItem('tji_user');

		let host: any;

		if (hostStr) {
			try {
				host = JSON.parse(hostStr); 
			} catch (e) {
				host = [];
			}
		}

		if (host && host['other_hosts'] && host["other_hosts"].length > 0) {
			const item = host.other_hosts.find(h => h.target === "fileupload");
			if (item) {
				tji_domain = item.url+'api/';
			}
		} else {
			this.getBackendUrl(urlOption);
			tji_domain = this.tji_domain;
		}
		return tji_domain
	}
}

