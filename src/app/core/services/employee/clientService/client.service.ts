import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private _baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) {}

  fetchClients(): Observable<any> {
    return this._http.get<any>(`${this._baseUrl}employee/fetchClient`, {});
  }
}
