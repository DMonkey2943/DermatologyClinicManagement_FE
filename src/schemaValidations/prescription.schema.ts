import z from 'zod';
// import { UserFKData } from './user.schema';
// import { PatientFKData } from './patient.schema';

export const PrescriptionData = z.object({
    id: z.string(),
    medical_record_id: z.string(),
    notes: z.string().nullable().optional(),
    created_at: z.string(),
})
export type PrescriptionDataType = z.TypeOf<typeof PrescriptionData>

export const PrescriptionListRes = z.object({
    data: z.array(PrescriptionData),
    message: z.string(),
    success: z.boolean()
})

export type PrescriptionListResType = z.TypeOf<typeof PrescriptionListRes>

export const PrescriptionDetailData = z.object({
    id: z.string(),
    prescription_id: z.string(),
    medication_id: z.string(),
    name: z.string(),
    dosage_form: z.string(),
    quantity: z.number(),
    dosage: z.string()
})
export type PrescriptionDetailDataType = z.TypeOf<typeof PrescriptionDetailData>

export const PrescriptionFullData = z.object({
    id: z.string(),
    medical_record_id: z.string(),
    notes: z.string().nullable().optional(),
    created_at: z.string(),
    medications: z.array(PrescriptionDetailData)
})
export type PrescriptionFullDataType = z.TypeOf<typeof PrescriptionFullData>

export const PrescriptionFullRes = z.object({
    data: PrescriptionFullData || null,
    message: z.string(),
    success: z.boolean()
})
export type PrescriptionFullResType = z.TypeOf<typeof PrescriptionFullRes>

export const CreatePrescriptionDetailBody = z.object({
    medication_id: z.string(),
    quantity: z.number(),
    dosage: z.string()
})
export type CreatePrescriptionDetailBodyType = z.TypeOf<typeof CreatePrescriptionDetailBody>

export const CreatePrescriptionBody = z.object({
    medical_record_id: z.string(),
    notes: z.string().nullable().optional(),
    prescription_details: z.array(CreatePrescriptionDetailBody)
})
export type CreatePrescriptionBodyType = z.TypeOf<typeof CreatePrescriptionBody>

