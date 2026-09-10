import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppShareModule } from 'src/app/app-share.module';
import { LibraryModule } from '@bracezin/library.module';
import { ReactiveFormsModule } from '@angular/forms';

import { CustomerDashboardRoutingModule } from "./customer-dashboard-routing.module";
import { ListComponent } from "./list/list.component";

@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
		AppShareModule,
		LibraryModule,
    CustomerDashboardRoutingModule,
    ReactiveFormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CustomerDashboardModule { }
