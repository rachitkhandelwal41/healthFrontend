// app/models/user.ts

export type UserRole = 'DOCTOR' | 'PATIENT' | 'ADMIN';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface LoginResponse {
  success: boolean;
  role: UserRole;
  message: string;
}

export interface SignupResponse {
  success: boolean;
  role: UserRole;
  message: string;
}

export interface User {
  email: string;
  role: UserRole;
}