// app/components/signin/signin.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signin.html',
  styleUrl: './signin.css'
})
export class SigninComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    // Reset error message
    this.errorMessage = '';

    // Validate inputs
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    this.isLoading = true;

    // Call auth service
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.isLoading = false;

        // Ensure user is persisted even if backend didn't include full payload
        if (!response.user) {
          this.authService.setUser({ email: this.email, role: response.role });
        }

        // Navigate based on role
        switch (response.role) {
          case 'DOCTOR':
            this.router.navigate(['/doctor-dashboard']);
            break;
          case 'PATIENT':
            this.router.navigate(['/patient-dashboard']);
            break;
          case 'ADMIN':
            this.router.navigate(['/admin-dashboard']);
            break;
          default:
            this.errorMessage = 'Invalid role received from server';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Login failed. Please check your credentials.';
        console.error('Login error:', error);
      }
    });
  }
}