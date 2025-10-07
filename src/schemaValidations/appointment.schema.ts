import z from 'zod';
import { UserFKData } from './user.schema';
import { PatientFKData } from './patient.schema';

export const AppointmentData = z.object({
    id: z.string(),
    patient_id: z.string(),
    patient: PatientFKData,
    doctor_id: z.string(),
    doctor: UserFKData,
    created_by: z.string(),
    appointment_date: z.string().date(),
    appointment_time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/, {
        message: 'Giờ hẹn không hợp lệ (e.g., "12:00:00")',
    }),
    time_slot: z.string(),
    status: z.enum(["SCHEDULED", "WAITING", "COMPLETED", "CANCELLED"]),
    notes: z.string().nullable().optional()
})
export type AppointmentDataType = z.TypeOf<typeof AppointmentData>

export const AppointmentListRes = z.object({
    data: z.array(AppointmentData),
    message: z.string(),
    success: z.boolean()
})

export type AppointmentListResType = z.TypeOf<typeof AppointmentListRes>

export const CreateAppointmentBody = z.object({
    patient_id: z.string(),
    doctor_id: z.string(),
    created_by: z.string(),
    appointment_date: z.string().date(),
    appointment_time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/, {
        message: 'Giờ hẹn không hợp lệ (e.g., "12:00:00")',
    }),
    time_slot: z.string(),
    status: z.enum(["SCHEDULED", "WAITING", "COMPLETED", "CANCELLED"]),
    notes: z.string().nullable().optional()
})

export type CreateAppointmentBodyType = z.TypeOf<typeof CreateAppointmentBody>

export const UpdateAppointmentBody = z.object({
    // patient_id: z.string(),
    doctor_id: z.string().optional(),
    appointment_date: z.string().date(),
    appointment_time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/, {
        message: 'Giờ hẹn không hợp lệ (e.g., "12:00:00")',
    }),
    time_slot: z.string().optional(),
    status: z.enum(["SCHEDULED", "WAITING", "COMPLETED", "CANCELLED"]),
    notes: z.string().nullable().optional()
})

export type UpdateAppointmentBodyType = z.TypeOf<typeof UpdateAppointmentBody>
