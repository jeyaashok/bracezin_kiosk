import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppShareModule } from 'src/app/app-share.module';

import { RolesPermissionRoutingModule } from './roles-permission-routing.module';
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
    RolesPermissionRoutingModule
  ]
})
export class RolesPermissionModule { }