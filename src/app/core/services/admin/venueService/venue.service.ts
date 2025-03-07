import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../models/commonAPIResponse';
import { environment } from '../../../../environments/environment';
import { IVenue, IVenueCreate } from '../../../models/IVenue';

@Injectable({
  providedIn: 'root'
})
export class VenueService {
  private _baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) { }

  getVenue():Observable<ApiResponse<IVenue[]>>{
    return this._http.get<ApiResponse<IVenue[]>>(`${this._baseUrl}admin/venues`,{})
  }

  addVenue(venueData: any): Observable<ApiResponse<any>> {
    return this._http.post<ApiResponse<any>>(`${this._baseUrl}admin/venues`, venueData);
  }

  updateVenue(venueId: string, venueData: Partial<IVenueCreate>): Observable<ApiResponse<IVenue>> {
    console.log("333", venueId,venueData)
    return this._http.put<ApiResponse<IVenue>>(`${this._baseUrl}admin/venues/${venueId}`, venueData);
  }

  deleteVenue(venueId: string): Observable<ApiResponse<void>> {
    console.log(venueId, 'venueId')
    return this._http.delete<ApiResponse<void>>(`${this._baseUrl}admin/venues/${venueId}`);
  }

  toggleVenueStatus(venueId: string, status: boolean): Observable<ApiResponse<IVenue>> {
    console.log(venueId,status,"12345")
    return this._http.patch<ApiResponse<IVenue>>(`${this._baseUrl}admin/venues/${venueId}/status`, { blocked: status });
  }

}
