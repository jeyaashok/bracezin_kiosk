import { Component, ViewChild, effect, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Admin, AdminService, AdminModel, UserService } from 'src/@bracezin/_dbShare';
import { ConfirmComponent } from '@bracezin/components/confirm/confirm.component';

@UntilDestroy()
@Component({
	selector: 'app-admin-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.scss'],
	standalone: false
})
export class ListComponent implements OnInit, OnDestroy {
	breadCrumbItems!: Array<{}>;
	allAdmins!: Admin[];
	admins!: Admin[];
	admin!: Admin;
	dataSource = new MatTableDataSource(this.adminService.allItems());
	displayedColumns = ['code', 'admin', 'contact', 'company', 'outstanding', 'action'];
	dataLength: number = 0;
	param: any;
	pageEvent: PageEvent;
	sideView: string = 'form';
	@ViewChild('sideBar') public sideBar;

	constructor(
		public adminService: AdminService,
		public userService: UserService,
		private matDialog: MatDialog,
		private router: Router,
		private route: ActivatedRoute,
		private formBuilder: UntypedFormBuilder) {
		this.adminService.unSubscribe();
		this.adminService.unSubscribeFilter();
		this.dataInit();
	}

	ngOnInit(): void {
		this.getData();
		this.breadCrumbItems = [
			{ label: 'Application' },
			{ label: 'Admin' },
			{ label: 'List', active: true }
		];
	}

	ngOnDestroy(): void {
		this.adminService.unSubscribe();
		this.adminService.unSubscribeFilter();
	}

	dataInit() {
		this.adminService.params.pipe(untilDestroyed(this)).subscribe(data => this.param = data);
		effect(() => {
			this.dataSource = new MatTableDataSource(this.adminService.allItems());
			this.allAdmins = this.adminService.libraries();
			this.admins = this.adminService.allItems();
			this.admin = this.adminService.item();
			this.dataLength = this.adminService.totalItem();
		});
	}

	getData() {
		this.adminService.changeParams({ ...this.param, with: 'detail' });
		this.adminService.getAllItems();
	}

  viewItem(admin: Admin): void {
    if (!admin || !admin.id) { return; }
    this.adminService.changeItem(admin);
    this.router.navigate(['/contact/admin', admin.id]);
  }

	addForm(admin: Admin = new AdminModel({})): void {
    if (this.userService.permissionMatch(['add admin']) || (admin && admin.id && this.userService.permissionMatch(['manage admin']))) {
      this.admin = admin;
      this.adminService.changeItem(admin);
      this.sideView = 'form';
      this.sideBar?.toggle();
    }
	}

	delete(admin: Admin): void {
    if (this.userService.permissionMatch(['delete admin'])) {
      let dialogRef = this.matDialog.open(ConfirmComponent, {
        disableClose: false,
        width: '600px',
        data: {
          type: 'delete',
          title: 'Delete Admin !!!',
          message: 'Are you sure you want to delete this Admin ?',
          item: admin
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.data === true) {
          this.adminService.destroy(admin.id);
        }
      });
    }
	}

	toggleStatus(isActive: boolean, item: Admin): void {
		let dialogRef = this.matDialog.open(ConfirmComponent, {
			disableClose: false,
			width: '600px',
			data: {
				type: 'update',
				title: 'Update Admin Status',
				message: 'Are you sure you want to update the status of this admin?',
				item: item
			}
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result && result.data === true) {
				this.adminService.update(item.id, { is_active: isActive });
			}
		});
	}
}