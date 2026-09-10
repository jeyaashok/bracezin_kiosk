import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Feather Icon
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { CountUpDirective } from 'ngx-countup';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { NgbDropdownModule, NgbNavModule, NgbTypeaheadModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SimplebarAngularModule } from 'simplebar-angular';
// Apex Chart Package
import { NgApexchartsModule } from 'ng-apexcharts';
// Swiper Slider
import { SlickCarouselModule } from 'ngx-slick-carousel';
// Flat Picker
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

//Module
import { DashboardsRoutingModule } from "./dashboards-routing.module";
import { SharedModule } from '../../shared/shared.module';
import { AppShareModule } from 'src/app/app-share.module';
import { WidgetModule } from '../../shared/widget/widget.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { CountComponent } from './items/count/count.component';
import { QuickActionComponent } from './items/quick-action/quick-action.component';
import { RecentActivitiesComponent } from './items/recent-activities/recent-activities.component';
import { RecentEnquiriesComponent } from './items/recent-enquiries/recent-enquiries.component';
import { RecentRequestForQuotationComponent } from './items/recent-request-for-quotation/recent-request-for-quotation.component';

import { SalesChartComponent } from './items/sales-chart/sales-chart.component';
import { SaleorderChartComponent } from './items/saleorder-chart/saleorder-chart.component';
import { PurchaseorderChartComponent } from './items/purchaseorder-chart/purchaseorder-chart.component';

@NgModule({
  declarations: [
    DashboardComponent,
    CountComponent,
    QuickActionComponent,
    RecentActivitiesComponent,
    RecentEnquiriesComponent,
    RecentRequestForQuotationComponent,
    SalesChartComponent,
    SaleorderChartComponent,
    PurchaseorderChartComponent,
  ],
  imports: [
    CommonModule,
    FeatherModule.pick(allIcons),
    CountUpDirective,
    NgbToastModule,
    LeafletModule,
    NgbDropdownModule,
    NgbNavModule,
    SimplebarAngularModule,
    NgApexchartsModule,
    SlickCarouselModule ,
    FlatpickrModule.forRoot(),
    DashboardsRoutingModule,
    SharedModule,
    AppShareModule,
    WidgetModule,
    NgbTypeaheadModule,
    NgbPaginationModule,
    NgbTooltipModule,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class DashboardsModule { }
