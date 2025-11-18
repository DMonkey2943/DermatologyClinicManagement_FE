// src/apiRequests/patientAuth.ts
import http from '@/lib/axios';
import { PatientResType } from '@/schemaValidations/patient.schema';
import Cookies from 'js-cookie';
import {
    PatientLoginBodyType,
    PatientLoginResType,
} from '@/schemaValidations/auth.schema'

const patientAuthApiRequest = {
    login: (body: PatientLoginBodyType) =>
        http.post<PatientLoginResType>('/patient-auth/login', body),

    // register: (body: { full_name: string; phone_number: string; password: string }) =>
    //     http.post('/patient-auth/register', body),

    getCurrentPatient: () =>
        http.get<PatientResType>('/patient-auth/me'),

    logout: () => {
        Cookies.remove('patient_access_token');
    },
};

export default patientAuthApiRequest;