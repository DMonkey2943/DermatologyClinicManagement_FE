import z from 'zod';

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
    role: z.enum(["ADMIN", "STAFF", "DOCTOR"]),
})
export type UserDataType = z.TypeOf<typeof UserData>

export const CurrentUserRes = z.object({
    data: UserData,
    message: z.string(),
    success: z.boolean()
})

export type CurrentUserResType = z.TypeOf<typeof CurrentUserRes>

export const UserListRes = z.object({
    data: z.array(UserData),
    message: z.string(),
    success: z.boolean()
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
