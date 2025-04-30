import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import IEstimation from '../../../models/IEstimation';
import { ApiResponse } from '../../../models/commonAPIResponse';

@Injectable({
  providedIn: 'root',
})
export class EstimationService {
  private _baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) {}

  saveEstimation(estimationData: IEstimation, grandTotal: number, userId: string): Observable<IEstimation> {
    console.log(estimationData, grandTotal, 'qwertyuioertyuiopdfghjkl');
    return this._http.post<IEstimation>(`${this._baseUrl}employee/estimation`, { estimationData, grandTotal, userId });
  }

  fetchEstimation(userId: string): Observable<ApiResponse<any>> {
    return this._http.get<ApiResponse<any>>(`${this._baseUrl}employee/estimation`, { params: { userId: userId } });
  }
}
