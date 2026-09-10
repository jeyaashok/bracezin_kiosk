import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthCommonModule } from './../../common/auth_common.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Component
import { SignupRoutingModule } from './signup-routing.module';
import { BasicComponent } from './basic/basic.component';
import { CoverComponent } from './cover/cover.component';

@NgModule({
  declarations: [
    BasicComponent,
    CoverComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SignupRoutingModule,
    AuthCommonModule
  ]
})
export class SignupModule { }
