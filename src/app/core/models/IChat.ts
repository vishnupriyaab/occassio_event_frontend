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
  deletedFor?: any;
  senderId?: string;
  _id?: any;
  isDeleted?: boolean;
  user: string | undefined;
  message?: string;
  messageType?: string;
  timestamp?: Date;
  imageUrl?: any;
  reactions?: IReaction[]
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
  participants: IUser[];
  messages: IChatMessage[];
  userId?:string
}
