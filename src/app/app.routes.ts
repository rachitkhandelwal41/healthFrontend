// app/app.routes.ts

import { Routes } from '@angular/router';
import { SigninComponent } from './components/signin/signin';
import { SignupComponent } from './components/signup/signup';
import { DoctorDashboardComponent } from './components/doctor-dashboard/doctor-dashboard';
import { PatientDashboardComponent } from './components/patient-dashboard/patient-dashboard';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard';
import { Profile } from './components/profile/profile';
import { authGuard } from './guards/auth';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/signin',
    pathMatch: 'full'
  },
  {
    path: 'signin',
    component: SigninComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'doctor-dashboard',
    component: DoctorDashboardComponent,
    canActivate: [authGuard],
    data: { role: 'DOCTOR' }
  },
  {
    path: 'patient-dashboard',
    component: PatientDashboardComponent,
    canActivate: [authGuard],
    data: { role: 'PATIENT' }
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [authGuard],
    data: { role: 'ADMIN' }
  },
  // {
  //   path: 'profile',
  //   loadComponent: () => import('./components/profile/profile').then(m => m.Profile),
  //   canActivate: [authGuard]
  // },
  {
    path: '**',
    redirectTo: '/signin'
  }
];