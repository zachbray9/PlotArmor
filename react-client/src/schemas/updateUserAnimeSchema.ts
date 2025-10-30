import z from "zod"

export const CreateUpdateUserAnimeValidationSchema = (totalEpisodes: number) => z.object({
    watchStatus: z.string(),
    numEpisodesWatched: z.number()
        .min(0, "Episodes watched can't be less than 0.")
        .max(totalEpisodes || Infinity, `This show only has ${totalEpisodes} episodes.`)
        .int("Must be a whole number."),
    rating: z.preprocess((val) => {
        // convert string to number
        if (typeof val === "string") return Number(val);
        return val;
    }, z.number()
        .min(0, "Rating cannot be less than 0")
        .max(10, "Rating cannot be greater than 10")
        .int("Rating must be a whole number"))
        .nullable()
        .optional()
});



export type UpdateUserAnimeFormFields = z.infer<ReturnType<typeof CreateUpdateUserAnimeValidationSchema>>