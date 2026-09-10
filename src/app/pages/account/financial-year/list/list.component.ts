import { Component, QueryList, ViewChildren, effect, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FinancialYear, FinancialYearService, FinancialYearModel, UserService } from 'src/@bracezin/_dbShare';
import { ConfirmComponent } from '@bracezin/components/confirm/confirm.component';

@UntilDestroy()
@Component({
	selector: 'app-financial-year-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.scss'],
	standalone: false
})

export class ListComponent implements OnInit, OnDestroy {
	// bread crumb items
	breadCrumbItems!: Array<{}>;

	financialYears!: FinancialYear[];
	financialYear!: FinancialYear;
	dataSource = new MatTableDataSource(this.financialYearService.allItems());
	displayedColumns = ['name', 'description', 'date', 'status', 'action'];
	dataLength: number = 0;
	param: any;
	pageEvent: PageEvent;

	sideView: string = 'view';
	@ViewChild('sideBar') public sideBar;

	constructor(
		public financialYearService: FinancialYearService,
		public userService: UserService,
		private matDialog: MatDialog,
		private router: Router,
		private formBuilder: UntypedFormBuilder) {
		this.financialYearService.unSubscribe();
		this.financialYearService.unSubscribeFilter();
		this.dataInit();
	}

	ngOnInit(): void {
		this.getData();
		this.breadCrumbItems = [
			{ label: 'Account' },
			{ label: 'Tools' },
			{ label: 'Financial Year' },
			{ label: 'List', active: true }
		];
	}

	ngOnDestroy(): void {
		this.financialYearService.unSubscribe();
		this.financialYearService.unSubscribeFilter();
	}

	dataInit() {
		this.financialYearService.params.pipe(untilDestroyed(this)).subscribe(data => this.param = data);
		effect(() => {
			this.dataSource = new MatTableDataSource(this.financialYearService.allItems());
			this.financialYears = this.financialYearService.allItems();
			this.financialYear = this.financialYearService.item();
			this.dataLength = this.financialYearService.totalItem();
		});
	}

	getData() {
		this.financialYearService.changeParams({...this.param, with: 'customer'});
		this.financialYearService.getAllItems();
	}

	viewItem(financialYear: FinancialYear = new FinancialYearModel({})): void {
		this.financialYear = financialYear;
		if (financialYear && financialYear.id) { this.financialYearService.changeItem(financialYear); }
		this.sideView = 'view';
		this.sideBar?.toggle();
	}

	addForm(financialYear: FinancialYear = new FinancialYearModel({})): void {
		this.financialYear = financialYear;
		this.financialYearService.changeItem(financialYear); 
		this.sideView = 'form';
		this.sideBar?.toggle();
	}

	delete(financialYear: FinancialYear): void {
		let dialogRef = this.matDialog.open(ConfirmComponent, {
			disableClose: false,
			width: '600px',
			data: {
				type: 'delete',
				title: 'Delete Financial Year  !!!',
				message: 'Are you sure you want to delete this Financial Year ?',
				item: financialYear
			}
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result && result.data === true) {
				this.financialYearService.destroy(financialYear.id);
			}
		});
	}

	toggleStatus(isActive: boolean, item: FinancialYear): void {
		let dialogRef = this.matDialog.open(ConfirmComponent, {
			disableClose: false,
			width: '600px',
			data: {
				type: 'update',
				title: 'Update Financial Year Status',
				message: 'Are you sure you want to update the status of this financial year?',
				item: item
			}
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result && result.data === true) {
				let updateData = { is_active: isActive };
				this.financialYearService.update(item.id, updateData);
			}
		});
	}

}
