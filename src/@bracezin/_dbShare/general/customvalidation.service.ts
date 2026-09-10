import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ValidatorFn, AbstractControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';


@Injectable({
    providedIn: 'root',
})

export class CustomvalidationService {

    static checkLimit(min: number, max: number): ValidatorFn {
        return (c: AbstractControl): { [key: string]: boolean } | null => {
            if (c.value && (isNaN(c.value) || c.value < min || c.value > max)) {
                return { 'range': true };
            }
            return null;
        };
    }

    patternValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (!control.value) {
                return null;
            }
            const regex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$');
            const valid = regex.test(control.value);
            return valid ? null : { invalidPassword: true };
        };
    }

    MustMatch(password: string, confirm_password: string) {
        return (formGroup: FormGroup) => {
            const passwordInput = formGroup.controls[password];
            const changePasswordInput = formGroup.controls[confirm_password];

            if (!passwordInput || !changePasswordInput) {
                return null;
            }

            if (passwordInput.errors && !changePasswordInput.errors['MustMatch']) {
                return null;
            }

            if (passwordInput.value !== changePasswordInput.value) {
                changePasswordInput.setErrors({ MustMatch: true });
            } else {
                changePasswordInput.setErrors(null);
            }
        }
    }

}
