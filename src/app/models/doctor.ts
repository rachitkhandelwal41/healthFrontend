// app/models/doctor.ts

export interface Doctor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  deptName: string;
  availability: string;
  availableSlots: number[];
}

export interface CreateDoctorRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  specialization: string;
  deptName: string;
  availability: string;
}

export interface UpdateDoctorRequest {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  specialization?: string;
  deptName?: string;
  availability?: string;
}

export interface DoctorResponse {
  success: boolean;
  message: string;
  doctor?: Doctor;
}