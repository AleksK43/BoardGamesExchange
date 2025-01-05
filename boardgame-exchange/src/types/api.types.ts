// src/types/api.types.ts
export interface ApiResponse {
    message: string;
    data?: unknown;
  }
  
  export interface ApiError {
    message: string;
    status: number;
  }
  
  export interface AuthResponse extends ApiResponse {
    token: string;
  }