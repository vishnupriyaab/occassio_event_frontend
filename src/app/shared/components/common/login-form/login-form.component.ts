import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { emailFormatValidator, noAllSpacesValidator } from '../../../validator/formValidator';
import { AdminAuthService } from '../../../../core/services/admin/authService/admin-auth.service';
import IToastOption from '../../../../core/models/IToastOptions';
import { Router } from '@angular/router';
import { ToastService } from '../../../../core/services/common/toaster/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent implements OnInit, OnDestroy {
  @Input() formType: 'user' | 'employee' | 'admin' = 'user';
  loginForm!: FormGroup;
  private _fb = inject(FormBuilder);
  private _adminAuthService = inject(AdminAuthService);
  private _toastService = inject(ToastService);
  private _router = inject(Router);
  private subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.loginForm = this._fb.group({
      email: ['', [Validators.required, noAllSpacesValidator(), emailFormatValidator()]],
      password: ['', [Validators.required]],
    });
  }

  formOnSubmit() {
    if (this.loginForm.invalid) return;
    const { email, password } = this.loginForm.value;
    this._adminAuthService.login(email, password).subscribe({
      next: response => {
        if (response.success) {
          const toastOption: IToastOption = {
            severity: 'success-toast',
            summary: 'Success',
            detail: 'Login successful',
          };
          this._toastService.showToast(toastOption);
          this._adminAuthService.setLoggedIn('true');
          this._router.navigate(['/admin/dashboard']);
        } else {
          const toastOption: IToastOption = {
            severity: 'danger-toast',
            summary: 'Error',
            detail: response.message || 'Login failed',
          };
          this._toastService.showToast(toastOption);
        }
      },
      error: error => {
        const toastOption: IToastOption = {
          severity: 'danger-toast',
          summary: 'Error',
          detail: error.error?.message || 'Something went wrong. Please try again.',
        };
        this._toastService.showToast(toastOption);
      },
    });
  }

  hasError(controlName: string, errorName: string) {
    return this.loginForm.controls[controlName].hasError(errorName);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    console.log('LoginFormComponent destroyed and unsubscribed.');
  }
}
