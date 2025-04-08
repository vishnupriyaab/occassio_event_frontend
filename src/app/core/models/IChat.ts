import { IUser } from "./IUser";

export interface Conversation {
  id: string;
  participants: string[];
  messages: IChatMessage[];
}

export interface IChatMessage {
  user: string | undefined; 
  message: string;
  timestamp?: Date;
}


export interface IConversation {
  _id: string; 
  conversationid: string; 
  participants: string[]; 
  messages: IChatMessage[];   
}

export interface IConversationwithUser {
  _id: string; 
  conversationid: string; 
  participants: IUser[]; 
  messages: IChatMessage[]; 
}
