import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IChatMessage, IConversationwithUser } from '../../../core/models/IChat';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { Token } from '../../../core/models/commonAPIResponse';
import { ChatWithClientService } from '../../../core/services/employee/chatwithClient_Service/chat-with-client.service';
import { ToastService } from '../../../core/services/common/toaster/toast.service';
import IToastOption from '../../../core/models/IToastOptions';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { NoteService } from '../../../core/services/employee/noteService/note.service';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { VideoCallService } from '../../../core/services/employee/videoCall/video-call.service';

@Component({
  selector: 'app-chat-with-client',
  standalone: true,
  imports: [CommonModule, FormsModule, PickerModule],
  templateUrl: './chat-with-client.component.html',
  styleUrl: './chat-with-client.component.css',
})
export class ChatWithClientComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  private notificationSound: HTMLAudioElement;
  private unreadMessages: Map<string, number> = new Map();

  showReactionPickerIndex: number = -1;
  commonEmojis: string[] = ['👍', '❤️', '😂', '😮', '😢', '👏', '🎉', '🔥', '👎', '✅'];

  showEmojiPicker = false;

  noteContent: string = '';
  isUploading: boolean = false;
  isEditing: boolean = false;

  noteId: string | null = null;

  userOnlineStatus: Map<string, boolean> = new Map();
  selectedUserOnlineStatus: boolean = false;

  currentCallId: string | null = null;
  callStartTime: Date | null = null;

  conversations: IConversationwithUser[] = [];
  selectedConversation: IConversationwithUser | null = null;
  message: string = '';
  employeeId: string | undefined;
  token: string = '';
  decodedToken: Token | undefined;
  isNoteVisible = false;
  messages: IChatMessage[] = [];
  selectedMessageIndex: number = -1;
  isInCall: boolean = false;

  constructor(
    private _chatService: ChatWithClientService,
    private cookieService: CookieService,
    private _toastService: ToastService,
    private _noteService: NoteService,
    private _videoCallService: VideoCallService
  ) {
    this.notificationSound = new Audio();
    this.notificationSound.src = '/chat-notification.mp3';
    this.notificationSound.load();
  }

  ngOnInit() {
    this.token = this.cookieService.get('refresh_token');
    if (this.token) {
      this.decodedToken = jwtDecode(this.token);
      this.employeeId = this.decodedToken?.id;
      // console.log(this.employeeId, '000000000');
      // } else {
      // console.log('Unavailable token!');
    }
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
      const conversation = this.conversations.find(c => c.conversationid === this.selectedConversation?.conversationid);
      if (conversation) {
        conversation.lastMessage = data;
      }
      setTimeout(() => this.scrollToBottom(), 30);
    });
    // this._chatService.getMessageNotifications().subscribe(notification => {
    //   console.log(notification,"notification");
    //   if (
    //     notification.message.user !== 'employee' &&
    //     (!this.selectedConversation || this.selectedConversation.conversationid !== notification.conversationId)
    //   ) {
    //     this.playNotificationSound();
    //     this.updateUnreadCount(notification.conversationId);
    //   }
    // });
    this._chatService.getMessageNotifications().subscribe(notification => {
      console.log('Notification conversationId:', notification.conversationId);
      // const shouldUpdateUnread =
      //   notification.message &&
      //   notification.message.user !== 'employee' &&
      //   (!this.selectedConversation || this.selectedConversation.conversationid !== notification.message?.conversationId);

      // console.log('Should update unread count?', shouldUpdateUnread);

      // if (shouldUpdateUnread) {
      //   this.playNotificationSound();
      //   this.updateUnreadCount(notification.conversationId);
      // }
      if (!notification.conversationId) {
        console.error('Empty conversationId in notification', notification);
        return;
      }

      if (
        notification.message &&
        notification.message.user !== 'employee' &&
        (!this.selectedConversation || this.selectedConversation.conversationid !== notification.conversationId)
      ) {
        this.playNotificationSound();
        this.updateUnreadCount(notification.conversationId);
      }
    });
    this.getConversations();

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
    });

    this.checkForActiveCall();
    setInterval(() => this.checkForActiveCall(), 10000); // Check every 10 seconds
  }

  playNotificationSound(): void {
    if (this.notificationSound) {
      console.log(this.notificationSound, 'qwertyui');
      this.notificationSound.play().catch(error => {
        console.error('Error playing notification sound:', error);
      });
    }
  }

  startVideoCall() {
    // this.isInCall = true;
    if (!this.selectedConversation || !this.employeeId) {
      const toastOption: IToastOption = {
        severity: 'warning-toast',
        summary: 'Warning',
        detail: 'No conversation selected',
      };
      this._toastService.showToast(toastOption);
      return;
    }

    // Generate a room ID based on the conversation ID
    const roomID = this.selectedConversation.conversationid;

    // Generate a unique call ID
    const callId = Date.now().toString();

    // First, store call data in the database
    const callData = {
      conversationId: this.selectedConversation.conversationid,
      callerId: this.employeeId,
      receiverId: this.selectedConversation.userId!,
      callerModel: 'Employee' as 'Employee',
      receiverModel: 'User' as 'User',
      callId: callId,
      roomId: roomID,
    };

    this._videoCallService.initiateCall(callData).subscribe({
      next: response => {
        console.log(response, 'responsee');
        this.currentCallId = callId;
        this.callStartTime = new Date();
        this.isInCall = true;

        const appID = 400914278;
        const serverSecret = '274a74430adad287bc946c7a2e7fdb85';
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomID,
          this.employeeId!, // Your user ID
          this.decodedToken?.name || 'Employee' // Your username
        );

        console.log(kitToken, 'kitToken11111111111111111111111111111111111111111');

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
            const otherUser = users.find(user => user.userID !== this.employeeId);
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
        // Set a timeout to mark call as missed if not answered within 30 seconds
        setTimeout(() => {
          if (this.isInCall && this.currentCallId === callId) {
            // Check if the call is still in initiated state
            this._videoCallService.getCallHistory(this.selectedConversation!.conversationid).subscribe({
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
        console.log(error, 'error');
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
          // Add notification in chat
          const callMessage = {
            user: 'employee',
            message: `Call ended. Duration: ${this.formatCallDuration(durationSeconds)}`,
            timestamp: new Date(),
          };

          this._chatService.sendMessageToEmployee(this.employeeId!, this.selectedConversation!.conversationid, callMessage).subscribe();
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

  // Helper function to format call duration
  formatCallDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  // Add this method to check for active calls when component initializes
  checkForActiveCall() {
    if (!this.selectedConversation) return;

    this._videoCallService.getCallHistory(this.selectedConversation.conversationid).subscribe({
      next: response => {
        const activeCalls = response.data?.filter((call: any) => call.status !== 'ended' && call.status !== 'missed' && call.status !== 'rejected');

        if (activeCalls && activeCalls.length > 0) {
          const activeCall = activeCalls[0];

          // If there's an active call where this employee is the receiver, show join option
          if (activeCall.receiverId === this.employeeId && activeCall.status === 'initiated') {
            this.showIncomingCallModal(activeCall);
          }
        }
      },
      error: error => {
        console.error('Error checking for active calls:', error);
      },
    });
  }

  // Add this method to handle incoming calls
  showIncomingCallModal(callData: any) {
    // This would typically be implemented with a modal component
    // For now, we'll use a simple confirmation
    const willAnswer = confirm('Incoming call. Would you like to answer?');

    if (willAnswer) {
      // Join the call
      this.currentCallId = callData.callId;
      this.callStartTime = new Date();
      this.isInCall = true;

      // Update call status
      this._videoCallService.updateCallStatus(callData.callId, 'accepted').subscribe();

      // Join the room
      const appID = 400914278;
      const serverSecret = '274a74430adad287bc946c7a2e7fdb85';

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        callData.roomId,
        this.employeeId!,
        this.decodedToken?.name || 'Employee'
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

  updateUnreadCount(conversationId: string): void {
    if (!conversationId) {
      // console.error('Empty conversationId provided to updateUnreadCount');
      return;
    }
    // console.log('Before update, unread count:', this.unreadMessages.get(conversationId) || 0);

    if (!this.unreadMessages.has(conversationId)) {
      this.unreadMessages.set(conversationId, 1);
    } else {
      const currentCount = this.unreadMessages.get(conversationId) || 0;
      this.unreadMessages.set(conversationId, currentCount + 1);
    }

    // console.log('After update, unread count:', this.unreadMessages.get(conversationId));
  }

  resetUnreadCount(conversationId: string): void {
    // console.log(conversationId, 'conversationId');
    this.unreadMessages.set(conversationId, 0);
  }

  getUnreadCount(conversationId: string): number {
    const unreadCount = this.unreadMessages.get(conversationId) || 0;
    // console.log(unreadCount, 'unreadCount');
    return unreadCount;
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

  editNote(): void {
    this.isEditing = true;
  }

  saveNote(): void {
    if (!this.noteContent.trim()) {
      const toastOption: IToastOption = {
        severity: 'warning-toast',
        summary: 'Warning',
        detail: 'Note content cannot be empty',
      };
      this._toastService.showToast(toastOption);
      return;
    }

    this.isUploading = true;
    const userId = this.selectedConversation?.userId!;

    console.log('werty');
    // this._noteService.saveNote(this.noteContent, this.employeeId, this.selectedConversation?.conversationid, userId).subscribe({
    //   next: response => {
    //     this.isUploading = false;
    //     this.isEditing = false;
    //     console.log(response, 'data');
    //     const toastOption: IToastOption = {
    //       severity: 'success-toast',
    //       summary: 'Success',
    //       detail: 'Note saved successfully',
    //     };
    //     this._toastService.showToast(toastOption);
    //     // this.noteContent = '';
    //   },
    //   error: error => {
    //     console.log(error, 'error');
    //     this.isUploading = false;
    //     const toastOption: IToastOption = {
    //       severity: 'danger-toast',
    //       summary: 'Error',
    //       detail: 'Failed to save Note',
    //     };
    //     this._toastService.showToast(toastOption);
    //     console.log(error, 'error');
    //   },
    // });

    // If we have a noteId, update the existing note, otherwise create a new one
    const noteObservable = this.noteId
      ? this._noteService.editNote(this.noteId, this.noteContent)
      : this._noteService.saveNote(this.noteContent, this.employeeId, this.selectedConversation?.conversationid, userId);

    noteObservable.subscribe({
      next: response => {
        this.isUploading = false;
        this.isEditing = false;
        if (response.data && response.data._id) {
          this.noteId = response.data._id;
        }

        const toastOption: IToastOption = {
          severity: 'success-toast',
          summary: 'Success',
          detail: this.noteId ? 'Note updated successfully' : 'Note saved successfully',
        };
        this._toastService.showToast(toastOption);
      },
      error: error => {
        console.log(error, 'error');
        this.isUploading = false;
        const toastOption: IToastOption = {
          severity: 'danger-toast',
          summary: 'Error',
          detail: this.noteId ? 'Failed to update Note' : 'Failed to save Note',
        };
        this._toastService.showToast(toastOption);
      },
    });
  }

  loadNotes(): void {
    if (!this.selectedConversation || !this.employeeId) return;

    const userId = this.selectedConversation?.userId!;
    console.log(this.selectedConversation.conversationid, this.employeeId, userId, 'all filedss');

    this._noteService.getNotes(userId).subscribe({
      next: response => {
        if (response.data) {
          this.noteContent = response.data.content;
          this.noteId = response.data._id!;
          console.log(this.noteContent, 'note-content');
          this.isEditing = false;
        } else {
          this.noteContent = '';
          this.noteId = null;
          this.isEditing = true;
        }
      },
      error: error => {
        console.error('Error loading notes:', error);
        this.isEditing = true;
        this.noteId = null;
        const toastOption: IToastOption = {
          severity: 'danger-toast',
          summary: 'Error',
          detail: 'Failed to fetch Note',
        };
        this._toastService.showToast(toastOption);
        return;
      },
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  getConversations() {
    this._chatService.getConversationData().subscribe(conversations => {
      this.conversations = conversations.data;
      console.log(conversations, 'conversation');
      // If you also need last messages, you can fetch them here
      this.conversations.forEach(conversation => {
        this._chatService.getLastMessage(conversation.conversationid).subscribe(lastMessage => {
          console.log(lastMessage, 'lastMessage');
          conversation.lastMessage = lastMessage;
        });
      });
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

    this.resetUnreadCount(conversation.conversationid);

    console.log(conversation, '123456789034567893456789023456789012345678901234567890234567890-');
    this.selectedUserOnlineStatus = this.userOnlineStatus.get(conversation.userId!) || false;

    this.getConversationId(this.selectedConversation.conversationid);
    this.loadNotes();
  }

  getConversationId(conversationId: string) {
    console.log();
    this._chatService.getConversationId(conversationId).subscribe((response: any) => {
      // console.log(response, '222222222');
      this.messages = response.data.chatMessages;
      // console.log(this.messages, 'messaessssssss');
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
        next: response => {
          console.log(response);
          if (response.status === 200) {
            this.messages.push(response.message);
            if (this.selectedConversation) {
              this.selectedConversation.lastMessage = response.message;
            }
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
