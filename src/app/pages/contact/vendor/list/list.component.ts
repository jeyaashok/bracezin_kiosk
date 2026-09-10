import { Component, ViewChild, effect, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Vendor, VendorService, VendorModel, UserService } from 'src/@bracezin/_dbShare';
import { ConfirmComponent } from '@bracezin/components/confirm/confirm.component';

@UntilDestroy()
@Component({
	selector: 'app-vendor-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.scss'],
	standalone: false
})
export class ListComponent implements OnInit, OnDestroy {
	breadCrumbItems!: Array<{}>;
	allVendors!: Vendor[];
	vendors!: Vendor[];
	vendor!: Vendor;
	dataSource = new MatTableDataSource(this.vendorService.allItems());
	displayedColumns = ['code', 'vendor', 'contact', 'company', 'outstanding', 'action'];
	dataLength: number = 0;
	param: any;
	pageEvent: PageEvent;
	sideView: string = 'form';
	@ViewChild('sideBar') public sideBar;

	constructor(
		public vendorService: VendorService,
		public userService: UserService,
		private matDialog: MatDialog,
		private router: Router,
		private route: ActivatedRoute,
		private formBuilder: UntypedFormBuilder) {
		this.vendorService.unSubscribe();
		this.vendorService.unSubscribeFilter();
		this.dataInit();
	}

	ngOnInit(): void {
		this.getData();
		this.breadCrumbItems = [
			{ label: 'Application' },
			{ label: 'Vendor' },
			{ label: 'List', active: true }
		];
	}

	ngOnDestroy(): void {
		this.vendorService.unSubscribe();
		this.vendorService.unSubscribeFilter();
	}

	dataInit() {
		this.vendorService.params.pipe(untilDestroyed(this)).subscribe(data => this.param = data);
		effect(() => {
			this.dataSource = new MatTableDataSource(this.vendorService.allItems());
			this.allVendors = this.vendorService.libraries();
			this.vendors = this.vendorService.allItems();
			this.vendor = this.vendorService.item();
			this.dataLength = this.vendorService.totalItem();
		});
	}

	getData() {
		this.vendorService.changeParams({ ...this.param, with: 'detail' });
		this.vendorService.getAllItems();
	}

  viewItem(vendor: Vendor): void {
    if (!vendor || !vendor.id) { return; }
    this.vendorService.changeItem(vendor);
    this.router.navigate(['/contact/vendor', vendor.id]);
  }

	addForm(vendor: Vendor = new VendorModel({})): void {
    if (this.userService.permissionMatch(['add vendor']) || (vendor && vendor.id && this.userService.permissionMatch(['manage vendor']))) {
      this.vendor = vendor;
      this.vendorService.changeItem(vendor);
      this.sideView = 'form';
      this.sideBar?.toggle();
    }
	}

	delete(vendor: Vendor): void {
    if (this.userService.permissionMatch(['delete vendor'])) {
      let dialogRef = this.matDialog.open(ConfirmComponent, {
        disableClose: false,
        width: '600px',
        data: {
          type: 'delete',
          title: 'Delete Vendor !!!',
          message: 'Are you sure you want to delete this Vendor ?',
          item: vendor
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.data === true) {
          this.vendorService.destroy(vendor.id);
        }
      });
    }
	}

	toggleStatus(isActive: boolean, item: Vendor): void {
		let dialogRef = this.matDialog.open(ConfirmComponent, {
			disableClose: false,
			width: '600px',
			data: {
				type: 'update',
				title: 'Update Vendor Status',
				message: 'Are you sure you want to update the status of this vendor?',
				item: item
			}
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result && result.data === true) {
				this.vendorService.update(item.id, { is_active: isActive });
			}
		});
	}
}