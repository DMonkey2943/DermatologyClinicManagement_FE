import z from 'zod';

export const MetaData = z.object({
    total: z.number(),
    page: z.number(),
    skip: z.number(),
    total_pages: z.number(),
})
export type MetaDataType = z.TypeOf<typeof MetaData>

// export const UserData = z.object({
//     id: z.string(),
//     username: z.string(),
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
// export type UserDataType = z.TypeOf<typeof UserData>

export const UserData = z.object({
    id: z.string(),
    username: z.string(),
    full_name: z.string(),
    phone_number: z.string(),
    email: z.string(),
    dob: z.string().optional(),
    gender: z.enum(["MALE", "FEMALE"]).optional(),
    avatar: z.string().nullable(),
    role: z.enum(["ADMIN", "STAFF", "DOCTOR"]),
})
export type UserDataType = z.TypeOf<typeof UserData>

export const CurrentUserRes = z.object({
    data: UserData,
    message: z.string(),
    success: z.boolean()
})

export type CurrentUserResType = z.TypeOf<typeof CurrentUserRes>

export const UserRes = z.object({
    data: UserData,
    message: z.string(),
    success: z.boolean(),
    meta: MetaData,
})

export type UserResType = z.TypeOf<typeof UserRes>

export const UserListRes = z.object({
    data: z.array(UserData),
    message: z.string(),
    success: z.boolean(),
    meta: MetaData,
})

export type UserListResType = z.TypeOf<typeof UserListRes>

export const CreateUserBody = z.object({
    username: z.string(),
    password: z.string().optional(),
    full_name: z.string(),
    phone_number: z.string(),
    email: z.string(),
    role: z.enum(["ADMIN", "STAFF", "DOCTOR"]),
})

export type CreateUserBodyType = z.TypeOf<typeof CreateUserBody>

export const UpdateUserBody = z.object({
    username: z.string().nullable(),
    full_name: z.string().nullable(),
    phone_number: z.string().nullable(),
    email: z.string().nullable(),
})

export type UpdateUserBodyType = z.TypeOf<typeof UpdateUserBody>

export const UserFKData = z.object({
    id: z.string(),
    full_name: z.string(),
})

export type UserFKDataType = z.TypeOf<typeof UserFKData>



export const DoctorData = z.object({
    id: z.string(),
    user_id: z.string(),
    specialization: z.string(),
    user: UserFKData,
})
export type DoctorDataType = z.TypeOf<typeof DoctorData>

export const DoctorListRes = z.object({
    data: z.array(DoctorData),
    message: z.string(),
    success: z.boolean()
})

export type DoctorListResType = z.TypeOf<typeof DoctorListRes>



// ------------------------------
// Regex số điện thoại Việt Nam
const PHONE_REGEX = /^(032|033|034|035|036|037|038|039|096|097|098|086|083|084|085|081|082|088|091|094|070|079|077|076|078|090|093|089|056|058|092|059|099)[0-9]{7}$/;
const today = new Date();
today.setHours(0, 0, 0, 0);
export const createUserSchema = z.object({
    full_name: z.string().min(4, "Họ tên phải ít nhất 4 ký tự").max(50, "Họ tên không quá 50 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    phone_number: z.string().regex(PHONE_REGEX, "Số điện thoại không hợp lệ"),
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
            return age >= 18;
        }, "Tuổi phải lớn hơn hoặc bằng 18"),
    gender: z
        .enum(["MALE", "FEMALE"])
        .refine((val) => val !== undefined, {
            message: "Giới tính là bắt buộc",
        }),
    role: z
        .enum(["ADMIN", "STAFF", "DOCTOR"])
        .refine((val) => val !== undefined, {
            message: "Vai trò là bắt buộc",
        }),
    username: z.string().min(4, "Tên đăng nhập phải ít nhất 4 ký tự").max(50, "Tên đăng nhập không quá 50 ký tự"),
    password: z.string().min(8, "Mật khẩu phải ít nhất 8 ký tự").max(50, "Mật khẩu không quá 50 ký tự"),
});
export type createUserSchemaType = z.TypeOf<typeof createUserSchema>