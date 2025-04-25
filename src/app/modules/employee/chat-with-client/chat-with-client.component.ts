import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IChatMessage, IConversationwithUser, IReaction } from '../../../core/models/IChat';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { Token } from '../../../core/models/commonAPIResponse';
import { ChatWithClientService } from '../../../core/services/employee/chatwithClient_Service/chat-with-client.service';
import { ToastService } from '../../../core/services/common/toaster/toast.service';
import IToastOption from '../../../core/models/IToastOptions';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

@Component({
  selector: 'app-chat-with-client',
  standalone: true,
  imports: [CommonModule, FormsModule, PickerModule],
  templateUrl: './chat-with-client.component.html',
  styleUrl: './chat-with-client.component.css',
})
export class ChatWithClientComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  showReactionPickerIndex: number = -1;
  commonEmojis: string[] = ['👍', '❤️', '😂', '😮', '😢', '👏', '🎉', '🔥', '👎', '✅'];

  showEmojiPicker = false;

  noteContent: string = '';

  @ViewChild('fileInput') fileInput!: ElementRef;
  isUploading: boolean = false;

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
    private cookieService: CookieService,
    private _toastService: ToastService
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
      },
      error: error => {
        console.log(error, 'error');
      },
    });

    this._chatService.getUserMessages().subscribe((data: IChatMessage) => {
      this.messages.push(data);
      setTimeout(() => this.scrollToBottom(), 30);
    });
    this.getConversations();

    this._chatService.getDeletedMessages().subscribe((data: { messageId: string; deleteType: string }) => {
      const messageIndex = this.messages.findIndex(m => m._id === data.messageId);
      if (messageIndex !== -1) {
        this.messages[messageIndex].isDeleted = true;
      }
    });

    this._chatService.getMessageReactions().subscribe((data: IChatMessage) => {
      console.log(data,"00000")
      const message = this.messages.find(m => m._id === data._id);
      console.log(this.messages,"---------------")
      if(message){
        message.reactions = data.reactions;
        console.log(data.reactions,"22222222222")
      }
      console.log(message,"qwertyuiop")
    });
  }


  showReactionPicker(index: number, event: MouseEvent): void {
    event.stopPropagation();
    this.showReactionPickerIndex = index;
    this.showEmojiPicker = false;

    setTimeout(() => {
      document.addEventListener('click', this.closeReactionPicker);
    }, 0);
  }

  closeReactionPicker = () => {
    this.showReactionPickerIndex = -1;
    document.removeEventListener('click', this.closeReactionPicker);
  };

  addReaction(message: IChatMessage, emoji: string): void {
    if (!message._id || !this.employeeId) {
      console.error('Cannot add reaction: Missing message ID or employee ID');
      return;
    }

    this.closeReactionPicker();

    if (!message.reactions) {
      message.reactions = [];
    }

    const existingReactionIndex = message.reactions.findIndex(r => r.userId.toString() === this.employeeId && r.emoji === emoji);

    if (existingReactionIndex !== -1) {
      message.reactions.splice(existingReactionIndex, 1);
    } else {
      message.reactions.push({
        userId: this.employeeId,
        emoji: emoji,
      });
    }

    this._chatService.sendReaction(this.selectedConversation!.conversationid, message._id.toString(), emoji, this.employeeId).subscribe();
  }

  getReactionCount(message: IChatMessage, emoji: string): number {
    if (!message.reactions) return 0;
    return message.reactions.filter(r => r.emoji === emoji).length;
  }

  getUniqueReactions(message: IChatMessage): string[] {
    if (!message.reactions || message.reactions.length === 0) return [];
    const uniqueEmojis = new Set(message.reactions.map(r => r.emoji));
    return Array.from(uniqueEmojis);
  }

  hasReacted(message: IChatMessage, emoji: string): boolean {
    if (!message.reactions || !this.employeeId) return false;
    return message.reactions.some(r => r.userId.toString() === this.employeeId && r.emoji === emoji);
  }

  /////////////////////////

  toggleEmojiPicker(): void {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any): void {
    console.log(event, 'eventtt');
    const emoji = event.emoji.native;
    this.message += emoji;
    this.showEmojiPicker = false;
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

  saveNote():void{
    if(!this.noteContent.trim()){
      return
    }
    ///passing to service layer
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
      setTimeout(() => this.scrollToBottom(), 30);
    });
  }

  sendMessage() {
    if (this.message.trim()) {
      const message = {
        user: 'employee',
        message: this.message,
        timestamp: new Date(),
      };
      this._chatService.sendMessageToEmployee(this.employeeId, this.selectedConversation!.conversationid, message).subscribe({
        next:(response)=>{
          console.log(response)
          if(response.status === 200){
            this.messages.push(response.message);
            setTimeout(() => this.scrollToBottom(), 30);
            this.message = '';
          }
        },error:(error)=>{
          console.error(error);
        }
      });
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

  sendImage() {
    if (!this.selectedConversation) {
      return;
    }
    this.fileInput.nativeElement.multiple = true;
    this.fileInput.nativeElement.click();
  }

  handleFileInput(event: any) {
    const fileList: FileList = event.target.files;
    if (!fileList || fileList.length === 0) return;

    if (fileList.length > 10) {
      const toastOption: IToastOption = {
        severity: 'danger-toast',
        summary: 'Error',
        detail: 'You can only upload up to 10 images at once',
      };
      this._toastService.showToast(toastOption);
      return;
    }

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (!file.type.match(/image\/*/) || file.size > 5000000) {
        //5MB limit
        const toastOption: IToastOption = {
          severity: 'danger-toast',
          summary: 'Error',
          detail: 'Please select a valid image file (max 5MB)',
        };
        this._toastService.showToast(toastOption);
        // return;
        continue;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result as string;
        const imageData = {
          image: base64Image,
          fileName: file.name,
          employeeId: this.employeeId!,
          conversationId: this.selectedConversation!.conversationid,
        };
        this.uploadAndSendImage(imageData);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  }

  uploadAndSendImage(imageData: { image: string; fileName: string; employeeId: string; conversationId: string }) {
    this.isUploading = true;

    console.log(imageData, 'Vishnuuuuuuuuu');

    this._chatService.uploadChatImages(imageData).subscribe();
    let imageMessage = {
      user: 'employee',
      message: imageData.image,
      timestamp: new Date(),
      // imageUrl: response.imageUrl,
      type: 'image',
      messageType: 'image',
    };
    this.messages.push(imageMessage);
    setTimeout(() => this.scrollToBottom(), 30);
  }

  isImageUrl(message: string): boolean {
    if (!message) return false;
    return message.match(/\.(jpeg|jpg|gif|png)$/) != null || message.includes('cloudinary.com') || message.includes('image/upload');
  }

  getImageSource(message: IChatMessage): string {
    if (message.imageUrl) {
      return message.imageUrl;
    } else if (message.messageType === 'image') {
      return message.message!;
    } else if (this.isImageUrl(message.message!)) {
      return message.message!;
    }
    return '';
  }

  openImagePreview(imageUrl: string) {
    if (!imageUrl) return;
    window.open(imageUrl, '_blank');
  }

  ngOnDestroy() {
    this._chatService.setEmployeeOffline(this.employeeId);
  }

  isEmplMessage(message: IChatMessage): boolean {
    return message.user === 'employee';
  }
}
