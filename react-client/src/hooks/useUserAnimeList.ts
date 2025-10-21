import { useQuery } from "@tanstack/react-query";
import { myApiAgent } from "../api/myApiAgent";

export default function useUserAnimeList() {
    const fetchUserAnimeList = async () => {
        const res = await myApiAgent.List.getList()
        return res.data || []
    }

    const { data, isPending, error } = useQuery({
        queryKey: ["userAnimeList"],
        queryFn: fetchUserAnimeList,
        staleTime: 5 * 60 * 1000
    })

    return {
        animeList: data,
        animeIds: data?.map(ua => ua.anime.id) || [],
        isPending,
        error
    }
}