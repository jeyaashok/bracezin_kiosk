import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { slugify } from '@bracezin/_dbShare/utils/slugify.util';

import { Setting } from '@bracezin/_dbShare/setting/setting/setting.interface';
import { SettingModel } from '@bracezin/_dbShare/setting/setting/setting_model.model';

@Injectable({
	providedIn: 'root',
})

export class GlobalService {
	private settingsSource = new BehaviorSubject<Setting[]>([new SettingModel({})]);
	settings = this.settingsSource.asObservable();

	static company_name: string = 'Bracezin';
	static company_author: string = 'Jeyakumar.A';
	static company_phone: string = '+91-9976648919';
	static company_mobile: string = '+91-9976648919';
	static company_website: string = 'www.bracezin.com';
	static company_email: string = 'support@techjobind.com';
	static company_address: string = '#57, Thulsairam Street, Meenakshi Nagar, Villapuram, Madurai - 625012.';

	constructor() { }

	changeSettings(settings: Setting[]) {
		this.settingsSource.next(settings);
	}

	getValue(category: string, field: string): any {
		let items: Setting[];
		let value = '';
		category = (slugify(category, { lower: true }));
		field = (slugify(field, { lower: true }));
		this.settings.subscribe(data => {
			items = data;
		});
		for (var i = 0; i < items.length; ++i) {
			let setCategory = slugify(items[i].category, { lower: true });
			let setField = slugify(items[i].field, { lower: true });
			if (setCategory === category && setField === field) {
				return value = items[i].value;
			}
		}
	}

	setValue(id: number, value: string) {
		let items: Setting[];
		this.settings.subscribe(data => items = data);
		for (var i = 0; i < items.length; ++i) {
			if (items[i].id === id) {
				items[i].value = value;
				break;
			}
		}
		this.changeSettings(items);
	}


	arrayMergeById($oldArray, $updateArray) {
		if ($oldArray && $oldArray.length > 0) {
			for (var i = 0; i < $updateArray.length; ++i) {
				var item = $updateArray[i];
				for (var j = 0; j < $oldArray.length; ++j) {
					var oldItem = $oldArray[j];
					if (oldItem.id == item.id) {
						$oldArray[j] = item;
						break;
					}
				}
			}
			$oldArray = $oldArray.concat($updateArray.filter(x => x && x.id && x.id !== null && x.id !== undefined && x.id !== '' && $oldArray.every(y => y && y.id && y.id !== null && y.id !== undefined && y.id !== '' && y.id !== x.id)));
		} else {
			$oldArray = $updateArray;
		}
		return $oldArray;
	}

	arrayMergeByIdAndTableName($oldArray, $updateArray) {
		if ($oldArray && $oldArray.length > 0) {
			for (var i = 0; i < $updateArray.length; ++i) {
				var item = $updateArray[i];
				for (var j = 0; j < $oldArray.length; ++j) {
					var oldItem = $oldArray[j];
					if (oldItem.id == item.id && oldItem.tableName == item.tableName) {
						$oldArray[j] = item;
						break;
					}
				}
			}
			$oldArray = $oldArray.concat($updateArray.filter(x => x && x.id && x.id !== null && x.id !== undefined && x.id !== '' && $oldArray.every(y => (y  && y.id && y.id !== null && y.id !== undefined && y.id !== '' && y.id !== x.id && y.tableName !== x.tableName))));
		} else {
			$oldArray = $updateArray;
		}
		return $oldArray;
	}

}
