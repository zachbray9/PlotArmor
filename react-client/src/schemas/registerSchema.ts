import z from "zod";

export const registerValidationSchema = z.object({
    email: z.email().min(1, "Email is  required").max(255, "Email cannot exceed 255 characters").trim(),
    password: z.string().min(6, "Password must be at least 6 characters").trim(),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {error: "Passwords do not match", path: ["confirmPassword"]})

export type RegisterFormFields = z.infer<typeof registerValidationSchema>