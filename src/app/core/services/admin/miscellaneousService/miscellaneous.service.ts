import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../models/commonAPIResponse';
import { IMiscellaneous } from '../../../models/IMiscellaneous';

@Injectable({
  providedIn: 'root'
})
export class MiscellaneousService {
  private _baseUrl = environment.baseUrl

  constructor( private _http: HttpClient ) { }

    getMiscellaneous():Observable<ApiResponse<IMiscellaneous[]>>{
      console.log(121212)
      return this._http.get<ApiResponse<IMiscellaneous[]>>(`${this._baseUrl}admin/miscellaneous`,{})
    }
          
    addMiscellaneous(miscellaneousData: any): Observable<ApiResponse<any>> {
      return this._http.post<ApiResponse<any>>(`${this._baseUrl}admin/miscellaneous`, miscellaneousData);
    }
          
    updateMiscellaneous(miscellaneousId: string, miscellaneousData: any): Observable<ApiResponse<any>> {
      return this._http.put<ApiResponse<any>>(`${this._baseUrl}admin/miscellaneous/${miscellaneousId}`, miscellaneousData);
    }
          
    deleteMiscellaneous(miscellaneousId: string): Observable<ApiResponse<any>> {
      return this._http.delete<ApiResponse<any>>(`${this._baseUrl}admin/miscellaneous/${miscellaneousId}`);
    }
          
    togglemiscellaneousStatus(miscellaneousId: string, status: boolean): Observable<ApiResponse<any>> {
      return this._http.patch<ApiResponse<any>>(`${this._baseUrl}admin/miscellaneous/${miscellaneousId}/status`, { blocked: status });
    }

}
