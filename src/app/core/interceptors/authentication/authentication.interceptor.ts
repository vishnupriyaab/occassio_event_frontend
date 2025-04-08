import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../../services/common/toaster/toast.service';
import IToastOption from '../../models/IToastOptions';
import { Router } from '@angular/router';

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
  const _toastService = inject(ToastService);
  const _router = inject(Router);

  const modifiedReq = req.clone({ withCredentials: true });

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log(error, 'error');
      const toastOption: IToastOption = {
        severity: 'danger-toast',
        summary: 'Error',
        detail: '',
      };
      if(error.status === 401){
        const role = error.error?.metadata?.role;
      }
      if (error.status === 403) {
        const role = error.error?.metadata?.role;
        const errorMessage =
          error.error?.message || 'Access denied. Please login again.';

        toastOption.detail = errorMessage;
        _toastService.showToast(toastOption);

        if (role === 'employee') {
          _router.navigate(['/employee-login']);
        } else if (role === 'user') {
          _router.navigate(['/user-login']);
        } 
      } 
      return throwError(() => error);
    })
  );
};
