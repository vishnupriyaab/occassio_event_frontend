import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginResponse } from '../../../models/ILoginLogoutRes';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  private _baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) {}

  googleLogin(credential: string): Observable<LoginResponse> {
    return this._http.post<LoginResponse>(`${this._baseUrl}user/google-login`, {
      credential,
    });
  }
  forgotPassword(email: string): Observable<{ message: string }> {
    return this._http.post<{ message: string }>(`${this._baseUrl}user/forgotPassword`, { email });
  }
  resetPassword(newPassword: string, token: string): Observable<{ message: string }> {
    return this._http.post<{ message: string }>(`${this._baseUrl}user/resetPassword`, { password: newPassword, token });
  }
  setLoggedIn(status: string) {
    localStorage.setItem('isLoggedIn', status);
  }
}
