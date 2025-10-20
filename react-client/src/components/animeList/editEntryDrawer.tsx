import { Button, CloseButton, Drawer, IconButton, Portal, Text } from "@chakra-ui/react";
import { Pencil } from "lucide-react";
import { UserAnime } from "../../models/userAnime";
import { FormProvider, useForm } from "react-hook-form";
import FormSelect from "../common/form/FormSelect";
import FormNumberInput from "../common/form/formNumberInput";
import { ratingCollection, watchStatusCollection } from "../../constants/formCollections";
import { zodResolver } from "@hookform/resolvers/zod";
import useUpdateUserAnime from "../../hooks/useUpdateUserAnime";
import { CreateUpdateUserAnimeValidationSchema, UpdateUserAnimeFormFields } from "../../schemas/updateUserAnimeSchema";


interface Props {
    userAnime: UserAnime
}

export default function EditEntryDrawer({ userAnime }: Props) {

    const { mutate, isPending } = useUpdateUserAnime()

    const methods = useForm({
        defaultValues: {
            watchStatus: [userAnime.watchStatus],
            numEpisodesWatched: userAnime.numEpisodesWatched ?? 0,
            rating: userAnime.rating ? [userAnime.rating.toString()] : ["0"],
        },
        resolver: zodResolver(CreateUpdateUserAnimeValidationSchema(userAnime.anime.episodes))
    })

    const handleSubmit = (fields: UpdateUserAnimeFormFields) => {
        mutate({
            animeId: userAnime.anime.id,
            formFields: {
                watchStatus: fields.watchStatus,
                numEpisodesWatched: fields.numEpisodesWatched,
                rating: fields.rating
            }
        })
    }

    return (
        <Drawer.Root placement={{ base: "bottom", md: "end" }} size={{ base: "xs", md: "xs" }}>
            <Drawer.Trigger pos={"fixed"} bottom={5} right={5} asChild>
                <IconButton padding={2} borderRadius={"full"}>
                    <Text>{`${userAnime.numEpisodesWatched ?? "0"} / ${userAnime.anime.episodes ?? "?"}`}</Text>
                    <Pencil />
                </IconButton>
            </Drawer.Trigger>

            <Portal>
                <Drawer.Backdrop />

                <Drawer.Positioner>
                    <Drawer.Content>
                        <FormProvider {...methods}>
                            <form onSubmit={methods.handleSubmit(handleSubmit)}>
                                <Drawer.Header>
                                    <Drawer.Title>Update list</Drawer.Title>
                                </Drawer.Header>

                                <Drawer.Body>
                                    <FormSelect name="watchStatus" label="Watch status" collection={watchStatusCollection} />
                                    <FormNumberInput name="numEpisodesWatched" label="Episodes watched" min={0} max={userAnime.anime.episodes || Infinity} />
                                    <FormSelect name="rating" label="Rating" collection={ratingCollection} />
                                </Drawer.Body>

                                <Drawer.Footer>
                                    <Button type="submit" loading={isPending} disabled={!methods.formState.isDirty}>Save changes</Button>
                                </Drawer.Footer>
                            </form>
                        </FormProvider>

                        <Drawer.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    )
}