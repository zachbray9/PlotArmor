import z from "zod";

export const createAnimeValidationSchema = z.object({
    englishTitle: z.string().min(1, "English title is required"),
    romajiTitle: z.string().min(1, "Romaji title is required"),
    synopsis: z.string().min(1, "Synopsis is required."),
    format: z.array(z.string()).min(1, "Format is required"),
    genres: z.array(z.string()).min(1, "Genre(s) is required"),
    episodes: z.number().min(0, "Episodes must be a positive number"),
    duration: z.number().positive("Duration must be a positive number"),
    studio: z.array(z.string()).min(1, "Studio is required"),
    startDate: z.string(),
    endDate: z.string(),
    season: z.array(z.string()).min(1, "Season is required"),
    seasonYear: z.number().min(1900, "Anime wasn't even invented until 1917 bozo").max(2100, "Invalid year"),
    trailerUrl: z.string().optional().or(z.literal("")),
    ageRating: z.array(z.string()).min(1, "Age rating is required"),
    isAdult: z.boolean(),
    poster: z.instanceof(File, { error: "Poster image is required" })
        .refine((file) => file.size <= 5000000, "File must be less than 5MB")
        .refine((file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type), "File must be a JPG, PNG, or WebP"),
    banner: z.instanceof(File, { error: "Banner image is required" })
        .refine((file) => file.size <= 5000000, "File must be less than 5MB")
        .refine((file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type), "File must be a JPG, PNG, or WebP"),
})

export type CreateAnimeFormFields = z.infer<typeof createAnimeValidationSchema>