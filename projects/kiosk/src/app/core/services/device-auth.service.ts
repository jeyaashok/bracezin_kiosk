import { Injectable } from '@angular/core';
import { Observable, delay, map, of } from 'rxjs';

import { DeviceCredentials, DeviceSession } from '../models/kiosk.models';

interface RegisteredDevice {
  deviceId: string;
  accessKey: string;
  kioskName: string;
  location: string;
}

@Injectable({ providedIn: 'root' })
export class DeviceAuthService {
  private readonly sessionKey = 'bracezin-kiosk-device-session';

  private readonly registeredDevices: RegisteredDevice[] = [
    { deviceId: 'KIOSK-001', accessKey: 'BRACEZIN-ADS-001', kioskName: 'Reception Display', location: 'Chennai HQ' },
    { deviceId: 'KIOSK-002', accessKey: 'BRACEZIN-ADS-002', kioskName: 'Retail Window', location: 'Bengaluru Mall' },
    { deviceId: 'KIOSK-003', accessKey: 'BRACEZIN-ADS-003', kioskName: 'Food Court Screen', location: 'Hyderabad Hub' }
  ];

  authenticate(credentials: DeviceCredentials): Observable<DeviceSession> {
    const normalizedDeviceId = credentials.deviceId.trim().toUpperCase();
    const normalizedAccessKey = credentials.accessKey.trim().toUpperCase();

    return of({ normalizedDeviceId, normalizedAccessKey }).pipe(
      delay(500),
      map(({ normalizedDeviceId: deviceId, normalizedAccessKey: accessKey }) => {
        const device = this.registeredDevices.find((item) => item.deviceId === deviceId && item.accessKey === accessKey);

        if (!device) {
          throw new Error('Device authentication failed. Verify the device ID and access key.');
        }

        const session: DeviceSession = {
          deviceId: device.deviceId,
          kioskName: device.kioskName,
          location: device.location,
          authenticatedAt: new Date().toISOString()
        };

        localStorage.setItem(this.sessionKey, JSON.stringify(session));
        return session;
      })
    );
  }

  getSession(): DeviceSession | null {
    const rawSession = localStorage.getItem(this.sessionKey);
    if (!rawSession) {
      return null;
    }

    try {
      return JSON.parse(rawSession) as DeviceSession;
    } catch {
      localStorage.removeItem(this.sessionKey);
      return null;
    }
  }

  isAuthenticated(): boolean {
    return this.getSession() !== null;
  }

  logout(): void {
    localStorage.removeItem(this.sessionKey);
  }
}