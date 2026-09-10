import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { OctopusLoadingService } from '@octopus/services/loading/loading.service';
import { Observable, finalize, take } from 'rxjs';

export const octopusLoadingInterceptor = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const octopusLoadingService = inject(OctopusLoadingService);
    let handleRequestsAutomatically = false;

    octopusLoadingService.auto$.pipe(take(1)).subscribe((value) => {
        handleRequestsAutomatically = value;
    });

    // If the Auto mode is turned off, do nothing
    if (!handleRequestsAutomatically) {
        return next(req);
    }

    // Set the loading status to true
    octopusLoadingService._setLoadingStatus(true, req.url);

    return next(req).pipe(
        finalize(() => {
            // Set the status to false if there are any errors or the request is completed
            octopusLoadingService._setLoadingStatus(false, req.url);
        })
    );
};
