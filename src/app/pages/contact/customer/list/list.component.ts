import { Component, QueryList, ViewChildren, effect, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Customer, CustomerService, CustomerModel, UserService } from 'src/@bracezin/_dbShare';
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
	customers!: Customer[];
	customer!: Customer;
	dataSource = new MatTableDataSource(this.customerService.allItems());
	displayedColumns = ['code', 'customer', 'contact', 'company', 'outstanding', 'action'];
	dataLength: number = 0;
	param: any;
	pageEvent: PageEvent;
	sideView: string = 'view';
	@ViewChild('sideBar') public sideBar;
	constructor(
		public customerService: CustomerService,
		public userService: UserService,
		private matDialog: MatDialog,
		private router: Router,
		private formBuilder: UntypedFormBuilder) {
		this.customerService.unSubscribe();
		this.customerService.unSubscribeFilter();
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
		this.customerService.unSubscribe();
		this.customerService.unSubscribeFilter();
	}
	dataInit() {
		this.customerService.params.pipe(untilDestroyed(this)).subscribe(data => this.param = data);
		effect(() => {
			this.dataSource = new MatTableDataSource(this.customerService.allItems());
			this.customers = this.customerService.allItems();
			this.customer = this.customerService.item();
			this.dataLength = this.customerService.totalItem();
		});
	}
	getData() {
		this.customerService.changeParams({...this.param, with: 'detail'});
		this.customerService.getAllItems();
	}

	// Navigates to the full-page customer dashboard instead of opening the side drawer
	viewItem(customer: Customer): void {
		if (!customer || !customer.id) { return; }
    this.customerService.changeItem(customer);
		this.router.navigate(['/contact/customer', customer.id]);
	}

	addForm(customer: Customer = new CustomerModel({})): void {
		this.customer = customer;
		this.customerService.changeItem(customer); 
		this.sideView = 'form';
		this.sideBar?.toggle();
	}

	delete(customer: Customer): void {
		let dialogRef = this.matDialog.open(ConfirmComponent, {
			disableClose: false,
			width: '600px',
			data: {
				type: 'delete',
				title: 'Delete Customer  !!!',
				message: 'Are you sure you want to delete this Customer ?',
				item: customer
			}
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result && result.data === true) {
				this.customerService.destroy(customer.id);
			}
		});
	}
	toggleStatus(isActive: boolean, item: Customer): void {
		let dialogRef = this.matDialog.open(ConfirmComponent, {
			disableClose: false,
			width: '600px',
			data: {
				type: 'update',
				title: 'Update Customer  Status',
				message: 'Are you sure you want to update the status of this customer?',
				item: item
			}
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result && result.data === true) {
				let updateData = { is_active: isActive };
				this.customerService.update(item.id, updateData);
			}
		});
	}
}