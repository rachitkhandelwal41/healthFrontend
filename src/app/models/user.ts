// app/models/user.ts

export type UserRole = 'DOCTOR' | 'PATIENT' | 'ADMIN';

export interface AuthUser {
  _id?: string;
  id?: string;
  userId?: string;
  name?: string;
  email?: string;
  phone?: string;
  role: UserRole;
}

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
  user?: AuthUser; // optional user payload from backend
}

export interface SignupResponse {
  success: boolean;
  role: UserRole;
  message: string;
  user?: AuthUser; // optional user payload from backend
}

export interface User {
  email: string;
  role: UserRole;
}