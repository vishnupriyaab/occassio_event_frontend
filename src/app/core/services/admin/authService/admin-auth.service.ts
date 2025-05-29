import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiResponse, LogOut } from '../../../models/commonAPIResponse';
import IToastOption from '../../../models/IToastOptions';
import { ToastService } from '../../common/toaster/toast.service';
import { LoginDto } from '../../../../dtos/login.dto';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthService {
  private _baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient, private toastService: ToastService) {}

  login(loginData:LoginDto): Observable<ApiResponse<string>> {
    return this._http.post<ApiResponse<string>>(`${this._baseUrl}admin/login`, {
      loginData
    });
  }
  setLoggedIn(status: string) {
    localStorage.setItem('isLoggedIn', status);
  }

  logOut(): Observable<LogOut> {
    return this._http.post<LogOut>(`${this._baseUrl}admin/logOut`, {});
  }

  isAuthenticated():Observable<boolean>{
      return this._http.get(`${this._baseUrl}admin/isAuthenticate`).pipe(map(()=>true),catchError((error)=>{
        if(error.error?.message){
          const toastOption: IToastOption = {
            severity: 'danger-toast',
            summary: 'Error',
            detail: error.error.message,
          };
          this.toastService.showToast(toastOption);
        }
        return of(false)
      }))
    }

}
