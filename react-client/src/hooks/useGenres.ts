import { useQuery } from "@tanstack/react-query";
import { myApiAgent } from "../api/myApiAgent";

export default function useGenres() {
    const fetchGenres = async () => {
        const res = await myApiAgent.Genres.getAll()

        return res.data ?? []
    }


    return useQuery({
        queryKey: ["genres"],
        queryFn: fetchGenres,
        refetchOnWindowFocus: false,
    })
}