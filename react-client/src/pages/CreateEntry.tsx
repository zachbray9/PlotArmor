import FormInput from "../components/common/form/FormInput";
import { Button, Center, createListCollection, Fieldset, Stack } from "@chakra-ui/react";
import FormSelect from "../components/common/form/FormSelect";
import FormNumberInput from "../components/common/form/formNumberInput";
import FormTextArea from "../components/common/form/formTextArea";
import FormPhotoUpload from "../components/common/form/formPhotoUpload";
import FormCheckBox from "../components/common/form/formCheckBox";
import { useMemo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import useFormOptions from "../hooks/useFormOptions";
import { ageRatingCollection, formatCollection, seasonCollection } from "../constants/formCollections";
import { CreateAnimeFormFields, createAnimeValidationSchema } from "../schemas/createAnimeSchema";
import useCreateAnime from "../hooks/useCreateAnime";

export default function CreateEntry() {
    const { genres, studios, pendingGenres, pendingStudios } = useFormOptions()
    const { createAnime } = useCreateAnime()
    const methods = useForm<CreateAnimeFormFields>({
        defaultValues: {
            isAdult: false,
            genres: [],
            studio: "",
            format: "",
            season: "",
            startDate: undefined,
            endDate: undefined,
            ageRating: "",
            seasonYear: 0,
            episodes: 0,
            duration: 0,
            trailerUrl: ""
        },
        resolver: zodResolver(createAnimeValidationSchema),
        mode: "onSubmit"
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

    const onSubmit: SubmitHandler<CreateAnimeFormFields> = async (data) => {
        try {
            await createAnime(data)
            methods.reset()
        } catch {
            //if create anime fails, catch and clean up created images in s3
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

                            <Button
                                type="submit"
                                disabled={methods.formState.isSubmitting}
                                loading={methods.formState.isSubmitting}
                            >
                                Submit
                            </Button>
                        </Fieldset.Content>

                        <Fieldset.ErrorText>{methods.formState.errors.root?.message}</Fieldset.ErrorText>
                    </Fieldset.Root>
                </form>
            </FormProvider>
        </Center>
    )
}