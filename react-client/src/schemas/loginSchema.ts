import z from "zod";

export const loginValidationSchema = z.object({
    email: z.email("Invalid email address").min(1, "Email is required").trim(),
    password: z.string().min(1, "Password is required").trim()
})

export type LoginFormFields = z.infer<typeof loginValidationSchema>