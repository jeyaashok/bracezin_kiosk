import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

import { DeviceAuthService } from '../services/device-auth.service';

@Injectable({ providedIn: 'root' })
export class KioskAuthGuard implements CanActivate {
  constructor(private readonly deviceAuthService: DeviceAuthService, private readonly router: Router) {}

  canActivate(): boolean | UrlTree {
    if (this.deviceAuthService.isAuthenticated()) {
      return true;
    }

    return this.router.createUrlTree(['/auth']);
  }
}