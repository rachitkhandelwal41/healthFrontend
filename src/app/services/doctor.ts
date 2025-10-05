// app/services/doctor.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Doctor, CreateDoctorRequest, UpdateDoctorRequest, DoctorResponse } from '../models/doctor';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private baseUrl = 'https://healthcare-backend-eight.vercel.app/api/v1';

  constructor(private http: HttpClient) {}

  getAllDoctors(): Observable<Doctor[]> {
    return this.http.get<any>(`${this.baseUrl}/doctors/available`, {
      withCredentials: true
    }).pipe(
      map(response => {
        // Backend returns: { success: true, data: [...] }
        if (response && response.data && Array.isArray(response.data)) {
          // Map backend field names to frontend model
          return response.data.map((doctor: any) => ({
            _id: doctor.doctor_id || doctor._id,
            name: doctor.name,
            email: doctor.email || '',
            phone: doctor.phone || '',
            specialization: doctor.specialization,
            deptName: doctor.department || doctor.deptName,
            availability: doctor.availability
          }));
        }
        // Fallback: if response is already an array
        if (Array.isArray(response)) {
          return response;
        }
        // Last resort: return empty array
        return [];
      })
    );
  }

  createDoctor(data: CreateDoctorRequest): Observable<DoctorResponse> {
    return this.http.post<DoctorResponse>(`${this.baseUrl}/admin/doctors`, data, {
      withCredentials: true
    });
  }

  updateDoctor(doctorId: string, data: UpdateDoctorRequest): Observable<DoctorResponse> {
    return this.http.put<DoctorResponse>(`${this.baseUrl}/admin/doctors/${doctorId}`, data, {
      withCredentials: true
    });
  }

  deleteDoctor(doctorId: string): Observable<DoctorResponse> {
    return this.http.delete<DoctorResponse>(`${this.baseUrl}/admin/doctors/${doctorId}`, {
      withCredentials: true
    });
  }

  // Fetch all patients for minimal listing in doctor dashboard
  getAllPatients(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/patient`, {
      withCredentials: true
    }).pipe(
      map(response => {
        if (response && Array.isArray(response.data)) {
          return response.data;
        }
        if (Array.isArray(response)) {
          return response;
        }
        return [];
      })
    );
  }

  // Fetch all appointments related to the logged-in doctor
  getDoctorAppointments(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/doctors/appointment`, {
      withCredentials: true
    }).pipe(
      map(response => {
        if (response && Array.isArray(response.data)) {
          return response.data;
        }
        if (Array.isArray(response)) {
          return response;
        }
        return [];
      })
    );
  }
}