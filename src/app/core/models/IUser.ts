export interface IUser {
  _id?: string;
  name: string;
  password?: string;
  email: string;
  phone: number;
  isVerified?: boolean;
  isBlocked?: boolean;
}

export interface IClientData {
  clientId: string;
  venue: string;
  decoration: boolean;
  sound: boolean;
  seating: boolean;
  photography: boolean;
  foodOptions: {
    welcomeDrink: boolean;
    starters: boolean;
    mainCourse: boolean;
    dessert: boolean;
  };
  name: string;
  email: string;
  phone: number;
  eventName: string;
  startDate: string;
  endDate: string;
  district: string;
  state: string;
  pincode: string;
  guestCount: number;
  entryId: string;
}

export interface FetchClientData {
  _id?: string;
  name: string;
  email: string;
  phone: number;
  password?: string;
  assignedEmployee?: string;
  entryId?: string;
  resetPasswordToken?: string;
  isVerified?: boolean;
  isBlocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface FetchClientResponse {
  currentPage: number;
  users: FetchClientData[];
  totalUsers: number;
  totalPages: number;
}
