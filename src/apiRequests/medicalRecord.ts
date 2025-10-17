import http from "@/lib/axios"
import { MedicalRecordListResType, MedicalRecordResType, CreateMedicalRecordBodyType } from "@/schemaValidations/medicalRecord.schema";

const prefix = 'medical_records';

const medicalRecordApiRequest = {
    getList: (
        params: { skip?: number; limit?: number, doctor_id?: string, patient_id?:string } = { skip: 0, limit: 100 }
    ) => http.get<MedicalRecordListResType>(`/${prefix}/`, { params }),

    create: (body: CreateMedicalRecordBodyType) => http.post<MedicalRecordResType>(`/${prefix}/`, body),
};

export default medicalRecordApiRequest;