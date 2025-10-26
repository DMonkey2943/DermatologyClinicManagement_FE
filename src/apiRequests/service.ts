import http from "@/lib/axios"
import { ServiceListResType, CreateServiceBodyType, UpdateServiceBodyType, ServiceDataType } from "@/schemaValidations/service.schema";

const prefix = 'services';

const serviceApiRequest = {
    getList: (
        params: { skip?: number; limit?: number; q?: string } = { skip: 0, limit: 100, q: '' }
    ) => http.get<ServiceListResType>(`/${prefix}/`, { params }),

    create: (body: CreateServiceBodyType) => http.post<ServiceDataType>(`/${prefix}/`, body),

    update: (id: string, body: UpdateServiceBodyType) => http.put<ServiceDataType>(`/${prefix}/${id}`, body),

    delete: (id: string) => http.delete(`/${prefix}/${id}`)
};

export default serviceApiRequest;