import { PatientFK } from "./patient";
import { UserFK } from "./user";

export interface Appointment {
    id: string;
    patient_id: string;
    doctor_id: string;
    created_by: string;
    appointment_date: string;
    time_slot: string;
    status: 'SCHEDULED' | 'WAITING' | 'COMPLETED' | 'CANCELLED' | null;
}

export interface AppointmentResponse {
    id: string;
    patient_id: string;
    patient: PatientFK;
    doctor_id: string;
    doctor: UserFK;
    created_by: string;
    appointment_date: string;
    time_slot: string;
    status: 'SCHEDULED' | 'WAITING' | 'COMPLETED' | 'CANCELLED' | null;
}

export interface AppointmentCreate {
    patient_id: string;
    doctor_id: string;
    created_by: string;
    appointment_date: string;
    time_slot: string;
    status: 'SCHEDULED' | 'WAITING' | 'COMPLETED' | 'CANCELLED' | null;
}

export interface AppointmentUpdate {
    // patient_id: string;
    doctor_id?: string;
    // created_by: string;
    appointment_date?: string;
    time_slot?: string;
    status?: 'SCHEDULED' | 'WAITING' | 'COMPLETED' | 'CANCELLED' | null;
}