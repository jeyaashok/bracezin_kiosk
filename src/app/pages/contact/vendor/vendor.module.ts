import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppShareModule } from 'src/app/app-share.module';
import { UtilsModule } from 'src/app/pages/utils/utils.module';
import { LibraryModule } from '@bracezin/library.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from './../card/card.module';

import { VendorRoutingModule } from "./vendor-routing.module";
import { ListComponent } from "./list/list.component";
import { ItemComponent } from "./item/item.component";
import { FormComponent } from "./form/form.component";

@NgModule({
  declarations: [
    ListComponent,
		ItemComponent,
		FormComponent
  ],
  imports: [
    CommonModule,
		AppShareModule,
		UtilsModule,
		LibraryModule,
    VendorRoutingModule,
    ReactiveFormsModule,
    CardModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class VendorModule { }
