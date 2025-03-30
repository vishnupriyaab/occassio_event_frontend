export interface IUser {
    _id?: string;
    name: string;
    password?: string;
    email: string;
    phone: number;
    isVerified?: boolean;
    isBlocked?: boolean;
  }