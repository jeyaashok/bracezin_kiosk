import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { KioskAdItem } from '../models/kiosk.models';

@Injectable({ providedIn: 'root' })
export class KioskAdsService {
  getAds(): Observable<KioskAdItem[]> {
    return of([
      {
        id: 'ad-1',
        title: 'Bracezin Brand Story',
        type: 'image',
        source: 'assets/images/other/vendor_bg.jpg',
        durationMs: 9000
      },
      {
        id: 'ad-2',
        title: 'Bracezin Retail Campaign',
        type: 'image',
        source: 'assets/images/nft/bg-home.jpg',
        durationMs: 8000
      },
      {
        id: 'ad-3',
        title: 'Bracezin Motion Demo',
        type: 'video',
        source: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        mimeType: 'video/mp4'
      },
      {
        id: 'ad-4',
        title: 'Bracezin Product Highlight',
        type: 'image',
        source: 'assets/images/products/img-8.png',
        durationMs: 7000
      }
    ]);
  }
}