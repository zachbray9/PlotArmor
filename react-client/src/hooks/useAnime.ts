import { useQuery } from "@tanstack/react-query"
import { myApiAgent } from "../api/myApiAgent"
import Anime from "../models/anime"

export default function useAnime(animeId: number) {
    const fetchAnime = async(animeId: number) : Promise<Anime> => {
        const res = await myApiAgent.Animes.getById(animeId)

        if(!res.data) {
            throw new Error("Failed to fetch anime")
        }

        console.log(res.data.studios)
        return res.data
    }

    const { data, isPending } = useQuery({
        queryKey: ["anime"],
        queryFn: () => fetchAnime(animeId),
        refetchOnWindowFocus: false
    })

    return { anime: data, isPending }
}