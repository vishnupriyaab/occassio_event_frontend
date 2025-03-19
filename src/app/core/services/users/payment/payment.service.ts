import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private _baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) {}

  entryPaymentLink(email: string) {
    return this._http.post<{ success: boolean; message: string }>(`${this._baseUrl}user/entry-payment-link`, { email });
  }
}
