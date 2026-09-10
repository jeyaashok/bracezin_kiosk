import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbTooltipModule, NgbProgressbarModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { CountUpDirective } from 'ngx-countup';
// Feather Icon
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
// Apex Chart Package
import { NgApexchartsModule } from 'ng-apexcharts';
import { AvatarModule, AvatarComponent } from 'ngx-avatars';

import { UserCardComponent } from './user-card/user-card.component';
import { UserCardOneComponent } from './user-card-one/user-card-one.component';
import { UserCardTwoComponent } from './user-card-two/user-card-two.component';
import { UserCardThreeComponent } from './user-card-three/user-card-three.component';
import { UserCardFourComponent } from './user-card-four/user-card-four.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { AddressCardComponent } from './address-card/address-card.component';
import { StatGridCardComponent } from './stat-grid-card/stat-grid-card.component';

@NgModule({
	declarations: [
		UserCardComponent,
		UserCardOneComponent,
		UserCardTwoComponent,
		UserCardThreeComponent,
		UserCardFourComponent,
		ProductCardComponent,
		AddressCardComponent,
		StatGridCardComponent
	],
	imports: [
		CommonModule,
		NgbTooltipModule,
		NgbProgressbarModule,
		NgbDropdownModule,
		CountUpDirective,
		FeatherModule.pick(allIcons),
		NgApexchartsModule,
		AvatarModule,
		AvatarComponent
	],
	exports: [
		UserCardComponent,
		UserCardOneComponent,
		UserCardTwoComponent,
		UserCardThreeComponent,
		UserCardFourComponent,
		ProductCardComponent,
		AddressCardComponent,
		StatGridCardComponent
	]
})
export class ShareModule { }
