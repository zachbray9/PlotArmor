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

interface FormFields {
    englishTitle: string
    romajiTitle: string
    synopsis: string
    format: string
    genre: string[]
    episodes: string
    duration: string
    startDate: Date
    endDate: Date
    trailerUrl: string
    isAdult: boolean
    poster: File
    banner: File
}

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

export default function CreateEntry() {
    const methods = useForm<FormFields>()

    const fetchGenres = async (): Promise<Genre[]> => {
        const res: ApiResponse<Genre[]> = await myApiAgent.Genres.getAll()
        console.log("Fetching genres")
        if (!res.success) {
            toaster.create({
                title: "Failed to fetch genres",
                description: "There was a problem fetching the genres from the database.",
                type: "error",
                closable: true,
                duration: 7000,
            })

            return []
        }
        return res.data ?? []
    }

    const { data, isPending } = useQuery({
        queryKey: ["genres"],
        queryFn: fetchGenres,
        refetchOnWindowFocus: false,
        staleTime: Infinity,
    })

    const genreCollection = useMemo(() => createListCollection({
        items: data?.map((genre) => ({
            label: genre.name,
            value: genre.id.toString()
        })) ?? []
    }), [data])

    const onSubmit: SubmitHandler<FormFields> = (data) => {
        //upload images and return s3 keys

        //send create anime request using form data and s3 image keys

        //if create anime fails, catch and clean up created images in s3
        console.log(data)
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
                            <FormSelect name="format" label="Format" collection={formatCollection} required />
                            <FormSelect name="genre" label="Genre" multiple required collection={genreCollection} loading={isPending} />
                            <FormNumberInput name="episodes" label="Episodes" min={0} max={undefined} required />
                            <FormNumberInput name="duration" label="Episode duration" min={0} max={undefined} required />

                            <FormInput name="startDate" label="Start date" type="date" required />
                            <FormInput name="endDate" label="End date" type="date" />

                            <FormInput name="trailerUrl" label="Trailer URL" />
                            <FormCheckBox name="isAdult" label="Is adult?" />

                            <FormPhotoUpload name="poster" label="Poster" required />
                            <FormPhotoUpload name="banner" label="Banner" />

                            <Button type="submit">Submit</Button>
                        </Fieldset.Content>
                    </Fieldset.Root>
                </form>
            </FormProvider>
        </Center>
    )
}