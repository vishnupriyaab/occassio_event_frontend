import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../core/services/common/chat/chat.service';
import { IChatMessage } from '../../../core/models/IChat';
import { CookieService } from 'ngx-cookie-service';
import { Token } from '../../../core/models/commonAPIResponse';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-chat-with-employee',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-with-employee.component.html',
  styleUrl: './chat-with-employee.component.css',
})
export class ChatWithEmployeeComponent implements OnInit, AfterViewChecked {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  private chatService = inject(ChatService);

  message: string = '';
  chat: IChatMessage[] = [];
  messages: IChatMessage[] = [];
  conversationId!: string;
  userId: string | undefined;
  token: string = '';
  decodedToken: Token | undefined;

  constructor(private cookieService: CookieService) {}

  ngOnInit() {
    this.token = this.cookieService.get('refresh_token');
    console.log('Refresh Token:', this.userId);
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
      console.log(this.conversationId, message, 'vishnu');
      this.chatService.sendMessageToEmployee(this.userId, this.conversationId, message).subscribe();
      this.messages.push(message);
      this.message = '';
    }
  }

  getConversationId() {
    this.chatService.getConversationId().subscribe((conversationId: any) => {
      console.log(conversationId, '222222222');
      this.messages.push(...conversationId.messages);
      this.conversationId = conversationId.data.conversationid;
      console.log(this.conversationId, '333');
      this.chatService.joinConversation(this.conversationId).subscribe();
    });
  }

  isUserMessage(message: IChatMessage): boolean {
    return message.user === 'user';
  }
}
