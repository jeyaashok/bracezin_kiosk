import { Component, OnInit, effect, ViewChild } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { Address, AgentService, AddressService, User, AddressModel, PayoutService, UserService } from 'src/@bracezin/_dbShare';

@Component({
  selector: 'app-agent-item',
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
  agent!: User;
  selectedAddress!: Address;
  
  constructor(
    private route: ActivatedRoute,
    public location: Location,
    public agentService: AgentService,
    public userService: UserService,
    public addressService: AddressService,
    public payoutService: PayoutService) {
      this.dataInit();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Agents' },
      { label: 'Agent Dashboard', active: true }
    ];
    this.getData();
  }

  dataInit() {
    this.agentService.isUpdated.pipe(untilDestroyed(this)).subscribe(data => this.getData());
    this.addressService.isStored.pipe(untilDestroyed(this)).subscribe(data => this.getData());
    this.addressService.isUpdated.pipe(untilDestroyed(this)).subscribe(data => this.getData());
    this.addressService.isDeleted.pipe(untilDestroyed(this)).subscribe(data => this.getData());
    this.payoutService.isStored.pipe(untilDestroyed(this)).subscribe(data => this.getData());
    effect(() => {
      let agent = this.agentService.item();
      if (agent && agent.id) {
        this.agent = agent;
      }
    });
  }

  getData() {
    if(this.id) {
      this.agentService.getItem({id: this.id, with: 'addresses,latestWallets,latestAgentSaleOrders,latestAgentPurchaseOrders', appends: 'info'});
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