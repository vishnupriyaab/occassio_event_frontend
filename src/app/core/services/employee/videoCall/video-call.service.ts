import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VideoCallService {
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
    console.log(callData, '123456789');
    return this._http.post(`${this._baseUrl}employee/initiate`, callData);
  }

  updateCallStatus(callId: string, status: 'accepted' | 'rejected' | 'ended' | 'missed', endedAt?: Date, duration?: number): Observable<any> {
    console.log(callId, status, 'qwerty', endedAt);
    return this._http.patch(`${this._baseUrl}employee/status/${callId}`, { status, endedAt, duration });
  }

  getCallHistory(conversationId: string): Observable<any> {
    return this._http.get(`${this._baseUrl}employee/history/${conversationId}`);
  }
}
