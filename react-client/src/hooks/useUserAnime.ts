import { useQuery } from "@tanstack/react-query";
import { myApiAgent } from "../api/myApiAgent";
import { NotFoundError } from "../api/errors/httpErrors";

export default function useUserAnime(animeId: number) {
    const fetchUserAnime = async (animeId: number) => {
        try{
            const res = await myApiAgent.List.getUserAnimeDetails(animeId)
            if(!res.data){
                throw new Error("Failed to fetch user anime")
            }
    
            return res.data
        } catch(error) {
            if(error instanceof NotFoundError){
                return null
            }

            throw error
        }
        
    }

    const {data, isPending, error} = useQuery({
        queryKey: ["userAnime", animeId],
        queryFn: () => fetchUserAnime(animeId),
        refetchOnWindowFocus: false,
    })

    return {userAnime: data, isPending, error}
}