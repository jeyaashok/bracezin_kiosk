import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthCommonModule } from '../../common/auth_common.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// otp module
import { NgOtpInputModule } from 'ng-otp-input';

// Component
import { ChangePasswordRoutingModule } from "./change-password-routing.module";
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
    ChangePasswordRoutingModule,
    NgOtpInputModule
  ]
})
export class ChangePasswordModule { 
  
}
