import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, User } from 'src/@bracezin/_dbShare';

@Component({
    selector: 'app-cover',
    templateUrl: './cover.component.html',
    styleUrls: ['./cover.component.scss'],
    standalone: false
})

export class CoverComponent implements OnInit {

  form!: UntypedFormGroup;
  apiError: string = '';
  item: any;

  config = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '80px',
      'height': '50px'
    }
  };

  constructor(private formBuilder: UntypedFormBuilder,
    public userService: UserService,
    private router: Router,
    private route: ActivatedRoute) {
    this.userService.user.subscribe(data => {
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
      otp: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern('^[0-9]*$')]],
    });
  }

  checkLogin() {
    if (this.userService.authCheck()) {
      this.router.navigate(['/']);
    }
  }

  clearApiError() {
    if (this.apiError && this.apiError !== null) {
      setTimeout(() => {
        this.apiError = null;
      }, 5000);
    }
  }

  onOtpChange(event) {
    this.form.get('otp').setValue(event);
  }

  resendOtpMail() {
    this.userService.verifyUser('resend-email-otp', {}).subscribe(data => {
      if (data && data.id) {
        if (this.userService.authCheck()) {
          this.router.navigate(['/']);
        }
      } else if (data.error) {
        this.apiError = data.error;
      }
    }, error => {
      const errorMessage = this.getErrorMessage(error);
      this.apiError = errorMessage;
    });
  }

  sendOtp() {
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    let formData = this.form.value;
    this.userService.verifyUser('email-verify', formData).subscribe(data => {
      if (data && data.id) {
        if (this.userService.authCheck()) {
          this.router.navigate(['/']);
        }
      } else if (data.error) {
        this.apiError = data.error;
      }
    }, error => {
      const errorMessage = this.getErrorMessage(error);
      this.apiError = errorMessage;
    });
  }

  private getErrorMessage(error: any): string {
    if (!error) { return 'Login failed'; }
    if (typeof error === 'string') { return error; }

    if (error.error) {
      if (typeof error.error === 'string') { return error.error; }
      return error.error.message || error.error.error || error.error.data || error.message || 'Login failed';
    }

    return error.message || 'Login failed';
  }

}
