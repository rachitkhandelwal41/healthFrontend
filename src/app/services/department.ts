// app/services/department.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Department, CreateDepartmentRequest, UpdateDepartmentRequest, DepartmentResponse } from '../models/department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private baseUrl = 'https://healthcare-backend-eight.vercel.app/api/v1';

  constructor(private http: HttpClient) {}

  getAllDepartments(): Observable<Department[]> {
    return this.http.get<any>(`${this.baseUrl}/patient/departments`, {
      withCredentials: true
    }).pipe(
      map(response => {
        // Handle different response formats
        if (Array.isArray(response)) {
          return response;
        }
        // If response is an object, extract the array
        // Common patterns: response.data, response.departments, response.result
        return response.data || response.departments || response.result || [];
      })
    );
  }

  createDepartment(data: CreateDepartmentRequest): Observable<DepartmentResponse> {
    return this.http.post<DepartmentResponse>(`${this.baseUrl}/admin/departments`, data, {
      withCredentials: true
    });
  }

  updateDepartment(deptId: string, data: UpdateDepartmentRequest): Observable<DepartmentResponse> {
    return this.http.put<DepartmentResponse>(`${this.baseUrl}/admin/departments/${deptId}`, data, {
      withCredentials: true
    });
  }

  deleteDepartment(deptId: string): Observable<DepartmentResponse> {
    return this.http.delete<DepartmentResponse>(`${this.baseUrl}/admin/departments/${deptId}`, {
      withCredentials: true
    });
  }
}