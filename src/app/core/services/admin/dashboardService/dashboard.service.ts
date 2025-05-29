import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../models/commonAPIResponse';

export interface DashboardStats {
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  totalEvents: number;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private _baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) {}

  getDashboardStats(): Observable<ApiResponse<DashboardStats>> {
    return this._http.get<ApiResponse<DashboardStats>>(`${this._baseUrl}admin/dashboard`);
  }
}