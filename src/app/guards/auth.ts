// app/guards/auth.ts

import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';
import { UserRole } from '../models/user';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is authenticated
  if (!authService.isAuthenticated()) {
    router.navigate(['/signin']);
    return false;
  }

  // Get required role from route data
  const requiredRole = route.data['role'] as UserRole;
  
  // If no specific role is required, just check authentication
  if (!requiredRole) {
    return true;
  }

  // Check if user has the required role
  if (authService.hasRole(requiredRole)) {
    return true;
  }

  // User doesn't have required role, redirect to their dashboard
  const userRole = authService.getUserRole();
  switch (userRole) {
    case 'DOCTOR':
      router.navigate(['/doctor-dashboard']);
      break;
    case 'PATIENT':
      router.navigate(['/patient-dashboard']);
      break;
    case 'ADMIN':
      router.navigate(['/admin-dashboard']);
      break;
    default:
      router.navigate(['/signin']);
  }
  
  return false;
};