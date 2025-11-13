import http from "@/lib/axios"
import { PatientListResType, CreatePatientBodyType, UpdatePatientBodyType, PatientDataType, PatientResType } from "@/schemaValidations/patient.schema";

const prefix = 'patients';

const patientApiRequest = {
    getList: (
        params: { skip?: number; limit?: number; q?: string } = { skip: 0, limit: 100, q: '' }
    ) => http.get<PatientListResType>(`/${prefix}/`, { params }),

    getDetail: (id: string) => http.get<PatientResType>(`/${prefix}/${id}`),

    create: (body: CreatePatientBodyType) => http.post<PatientDataType>(`/${prefix}/`, body),

    update: (id: string, body: UpdatePatientBodyType) => http.put<PatientDataType>(`/${prefix}/${id}`, body),

    delete: (id: string) => http.delete(`/${prefix}/${id}`),

    getList_SCR: (
        params: { skip?: number; limit?: number } = { skip: 0, limit: 100 },
        options: { headers?: Record<string, string> } = {}
    ) => http.get<PatientListResType>(`/${prefix}/`, { params, headers: options.headers }),

    getDetail_SCR: (
        id: string,
        options: { headers?: Record<string, string> } = {}
    ) => http.get<PatientResType>(`/${prefix}/${id}`, { headers: options.headers }),
};

export default patientApiRequest;