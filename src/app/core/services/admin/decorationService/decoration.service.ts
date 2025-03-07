import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../models/commonAPIResponse';
import { IDecoration } from '../../../models/IDecoration';

@Injectable({
  providedIn: 'root'
})
export class DecorationService {
  private _baseUrl = environment.baseUrl

  constructor( private _http: HttpClient ) { }

      getDecorations():Observable<ApiResponse<IDecoration[]>>{
        return this._http.get<ApiResponse<IDecoration[]>>(`${this._baseUrl}admin/decoration`,{})
      }
    
      addDecoration(decorationData: any): Observable<ApiResponse<any>> {
        return this._http.post<ApiResponse<any>>(`${this._baseUrl}admin/decoration`, decorationData);
      }
    
      updateDecoration(decorationId: string, foodData: any): Observable<ApiResponse<any>> {
        return this._http.put<ApiResponse<any>>(`${this._baseUrl}admin/decoration/${decorationId}`, foodData);
      }
    
      deleteDecoration(decorationId: string): Observable<ApiResponse<any>> {
        return this._http.delete<ApiResponse<any>>(`${this._baseUrl}admin/decoration/${decorationId}`);
      }
    
      toggleDecorationStatus(decorationId: string, status: boolean): Observable<ApiResponse<any>> {
        return this._http.patch<ApiResponse<any>>(`${this._baseUrl}admin/decoration/${decorationId}/status`, { blocked: status });
      }

}
