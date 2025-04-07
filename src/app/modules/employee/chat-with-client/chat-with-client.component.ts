import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IChatMessage, IConversation, IConversationwithUser } from '../../../core/models/IChat';
import { ChatService } from '../../../core/services/common/chat/chat.service';

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
  currentUser: string = 'admin';
  defaultImageUrl!: string;

  constructor(private _chatService: ChatService) {}

  ngOnInit() {
    this.getConversations();
    this._chatService.connect()
    this.getEmplChatMessage();
  }
  

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  getConversations() {
    this._chatService.getConversationData().subscribe(conversations => {
      this.conversations = conversations;
      console.log(conversations, 'conversation');
      
    });
  }

  getEmplChatMessage() {
    this._chatService.getEmployeeMessages().subscribe((data: any) => {
      const newmess = this.conversations.map((res) => {
        console.log(newmess,"newmess");
        if (res.conversationid == data.conversationId) {
          res.messages.push(data)
        }
        return res
      })
      this.conversations = [...newmess]

    });
  }


  selectConversation(convo: IConversationwithUser): void {
    this.selectedConversation = convo;
    setTimeout(() => this.scrollToBottom(), 0);
  }

  sendMessage() {
    if (this.selectedConversation && this.newMessage.trim()) {
      const message: IChatMessage = {
        user: this.currentUser,
        message: this.newMessage,
        timestamp: new Date()
      };
      this.selectedConversation.messages.push(message);

      this._chatService.sendMessageToEmployee(this.selectedConversation.conversationid, message).subscribe(
        response => {
          if (this.selectedConversation) {

            this.selectedConversation.messages.push(message);
            console.log('fdjwksaljl');

          }

        },
        error => console.error('Error sending message:', error)
      );

      this.newMessage = '';
      this.scrollToBottom()
    }
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  // getImageUrl(user: IUser): string {
  //   return user.imageUrl && user.imageUrl.trim() !== ''
  //     ? user.imageUrl
  //     : this.defaultImageUrl;
  // }

  isEmplMessage(message: IChatMessage): boolean {
    return message.user === this.currentUser;
  }
}