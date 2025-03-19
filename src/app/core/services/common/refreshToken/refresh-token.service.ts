import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RefreshTokenService {
  private httpClient: HttpClient = inject(HttpClient);

  private api: string = `${environment.baseUrl}refreshToken`;

  refreshToken(): Observable<{ message: string; token: string }> {
    return this.httpClient.post<{ message: string; token: string }>(this.api, {});
  }
}