import { Injectable, Inject } from "@angular/core";
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";

// Auth Services
import { AuthenticationService } from "../services/auth.service";
import { AuthfakeauthenticationService } from "../services/authfake.service";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { UserService, User } from "@bracezin/_dbShare";
import { MatSnackBar } from "@angular/material/snack-bar";
import { email } from "@angular/forms/signals";

@Injectable({ providedIn: "root" })
export class AuthGuard {
  item: User | null = null;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private authFackservice: AuthfakeauthenticationService,
    @Inject(UserService) private userService: UserService,
    private snackbar: MatSnackBar,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.item = JSON.parse(localStorage.getItem("tji_user") || "null");

    if (localStorage.getItem("tji_token") != null) {
      // Check if user needs to change password
      if (this.item?.do_change_password || this.item?.do_reset_password) {
        let message: string = this.item?.do_change_password
          ? "You need to change your password"
          : "Please reset your password as instructed.";
        this.router.navigate(["/auth/change-password"], {
          queryParams: { email: this.item?.email },
        });
        this.snackbar.open(message, "Close", { duration: 10000 });
        return false;
      } else if (
        this.item &&
        !this.item?.is_email_verified &&
        !this.item?.email_verified_at
      ) {
        this.router.navigateByUrl("/auth/otp");
      }

      // Check dashboard Page
      let roles = route.data["roles"] as Array<string>;
      if (roles) {
        var match = this.userService.roleMatch(roles);
        if (match) return true;
        else {
          localStorage.clear();
          this.router.navigate(["/auth/signin"]);
          return false;
        }
      } else return true;
    }

    localStorage.clear();
    this.router.navigate(["/auth/signin"]);
    return false;
  }
}
