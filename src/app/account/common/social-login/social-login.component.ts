import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, User } from 'src/@bracezin/_dbShare';

@Component({
    selector: 'auth-common-social-login',
    templateUrl: './social-login.component.html',
    styleUrls: ['./social-login.component.scss'],
    standalone: false
})

export class SocialLoginComponent implements OnInit {

  apiError: string = '';
  enableSocialLogin: boolean = true;

  constructor(public userService: UserService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() { }

  /**
   * Start social login by redirecting to backend OAuth endpoint.
   * Backend should expose endpoints like: `${backend}/auth/google` etc.
   */
  signInWith(provider: string) {
    // fallback to popup implementation
    this.signInWithPopup(provider);
  }

  /**
   * Open popup and handle postMessage or storage-based callback from auth popup.
   */
  signInWithPopup(provider: string) {
    const p = (provider || '').toLowerCase();
    const base: string = (this.userService && (this.userService as any).tji_domain) ? (this.userService as any).tji_domain : '';
    const state = String(new Date().getTime()) + Math.floor(Math.random() * 10000);
    const url = base ? (base + 'auth/' + p + '?popup=1&state=' + state) : ('/auth/' + p + '?popup=1&state=' + state);

    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2.5;

    const opts = `toolbar=no,menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,width=${width},height=${height},top=${top},left=${left}`;
    let popup: Window | null = window.open(url, 'social_auth_popup_' + state, opts);
    if (!popup) {
      this.apiError = 'Popup blocked. Please allow popups or use a redirect.';
      return;
    }

    let handled = false;

    const cleanup = () => {
      try { window.removeEventListener('message', messageHandler); } catch (e) { }
      try { window.removeEventListener('storage', storageHandler); } catch (e) { }
      if (pollId) { clearInterval(pollId); }
      if (popup && !popup.closed) { try { popup.close(); } catch (e) { } }
    };

    const handleResult = (result: any) => {
      if (handled) { return; }
      handled = true;
      cleanup();
      // Expected shapes: { source: 'social-auth', state, data: { ...user... } }
      // or { source: 'social-auth', state, token: '...' }
      if (!result) { this.apiError = 'Invalid auth response'; return; }
      const data = result.data || null;
      const token = result.token || (data && data.token) || null;

      if (data && data.id) {
        // backend returned full user object
        try {
          this.userService.changeAuthUser(data);
          if (token) { this.userService.setCookieToken(token); localStorage.setItem('tji_token', JSON.stringify(token)); }
        } catch (e) { }
        this.router.navigate(['/']);
        return;
      }

      if (token) {
        try {
          localStorage.setItem('tji_token', JSON.stringify(token));
          this.userService.setCookieToken(token);
        } catch (e) { }
        // Attempt to fetch/renew user info from backend
        try {
          this.userService.renewUser();
        } catch (e) { }
        // best-effort navigate home
        this.router.navigate(['/']);
        return;
      }

      this.apiError = 'Social login failed: no token received.';
    };

    const messageHandler = (event: MessageEvent) => {
      try {
        const originAllowed = true; // adjust if you want to verify origin
        const msg = event.data;
        if (!msg) { return; }
        if (msg.source === 'social-auth' && msg.state === state) {
          handleResult(msg);
        }
      } catch (e) { }
    };

    const storageHandler = (ev: StorageEvent) => {
      try {
        if (!ev.key) { return; }
        const key = 'social_auth_' + state;
        if (ev.key === key && ev.newValue) {
          const parsed = JSON.parse(ev.newValue);
          handleResult(parsed);
          // cleanup stored key
          try { localStorage.removeItem(key); } catch (e) { }
        }
      } catch (e) { }
    };

    window.addEventListener('message', messageHandler, false);
    window.addEventListener('storage', storageHandler, false);

    const pollInterval = 500;
    const maxPoll = 120000; // 2 minutes
    let elapsed = 0;
    const pollId = setInterval(() => {
      elapsed += pollInterval;
      if (!popup || popup.closed) {
        clearInterval(pollId);
        window.removeEventListener('message', messageHandler);
        window.removeEventListener('storage', storageHandler);
        if (!handled) {
          this.apiError = 'Popup closed before completing authentication.';
        }
        return;
      }
      if (elapsed >= maxPoll) {
        clearInterval(pollId);
        try { popup.close(); } catch (e) { }
        window.removeEventListener('message', messageHandler);
        window.removeEventListener('storage', storageHandler);
        if (!handled) { this.apiError = 'Authentication timed out.'; }
        return;
      }
    }, pollInterval);
  }

}
