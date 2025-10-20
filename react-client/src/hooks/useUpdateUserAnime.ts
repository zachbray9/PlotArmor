import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useStore } from "../stores/store"
import { UpdateUserAnimeFormFields } from "../schemas/updateUserAnimeSchema"

export default function useUpdateUserAnime() {
    const queryClient = useQueryClient()
    const { listStore } = useStore()

    return useMutation({
        mutationFn: async ({
            animeId,
            formFields
        }: {
            animeId: number
            formFields: UpdateUserAnimeFormFields
        }) => {
            await listStore.updateUserAnime(animeId, formFields)
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["userAnime", variables.animeId] })
        }
    })
}