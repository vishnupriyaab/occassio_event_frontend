import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthService {
  private _baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) {}

  login(email: string, password: string): Observable<string> {
    return this._http.post<string>(`${this._baseUrl}admin/login`, {
      email,
      password,
    });
  }
}
