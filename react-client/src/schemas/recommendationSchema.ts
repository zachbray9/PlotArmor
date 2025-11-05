import z from "zod";

export const RecommendationSchema = z.object({
    prompt: z.string().min(1, "Prompt is required.")
})

export type RecommendationFormFields = z.infer<typeof RecommendationSchema>