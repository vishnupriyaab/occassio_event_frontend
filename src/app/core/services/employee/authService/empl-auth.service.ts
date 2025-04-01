import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../models/commonAPIResponse';

@Injectable({
  providedIn: 'root',
})
export class EmplAuthService {
  private _baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) {}

  login(email: string, password: string): Observable<ApiResponse<string>> {
    console.log(email, password, '123456');
    return this._http.post<ApiResponse<string>>(`${this._baseUrl}employee/login`, {
      email,
      password,
    });
  }
  forgotPassword(email: string): Observable<{ message: string }> {
    return this._http.post<{ message: string }>(`${this._baseUrl}employee/forgotPassword`, { email });
  }
  resetPassword(newPassword: string, token: string): Observable<{ message: string }> {
    console.log('wowoowowowowo', token);
    return this._http.post<{ message: string }>(`${this._baseUrl}employee/resetPassword`, { password: newPassword, token });
  }
  setLoggedIn(status: string) {
    localStorage.setItem('isLoggedIn', status);
  }
}
