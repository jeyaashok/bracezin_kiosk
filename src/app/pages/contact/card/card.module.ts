import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppShareModule } from 'src/app/app-share.module';

import { ProfileRatioComponent } from './profile-ratio/profile-ratio.component';
import { InfoComponent } from './info/info.component';
import { AboutComponent } from './about/about.component';
import { DetailComponent } from './detail/detail.component';
import { AddressComponent } from './address/address.component';
import { RecentTransactionComponent } from './recent-transaction/recent-transaction.component';
import { RecentSaleInvoicesComponent } from './recent-sale-invoices/recent-sale-invoices.component';
import { RecentSaleOrdersComponent } from './recent-sale-orders/recent-sale-orders.component';
import { RecentEnquiriesComponent } from './recent-enquiries/recent-enquiries.component';
import { RecentPurchaseOrdersComponent } from './recent-purchase-orders/recent-purchase-orders.component';
import { RecentRequestForQuoteComponent } from './recent-request-for-quote/recent-request-for-quote.component';
import { RecentAgentSaleOrdersComponent } from './recent-agent-sale-orders/recent-agent-sale-orders.component';
import { RecentAgentPurchaseOrdersComponent } from './recent-agent-purchase-orders/recent-agent-purchase-orders.component';
import { RolesPermissionsComponent } from './roles-permissions/roles-permissions.component';

@NgModule({
  declarations: [
    ProfileRatioComponent,
    InfoComponent,
    AboutComponent,
    DetailComponent,
    AddressComponent,
    RecentTransactionComponent,
    RecentSaleInvoicesComponent,
    RecentSaleOrdersComponent,
    RecentEnquiriesComponent,
    RecentPurchaseOrdersComponent,
    RecentRequestForQuoteComponent,
    RecentAgentSaleOrdersComponent,
    RecentAgentPurchaseOrdersComponent,
    RolesPermissionsComponent
  ],
  imports: [
    CommonModule,
    AppShareModule,
  ],
  exports: [
    ProfileRatioComponent,
    InfoComponent,
    AboutComponent,
    DetailComponent,
    AddressComponent,
    RecentTransactionComponent,
    RecentSaleInvoicesComponent,
    RecentSaleOrdersComponent,
    RecentEnquiriesComponent,
    RecentPurchaseOrdersComponent,
    RecentRequestForQuoteComponent,
    RecentAgentSaleOrdersComponent,
    RecentAgentPurchaseOrdersComponent,
    RolesPermissionsComponent
  ]
})
export class CardModule { }
