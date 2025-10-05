// app/components/doctor-dashboard/doctor-dashboard.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { DoctorService } from '../../services/doctor';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctor-dashboard.html',
  styleUrl: './doctor-dashboard.css'
})
export class DoctorDashboardComponent implements OnInit {
  userRole: string = '';
  activeTab: 'overview' | 'patients' | 'appointments' = 'overview';

  patients: any[] = [];
  appointments: any[] = [];
  patientsLoading: boolean = false;
  appointmentsLoading: boolean = false;

  constructor(private authService: AuthService, private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole() || '';
  }

  logout(): void {
    this.authService.logout();
  }

  selectTab(tab: 'overview' | 'patients' | 'appointments'): void {
    this.activeTab = tab;
    if (tab === 'patients' && this.patients.length === 0 && !this.patientsLoading) {
      this.fetchPatients();
    }
    if (tab === 'appointments' && this.appointments.length === 0 && !this.appointmentsLoading) {
      this.fetchAppointments();
    }
  }

  private fetchPatients(): void {
    this.patientsLoading = true;
    this.doctorService.getAllPatients().subscribe({
      next: (data) => {
        this.patients = Array.isArray(data) ? data : [];
        this.patientsLoading = false;
      },
      error: () => {
        this.patients = [];
        this.patientsLoading = false;
      }
    });
  }

  private fetchAppointments(): void {
    this.appointmentsLoading = true;
    this.doctorService.getDoctorAppointments().subscribe({
      next: (data) => {
        this.appointments = Array.isArray(data) ? data : [];
        this.appointmentsLoading = false;
      },
      error: () => {
        this.appointments = [];
        this.appointmentsLoading = false;
      }
    });
  }
}