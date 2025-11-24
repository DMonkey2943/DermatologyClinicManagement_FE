import z from 'zod';

export const PredictAcneSeverityBody = z.object({
    image_path: z.string()
})

export type PredictAcneSeverityBodyType = z.TypeOf<typeof PredictAcneSeverityBody>

export const PredictAcneSeverityRes = z.object({
    data: z.object({
        image_path: z.string(),
        severity: z.string(),
        severity_display: z.string(),
    }),
    message: z.string(),
    success: z.boolean()
})

export type PredictAcneSeverityResType = z.TypeOf<typeof PredictAcneSeverityRes>
