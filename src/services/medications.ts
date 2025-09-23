import api from '@/lib/axios';
import { MedicationCreate, MedicationUpdate, MedicationResponse } from '@/types/medication';

// Lấy danh sách thuốc (phân trang)
export async function getMedications(skip: number = 0, limit: number = 100): Promise<MedicationResponse[]> {
    try {
        const response = await api.get('/medications', {
            params: { skip, limit },
        });
        console.log("Fetched medications:", response.data);
        return response.data.data;
    } catch (error) {
        throw new Error('Failed to fetch users');
    }
}

// Lấy thông tin thuốc theo ID
export async function getMedicationById(medicationId: string): Promise<MedicationResponse> {
    try {
        const response = await api.get(`/medications/${medicationId}`);
        return response.data.data;
    } catch (error: any) {
        if (error.response?.status === 404) {
            throw new Error('User not found');
        }
        throw new Error('Failed to fetch medication');
    }
}

// Tạo thuốc mới
export async function createMedication(medicationData: MedicationCreate): Promise<MedicationResponse> {
    try {
        const response = await api.post('/medications/', medicationData);
        return response.data.data;
    } catch (error: any) {
        if (error.response?.status === 400) {
            throw new Error(error.response.data.detail || 'Invalid medication data');
        }
        throw new Error('Failed to create medication');
    }
}

// Cập nhật thuốc
export async function updateMedication(medicationId: string, medicationData: MedicationUpdate): Promise<MedicationResponse> {
    try {
        const response = await api.put(`/medications/${medicationId}`, medicationData);
        return response.data.data;
    } catch (error: any) {
        if (error.response?.status === 404) {
            throw new Error('Medication not found');
        }
        throw new Error('Failed to update Medication');
    }
}

// Xóa thuốc (soft delete)
export async function deleteMedication(medicationId: string): Promise<void> {
    try {
        await api.delete(`/medications/${medicationId}`);
    } catch (error: any) {
        if (error.response?.status === 404) {
            throw new Error('Medication not found');
        }
        throw new Error('Failed to delete Medication');
    }
}