import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Employee } from '../../../models/IEmployee';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../models/commonAPIResponse';

@Injectable()
export class EmployeeManagementService {
  private _baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) {}

  seacrhAndFilterEmpl(
    searchTerm: string,
    filterStatus?: string,
    page = 1,
    limit = 10
  ): Observable<{ data: any; totalCount: number; message: string; statusCode: number }> {
    let params: { [key: string]: string } = {
      searchTerm,
      page: page.toString(),
      limit: limit.toString(),
    };
    if (filterStatus && filterStatus !== 'all') {
      params = { ...params, filterStatus };
    }
    return this._http.get<{ data: any; totalCount: number; message: string; statusCode: number }>(`${this._baseUrl}admin/employees`, { params });
  }

  saveEmployee(employee: Employee): Observable<ApiResponse<Employee>> {
    return this._http.post<ApiResponse<Employee>>(`${this._baseUrl}admin/employees`, employee);
  }

  deleteEmployee(id: string): Observable<void> {
    return this._http.delete<void>(`${this._baseUrl}admin/employees/${id}`);
  }

  blockUnblockEmpl(id: string, status: string): Observable<ApiResponse<Employee>> {
    return this._http.patch<ApiResponse<Employee>>(`${this._baseUrl}admin/employees/${id}`, { status });
  }
}
