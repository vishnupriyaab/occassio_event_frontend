import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IChatMessage } from '../../../core/models/IChat';
import { CookieService } from 'ngx-cookie-service';
import { Token } from '../../../core/models/commonAPIResponse';
import { jwtDecode } from 'jwt-decode';
import { ChatWithEmployeeService } from '../../../core/services/users/chatwithEmployee_Service/chat-with-employee.service';
import { EmployeeService } from '../../../core/services/users/employee/employee.service';
import { FetchEmployeeData } from '../../../core/models/IEmployee';
import { response } from 'express';

@Component({
  selector: 'app-chat-with-employee',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-with-employee.component.html',
  styleUrl: './chat-with-employee.component.css',
})
export class ChatWithEmployeeComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  private chatService = inject(ChatWithEmployeeService);
  private employeeService = inject(EmployeeService);

  employeeOnlineStatus: boolean = false;

  message: string = '';
  chat: IChatMessage[] = [];
  messages: IChatMessage[] = [];
  conversationId!: string;
  userId: string | undefined;
  employeeId: string | undefined;
  token: string = '';
  access_token: string = '';
  decodedToken: Token | undefined;
  employeeDetails: FetchEmployeeData | undefined;
  selectedMessageIndex: number = -1;

  constructor(private cookieService: CookieService) {}

  ngOnInit() {
    this.token = this.cookieService.get('refresh_token');
    this.access_token = this.cookieService.get('access_token');
    if (this.token) {
      this.decodedToken = jwtDecode(this.token);
      this.userId = this.decodedToken?.id;
      console.log(this.userId, '000000000');
    } else {
      console.log('Unavailable token!');
    }
    console.log('Refresh Token:', this.token);
    this.chatService.connect();
    this.chatService.setUserOnline(this.userId);

    this.chatService.onEmployeeStatusChange().subscribe({
      next: response => {
        console.log(response, 'responseee');
          this.employeeOnlineStatus = response.status === 'online';
      },
      error: error => {
        console.log(error, 'error');
      },
    });

    this.chatService.getEmployeeMessages().subscribe((data: IChatMessage) => {
      this.messages.push(data);
      this.scrollToBottom();
    });
    this.getChats();
    this.getConversationId();

    this.chatService.getDeletedMessages().subscribe((data: { messageId: string; deleteType: string }) => {
      const messageIndex = this.messages.findIndex(m => m._id === data.messageId);
      if (messageIndex !== -1) {
        // if (data.deleteType === 'everyone') {
        this.messages[messageIndex].isDeleted = true;
        // } else if (data.deleteType === 'me' && this.messages[messageIndex].senderId !== this.userId) {
        //   this.messages[messageIndex].deletedFor = this.messages[messageIndex].deletedFor || [];
        //   this.messages[messageIndex].deletedFor.push(this.userId!);
        // }
      }
    });
  }

  isMessageDeletedForMe(message: IChatMessage): boolean {
    return message.isDeleted === true;
  }

  showDeleteOptions(index: number, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.selectedMessageIndex = index;
    setTimeout(() => {
      document.addEventListener('click', this.closeDropdown);
    }, 0);
  }

  closeDropdown = () => {
    this.selectedMessageIndex = -1;
    document.removeEventListener('click', this.closeDropdown);
    this.scrollToBottom();
  };

  deleteMessage(message: any): void {
    console.log(message, 'message');
    if (!message._id) {
      const messageId = message._id;

      if (!messageId) {
        console.error('Cannot delete message without ID');
        this.selectedMessageIndex = -1;
        return;
      }

      message._id = messageId;
    }
    this.selectedMessageIndex = -1;

    this.chatService.deleteMessage(this.conversationId, message._id.toString()).subscribe({
      next: response => {
        console.log('Delete message response:', response);

        const index = this.messages.findIndex(m => m._id === message._id);
        if (index !== -1) {
          this.messages[index].isDeleted = true;
        }

        this.chatService.notifyMessageDeleted(this.conversationId, message._id.toString()).subscribe({
          next: socketResponse => {
            console.log('Socket notification sent:', socketResponse);
          },
          error: err => {
            console.error('Error notifying about message deletion:', err);
          },
        });
      },
      error: error => {
        console.error('Error deleting message:', error);
      },
    });
  }

  getChats() {
    this.chatService.getChats().subscribe(chat => {
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
      console.log(response.data.conversation.employeeId);
      this.employeeId = response.data.conversation.employeeId;

      this.fetchEmployeeDetails();

      this.messages = response.data.chatMessages;
      console.log(this.messages, 'ghjkl');
      this.conversationId = response.data.conversation.conversationid;
      this.chatService.joinConversation(this.conversationId).subscribe();
    });
  }

  fetchEmployeeDetails() {
    if (!this.employeeId) {
      return;
    }
    this.employeeService.getEmployeeById(this.employeeId).subscribe({
      next: response => {
        console.log(response, 'response');
        this.employeeDetails = response.data;
      },
      error: error => {
        console.log(error, 'error');
      },
    });
  }

  ngOnDestroy() {
    this.chatService.setUserOffline(this.userId);
  }

  isUserMessage(message: IChatMessage): boolean {
    return message.user === 'user';
  }
}
