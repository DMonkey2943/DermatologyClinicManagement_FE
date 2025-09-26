export interface Patient {
    id: string;
    full_name: string;
    phone_number: string;
    dob?: string | null;
    gender?: 'MALE' | 'FEMALE' | null;
    email?: string;
    address?: string;
}

export interface PatientResponse {
    id: string;
    full_name: string;
    phone_number: string;
    dob?: string | null;
    gender?: 'MALE' | 'FEMALE' | null;
    email?: string;
    address?: string;
}

export interface PatientCreate {
    full_name: string;
    phone_number: string;
    dob?: string | null;
    gender?: 'MALE' | 'FEMALE' | null;
    email?: string;
    address?: string;
}

export interface PatientUpdate {
    full_name?: string;
    phone_number?: string;
    dob?: string | null;
    gender?: 'MALE' | 'FEMALE' | null;
    email?: string;
    address?: string;
}