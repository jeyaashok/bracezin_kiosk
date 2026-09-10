import { Component, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService, User } from "src/@bracezin/_dbShare";

@Component({
  selector: "app-basic",
  templateUrl: "./basic.component.html",
  styleUrls: ["./basic.component.scss"],
  standalone: false,
})

export class BasicComponent implements OnInit {

  form!: UntypedFormGroup;
  submitted = false;
  fieldTextType: boolean = false;

  apiError: string = "";
  item: any;

  constructor(
    private formBuilder: UntypedFormBuilder,
    public userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.userService.user.subscribe((data) => {
      this.item = data;
    });
  }

  ngOnInit(): void {
    this.checkLogin();
    this.clearApiError();
    this.form = this.createForm();
  }

  createForm(): UntypedFormGroup {
    return this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }

  checkLogin() {
    if (this.userService.authCheck()) {
      this.router.navigate(["/"]);
    }
  }

  clearApiError() {
    if (this.apiError && this.apiError !== null) {
      setTimeout(() => {
        this.apiError = null;
      }, 5000);
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    
    let formData = this.form.value;
    this.userService.passwordReset('forget-password', formData).subscribe(data => {
      if (data && data.token) {
        this.router.navigate(['/auth/reset-forget-password'], {
          queryParams: {
            token: data.token,
            email: data?.email || formData.email
          }
        });
      } else if (data.error) {
        this.apiError = data.error;
      }
    }, error => {
      const errorMessage = this.getLoginErrorMessage(error);
      this.apiError = errorMessage;
    });
  }

  private getLoginErrorMessage(error: any): string {
    if (!error) { return 'Login failed'; }
    if (typeof error === 'string') { return error; }

    if (error.error) {
      if (typeof error.error === 'string') { return error.error; }
      return error.error.message || error.error.error || error.error.data || error.message || 'Login failed';
    }

    return error.message || 'Login failed';
  }
}
