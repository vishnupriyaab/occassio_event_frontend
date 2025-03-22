import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  private _baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) {}

  forgotPassword(email: string): Observable<{ message: string }> {
    return this._http.post<{ message: string }>(`${this._baseUrl}user/forgotPassword`, { email });
  }
  resetPassword(newPassword: string, token: string): Observable<{ message: string }> {
    return this._http.post<{ message: string }>(`${this._baseUrl}user/resetPassword`, { password: newPassword, token });
  }
}
