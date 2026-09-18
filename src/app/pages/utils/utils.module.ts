import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppShareModule } from 'src/app/app-share.module';
import { LibraryModule } from '@bracezin/library.module';

import { AdminListComponent } from './admin-list/admin-list.component';
import { CompanyListComponent } from './company-list/company-list.component';
import { AgentListComponent } from './agent-list/agent-list.component';
import { AddressFormComponent } from './address-form/address-form.component';
import { AddressListComponent } from './address-list/address-list.component';

@NgModule({
  declarations: [
		AdminListComponent,
		CompanyListComponent,
		AgentListComponent,
		AddressFormComponent,
		AddressListComponent
	],
	imports: [
		CommonModule,
		AppShareModule,
		LibraryModule,
	],
	exports: [
		AdminListComponent,
		CompanyListComponent,
		AgentListComponent,
		AddressFormComponent,
		AddressListComponent
	],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UtilsModule { }
