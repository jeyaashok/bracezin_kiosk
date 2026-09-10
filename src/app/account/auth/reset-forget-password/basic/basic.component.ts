import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, User } from 'src/@bracezin/_dbShare';

@Component({
    selector: 'app-basic',
    templateUrl: './basic.component.html',
    styleUrls: ['./basic.component.scss'],
    standalone: false
})

export class BasicComponent implements OnInit {

  form!: UntypedFormGroup;
  submitted = false;
  passwordField!: boolean;
  confirmField!: boolean;

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

  email = '';
  token = '';

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
    this.dataInit();
    this.form = this.createForm();
  }

  dataInit() {
    this.email = this.route.snapshot.queryParamMap.get('email') ?? this.route.snapshot.paramMap.get('email') ?? '';
    this.token = this.route.snapshot.queryParamMap.get('token') ?? this.route.snapshot.paramMap.get('token') ?? '';
  }

  createForm(): UntypedFormGroup {
    return this.formBuilder.group({
      otp: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern('^[0-9]*$')]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(25), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')]],
      confirm_password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(25), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')]],
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

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onOtpChange(event) {
    this.form.get('otp').setValue(event);
  }

  resendOtpMail() {
    this.userService.verifyUser('resend-email-otp', {}).subscribe(data => {
      if (data && data.id) {
        
      } else if (data.error) {
        this.apiError = data.error;
      }
    }, error => {
      const errorMessage = this.getLoginErrorMessage(error);
      this.apiError = errorMessage;
    });
  }

  onSubmit() {
    this.submitted = true;
    if(!this.email || !this.token) {
      this.router.navigate(['/']);
    }
    // stop here if form is invalid
    if (this.form.invalid || !this.email || !this.token) {
      return;
    }

    let formData = this.form.value;
    formData.email = this.email;
    formData.token = this.token;
    this.userService.verifyUser('reset-forget-password', formData).subscribe(data => {
      if (data && data.id) {
        if (this.userService.authCheck()) {
          this.router.navigate(['/']);
        }
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

  togglepasswordField() {
    this.passwordField = !this.passwordField;
  }

  toggleconfirmField() {
    this.confirmField = !this.confirmField;
  }

}
