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

/**
 * Cover Component
 */
export class CoverComponent implements OnInit {

  // Login Form
  form!: UntypedFormGroup;
  submitted = false;
  passwordField!: boolean;
  confirmField!: boolean;
  error = '';
  returnUrl!: string;

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
  }

  createForm(): UntypedFormGroup {
    return this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')]],
      confirm_password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')]],
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

  onSubmit() {
    this.dataInit();
    this.submitted = true;
    if(!this.email) {
      this.router.navigate(['/']);
    }

    // stop here if form is invalid
    if (this.form.invalid || !this.email) {
      return;
    }

    let formData = this.form.value;
    formData.email = this.email;
    this.userService.verifyUser('change-password', formData).subscribe(data => {
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

  /**
   * Password Hide/Show
   */
  togglepasswordField() {
    this.passwordField = !this.passwordField;
  }

  /**
 * Password Hide/Show
 */
  toggleconfirmField() {
    this.confirmField = !this.confirmField;
  }

}
