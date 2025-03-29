import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import IToastOption from '../../../../core/models/IToastOptions';
import { ToastService } from '../../../../core/services/common/toaster/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent implements OnInit, OnDestroy {
  toast: IToastOption | null = null;
  private _toastService = inject(ToastService);
  private subscription: Subscription = new Subscription();

  ngOnInit() {
    console.log('Toast component initialized');
    const toastSub = this._toastService.toastOption$.subscribe(toast => {
      console.log('Received toast:', toast);
      this.toast = toast;
      setTimeout(() => {
        console.log('Clearing toast');
        this.toast = null;
      }, 3000);
    });
    this.subscription.add(toastSub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    console.log('ToastComponent destroyed and unsubscribed.');
  }
}
