import { Component, inject, OnDestroy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AdminAuthService } from '../../../../core/services/admin/authService/admin-auth.service';
import IToastOption from '../../../../core/models/IToastOptions';
import { ToastService } from '../../../../core/services/common/toaster/toast.service';
import { Subscription } from 'rxjs';
import { AdminMenuComponent } from '../admin-menu/admin-menu.component';

@Component({
  selector: 'app-main',
  imports: [RouterOutlet, AdminMenuComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnDestroy {
  private _adminAuthService = inject(AdminAuthService);
  private _toastService = inject(ToastService);
  private _router = inject(Router);
  private subscription = new Subscription();

  logOut() {
    const logoutSub = this._adminAuthService.logOut().subscribe({
      next: response => {
        console.log(response, 'res');
        const toastOption: IToastOption = {
          severity: 'success-toast',
          summary: 'Success',
          detail: 'Logout successful',
        };
        this._toastService.showToast(toastOption);
        localStorage.removeItem('isLoggedIn');
        this._router.navigate(['/admin-login']);
      },
      error: error => {
        console.log(error, 'error');
        const toastOption = {
          severity: 'danger-toast',
          summary: 'Error',
          detail: 'Logout failed',
        };
        this._toastService.showToast(toastOption);
      },
    });
    this.subscription.add(logoutSub);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    console.log('MainComponent destroyed and unsubscribed');
  }
}
