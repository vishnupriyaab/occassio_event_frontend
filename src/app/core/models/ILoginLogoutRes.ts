export interface LoginResponse {
    token: string;
    userId: string;
    message?: string;
  }
  
  export interface LogOut {
    message: string;
  }
  