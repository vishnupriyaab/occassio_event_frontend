import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../models/commonAPIResponse';
import { IClientData } from '../../../models/IUser';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private _baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) {}

  fetchClients(): Observable<ApiResponse<IClientData[]>> {
    return this._http.get<ApiResponse<IClientData[]>>(`${this._baseUrl}employee/fetchClient`, {});
  }
}
