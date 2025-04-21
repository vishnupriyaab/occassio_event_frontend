import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IChatMessage, IConversationwithUser } from '../../../core/models/IChat';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { Token } from '../../../core/models/commonAPIResponse';
import { ChatWithClientService } from '../../../core/services/employee/chatwithClient_Service/chat-with-client.service';
import { response } from 'express';

@Component({
  selector: 'app-chat-with-client',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-with-client.component.html',
  styleUrl: './chat-with-client.component.css',
})
export class ChatWithClientComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  userOnlineStatus: Map<string, boolean> = new Map();
  selectedUserOnlineStatus: boolean = false;

  conversations: IConversationwithUser[] = [];
  selectedConversation: IConversationwithUser | null = null;
  message: string = '';
  // defaultImageUrl!: string;
  employeeId: string | undefined;
  token: string = '';
  decodedToken: Token | undefined;
  isNoteVisible = false;
  messages: IChatMessage[] = [];
  selectedMessageIndex: number = -1;

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

    this._chatService.setEmployeeOnline(this.employeeId);

    this._chatService.onUserStatusChange().subscribe({
      next: response => {
        console.log(response, 'respose');
        // if (response.userId) {
        //   console.log('000');
        //   this.userOnlineStatus.set(response.userId, response.status === 'online');
        //   console.log('000');

        //   if (this.selectedConversation) {
        //     if (this.selectedConversation.userId === response.userId) {
        //       this.selectedUserOnlineStatus = response.status === 'online';
        //     } else {
        //       const participant = this.selectedConversation.participants.find(
        //         p => p._id === response.userId
        //       );
        //       if (participant) {
        //         this.selectedUserOnlineStatus = response.status === 'online';
        //       }
        //     }
        //   }
        // }
      },
      error: error => {
        console.log(error, 'error');
      },
    });

    this._chatService.getUserMessages().subscribe((data: IChatMessage) => {
      this.messages.push(data);
      setTimeout(() => this.scrollToBottom(), 0);
    });
    this.getConversations();

    this._chatService.getDeletedMessages().subscribe((data: { messageId: string; deleteType: string }) => {
      const messageIndex = this.messages.findIndex(m => m._id === data.messageId);
      if (messageIndex !== -1) {
        this.messages[messageIndex].isDeleted = true;
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

    this._chatService.deleteMessage(this.selectedConversation!.conversationid, message._id.toString()).subscribe({
      next: response => {
        console.log('Delete message response:', response);

        const index = this.messages.findIndex(m => m._id === message._id);
        if (index !== -1) {
          this.messages[index].isDeleted = true;
        }

        this._chatService.notifyMessageDeleted(this.selectedConversation!.conversationid, message._id.toString()).subscribe({
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

    console.log(conversation, '123456789034567893456789023456789012345678901234567890234567890-');
    this.selectedUserOnlineStatus = this.userOnlineStatus.get(conversation.userId!) || false;

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

  ngOnDestroy() {
    this._chatService.setEmployeeOffline(this.employeeId);
  }

  isEmplMessage(message: IChatMessage): boolean {
    return message.user === 'employee';
  }
}
