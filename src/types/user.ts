export interface UserLogin {
    username: string;  // Hoặc email, tùy backend
    password: string;
}

export interface User {
    id: string;
    username: string;
    full_name: string;
    phone_number: string;
    email: string;
    role: string;
}

export interface UserResponse {
    id: string;
    username: string;
    full_name: string;
    email: string;
    phone_number: string;
    role: 'ADMIN' | 'DOCTOR' | 'STAFF';
}

export interface UserCreate {
    username: string;
    full_name: string;
    email: string;
    phone_number: string;
    password: string;
    role?: 'ADMIN' | 'DOCTOR' | 'STAFF'; // Optional, tùy backend
}

export interface UserUpdate {
    username?: string;
    full_name?: string;
    email?: string;
    phone_number?: string;
    role?: 'ADMIN' | 'DOCTOR' | 'STAFF';
    is_active?: boolean;
}