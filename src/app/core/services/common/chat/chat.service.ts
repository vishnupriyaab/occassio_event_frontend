import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import io from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IChatMessage, IConversation, IConversationwithUser } from '../../../models/IChat';
import { ApiResponse } from '../../../models/commonAPIResponse';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private _socket = io(environment.url);
  private _baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) {}

  connect(): void {
    this._socket.connect();
  }

  joinConversation(activeConversationId: string): Observable<{ status: string; conversation: IConversation }> {
    return new Observable(observer => {
      this._socket.emit(
        'join-conversation',
        { conversationId: activeConversationId },
        (response: { status: string; conversation: IConversation }) => {
          observer.next(response);
          observer.complete();
        }
      );
    });
  }

  // Send a new message
  sendMessageToUser(
    currentEmployeeId: string,
    activeConversationId: string,
    message: IChatMessage
  ): Observable<{ status: string; message: IChatMessage }> {
    return new Observable(observer => {
      console.log('employeeeeeeeeeee');
      this._socket.emit(
        'employee-message',
        { employeeId: currentEmployeeId, conversationId: activeConversationId, message: message.message },
        (response: { status: string; message: IChatMessage }) => {
          observer.next(response);
          observer.complete();
        }
      );
    });
  }

  sendMessageToEmployee(
    currentEmplId: string | undefined,
    activeConversationId: string,
    message: IChatMessage
  ): Observable<{ status: string; message: IChatMessage }> {
    return new Observable(observer => {
      console.log(activeConversationId, 'usersssssssssssss', message);
      this._socket.emit(
        'user-message',
        { userId: currentEmplId, conversationId: activeConversationId, message: message.message },
        (response: { status: string; message: IChatMessage }) => {
          observer.next(response);
          observer.complete();
        }
      );
    });
  }

  // Get messages from socket
  getMessages(): Observable<IChatMessage> {
    return new Observable(observer => {
      this._socket.on('employeeMessage', (message: IChatMessage) => {
        observer.next(message);
      });
    });
  }

  getChats(): Observable<IChatMessage[]> {
    return this._http.get<IChatMessage[]>(`${this._baseUrl}chat/getchats`);
  }

  getConversationId(): Observable<IConversation> {
    return this._http.get<IConversation>(`${this._baseUrl}chat/conversation`);
  }

  getConversationData(): Observable<ApiResponse<IConversationwithUser[]>> {
    return this._http.get<ApiResponse<IConversationwithUser[]>>(`${this._baseUrl}chat/getconversationdata`);
  }

  getEmployeeMessages(): Observable<IChatMessage> {
    return new Observable(observer => {
      this._socket.on('userMessage', (employeeMessage: IChatMessage) => {
        observer.next(employeeMessage);
      });
    });
  }
}
