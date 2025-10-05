// app/components/signup/signup.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class SignupComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  phone: string = '';
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
    if (!this.name || !this.email || !this.password || !this.phone) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(this.phone.replace(/[\s\-\(\)]/g, ''))) {
      this.errorMessage = 'Please enter a valid phone number (10-15 digits)';
      return;
    }

    // Validate password length
    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return;
    }

    this.isLoading = true;

    // Call auth service
    this.authService.signup(this.name, this.email, this.password, this.phone).subscribe({
      next: (response) => {
        this.isLoading = false;

        // Ensure user is persisted even if backend didn't include full payload
        if (!response.user) {
          this.authService.setUser({ name: this.name, email: this.email, role: response.role, phone: this.phone });
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
        this.errorMessage = error.error?.message || 'Signup failed. Please try again.';
        console.error('Signup error:', error);
      }
    });
  }
}