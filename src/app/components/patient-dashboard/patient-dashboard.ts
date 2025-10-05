import { Component, OnInit } from '@angular/core';
import { BookingService, Department, Doctor, Appointment } from './../../services/booking';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.html',
  styleUrls: ['./patient-dashboard.css'],
  imports: [FormsModule,CommonModule],
})
export class PatientDashboardComponent implements OnInit {
  departments: Department[] = [];
  doctors: Doctor[] = [];
  myAppointments: Appointment[] = [];
  
  selectedDepartment: string = '';
  selectedDate: string = '';
  selectedDoctor: Doctor | null = null;
  selectedSlot: number | null = null;
  
  patientId: string = '';
  loading = false;
  loadingDoctors = false;
  error = '';
  success = '';
  
  slots = [
    { value: 0, time: '9:00 AM' },
    { value: 1, time: '10:00 AM' },
    { value: 2, time: '11:00 AM' },
    { value: 3, time: '12:00 PM' },
    { value: 4, time: '2:00 PM' },
    { value: 5, time: '3:00 PM' },
    { value: 6, time: '4:00 PM' },
    { value: 7, time: '5:00 PM' }
  ];

  activeTab: 'book' | 'appointments' = 'book';

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    // Get patientId from localStorage or auth service
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.patientId = user.userId || user._id || user.id;
    
    if (!this.patientId) {
      this.error = 'Please login to continue';
      return;
    }
    
    this.loadDepartments();
    this.loadMyAppointments();
    this.setMinDate();
  }

  setMinDate(): void {
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0];
  }

  loadDepartments(): void {
    this.bookingService.getDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
        console.log('Departments loaded:', departments);
      },
      error: (err) => {
        console.error('Error loading departments:', err);
        this.error = 'Failed to load departments';
      }
    });
  }

  onDepartmentChange(): void {
    this.doctors = [];
    this.selectedDoctor = null;
    this.selectedSlot = null;
    this.error = '';
    
    if (this.selectedDepartment && this.selectedDate) {
      this.searchDoctors();
    }
  }

  onDateChange(): void {
    this.error = '';
    if (this.selectedDepartment && this.selectedDate) {
      this.searchDoctors();
    }
  }

  searchDoctors(): void {
    this.loadingDoctors = true;
    this.error = '';
    this.doctors = [];
    
    console.log('Searching doctors:', {
      department: this.selectedDepartment,
      date: this.selectedDate
    });
    
    this.bookingService.getAvailableDoctors(this.selectedDepartment, this.selectedDate).subscribe({
      next: (doctors) => {
        this.loadingDoctors = false;
        this.doctors = doctors;
        console.log('Doctors loaded:', doctors);
        
        if (this.doctors.length === 0) {
          this.error = 'No doctors available for selected department and date';
        }
      },
      error: (err) => {
        this.loadingDoctors = false;
        console.error('Error loading doctors:', err);
        this.error = err.error?.error?.message || 'Failed to load doctors';
      }
    });
  }

  selectDoctor(doctor: Doctor): void {
    this.selectedDoctor = doctor;
    this.selectedSlot = null;
    this.error = '';
  }

  selectSlot(slot: number): void {
    this.selectedSlot = slot;
  }

  bookAppointment(): void {
    if (!this.selectedDoctor || this.selectedSlot === null || !this.selectedDate) {
      this.error = 'Please select doctor, date and time slot';
      return;
    }

    if (!this.patientId) {
      this.error = 'Patient ID not found. Please login again.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    const doctorId = this.selectedDoctor.doctor_id || this.selectedDoctor._id;
    
    console.log('Booking appointment:', {
      doctorId,
      patientId: this.patientId,
      date: this.selectedDate,
      slot: this.selectedSlot
    });

    this.bookingService.bookAppointment(
      doctorId!,
      this.patientId,
      this.selectedDate,
      this.selectedSlot
    ).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Booking response:', response);
        
        if (response.success) {
          this.success = 'Appointment booked successfully!';
          this.loadMyAppointments();
          this.resetBookingForm();
          
          setTimeout(() => {
            this.success = '';
            this.switchTab('appointments');
          }, 2000);
        } else {
          this.error = response.error?.message || 'Failed to book appointment';
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Booking error:', err);
        this.error = err.error?.error?.message || err.error?.message || 'Failed to book appointment';
      }
    });
  }

  resetBookingForm(): void {
    this.selectedDoctor = null;
    this.selectedSlot = null;
    this.doctors = [];
  }

  loadMyAppointments(): void {
    if (!this.patientId) return;
    
    console.log('Loading appointments for patient:', this.patientId);
    
    this.bookingService.getMyAppointments(this.patientId).subscribe({
      next: (appointments) => {
        this.myAppointments = appointments;
        console.log('Appointments loaded:', appointments);
      },
      error: (err) => {
        console.error('Error loading appointments:', err);
      }
    });
  }

  cancelAppointment(appointmentId: string): void {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';
    
    console.log('Cancelling appointment:', appointmentId);

    this.bookingService.cancelAppointment(appointmentId).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Cancel response:', response);
        
        if (response.success) {
          this.success = 'Appointment cancelled successfully';
          this.loadMyAppointments();
          setTimeout(() => this.success = '', 3000);
        } else {
          this.error = response.error?.message || 'Failed to cancel appointment';
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Cancel error:', err);
        this.error = err.error?.error?.message || err.error?.message || 'Failed to cancel appointment';
      }
    });
  }

  switchTab(tab: 'book' | 'appointments'): void {
    this.activeTab = tab;
    this.error = '';
    this.success = '';
    
    if (tab === 'appointments') {
      this.loadMyAppointments();
    }
  }

  getSlotTime(slot: number): string {
    const slotObj = this.slots.find(s => s.value === slot);
    return slotObj ? slotObj.time : '';
  }
}