import { useMutation, useQueryClient } from "@tanstack/react-query";
import { myApiAgent } from "../api/myApiAgent";

export default function useAddAnimeToList() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (animeId: number) => myApiAgent.List.add(animeId),
        onSuccess: (_, animeId) => {
            queryClient.invalidateQueries({
                queryKey: ["userAnime", animeId]
            })
        }
    })
}