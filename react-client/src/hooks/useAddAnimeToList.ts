import { useMutation, useQueryClient } from "@tanstack/react-query";
import { myApiAgent } from "../api/myApiAgent";
import { toaster } from "../components/ui/toaster";
import { useStore } from "../stores/store";
import { useNavigate } from "react-router-dom";
import { UnauthorizedError } from "../api/errors/httpErrors";

export default function useAddAnimeToList() {
    const queryClient = useQueryClient();
    const { userStore } = useStore()
    const navigate = useNavigate()

    return useMutation({
        mutationFn: (animeId: number) => {
            if (!userStore.isLoggedIn) {

                navigate('/login', { state: { from: window.location.pathname } });
                throw new UnauthorizedError
            }

            return myApiAgent.List.add(animeId)
        },
        onSuccess: (_, animeId) => {
            queryClient.invalidateQueries({ queryKey: ["userAnime", animeId] })
            queryClient.invalidateQueries({ queryKey: ["userAnimeList"] })

            toaster.create({
                title: 'Added to list',
                type: "success",
                duration: 2000,
                closable: true,
            })
        },
        onError: (error) => {
            if (error instanceof UnauthorizedError) {
                toaster.create({
                    title: "Login required",
                    description: "Please log in to manage your list",
                    type: "info",
                    duration: 3000,
                });
            } else {
                toaster.create({
                    title: 'Add to list failed',
                    description: 'Looks like we need to power up. Try again!',
                    type: "error",
                    duration: 5000,
                    closable: true,
                })
            }
        }
    })
}