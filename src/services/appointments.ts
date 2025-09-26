import api from '@/lib/axios';
import { AppointmentCreate, AppointmentUpdate, AppointmentResponse } from '@/types/appointment';

// Lấy danh sách lịch hẹn (phân trang)
export async function getAppointments(skip: number = 0, limit: number = 100): Promise<AppointmentResponse[]> {
    try {
        const response = await api.get('/appointments', {
            params: { skip, limit },
        });
        console.log("Fetched appointments:", response.data);
        return response.data.data;
    } catch (error) {
        throw new Error('Failed to fetch appointments');
    }
}

// Lấy thông tin một lịch hẹn theo ID
export async function getAppointmentById(appointmentId: string): Promise<AppointmentResponse> {
    try {
        const response = await api.get(`/appointments/${appointmentId}`);
        return response.data.data;
    } catch (error: any) {
        if (error.response?.status === 404) {
            throw new Error('Appointment not found');
        }
        throw new Error('Failed to fetch appointment');
    }
}

// Tạo lịch hẹn mới
export async function createAppointment(appointmentData: AppointmentCreate): Promise<AppointmentResponse> {
    try {
        const response = await api.post('/appointments/', appointmentData);
        return response.data.data;
    } catch (error: any) {
        if (error.response?.status === 400) {
            throw new Error(error.response.data.detail || 'Invalid appointment data');
        }
        throw new Error('Failed to create appointment');
    }
}

// Cập nhật lịch hẹn
export async function updateAppointment(appointmentId: string, appointmentData: AppointmentUpdate): Promise<AppointmentResponse> {
    try {
        const response = await api.put(`/appointments/${appointmentId}`, appointmentData);
        return response.data.data;
    } catch (error: any) {
        if (error.response?.status === 404) {
            throw new Error('Appointment not found');
        }
        throw new Error('Failed to update appointment');
    }
}

// Xóa lịch hẹn (soft delete)
// export async function deleteAppointment(appointmentId: string): Promise<void> {
//     try {
//         await api.delete(`/appointments/${appointmentId}`);
//     } catch (error: any) {
//         if (error.response?.status === 404) {
//             throw new Error('Appointment not found');
//         }
//         throw new Error('Failed to delete appointment');
//     }
// }