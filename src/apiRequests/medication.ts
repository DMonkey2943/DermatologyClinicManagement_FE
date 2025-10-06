import http from "@/lib/axios"
import { MedicationListResType, CreateMedicationBodyType, UpdateMedicationBodyType, MedicationDataType } from "@/schemaValidations/medication.schema";

const prefix = 'medications';

const medicationApiRequest = {
    getList: (
        params: { skip?: number; limit?: number } = { skip: 0, limit: 100 }
    ) => http.get<MedicationListResType>(`/${prefix}/`, { params }),

    create: (body: CreateMedicationBodyType) => http.post<MedicationDataType>(`/${prefix}/`, body),

    update: (id: string, body: UpdateMedicationBodyType) => http.put<MedicationDataType>(`/${prefix}/${id}`, body),

    delete: (id: string) => http.delete(`/${prefix}/${id}`)
};

export default medicationApiRequest;