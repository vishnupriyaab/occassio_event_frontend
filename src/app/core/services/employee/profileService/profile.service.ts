import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../../models/commonAPIResponse';
import { ShowProfile } from '../../../models/IEmployee';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private _baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) {}

  showProfile(): Observable<ApiResponse<ShowProfile>> {
    return this._http.get<ApiResponse<ShowProfile>>(`${this._baseUrl}employee/showProfile`, {});
  }
  updateProfile(formData: FormData): Observable<ApiResponse<ShowProfile>> {
    return this._http.put<ApiResponse<ShowProfile>>(`${this._baseUrl}employee/updateProfile`, formData);
  }
  updateProfileImage(formData: FormData): Observable<ApiResponse<ShowProfile>> {
    return this._http.put<ApiResponse<ShowProfile>>(`${this._baseUrl}employee/profileImage`, formData);
  }
}
