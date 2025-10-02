import FormInput from "../components/common/form/FormInput";
import { Button, Center, createListCollection, Fieldset, Stack } from "@chakra-ui/react";
import FormSelect from "../components/common/form/FormSelect";
import FormNumberInput from "../components/common/form/formNumberInput";
import FormTextArea from "../components/common/form/formTextArea";
import FormPhotoUpload from "../components/common/form/formPhotoUpload";
import { useQuery } from "@tanstack/react-query";
import { myApiAgent } from "../api/myApiAgent";
import ApiResponse from "../models/responses/apiResponse";
import Genre from "../models/genre";
import { toaster } from "../components/ui/toaster";
import FormCheckBox from "../components/common/form/formCheckBox";
import { useMemo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import Studio from "../models/studio";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import CreateAnimeRequest from "../models/requests/createAnimeRequest";

const validationSchema = z.object({
    englishTitle: z.string().min(3),
    romajiTitle: z.string(),
    synopsis: z.string(),
    format: z.array(z.string()),
    genres: z.array(z.string()),
    episodes: z.number(),
    duration: z.number(),
    studio: z.array(z.string()),
    startDate: z.string(),
    endDate: z.string(),
    season: z.array(z.string()),
    seasonYear: z.number(),
    trailerUrl: z.string(),
    ageRating: z.array(z.string()),
    isAdult: z.boolean(),
    poster: z.instanceof(File)
        .refine((file) => file.size <= 5000000, "File must be less than 5MB")
        .refine((file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type), "File must be a JPG, PNG, or WebP"),
    banner: z.instanceof(File)
        .refine((file) => file.size <= 5000000, "File must be less than 5MB")
        .refine((file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type), "File must be a JPG, PNG, or WebP"),
})

type FormFields = z.infer<typeof validationSchema>

const formatCollection = createListCollection({
    items: [
        { label: "TV", value: "TV" },
        { label: "Movie", value: "MOVIE" },
        { label: "OVA", value: "OVA" },
        { label: "ONA", value: "ONA" },
        { label: "Special", value: "SPECIAL" },
        { label: "Music", value: "MUSIC" }
    ]
})

const seasonCollection = createListCollection({
    items: [
        { label: "Fall", value: "FALL" },
        { label: "Winter", value: "WINTER" },
        { label: "Spring", value: "SPRING" },
        { label: "Summer", value: "SUMMER" }
    ]
})

const ageRatingCollection = createListCollection({
    items: [
        { label: "G", value: "G" },
        { label: "PG", value: "PG" },
        { label: "PG-13", value: "PG-13" },
        { label: "TV-14", value: "TV-14" },
        { label: "TV-MA", value: "TV-MA" },
        { label: "R", value: "R" },
    ]
})

export default function CreateEntry() {
    const methods = useForm<FormFields>({
        defaultValues: {
            isAdult: false
        },
        resolver: zodResolver(validationSchema)
    })

    const fetchGenres = async (): Promise<Genre[]> => {
        const res: ApiResponse<Genre[]> = await myApiAgent.Genres.getAll()

        if (!res.success) {
            toaster.create({
                title: "Failed to fetch genres",
                description: "There was a problem fetching genres from the database.",
                type: "error",
                closable: true,
                duration: 7000,
            })

            return []
        }
        return res.data ?? []
    }

    const fetchStudios = async () => {
        const res: ApiResponse<Studio[]> = await myApiAgent.Studios.getAll()

        if (!res.success) {
            toaster.create({
                title: "Failed to fetch studios",
                description: "There was a problem fetching studios from the database.",
                type: "error",
                closable: true,
                duration: 7000,
            })

            return []
        }

        return res.data ?? []
    }

    const { data: genres, isPending: pendingGenres } = useQuery({
        queryKey: ["genres"],
        queryFn: fetchGenres,
        refetchOnWindowFocus: false,
        staleTime: Infinity,
    })

    const { data: studios, isPending: pendingStudios } = useQuery({
        queryKey: ["studios"],
        queryFn: fetchStudios,
        refetchOnWindowFocus: false,
        staleTime: Infinity
    })

    const genreCollection = useMemo(() => createListCollection({
        items: genres?.map((genre) => ({
            label: genre.name,
            value: genre.id.toString()
        })) ?? []
    }), [genres])

    const studioCollection = useMemo(() => createListCollection({
        items: studios?.map((studio) => ({
            label: studio.name,
            value: studio.id.toString()
        })) ?? []
    }), [studios])

    const onSubmit: SubmitHandler<FormFields> = async(data) => {
        console.log(data)

        try {
            //upload images and return s3 keys
            const posterFormData = new FormData()
            posterFormData.append("title", data.englishTitle)
            posterFormData.append("type", "poster")
            posterFormData.append("image", data.poster)
            const posterRes = await myApiAgent.Images.upload(posterFormData)

            const bannerFormData = new FormData()
            bannerFormData.append("title", data.englishTitle)
            bannerFormData.append("type", "banner")
            bannerFormData.append("image", data.banner)
            const bannerRes = await myApiAgent.Images.upload(bannerFormData)


            //send create anime request using form data and s3 image keys
            const createAnimeRequest: CreateAnimeRequest = {
                englishTitle: data.englishTitle,
                romajiTitle: data.romajiTitle,
                synopsis: data.synopsis,
                ageRating: data.ageRating[0],
                season: data.season[0],
                seasonYear: data.seasonYear,
                format: data.format[0],
                genres: data.genres.map((id) => Number(id)),
                studioId: Number(data.studio[0]),
                episodes: data.episodes,
                duration: data.duration,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                trailerUrl: data.trailerUrl,
                isAdult: data.isAdult,
                poster: posterRes.data ?? "",
                banner: bannerRes.data ?? ""
            } 
            await myApiAgent.Anime.create(createAnimeRequest)

            toaster.create({
                title: "Success!",
                description: "Successfully added new anime to the database.",
                type: "success",
                closable: true,
                duration: 7000,
            })
            methods.reset()

            //if create anime fails, catch and clean up created images in s3
        } catch {
            toaster.create({
                title: "Failed to create anime",
                description: "There was a problem adding the anime to our database.",
                type: "error",
                closable: true,
                duration: 7000,
            })
            methods.setError("root", { message: "Something went wrong. Please try again." })
        }
    }

    return (
        <Center w="100%" mt={8}>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                    <Fieldset.Root maxW='3xl' w="100%">
                        <Stack>
                            <Fieldset.Legend></Fieldset.Legend>
                            <Fieldset.HelperText></Fieldset.HelperText>
                        </Stack>

                        <Fieldset.Content w="100%">
                            <FormInput name="englishTitle" label="English title" required={true} />
                            <FormInput name="romajiTitle" label="Romaji title" required={true} />

                            <FormTextArea name="synopsis" label="Synopsis" required />
                            <FormSelect name="ageRating" label="Age rating" collection={ageRatingCollection} required />
                            <FormSelect name="season" label="Season" collection={seasonCollection} required />
                            <FormNumberInput name="seasonYear" label="Season year" required min={0} max={undefined} />
                            <FormSelect name="format" label="Format" collection={formatCollection} required />
                            <FormSelect name="genres" label="Genres" multiple required collection={genreCollection} loading={pendingGenres} />
                            <FormSelect name="studio" label="Studio" required collection={studioCollection} loading={pendingStudios} />
                            <FormNumberInput name="episodes" label="Episodes" min={0} max={undefined} required />
                            <FormNumberInput name="duration" label="Episode duration" min={0} max={undefined} required />

                            <FormInput name="startDate" label="Start date" type="date" required />
                            <FormInput name="endDate" label="End date" type="date" />

                            <FormInput name="trailerUrl" label="Trailer URL" />
                            <FormCheckBox name="isAdult" label="Is adult?" />

                            <FormPhotoUpload name="poster" label="Poster" required />
                            <FormPhotoUpload name="banner" label="Banner" />

                            <Button disabled={methods.formState.isSubmitting} loading={methods.formState.isSubmitting} type="submit">Submit</Button>
                        </Fieldset.Content>

                        <Fieldset.ErrorText>{methods.formState.errors.root?.message}</Fieldset.ErrorText>
                    </Fieldset.Root>
                </form>
            </FormProvider>
        </Center>
    )
}