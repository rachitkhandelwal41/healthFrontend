# HealthFrontend - Healthcare Management System

A comprehensive healthcare management system built with Angular 20, featuring role-based authentication and appointment booking functionality for patients, doctors, and administrators.

## Tech Stack

### Frontend Technologies
**Angular 20.3.0** - Modern web framework with standalone components
**TypeScript 5.9.2** - Type-safe JavaScript development
**TailwindCSS 4.1.14** - Utility-first CSS framework

## Screen Shots

### Admin Dashboard
<img width="1512" height="831" alt="Screenshot 2025-10-05 at 6 40 33 PM" src="https://github.com/user-attachments/assets/59d12633-3037-435b-92f2-77093a8cb868" />
<img width="676" height="582" alt="Screenshot 2025-10-05 at 6 40 48 PM" src="https://github.com/user-attachments/assets/5c3485d6-e631-49e9-8c6c-db76ce8cf886" />

### Doctor Dashboard
<img width="1512" height="830" alt="Screenshot 2025-10-05 at 6 42 03 PM" src="https://github.com/user-attachments/assets/5641bc52-9429-4efe-acaf-6727cc5a6aec" />
<img width="1512" height="831" alt="Screenshot 2025-10-05 at 6 42 12 PM" src="https://github.com/user-attachments/assets/6e0c005c-7928-4b88-b621-2daa6ae37de1" />
<img width="1512" height="833" alt="Screenshot 2025-10-05 at 6 42 24 PM" src="https://github.com/user-attachments/assets/5140dfe4-f3b5-4c64-9680-a8dffb1bed5d" />

### Patient Dashboard
<img width="1289" height="747" alt="Screenshot 2025-10-05 at 6 44 20 PM" src="https://github.com/user-attachments/assets/e64159f4-30bf-4547-b2be-d233920db59e" />
<img width="1290" height="769" alt="Screenshot 2025-10-05 at 6 45 02 PM" src="https://github.com/user-attachments/assets/607ff398-f7c8-49e3-93a7-66309f275843" />

## API Endpoints

### Authentication Endpoints
**Base URL:** `https://healthcare-backend-eight.vercel.app/api/v1`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/signup` | User registration | No |
| POST | `/signin` | User login | No |
| POST | `/logout` | User logout | Yes |
| POST | `/refresh` | Token refresh | Yes |

### Patient Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/patient/departments` | Get all departments | Yes (PATIENT) |
| GET | `/patient/appointment` | Get patient appointments | Yes (PATIENT) |

### Doctor Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/doctors` | Get doctors with filters | Yes |
| GET | `/doctors/available` | Get available doctors | Yes |
| GET | `/doctors/:id` | Get specific doctor | Yes |
| GET | `/doctors/appointment` | Get doctor appointments | Yes (DOCTOR) |
| GET | `/appointments/slots/:doctor_id` | Get available slots | Yes |

### Admin Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/admin/dashboard` | Admin dashboard data | Yes (ADMIN) |
| GET | `/admin/departments` | Get all departments | Yes (ADMIN) |
| POST | `/admin/departments` | Create department | Yes (ADMIN) |
| PUT | `/admin/departments/:id` | Update department | Yes (ADMIN) |
| DELETE | `/admin/departments/:id` | Delete department | Yes (ADMIN) |
| GET | `/admin/doctors` | Get all doctors | Yes (ADMIN) |
| POST | `/admin/doctors` | Create doctor | Yes (ADMIN) |
| PUT | `/admin/doctors/:doctorId` | Update doctor | Yes (ADMIN) |
| DELETE | `/admin/doctors/:doctorId` | Delete doctor | Yes (ADMIN) |

### Appointment Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/appointments/book` | Book appointment | Yes |
| PATCH | `/appointments/:appointment_id/cancel` | Cancel appointment | Yes |

## Authentication & Authorization

### Authentication Type
**JWT-based authentication** with HTTP-only cookies
**Role-based access control** (RBAC) with three user roles:
`PATIENT` - Can book appointments and view their appointments
`DOCTOR` - Can view patients and their appointments
`ADMIN` - Full CRUD access to departments and doctors

### Security Features
**HTTP Interceptor** automatically includes credentials for API calls
**Route Guards** protect routes based on authentication status and user roles
**Local Storage** for persisting user session and role information
**Automatic logout** on token expiration or invalid credentials

## Component Architecture

### Core Components

#### 1. Authentication Components
**SigninComponent** - User login with email/password validation
**SignupComponent** - User registration with form validation
**Profile** - User profile management (lazy-loaded)

#### 2. Dashboard Components

**PatientDashboardComponent**
Department selection and doctor browsing
Appointment booking with time slot selection
Personal appointment management
Real-time availability checking

**DoctorDashboardComponent**
Patient overview and management
Appointment viewing and management
Tab-based navigation for different views

**AdminDashboardComponent**
Complete CRUD operations for departments
Complete CRUD operations for doctors
Modal-based forms for data management
Real-time data updates

### Component Features
**Standalone Components** - Modern Angular architecture
**Reactive Forms** - Form validation and data binding
**Modal Dialogs** - User-friendly data entry interfaces
**Tab Navigation** - Organized content presentation
**Loading States** - User feedback during API operations

## Angular Concepts Leveraged

### 1. Modern Angular Features
**Standalone Components** - No NgModules required
**Functional Route Guards** - Modern guard implementation
**HTTP Interceptors** - Automatic request/response handling
**Dependency Injection** - Service-based architecture
**Reactive Programming** - RxJS observables for async operations

### 2. State Management
**Service-based State** - Centralized data management
**Local Storage** - Persistent user session
**Reactive Forms** - Form state management
**Component Communication** - Parent-child data flow

### 3. Routing & Navigation
**Lazy Loading** - Performance optimization
**Route Guards** - Access control
**Route Data** - Role-based routing
**Wildcard Routes** - Fallback handling

### 4. UI/UX Features
**Responsive Design** - Mobile-first approach with TailwindCSS
**Toast Notifications** - User feedback system
**Loading Indicators** - Progress feedback
**Error Handling** - Graceful error management

## Getting Started

### Prerequisites
Node.js (v18 or higher)
npm or yarn package manager
Angular CLI

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd healthFrontend

# Install dependencies
npm install

# Start development server
npm start
# or
ng serve
```

### Development Commands
```bash
# Development server
ng serve

# Build for production
ng build
```

## Future Course Work

### 1. Modular Appointment Systems
**Advanced Scheduling** - Recurring appointments, bulk booking
**Appointment Types** - Different consultation types (consultation, follow-up, emergency)
**Waitlist Management** - Automatic notification when slots become available
**Calendar Integration** - Sync with external calendar systems
**Appointment Reminders** - SMS/Email notifications

### 2. Dynamic Doctor Availability
**Real-time Availability** - Live updates when doctors change schedules
**Flexible Time Slots** - Customizable appointment durations
**Break Management** - Doctor break times and lunch hours
**Holiday Scheduling** - Automatic holiday detection and blocking
**Emergency Override** - Ability to book emergency appointments outside normal hours

### 3. Enhanced Features
**Video Consultations** - Integrated telemedicine capabilities
**Medical Records** - Digital health records management
**Prescription Management** - Digital prescription system
**Payment Integration** - Online payment processing
**Multi-language Support** - Internationalization (i18n)
**Advanced Analytics** - Dashboard with appointment statistics
**Mobile App** - React Native or Flutter mobile application
**Push Notifications** - Real-time updates and reminders

### 4. Technical Improvements
**State Management** - NgRx for complex state management
**PWA Features** - Progressive Web App capabilities
**Offline Support** - Service workers for offline functionality
**Performance Optimization** - Lazy loading, code splitting
**Testing Coverage** - Comprehensive unit and e2e tests
**CI/CD Pipeline** - Automated deployment and testing

### 5. Security Enhancements
**Two-Factor Authentication** - Enhanced security for sensitive operations
**Audit Logging** - Track all user actions and system changes
**Data Encryption** - End-to-end encryption for sensitive data
**GDPR Compliance** - Data protection and privacy features
**Role-based Permissions** - Granular permission system

## Project Structure

```
src/
├── app/
│   ├── components/          # Feature components
│   │   ├── admin-dashboard/
│   │   ├── doctor-dashboard/
│   │   ├── patient-dashboard/
│   │   ├── signin/
│   │   ├── signup/
│   │   └── profile/
│   ├── guards/              # Route guards
│   ├── interceptors/        # HTTP interceptors
│   ├── models/              # TypeScript interfaces
│   ├── services/            # Business logic services
│   ├── app.config.ts        # Application configuration
│   ├── app.routes.ts        # Routing configuration
│   └── app.ts               # Root component
├── styles.css               # Global styles
└── main.ts                  # Application entry point
```

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
