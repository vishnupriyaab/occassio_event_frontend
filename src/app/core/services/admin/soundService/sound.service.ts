import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../models/commonAPIResponse';
import { ISound } from '../../../models/ISound';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
    private _baseUrl = environment.baseUrl

  constructor( private _http: HttpClient ) { }

    getSounds():Observable<ApiResponse<ISound[]>>{
      return this._http.get<ApiResponse<ISound[]>>(`${this._baseUrl}admin/sound`,{})
    }
      
    addSound(soundData: any): Observable<ApiResponse<any>> {
      return this._http.post<ApiResponse<any>>(`${this._baseUrl}admin/sound`, soundData);
    }
      
    updateSound(soundId: string, foodData: any): Observable<ApiResponse<any>> {
      return this._http.put<ApiResponse<any>>(`${this._baseUrl}admin/sound/${soundId}`, foodData);
    }
      
    deleteSound(soundId: string): Observable<ApiResponse<any>> {
      return this._http.delete<ApiResponse<any>>(`${this._baseUrl}admin/sound/${soundId}`);
    }
      
    toggleSoundStatus(soundId: string, status: boolean): Observable<ApiResponse<any>> {
      return this._http.patch<ApiResponse<any>>(`${this._baseUrl}admin/sound/${soundId}/status`, { blocked: status });
    }

}
