import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../models/commonAPIResponse';
import { environment } from '../../../../environments/environment';
import { ISeating } from '../../../models/ISeating';

@Injectable({
  providedIn: 'root'
})
export class SeatingService {
  private _baseUrl = environment.baseUrl

  constructor(private _http: HttpClient) { }

  getSeatings():Observable<ApiResponse<ISeating[]>>{
    return this._http.get<ApiResponse<ISeating[]>>(`${this._baseUrl}admin/seatings`,{})
  }

  addSeating(seatingData: any): Observable<ApiResponse<any>> {
    return this._http.post<ApiResponse<any>>(`${this._baseUrl}admin/seatings`, seatingData);
  }

  updateSeating(seatingId: string, seatingData: any): Observable<ApiResponse<any>> {
    return this._http.put<ApiResponse<any>>(`${this._baseUrl}admin/seatings/${seatingId}`, seatingData);
  }

  deleteSeating(seatingId: string): Observable<ApiResponse<any>> {
    return this._http.delete<ApiResponse<any>>(`${this._baseUrl}admin/seatings/${seatingId}`);
  }

  toggleSeatingStatus(seatingId: string, status: boolean): Observable<ApiResponse<any>> {
    return this._http.patch<ApiResponse<any>>(`${this._baseUrl}admin/seatings/${seatingId}/status`, { blocked: status });
  }

}
