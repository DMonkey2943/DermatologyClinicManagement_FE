import z from 'zod';
import { MetaData } from './user.schema';

export const MedicationData = z.object({
    id: z.string(),
    name: z.string(),
    dosage_form: z.string(),
    price: z.number().nonnegative().refine((val) => Number.isFinite(val), {
        message: "Giá bán không hợp lệ",
    }),
    stock_quantity: z.number().int().nonnegative(),
    description: z.string().optional(),
})
export type MedicationDataType = z.TypeOf<typeof MedicationData>

export const MedicationListRes = z.object({
    data: z.array(MedicationData),
    message: z.string(),
    success: z.boolean(),
    meta: MetaData,
})

export type MedicationListResType = z.TypeOf<typeof MedicationListRes>

export const CreateMedicationBody = z.object({
    name: z.string(),
    dosage_form: z.string(),
    price: z.number().nonnegative().refine((val) => Number.isFinite(val), {
        message: "Giá bán không hợp lệ",
    }),
    stock_quantity: z.number().int().nonnegative(),
    description: z.string().nullable().optional(),
})

export type CreateMedicationBodyType = z.TypeOf<typeof CreateMedicationBody>

export const UpdateMedicationBody = z.object({
    name: z.string().nullable(),
    dosage_form: z.string().nullable(),
    price: z.number().nonnegative().refine((val) => Number.isFinite(val), {
        message: "Giá bán không hợp lệ",
    }).nullable(),
    stock_quantity: z.number().int().nonnegative().nullable(),
    description: z.string().nullable().optional(),
})

export type UpdateMedicationBodyType = z.TypeOf<typeof UpdateMedicationBody>
