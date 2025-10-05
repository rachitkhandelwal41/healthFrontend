// app/components/admin-dashboard/admin-dashboard.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { DepartmentService } from '../../services/department';
import { DoctorService } from '../../services/doctor';
import { Department } from '../../models/department';
import { Doctor } from '../../models/doctor';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent implements OnInit {
  userRole: string = '';
  departments: Department[] = [];
  doctors: Doctor[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  // Modal states
  showDepartmentModal: boolean = false;
  showDoctorModal: boolean = false;
  isEditMode: boolean = false;

  // Department form
  departmentForm = {
    dept_id: '',
    name: ''
  };

  // Doctor form
  doctorForm = {
    _id: '',
    name: '',
    email: '',
    password: '',
    phone: '',
    specialization: '',
    deptName: '',
    availability: 'MON-FRI 10am-6pm'
  };

  constructor(
    private authService: AuthService,
    private departmentService: DepartmentService,
    private doctorService: DoctorService
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole() || '';
    this.loadDepartments();
    this.loadDoctors();
  }

  loadDepartments(): void {
    this.isLoading = true;
    this.departmentService.getAllDepartments().subscribe({
      next: (data) => {
        console.log('Departments response:', data); // Debug log
        this.departments = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load departments';
        this.isLoading = false;
        console.error('Error loading departments:', error);
      }
    });
  }

  loadDoctors(): void {
    this.isLoading = true;
    this.doctorService.getAllDoctors().subscribe({
      next: (data) => {
        console.log('Loaded doctors:', data);
        this.doctors = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load doctors';
        this.isLoading = false;
        console.error('Error loading doctors:', error);
      }
    });
  }

  getDoctorsByDepartment(deptName: string): Doctor[] {
    // Safety check: ensure doctors is an array before filtering
    if (!Array.isArray(this.doctors)) {
      console.warn('Doctors is not an array:', this.doctors);
      return [];
    }
    return this.doctors.filter(doctor => doctor.deptName === deptName);
  }

  // Department CRUD operations
  openCreateDepartmentModal(): void {
    this.isEditMode = false;
    this.departmentForm = { dept_id: '', name: '' };
    this.showDepartmentModal = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  openEditDepartmentModal(dept: Department): void {
    this.isEditMode = true;
    this.departmentForm = { dept_id: dept.dept_id, name: dept.name };
    this.showDepartmentModal = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  saveDepartment(): void {
    if (!this.departmentForm.name.trim()) {
      this.errorMessage = 'Department name is required';
      return;
    }

    this.isLoading = true;

    if (this.isEditMode) {
      // Update department
      this.departmentService.updateDepartment(this.departmentForm.dept_id, { name: this.departmentForm.name }).subscribe({
        next: (response) => {
          this.successMessage = response.message || 'Department updated successfully';
          this.loadDepartments();
          this.closeDepartmentModal();
          this.isLoading = false;
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Failed to update department';
          this.isLoading = false;
        }
      });
    } else {
      // Create department
      this.departmentService.createDepartment({ name: this.departmentForm.name }).subscribe({
        next: (response) => {
          this.successMessage = response.message || 'Department created successfully';
          this.loadDepartments();
          this.closeDepartmentModal();
          this.isLoading = false;
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Failed to create department';
          this.isLoading = false;
        }
      });
    }
  }

  deleteDepartment(deptId: string, deptName: string): void {
    if (!confirm(`Are you sure you want to delete ${deptName}?`)) {
      return;
    }

    this.isLoading = true;
    this.departmentService.deleteDepartment(deptId).subscribe({
      next: (response) => {
        this.successMessage = response.message || 'Department deleted successfully';
        this.loadDepartments();
        this.loadDoctors(); // Reload doctors as well
        this.isLoading = false;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to delete department';
        this.isLoading = false;
      }
    });
  }

  closeDepartmentModal(): void {
    this.showDepartmentModal = false;
    this.departmentForm = { dept_id: '', name: '' };
    this.errorMessage = '';
  }

  // Doctor CRUD operations
  openCreateDoctorModal(): void {
    this.isEditMode = false;
    this.doctorForm = {
      _id: '',
      name: '',
      email: '',
      password: '',
      phone: '',
      specialization: '',
      deptName: '',
      availability: 'MON-FRI 10am-6pm'
    };
    this.showDoctorModal = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  openEditDoctorModal(doctor: Doctor): void {
    this.isEditMode = true;
    this.doctorForm = {
      _id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      password: '',
      phone: doctor.phone,
      specialization: doctor.specialization,
      deptName: doctor.deptName,
      availability: doctor.availability
    };
    this.showDoctorModal = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  saveDoctor(): void {
    // Validation
    if (!this.doctorForm.name.trim()) {
      this.errorMessage = 'Doctor name is required';
      return;
    }
    if (!this.doctorForm.email.trim()) {
      this.errorMessage = 'Email is required';
      return;
    }
    if (!this.isEditMode && !this.doctorForm.password.trim()) {
      this.errorMessage = 'Password is required for new doctor';
      return;
    }
    if (!this.doctorForm.phone.trim()) {
      this.errorMessage = 'Phone is required';
      return;
    }
    if (!this.doctorForm.specialization.trim()) {
      this.errorMessage = 'Specialization is required';
      return;
    }
    if (!this.doctorForm.deptName) {
      this.errorMessage = 'Department is required';
      return;
    }

    this.isLoading = true;

    if (this.isEditMode) {
      // Update doctor
      const updateData: any = {
        name: this.doctorForm.name,
        email: this.doctorForm.email,
        phone: this.doctorForm.phone,
        specialization: this.doctorForm.specialization,
        deptName: this.doctorForm.deptName,
        availability: this.doctorForm.availability
      };

      // Only include password if provided
      if (this.doctorForm.password.trim()) {
        updateData.password = this.doctorForm.password;
      }

      this.doctorService.updateDoctor(this.doctorForm._id, updateData).subscribe({
        next: (response) => {
          this.successMessage = response.message || 'Doctor updated successfully';
          this.loadDoctors();
          this.closeDoctorModal();
          this.isLoading = false;
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Failed to update doctor';
          this.isLoading = false;
        }
      });
    } else {
      // Create doctor
      const createData = {
        name: this.doctorForm.name,
        email: this.doctorForm.email,
        password: this.doctorForm.password,
        phone: this.doctorForm.phone,
        specialization: this.doctorForm.specialization,
        deptName: this.doctorForm.deptName,
        availability: this.doctorForm.availability
      };

      this.doctorService.createDoctor(createData).subscribe({
        next: (response) => {
          this.successMessage = response.message || 'Doctor created successfully';
          this.loadDoctors();
          this.closeDoctorModal();
          this.isLoading = false;
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Failed to create doctor';
          this.isLoading = false;
        }
      });
    }
  }

  deleteDoctor(doctorId: string, doctorName: string): void {
    if (!confirm(`Are you sure you want to delete Dr. ${doctorName}?`)) {
      return;
    }

    this.isLoading = true;
    this.doctorService.deleteDoctor(doctorId).subscribe({
      next: (response) => {
        this.successMessage = response.message || 'Doctor deleted successfully';
        this.loadDoctors();
        this.isLoading = false;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to delete doctor';
        this.isLoading = false;
      }
    });
  }

  closeDoctorModal(): void {
    this.showDoctorModal = false;
    this.doctorForm = {
      _id: '',
      name: '',
      email: '',
      password: '',
      phone: '',
      specialization: '',
      deptName: '',
      availability: 'MON-FRI 10am-6pm'
    };
    this.errorMessage = '';
  }

  logout(): void {
    this.authService.logout();
  }
}