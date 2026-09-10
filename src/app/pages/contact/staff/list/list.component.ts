import { Component, QueryList, ViewChildren, effect, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Staff, StaffService, StaffModel, UserService } from 'src/@bracezin/_dbShare';
import { ConfirmComponent } from '@bracezin/components/confirm/confirm.component';
import { PasswordConfirmComponent } from '../password-confirm/password-confirm.component';

@UntilDestroy()
@Component({
	selector: 'app-staff-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.scss'],
	standalone: false
})

export class ListComponent implements OnInit, OnDestroy {
	// bread crumb items
	breadCrumbItems!: Array<{}>;

	allStaffs!: Staff[];
	staffs!: Staff[];
	staff!: Staff;
	dataSource = new MatTableDataSource(this.staffService.allItems());
	displayedColumns = ['code', 'staff', 'contact', 'outstanding', 'action'];
	dataLength: number = 0;
	param: any;
	pageEvent: PageEvent;

	sideView: string = 'view';
	@ViewChild('sideBar') public sideBar;

	constructor(
		public staffService: StaffService,
		public userService: UserService,
		private matDialog: MatDialog,
		private router: Router,
		private formBuilder: UntypedFormBuilder) {
		this.staffService.unSubscribe();
		this.staffService.unSubscribeFilter();
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
		this.staffService.unSubscribe();
		this.staffService.unSubscribeFilter();
	}

	dataInit() {
		this.staffService.params.pipe(untilDestroyed(this)).subscribe(data => this.param = data);
		effect(() => {
			this.dataSource = new MatTableDataSource(this.staffService.allItems());
			this.allStaffs = this.staffService.libraries();
			this.staffs = this.staffService.allItems();
			this.staff = this.staffService.item();
			this.dataLength = this.staffService.totalItem();
		});
	}

	getData() {
		this.staffService.changeParams({...this.param, with: 'detail'});
		this.staffService.getAllItems();
	}

	viewItem(staff: Staff = new StaffModel({})): void {
		if (staff && staff.id) {
			this.router.navigate(['/contact/staff', staff.id]);
		}
	}

	addForm(staff: Staff = new StaffModel({})): void {
    if (this.userService.permissionMatch(['add staff']) || (staff && staff.id && this.userService.permissionMatch(['manage staff']))) {
      this.staff = staff;
      this.sideView = 'form';
      this.sideBar?.toggle();
    }
	}

	delete(staff: Staff): void {
    if (this.userService.permissionMatch(['delete staff'])) {
		let dialogRef = this.matDialog.open(ConfirmComponent, {
			disableClose: false,
			width: '600px',
			data: {
				type: 'delete',
				title: 'Delete Staff  !!!',
				message: 'Are you sure you want to delete this Staff ?',
				item: staff
			}
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result && result.data === true) {
				this.staffService.destroy(staff.id);
			}
		});
    }
	}

	toggleStatus(isActive: boolean, item: Staff): void {
		let dialogRef = this.matDialog.open(ConfirmComponent, {
			disableClose: false,
			width: '600px',
			data: {
				type: 'update',
				title: 'Update Staff  Status',
				message: 'Are you sure you want to update the status of this staff?',
				item: item
			}
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result && result.data === true) {
				let updateData = { is_active: isActive };
				this.staffService.update(item.id, updateData);
			}
		});
	}

	changePassword(staff: Staff): void {
    if(staff && staff.id) {
      let dialogRef = this.matDialog.open(PasswordConfirmComponent, {
        disableClose: false,
        width: '400px'
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.data === true && result.password && result.password.length > 0) {
          this.staffService.storeByPost('update-password', {id: staff.id, user_id: staff.id, password: result.password});
        }
      });
    }
	}

}
