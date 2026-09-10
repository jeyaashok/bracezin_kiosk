import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthCommonModule } from './../../common/auth_common.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Component
import { LockScreenRoutingModule } from "./lockscreen-routing.module";
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
    LockScreenRoutingModule
  ]
})
export class LockscreenModule { }
