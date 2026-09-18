import { Component } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { maxLength, minLength } from '@angular/forms/signals';
import { MatDialogRef } from '@angular/material/dialog';

const REQUIRED_PASSWORD = 'admin123';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss'],
  standalone: false
})
export class PasswordChangeComponent {
  passwordControl = new UntypedFormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(25), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$')]);
  showPassword: boolean = false;
  errorMessage: string = '';

  constructor(public dialogRef: MatDialogRef<PasswordChangeComponent>) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  confirm(): void {
    if (this.passwordControl.invalid) {
      this.passwordControl.markAsTouched();
      return;
    }
    if (this.passwordControl.value) {
      this.dialogRef.close({ data: true, password: this.passwordControl.value });
    } else {
      this.errorMessage = 'Incorrect password. Please try again.';
      this.passwordControl.setValue('');
    }
  }

  cancel(): void {
    this.dialogRef.close({ data: false });
  }
}