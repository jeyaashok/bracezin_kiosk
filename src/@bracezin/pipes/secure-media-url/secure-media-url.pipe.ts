import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secureMediaUrl',
  pure: false,
})
export class SecureMediaUrlPipe implements PipeTransform {
  private readonly cache = new Map<string, string>();
  private readonly pendingRequests = new Map<string, Promise<string>>();

  constructor(private readonly cdr: ChangeDetectorRef) {}

  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    if (!this.isBackendMediaUrl(value)) {
      return value;
    }

    const cachedUrl = this.cache.get(value);
    if (cachedUrl) {
      return cachedUrl;
    }

    if (this.pendingRequests.has(value)) {
      return value;
    }

    const token = sessionStorage.getItem('tji_token') ?? localStorage.getItem('tji_token');
    if (!token) {
      this.cache.set(value, value);
      return value;
    }

    const request = fetch(value, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token.replace('"', '').replace('"', ''),
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Unauthorized image request');
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        this.cache.set(value, objectUrl);
        this.cdr.markForCheck();
        return objectUrl;
      })
      .catch(() => {
        this.cache.set(value, value);
        this.cdr.markForCheck();
        return value;
      })
      .finally(() => {
        this.pendingRequests.delete(value);
      });

    this.pendingRequests.set(value, request);
    return value;
  }

  private isBackendMediaUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url, window.location.origin);
      return /\/api\//.test(parsedUrl.pathname) || /\/storage\//.test(parsedUrl.pathname);
    } catch {
      return false;
    }
  }
}
