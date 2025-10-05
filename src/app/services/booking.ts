import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Department {
  dept_id: string;
  name: string;
}

export interface Doctor {
  doctor_id: string;
  _id?: string;
  name: string;
  specialization: string;
  department: string;
  availability: string;
}

export interface Appointment {
  _id: string;
  doctorId: string;
  patientId: string;
  date: string;
  slot: number;
  time?: string;
  status: string;
  createdAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private baseUrl = 'https://healthcare-backend-eight.vercel.app/api/v1';

  constructor(private http: HttpClient) {}

  getDepartments(): Observable<Department[]> {
    return this.http.get<any>(`${this.baseUrl}/patient/departments`, {
      withCredentials: true
    }).pipe(
      map(response => {
        if (response && response.data && Array.isArray(response.data)) {
          return response.data.map((dept: any) => ({
            dept_id: dept.dept_id || dept._id,
            name: dept.name
          }));
        }
        return response.data || response.departments || [];
      })
    );
  }

  getAvailableDoctors(specialization?: string, date?: string): Observable<Doctor[]> {
    let url = `${this.baseUrl}/patient/available`;
    if (specialization) url += `specialization=${encodeURIComponent(specialization)}&`;
    if (date) url += `date=${date}`;
    
    return this.http.get<any>(url, {
      withCredentials: true
    }).pipe(
      map(response => {
        if (response && response.data && Array.isArray(response.data)) {
          return response.data.map((doctor: any) => ({
            doctor_id: doctor.doctor_id || doctor._id,
            _id: doctor.doctor_id || doctor._id,
            name: doctor.name,
            specialization: doctor.specialization,
            department: doctor.department || doctor.deptName,
            availability: doctor.availability
          }));
        }
        return [];
      })
    );
  }

  bookAppointment(doctorId: string, patientId: string, date: string, slot: number): Observable<ApiResponse<Appointment>> {
    return this.http.post<ApiResponse<Appointment>>(
      `${this.baseUrl}/patient/book`,
      {
        doctor_id: doctorId,
        patient_id: patientId,
        date,
        slot
      },
      { withCredentials: true }
    );
  }

  getMyAppointments(patientId: string): Observable<Appointment[]> {
    return this.http.get<any>(`${this.baseUrl}/patient/appointments/${patientId}`, {
      withCredentials: true
    }).pipe(
      map(response => {
        if (response && response.data && Array.isArray(response.data)) {
          return response.data;
        }
        if (Array.isArray(response)) {
          return response;
        }
        return [];
      })
    );
  }

  cancelAppointment(appointmentId: string): Observable<ApiResponse<any>> {
    return this.http.patch<ApiResponse<any>>(
      `${this.baseUrl}/patient/appointments/${appointmentId}/cancel`,
      {},
      { withCredentials: true }
    );
  }
}