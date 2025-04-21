import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../models/commonAPIResponse';
import { FetchEmployeeData } from '../../../models/IEmployee';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private _baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) {}

  getEmployeeById(employeeId: string): Observable<ApiResponse<FetchEmployeeData>> {
    console.log(employeeId,"employeeId12345678");
    return this._http.get<ApiResponse<FetchEmployeeData>>(`${this._baseUrl}user/getEmployeeDetails/${employeeId}`, {});
  }
}
