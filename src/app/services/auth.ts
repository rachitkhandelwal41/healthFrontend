// app/services/auth.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, SignupRequest, SignupResponse, UserRole } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://healthcare-backend-eight.vercel.app/api/v1'; // Updated to your backend URL
  private readonly ROLE_KEY = 'userRole';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(email: string, password: string): Observable<LoginResponse> {
    const loginData: LoginRequest = { email, password };
    
    return this.http.post<LoginResponse>(`${this.apiUrl}/signin`, loginData, {
      withCredentials: true // Important for cookies
    }).pipe(
      tap(response => {
        if (response.role) {
          this.setUserRole(response.role);
        }
      })
    );
  }

  signup(name: string, email: string, password: string, phone: string): Observable<SignupResponse> {
    const signupData: SignupRequest = { name, email, password, phone };
    
    return this.http.post<SignupResponse>(`${this.apiUrl}/signup`, signupData, {
      withCredentials: true // Important for cookies
    }).pipe(
      tap(response => {
        if (response.role) {
          this.setUserRole(response.role);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.ROLE_KEY);
    // Optionally call backend logout endpoint to clear cookies
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe({
      next: () => {
        this.router.navigate(['/signin']);
      },
      error: () => {
        // Even if logout fails, redirect to signin
        this.router.navigate(['/signin']);
      }
    });
  }
  isAuthenticated(): boolean {
    return this.getUserRole() !== null;
  }

  getUserRole(): UserRole | null {
    const role = localStorage.getItem(this.ROLE_KEY);
    return role as UserRole | null;
  }

  setUserRole(role: UserRole): void {
    localStorage.setItem(this.ROLE_KEY, role);
  }

  hasRole(role: UserRole): boolean {
    return this.getUserRole() === role;
  }
}