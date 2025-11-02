import http from "@/lib/axios"
import { MedicalRecordListResType, MedicalRecordResType, CreateMedicalRecordBodyType, UpdateMedicalRecordBodyType } from "@/schemaValidations/medicalRecord.schema";
import { PrescriptionFullResType } from "@/schemaValidations/prescription.schema";
import { ServiceIndicationFullResType } from "@/schemaValidations/serviceIndication.schema";

const prefix = 'medical_records';

const medicalRecordApiRequest = {
    getList: (
        params: { skip?: number; limit?: number, doctor_id?: string, patient_id?:string } = { skip: 0, limit: 100 }
    ) => http.get<MedicalRecordListResType>(`/${prefix}/`, { params }),

    getListByPatient: (
        patient_id: string,
        params: { skip?: number; limit?: number } = { skip: 0, limit: 5 }
    ) => http.get<MedicalRecordListResType>(`/${prefix}/patient/${patient_id}`, { params }),

    getDetail: (id: string) => http.get<MedicalRecordResType>(`/${prefix}/${id}`),

    getByAppointment: (appointment_id: string) => http.get<MedicalRecordResType>(`/${prefix}/by-appointment/${appointment_id}`),

    create: (body: CreateMedicalRecordBodyType) => http.post<MedicalRecordResType>(`/${prefix}/`, body),
    
    update: (id: string, body: UpdateMedicalRecordBodyType) => http.put<MedicalRecordResType>(`/${prefix}/${id}`, body),

    getPrescriptionByMRId: (medical_record_id: string) => http.get<PrescriptionFullResType>(`/${prefix}/${medical_record_id}/prescription`),
    
    getServiceIndicationByMRId: (medical_record_id: string) => http.get<ServiceIndicationFullResType>(`/${prefix}/${medical_record_id}/service-indication`),
};

export default medicalRecordApiRequest;