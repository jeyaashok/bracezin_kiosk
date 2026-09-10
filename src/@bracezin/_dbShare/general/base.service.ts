import { Injectable, Output, EventEmitter, Inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
// import { MatSnackBar } from '@angular/material/snack-bar';
import { TableColumn } from 'src/@bracezin/_dbShare/utils';
import { ConfirmComponent } from 'src/@bracezin/components/confirm/confirm.component';

import { GlobalService } from 'src/@bracezin/_dbShare/general/global.service';
import { CommonService } from 'src/@bracezin/_dbShare/general/common.service';
import { AlertService } from 'src/@bracezin/_dbShare/alert/alert/alert.service';

@Injectable({
	providedIn: 'root',
})
@UntilDestroy()

export class BaseService {

	constructor(@Inject('url') public url: string,
		public globalService: GlobalService,
		public commonService: CommonService,
		@Inject('model') public model: any,
		@Inject('mapModel') public mapModel: any,
		public alertService: AlertService,
		// public snackBar: MatSnackBar,
		public dialog: MatDialog,
		@Inject('urlOption') public urlOption: string,
		@Inject('modelName') public modelName: string = '') { }

	routeParams: any;
	defaultParams: any = {
		'paginate': 25,
		'page': 1,
		'limit': 25,
		'current': 1,
		'search': null,
	};

	sortDirection = signal<string>(null);
	sortField = signal<string>(null);
	sortIdentity: any = {
		'name': 'name'
	};

	newUrl = signal<string>(null);
	libraries = signal<any>([]);
	filteredLibraries = signal<any>([]);
	filterColumns = signal<Array<string>>([]);
	allItems = signal<any>([]);
	filteredAllItems = signal<any>([]);
	item = signal<any>({});
	totalItem = signal<number>(0);
	nextItem = signal<any>(null);
	displayItems = signal<any>([]);
	tableColumns = signal<Array<TableColumn>>([]);
	allSearchItems = signal<any>(null);

	public paramsSource = new BehaviorSubject<any>(this.defaultParams);
	params = this.paramsSource.asObservable();

	isAllItems: EventEmitter<boolean> = new EventEmitter();
	isItem: EventEmitter<boolean> = new EventEmitter();
	isStored: EventEmitter<boolean> = new EventEmitter();
	isUpdated: EventEmitter<boolean> = new EventEmitter();
	isDeleted: EventEmitter<boolean> = new EventEmitter();

	onGetAllItemsResponse(response: any, input: any = null) { }
	onGetItemResponse(response: any, input: any = null) { }
	onStoreResponse(response: any, input: any = null) { }
	onUpdateResponse(response: any, input: any = null) { }
	onDestroyResponse(response: any, input: any = null) { }
	onMultiDestroyResponse(response: any, input: any = null) { }

	public _unsubscribeAll: Subject<any>;

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
		this.routeParams = route.params;
		let method: string = route.data['method'] || null;
		let isAllItems: boolean = route.data['allItems'] || false;
		let isItem: boolean = route.data['item'] || false;
		let resolveData = route.data['resolveData'] || null;
		let url = route.data['url'] || null;
		this.changeNewUrl(url);
		if (resolveData) {
			this.defaultParams = { ...this.defaultParams, ...resolveData };
			this.routeParams = { ...this.routeParams, ...resolveData };
		}
		this.changeParams(this.defaultParams);
		return new Promise((resolve, reject) => {
			let allPromises: Array<any> = (resolveData) ? [this.resetParams(this.defaultParams)] : [this.resetParams()];
			if (method) {
				switch (method.toLowerCase()) {
					case 'allitems':
						allPromises.push(this.getAllItems(url));
						break;
					case 'item':
						allPromises.push(this.getItem(url));
						break;
					case 'itembypost':
						allPromises.push(this.getItemByPost(this.routeParams));
						break;
					default:
						break;
				}
			}
			Promise.all(allPromises)
				.then(() => {
					resolve(null);
				}, reject
				);
		});
	}

	unSubscribe() {
		// console.log('UnSubscribed Service');
	}

	unSubscribeFilter() {
		// console.log('UnSubscribed Filters on Service');
	}

	concatlibrary(allItems: Array<any>) {
		var oldLists: Array<any> = this.libraries();
		if (oldLists && oldLists.length > 0) {
			oldLists = this.globalService.arrayMergeById(oldLists, allItems);
		} else {
			oldLists = allItems;
		}
		this.changeLibraries(oldLists);
	}

	removelibrary(item: any) {
		var oldLists: Array<any> = this.libraries();
		if (oldLists && oldLists.length > 0 && item && item.id) {
			oldLists = oldLists.filter(x => {
				return x.id !== item.id;
			});
		}
		this.changeLibraries(oldLists);
	}

	removelibraryById(id: number | string) {
		let libraries: Array<any> = this.libraries();
		let isReplaced: boolean = false;
		if (libraries && libraries.length === 1 &&
			((libraries[0].id && libraries[0].id === id) ||
				(libraries[0]._id && libraries[0]._id === id))) {
			libraries = [];
		}
		if (libraries && libraries.length > 0) {
			for (var i = 0; i < libraries.length; ++i) {
				if ((libraries[i] && libraries[i].id && libraries[i].id === id) ||
					(libraries[i] && libraries[i]._id && libraries[i]._id === id)) {
					libraries.splice(i, 1);
					isReplaced = true;
					break;
				}
			}
		}
		this.changeLibraries(libraries);
	}

	removeAllItemsById(id: number | string) {
		let allItems: Array<any> = this.allItems();
		let isReplaced: boolean = false;
		if (allItems && allItems.length === 1 &&
			((allItems[0].id && allItems[0].id === id) ||
				(allItems[0]._id && allItems[0]._id === id))) {
			allItems = [];
		}
		if (allItems && allItems.length > 0) {
			for (var i = 0; i < allItems.length; ++i) {
				if ((allItems[i] && allItems[i].id && allItems[i].id === id) ||
					(allItems[i] && allItems[i]._id && allItems[i]._id === id)) {
					allItems.splice(i, 1);
					isReplaced = true;
					break;
				}
			}
		}
		this.changeAllItems(allItems);
		this.removelibraryById(id);
	}

	replacelibrary(item: any) {
		let isReplaced: boolean = false;
		var oldLists: Array<any> = this.libraries();
		if (oldLists && oldLists.length > 0 && item && item.id) {
			for (var i = 0; i < oldLists.length; ++i) {
				if ((oldLists[i] && oldLists[i].id && oldLists[i].id === item.id) ||
					(oldLists[i] && oldLists[i]._id && oldLists[i]._id === item._id)) {
					oldLists.splice(i, 1, item);
					isReplaced = true;
					break;
				}
			}
		}
		oldLists = (!isReplaced) ? oldLists.concat([item]) : oldLists;
		this.changeLibraries(oldLists);
	}
 
	splicelibrary(item: any) {
		let oldLists: Array<any> = this.libraries();
		if (item && item.id) {
			let index = oldLists.findIndex(x => x.id === item.id);
			oldLists.splice(index, 1);
			this.changeLibraries(oldLists);
		}
	}

	changeNewUrl(newUrl: string = null) {
		this.newUrl.set(newUrl);
		if (newUrl) { this.url = newUrl; }
	}

	changeLibraries(libraries: Array<any>) {
		let searchText: string = this.allSearchItems();
		if(searchText && searchText.length > 0) {
			this.getFilterLibraries(libraries, searchText);
		} else {
			this.filteredLibraries.set(libraries);
		}
		this.libraries.set(libraries);
	}

	getFilterLibraries(libraries: Array<any>, searchText: string) {
		let filteredLibraries: Array<any> = [];
		let filterColumns: Array<string> = this.filterColumns();
		if(filterColumns && filterColumns.length > 0 && libraries && libraries.length > 0 && searchText && searchText.length > 0) {
			for (let i = 0; i < libraries.length; i++) {
				let library = libraries[i];
				for (let j = 0; j < filterColumns.length; j++) {
					let column = filterColumns[j];
					if (library[column] && library[column].toString().toLowerCase().includes(searchText.toLowerCase())) {
						filteredLibraries.push(library);
						break;
					}
				}
			}
			this.filteredLibraries.set(filteredLibraries);
		}
	}

	getFilterAllItems(allItems: Array<any>, searchText: string) {
		let filteredAllItems: Array<any> = [];
		let filterColumns: Array<string> = this.filterColumns();
		if(filterColumns && filterColumns.length > 0 && allItems && allItems.length > 0 && searchText && searchText.length > 0) {
			for (let i = 0; i < allItems.length; i++) {
				let allItem = allItems[i];
				for (let j = 0; j < filterColumns.length; j++) {
					let column = filterColumns[j];
					if (allItem[column] && allItem[column].toString().toLowerCase().includes(searchText.toLowerCase())) {
						filteredAllItems.push(allItem);
						break;
					}
				}
			}
			this.filteredAllItems.set(filteredAllItems);
		}
	}

	changeAllItems(allItems: Array<any> = []) {
		this.concatlibrary(allItems);
		let searchText: string = this.allSearchItems();
		if(searchText && searchText.length > 0) {
			this.getFilterAllItems(allItems, searchText);
		} else {
			this.filteredAllItems.set(allItems);
		}
		this.allItems.set(allItems);
		this.isAllItems.emit(true);
	}

	changeItem(item: any) {
		this.replacelibrary(item);
		this.item.set(item);
		this.isItem.emit(true);
	}

	changeTotalItem(total: number) {
		this.totalItem.set(total);
	}

	changeToNextItem(nextPage: any) {
		this.nextItem.set(nextPage);
	}

	updateTotalItem(state: string) {
		let total = this.totalItem();
		if (state && state === 'increment') {
			this.totalItem.set(total + 1);
		}
		if (state && state === 'decrement') {
			this.totalItem.set(((total - 1) < 0) ? 0 : total - 1);
		}
	}

	changeDisplayItems(displayItems: Array<any>) {
		this.concatlibrary(displayItems);
		this.displayItems.set(displayItems);
	}

	changeParams(parms: any) {
		this.paramsSource.next(parms);
	}

	concatNewItem(item: any) {
		var allItems: Array<any> = this.allItems();
		let newItems = (item && (item.id || item._id)) ? [item] : [];
		if (allItems && allItems.length > 0) {
			allItems = this.globalService.arrayMergeById(allItems, newItems);
		} else {
			allItems = newItems;
		}
		this.changeAllItems(allItems);
	}

	changeAllItemsByItem(item: any) {
		this.concatNewItem(item);
	}

	paramsInit(params: any) {
		let newParams: any = (params !== null) ? params : { ...this.paramsSource.getValue() };
		let key: any;

		for (key in newParams) {
			if (newParams[key] === null || newParams[key] === undefined) {
				delete newParams[key];
			}
		}
		return newParams;
	}

	resetParams(params: any = null) {
		let defaultParams: any;
		defaultParams = (params) ? params : this.defaultParams;
		this.changeParams(defaultParams);
	}

	getAllItems(url: string = null, params: any = null, doMap: boolean = true, urlOption: string = null) {
		url = (url) ? url : this.url;
		let option: any = (urlOption) ? urlOption : this.urlOption;
		params = this.paramsInit(params);
		this.commonService.getAll(url, params)
			.pipe(untilDestroyed(this, 'unSubscribe'))
			.subscribe(data => {
				let modifiedData = (doMap) ? new this.mapModel(data) : data;
				if (params.all && params.all === 1) {
					if (modifiedData && modifiedData.data && modifiedData.data.length > 0) {
						this.changeAllItems(modifiedData.data);
						this.changeTotalItem(modifiedData.data.length);
						this.changeToNextItem(data?.pagnitation?.next || null)
					} else if (modifiedData && modifiedData.items && modifiedData.items.length > 0) {
						this.changeAllItems(modifiedData.items);
						this.changeTotalItem(modifiedData.items.length);
						this.changeToNextItem(data?.pagnitation?.next || null)
					} else if (modifiedData.data && modifiedData.data.data && modifiedData.data.data.length > 0) {
						this.changeAllItems(modifiedData.data.data);
						this.changeTotalItem(modifiedData.data.data.length);
						this.changeToNextItem(data?.pagnitation?.next || null);
					} else {
						this.changeAllItems([]);
						this.changeTotalItem(0);
					}
				} else {
					if (modifiedData && modifiedData.data && modifiedData.data.data && modifiedData.data.data.length > 0) {
						this.changeAllItems(modifiedData.data.data);
						this.changeTotalItem(data?.data?.total || 0);
						this.changeToNextItem((data?.data?.current_page <= data?.data?.last_page) ? data?.data?.current_page + 1 : null);
					} else if (modifiedData && modifiedData.items && modifiedData.items.length > 0) {
						this.changeAllItems(modifiedData.items);
						this.changeTotalItem(modifiedData.items.length);
						this.changeToNextItem(data?.pagnitation?.next || null)
					} else {
						this.changeAllItems([]);
						this.changeTotalItem(0);
					}
				}
				if (data && data.pagnitation && data.pagnitation.totalResult && data.pagnitation.totalResult > 0) {
					this.changeTotalItem(data.pagnitation.totalResult);
				}
				this.onGetAllItemsResponse(data);
			},
				error => console.log('Error ::' + error)
			);
	}

	concatAllItems(params: any = null, doMap: boolean = true, urlOption: string = null) {
		params = this.paramsInit(params);
		let option: any = (urlOption) ? urlOption : this.urlOption;
		this.commonService.getAll(this.url, params)
			.pipe(untilDestroyed(this, 'unSubscribe'))
			.subscribe(data => {
				let currentPage: number = (data && data.data && data.data.current_page) ? Number(data.data.current_page) : ((data && data.pagnitation && data.pagnitation.current) ? Number(data.pagnitation.current) : null);
				let lastPage: number = (data && data.data && data.data.last_page) ? Number(data.data.last_page) : ((data && data.pagnitation && data.pagnitation.last) ? Number(data.pagnitation.last) : null);

				let modifiedData = (doMap) ? new this.mapModel(data) : data;
				if (params.all && params.all === 1) {
					if (modifiedData && modifiedData.data && modifiedData.data.length > 0) {
						this.changeAllItems(modifiedData.data);
						this.changeTotalItem(modifiedData.data.length);
						this.changeToNextItem(data?.pagnitation?.next || null)
					} else if (modifiedData && modifiedData.items && modifiedData.items.length > 0) {
						this.changeAllItems(modifiedData.items);
						this.changeTotalItem(modifiedData.items.length);
						this.changeToNextItem(data?.pagnitation?.next || null)
					} else if (modifiedData.data && modifiedData.data.data && modifiedData.data.data.length > 0) {
						this.changeAllItems(modifiedData.data.data);
						this.changeTotalItem(modifiedData.data.data.length);
						this.changeToNextItem(data?.pagnitation?.next || null)
					}
				} else {
					if (modifiedData && modifiedData.data && modifiedData.data.data && modifiedData.data.data.length > 0) {
						this.changeAllItems(modifiedData.data.data);
						this.changeTotalItem(data?.data?.total || 0);
						this.changeToNextItem((data?.data?.current_page <= data?.data?.last_page) ? data?.data?.current_page + 1 : null);
					} else if (modifiedData && modifiedData.items && modifiedData.items.length > 0) {
						this.changeAllItems(modifiedData.items);
						this.changeTotalItem(modifiedData.items.length);
						this.changeToNextItem(data?.pagnitation?.next || null)
					}
				}
				if (data && data.pagnitation && data.pagnitation.totalResult && data.pagnitation.totalResult > 0) {
					this.changeTotalItem(data.pagnitation.totalResult);
				}
				// let lists = this.allItems();
				// if (data.data.last_page <= data.data.current_page) {
				// 	params.page = data.data.last_page;
				// 	this.changeParams(params);
				// }
				if (lastPage <= currentPage) {
					params.page = currentPage;
					params.current = currentPage;
					this.changeParams(params);
				}
				// this.changeAllItems(lists);
			},
				error => console.log('Error ::' + error)
			);
	}

	concatItem(item: any) {
		let id = item?.id || item?._id || null;
		let allItems = this.allItems();
		let isReplaced: boolean = false;
		if (allItems && allItems.length > 0 && id) {
			for (var i = 0; i < allItems.length; ++i) {
				if ((allItems[i] && allItems[i].id && item && item.id && allItems[i].id === item.id) ||
					(allItems[i] && allItems[i]._id && item && item._id && allItems[i]._id === item._id)) {
					// allItems[i] = item;
					allItems.splice(i, 1, item);
					isReplaced = true;
					break;
				}
			}
		}
		if (!isReplaced) {
			allItems = (allItems && allItems.length > 0) ? allItems.concat([item]) : [item];
		}
		this.changeAllItems(allItems);
	}

	spliceItem(id: number | string) {
		let allItems = this.allItems();
		let isReplaced: boolean = false;
		if (allItems && allItems.length === 1 &&
			((allItems[0].id && allItems[0].id === id) ||
				(allItems[0]._id && allItems[0]._id === id))) {
			allItems = [];
		}
		if (allItems && allItems.length > 0) {
			for (var i = 0; i < allItems.length; ++i) {
				if ((allItems[i] && allItems[i].id && allItems[i].id === id) ||
					(allItems[i] && allItems[i]._id && allItems[i]._id === id)) {
					allItems.splice(i, 1);
					isReplaced = true;
					break;
				}
			}
		}
		this.removelibraryById(id);
		this.changeAllItems(allItems);
	}

	getItem(params: any = null, urlOption: string = null) {
		this.routeParams = (params) ? params : this.routeParams;
		let option: any = (urlOption) ? urlOption : this.urlOption;
		let newParams = this.routeParams;
		if (newParams && newParams._id && !newParams.id) {
			newParams.id = newParams._id;
		}
		if (newParams && !isNaN(Number(newParams.id)) && Number(newParams.id) > 0) {
			if (newParams.hasOwnProperty("paginate")) { newParams.paginate = null; }
			if (newParams.hasOwnProperty("page")) { newParams.page = null; }
			if (newParams.hasOwnProperty("limit")) { newParams.limit = null; }
			if (newParams.hasOwnProperty("current")) { newParams.current = null; }
			if (newParams.hasOwnProperty("all")) { newParams.all = null; }
			let id = this.routeParams.id;
			this.commonService.getItem(this.url, id, newParams, option)
				.pipe(untilDestroyed(this, 'unSubscribe'))
				.subscribe(data => {
					let item: any = data.data;
					let additional = data?.additional || null;
					item = new this.model(item, additional);
					this.changeAllItemsByItem(item);
					this.changeItem(item);
					this.onGetItemResponse(data, newParams);
				},
					error => console.log('Error ::' + error)
				);
		}
		else {
			this.changeItem({});
		}
	}

	getItemByUrl(itemUrl: string = null, params: any = null, urlOption: string = null) {
		this.routeParams = (params) ? params : this.routeParams;
		let option: any = (urlOption) ? urlOption : this.urlOption;
		let newParams = this.routeParams;
		let url = itemUrl || newParams?.url || this.url;
		if (newParams && newParams._id && !newParams.id) {
			newParams.id = newParams._id;
		}
		if (newParams && newParams.id) {
			// if (newParams && newParams.id && (!isNaN(Number(newParams.id)) && Number(newParams.id) > 0)) {
			if (newParams.hasOwnProperty("paginate")) { newParams.paginate = null; }
			if (newParams.hasOwnProperty("page")) { newParams.page = null; }
			if (newParams.hasOwnProperty("limit")) { newParams.limit = null; }
			if (newParams.hasOwnProperty("current")) { newParams.current = null; }
			if (newParams.hasOwnProperty("all")) { newParams.all = null; }
			let id = this.routeParams.id;
			this.commonService.getItemByPost(url, id, newParams, option)
				.pipe(untilDestroyed(this, 'unSubscribe'))
				.subscribe(data => {
					let item: any = null;
					if (data && data.data && (data.data.id || data.data._id)) {
						item = data.data;
					} else if (data && data.data && data.data.length > 0) {
						item = data.data.filter(x => (x && (x.id && x.id === id) || (x._id && x._id === id)) ? true : false)[0];
					}
					if (item && (item.id || item._id)) {
						let additional = data?.additional || null;
						item = new this.model(item, additional);
						this.changeAllItemsByItem(item);
						this.changeItem(item);
					}
					this.onGetItemResponse(data, newParams);
				},
					error => console.log('Error ::' + error)
				);
		}
		else {
			this.changeItem({});
		}
	}

	getItemByPost(params: any = null, urlOption: string = null) {
		this.routeParams = (params) ? params : this.routeParams;
		let option: any = (urlOption) ? urlOption : this.urlOption;
		let newParams = this.routeParams;
		let url = (newParams && newParams.url) ? newParams.url : this.url;
		this.getItemByUrl(url, newParams, option);
	}

	getItemOnTicket(params: any = null, urlOption: string = null) {
		this.routeParams = (params) ? params : this.routeParams;
		let option: any = (urlOption) ? urlOption : this.urlOption;
		let newParams = this.routeParams;
		let url = (newParams && newParams.url) ? newParams.url : this.url
		if (newParams && newParams._id && !newParams.id) {
			newParams.id = newParams._id;
		}
		if (newParams && !isNaN(Number(newParams.id)) && Number(newParams.id) > 0) {
			if (newParams.hasOwnProperty("paginate")) { newParams.paginate = null; }
			if (newParams.hasOwnProperty("page")) { newParams.page = null; }
			if (newParams.hasOwnProperty("limit")) { newParams.limit = null; }
			if (newParams.hasOwnProperty("current")) { newParams.current = null; }
			if (newParams.hasOwnProperty("all")) { newParams.all = null; }
			let id = this.routeParams.id;
			newParams.condition = newParams?.condition || 'id|=|' + id;
			this.commonService.getItemByPost(url, id, newParams, option)
				.pipe(untilDestroyed(this, 'unSubscribe'))
				.subscribe(data => {
					let item: any = null;
					let modifiedData = new this.mapModel(data);
					if (modifiedData && modifiedData.data && modifiedData.data.length > 0) {
						item = modifiedData.data[0];
					} else if (modifiedData && modifiedData.items && modifiedData.items.length > 0) {
						item = modifiedData.items[0];
					}
					if (item && item.id) {
						this.changeAllItemsByItem(item);
						this.changeItem(item);
					}
					this.onGetItemResponse(data, newParams);
				},
					error => console.log('Error ::' + error)
				);
		}
		else {
			this.changeItem({});
		}
	}

	store(data: any, urlOption: string = null) {
		let inputData: any = data;
		let option: any = (urlOption) ? urlOption : this.urlOption;
		this.commonService.storeItem(this.url, data, true, option)
			.pipe(untilDestroyed(this, 'unSubscribe'))
			.subscribe(data => {
				let item: any = data.data;
				item = (item && (item.id || item._id)) ? item : data.data.data;
				item = (item && (item.id || item._id)) ? item : data.data.item;
				let additional = data?.additional || null;
				item = new this.model(item, additional);
				this.concatNewItem(item);
				this.changeItem(item);
				this.onStoreResponse(data, inputData);
				if ((data && data.success) || (data && data.code === 200) || (data && data.code === 201) || (data && data.response === 'OK')) {
					this.updateTotalItem('increment');
					this.isStored.emit(true);
					let message = data?.message || data?.msg || 'New ' + this.modelName + ' Record Created Successfully.';
					this.alert('success', message, data);
				}
				if (data && data.error) {
					this.isStored.emit(false);
					let errorMsg = data?.message || data?.msg || null;
					if (errorMsg) { this.alert('danger', errorMsg, data); }
				}
			},
				error => {
					this.isStored.emit(false);
					console.log('Error ::' + error);
					let errMessage = (error) ? error : 'Something Wrong. Try after Sometimes.';
					this.alert('Danger', errMessage, error);
				});
	}

	storeByPost(url: string, data: any, withResellerId: boolean = false, urlOption: any = null) {
		let newUrl = (url) ? url : this.url;
		let option: any = (urlOption) ? urlOption : this.urlOption;
		this.storeByUrl(newUrl, data, withResellerId, option);
	}

	storeByUrl(url: string, data: any, withResellerId: boolean = false, urlOption: any = null) {
		let inputData: any = data;
		let newUrl = (url) ? url : this.url;
		let option: any = (urlOption) ? urlOption : this.urlOption;
		this.commonService.storeItem(newUrl, data, withResellerId)
			.pipe(untilDestroyed(this, 'unSubscribe'))
			.subscribe(data => {
        let item: any = data.data;
				item = (item && (item.id || item._id)) ? item : data.data.data;
				item = (item && (item.id || item._id)) ? item : data.data.item;
				let additional = data?.additional || null;
				item = new this.model(item, additional);
        item = (item && (item.id || item._id)) ? new this.model(item, additional) : item;
				this.concatNewItem(item);
				this.changeItem(item);
				this.onStoreResponse(data, inputData);
				if ((data && data.success) || (data && data.code === 200) || (data && data.code === 201) || (data && data.response === 'OK')) {
					this.updateTotalItem('increment');
					this.isStored.emit(true);
					let message = data?.message || data?.msg || 'New ' + this.modelName + ' Record Created Successfully.';
					this.alert('success', message, data);
				}
				if (data && data.error) {
					this.isStored.emit(false);
					let errorMsg = data?.message || data?.msg || null;
					if (errorMsg) { this.alert('danger', errorMsg, data); }
				}
			},
				error => {
					console.log('Error ::' + error);
					let errMessage = (error) ? error : 'Something Wrong. Try after Sometimes.';
					this.alert('Danger', errMessage, error);
					this.isStored.emit(false);
				}
			);
	}

	update(id: number | string, data: any, withResellerId: boolean = false, urlOption: any = null, updatedItem: any = null): void {
		let updateData: any = data;
		let option: any = (urlOption) ? urlOption : this.urlOption;
		this.commonService.updateItem(this.url, id, data)
			.pipe(untilDestroyed(this, 'unSubscribe'))
			.subscribe(data => {
				let item: any = data.data;
				item = (item && (item.id || item._id)) ? item : data.data.data;
				item = (item && (item.id || item._id)) ? item : data.data.item;
				let additional = data?.additional || null;
				item = new this.model(item, additional);
				item = (item && item.id) ? item : updatedItem;
				this.changeAllItemsByItem(item);
				this.changeItem(item);
				this.onUpdateResponse(data, updateData);
				if ((data && data.success) || (data && data.code === 200) || (data && data.response === 'OK')) {
					this.isUpdated.emit(true);
					let message = data?.message || data?.msg || this.modelName + ' Record Updated Successfully.';
					this.alert('Info', message, data);
				}
				if (data && data.error) {
					this.isUpdated.emit(false);
					let errorMsg = data?.message || data?.msg || null;
					if (errorMsg) { this.alert('danger', errorMsg, data); }
				}
			},
				error => {
					this.isUpdated.emit(false);
					console.log('Error ::' + error);
					let errMessage = (error) ? error : 'Something Wrong. Try after Sometimes.';
					this.alert('Danger', errMessage, error);
				});
	}

	updateStateByKey(id: number | string, key: string, state: boolean, urlOption: string = null, updatedItem: any = null): void {
		let data: Object = {};
		let option: any = (urlOption) ? urlOption : this.urlOption;
		data[key] = (state && state === true) ? true : false;
		let updateData: any = data;
		let item: any = this.item();
		this.commonService.updateItem(this.url, id, data, true, option)
			.pipe(untilDestroyed(this, 'unSubscribe'))
			.subscribe(data => {
				let item: any = data.data;
				item = (item && (item.id || item._id)) ? item : data.data.data;
				item = (item && (item.id || item._id)) ? item : data.data.item;
				let additional = data?.additional || null;
				item = new this.model(item, additional);
				item = (item && (item.id || item._id)) ? item : updatedItem;
				this.changeAllItemsByItem(item);
				this.changeItem(item);
				this.onUpdateResponse(data, updateData);
				if ((data && data.success) || (data && data.code === 200) || (data && data.response === 'OK')) {
					this.isUpdated.emit(true);
					let message = data?.message || data?.msg || this.modelName + ' Record Updated Successfully.';
					this.alert('Info', message, data);
				}
				if (data && data.error) {
					this.isUpdated.emit(false);
					let errorMsg = data?.message || data?.msg || null;
					if (errorMsg) { this.alert('danger', errorMsg, data); }
				}
			},
				error => {
					this.isUpdated.emit(false);
					console.log('Error ::' + error);
					let errMessage = (error) ? error : 'Something Wrong. Try after Sometimes.';
					this.alert('Danger', errMessage, error);
					item[key] = !state;
					this.changeAllItemsByItem(item);
					this.changeItem(item);
				});
	}

	updateByPost(url: string, id: number | string, data: any, withResellerId: boolean = false, urlOption: any = null, updatedItem: any = null): void {
		let newUrl = (url) ? url : this.url;
		let option: any = (urlOption) ? urlOption : this.urlOption;
		let updateData: any = data;
		this.commonService.updateItem(newUrl, id, data)
			.pipe(untilDestroyed(this, 'unSubscribe'))
			.subscribe(data => {
				if (data && data.errors) {
					let errMessage = (data && data.errors && data.errors.message && !Array.isArray(data.errors.message)) ? data.errors.message : null;
					if (errMessage) { this.alert('Danger', errMessage, data); }
					else { this.alertService.webErrorShow(data); }
					this.isUpdated.emit(false);
				} else {
					let item: any = data.data;
					item = (item && (item.id || item._id)) ? item : data.data.data;
					item = (item && (item.id || item._id)) ? item : data.data.item;
					if (item && (item.id || item._id)) {
						let additional = data?.additional || null;
						item = new this.model(item, additional);
						item = (item && (item.id || item._id)) ? item : updatedItem;
						this.changeAllItemsByItem(item);
						this.changeItem(item);
						this.onUpdateResponse(data, updateData);
					}
					if ((data && data.success) || (data && data.code === 200) || (data && data.response === 'OK')) {
						this.isUpdated.emit(true);
						let message = data?.message || data?.msg || data?.data?.message || this.modelName + ' Record Updated Successfully.';
						this.alert('Info', message, data);
					}
					if (data && data.error) {
						this.isUpdated.emit(false);
						let errorMsg = data?.message || data?.msg || null;
						if (errorMsg) { this.alert('danger', errorMsg, data); }
					}
				}
			},
				error => {
					this.isUpdated.emit(false);
					console.log('Error ::' + error);
					let errMessage = (error) ? error : 'Something Wrong. Try after Sometimes.';
					this.alert('Danger', errMessage, error);
				}
			);
	}

	updateByUrl(url: string, id: number | string, data: any, withResellerId: boolean = false, urlOption: any = null, updatedItem: any = null): void {
		let newUrl = (url) ? url : this.url;
		let option: any = (urlOption) ? urlOption : this.urlOption;
		let updateData: any = data;
		this.commonService.updateItem(newUrl, id, data)
			.pipe(untilDestroyed(this, 'unSubscribe'))
			.subscribe(data => {
				let item: any = data.data;
				let additional = data?.additional || null;
				item = new this.model(item, additional);
				item = (item && (item.id || item._id)) ? item : updatedItem;
				this.changeItem(item);
				this.changeAllItemsByItem(item);
				this.onUpdateResponse(data, updateData);
				if ((data && data.success) || (data && data.code === 200) || (data && data.response === 'OK')) {
					this.isUpdated.emit(true);
					let message = data?.message || data?.msg || this.modelName + ' Record Updated Successfully.';
					this.alert('Info', message, data);
				}
				if (data && data.error) {
					this.isUpdated.emit(false);
					let errorMsg = data?.message || data?.msg || null;
					if (errorMsg) { this.alert('danger', errorMsg, data); }
				}
			},
				error => {
					this.isUpdated.emit(false);
					console.log('Error ::' + error);
					let errMessage = (error) ? error : 'Something Wrong. Try after Sometimes.';
					this.alert('Danger', errMessage, error);
				});
	}

	destroy(id: number | string, urlOption: string = null) {
		let option: any = (urlOption) ? urlOption : this.urlOption;
		let input: any = { 'id': id };
		this.commonService.deleteItem(this.url, id)
			.pipe(untilDestroyed(this, 'unSubscribe'))
			.subscribe(data => {
				this.spliceItem(id);
				this.updateTotalItem('decrement');
				this.onDestroyResponse(data, input);
				if ((data && data.success) || (data && data.code === 200) || (data && data.response === 'OK')) {
					this.isDeleted.emit(true);
					let message = data?.message || data?.msg || this.modelName + ' Record Deleted Successfully.';
					this.alert('warning', message, data);
				}
				if (data && data.error) {
					this.isDeleted.emit(false);
					let errorMsg = data?.message || data?.msg || null;
					if (errorMsg) { this.alert('danger', errorMsg, data); }
				}
			},
				error => {
					this.isDeleted.emit(false);
					console.log('Error ::' + error);
					let errMessage = (error) ? error : 'Something Wrong. Try after Sometimes.';
					this.alert('Danger', errMessage, error);
				});
	}

	destroyByPost(url: string, id: number | string, urlOption: any = null) {
		let option: any = (urlOption) ? urlOption : this.urlOption;
		let newUrl: string = (url) ? url : this.url;
		let deleteData: any = { 'id': id };
		this.destroyByPostWithData(newUrl, deleteData, option);
	}

	destroyByPostWithData(url: string, data: any, urlOption: any = null) {
		let option: any = (urlOption) ? urlOption : this.urlOption;
		let id = data?.id || data?._id || null;
		let inputData: any = data;
		if (id) {
			this.commonService.deleteItemByPost(url, id, data, false, option)
				.pipe(untilDestroyed(this, 'unSubscribe'))
				.subscribe(data => {
					if (data && data.errors) {
						let errMessage = (data && data.errors && data.errors.message && !Array.isArray(data.errors.message)) ? data.errors.message : null;
						if (errMessage) { this.alert('Danger', errMessage, data); }
						else { this.alertService.webErrorShow(data); }
						this.isDeleted.emit(false);
					} else {
						this.spliceItem(id);
						this.updateTotalItem('decrement');
						this.onDestroyResponse(data, inputData);
						if (data && data.success) {
							this.isDeleted.emit(true);
							let message = data?.message || data?.msg || this.modelName + ' Record Deleted Successfully.';
							this.alert('warning', message, data);
						}
						if (data && data.error) {
							this.isDeleted.emit(false);
							let errorMsg = data?.message || data?.msg || null;
							if (errorMsg) { this.alert('danger', errorMsg, data); }
						}
					}
				},
					error => {
						this.isDeleted.emit(false);
						console.log('Error ::' + error);
						let errMessage = (error) ? error : 'Something Wrong. Try after Sometimes.';
						this.alert('Danger', errMessage, error);
					});
		}
	}

	destroyByUrl(url: string, data: any, urlOption: string = null) {
		let id = (data && data.id) ? data.id : null;
		let inputData: any = data;
		let option: any = (urlOption) ? urlOption : this.urlOption;
		if (id) {
			this.commonService.deleteItem(url, id, option)
				.pipe(untilDestroyed(this, 'unSubscribe'))
				.subscribe(data => {
					this.spliceItem(id);
					this.updateTotalItem('decrement');
					this.onDestroyResponse(data, inputData);
					if ((data && data.success) || (data && data.code === 200) || (data && data.response === 'OK')) {
						this.isDeleted.emit(true);
						let message = data?.message || data?.msg || this.modelName + ' Record Deleted Successfully.';
						this.alert('warning', message, data);
					}
					if (data && data.error) {
						this.isDeleted.emit(false);
						let errorMsg = data?.message || data?.msg || null;
						if (errorMsg) { this.alert('danger', errorMsg, data); }
					}
				},
					error => {
						this.isDeleted.emit(false);
						console.log('Error ::' + error);
						let errMessage = (error) ? error : 'Something Wrong. Try after Sometimes.';
						this.alert('Danger', errMessage, error);
					});
		}
	}

	multiDestroy(url: string, items: Array<any>, urlOption: string = null) {
		let idsArray: Array<any> = (items && items.length > 0) ? items.map(item => item.id) : [];
		let option: any = (urlOption) ? urlOption : this.urlOption;
		let data: any = { 'ids': idsArray };
		let inputData: any = data;
		this.commonService.multiDeleteItems(url, data, option)
			.pipe(untilDestroyed(this, 'unSubscribe'))
			.subscribe(data => {
				if (idsArray && idsArray.length > 0) {
					for (let i = 0; i < idsArray.length; i++) {
						this.spliceItem(idsArray[i]);
						this.updateTotalItem('decrement');
					}
				}
				this.onMultiDestroyResponse(data, inputData);
				if ((data && data.success) || (data && data.code === 200) || (data && data.response === 'OK')) {
					this.isDeleted.emit(true);
					let message = data?.message || data?.msg || this.modelName + ' Selected Records Deleted Successfully.';
					this.alert('warning', message, data);
				}
				if (data && data.error) {
					this.isDeleted.emit(false);
					let errorMsg = data?.message || data?.msg || null;
					if (errorMsg) { this.alert('danger', errorMsg, data); }
				}
			},
				error => {
					this.isDeleted.emit(false);
					console.log('Error ::' + error);
					let errMessage = (error) ? error : 'Something Wrong. Try after Sometimes.';
					this.alert('Danger', errMessage, error);
				}
			);
	}

	post(url: string, data: any, urlOption: string = null) {
		let alert = (data && data.alert) ? data.alert : null;
		let option: any = (urlOption) ? urlOption : this.urlOption;
		let alertType = (data && data.alertType) ? data.alertType : 'Success';
		this.commonService.storeItem(url, data, true, option)
			.pipe(untilDestroyed(this, 'unSubscribe'))
			.subscribe(data => {
				this.getItem();
				if ((data && data.success) || (data && data.code === 200) || (data && data.code === 201) || (data && data.response === 'OK')) {
					this.isStored.emit(true);
					let message = data?.message || data?.msg || this.modelName + ' Record Created Successfully.';
					this.alert('success', message, data);
				}
				if (data && data.error) {
					this.isStored.emit(false);
					let errorMsg = data?.message || data?.msg || null;
					if (errorMsg) { this.alert('danger', errorMsg, data); }
				}
			},
				error => {
					this.isStored.emit(false);
					console.log('Error ::' + error);
					let errMessage = (error) ? error : 'Something Wrong. Try after Sometimes.';
					this.alert('Danger', errMessage, error);
				});
	}

	storeImage(event, item, storeType: string = 'replace', documentType: string = null, urlOption: string = null) {
		let storeMode = (item && item.storeMode) ? item.storeMode : 'replace';
		let reader = new FileReader();
		let option: any = (urlOption) ? urlOption : this.urlOption;

		if (event.target.files && event.target.files.length) {
			const file = event.target.files[0];
			reader.readAsDataURL(file);
			reader.onload = (e: any) => {
				let fileData = {
					'id': item.id,
					'resource_type': (item && item.tableName) ? item.tableName : null,
					'resource_id': (item && item.id) ? item.id : null,
					'store_type': storeType,  //'replace, add-more, etc...'
					'document_type': documentType, // 'proof:id_front, proof:id_back, etc...'
					'file_data': e.target.result,
					'file_name': file.name,
					'file_mime': file.type,
					'file_path': event.target.value,
					'file_extension': file.name.split('.').pop(),
					'file_size': file.size,
				};
				this.commonService.storeItem(this.url + '-store-media', fileData, true, option)
					.pipe(untilDestroyed(this, 'unSubscribe'))
					.subscribe(data => {
						let item: any = data.data;
						let additional = data?.additional || null;
						item = new this.model(item, additional);
						this.changeAllItemsByItem(item);
						this.changeItem(item);
						if ((data && data.success) || (data && data.code === 200) || (data && data.code === 201) || (data && data.response === 'OK')) {
							this.isStored.emit(true);
							let message = data?.message || data?.msg || this.modelName + ' Media Updated Successfully.';
							this.alert('success', message, data);
						}
						if (data && data.error) {
							this.isStored.emit(false);
							let errorMsg = data?.message || data?.msg || null;
							if (errorMsg) { this.alert('danger', errorMsg, data); }
						}
					},
						error => {
							this.isStored.emit(false);
							console.log('Error ::' + error);
							let errMessage = (error) ? error : 'Something Wrong. Try after Sometimes.';
							this.alert('Danger', errMessage, error);
						});
			};
		}
	}

	/** Scroll Event */
	onScroll(url: string = null) {
		const isNextPage = this.nextItem();
		if (!isNextPage) { return; }
		let newUrl = (url) ? url : this.url;
		this.changeNewUrl(newUrl);
		const newParams = { ...this.paramsSource.getValue() };
		newParams.page += 1;
		newParams.current += 1;
		this.changeParams(newParams);
		this.concatAllItems();
	}

	/** Search Event */
	onSearch(input: string, url: string = null) {
		this.allSearchItems.set(input);
		let newUrl = (url) ? url : this.url;
		this.changeNewUrl(newUrl);
		const newParams = { ...this.paramsSource.getValue() };
		newParams.page = 1;
		newParams.current = 1;
		newParams.search = input.toLowerCase();
		this.changeParams(newParams);
		this.getAllItems();
	}

	/** Search Event */
	onSearchData(input: string) {
		this.allSearchItems.set(input);
	}

	onFilter(input: any, url: string = null) {
		let newUrl = (url) ? url : this.url;
		this.changeNewUrl(newUrl);
		const newParams = { ...this.paramsSource.getValue() };
		newParams.page = 1;
		newParams.current = 1;
		for (let key in input) {
			if (input[key] !== null && input[key] !== undefined && input[key] !== '') {
				newParams[key] = input[key];
			} else {
				if (newParams.hasOwnProperty(key)) {
					delete newParams[key];
				}
			}
		}
		this.changeParams(newParams);
		this.getAllItems();
	}

	clearFilter(url: string = null) {
		let newUrl = (url) ? url : this.url;
		this.changeNewUrl(newUrl);
		this.resetParams();
	}

	pageEvent(event, url: string = null) {
		let newUrl = (url) ? url : this.url;
		this.changeNewUrl(newUrl);
		const newParams = { ...this.paramsSource.getValue() };
		newParams.page = event.pageIndex + 1;
		newParams.paginate = event.pageSize;
		newParams.current = event.pageIndex + 1;
		newParams.limit = event.pageSize;
		this.changeParams(newParams);
		this.getAllItems(url);
	}

	getSortName(input: string) {
		let sortName = 'name';
		sortName = (input) ? this.sortIdentity[input] : sortName;
		return sortName;
	}

	sortData(event, field: string = null) {
		field = field || event?.active;
		let direction = event?.direction;
		this.sortField.set(field);
		this.sortDirection.set(direction);
	}

	sortApiData(event, url: string = null) {
		let newUrl = (url) ? url : this.url;
		this.changeNewUrl(newUrl);
		const newParams = { ...this.paramsSource.getValue() };
		newParams.page = 1;
		newParams.current = 1;
		newParams.order = this.getSortName(event.active) + '|' + event.direction;
		this.changeParams(newParams);
		this.getAllItems();
	}

	changeTableColumns(tableColumns: TableColumn[]) {
		this.tableColumns.set(tableColumns);
	}

	changeTableColumn(column: TableColumn) {
		let oldColumns: TableColumn[] = this.tableColumns();
		if (oldColumns && oldColumns.length > 0 && column && column.property) {
			for (var i = 0; i < oldColumns.length; ++i) {
				if (oldColumns[i].property === column.property) {
					oldColumns.splice(i, 1, column);
					break;
				}
			}
		}
		this.changeTableColumns(oldColumns);
	}

	confirmDialog(item, event, title, message, key, mode = 'info') {
		this.changeItem(item);
		let confirmDialog = this.dialog.open(ConfirmComponent, {
			panelClass: 'formDialog-1',
			data: {
				title: title,
				message: message,
				type: mode
			},
		});
		confirmDialog.afterClosed().subscribe(result => {
			let data: Object = {};
			data[key] = (event && event === true) ? true : false;
			if (result && result.data) {
				this.updateStateByKey(item.id, key, data[key]);
			} else {
				this.changeAllItemsByItem(item);
				this.changeItem(item);
			}
		});
	}

	downloadFile(excelData, arrHeader: Array<string> = [], prefix: string = 'download_') {
		if (arrHeader && arrHeader.length > 0) {
			// let arrHeader = ["Date", "Label Name","Lead Name","Client Site Name","Unique Id","Code"];
			let csvData = this.ConvertToCSV(excelData, arrHeader);
			let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
			// this.downLoadLoader = false;
			let dwldLink = document.createElement("a");
			let url = URL.createObjectURL(blob);
			let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
			if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
				dwldLink.setAttribute("target", "_blank");
			}
			dwldLink.setAttribute("href", url);
			var currentTime = new Date().toJSON();
			dwldLink.setAttribute("download", prefix + currentTime + '.csv');
			dwldLink.style.visibility = "hidden";
			document.body.appendChild(dwldLink);
			dwldLink.click();
			document.body.removeChild(dwldLink);
		}
	}

	ConvertToCSV(objArray, headerList) {
		let newHeaders = headerList;
		let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
		let str = '';
		let row = 'S.No,';
		for (let index in newHeaders) {
			row += newHeaders[index] + ',';
		}
		row = row.slice(0, -1);
		str += row + '\r\n';
		for (let i = 0; i < array.length; i++) {
			let line = (i + 1) + '';
			for (let index in headerList) {
				let head = headerList[index];
				line += ',' + this.strRep(array[i][head]);
			}
			str += line + '\r\n';
		}
		return str;
	}

	strRep(data) {
		if (typeof data == "string") {
			if (data == '\"') {
				data = ','
			}
			let newData = data.replace(/,/g, " ");
			// newData.replace(|\|, "colour");
			return newData.toString();
		}
		else if (typeof data == "undefined") {
			return "-";
		}
		else if (typeof data == "number") {
			return data.toString();
		}
		else {
			return data;
		}
	}

	// one clolumn add multiple line 
	// strRep(data) {
	// 	if (data === null || typeof data === 'undefined') {
	// 		return "";
	// 	}
	// 	if (typeof data === 'object') {
	// 		data = JSON.stringify(data);
	// 	}

	// 	let result = String(data);
	// 	if (result.startsWith('=') || result.startsWith('+') || result.startsWith('-') || result.startsWith('@')) {
	// 		result = '\t' + result;
	// 	}
	// 	const hasQuotes = result.includes('"');
	// 	if (hasQuotes) {
	// 		result = result.replace(/"/g, '""');
	// 	}
	// 	const needsQuotes = result.includes(',') || result.includes('\n');
	// 	if (needsQuotes || hasQuotes) {
	// 		result = `"${result}"`;
	// 	}

	// 	return result;
	// }


	alert(type: string, message, response = null) {
		if (message && (message.includes('unknown') || message.includes('Unknown') || message.includes('') || !message) && response) {
			this.alertService.webErrorShow(response, type, message);
		} else {
			this.alertService.webShow(type, message);
		}
	} 

	randomGifImage(type = 'leads'): string {
		let min = 1;
		let max = 50;
		if (type === 'agents') { max = 18; }
		if (type === 'leads') { max = 21 }
		let index = Math.floor(Math.random() * (max - min + 1) + min);
		let output: string = 'images/avatars/leads/' + String(index) + '.gif';
		if (type === 'agents') {
			output = 'images/avatars/agents/' + String(index) + '.gif';
		}
		return output;
	}

	getRandomGif(event, type: string = 'leads') {
		let image = this.randomGifImage(type);
		event.target.src = image;
	}

	storeByRefreshTime(url: string, data: any, withResellerId: boolean = false, urlOption: any = null) {
		let inputData: any = data;
		let newUrl = (url) ? url : this.url;
		let option: any = (urlOption) ? urlOption : this.urlOption;
		this.commonService.storeItemTimeDelay(newUrl, data, withResellerId, option)
			.pipe(untilDestroyed(this, 'unSubscribe'))
			.subscribe(data => {
				if (data && data.errors) {
					let errMessage = (data && data.errors && data.errors.message && !Array.isArray(data.errors.message)) ? data.errors.message : null;
					if (errMessage) { this.alert('Danger', errMessage, data); }
					else { this.alertService.webErrorShow(data); }
					this.isStored.emit(false);
				} else {
					let item: any = data.data;
					item = (item && (item.id || item._id)) ? item : data.data.data;
					item = (item && (item.id || item._id)) ? item : data.data.item;

					if (item) {
						let additional = data?.additional || null;
						item = new this.model(item, additional);
						this.concatNewItem(item);
						this.changeItem(item);
					}
					this.onStoreResponse(data, inputData);
					if ((data && data.success) || (data && data.code === 200) || (data && data.code === 201) || (data && data.response === 'OK')) {
						this.updateTotalItem('increment');
						this.isStored.emit(false);
						let message = data?.message || data?.msg || this.modelName + ' Record Updated Successfully.';
						if (message) { this.alert('success', message, data); }
					}
					if (data && data.error) {
						this.isStored.emit(false);
						let errorMsg = data?.message || data?.msg || null;
						if (errorMsg) { this.alert('danger', errorMsg, data); }
					}
				}
			},
				error => {
					console.log('Error ::' + error);
					let errMessage = (error) ? error : 'Something Wrong. Try after Sometimes.';
					this.alert('Danger', errMessage, error);
					this.isStored.emit(false);
				}
			);
	}

	storeBySync(url: string, data: any, withResellerId: boolean = false, urlOption: any = null) {
		let inputData: any = data;
		let newUrl = (url) ? url : this.url;
		let option: any = (urlOption) ? urlOption : this.urlOption;
		this.commonService.storeItemTimeDelay(newUrl, data, withResellerId, option)
			.pipe(untilDestroyed(this, 'unSubscribe'))
			.subscribe(data => {
				if (data && data.errors) {
					let errMessage = (data && data.errors && data.errors.message && !Array.isArray(data.errors.message)) ? data.errors.message : null;
					if (errMessage) { this.alert('Danger', errMessage, data); }
					else { this.alertService.webErrorShow(data); }
					this.isStored.emit(false);
				} else {
					let item: any = data.data;
					item = (item && (item.id || item._id)) ? item : data.data.data;
					item = (item && (item.id || item._id)) ? item : data.data.item;

					if (item) {
						let additional = data?.additional || null;
						item = new this.model(item, additional);
						this.concatNewItem(item);
						this.changeItem(item);
					}
					this.onStoreResponse(data, inputData);
					if ((data && data.success) || (data && data.code === 200) || (data && data.code === 201) || (data && data.response === 'OK')) {
						this.updateTotalItem('increment');
						this.isStored.emit(true);
						let message = data?.message || data?.msg || this.modelName + ' Record Updated Successfully.';
						if (message) { this.alert('success', message, data); }
					}
					if (data && data.error) {
						this.isStored.emit(false);
						let errorMsg = data?.message || data?.msg || null;
						if (errorMsg) { this.alert('danger', errorMsg, data); }
					}
				}
			},
				error => {
					console.log('Error ::' + error);
					let errMessage = (error) ? error : 'Something Wrong. Try after Sometimes.';
					this.alert('Danger', errMessage, error);
					this.isStored.emit(false);
				}
			);
	}

	convertBlob(url: string) {
		this.commonService.convertBlob(url, {})
			.pipe(untilDestroyed(this, 'unSubscribe'))
			.subscribe(data => {
				if (data && data.errors) {
					let errMessage = (data && data.errors && data.errors.message && !Array.isArray(data.errors.message)) ? data.errors.message : null;
					if (errMessage) { this.alert('Danger', errMessage, data); }
					else { this.alertService.webErrorShow(data); }
					this.isStored.emit(false);
				} else {
					let item: any = data.data;
					item = (item && (item.id || item._id)) ? item : data.data.data;
					item = (item && (item.id || item._id)) ? item : data.data.item;
					let additional = data?.additional || null;
					if (item && (item.id || item._id)) {
						item = new this.model(item, additional);
						this.concatNewItem(item);
						this.changeItem(item);
					}
					if ((data && data.success) || (data && data.code === 200) || (data && data.code === 201) || (data && data.response === 'OK')) {
						this.updateTotalItem('increment');
						this.isStored.emit(true);
						let message = data?.message || data?.msg || 'New ' + this.modelName + ' Record Created Successfully.';
						this.alert('success', message, data);
					}
					if (data && data.error) {
						this.isStored.emit(false);
						let errorMsg = data?.message || data?.msg || null;
						if (errorMsg) { this.alert('danger', errorMsg, data); }
					}
				}
			},
				error => {
					console.log('Error ::' + error);
					let errMessage = (error) ? error : 'Something Wrong. Try after Sometimes.';
					this.alert('Danger', errMessage, error);
					this.isStored.emit(false);
				}
			);
	}

	fileUpload(url: string, data: any, withResellerId: boolean = false, urlOption: any = null) {
		let inputData: any = data;
		let newUrl = (url) ? url : this.url;
		let option: any = (urlOption) ? urlOption : this.urlOption;
		this.commonService.fileUploadNew(newUrl, data, withResellerId, option)
			.pipe(untilDestroyed(this, 'unSubscribe'))
			.subscribe(data => {
				if (data && data.errors) {
					let errMessage = (data && data.errors && data.errors.message && !Array.isArray(data.errors.message)) ? data.errors.message : null;
					if (errMessage) { this.alert('Danger', errMessage, data); }
					else { this.alertService.webErrorShow(data); }
					this.isStored.emit(false);
				} else {
					let item: any = data.data;
					item = (item && (item.id || item._id)) ? item : data.data.data;
					item = (item && (item.id || item._id)) ? item : data.data.item;
					let additional = data?.additional || null;
					if (item && (item.id || item._id)) {
						item = new this.model(item, additional);
						this.concatNewItem(item);
						this.changeItem(item);
					}
					this.onStoreResponse(data, inputData);
					if ((data && data.success) || (data && data.code === 200) || (data && data.code === 201) || (data && data.response === 'OK')) {
						this.updateTotalItem('increment');
						this.isStored.emit(true);
						let message = data?.message || data?.data?.message || data?.msg || 'New ' + this.modelName + ' Record Created Successfully.';
						this.alert('success', message, data);
					}
					if (data && data.error) {
						this.isStored.emit(false);
						let errorMsg = data?.message || data?.msg || null;
						if (errorMsg) { this.alert('danger', errorMsg, data); }
					}
				}
			},
				error => {
					console.log('Error ::' + error);
					let errMessage = (error) ? error : 'Something Wrong. Try after Sometimes.';
					this.alert('Danger', errMessage, error);
					this.isStored.emit(false);
				}
			);
	}
}


