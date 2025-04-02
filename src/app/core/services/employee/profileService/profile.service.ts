import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private _baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) {}

  showProfile(): Observable<any> {
    return this._http.get<any>(`${this._baseUrl}employee/showProfile`, {});
  }
  updateProfile(formData: FormData): Observable<any> {
    return this._http.put<any>(`${this._baseUrl}employee/updateProfile`, formData);
  }
  updateProfileImage(formData: FormData): Observable<any> {
    return this._http.put(`${this._baseUrl}employee/profileImage`, formData);
  }
}
