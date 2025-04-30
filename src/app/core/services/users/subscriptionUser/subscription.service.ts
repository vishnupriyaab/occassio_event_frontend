import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IClientData } from '../../../models/IUser';
import { ApiResponse } from '../../../models/commonAPIResponse';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private _baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) {}

  fetchSubscribedUser(): Observable<ApiResponse<IClientData>> {
    return this._http.get<ApiResponse<IClientData>>(`${this._baseUrl}user/sub-details`, {});
  }

  fetchEstimation(): Observable<ApiResponse<any>> {
    return this._http.get<ApiResponse<any>>(`${this._baseUrl}user/estimation`, {});
  }

}
