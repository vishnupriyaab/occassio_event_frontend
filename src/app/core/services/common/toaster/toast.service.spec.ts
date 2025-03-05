import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import IToastOption from '../../../models/IToastOptions';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private _toastSubject = new BehaviorSubject<IToastOption | null>(null);

  toast$ = this._toastSubject.asObservable();

  showToast(toast: IToastOption) {
    this._toastSubject.next(toast);
    setTimeout(() => {
      this._toastSubject.next(null);
    }, 3000);
  }
}
