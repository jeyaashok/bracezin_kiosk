import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { ConfirmComponent } from '@bracezin/components/confirm/confirm.component';
import { User, AddressService, Address, AddressModel } from 'src/@bracezin/_dbShare';

@Component({
  selector: 'app-contact-card-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
  standalone: false
})
@UntilDestroy()
export class AddressComponent implements OnInit {

  @Output() onAdd = new EventEmitter<any>(null);
  @Output() onEdit = new EventEmitter<Address>();
  @Input() user: User;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog,
    public addressService: AddressService) { }

  ngOnInit(): void { }

  addItem() {
    this.addressService.changeItem(new AddressModel({}));
    this.onAdd.emit();
  }

  editItem(item: Address) {
    this.addressService.changeItem(item);
    this.onEdit.emit(item);
  }

  delete(address: Address): void {
      let dialogRef = this.matDialog.open(ConfirmComponent, {
        disableClose: false,
        width: '600px',
        data: {
          type: 'delete',
          title: 'Delete Address  !!!',
          message: 'Are you sure you want to delete this Address ?',
          item: address
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.data === true) {
          this.addressService.destroy(address.id);
        }
      });
    }
}