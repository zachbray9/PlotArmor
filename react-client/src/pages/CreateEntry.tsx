import { Formik } from "formik";
import FormInput from "../components/common/form/FormInput";
import { Button, createListCollection, Stack } from "@chakra-ui/react";
import FormSelect from "../components/common/form/FormSelect";
import FormNumberInput from "../components/common/form/formNumberInput";
import FormTextArea from "../components/common/form/formTextArea";
import FormPhotoUpload from "../components/common/form/formPhotoUpload";
import { useQuery } from "@tanstack/react-query";
import { myApiAgent } from "../api/myApiAgent";
import ApiResponse from "../models/responses/apiResponse";
import Genre from "../models/genre";
import { toaster } from "../components/ui/toaster";

export default function CreateEntry() {
    const fetchGenres = async () : Promise<Genre[]> => {
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

    const {data, isPending} = useQuery({
        queryKey: ["genres"],
        queryFn: fetchGenres,
        refetchOnWindowFocus: false,
        staleTime: Infinity,
    })

    const genreCollection = createListCollection({
        items: data?.map((genre) => ({
            label: genre.name,
            value: genre.id.toString()
        })) ?? []
    })

    const handleSubmit = () => {
        //upload images and return s3 keys

        //send create anime request using form data and s3 image keys

        //if create anime fails, catch and clean up created images in s3
    }

    return (
        <Stack w="100%" alignItems="center" mt={8}>
            <Formik
                initialValues={{ "title": "" }}
                onSubmit={handleSubmit}
            >
                {({ resetForm }) => (
                    <Stack gap={8} maxWidth="3xl" w="100%">
                        <FormInput name="englishTitle" label="English title" required={true} />
                        <FormInput name="romajiTitle" label="Romaji title" required={true} />
                        <FormTextArea name="synopsis" label="Synopsis" required />
                        <FormInput name="format" label="Format" required />
                        <FormSelect name="genres" label="Genres" multiple required collection={genreCollection} loading={isPending}/>
                        <FormNumberInput name="episodes" label="Episodes" min={0} max={undefined} required />
                        <FormPhotoUpload name="poster" label="Poster" required />
                        <FormPhotoUpload name="banner" label="Banner" />

                        <Button type="submit">Submit</Button>
                    </Stack>
                )}
            </Formik>
        </Stack>
    )
}