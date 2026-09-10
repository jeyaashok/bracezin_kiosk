import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

import { FooterComponent } from './footer/footer.component';
import { SocialLoginComponent } from './social-login/social-login.component';
import { CarousalComponent } from './carousal/carousal.component';

@NgModule({
  declarations: [
    FooterComponent,
    SocialLoginComponent,
    CarousalComponent
  ],
  imports: [
    CommonModule,
    NgbCarouselModule
  ],
  exports: [
    FooterComponent,
    SocialLoginComponent,
    CarousalComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AuthCommonModule { }
