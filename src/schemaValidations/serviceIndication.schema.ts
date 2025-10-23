import z from 'zod';

export const ServiceIndicationData = z.object({
    id: z.string(),
    medical_record_id: z.string(),
    notes: z.string().nullable().optional(),
    created_at: z.string(),
})
export type ServiceIndicationDataType = z.TypeOf<typeof ServiceIndicationData>

export const ServiceIndicationListRes = z.object({
    data: z.array(ServiceIndicationData),
    message: z.string(),
    success: z.boolean()
})

export type ServiceIndicationListResType = z.TypeOf<typeof ServiceIndicationListRes>

export const ServiceIndicationDetailData = z.object({
    id: z.string(),
    service_indication_id: z.string(),
    service_id: z.string(),
    name: z.string(),
    quantity: z.number(),
    unit_price: z.number(),
    total_price: z.number(),
})
export type ServiceIndicationDetailDataType = z.TypeOf<typeof ServiceIndicationDetailData>

export const ServiceIndicationFullData = z.object({
    id: z.string(),
    medical_record_id: z.string(),
    notes: z.string().nullable().optional(),
    created_at: z.string(),
    services: z.array(ServiceIndicationDetailData)
})
export type ServiceIndicationFullDataType = z.TypeOf<typeof ServiceIndicationFullData>

export const ServiceIndicationFullRes = z.object({
    data: ServiceIndicationFullData || null,
    message: z.string(),
    success: z.boolean()
})
export type ServiceIndicationFullResType = z.TypeOf<typeof ServiceIndicationFullRes>

export const CreateServiceIndicationDetailBody = z.object({
    service_id: z.string(),
    quantity: z.number()
})
export type CreateServiceIndicationDetailBodyType = z.TypeOf<typeof CreateServiceIndicationDetailBody>

export const CreateServiceIndicationBody = z.object({
    medical_record_id: z.string(),
    notes: z.string().nullable().optional(),
    service_indication_details: z.array(CreateServiceIndicationDetailBody)
})
export type CreateServiceIndicationBodyType = z.TypeOf<typeof CreateServiceIndicationBody>

