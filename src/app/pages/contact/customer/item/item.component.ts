import { Component, OnInit, effect, ViewChild } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { Address, CustomerService, AddressService, User, AddressModel, PayoutService, UserService } from 'src/@bracezin/_dbShare';

@Component({
  selector: 'app-customer-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  standalone: false
})
@UntilDestroy()
export class ItemComponent implements OnInit {

  @ViewChild('sideBar') sideBar: MatDrawer;
  sideView: string = null;
  
  breadCrumbItems!: Array<{}>;
  
  id: string = this.route.snapshot.params['id'] || null;
  customer!: User;
  selectedAddress!: Address;
  
  constructor(
    private route: ActivatedRoute,
    public location: Location,
    public customerService: CustomerService,
    public userService: UserService,
    public addressService: AddressService,
    public payoutService: PayoutService) {
      this.dataInit();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Customers' },
      { label: 'Customer Dashboard', active: true }
    ];
    this.getData();
  }

  dataInit() {
    this.customerService.isUpdated.pipe(untilDestroyed(this)).subscribe(data => this.getData());
    this.addressService.isStored.pipe(untilDestroyed(this)).subscribe(data => this.getData());
    this.addressService.isUpdated.pipe(untilDestroyed(this)).subscribe(data => this.getData());
    this.addressService.isDeleted.pipe(untilDestroyed(this)).subscribe(data => this.getData());
    this.payoutService.isStored.pipe(untilDestroyed(this)).subscribe(data => this.getData());
    effect(() => {
      let customer = this.customerService.item();
      if (customer && customer.id) {
        this.customer = customer;
      }
    });
  }

  getData() {
    if(this.id) {
      this.customerService.getItem({id: this.id, with: 'addresses,latestWallets,latestSaleInvoices,latestSaleOrders,latestEnquiries', appends: 'info'});
    }
  }

  editForm(): void {
    this.sideView = 'form';
    this.sideBar?.toggle();
  }

  onAddAddress(address: Address = null) {
    this.selectedAddress = (address && address.id) ? address : new AddressModel({});
    this.sideView = 'address';
    this.sideBar?.toggle();
  } 

  makePayment() {
    this.sideView = 'payment-form';
    this.sideBar?.toggle();
  }
  
}