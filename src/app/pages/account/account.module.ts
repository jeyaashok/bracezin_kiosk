import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppShareModule } from 'src/app/app-share.module';

import { AccountRoutingModule } from './account-routing.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
		AppShareModule,
    AccountRoutingModule
  ]
})
export class AccountModule { }