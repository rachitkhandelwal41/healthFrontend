// app/models/department.ts

export interface Department {
  dept_id: string;
  name: string;
}

export interface CreateDepartmentRequest {
  name: string;
}

export interface UpdateDepartmentRequest {
  name: string;
}

export interface DepartmentResponse {
  success: boolean;
  message: string;
  department?: Department;
}