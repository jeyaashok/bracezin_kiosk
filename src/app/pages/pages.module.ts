import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

// Pages Routing
import { PagesRoutingModule } from "./pages-routing.module";
import { AppShareModule } from '../app-share.module';
import { UtilsModule } from './utils/utils.module';

@NgModule({
  declarations: [ ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    AppShareModule,
    UtilsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PagesModule {
  constructor() {
  }
}
