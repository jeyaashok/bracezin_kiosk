/// <reference types="@angular/localize" />

import { enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { KioskAppModule } from './app/app.module';
import { environment } from '../../../src/environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(KioskAppModule, { applicationProviders: [provideZoneChangeDetection()] })
  .catch(err => console.error(err));
