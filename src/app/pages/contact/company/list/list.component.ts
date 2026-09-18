import { Component, QueryList, ViewChildren, effect, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Company, CompanyService, CompanyModel, UserService } from 'src/@bracezin/_dbShare';
import { ConfirmComponent } from '@bracezin/components/confirm/confirm.component';
@UntilDestroy()
@Component({
	selector: 'app-enquiry-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.scss'],
	standalone: false
})
export class ListComponent implements OnInit, OnDestroy {
	// bread crumb items
	breadCrumbItems!: Array<{}>;
	companies!: Company[];
	company!: Company;
	dataSource = new MatTableDataSource(this.companyService.allItems());
	displayedColumns = ['code', 'company', 'contact', 'business', 'outstanding', 'action'];
	dataLength: number = 0;
	param: any;
	pageEvent: PageEvent;
	sideView: string = 'view';
	@ViewChild('sideBar') public sideBar;
	constructor(
		public companyService: CompanyService,
		public userService: UserService,
		private matDialog: MatDialog,
		private router: Router,
		private formBuilder: UntypedFormBuilder) {
		this.companyService.unSubscribe();
		this.companyService.unSubscribeFilter();
		this.dataInit();
	}
	ngOnInit(): void {
		this.getData();
		this.breadCrumbItems = [
			{ label: 'Application' },
			{ label: 'Enquiry' },
			{ label: 'List', active: true }
		];
	}

	ngOnDestroy(): void {
		this.companyService.unSubscribe();
		this.companyService.unSubscribeFilter();
	}
	dataInit() {
		this.companyService.params.pipe(untilDestroyed(this)).subscribe(data => this.param = data);
		effect(() => {
			this.dataSource = new MatTableDataSource(this.companyService.allItems());
			this.companies = this.companyService.allItems();
			this.company = this.companyService.item();
			this.dataLength = this.companyService.totalItem();
		});
	}
	getData() {
		this.companyService.changeParams({...this.param, with: 'detail'});
		this.companyService.getAllItems();
	}

	// Navigates to the full-page company dashboard instead of opening the side drawer
	viewItem(company: Company): void {
		if (!company || !company.id) { return; }
    this.companyService.changeItem(company);
		this.router.navigate(['/contact/company', company.id]);
	}

	addForm(company: Company = new CompanyModel({})): void {
		this.company = company;
		this.companyService.changeItem(company); 
		this.sideView = 'form';
		this.sideBar?.toggle();
	}

	delete(company: Company): void {
		let dialogRef = this.matDialog.open(ConfirmComponent, {
			disableClose: false,
			width: '600px',
			data: {
				type: 'delete',
				title: 'Delete Company  !!!',
				message: 'Are you sure you want to delete this Company ?',
				item: company
			}
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result && result.data === true) {
				this.companyService.destroy(company.id);
			}
		});
	}
	toggleStatus(isActive: boolean, item: Company): void {
		let dialogRef = this.matDialog.open(ConfirmComponent, {
			disableClose: false,
			width: '600px',
			data: {
				type: 'update',
				title: 'Update Company  Status',
				message: 'Are you sure you want to update the status of this company?',
				item: item
			}
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result && result.data === true) {
				let updateData = { is_active: isActive };
				this.companyService.update(item.id, updateData);
			}
		});
	}
}