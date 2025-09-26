import api from '@/lib/axios';
import { PatientCreate, PatientUpdate, PatientResponse } from '@/types/patient';

// Lấy danh sách bệnh nhân (phân trang)
export async function getPatients(skip: number = 0, limit: number = 100, search: string|null = null): Promise<PatientResponse[]> {
    try {
        const params = search ? { skip, limit, search } : { skip, limit };
        const response = await api.get('/patients', {
            params: params,
        });
        console.log("Fetched patients:", response.data);
        return response.data.data;
    } catch (error) {
        throw new Error('Failed to fetch patients');
    }
}

// Lấy thông tin một bệnh nhân theo ID
export async function getPatientById(patientId: string): Promise<PatientResponse> {
    try {
        const response = await api.get(`/patients/${patientId}`);
        return response.data.data;
    } catch (error: any) {
        if (error.response?.status === 404) {
            throw new Error('Patient not found');
        }
        throw new Error('Failed to fetch patient');
    }
}

// Tạo bệnh nhân mới
export async function createPatient(patientData: PatientCreate): Promise<PatientResponse> {
    try {
        const response = await api.post('/patients/', patientData);
        return response.data.data;
    } catch (error: any) {
        if (error.response?.status === 400) {
            throw new Error(error.response.data.detail || 'Invalid patient data');
        }
        throw new Error('Failed to create patient');
    }
}

// Cập nhật bệnh nhân
export async function updatePatient(patientId: string, patientData: PatientUpdate): Promise<PatientResponse> {
    try {
        const response = await api.put(`/patients/${patientId}`, patientData);
        return response.data.data;
    } catch (error: any) {
        if (error.response?.status === 404) {
            throw new Error('Patient not found');
        }
        throw new Error('Failed to update patient');
    }
}

// Xóa bệnh nhân (soft delete)
export async function deletePatient(patientId: string): Promise<void> {
    try {
        await api.delete(`/patients/${patientId}`);
    } catch (error: any) {
        if (error.response?.status === 404) {
            throw new Error('Patient not found');
        }
        throw new Error('Failed to delete patient');
    }
}