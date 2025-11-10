import z from 'zod';

export const LoginBody = z.object({
    username: z.string().min(4),
    password: z.string().min(8).max(100)
}).strict()

export type LoginBodyType = z.TypeOf<typeof LoginBody>

export const LoginRes = z.object({
    data: z.object({
        user: z.object({
            id: z.string(),
            username: z.string(),
            full_name: z.string(),
            phone_number: z.string(),
            email: z.string(),
            avatar: z.string(),
            role: z.enum(["ADMIN", "STAFF", "DOCTOR"])
        }),
        access_token: z.string(),
        refresh_token: z.string(),
    }),
    message: z.string(),
    success: z.boolean()
})

export type LoginResType = z.TypeOf<typeof LoginRes>