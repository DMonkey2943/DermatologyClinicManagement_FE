import http from "@/lib/axios"
import { AppointmentListResType, AppointmentResType, CreateAppointmentBodyType, UpdateAppointmentBodyType } from "@/schemaValidations/appointment.schema";

const prefix = 'appointments';

const appointmentApiRequest = {
    getList: (
        params: {
            skip?: number;
            limit?: number;
            doctor_id?: string;
            patient_id?: string;
            status?: string[];
            appointment_date?: string;
            upcoming?: boolean;
        } = { skip: 0, limit: 100 }
    ) => http.get<AppointmentListResType>(`/${prefix}/`, { params }),

    getDetail: (id: string) => http.get<AppointmentResType>(`/${prefix}/${id}`),

    create: (body: CreateAppointmentBodyType) => http.post<AppointmentResType>(`/${prefix}/`, body),

    update: (id: string, body: UpdateAppointmentBodyType) => http.put<AppointmentResType>(`/${prefix}/${id}`, body),

    delete: (id: string) => http.delete(`/${prefix}/${id}`),

    getList_SCR: (
        params: {
            skip?: number;
            limit?: number;
            doctor_id?: string;
            patient_id?: string;
            status?: string[];
            appointment_date?: string;
            upcoming?: boolean;
        } = { skip: 0, limit: 100 },
        options: { headers?: Record<string, string> } = {}
    ) => http.get<AppointmentListResType>(`/${prefix}/`, { params, headers: options.headers }),

    getDetail_SCR: (
        id: string,
        options: { headers?: Record<string, string> } = {}
    ) => http.get<AppointmentResType>(`/${prefix}/${id}`, { headers: options.headers }),
};

export default appointmentApiRequest;