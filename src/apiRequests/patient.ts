import http from "@/lib/axios"
import { PatientListResType, CreatePatientBodyType, UpdatePatientBodyType, PatientDataType, PatientResType } from "@/schemaValidations/patient.schema";

const prefix = 'patients';

const patientApiRequest = {
    getList: (
        params: { skip?: number; limit?: number } = { skip: 0, limit: 100 }
    ) => http.get<PatientListResType>(`/${prefix}/`, { params }),

    getDetail: (id: string) => http.get<PatientResType>(`/${prefix}/${id}`),

    create: (body: CreatePatientBodyType) => http.post<PatientDataType>(`/${prefix}/`, body),

    update: (id: string, body: UpdatePatientBodyType) => http.put<PatientDataType>(`/${prefix}/${id}`, body),

    delete: (id: string) => http.delete(`/${prefix}/${id}`)
};

export default patientApiRequest;