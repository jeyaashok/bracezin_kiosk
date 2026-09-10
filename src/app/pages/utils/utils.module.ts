import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppShareModule } from 'src/app/app-share.module';
import { LibraryModule } from '@bracezin/library.module';

import { ProductListComponent } from './product-list/product-list.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { BrandListComponent } from './brand-list/brand-list.component';
import { PclassListComponent } from './pclass-list/pclass-list.component';
import { SectionListComponent } from './section-list/section-list.component';
import { VendorListComponent } from './vendor-list/vendor-list.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { AgentListComponent } from './agent-list/agent-list.component';
import { EnquiryListComponent } from './enquiry-list/enquiry-list.component';
import { AddressFormComponent } from './address-form/address-form.component';
import { AddressListComponent } from './address-list/address-list.component';
import { PaymentTermListComponent } from './payment-term-list/payment-term-list.component';
import { DeliveryTermListComponent } from './delivery-term-list/delivery-term-list.component';
import { PaymentHistoryListComponent } from './payment-history-list/payment-history-list.component';
import { PaymentFormComponent } from './payment-form/payment-form.component';

@NgModule({
  declarations: [
		ProductListComponent,
		CategoryListComponent,
		BrandListComponent,
		PclassListComponent,
		SectionListComponent,
		VendorListComponent,
		CustomerListComponent,
		AgentListComponent,
		EnquiryListComponent,
		AddressFormComponent,
		AddressListComponent,
		PaymentTermListComponent,
		DeliveryTermListComponent,
		PaymentHistoryListComponent,
    PaymentFormComponent
	],
  imports: [
    CommonModule,
    AppShareModule,
    LibraryModule,
  ],
	exports: [
		ProductListComponent,
		CategoryListComponent,
		BrandListComponent,
		PclassListComponent,
		SectionListComponent,
		VendorListComponent,
		CustomerListComponent,
		AgentListComponent,
		EnquiryListComponent,
		AddressFormComponent,
		AddressListComponent,
		PaymentTermListComponent,
		DeliveryTermListComponent,
		PaymentHistoryListComponent,
    PaymentFormComponent
	],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UtilsModule { }
