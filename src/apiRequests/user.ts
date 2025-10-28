import http from "@/lib/axios"
import { UserListResType, CreateUserBodyType, UpdateUserBodyType, UserDataType, DoctorListResType, createUserSchemaType } from "@/schemaValidations/user.schema";

const userApiRequest = {
    getList: (
        params: { skip?: number; limit?: number; q?: string } = { skip: 0, limit: 100, q: '' }
    ) => http.get<UserListResType>('/users/', { params }),

    create: (body: CreateUserBodyType) => http.post<UserDataType>("/users/", body),
    
    createWithRHF: (body: CreateUserBodyType) => http.post<UserDataType>("/users/", body),

    update: (id: string, body: UpdateUserBodyType) => http.put<UserDataType>(`/users/${id}`, body),

    delete: (id: string) => http.delete(`/users/${id}`),

    // DOCTORS
    getDoctorList: (
        params: { skip?: number; limit?: number } = { skip: 0, limit: 100 }
    ) => http.get<DoctorListResType>('/doctors/', { params }), 
};

export default userApiRequest;