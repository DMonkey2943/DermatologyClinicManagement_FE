import http from "@/lib/axios"
import { CreatePrescriptionBodyType, PrescriptionFullResType } from "@/schemaValidations/prescription.schema";

const prefix = 'prescriptions';

const prescriptionApiRequest = {
    // getList: (
    //     params: { skip?: number; limit?: number, doctor_id?: string, patient_id?:string } = { skip: 0, limit: 100 }
    // ) => http.get<MedicalRecordListResType>(`/${prefix}/`, { params }),

    create: (body: CreatePrescriptionBodyType) => http.post<PrescriptionFullResType>(`/${prefix}/`, body),
};

export default prescriptionApiRequest;