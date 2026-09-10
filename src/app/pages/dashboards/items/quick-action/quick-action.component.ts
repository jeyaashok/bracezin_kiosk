import { Component, OnInit, effect, computed, signal, Input } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { EnquiryService } from 'src/@bracezin/_dbShare/order/enquiry';

@Component({
  selector: 'app-dashboard-quick-action',
  templateUrl: './quick-action.component.html',
  styleUrls: ['./quick-action.component.scss'],
  standalone: false
})
@UntilDestroy()

export class QuickActionComponent implements OnInit {

  quickActions: Array<any> = [
    { label: 'New Enquiry', icon: 'ri-booklet-line', color: 'bg-orange-500', link: '/application/enquiry/add' },
    { label: 'New Request For Quote', icon: 'ri-volume-up-line', color: 'bg-green-500', link: '/purchases/request-for-quote/add' },
    { label: 'Create Sale Order', icon: 'ri-price-tag-3-line', color: 'bg-indigo-500', link: '/sales/sale-order/add' },
    { label: 'Create Purchase Order', icon: 'ri-shopping-basket-2-line', color: 'bg-teal-500', link: '/purchases/purchase-order/add' },
    { label: 'Customer', icon: 'ri-group-line', color: 'bg-purple-500', link: '/contact/customer/list' },
    { label: 'Vendor', icon: 'ri-user-add-line', color: 'bg-cyan-500', link: '/contact/vendor/list' },
  ];

  constructor() { }

  ngOnInit(): void { }

}