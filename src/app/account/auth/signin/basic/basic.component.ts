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
  fieldTextType: boolean = false;

  apiError: string = '';
  item: any;

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
      email: ['', [Validators.required, Validators.email, Validators.minLength(4), Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(25), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$')]],
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

    let loginData = this.form.value;
    this.userService.login('login', loginData).subscribe(data => {
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

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

}
