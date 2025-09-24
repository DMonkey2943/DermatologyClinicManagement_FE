import api from '@/lib/axios';
import { ServiceCreate, ServiceUpdate, ServiceResponse } from '@/types/service';

// Lấy danh sách dịch vụ (phân trang)
export async function getServices(skip: number = 0, limit: number = 100): Promise<ServiceResponse[]> {
    try {
        const response = await api.get('/services', {
            params: { skip, limit },
        });
        console.log("Fetched services:", response.data);
        return response.data.data;
    } catch (error) {
        throw new Error('Failed to fetch services');
    }
}

// Lấy thông tin dịch vụ theo ID
export async function getServiceById(serviceId: string): Promise<ServiceResponse> {
    try {
        const response = await api.get(`/services/${serviceId}`);
        return response.data.data;
    } catch (error: any) {
        if (error.response?.status === 404) {
            throw new Error('Service not found');
        }
        throw new Error('Failed to fetch service');
    }
}

// Tạo dịch vụ mới
export async function createService(serviceData: ServiceCreate): Promise<ServiceResponse> {
    try {
        const response = await api.post('/services/', serviceData);
        return response.data.data;
    } catch (error: any) {
        if (error.response?.status === 400) {
            throw new Error(error.response.data.detail || 'Invalid service data');
        }
        throw new Error('Failed to create service');
    }
}

// Cập nhật dịch vụ
export async function updateService(serviceId: string, serviceData: ServiceUpdate): Promise<ServiceResponse> {
    try {
        const response = await api.put(`/services/${serviceId}`, serviceData);
        return response.data.data;
    } catch (error: any) {
        if (error.response?.status === 404) {
            throw new Error('Service not found');
        }
        throw new Error('Failed to update Service');
    }
}

// Xóa dịch vụ (soft delete)
export async function deleteService(serviceId: string): Promise<void> {
    try {
        await api.delete(`/services/${serviceId}`);
    } catch (error: any) {
        if (error.response?.status === 404) {
            throw new Error('Service not found');
        }
        throw new Error('Failed to delete Service');
    }
}