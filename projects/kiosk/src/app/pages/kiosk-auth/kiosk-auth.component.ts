import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DeviceCredentials } from '../../core/models/kiosk.models';
import { DeviceAuthService } from '../../core/services/device-auth.service';

@Component({
  selector: 'app-kiosk-auth',
  standalone: false,
  templateUrl: './kiosk-auth.component.html',
  styleUrls: ['./kiosk-auth.component.scss']
})
export class KioskAuthComponent implements OnInit {
  credentials: DeviceCredentials = {
    deviceId: 'KIOSK-001',
    accessKey: ''
  };

  isSubmitting = false;
  errorMessage = '';
  activeField: keyof DeviceCredentials | null = null;
  isKeyboardVisible = false;

  constructor(private readonly deviceAuthService: DeviceAuthService, private readonly router: Router) {}

  ngOnInit(): void {
    if (this.deviceAuthService.isAuthenticated()) {
      void this.router.navigate(['/player']);
    }
  }

  authenticate(): void {
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.deviceAuthService.authenticate(this.credentials).subscribe({
      next: () => {
        this.isSubmitting = false;
        void this.router.navigate(['/player']);
      },
      error: (error: Error) => {
        this.isSubmitting = false;
        this.errorMessage = error.message;
      }
    });
  }

  onFieldFocus(field: keyof DeviceCredentials): void {
    this.activeField = field;
    this.isKeyboardVisible = true;
  }

  onVirtualInputChange(nextValue: string): void {
    if (!this.activeField) {
      return;
    }

    this.credentials[this.activeField] = nextValue;
  }

  get activeFieldValue(): string {
    return this.activeField ? this.credentials[this.activeField] : '';
  }

  closeKeyboard(): void {
    this.isKeyboardVisible = false;
    this.activeField = null;
  }
}