export interface UserDTO {
  id: number;
  email: string;
  firstname: string | null;
  lastname: string | null;
  city: string | null;
  registrationDate: string;
  level: number;
  phone: string | null;
  avatarUrl: string | null;
  subscriptionUntil: string | null;
}

export type UserUpdateDTO = UserDTO;

export enum UserLevel {
  USER = 0,
  MODERATOR = 1,
  ADMIN = 2
}

export interface AuthResponse {
  token: string;
}