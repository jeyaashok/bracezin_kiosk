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

  // Login Form
  form!: UntypedFormGroup;
  submitted = false;
  fieldTextType: boolean = false;
  
  apiError: string = '';
  item: any;
  types = ['company', 'customer', 'agent'];

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
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25), Validators.pattern('^[a-zA-Z0-9]+$')]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(4), Validators.maxLength(50)]],
      mobile: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(10), Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(25), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$')]],
      type: ['company', [Validators.required]]
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
    this.submitted = true;
    this.apiError = '';

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    let formData = this.form.value;
    this.userService.register('register', formData).subscribe(data => {
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

  /**
   * Password Hide/Show
   */
   toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

}
