import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminAuthService } from '../../services/admin/authService/admin-auth.service';
import { catchError, of, switchMap } from 'rxjs';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const adminService = inject(AdminAuthService)
  const router = inject(Router);

  return adminService.isAuthenticated().pipe(
      switchMap((res) => {
        if(res == true){
          return of(true);
        }else{
          router.navigate(["/admin-login"]); 
          return of(false);
        }
      }),
      catchError(() => {
        router.navigate(["/admin-login"]); 
        return of(false);
      })
    );
};
