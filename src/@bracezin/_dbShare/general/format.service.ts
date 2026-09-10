import { Injectable, Output, EventEmitter, Inject, signal } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export interface Format {
	layout : string;
	pageTitle : string;
	showBreadcrumb : boolean;
	breadcrumbs : Array<any>;
	activeBreadcrumb : string;
	showAddButton? : boolean;
	addButtonText? : string;
	showAddComboButton? : boolean;
	addComboButtonText? : string;
	showActionButton? : boolean;
	actionButtonText? : string;
    showActionDropdownButton?: boolean;
	actionDropdownButtonText? : string;
    actionDropdownItems?: Array<string>;
	showSearchForm? : boolean;
	showFilterButton?:boolean;
	filterButtonText? : string;
	showPagination? : boolean;
	showDateFilter? : boolean;
	minDate? : Date;
    maxDate?: Date;
    showMonthYearFilter?: boolean;
	showMediaButton? : boolean;
	showExportButton? : boolean;
	exportButtonText? : string;
	activeRoutes? : Array<string>;
	showSyncButton? : boolean;
	syncButtonText? : string;
	showImportButton? : boolean;
	importButtonText? : string;
	showBackButton? : boolean;
}
 
export class FormatModel {
	layout : string;
	pageTitle : string;
	showBreadcrumb : boolean;
	breadcrumbs : Array<any>;
	activeBreadcrumb : string;

	showAddButton? : boolean;
	addButtonText? : string;
	showAddComboButton? : boolean;
	addComboButtonText? : string;
	showActionButton? : boolean;
	actionButtonText? : string;
    showActionDropdownButton?: boolean;
    actionDropdownButtonText?: string;
    actionDropdownItems?: Array<string>;
	showSearchForm? : boolean;
	showPagination? : boolean;
	showFilterButton?:boolean;
	filterButtonText? : string;
	showDateFilter? : boolean;
	minDate? : Date;
	maxDate? : Date;
    showMonthYearFilter?: boolean;
	showMediaButton? : boolean;
	showExportButton? : boolean;
	exportButtonText? : string;
	activeRoutes? : Array<string>;
	showSyncButton? : boolean;
	syncButtonText? : string;
	showImportButton? : boolean;
	importButtonText? : string;
	showBackButton? : boolean;

	/** Constructor */
    constructor(item) {
		this.layout = item.layout || "list";
		this.pageTitle = item.pageTitle || null;
		this.showBreadcrumb = item.showBreadcrumb || false;
		this.breadcrumbs = item.breadcrumbs || [];
		this.activeBreadcrumb = item.activeBreadcrumb || null;
		this.showAddButton = item.showAddButton || false;
		this.addButtonText = item.addButtonText || null;
		this.showAddComboButton = item.showAddComboButton || false;
		this.addComboButtonText = item.addComboButtonText || null;
		this.showActionButton = item.showActionButton || false;
		this.actionButtonText = item.actionButtonText || 'Action';
        this.showActionDropdownButton = item.showActionDropdownButton || false;
        this.actionDropdownButtonText = item.actionDropdownButtonText || 'Select';
        this.actionDropdownItems = item.actionDropdownItems || [];
		this.showSearchForm = item.showSearchForm || false;
		this.showPagination = item.showPagination || false;
		this.showDateFilter = item.showDateFilter || false;
		this.minDate = item.minDate || null;
		this.maxDate = item.maxDate || null;
        this.showMonthYearFilter = item.showMonthYearFilter || false;
		this.showExportButton = item.showExportButton || null;
		this.exportButtonText = item.exportButtonText || null;
		this.activeRoutes = item.activeRoutes || [];
		this.showSyncButton = item.showSyncButton || [];
		this.syncButtonText = item.syncButtonText || null;
		this.showImportButton = item.showImportButton || [];
		this.importButtonText = item.importButtonText || null;
		this.showBackButton = item.showBackButton || null;
	}
}

export class FormatService {

	public configSource = new BehaviorSubject<Format>(new FormatModel({}));
	config = this.configSource.asObservable();

	// onAdd = signal<boolean>(false);
	onAdd: EventEmitter<boolean> = new EventEmitter();
	onAddCombo: EventEmitter<boolean> = new EventEmitter();
	onAction: EventEmitter<boolean> = new EventEmitter();
    onActionDropdown: EventEmitter<string> = new EventEmitter(null);
	onFilter: EventEmitter<boolean> = new EventEmitter();
	onChange: EventEmitter<any> = new EventEmitter();
	onChangeToDate : EventEmitter <any> = new EventEmitter();
	onChangeMonthYear : EventEmitter <any> = new EventEmitter();
	onMediaAdd: EventEmitter<boolean> = new EventEmitter();
	onExport: EventEmitter<boolean> = new EventEmitter();
	onSearch: EventEmitter<string> = new EventEmitter(null);
	onSync: EventEmitter<boolean> = new EventEmitter();
	onImport: EventEmitter<boolean> = new EventEmitter();

	constructor() { }

	changeConfig(config: Format) {
		this.configSource.next(config);
	}

}

