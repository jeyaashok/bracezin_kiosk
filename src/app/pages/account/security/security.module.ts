import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppShareModule } from 'src/app/app-share.module';
import { LibraryModule } from '@bracezin/library.module';

import { SecurityRoutingModule } from './security-routing.module';

@NgModule({
  declarations: [ ],
  imports: [
    CommonModule,
		AppShareModule,
		LibraryModule,
    SecurityRoutingModule
  ]
})
export class SecurityModule { }