import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserVideoCallService {
  private _baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) {}

  initiateCall(callData: {
    conversationId: string;
    callerId: string;
    receiverId: string;
    callerModel: 'User' | 'Employee';
    receiverModel: 'User' | 'Employee';
    callId: string;
    roomId: string;
  }): Observable<any> {
    console.log(callData, 'qwertyuio');
    return this._http.post(`${this._baseUrl}user/initiate`, callData);
  }

  updateCallStatus(callId: string, status: 'accepted' | 'rejected' | 'ended' | 'missed', endedAt?: Date, duration?: number): Observable<any> {
    console.log(callId, status, 'qwerty', endedAt);
    return this._http.patch(`${this._baseUrl}user/status/${callId}`, { status, endedAt, duration });
  }

  getCallHistory(conversationId: string): Observable<any> {
    return this._http.get(`${this._baseUrl}user/history/${conversationId}`);
  }
}
