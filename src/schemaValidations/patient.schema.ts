import z from 'zod';
import { MetaData } from './user.schema';

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
    password: z.string().nullable().optional(),
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
    success: z.boolean(),
    meta: MetaData,
})

export type PatientListResType = z.TypeOf<typeof PatientListRes>

export const CreatePatientBody = z.object({
    full_name: z.string(),
    dob: z.string().date().nullable().optional(),
    gender: z.enum(["MALE", "FEMALE"]).nullable().optional(),
    phone_number: z.string(),
    password: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    medical_history: z.string().nullable().optional(),
    allergies: z.string().nullable().optional(),
})

export type CreatePatientBodyType = z.TypeOf<typeof CreatePatientBody>

export const UpdatePatientBody = z.object({
    full_name: z.string().nullable().optional(),
    dob: z.string().date().nullable().optional(),
    gender: z.enum(["MALE", "FEMALE"]).nullable().optional(),
    phone_number: z.string().nullable().optional(),
    password: z.string().nullable().optional(),
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


const PHONE_REGEX = /^(032|033|034|035|036|037|038|039|096|097|098|086|083|084|085|081|082|088|091|094|070|079|077|076|078|090|093|089|056|058|092|059|099)[0-9]{7}$/;
const today = new Date();
today.setHours(0, 0, 0, 0);
export const editPatientSchema = z.object({
    full_name: z.string().min(1, "Họ và tên không được để trống").max(80, "Họ và tên không được vượt quá 80 ký tự"),
    dob: z.string().refine((val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
    }, "Ngày sinh không hợp lệ")
        .refine((val) => {
            const date = new Date(val);
            return date <= today;
        }, "Ngày sinh không được lớn hơn hôm nay")
        .refine((val) => {
            const birthDate = new Date(val);
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age >= 5;
        }, "Tuổi phải lớn hơn hoặc bằng 5"),
    gender: z
        .enum(["MALE", "FEMALE"])
        .refine((val) => val !== undefined, {
            message: "Giới tính là bắt buộc",
    }),
    phone_number: z.string().regex(PHONE_REGEX, "Số điện thoại không hợp lệ").nullable(),
    email: z.string().email("Email không hợp lệ").nullable(),
    address: z.string().max(100, "Địa chỉ không được vượt quá 100 ký tự").nullable(),
    medical_history: z.string().max(200, "Tiền sử bệnh không được vượt quá 200 ký tự").nullable(),
    allergies: z.string().max(200, "Dị ứng không được vượt quá 200 ký tự").nullable(),
});
export type EditPatientFormData = z.TypeOf<typeof editPatientSchema>;