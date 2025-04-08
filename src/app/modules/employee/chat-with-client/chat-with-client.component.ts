import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IChatMessage, IConversationwithUser } from '../../../core/models/IChat';
import { ChatService } from '../../../core/services/common/chat/chat.service';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { Token } from '../../../core/models/commonAPIResponse';

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
  newMessage: string = '';
  // currentUser: string = 'admin';
  // defaultImageUrl!: string;
  employeeId: string | undefined ;
  token: string = '';
  decodedToken: Token | undefined;

  constructor(
    private _chatService: ChatService,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    // const accessToken = this.cookieService.get('access_token');
    this.token = this.cookieService.get('refresh_token');
    if (this.token) {
      this.decodedToken = jwtDecode(this.token);
      console.log('Decoded Token:', this.decodedToken);
      this.employeeId = this.decodedToken?.id
      console.log(this.employeeId,"000000000")
    }else{
      console.log("Unavailable token!")
    }
    // console.log('Access Token:', accessToken);
    console.log('Refresh Token:', this.token);
    this._chatService.connect();
    this.getConversations();
    this.getEmplChatMessage(); 
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

  getEmplChatMessage() {
    this._chatService.getEmployeeMessages().subscribe((data: any) => {
      const updatedConversations  = this.conversations.map(res => {
        console.log(updatedConversations , 'newmess');
        if (res.conversationid == data.conversationId) {
          res.messages.push(data);
        }
        return res;
      });
      this.conversations = [...updatedConversations ];
    });
  }

  selectConversation(conversation: IConversationwithUser): void {
    this.selectedConversation = conversation;
    console.log(this.selectedConversation,"1234567")
    setTimeout(() => this.scrollToBottom(), 0);
  }

  sendMessage() {
    console.log(this.selectedConversation, this.newMessage,this.employeeId,"00000000000") //here ehy i didnt got employeeId?
    if (this.selectedConversation && this.newMessage.trim() && this.employeeId) {
      const message: IChatMessage = {
        user: this.employeeId,
        message: this.newMessage,
        timestamp: new Date(),
      };
      this.selectedConversation.messages.push(message);

      this._chatService.sendMessageToEmployee(this.employeeId, this.selectedConversation.conversationid, message).subscribe(
        response => {
          if (this.selectedConversation) {
            this.selectedConversation?.messages.push(message);
            console.log('fdjwksaljl',response);
          }
        },
        error => console.error('Error sending message:', error)
      );

      this.newMessage = '';
      this.scrollToBottom();
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
    return message.user === this.employeeId;
  }
}
