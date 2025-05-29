import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../models/commonAPIResponse';
import { FetchClientResponse, IUser } from '../../../models/IUser';

@Injectable()
export class ClientService {
  private _baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) {}

  seacrhAndFilterClient(
    searchTerm: string,
    filterStatus?: string,
    page = 1,
    limit = 10
  ): Observable<{ data: FetchClientResponse; totalCount: number; message: string; statusCode: number }> {
    let params: Record<string, string> = {
      searchTerm,
      page: page.toString(),
      limit: limit.toString(),
    };
    if (filterStatus && filterStatus !== 'all') {
      params = { ...params, filterStatus };
    }
    return this._http.get<{ data: FetchClientResponse; totalCount: number; message: string; statusCode: number }>(`${this._baseUrl}admin/clients`, {
      params,
    });
  }

  blockUnblockUser(id: string, status: boolean): Observable<ApiResponse<IUser>> {
    return this._http.patch<ApiResponse<IUser>>(`${this._baseUrl}admin/clients/${id}`, { status });
  }
}