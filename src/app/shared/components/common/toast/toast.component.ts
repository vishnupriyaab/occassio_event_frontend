import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import IToastOption from '../../../../core/models/IToastOptions';
import { ToastService } from '../../../../core/services/common/toaster/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent implements OnInit {
  toast: IToastOption | null = null;
  private _toastService = inject(ToastService);

  ngOnInit() {
    console.log('Toast component initialized');
    this._toastService.toastOption$.subscribe(toast => {
      console.log('Received toast:', toast);
      this.toast = toast;
      setTimeout(() => {
        console.log('Clearing toast');
        this.toast = null;
      }, 3000);
    });
  }
}
