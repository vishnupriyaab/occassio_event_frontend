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

  saveEmployee(employee: Employee): Observable<ApiResponse<Employee>> {
    console.log(employee,"1111111111")
    return this._http.post<ApiResponse<Employee>>(`${this._baseUrl}admin/employees`, employee);
  }

}
