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
import IToastOption from '../../../core/models/IToastOptions';
import { ToastService } from '../../../core/services/common/toaster/toast.service';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { UserVideoCallService } from '../../../core/services/users/videoCall/user-video-call.service';

@Component({
  selector: 'app-chat-with-employee',
  imports: [CommonModule, FormsModule, PickerModule],
  templateUrl: './chat-with-employee.component.html',
  styleUrl: './chat-with-employee.component.css',
})
export class ChatWithEmployeeComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  showReactionPickerIndex: number = -1;
  commonEmojis: string[] = ['👍', '❤️', '😂', '😮', '😢', '👏', '🎉', '🔥', '👎', '✅'];

  showEmojiPicker = false;

  private _chatService = inject(ChatWithEmployeeService);
  private _employeeService = inject(EmployeeService);

  @ViewChild('fileInput') fileInput!: ElementRef;
  isUploading: boolean = false;

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

  currentCallId: string | null = null;
  callStartTime: Date | null = null;
  isInCall: boolean = false;

  constructor(
    private cookieService: CookieService,
    private _toastService: ToastService,
    private _videoCallService: UserVideoCallService
  ) {}

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
    this._chatService.connect();
    this._chatService.setUserOnline(this.userId);

    this._chatService.onEmployeeStatusChange().subscribe({
      next: response => {
        console.log(response, 'responseee');
        this.employeeOnlineStatus = response.status === 'online';
      },
      error: error => {
        console.log(error, 'error');
      },
    });

    this._chatService.getEmployeeMessages().subscribe((data: IChatMessage) => {
      this.messages.push(data);
      setTimeout(() => this.scrollToBottom(), 30);
    });
    this.getChats();
    this.getConversationId();

    this._chatService.getDeletedMessages().subscribe((data: { messageId: string; deleteType: string }) => {
      const messageIndex = this.messages.findIndex(m => m._id === data.messageId);
      if (messageIndex !== -1) {
        this.messages[messageIndex].isDeleted = true;
      }
    });

    this._chatService.getMessageReactions().subscribe((data: IChatMessage) => {
      console.log(data, '00000');
      const message = this.messages.find(m => m._id === data._id);
      console.log(this.messages, '---------------');
      if (message) {
        message.reactions = data.reactions;
        console.log(data.reactions, '22222222222');
      }
      console.log(message, 'qwertyuiop');
      // if (messageIndex !== -1) {
      //   if (!this.messages[messageIndex].reactions) {
      //     this.messages[messageIndex].reactions = [];
      //   }

      //   if (data.action === 'add') {
      //     this.messages[messageIndex].reactions!.push(data.reaction);
      //   } else {
      //     const reactionIndex = this.messages[messageIndex].reactions!.findIndex(
      //       r => r.userId.toString() === data.reaction.userId.toString() && r.emoji === data.reaction.emoji
      //     );
      //     if (reactionIndex !== -1) {
      //       this.messages[messageIndex].reactions!.splice(reactionIndex, 1);
      //     }
      //   }
      // }
    });
    this.checkForActiveCall();
    setInterval(() => this.checkForActiveCall(), 10000); 
  }

  // Video call related methods
  startVideoCall() {
    console.log(this.conversationId, this.userId, this.employeeId) ////////////////////////////////////////////////////
    if (!this.conversationId || !this.userId || !this.employeeId) {
      const toastOption: IToastOption = {
        severity: 'warning-toast',
        summary: 'Warning',
        detail: 'Unable to start call at this time',
      };
      this._toastService.showToast(toastOption);
      return;
    }

    // Generate a room ID based on the conversation ID
    const roomID = this.conversationId;

    // Generate a unique call ID
    const callId = Date.now().toString();

    // First, store call data in the database
    const callData = {
      conversationId: this.conversationId,
      callerId: this.userId,
      receiverId: this.employeeId,
      callerModel: 'User' as 'User',
      receiverModel: 'Employee' as 'Employee',
      callId: callId,
      roomId: roomID,
    };

    this._videoCallService.initiateCall(callData).subscribe({
      next: response => {
        this.currentCallId = callId;
        this.callStartTime = new Date();
        this.isInCall = true;

        const appID = 400914278;
        const serverSecret = '274a74430adad287bc946c7a2e7fdb85';
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomID,
          this.userId!, // Your user ID
          this.decodedToken?.name || 'User' // Your username
        );

        // Create an instance of ZegoUIKit
        const zp = ZegoUIKitPrebuilt.create(kitToken);

        // Join the room
        zp.joinRoom({
          container: document.getElementById('zegocloud-container'),
          sharedLinks: [
            {
              name: 'Join call',
              url: window.location.protocol + '//' + window.location.host + window.location.pathname + '?roomID=' + roomID,
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall, // 1-on-1 call mode
          },
          showScreenSharingButton: true,
          onLeaveRoom: () => this.endCall(),
          onUserJoin: users => {
            const otherUser = users.find(user => user.userID !== this.userId);
            if (otherUser) {
              this._videoCallService.updateCallStatus(this.currentCallId!, 'accepted').subscribe({
                next: response => {
                  console.log('Call accepted:', response);
                },
                error: error => {
                  console.error('Error updating call status:', error);
                },
              });
            }
          },
        });

        setTimeout(() => {
          if (this.isInCall && this.currentCallId === callId) {
            this._videoCallService.getCallHistory(this.conversationId).subscribe({
              next: response => {
                const activeCall = response.data?.find((call: any) => call.callId === callId);
                if (activeCall && activeCall.status === 'initiated') {
                  // Mark as missed and end the call
                  this._videoCallService.updateCallStatus(callId, 'missed').subscribe();
                  this.endCall();

                  const toastOption: IToastOption = {
                    severity: 'info-toast',
                    summary: 'Call',
                    detail: 'Call not answered',
                  };
                  this._toastService.showToast(toastOption);
                }
              },
            });
          }
        }, 30000); // 30 seconds timeout
      },
      error: error => {
        console.error(error);
        const toastOption: IToastOption = {
          severity: 'danger-toast',
          summary: 'Error',
          detail: 'Failed to initiate call',
        };
        this._toastService.showToast(toastOption);
      },
    });
  }

  endCall() {
    if (this.currentCallId && this.callStartTime) {
      const endTime = new Date();
      const durationMs = endTime.getTime() - this.callStartTime.getTime();
      const durationSeconds = Math.floor(durationMs / 1000);

      this._videoCallService.updateCallStatus(this.currentCallId, 'ended', endTime, durationSeconds).subscribe({
        next: response => {
          console.log('Call ended:', response);
          const callMessage = {
            user: 'user',
            message: `Call ended. Duration: ${this.formatCallDuration(durationSeconds)}`,
            timestamp: new Date(),
          };

          this._chatService.sendMessageToEmployee(this.userId!, this.conversationId, callMessage).subscribe();
        },
        error: error => {
          console.error('Error ending call:', error);
        },
      });
    }

    this.isInCall = false;
    this.currentCallId = null;
    this.callStartTime = null;
  }

  formatCallDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  checkForActiveCall() {
    if (!this.conversationId) return;

    this._videoCallService.getCallHistory(this.conversationId).subscribe({
      next: response => {
        const activeCalls = response.data?.filter((call: any) => 
          call.status !== 'ended' && call.status !== 'missed' && call.status !== 'rejected');

        if (activeCalls && activeCalls.length > 0) {
          const activeCall = activeCalls[0];

          if (activeCall.receiverId === this.userId && activeCall.status === 'initiated') {
            this.showIncomingCallModal(activeCall);
          }
        }
      },
      error: error => {
        console.error('Error checking for active calls:', error);
      },
    });
  }

  showIncomingCallModal(callData: any) {
    const willAnswer = confirm('Incoming call from employee. Would you like to answer?');

    if (willAnswer) {
      this.currentCallId = callData.callId;
      this.callStartTime = new Date();
      this.isInCall = true;

      this._videoCallService.updateCallStatus(callData.callId, 'accepted').subscribe();

      const appID = 400914278;
      const serverSecret = '274a74430adad287bc946c7a2e7fdb85';

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        callData.roomId,
        this.userId!,
        this.decodedToken?.name || 'User'
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: document.getElementById('zegocloud-container'),
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showScreenSharingButton: true,
        onLeaveRoom: () => this.endCall(),
      });
    } else {
      // Reject the call
      this._videoCallService.updateCallStatus(callData.callId, 'rejected').subscribe();
    }
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
    if (!message._id || !this.userId) {
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
        userId: this.userId,
        emoji: emoji,
      });
    }

    this._chatService.sendReaction(this.conversationId, message._id.toString(), emoji, this.userId).subscribe();
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
    if (!message.reactions || !this.userId) return false;
    return message.reactions.some(r => r.userId.toString() === this.userId && r.emoji === emoji);
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

    this._chatService.deleteMessage(this.conversationId, message._id.toString()).subscribe({
      next: response => {
        console.log('Delete message response:', response); 

        const index = this.messages.findIndex(m => m._id === message._id);
        if (index !== -1) {
          this.messages[index].isDeleted = true;
        }

        this._chatService.notifyMessageDeleted(this.conversationId, message._id.toString()).subscribe({
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
    this._chatService.getChats().subscribe(chat => {
      this.chat = chat;
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {
      throw err;
    }
  }

  sendMessage() {
    if (this.message.trim()) {
      let message = {
        user: 'user',
        message: this.message,
        timestamp: new Date(),
      };
      this._chatService.sendMessageToEmployee(this.userId, this.conversationId, message).subscribe({
        next: response => {
          console.log(response);
          if (response.status === 200) {
            this.messages.push(response.message);
            setTimeout(() => this.scrollToBottom(), 30);
            this.message = '';
          }
        },
        error: error => {
          console.error(error);
        },
      });
    }
  }

  getConversationId() {
    this._chatService.getConversationId().subscribe((response: any) => {
      console.log(response, '222222222');
      console.log(response.data.conversation.employeeId);
      this.employeeId = response.data.conversation.employeeId;

      this.fetchEmployeeDetails();

      this.messages = response.data.chatMessages;
      console.log(this.messages, 'ghjkl');
      this.conversationId = response.data.conversation.conversationid;
      this._chatService.joinConversation(this.conversationId).subscribe();
      setTimeout(() => this.scrollToBottom(), 30);
    });
  }

  fetchEmployeeDetails() {
    if (!this.employeeId) {
      return;
    }
    this._employeeService.getEmployeeById(this.employeeId).subscribe({
      next: response => {
        console.log(response, 'response');
        this.employeeDetails = response.data;
      },
      error: error => {
        console.log(error, 'error');
      },
    });
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

  sendImage() {
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
          userId: this.userId!,
          conversationId: this.conversationId,
        };
        this.uploadAndSendImage(imageData);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  }

  uploadAndSendImage(imageData: { image: string; fileName: string; userId: string; conversationId: string }) {
    this.isUploading = true;

    this._chatService.uploadChatImages(imageData).subscribe();
    let imageMessage = {
      user: 'user',
      message: imageData.image,
      timestamp: new Date(),
      // imageUrl: response.imageUrl,
      type: 'image',
      messageType: 'image',
    };
    this.messages.push(imageMessage);
    setTimeout(() => this.scrollToBottom(), 30);
  }

  toggleEmojiPicker(): void {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any): void {
    console.log(event, 'eventtt');
    const emoji = event.emoji.native;
    this.message += emoji;
    this.showEmojiPicker = false;
  }

  ngOnDestroy() {
    this._chatService.setUserOffline(this.userId);
  }

  isUserMessage(message: IChatMessage): boolean {
    return message.user === 'user';
  }
}
