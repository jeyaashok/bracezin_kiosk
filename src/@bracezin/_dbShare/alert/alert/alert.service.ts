import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AlertComponent } from 'src/@bracezin/components/dialog/alert/alert.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastData } from 'src/@bracezin/_dbShare/alert/toast/toastData.interface';
import { AudioService } from '../audio.service';

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    isWebNotify = false;
    isDesktopNotify = false;

    private isDesktopNotifySoundSource = new BehaviorSubject<boolean>(false);
    desktopSound = this.isDesktopNotifySoundSource.asObservable();

    public isWebNotifySoundSource = new BehaviorSubject<boolean>(false);
    webSound = this.isWebNotifySoundSource.asObservable();

    constructor(private snackBar: MatSnackBar,
        private audioService: AudioService) { }

    changeDesktopNotify(status: boolean) {
        this.isDesktopNotifySoundSource.next(status);
        this.isDesktopNotify = status;
    }

    changeWebNotify(status: boolean) {
        this.isWebNotifySoundSource.next(status);
        this.isWebNotify = status;
    }

    showAlertData(data: ToastData) {
        let type: string = (data && data.type) ? data.type : 'info';
        this.websocketShow(type, data);
        this.audioService.playAudio();
    }

    webShow(type: string, message) {
        // if (this.isWebNotify && this.isWebNotify === true) {
        let capitalType = type ? type.charAt(0).toUpperCase() + type.substr(1).toLowerCase() : null;
        this.snackBar.openFromComponent(AlertComponent, {
            panelClass: ['alert' + capitalType],
            data: {
                message: message,
                type: type.toLowerCase(),
            }
        });
        // }
    }

    websocketShow(type: string, data) {
        if (this.isWebNotify && this.isWebNotify === true) {
            let capitalType = type ? type.charAt(0).toUpperCase() + type.substr(1).toLowerCase() : null;
            this.snackBar.openFromComponent(AlertComponent, {
                // panelClass: ['alert' + capitalType],
                data: {
                    type: type.toLowerCase(),
                    title: data.title,
                    message: data.message,
                    image: data.image,
                    icon: data.icon
                },
                panelClass: [capitalType]
            });
        }
    }

    socketShow(type: string, message) {
        if (this.isWebNotify && this.isWebNotify === true) {
            let capitalType = type ? type.charAt(0).toUpperCase() + type.substr(1).toLowerCase() : null;
            this.snackBar.openFromComponent(AlertComponent, {
                panelClass: ['alert' + capitalType],
                data: {
                    message: message,
                    type: type.toLowerCase(),
                }
            });
        }
    }

    pusherShow(type: string, message) {
        if (this.isWebNotify && this.isWebNotify === true) {
            let capitalType = type ? type.charAt(0).toUpperCase() + type.substr(1).toLowerCase() : null;
            this.snackBar.openFromComponent(AlertComponent, {
                panelClass: ['alert' + capitalType],
                data: {
                    message: message,
                    type: type.toLowerCase(),
                }
            });
        }
    }

    /**
     * Maps HTTP status / response body to a user-visible message. Skips 401 (handled by auth interceptor).
     */
    showHttpErrorFromResponse(error: HttpErrorResponse): void {
        if (error.status === 401) {
            return;
        }
        const fromApi = error.status === 422
            ? (this.parseValidation422Body(error.error) ?? this.parseApiErrorBody(error.error))
            : this.parseApiErrorBody(error.error);
        const message = fromApi || this.statusCodeFallbackMessage(error.status);
        const type = error.status === 0 ? 'Info' : 'Danger';
        this.webShow(type, message);
    }

    /** Use when the failure might not be an HttpErrorResponse (e.g. after operators). */
    notifyHttpFailure(error: unknown): void {
        if (error instanceof HttpErrorResponse) {
            this.showHttpErrorFromResponse(error);
        } else {
            this.webShow('Info', 'Something went wrong. Please try again.');
        }
    }

    private parseApiErrorBody(body: unknown): string | null {
        if (body == null) {
            return null;
        }
        if (typeof body === 'string') {
            const t = body.trim();
            return t.length > 0 && t.length < 2000 ? t : null;
        }
        if (typeof body === 'object') {
            const o = body as Record<string, unknown>;
            if (typeof o.message === 'string' && o.message.length) {
                return o.message;
            }
            if (typeof o.error === 'string' && o.error.length) {
                return o.error;
            }
            const errors = o.errors;
            if (errors && typeof errors === 'object' && !Array.isArray(errors)) {
                const firstKey = Object.keys(errors as object)[0];
                if (firstKey) {
                    const v = (errors as Record<string, unknown>)[firstKey];
                    if (Array.isArray(v) && v.length && typeof v[0] === 'string') {
                        return v[0];
                    }
                    if (typeof v === 'string') {
                        return v;
                    }
                }
            }
        }
        return null;
    }

    /**
     * 422 Unprocessable Entity — Laravel-style { message, errors: { field: string[] } },
     * or errors as an array of { message } / strings.
     */
    private parseValidation422Body(body: unknown): string | null {
        if (body == null) {
            return null;
        }
        if (typeof body === 'string') {
            const t = body.trim();
            return t.length > 0 ? this.capValidationMessage(t) : null;
        }
        if (typeof body !== 'object' || body === null) {
            return null;
        }
        const o = body as Record<string, unknown>;
        const errors = o.errors;

        if (Array.isArray(errors)) {
            const parts: string[] = [];
            for (const item of errors) {
                if (typeof item === 'string' && item.trim()) {
                    parts.push(item.trim());
                } else if (item && typeof item === 'object') {
                    const m = (item as Record<string, unknown>).message;
                    if (typeof m === 'string' && m.trim()) {
                        parts.push(m.trim());
                    }
                }
            }
            if (parts.length) {
                return this.capValidationMessage(parts.join(' · '));
            }
        }

        if (errors && typeof errors === 'object' && !Array.isArray(errors)) {
            const parts: string[] = [];
            for (const key of Object.keys(errors)) {
                const v = (errors as Record<string, unknown>)[key];
                if (Array.isArray(v)) {
                    const msgs = v.filter((x): x is string => typeof x === 'string' && x.trim().length > 0)
                        .map(x => x.trim());
                    if (msgs.length === 1) {
                        parts.push(msgs[0]);
                    } else if (msgs.length > 1) {
                        parts.push(`${key}: ${msgs.join(' ')}`);
                    }
                } else if (typeof v === 'string' && v.trim()) {
                    parts.push(v.trim());
                }
            }
            if (parts.length) {
                return this.capValidationMessage(parts.join(' · '));
            }
        }

        if (typeof o.message === 'string' && o.message.trim()) {
            return this.capValidationMessage(o.message.trim());
        }
        if (typeof o.error === 'string' && o.error.trim()) {
            return this.capValidationMessage(o.error.trim());
        }
        return null;
    }

    private capValidationMessage(s: string, max = 900): string {
        if (s.length <= max) {
            return s;
        }
        return s.slice(0, max - 1) + '…';
    }

    private statusCodeFallbackMessage(status: number): string {
        switch (status) {
            case 0:
                return 'Unable to reach the server. Check your network connection or try again later.';
            case 403:
                return 'You do not have permission to perform this action.';
            case 404:
                return 'The requested resource was not found.';
            case 422:
                return 'Some fields are invalid. Check your input and try again.';
            case 408:
            case 504:
                return 'The request timed out. Please try again.';
            case 429:
                return 'Too many requests. Please wait and try again.';
            case 502:
            case 503:
                return 'The service is temporarily unavailable. Please try again shortly.';
            default:
                if (status >= 500) {
                    return 'A server error occurred. Please try again later.';
                }
                if (status >= 400) {
                    return 'The request could not be completed.';
                }
                return 'Something went wrong. Please try again.';
        }
    }

    webErrorShow(res, type: string = 'Danger', data: string = null) {
        if (res?.errors?.catchErr?.error?.message && res?.errors?.catchErr?.error?.message.length > 0) {
            var message = res.errors.catchErr.error.message;
            // if (this.isWebNotify && this.isWebNotify === true) {
            let capitalType = type ? type.charAt(0).toUpperCase() + type.substr(1).toLowerCase() : null;
            this.snackBar.openFromComponent(AlertComponent, {
                panelClass: ['alert' + capitalType],
                data: {
                    message: message,
                    type: type.toLowerCase(),
                }
            });
            // }
        } else if (res?.errors?.catchErr?.message && res?.errors?.catchErr?.message.length > 0) {
            // this.alertService.webShow('Danger', res.errors.message);
            var message = res.errors.catchErr.message;
            // if (this.isWebNotify && this.isWebNotify === true) {
            let capitalType = type ? type.charAt(0).toUpperCase() + type.substr(1).toLowerCase() : null;
            this.snackBar.openFromComponent(AlertComponent, {
                panelClass: ['alert' + capitalType],
                data: {
                    message: message,
                    type: type.toLowerCase(),
                }
            });
            // }
        }

        else if (res.errors && res.errors.length > 0 && res.errors.message && res.errors.message.length > 0) {
            res.errors.message.forEach(error => {
                // if (this.isWebNotify && this.isWebNotify === true) {
                let capitalType = type ? type.charAt(0).toUpperCase() + type.substr(1).toLowerCase() : null;
                this.snackBar.openFromComponent(AlertComponent, {
                    panelClass: ['alert' + capitalType],
                    data: {
                        message: error.message,
                        type: type.toLowerCase(),
                    }
                });
                // }
            });
        } else if (res.errors && res.errors.message && res.errors.message.length > 0 && Array.isArray(res.errors.message)) {
            res.errors.message.forEach(error => {
                // if (this.isWebNotify && this.isWebNotify === true) {
                let capitalType = type ? type.charAt(0).toUpperCase() + type.substr(1).toLowerCase() : null;
                this.snackBar.openFromComponent(AlertComponent, {
                    panelClass: ['alert' + capitalType],
                    data: {
                        message: error.message,
                        type: type.toLowerCase(),
                    }
                });
                // }
            });
        } else if (res && res.errors && res.errors.message) {
            // this.alertService.webShow('Danger', res.errors.message);
            var message = res.errors.message;
            // if (this.isWebNotify && this.isWebNotify === true) {
            let capitalType = type ? type.charAt(0).toUpperCase() + type.substr(1).toLowerCase() : null;
            this.snackBar.openFromComponent(AlertComponent, {
                panelClass: ['alert' + capitalType],
                data: {
                    message: message,
                    type: type.toLowerCase(),
                }
            });
            // }
        } else if (res && res.errors && res.errors.length > 0) {
            res.errors.forEach(error => {
                // if (this.isWebNotify && this.isWebNotify === true) {
                let capitalType = type ? type.charAt(0).toUpperCase() + type.substr(1).toLowerCase() : null;
                this.snackBar.openFromComponent(AlertComponent, {
                    panelClass: ['alert' + capitalType],
                    data: {
                        message: error.message,
                        type: type.toLowerCase(),
                    }
                });
                // }
            });
        } else {
            // this.socketShow(type, 'Something Wrong. Try after Sometimes !!!')
            // this.socketShow(type, data)
            let capitalType = type ? type.charAt(0).toUpperCase() + type.substr(1).toLowerCase() : null;
            this.snackBar.openFromComponent(AlertComponent, {
                panelClass: ['alert' + capitalType],
                data: {
                    message: data,
                    type: type.toLowerCase(),
                }
            });
        }
    }

    tosterShowBeforeLogin(type, message) {
        let capitalType = type ? type.charAt(0).toUpperCase() + type.substr(1).toLowerCase() : null;
        this.snackBar.openFromComponent(AlertComponent, {
            panelClass: ['alert' + capitalType],
            data: {
                message: message,
                type: type.toLowerCase(),
            }
        });
    }
}
