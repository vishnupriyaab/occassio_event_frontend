import { IUser } from './IUser';

export interface Conversation {
  id: string;
  participants: string[];
  messages: IChatMessage[];
}

export interface IReaction {
  userId: string;
  emoji: string;
}

export interface IChatMessage {
  _id?: any;
  user: string | undefined;
  message?: string;
  timestamp?: Date;
  deletedFor?: any;
  reactions?: IReaction[];
  imageUrl?: string;
  messageType?: string;
  senderId?: string;
  isDeleted?: boolean;
  conversationId?: string;
}

export interface IConversation {
  _id: string;
  conversationid: string;
  userId: string;
  employeeId: string;
  lastUpdated?: Date;
}

export interface IConversationwithUser {
  _id: string;
  conversationid: string;
  username: string;
  participants: IUser[];
  messages: IChatMessage[];
  lastMessage?: any;
  userId?: string;
}
