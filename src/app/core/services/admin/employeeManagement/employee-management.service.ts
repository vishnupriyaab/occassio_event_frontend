import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Employee, FetchEmployeeResponse, IEmployee } from '../../../models/IEmployee';
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
  ): Observable<{ data: FetchEmployeeResponse; totalCount: number; message: string; statusCode: number }> {
    let params: Record<string, string> = {
      searchTerm,
      page: page.toString(),
      limit: limit.toString(),
    };
    if (filterStatus && filterStatus !== 'all') {
      params = { ...params, filterStatus };
    }
    return this._http.get<{ data: FetchEmployeeResponse; totalCount: number; message: string; statusCode: number }>(
      `${this._baseUrl}admin/employees`,
      { params }
    );
  }

  saveEmployee(employee: Employee): Observable<ApiResponse<Employee>> {
    return this._http.post<ApiResponse<Employee>>(`${this._baseUrl}admin/employees`, employee);
  }

  blockUnblockEmpl(id: string, status: boolean): Observable<ApiResponse<IEmployee>> {
    return this._http.patch<ApiResponse<IEmployee>>(`${this._baseUrl}admin/employees/${id}`, { status });
  }

  deleteEmployee(id: string): Observable<void> {
    return this._http.delete<void>(`${this._baseUrl}admin/employees/${id}`);
  }
}
