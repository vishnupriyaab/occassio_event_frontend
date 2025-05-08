export interface ApiResponse<T> {
  message: string;
  success: boolean;
  statusCode: number;
  data: T;
}

export interface LogOut {
  message: string;
}

export interface Token {
  id: string;
  role: string;
  name:string;
}
