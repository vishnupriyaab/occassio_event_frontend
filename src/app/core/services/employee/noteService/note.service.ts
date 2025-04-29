import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../models/commonAPIResponse';
import { INote } from '../../../models/INote';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private _baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) {}

  saveNote(content: string, employeeId?: string, conversationId?: string, userId?:string): Observable<ApiResponse<INote>> {
    console.log(content, employeeId, conversationId,userId, "1111111")
    return this._http.post<ApiResponse<INote>>(`${this._baseUrl}employee/notes`, {
      content,
      employeeId,
      conversationId,
      userId
    })
  }

  getNotes( userId?:string ): Observable<ApiResponse<INote>> {
    console.log("vishnupriy", userId)
    return this._http.get<ApiResponse<INote>>(`${this._baseUrl}employee/notes`, {
      params: {
        userId: userId || ''
      }
    })
  }

  editNote(noteId: string, content: string): Observable<ApiResponse<INote>> {
    return this._http.put<ApiResponse<INote>>(`${this._baseUrl}employee/notes/${noteId}`, {
      content
    });
  }

}
