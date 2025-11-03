import z from 'zod';
import { MetaData, UserFKData } from './user.schema';
import { PatientData, PatientFKData } from './patient.schema';
import { PrescriptionDetailData } from './prescription.schema';
import { ServiceIndicationDetailData } from './serviceIndication.schema';

export const InvoiceData = z.object({
    id: z.string(),
    medical_record_id: z.string(),
    patient_id: z.string(),
    patient: PatientFKData,
    doctor_id: z.string(),
    doctor: UserFKData,
    created_by: z.string(),
    created_by_user: UserFKData,
    service_subtotal: z.number().nullable().optional(),
    medication_subtotal: z.number().nullable().optional(),
    total_amount: z.number().nullable().optional(),
    discount_amount: z.number().nullable().optional(),
    final_amount: z.number().nullable().optional(),
    // status: z.enum(["COMPLETED", "IN_PROGRESS"]),
    notes: z.string().nullable().optional(),
    created_at: z.string(),
})
export type InvoiceDataType = z.TypeOf<typeof InvoiceData>

export const InvoiceRes = z.object({
    data: InvoiceData,
    message: z.string(),
    success: z.boolean()
})
export type InvoiceResType = z.TypeOf<typeof InvoiceRes>

export const InvoiceListRes = z.object({
    data: z.array(InvoiceData),
    message: z.string(),
    success: z.boolean(),
    meta: MetaData,
})
export type InvoiceListResType = z.TypeOf<typeof InvoiceListRes>

export const InvoiceFullData = z.object({
    id: z.string(),
    medical_record_id: z.string(),
    patient_id: z.string(),
    patient: PatientData,
    doctor_id: z.string(),
    doctor: UserFKData,
    created_by: z.string(),
    created_by_user: UserFKData,
    service_subtotal: z.number().nullable().optional(),
    medication_subtotal: z.number().nullable().optional(),
    total_amount: z.number().nullable().optional(),
    discount_amount: z.number().nullable().optional(),
    final_amount: z.number().nullable().optional(),
    // status: z.enum(["COMPLETED", "IN_PROGRESS"]),
    notes: z.string().nullable().optional(),
    created_at: z.string(),
    diagnosis: z.string(),
    medications: z.array(PrescriptionDetailData),
    services: z.array(ServiceIndicationDetailData)
})
export type InvoiceFullDataType = z.TypeOf<typeof InvoiceFullData>

export const InvoiceFullRes = z.object({
    data: InvoiceFullData || null,
    message: z.string(),
    success: z.boolean()
})
export type InvoiceFullResType = z.TypeOf<typeof InvoiceFullRes>

export const CreateInvoiceBody = z.object({
    medical_record_id: z.string(),
    patient_id: z.string(),
    doctor_id: z.string(),
    created_by: z.string(),
    service_subtotal: z.number().nullable().optional(),
    medication_subtotal: z.number().nullable().optional(),
    total_amount: z.number().nullable().optional(),
    discount_amount: z.number().nullable().optional(),
    final_amount: z.number().nullable().optional(),
    // status: z.enum(["COMPLETED", "IN_PROGRESS"]),
    notes: z.string().nullable().optional(),
})
export type CreateInvoiceBodyType = z.TypeOf<typeof CreateInvoiceBody>

// export const UpdateInvoiceBody = z.object({
//     symptoms: z.string().optional(),
//     diagnosis: z.string().optional(),
//     status: z.enum(["COMPLETED", "IN_PROGRESS"]).optional(),
//     notes: z.string().nullable().optional(),
// })

// export type UpdateInvoiceBodyType = z.TypeOf<typeof UpdateInvoiceBody>
