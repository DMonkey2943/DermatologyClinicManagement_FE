import z from 'zod';

// export const PatientData = z.object({
//     id: z.string(),
//     full_name: z.string().nullable(),
//     // dob: z.string().date().nullable(),
//     dob: z.coerce.date().nullable(),
//     gender: z.enum(["MALE", "FEMALE"]).nullable(),
//     phone_number: z.string(),
//     email: z.string(),
//     role: z.enum(["ADMIN", "STAFF", "DOCTOR"]).nullable(),
//     avatar: z.string().nullable(),
//     is_active: z.boolean(),
//     // created_at: z.coerce.date().nullable(),
//     // deleted_at: z.coerce.date().nullable().nullable(),
// })
// export type PatientDataType = z.TypeOf<typeof PatientData>

export const PatientData = z.object({
    id: z.string(),
    full_name: z.string(),
    dob: z.string().date().nullable().optional(),
    gender: z.enum(["MALE", "FEMALE"]).nullable().optional(),
    phone_number: z.string(),
    email: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
})
export type PatientDataType = z.TypeOf<typeof PatientData>

export const PatientFullData = z.object({
    id: z.string(),
    full_name: z.string(),
    dob: z.string().date().nullable().optional(),
    gender: z.enum(["MALE", "FEMALE"]).nullable().optional(),
    phone_number: z.string(),
    email: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    medical_history: z.string().nullable().optional(),
    allergies: z.string().nullable().optional(),
    current_medications: z.string().nullable().optional(),
    current_condition: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
})
export type PatientFullDataType = z.TypeOf<typeof PatientFullData>

export const PatientRes = z.object({
    data: PatientFullData,
    message: z.string(),
    success: z.boolean()
})

export type PatientResType = z.TypeOf<typeof PatientRes>

export const PatientListRes = z.object({
    data: z.array(PatientData),
    message: z.string(),
    success: z.boolean()
})

export type PatientListResType = z.TypeOf<typeof PatientListRes>

export const CreatePatientBody = z.object({
    full_name: z.string(),
    dob: z.string().date().nullable().optional(),
    gender: z.enum(["MALE", "FEMALE"]).nullable().optional(),
    phone_number: z.string(),
    email: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    medical_history: z.string().nullable().optional(),
    allergies: z.string().nullable().optional(),
})

export type CreatePatientBodyType = z.TypeOf<typeof CreatePatientBody>

export const UpdatePatientBody = z.object({
    full_name: z.string().nullable(),
    dob: z.string().date().nullable().optional(),
    gender: z.enum(["MALE", "FEMALE"]).nullable().optional(),
    phone_number: z.string().nullable(),
    email: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    medical_history: z.string().nullable().optional(),
    allergies: z.string().nullable().optional(),
})

export type UpdatePatientBodyType = z.TypeOf<typeof UpdatePatientBody>

export const PatientFKData = z.object({
    id: z.string(),
    full_name: z.string(),
})

export type PatientFKDataType = z.TypeOf<typeof PatientFKData>