import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IChatMessage, IConversation, IReaction } from '../../../models/IChat';
import { ApiResponse } from '../../../models/commonAPIResponse';

@Injectable({
  providedIn: 'root',
})
export class ChatWithEmployeeService {
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
    currentUserId: string | undefined,
    activeConversationId: string,
    message: IChatMessage
  ): Observable<{ status: number; message: IChatMessage }> {
    return new Observable(observer => {
      console.log(activeConversationId, 'usersssssssssssss', message);
      this._socket.emit(
        'user-message',
        { userId: currentUserId, conversationId: activeConversationId, message: message.message, user: message.user },
        (response: { status: number; message: IChatMessage }) => {
          observer.next(response);
          observer.complete();
        }
      );
    });
  }

  getChats(): Observable<IChatMessage[]> {
    return this._http.get<IChatMessage[]>(`${this._baseUrl}user/getchats`);
  }

  getConversationId(): Observable<ApiResponse<IConversation>> {
    return this._http.get<ApiResponse<IConversation>>(`${this._baseUrl}user/conversation`);
  }

  getEmployeeMessages(): Observable<IChatMessage> {
    return new Observable(observer => {
      this._socket.on('employeeMessage', (employeeMessage: IChatMessage) => {
        observer.next(employeeMessage);
      });
    });
  }

  deleteMessage(conversationId: string, messageId: string): Observable<{ status: string; message: string }> {
    console.log(conversationId, messageId, '00000000000000000');
    return this._http.delete<{ status: string; message: string }>(`${this._baseUrl}user/message/${conversationId}/${messageId}`);
  }

  notifyMessageDeleted(conversationId: string, messageId: string): Observable<{ status: string }> {
    return new Observable(observer => {
      this._socket.emit('delete-message', { conversationId, messageId }, (response: { status: string }) => {
        observer.next(response);
        observer.complete();
      });
    });
  }

  getDeletedMessages(): Observable<{ messageId: string; deleteType: string }> {
    return new Observable(observer => {
      console.log('00000');
      this._socket.on('messageDeleted', (data: { messageId: string; deleteType: string }) => {
        observer.next(data);
      });
    });
  }

  setUserOnline(userId: string | undefined): void {
    this._socket.emit('user-online', { userId });
  }

  setUserOffline(userId: string | undefined): void {
    this._socket.emit('user-offline', { userId });
  }

  onEmployeeStatusChange(): Observable<{ employeeId: string; status: string }> {
    return new Observable(observer => {
      this._socket.on('employee-status-change', (data: { employeeId: string; status: string }) => {
        observer.next(data);
      });
    });
  }

  uploadChatImages(payload: {
    image: string;
    fileName: string;
    userId: string;
    conversationId: string;
  }): Observable<{ status: string; message: IChatMessage }> {
    return new Observable(observer => {
      this._socket.emit('user-image-message', payload, (response: { status: string; message: IChatMessage }) => {
        observer.next(response);
        observer.complete();
      });
    });
  }

   sendReaction(conversationId: string, messageId: string, emoji: string, userId: string): Observable<{ status: string; reaction: IReaction }> {
     return new Observable(observer => {
       this._socket.emit(
         'message-reaction',
         {
           conversationId,
           messageId,
           emoji,
           userId,
           userType: 'user',
         },
         (response: { status: string; reaction: IReaction }) => {
           observer.next(response);
           observer.complete();
         }
       );
     });
   }
 
   getMessageReactions(): Observable<IChatMessage> {
     return new Observable(observer => {
       this._socket.on('message-reaction-update', (data: IChatMessage) => {
         observer.next(data);
       });
     });
   } 

}
