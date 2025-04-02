import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ToastService } from '../../../../core/services/common/toaster/toast.service';
import { EmplAuthService } from '../../../../core/services/employee/authService/empl-auth.service';
import { UserAuthService } from '../../../../core/services/users/authService/user-auth.service';
import { passwordMatchValidator } from '../../../validator/formValidator';
import IToastOption from '../../../../core/models/IToastOptions';
import { Token } from '../../../../core/models/commonAPIResponse';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent {
  resetPasswordForm!: FormGroup;
  private _token!: string;
  decodedToken: Token | undefined;
  private _toastService: ToastService = inject(ToastService);
  private _userAuthService: UserAuthService = inject(UserAuthService);
  private _employeeAuthService: EmplAuthService = inject(EmplAuthService);
  constructor(
    private _route: ActivatedRoute,
    private _fb: FormBuilder,
    private _router: Router
  ) {
    this._token = this._route.snapshot.queryParams['token'];
    console.log('Token from query params:', this._token);

    if (this._token) {
      try {
        this.decodedToken = jwtDecode(this._token);
        console.log('Decoded Token:', this.decodedToken?.role);
      } catch (error) {
        console.error('Invalid token', error);
      }
    }

    this.resetPasswordForm = this._fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      },
      { validator: passwordMatchValidator }
    );
  }

  onSubmitConfirmPassword() {
    if (this.resetPasswordForm.valid) {
      const newPassword = this.resetPasswordForm.value.password;
      console.log(newPassword, '111');
      console.log(this._token, 'tokennnnnnnnnnnnnnnnnnnnnnnnnnnnnnn');
      console.log(this.decodedToken, '111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111');

      const authService = this.decodedToken?.role === 'user' ? this._userAuthService : this._employeeAuthService;

      const redirectRoute = this.decodedToken?.role === 'user' ? '/user-login' : '/employee-login';

      authService.resetPassword(newPassword, this._token).subscribe(
        response => {
          console.log(response, 'response');
          const toastOption: IToastOption = {
            severity: 'success-toast',
            summary: 'Success',
            detail: 'Password reset successful',
          };
          this._toastService.showToast(toastOption);
          console.log('Password reset successful');
          this._router.navigate([redirectRoute]);
        },
        err => {
          const toastOption: IToastOption = {
            severity: 'danger-toast',
            summary: 'Error',
            detail: err.error.message || 'Password reset failed',
          };
          this._toastService.showToast(toastOption);
          console.error('Password reset failed', err);
        }
      );
    } else {
      console.log('form is invalid');
      const toastOption: IToastOption = {
        severity: 'danger-toast',
        summary: 'Error',
        detail: 'form is invalid.',
      };
      this._toastService.showToast(toastOption);
    }
  }

  onCancel() {}

  hasError(controlName: string, errorName: string) {
    return this.resetPasswordForm.controls[controlName].hasError(errorName);
  }

  hasFormError(errorName: string) {
    return this.resetPasswordForm.hasError(errorName);
  }
}
