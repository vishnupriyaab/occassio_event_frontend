import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../../models/commonAPIResponse';
import { Observable } from 'rxjs';
import { IPhoto } from '../../../models/IPhoto';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private _baseUrl = environment.baseUrl

  constructor( private _http: HttpClient ) { }

      getPhotos():Observable<ApiResponse<IPhoto[]>>{
        console.log(121212)
        return this._http.get<ApiResponse<IPhoto[]>>(`${this._baseUrl}admin/photo`,{})
      }
        
      addPhoto(photoData: any): Observable<ApiResponse<any>> {
        return this._http.post<ApiResponse<any>>(`${this._baseUrl}admin/photo`, photoData);
      }
        
      updatePhoto(photoId: string, photoData: any): Observable<ApiResponse<any>> {
        return this._http.put<ApiResponse<any>>(`${this._baseUrl}admin/photo/${photoId}`, photoData);
      }
        
      deletePhoto(photoId: string): Observable<ApiResponse<any>> {
        return this._http.delete<ApiResponse<any>>(`${this._baseUrl}admin/photo/${photoId}`);
      }
        
      togglePhotoStatus(photoId: string, status: boolean): Observable<ApiResponse<any>> {
        return this._http.patch<ApiResponse<any>>(`${this._baseUrl}admin/photo/${photoId}/status`, { blocked: status });
      }

}
