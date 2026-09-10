import { Component, effect, OnInit, OnDestroy } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { Setting, SettingService, UserService } from 'src/@bracezin/_dbShare';

@UntilDestroy()
@Component({
	selector: 'app-system-setting-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.scss'],
	standalone: false
})
export class ListComponent implements OnInit, OnDestroy {

	breadCrumbItems!: Array<{}>;

	settings!: Setting[];
	setting!: Setting;
	groupedSettings: Record<string, Setting[]> = {};
	dataLength: number = 0;
	param: any;
	validationErrors: Record<number, string> = {};
	private lastSavedValues: Record<number, string> = {};
	private readonly debounceMs: number = 500;
	private pendingUpdateTimers: Record<number, ReturnType<typeof setTimeout>> = {};

  orderSetting: Array<any> = ['company', 'enquiry', 'request_for_quote', 'sales', 'purchases', 'product', 'customer', 'vendor', 'agent', 'staff'];

	constructor(public settingService: SettingService,
    public userService: UserService) {
		this.settingService.unSubscribe();
		this.settingService.unSubscribeFilter();
		this.dataInit();
	}

	ngOnInit(): void {
		this.getData();
		this.breadCrumbItems = [
			{ label: 'Account' },
			{ label: 'System Settings' },
			{ label: 'List', active: true }
		];
	}

	dataInit() {
		this.settingService.params.pipe(untilDestroyed(this)).subscribe(data => this.param = data);
		effect(() => {
			this.settings = this.settingService.allItems();
			this.setting = this.settingService.item();
			this.dataLength = this.settingService.totalItem();
			this.initializeSavedValues(this.settings);
			if (this.settings && this.settings.length > 0) {
				this.groupedSettings = this.settings.reduce((groups: Record<string, Setting[]>, setting: Setting) => {
					const category = setting.category || 'Other';
					if (!groups[category]) {
						groups[category] = [];
					}
					groups[category].push(setting);
					return groups;
				}, {});
			}
		});
	}

	getData() {
		this.settingService.changeParams({ ...this.param, paginate: 500, limit: 500 });
		this.settingService.getAllItems();
	}

  matchOrder(key: string, order: string): boolean {
    return key.toLowerCase() === order.toLowerCase();
  }

	onFieldValueChange(setting: Setting, value: any) {
		setting.value = this.normalizeValue(setting, value);
		this.validateField(setting);
	}

	onFieldCommit(setting: Setting) {
		this.commitField(setting);
	}

	onFieldDebouncedCommit(setting: Setting) {
		if (!setting?.id || !this.isEditable(setting)) {
			return;
		}

		const timer = this.pendingUpdateTimers[setting.id];
		if (timer) {
			clearTimeout(timer);
		}

		this.pendingUpdateTimers[setting.id] = setTimeout(() => {
			delete this.pendingUpdateTimers[setting.id];
			this.commitField(setting);
		}, this.debounceMs);
	}

	onFileChange(event: Event, setting: Setting) {
		const input = event.target as HTMLInputElement;
		const file = input?.files && input.files.length ? input.files[0] : null;
		setting.value = file ? file.name : '';
		this.validateField(setting);
		this.onFieldCommit(setting);
	}

	ngOnDestroy(): void {
		this.settingService.unSubscribe();
		this.settingService.unSubscribeFilter();
		Object.keys(this.pendingUpdateTimers).forEach((key) => {
			const timer = this.pendingUpdateTimers[Number(key)];
			if (timer) {
				clearTimeout(timer);
			}
		});
		this.pendingUpdateTimers = {};
	}

	hasError(setting: Setting): boolean {
		return !!this.validationErrors[setting.id];
	}

	getError(setting: Setting): string {
		return this.validationErrors[setting.id] || '';
	}

	isEditable(setting: Setting): boolean {
		return (this.userService.permissionMatch(['manage system setting']) && setting?.is_editable) ? true : false;
	}

	private commitField(setting: Setting) {
		if (!setting || !setting.id || !this.isEditable(setting)) {
			return;
		}

		const isValid = this.validateField(setting);
		if (!isValid) {
			return;
		}

		const normalizedValue = this.normalizeValue(setting, setting.value);
		if (this.lastSavedValues[setting.id] === normalizedValue) {
			return;
		}

		setting.value = normalizedValue;
		this.lastSavedValues[setting.id] = normalizedValue;
		const payload = { ...setting, value: normalizedValue };
		this.settingService.update(setting.id, payload);
	}

	private initializeSavedValues(settings: Setting[] = []) {
		for (const setting of settings || []) {
			if (setting?.id) {
				this.lastSavedValues[setting.id] = this.normalizeValue(setting, setting.value);
			}
		}
	}

	private validateField(setting: Setting): boolean {
		const value = this.normalizeValue(setting, setting.value);
		let error = '';

		if (!value) {
			error = `${this.getFieldLabel(setting)} is required.`;
		}

		if (!error && setting.field_type_name === 'email') {
			const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
			if (!isEmail) {
				error = `Enter a valid email for ${this.getFieldLabel(setting)}.`;
			}
		}

		if (!error && (setting.field_type_name === 'number')) {
			const asNumber = Number(value);
			if (Number.isNaN(asNumber)) {
				error = `${this.getFieldLabel(setting)} must be a valid number.`;
			}
		}

		if (!error && (setting.field_type_name === 'link' || setting.field_type_name === 'imageurl' || setting.field_type_name === 'videourl')) {
			const isUrl = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i.test(value);
			if (!isUrl) {
				error = `Enter a valid URL for ${this.getFieldLabel(setting)}.`;
			}
		}

		if (!error && setting.field_type_name === 'boolean') {
			if (!(value === 'true' || value === 'false')) {
				error = `${this.getFieldLabel(setting)} must be true or false.`;
			}
		}

		if (!error && setting.field_type_name === 'select') {
			const options = this.getOptions(setting);
			if (options.length > 0 && !options.includes(value)) {
				error = `Select a valid option for ${this.getFieldLabel(setting)}.`;
			}
		}

		if (!error && value.length > 255) {
			error = `${this.getFieldLabel(setting)} must be 255 characters or fewer.`;
		}

		if (error) {
			this.validationErrors[setting.id] = error;
			return false;
		}

		delete this.validationErrors[setting.id];
		return true;
	}

	getOptions(setting: any): string[] {
		if (!setting || !Array.isArray(setting.options)) {
			return [];
		}

		return setting.options.map((option: any) => String(option));
	}

	private normalizeValue(setting: Setting, value: any): string {
		if (value === null || value === undefined) {
			return '';
		}

		const raw = String(value).trim();
		if (setting.field_type_name === 'boolean') {
			return raw.toLowerCase() === 'true' ? 'true' : raw.toLowerCase() === 'false' ? 'false' : raw;
		}

		return raw;
	}

	private getFieldLabel(setting: Setting): string {
		return (setting?.field || 'Field').replace(/_/g, ' ');
	}

}