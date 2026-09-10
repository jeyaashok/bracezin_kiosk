import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppShareModule } from 'src/app/app-share.module';

import { FinancialYearRoutingModule } from './financial-year-routing.module';
import { ListComponent } from "./list/list.component";
import { FormComponent } from "./form/form.component";

@NgModule({
  declarations: [
    ListComponent,
    FormComponent
  ],
  imports: [
    CommonModule,
		AppShareModule,
    FinancialYearRoutingModule
  ]
})
export class FinancialYearModule { }