import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IChatMessage } from '../../../core/models/IChat';
import { CookieService } from 'ngx-cookie-service';
import { Token } from '../../../core/models/commonAPIResponse';
import { jwtDecode } from 'jwt-decode';
import { ChatWithEmployeeService } from '../../../core/services/users/chatwithEmployee_Service/chat-with-employee.service';

@Component({
  selector: 'app-chat-with-employee',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-with-employee.component.html',
  styleUrl: './chat-with-employee.component.css',
})
export class ChatWithEmployeeComponent implements OnInit, AfterViewChecked {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  private chatService = inject(ChatWithEmployeeService);

  message: string = '';
  chat: IChatMessage[] = [];
  messages: IChatMessage[] = [];
  conversationId!: string;
  userId: string | undefined;
  token: string = '';
  access_token: string = '';
  decodedToken: Token | undefined;

  constructor(private cookieService: CookieService) {}

  ngOnInit() {
    this.token = this.cookieService.get('refresh_token');
    this.access_token = this.cookieService.get('access_token');
    console.log('Refresh Token:', this.userId);
    console.log('access Token:', this.access_token);
    if (this.token) {
      this.decodedToken = jwtDecode(this.token);
      console.log('Decoded Token:', this.decodedToken);
      this.userId = this.decodedToken?.id;
      console.log(this.userId, '000000000');
    } else {
      console.log('Unavailable token!');
    }
    console.log('Refresh Token:', this.token);
    this.chatService.connect();

    this.chatService.getEmployeeMessages().subscribe((data: IChatMessage) => {
      this.messages.push(data);
      this.scrollToBottom();
    });
    this.getChats();
    this.getConversationId();
  }

  getChats() {
    this.chatService.getChats().subscribe(chat => {
      console.log(chat, '----');
      this.chat = chat;
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  sendMessage() {
    if (this.message.trim()) {
      let message = {
        user: 'user',
        message: this.message,
        timestamp: new Date(),
      };
      this.chatService.sendMessageToEmployee(this.userId, this.conversationId, message).subscribe();
      this.messages.push(message);
      this.message = '';
    }
  }

  getConversationId() {
    this.chatService.getConversationId().subscribe((response: any) => {
      console.log(response, '222222222');
      this.messages = response.data.chatMessages
      this.conversationId = response.data.conversation.conversationid;
      this.chatService.joinConversation(this.conversationId).subscribe();
    });
  }

  isUserMessage(message: IChatMessage): boolean {
    return message.user === 'user';
  }
}
