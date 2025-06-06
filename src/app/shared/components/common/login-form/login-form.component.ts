import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { emailFormatValidator, noAllSpacesValidator } from '../../../validator/formValidator';
import { AdminAuthService } from '../../../../core/services/admin/authService/admin-auth.service';
import IToastOption from '../../../../core/models/IToastOptions';
import { Router } from '@angular/router';
import { ToastService } from '../../../../core/services/common/toaster/toast.service';
import { Subscription } from 'rxjs';
import { UserAuthService } from '../../../../core/services/users/authService/user-auth.service';
import { EmplAuthService } from '../../../../core/services/employee/authService/empl-auth.service';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { LoginDto } from '../../../../dtos/login.dto';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, ForgotPasswordComponent],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent implements OnInit, OnDestroy {
  @Input() formType: 'user' | 'employee' | 'admin' = 'user';
  showForgotPasswordModal = false;
  loginForm!: FormGroup;
  private _fb = inject(FormBuilder);
  private _authServices: Record<string, any>;
  private _toastService = inject(ToastService);
  private _router = inject(Router);
  private subscription: Subscription = new Subscription();

  constructor(
    private _adminAuthService: AdminAuthService,
    private _userAuthService: UserAuthService,
    private _employeeAuthService: EmplAuthService
  ) {
    this._authServices = {
      user: this._userAuthService,
      employee: this._employeeAuthService,
      admin: this._adminAuthService,
    };
  }

  ngOnInit(): void {
    this.loginForm = this._fb.group({
      email: ['', [Validators.required, noAllSpacesValidator(), emailFormatValidator()]],
      password: ['', [Validators.required]],
    });
  }

  formOnSubmit() {
    if (this.loginForm.invalid) return;

    const loginData: LoginDto = this.loginForm.value;
    const authService = this._authServices[this.formType];

    authService?.login(loginData).subscribe(
      (response: any) => {
        console.log(response, 'response');
        console.log(response.data, 'responseData');
        this.handleSuccess(response);
      },
      (error: unknown) => {
        console.log(error, 'error');
        this.handleError(error);
      }
    );
  }

  private handleSuccess(response: any): void {
    const toastOption: IToastOption = {
      severity: 'success-toast',
      summary: 'Success',
      detail: 'Login successful',
    };

    this._toastService.showToast(toastOption);
    this._authServices[this.formType].setLoggedIn('true');

    const routes = {
      user: '/sub-home',
      employee: 'employee/dashboard',
      admin: 'admin/dashboard',
    };
    this._router.navigate([routes[this.formType]]);
  }

  private handleError(error: any): void {
    if (error.status === 403 && error.error.message === 'Account not verified. Please verify your account.') {
      localStorage.setItem(`${this.formType}Id`, error.error.userId);
      const toastOption: IToastOption = {
        severity: 'warning-toast',
        summary: 'Verification Required',
        detail: 'Account not verified. Please verify your account.',
      };
      this._toastService.showToast(toastOption);
    } else {
      const toastDetail =
        error.status === 401
          ? error.error.message === 'Invalid email'
            ? 'Invalid email'
            : 'Invalid password'
          : error.error.message || 'Error during login';

      const toastOption: IToastOption = {
        severity: 'danger-toast',
        summary: 'Error',
        detail: toastDetail,
      };
      this._toastService.showToast(toastOption);
    }
    console.error('Error during login', error);
  }

  showForgotPassword(): void {
    this.showForgotPasswordModal = true;
  }

  onCancel(): void {
    this.showForgotPasswordModal = false;
  }

  hasError(controlName: string, errorName: string) {
    return this.loginForm.controls[controlName].hasError(errorName);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    console.log('LoginFormComponent destroyed and unsubscribed.');
  }
}
