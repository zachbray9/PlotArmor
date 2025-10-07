import { useQuery } from "@tanstack/react-query"
import { toaster } from "../components/ui/toaster"
import ApiResponse from "../models/responses/apiResponse"
import Studio from "../models/studio"
import { myApiAgent } from "../api/myApiAgent"
import Genre from "../models/genre"

export default function useFormOptions() {
    const fetchGenres = async (): Promise<Genre[]> => {
        const res: ApiResponse<Genre[]> = await myApiAgent.Genres.getAll()

        if (!res.success) {
            toaster.create({
                title: "Failed to fetch genres",
                description: "There was a problem fetching genres from the database.",
                type: "error",
                closable: true,
                duration: 7000,
            })

            return []
        }
        return res.data ?? []
    }

    const fetchStudios = async () => {
        const res: ApiResponse<Studio[]> = await myApiAgent.Studios.getAll()

        if (!res.success) {
            toaster.create({
                title: "Failed to fetch studios",
                description: "There was a problem fetching studios from the database.",
                type: "error",
                closable: true,
                duration: 7000,
            })

            return []
        }

        return res.data ?? []
    }

    const { data: genres, isPending: pendingGenres } = useQuery({
            queryKey: ["genres"],
            queryFn: fetchGenres,
            refetchOnWindowFocus: false,
            staleTime: Infinity,
        })
    
        const { data: studios, isPending: pendingStudios } = useQuery({
            queryKey: ["studios"],
            queryFn: fetchStudios,
            refetchOnWindowFocus: false,
            staleTime: Infinity
        })

        return { genres, studios, pendingGenres, pendingStudios}
}