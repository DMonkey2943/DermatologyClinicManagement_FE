import http from "@/lib/axios"
import { ServiceListResType, CreateServiceBodyType, UpdateServiceBodyType, ServiceDataType } from "@/schemaValidations/service.schema";

const prefix = 'services';

const serviceApiRequest = {
    getList: (
        params: { skip?: number; limit?: number } = { skip: 0, limit: 100 }
    ) => http.get<ServiceListResType>(`/${prefix}/`, { params }),

    create: (body: CreateServiceBodyType) => http.post<ServiceDataType>(`/${prefix}/`, body),

    update: (id: string, body: UpdateServiceBodyType) => http.put<ServiceDataType>(`/${prefix}/${id}`, body),

    delete: (id: string) => http.delete(`/${prefix}/${id}`)
};

export default serviceApiRequest;