import {
  throwError as observableThrowError,
  of as observableOf,
  Observable,
} from "rxjs";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from "@angular/common/http";
import { switchMap, map } from "rxjs/operators";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { DatePipe } from "@angular/common";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private cookieService: CookieService,
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const tjiToken = localStorage.getItem("tji_token");
    const domainUrl: string = environment.apiUrl;
    const domainUrlSecured: string = environment.apiUrl;
    const reqUrl = req.url;
    let cloned = req;

    if (req.headers.get("skip")) {
      return next.handle(cloned);
    }

    if (
      tjiToken &&
      (reqUrl.indexOf(domainUrl) === 0 ||
        reqUrl.indexOf(domainUrlSecured) === 0)
    ) {
      cloned = cloned.clone({
        headers: cloned.headers.set(
          "Authorization",
          "Bearer " + tjiToken.replace('"', "").replace('"', ""),
        ),
      });
    }
    return next.handle(cloned);
  }

  private handleError(err: HttpErrorResponse): Observable<any> {
    if (err.status === 401) {
      localStorage.clear();
      this.cookieService.deleteAll();
      this.clearCookie();
      localStorage.clear();
      window.location.reload();
      this.router.navigateByUrl(`/auth/signin`);
      return observableOf(err.message);
    }
    if (err.status === 403) {
      // console.log('UnKnown Access');
    }
    // handle your auth error or rethrow
    return observableThrowError(err);
  }

  public clearCookie() {
    if (this.cookieService.check("tji_token")) {
      this.cookieService.delete("tji_token", "/");
    }
    if (this.cookieService.check("tji_user")) {
      this.cookieService.delete("tji_user", "/");
    }
    if (this.cookieService.check("tji_permissions")) {
      this.cookieService.delete("tji_permissions", "/");
    }
    if (this.cookieService.check("tji_roles")) {
      this.cookieService.delete("tji_roles", "/");
    }
    if (this.cookieService.check("language")) {
      this.cookieService.delete("language", "en");
    }
  }
}
