import { useMutation, useQueryClient } from "@tanstack/react-query"
import { UpdateUserAnimeFormFields } from "../schemas/updateUserAnimeSchema"
import { myApiAgent } from "../api/myApiAgent"

export default function useUpdateUserAnime() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            animeId,
            formFields
        }: {
            animeId: number
            formFields: UpdateUserAnimeFormFields
        }) => {
            await myApiAgent.List.updateUserAnime(animeId, formFields)
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["userAnime", variables.animeId] })
            queryClient.invalidateQueries({ queryKey: ["userAnimeList"] })
            queryClient.invalidateQueries({queryKey: ["anime"]})
        }
    })
}