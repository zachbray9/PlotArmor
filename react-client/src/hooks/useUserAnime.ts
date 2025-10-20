import { useQuery } from "@tanstack/react-query";
import { myApiAgent } from "../api/myApiAgent";

export default function useUserAnime(animeId: number) {
    const fetchUserAnime = async (animeId: number) => {
        const res = await myApiAgent.List.getUserAnimeDetails(animeId)
        
        if(!res.data){
            throw new Error("Failed to fetch user anime")
        }

        console.log(res.data)
        return res.data
    }

    const {data, isPending, error} = useQuery({
        queryKey: ["useranime", animeId],
        queryFn: () => fetchUserAnime(animeId),
        refetchOnWindowFocus: false
    })

    return {userAnime: data, isPending, error}
}