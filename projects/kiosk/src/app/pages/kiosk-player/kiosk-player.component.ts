import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { DeviceSession, KioskAdItem } from '../../core/models/kiosk.models';
import { DeviceAuthService } from '../../core/services/device-auth.service';
import { KioskAdsService } from '../../core/services/kiosk-ads.service';

@Component({
  selector: 'app-kiosk-player',
  standalone: false,
  templateUrl: './kiosk-player.component.html',
  styleUrls: ['./kiosk-player.component.scss']
})
export class KioskPlayerComponent implements OnInit, OnDestroy {
  @ViewChild('videoPlayer') videoPlayer?: ElementRef<HTMLVideoElement>;

  ads: KioskAdItem[] = [];
  currentAd: KioskAdItem | null = null;
  currentIndex = 0;
  currentProgress = 0;
  currentWatermarkClass = 'watermark-top-left';
  session: DeviceSession | null = null;
  readonly year = new Date().getFullYear();

  private adAdvanceTimer: number | null = null;
  private progressTimer: number | null = null;
  private watermarkTimer: number | null = null;
  private adDurationMs = 0;
  private adStartedAt = 0;
  private readonly watermarkPositions = [
    'watermark-top-left',
    'watermark-top-right',
    'watermark-center-left',
    'watermark-center-right',
    'watermark-bottom-left',
    'watermark-bottom-right'
  ];

  constructor(
    private readonly deviceAuthService: DeviceAuthService,
    private readonly kioskAdsService: KioskAdsService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.session = this.deviceAuthService.getSession();
    this.startWatermarkLoop();
    this.kioskAdsService.getAds().subscribe((ads) => {
      this.ads = ads;
      if (this.ads.length > 0) {
        this.displayAd(0);
      }
    });
  }

  ngOnDestroy(): void {
    this.clearPlaybackTimers();
    if (this.watermarkTimer !== null) {
      window.clearInterval(this.watermarkTimer);
    }
  }

  onVideoMetadataLoaded(video: HTMLVideoElement): void {
    if (!this.currentAd || this.currentAd.type !== 'video') {
      return;
    }

    const detectedDurationMs = Number.isFinite(video.duration) && video.duration > 0
      ? Math.round(video.duration * 1000)
      : 15000;

    void video.play().catch(() => undefined);
    this.startProgress(detectedDurationMs, false);
  }

  onVideoEnded(): void {
    this.displayAd(this.currentIndex + 1);
  }

  signOut(): void {
    this.deviceAuthService.logout();
    this.clearPlaybackTimers();
    void this.router.navigate(['/auth']);
  }

  private displayAd(index: number): void {
    this.clearPlaybackTimers();
    this.currentIndex = index % this.ads.length;
    this.currentAd = this.ads[this.currentIndex];
    this.currentProgress = 0;
    this.rotateWatermark();

    if (this.currentAd.type === 'image') {
      this.startProgress(this.currentAd.durationMs ?? 9000, true);
      return;
    }

    window.setTimeout(() => {
      const player = this.videoPlayer?.nativeElement;
      if (player) {
        player.currentTime = 0;
        void player.play().catch(() => undefined);
      }
    });
  }

  private startProgress(durationMs: number, autoAdvance: boolean): void {
    this.adDurationMs = durationMs;
    this.adStartedAt = performance.now();
    this.progressTimer = window.setInterval(() => {
      const elapsed = performance.now() - this.adStartedAt;
      this.currentProgress = Math.min((elapsed / this.adDurationMs) * 100, 100);
    }, 100);

    if (autoAdvance) {
      this.adAdvanceTimer = window.setTimeout(() => {
        this.displayAd(this.currentIndex + 1);
      }, durationMs);
    }
  }

  private startWatermarkLoop(): void {
    this.rotateWatermark();
    this.watermarkTimer = window.setInterval(() => {
      this.rotateWatermark();
    }, 3200);
  }

  private rotateWatermark(): void {
    const nextIndex = Math.floor(Math.random() * this.watermarkPositions.length);
    this.currentWatermarkClass = this.watermarkPositions[nextIndex];
  }

  private clearPlaybackTimers(): void {
    if (this.adAdvanceTimer !== null) {
      window.clearTimeout(this.adAdvanceTimer);
      this.adAdvanceTimer = null;
    }

    if (this.progressTimer !== null) {
      window.clearInterval(this.progressTimer);
      this.progressTimer = null;
    }
  }
}