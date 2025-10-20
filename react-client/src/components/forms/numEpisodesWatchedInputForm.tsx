import FormNumberInput from "../common/form/formNumberInput";
import { Flex, Text } from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";
import { UserAnime } from "../../models/userAnime";
import z from "zod";
import useUpdateUserAnime from "../../hooks/useUpdateUserAnime";
import { zodResolver } from "@hookform/resolvers/zod";
import useDebounce from "../../hooks/useDebounce";

interface Props {
    userAnime: UserAnime
}


export default function NumEpisodesWatchedInputForm({ userAnime }: Props) {
    const { mutate, isPending } = useUpdateUserAnime()

    const validationSchema = z.object({
        numEpisodesWatched: z.number().min(0, 'Episodes watched cannot be less than 0.').max(userAnime.anime.episodes || Infinity, 'Episodes watched cannot exceed the total number of episodes.').int("Value cannot be a decimal.")
    })

    type FormFields = z.infer<typeof validationSchema>

    const methods = useForm<FormFields>({
        defaultValues: {
            numEpisodesWatched: userAnime.numEpisodesWatched
        },
        resolver: zodResolver(validationSchema)
    })

    const numEpisodesWatched: number = methods.watch("numEpisodesWatched") as number

    const handleAutoSubmit = () => {
        if (numEpisodesWatched !== userAnime.numEpisodesWatched && methods.formState.isValid) {
            mutate({
                animeId: userAnime.anime.id,
                numEpisodesWatched: numEpisodesWatched
            })
        }
    }




    return (
        <FormProvider {...methods}>
            <Flex align='center' gap='1rem'>
                <Text>Episodes:</Text>
                <FormNumberInput name="numEpisodesWatched" min={0} max={userAnime.anime.episodes || Infinity} isSubmitting={isPending} />
                <Text>/</Text>
                <Text>{userAnime.anime.episodes || '?'}</Text>
            </Flex>
        </FormProvider>

    )
}