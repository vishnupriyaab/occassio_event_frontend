import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IChatMessage, IConversationwithUser } from '../../../core/models/IChat';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { Token } from '../../../core/models/commonAPIResponse';
import { ChatWithClientService } from '../../../core/services/employee/chatwithClient_Service/chat-with-client.service';

@Component({
  selector: 'app-chat-with-client',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-with-client.component.html',
  styleUrl: './chat-with-client.component.css',
})
export class ChatWithClientComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  conversations: IConversationwithUser[] = [];
  selectedConversation: IConversationwithUser | null = null;
  message: string = '';
  // defaultImageUrl!: string;
  employeeId: string | undefined;
  token: string = '';
  decodedToken: Token | undefined;
  isNoteVisible = false;
  messages: IChatMessage[] = [];

  constructor(
    private _chatService: ChatWithClientService,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    this.token = this.cookieService.get('refresh_token');
    if (this.token) {
      this.decodedToken = jwtDecode(this.token);
      this.employeeId = this.decodedToken?.id;
      console.log(this.employeeId, '000000000');
    } else {
      console.log('Unavailable token!');
    }
    console.log('Refresh Token:', this.token);
    this._chatService.connect();
    this._chatService.getUserMessages().subscribe((data: IChatMessage) => {
      this.messages.push(data);
      setTimeout(() => this.scrollToBottom(), 0);
    });
    this.getConversations();
  }

  //note
  toggleNotePanel() {
    this.isNoteVisible = !this.isNoteVisible;
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  getConversations() {
    this._chatService.getConversationData().subscribe(conversations => {
      this.conversations = conversations.data;
      console.log(conversations, 'conversation');
      if (this.conversations.length > 0 && !this.selectedConversation) {
        this.selectConversation(this.conversations[0]);
      }
    });
  }

  selectConversation(conversation: IConversationwithUser): void {
    if (this.selectedConversation) {
      this._chatService.exitConversation(this.selectedConversation.conversationid).subscribe();
    }
    this.selectedConversation = conversation;
    console.log(this.selectedConversation, '1234567');
    this.getConversationId(this.selectedConversation.conversationid);
  }

  getConversationId(conversationId: string) {
    console.log();
    this._chatService.getConversationId(conversationId).subscribe((response: any) => {
      console.log(response, '222222222');
      this.messages = response.data.chatMessages;
      console.log(this.messages, 'messaessssssss');
      this._chatService.joinConversation(conversationId).subscribe();
      setTimeout(() => this.scrollToBottom(), 0);
    });
  }

  sendMessage() {
    if (this.message.trim()) {
      let message = {
        user: 'employee',
        message: this.message,
        timestamp: new Date(),
      };
      this._chatService.sendMessageToEmployee(this.employeeId, this.selectedConversation!.conversationid, message).subscribe();
      this.messages.push(message);
      this.message = '';
    }
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  // getImageUrl(user: IUser): string {
  //   return user.imageUrl && user.imageUrl.trim() !== ''
  //     ? user.imageUrl
  //     : this.defaultImageUrl;
  // }

  isEmplMessage(message: IChatMessage): boolean {
    return message.user === 'employee';
  }
}
