import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppShareModule } from 'src/app/app-share.module';

import { ContactRoutingModule } from "./contact-routing.module";

@NgModule({
  declarations: [ ],
  imports: [
    CommonModule,
    AppShareModule,
    ContactRoutingModule,
  ],
})
export class ContactModule { }
