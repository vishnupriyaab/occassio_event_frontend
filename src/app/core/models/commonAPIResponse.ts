export interface ApiResponse<T> {
  message: string;
  success: boolean;
  statusCode: number;
  data: T;
}

export interface LogOut {
  message: string;
}
