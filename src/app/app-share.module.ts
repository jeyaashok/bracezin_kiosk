import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppMatModule } from 'src/app/app-mat.module';
import { FlatpickrDirective } from 'angularx-flatpickr';
import { CountUpDirective } from 'ngx-countup';
import { NgApexchartsModule } from 'ng-apexcharts';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { NgbDropdownModule, NgbNavModule, NgbTypeaheadModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AvatarModule, AvatarComponent  } from 'ngx-avatars';
import { SimplebarAngularModule } from 'simplebar-angular';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { LightboxModule } from 'ngx-lightbox';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { DatePipe } from '@angular/common';
import { DecimalInputDirective } from 'src/@bracezin/directives/decimal-input.directive';
import { AngularEditorModule } from '@kolkov/angular-editor';

// Load Icons
import { defineElement } from '@lordicon/element';
import lottie from 'lottie-web';

// Pages Routing
import { SharedModule } from "./shared/shared.module";
import { WidgetModule } from './shared/widget/widget.module';
import { LibraryModule } from '@bracezin/library.module';
import { ShareModule } from './shared/share/share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    AppMatModule,
    ReactiveFormsModule,
    FeatherModule.pick(allIcons),
    FlatpickrDirective,
    CountUpDirective,
    NgApexchartsModule,
    NgbNavModule, 
    NgbTypeaheadModule, 
    NgbPaginationModule, 
    NgbTooltipModule,
    FlatpickrModule,
    NgbToastModule,
    LightboxModule,
		InfiniteScrollModule,
    AngularEditorModule,
    LeafletModule,
    NgbDropdownModule,
		AvatarModule,
		AvatarComponent,
    SimplebarAngularModule,
    SharedModule,
    WidgetModule,
    SlickCarouselModule,
    LibraryModule,
		ShareModule,
		DecimalInputDirective
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    AppMatModule,
    NgbNavModule,
    NgbTypeaheadModule,
    NgbPaginationModule,
    NgbTooltipModule,
    NgbDropdownModule,
    SharedModule,
    WidgetModule,
    SlickCarouselModule,
    FeatherModule,
    FlatpickrModule,
    FlatpickrDirective,
    CountUpDirective,
    NgApexchartsModule,
    LeafletModule,
		AvatarModule,
    SimplebarAngularModule,
    NgbToastModule,
    LightboxModule,
		InfiniteScrollModule,
    AngularEditorModule,
    LibraryModule,
		ShareModule,
		DecimalInputDirective
  ],
  providers: [
    DatePipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppShareModule {
  constructor() {
    defineElement();
  }
}
