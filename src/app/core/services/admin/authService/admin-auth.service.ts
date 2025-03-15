import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, LogOut } from '../../../models/commonAPIResponse';

@Injectable({
  providedIn: 'root',
})

export class AdminAuthService {
  private _baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) {}

  login(email: string, password: string): Observable<ApiResponse<string>> {
    return this._http.post<ApiResponse<string>>(`${this._baseUrl}admin/login`, {
      email,
      password,
    });
  }
  setLoggedIn(status: string) {
    localStorage.setItem('isLoggedIn', status);
  }

  logOut(): Observable<LogOut> {
    return this._http.post<LogOut>(`${this._baseUrl}admin/logOut`, {});
  }
}
