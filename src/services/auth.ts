import api from '@/lib/axios';
import Cookies from 'js-cookie';
import { User, UserLogin } from '@/types/user';

export async function login(userData: UserLogin): Promise<User> {
    try {
        const { data } = await api.post('/auth/login', userData);
        Cookies.set('access_token', data.access_token, { expires: 6 / 24, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });  // Expires sau 6 giờ
        Cookies.set('refresh_token', data.refresh_token, { expires: 30, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });  // Expires sau 30 ngày
        return data.user;
    } catch (error) {
        throw new Error('Invalid credentials');
    }
}

export async function getCurrentUser(): Promise<User | null> {
    try {
        const { data } = await api.get('/auth/me');
        return data;
    } catch (error) {
        return null;
    }
}

export function logout() {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    // window.location.href = '/auth/login';
}