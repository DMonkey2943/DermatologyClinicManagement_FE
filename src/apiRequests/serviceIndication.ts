import http from "@/lib/axios"
import { CreateServiceIndicationBodyType, ServiceIndicationFullResType, UpdateServiceIndicationBodyType } from "@/schemaValidations/serviceIndication.schema";

const prefix = 'service-indications';

const serviceIndicationApiRequest = {
    // getList: (
    //     params: { skip?: number; limit?: number, doctor_id?: string, patient_id?:string } = { skip: 0, limit: 100 }
    // ) => http.get<MedicalRecordListResType>(`/${prefix}/`, { params }),

    create: (body: CreateServiceIndicationBodyType) => http.post<ServiceIndicationFullResType>(`/${prefix}/`, body),
    update: (id: string, body: UpdateServiceIndicationBodyType) => http.put<ServiceIndicationFullResType>(`/${prefix}/${id}`, body),
};

export default serviceIndicationApiRequest;