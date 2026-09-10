import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppShareModule } from 'src/app/app-share.module';

import { SystemSettingRoutingModule } from './system-setting-routing.module';
import { ListComponent } from "./list/list.component";

@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
		AppShareModule,
    SystemSettingRoutingModule
  ]
})
export class SystemSettingModule { }