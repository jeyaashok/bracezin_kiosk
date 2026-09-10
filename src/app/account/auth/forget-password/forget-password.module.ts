import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthCommonModule } from './../../common/auth_common.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Load Icons
import { defineElement } from '@lordicon/element';
import lottie from 'lottie-web';

// Component
import { ForgetPasswordRoutingModule } from "./forget-password-routing.module";
import { BasicComponent } from './basic/basic.component';
import { CoverComponent } from './cover/cover.component';

@NgModule({
  declarations: [
    BasicComponent,
    CoverComponent
  ],
  imports: [
    CommonModule,
    NgbCarouselModule,
    AuthCommonModule,
    ReactiveFormsModule,
    FormsModule,
    ForgetPasswordRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ForgetPasswordModule {
  constructor() {
    defineElement();
  }
 }
