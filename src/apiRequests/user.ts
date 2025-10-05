import http from "@/lib/axios"
import { UserListResType, CreateUserBodyType, UpdateUserBodyType, UserDataType } from "@/schemaValidations/user.schema";

const userApiRequest = {
    getList: (
        params: { skip?: number; limit?: number } = { skip: 0, limit: 100 }
    ) => http.get<UserListResType>('/users/', { params }),

    create: (body: CreateUserBodyType) => http.post<UserDataType>("/users/", body),

    update: (id: string, body: UpdateUserBodyType) => http.put<UserDataType>(`/users/${id}`, body),

    delete: (id: string) => http.delete(`/users/${id}`)
};

export default userApiRequest;