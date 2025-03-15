import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../models/commonAPIResponse';
import EntryRegFormData from '../../../models/IRegisterForm';

@Injectable()
export class FormSubmitService {
  private _baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) {}

  entryRegistration(entryRegData: EntryRegFormData): Observable<ApiResponse<string>> {
    console.log(entryRegData, 'entryRegData');
    return this._http.post<ApiResponse<string>>(`${this._baseUrl}user/entry-reg`, entryRegData);
  }
}
