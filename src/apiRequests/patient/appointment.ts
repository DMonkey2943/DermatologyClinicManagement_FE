import http from "@/lib/axios"
import { AppointmentListResType, AppointmentResType, PatientCreateAppointmentBodyType } from "@/schemaValidations/appointment.schema";

const prefix = 'patient-appointments';

const patientAppointmentApiRequest = {
    getList: (
        params: {
            skip?: number;
            limit?: number;
            status?: string[];
            appointment_date?: string;
            upcoming?: boolean;
        } = { skip: 0, limit: 100 }
    ) => http.get<AppointmentListResType>(`/${prefix}/`, { params }),

    create: (body: PatientCreateAppointmentBodyType) => http.post<AppointmentResType>(`/${prefix}/`, body),
};

export default patientAppointmentApiRequest;