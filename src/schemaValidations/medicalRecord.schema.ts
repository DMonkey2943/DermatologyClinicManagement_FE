import z from 'zod';
import { UserFKData } from './user.schema';
import { PatientFKData } from './patient.schema';

export const MedicalRecordData = z.object({
    id: z.string(),
    patient_id: z.string(),
    patient: PatientFKData,
    doctor_id: z.string(),
    doctor: UserFKData,
    symptoms: z.string().nullable().optional(),
    diagnosis: z.string().nullable().optional(),
    status: z.enum(["COMPLETED", "IN_PROGRESS"]),
    notes: z.string().nullable().optional(),
    created_at: z.string(),
})
export type MedicalRecordDataType = z.TypeOf<typeof MedicalRecordData>

export const MedicalRecordRes = z.object({
    data: MedicalRecordData,
    message: z.string(),
    success: z.boolean()
})

export type MedicalRecordResType = z.TypeOf<typeof MedicalRecordRes>


export const MedicalRecordListRes = z.object({
    data: z.array(MedicalRecordData),
    message: z.string(),
    success: z.boolean()
})

export type MedicalRecordListResType = z.TypeOf<typeof MedicalRecordListRes>

export const CreateMedicalRecordBody = z.object({
    appointment_id: z.string(),
    patient_id: z.string(),
    doctor_id: z.string(),
    symptoms: z.string(),
    diagnosis: z.string(),
    status: z.enum(["COMPLETED", "IN_PROGRESS"]),
    notes: z.string().nullable().optional(),
})

export type CreateMedicalRecordBodyType = z.TypeOf<typeof CreateMedicalRecordBody>

// export const UpdateMedicalRecordBody = z.object({
//     // patient_id: z.string(),
//     doctor_id: z.string().optional(),
//     appointment_date: z.string().date(),
//     appointment_time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/, {
//         message: 'Giờ hẹn không hợp lệ (e.g., "12:00:00")',
//     }),
//     time_slot: z.string().optional(),
//     status: z.enum(["SCHEDULED", "WAITING", "COMPLETED", "CANCELLED"]),
//     notes: z.string().nullable().optional()
// })

// export type UpdateMedicalRecordBodyType = z.TypeOf<typeof UpdateMedicalRecordBody>
