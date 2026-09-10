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
 * TwoStep Cover Component
 */
export class CoverComponent implements OnInit {

  form!: UntypedFormGroup;
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

  /**
   * Confirm Otp Verification
   */
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

}
