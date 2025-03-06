import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../models/commonAPIResponse';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VenueService {
  private _baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) { }

  getVenue():Observable<ApiResponse<any>>{
    console.log("1234567");
    return this._http.get<ApiResponse<any>>(`${this._baseUrl}admin/venues`,{})
  }

  addVenue(venueData: any): Observable<ApiResponse<any>> {
    console.log("12345678901234567891234567890",venueData)
    return this._http.post<ApiResponse<any>>(`${this._baseUrl}admin/venues`, venueData);
  }

  updateVenue(venueId: string, venueData: any): Observable<ApiResponse<any>> {
    return this._http.put<ApiResponse<any>>(`${this._baseUrl}admin/venues/${venueId}`, venueData);
  }

  deleteVenue(venueId: string): Observable<ApiResponse<any>> {
    return this._http.delete<ApiResponse<any>>(`${this._baseUrl}admin/venues/${venueId}`);
  }

  toggleVenueStatus(venueId: string, status: boolean): Observable<ApiResponse<any>> {
    return this._http.patch<ApiResponse<any>>(`${this._baseUrl}admin/venues/${venueId}/status`, { blocked: status });
  }

}
