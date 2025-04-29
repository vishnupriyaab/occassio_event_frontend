import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import io from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { IChatMessage, IConversation, IConversationwithUser, IReaction } from '../../../models/IChat';
import { ApiResponse } from '../../../models/commonAPIResponse';

@Injectable({
  providedIn: 'root',
})
export class ChatWithClientService {
  private _socket = io(environment.url);
  private _baseUrl = environment.baseUrl;
  private _notificationSubject = new Subject<{ message: IChatMessage; conversationId: string }>();

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
  exitConversation(activeConversationId: string): Observable<{ status: string; conversation: IConversation }> {
    return new Observable(observer => {
      this._socket.emit(
        'exit-conversation',
        { conversationId: activeConversationId },
        (response: { status: string; conversation: IConversation }) => {
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
  ): Observable<{ status: number; message: IChatMessage }> {
    return new Observable(observer => {
      console.log(activeConversationId, 'usersssssssssssss', message);
      this._socket.emit(
        'employee-message',
        { employeeId: currentEmplId, conversationId: activeConversationId, message: message.message, user: message.user },
        (response: { status: number; message: IChatMessage }) => {
          observer.next(response);
          observer.complete();
        }
      );
    });
  }

  getUserMessages(): Observable<IChatMessage> {
    return new Observable(observer => {
      this._socket.on('userMessage', (employeeMessage: IChatMessage) => {
        console.log('Received message:', employeeMessage);
        console.log('Message conversationId:', employeeMessage.conversationId);
        if (!employeeMessage.conversationId) {
          console.error('Message missing conversationId:', employeeMessage);
        }
        this._notificationSubject.next({
          message: employeeMessage,
          conversationId: employeeMessage.conversationId || '',
        });
        observer.next(employeeMessage);
      });
    });
  }

  getMessageNotifications(): Observable<{ message: IChatMessage; conversationId: string }> {
    return this._notificationSubject.asObservable();
  }

  getChats(): Observable<IChatMessage[]> {
    return this._http.get<IChatMessage[]>(`${this._baseUrl}employee/getchats`);
  }

  getConversationId(conversationId: string): Observable<IConversation> {
    console.log('11');
    return this._http.get<IConversation>(`${this._baseUrl}employee/conversation/${conversationId}`);
  }

  getConversationData(): Observable<ApiResponse<IConversationwithUser[]>> {
    return this._http.get<ApiResponse<IConversationwithUser[]>>(`${this._baseUrl}employee/getconversationdata`);
  }

  getLastMessage(conversationId: string) {
    return this._http.get<any>(`${this._baseUrl}employee/lastMessage/${conversationId}`);
  }

  deleteMessage(conversationId: string, messageId: string): Observable<{ status: string; message: string }> {
    return this._http.delete<{ status: string; message: string }>(`${this._baseUrl}employee/message/${conversationId}/${messageId}`);
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
      this._socket.on('messageDeleted', (data: { messageId: string; deleteType: string }) => {
        observer.next(data);
      });
    });
  }

  setEmployeeOnline(employeeId: string | undefined): void {
    console.log('0000');
    this._socket.emit('employee-online', { employeeId });
  }

  setEmployeeOffline(employeeId: string | undefined): void {
    this._socket.emit('employee-offline', { employeeId });
  }

  onUserStatusChange(): Observable<{ userId: string; status: string }> {
    console.log('111');
    return new Observable(observer => {
      this._socket.on('user-status-change', (data: { userId: string; status: string }) => {
        observer.next(data);
      });
    });
  }

  uploadChatImages(payload: {
    image: string;
    fileName: string;
    employeeId: string;
    conversationId: string;
  }): Observable<{ status: string; message: IChatMessage }> {
    return new Observable(observer => {
      this._socket.emit('employee-image-message', payload, (response: { status: string; message: IChatMessage }) => {
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
          userType: 'employee',
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
