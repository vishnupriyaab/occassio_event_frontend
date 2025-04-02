export interface Employee {
  _id: string;
  employees: Employee;
  name: string;
  email: string;
  phone: string;
  status?: string;
  imageUrl?: string;
}

export interface IEmployee {
  _id: string;
  name: string;
  email: string;
  phone: string;
  isBlocked?: boolean;
}

export interface FetchEmployeeData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  assignedUsers?: string[];
  assignedUsersCount?: number;
  resetPasswordToken?: string | null;
  isVerified?: boolean;
  isBlocked?: boolean;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface FetchEmployeeResponse {
  currentPage: number;
  employees: FetchEmployeeData[];
  totalEmployees: number;
  totalPages: number;
}
