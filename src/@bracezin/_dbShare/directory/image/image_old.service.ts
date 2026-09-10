import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { MatSnackBar } from '@angular/material/snack-bar';

import { GlobalService } from 'src/@bracezin/_dbShare/general/global.service';
import { CommonService } from 'src/@bracezin/_dbShare/general/common.service';
import { Image } from './image.interface';
import { ImageModel } from './image_model.model';
import { AlertService } from 'src/@bracezin/_dbShare/alert/alert/alert.service';

@Injectable({
	providedIn: 'root',
})
@UntilDestroy()

export class ImageService implements Resolve<any> {
	url: string = 'directory/image';
	routeParams: any;
	defaultParams: any = {
		'all': 1,
		'search': null,
	};

	private allItemsSource = new BehaviorSubject<Image[]>([]);
	allItems = this.allItemsSource.asObservable();

	private itemSource = new BehaviorSubject<Image>(new ImageModel({}));
	item = this.itemSource.asObservable();

	private paramsSource = new BehaviorSubject<any>(this.defaultParams);
	params = this.paramsSource.asObservable();

	private _unsubscribeAll: Subject<any>;

	constructor(private globalService: GlobalService,
		private commonService: CommonService,
		private alertService: AlertService,
		private snackBar: MatSnackBar) {
		this._unsubscribeAll = new Subject();
	}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
		this.routeParams = route.params;
		return new Promise((resolve, reject) => {
			Promise.all([
				this.resetParams(),
				this.getAllItems(),
				this.getItem()
			])
				.then(() => {
					resolve(null);
				}, reject
				);
		});
	}

	unSubscribe() {
		// console.log('UnSubscribed ImageService');
	}

	unSubscribeFilter() {
		// console.log('UnSubscribed Filters on ImageService');
	}

	changeAllItems(allItems: Image[]) {
		this.allItemsSource.next(allItems);
	}

	changeItem(item: Image) {
		this.itemSource.next(item);
	}

	changeParams(parms: any) {
		this.paramsSource.next(parms);
	}

	changeAllItemsByItem(item: Image) {
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

	concatItem(item: Image) {
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
			this.changeItem(new ImageModel({}));
		}
	}

	store(data: any) {
		this.commonService.storeItem(this.url, data)
			.pipe(untilDestroyed(this, 'unSubscribe'))
			.subscribe(data => {
				this.concatItem(data.item.data);
				this.changeItem(data.item.data);
				this.alert('Success', 'Created Successfully !!!');
			},
				error => {
					console.log('Error ::' + error);
					this.alert('Danger', 'Something Wrong. Try after Sometimes !!!');
				}
			);
	}

	storeMore(data: any) {
		this.commonService.storeItem(this.url + '/add-more', data)
			.pipe(untilDestroyed(this, 'unSubscribe'))
			.subscribe(data => {
				this.changeAllItems(data.items.data);
			},
				error => console.log('Error ::' + error)
			);
	}

	replaceImage(data: any) {
		this.commonService.storeItem(this.url + '/replace', data)
			.pipe(untilDestroyed(this, 'unSubscribe'))
			.subscribe(data => {
				this.changeItem(data.item);
			},
				error => console.log('Error ::' + error)
			);
	}

	addWhatsappImage(data: any) {
		this.commonService.storeItem(this.url + '/add-whatsapp-image', data)
			.pipe(untilDestroyed(this, 'unSubscribe'))
			.subscribe(data => {
				this.changeItem(data.item);
			},
				error => console.log('Error ::' + error)
			);
	}

	storeImage(event, input) {
		let storeMode = (input && input.storeMode) ? input.storeMode : 'replace';
		let reader = new FileReader();
		let resourceData = {
			'resource_type': (input && input.resource_type) ? input.resource_type : null,
			'resource_id': (input && input.resource_id) ? input.resource_id : null,
		};

		if (event.target.files && event.target.files.length) {
			const file = event.target.files[0];
			reader.readAsDataURL(file);
			reader.onload = (e: any) => {
				let imageData = {
					'image': e.target.result,
					'image_name': file.name,
					'image_type': file.type,
					'image_file_path': event.target.value
				};

				switch (storeMode) {
					case "store":
						this.store(Object.assign(resourceData, imageData));
						break;
					case "addMore":
						this.storeMore(Object.assign(resourceData, imageData));
						break;
					case "replace":
						this.replaceImage(Object.assign(resourceData, imageData));
						break;
					case "add-whatsapp-image":
						this.addWhatsappImage(Object.assign(resourceData, imageData));
						break;
					default:
						this.replaceImage(Object.assign(resourceData, imageData));
						break;
				}
			};
		}
	}

	setAsPrimary(id) {
		this.commonService.getAll(this.url + '/set-primary/' + id)
			.pipe(untilDestroyed(this, 'unSubscribe'))
			.subscribe(data => {
				this.changeAllItems(data.items);
			},
				error => console.log('Error ::' + error)
			);
	}

	update(id: number, data: any) {
		this.commonService.updateItem(this.url, id, data)
			.pipe(untilDestroyed(this, 'unSubscribe'))
			.subscribe(data => {
				this.changeAllItemsByItem(data.item);
				this.changeItem(data.item);
				this.alert('Info', 'Updated Successfully !!!');
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
}
