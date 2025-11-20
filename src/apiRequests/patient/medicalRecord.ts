import http from "@/lib/axios"
import { MedicalRecordFullResType, MedicalRecordListResType } from "@/schemaValidations/medicalRecord.schema";

const prefix = 'patient-medical-records';

const patientMedicalRecordApiRequest = {
    getList: (
        params: { skip?: number; limit?: number } = { skip: 0, limit: 100 }
    ) => http.get<MedicalRecordListResType>(`/${prefix}/`, { params }),

    getDetail: (id: string) => http.get<MedicalRecordFullResType>(`/${prefix}/${id}`),

};

export default patientMedicalRecordApiRequest;