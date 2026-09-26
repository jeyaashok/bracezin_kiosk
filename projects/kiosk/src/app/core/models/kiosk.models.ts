export type KioskAdMediaType = 'image' | 'video';

export interface DeviceCredentials {
  deviceId: string;
  accessKey: string;
}

export interface DeviceSession {
  deviceId: string;
  kioskName: string;
  location: string;
  authenticatedAt: string;
}

export interface KioskAdItem {
  id: string;
  title: string;
  type: KioskAdMediaType;
  source: string;
  durationMs?: number;
  mimeType?: string;
}