import Cookies from 'js-cookie';
import http from "@/lib/axios"
import {
    LoginBodyType,
    LoginResType,
} from '@/schemaValidations/auth.schema'
import { CurrentUserResType } from "@/schemaValidations/user.schema";

const authApiRequest = {
    login: (body: LoginBodyType) => http.post<LoginResType>('/auth/login', body),
    getCurrentUser: () =>  http.get<CurrentUserResType>("/auth/me"),
    logout: () => {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        Cookies.remove('role')
    }
};

export default authApiRequest