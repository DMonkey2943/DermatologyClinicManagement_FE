import z from 'zod';
import { MetaData } from './user.schema';

export const ServiceData = z.object({
    id: z.string(),
    name: z.string(),
    price: z.number().nonnegative().refine((val) => Number.isFinite(val), {
        message: "Giá không hợp lệ",
    }),
    description: z.string().optional(),
})
export type ServiceDataType = z.TypeOf<typeof ServiceData>

export const ServiceListRes = z.object({
    data: z.array(ServiceData),
    message: z.string(),
    success: z.boolean(),
    meta: MetaData,
})

export type ServiceListResType = z.TypeOf<typeof ServiceListRes>

export const CreateServiceBody = z.object({
    name: z.string(),
    price: z.number().nonnegative().refine((val) => Number.isFinite(val), {
        message: "Giá không hợp lệ",
    }),
    description: z.string().nullable().optional(),
})

export type CreateServiceBodyType = z.TypeOf<typeof CreateServiceBody>

export const UpdateServiceBody = z.object({
    name: z.string().nullable(),
    price: z.number().nonnegative().refine((val) => Number.isFinite(val), {
        message: "Giá không hợp lệ",
    }).nullable(),
    description: z.string().nullable().optional(),
})

export type UpdateServiceBodyType = z.TypeOf<typeof UpdateServiceBody>
