import http from "@/lib/axios"
import { AppointmentListResType, AppointmentResType, CreateAppointmentBodyType, UpdateAppointmentBodyType, AppointmentDataType } from "@/schemaValidations/appointment.schema";

const prefix = 'appointments';

const appointmentApiRequest = {
    getList: (
        params: { skip?: number; limit?: number } = { skip: 0, limit: 100 }
    ) => http.get<AppointmentListResType>(`/${prefix}/`, { params }),

    getDetail: (id: string) => http.get<AppointmentResType>(`/${prefix}/${id}`),

    create: (body: CreateAppointmentBodyType) => http.post<AppointmentDataType>(`/${prefix}/`, body),

    update: (id: string, body: UpdateAppointmentBodyType) => http.put<AppointmentDataType>(`/${prefix}/${id}`, body),

    delete: (id: string) => http.delete(`/${prefix}/${id}`)
};

export default appointmentApiRequest;