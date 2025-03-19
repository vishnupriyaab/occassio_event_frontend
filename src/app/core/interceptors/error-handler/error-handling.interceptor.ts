import { HttpInterceptorFn } from '@angular/common/http';
import { RefreshTokenService } from '../../services/common/refreshToken/refresh-token.service';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

export const errorHandlingInterceptor: HttpInterceptorFn = (req, next) => {
  const refreshToken = inject(RefreshTokenService);

  return next(req).pipe(
    catchError((error: any) => {
      console.log(error, 'dfghjkl');
      if (error.error.message == 'Unauthorized: No token provided') {
        return refreshToken.refreshToken().pipe(
          switchMap(() => {
            return next(req);
          }),
          catchError(error => throwError(() => error))
        );
      }
      return throwError(() => error);
    })
  );
};
