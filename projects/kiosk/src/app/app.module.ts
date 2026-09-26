import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { KioskAppRoutingModule } from './app-routing.module';
import { KioskAppComponent } from './app.component';
import { KioskNotFoundComponent } from './pages/kiosk-not-found.component';
import { KioskAuthComponent } from './pages/kiosk-auth/kiosk-auth.component';
import { KioskPlayerComponent } from './pages/kiosk-player/kiosk-player.component';
import { KioskCommonModule } from './common/common.module';

@NgModule({
  declarations: [KioskAppComponent, KioskAuthComponent, KioskPlayerComponent, KioskNotFoundComponent],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, HttpClientModule, KioskAppRoutingModule, KioskCommonModule],
  providers: [],
  bootstrap: [KioskAppComponent]
})
export class KioskAppModule {}
