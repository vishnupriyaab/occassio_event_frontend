import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../models/commonAPIResponse';
import { IFood } from '../../../models/IFood';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private _baseUrl = environment.baseUrl

  constructor( private _http: HttpClient ) { }

   getFoods():Observable<ApiResponse<IFood[]>>{
      return this._http.get<ApiResponse<IFood[]>>(`${this._baseUrl}admin/food`,{})
    }
  
    addFood(foodData: any): Observable<ApiResponse<any>> {
      return this._http.post<ApiResponse<any>>(`${this._baseUrl}admin/food`, foodData);
    }
  
    updateFood(foodId: string, foodData: any): Observable<ApiResponse<any>> {
      return this._http.put<ApiResponse<any>>(`${this._baseUrl}admin/food/${foodId}`, foodData);
    }
  
    deleteSeating(foodId: string): Observable<ApiResponse<any>> {
      return this._http.delete<ApiResponse<any>>(`${this._baseUrl}admin/food/${foodId}`);
    }
  
    toggleFoodStatus(foodId: string, status: boolean): Observable<ApiResponse<any>> {
      return this._http.patch<ApiResponse<any>>(`${this._baseUrl}admin/food/${foodId}/status`, { blocked: status });
    }

}
