import api from '@/lib/axios';
import { UserCreate, UserUpdate, UserResponse, DoctorResponse } from '@/types/user';

// Lấy danh sách người dùng (phân trang)
export async function getUsers(skip: number = 0, limit: number = 100): Promise<UserResponse[]> {
    try {
        const response = await api.get('/users', {
            params: { skip, limit },
        });
        console.log("Fetched users:", response.data);
        return response.data.data;
    } catch (error) {
        throw new Error('Failed to fetch users');
    }
}

// Lấy thông tin một người dùng theo ID
export async function getUserById(userId: string): Promise<UserResponse> {
    try {
        const response = await api.get(`/users/${userId}`);
        return response.data.data;
    } catch (error: any) {
        if (error.response?.status === 404) {
            throw new Error('User not found');
        }
        throw new Error('Failed to fetch user');
    }
}

// Tạo người dùng mới
export async function createUser(userData: UserCreate): Promise<UserResponse> {
    try {
        const response = await api.post('/users/', userData);
        return response.data.data;
    } catch (error: any) {
        if (error.response?.status === 400) {
            throw new Error(error.response.data.detail || 'Invalid user data');
        }
        throw new Error('Failed to create user');
    }
}

// Cập nhật người dùng
export async function updateUser(userId: string, userData: UserUpdate): Promise<UserResponse> {
    try {
        const response = await api.put(`/users/${userId}`, userData);
        return response.data.data;
    } catch (error: any) {
        if (error.response?.status === 404) {
            throw new Error('User not found');
        }
        throw new Error('Failed to update user');
    }
}

// Xóa người dùng (soft delete)
export async function deleteUser(userId: string): Promise<void> {
    try {
        await api.delete(`/users/${userId}`);
    } catch (error: any) {
        if (error.response?.status === 404) {
            throw new Error('User not found');
        }
        throw new Error('Failed to delete user');
    }
}


/* DOCTORS */

// Lấy danh sách bác sĩ (phân trang)
export async function getDoctors(skip: number = 0, limit: number = 100): Promise<DoctorResponse[]> {
    try {
        const response = await api.get('/doctors', {
            params: { skip, limit },
        });
        console.log("Fetched doctors:", response.data);
        return response.data.data;
    } catch (error) {
        throw new Error('Failed to fetch doctors');
    }
}