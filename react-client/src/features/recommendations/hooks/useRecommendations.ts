import { useMutation } from "@tanstack/react-query";
import { myApiAgent } from "../../../api/myApiAgent";
import { toaster } from "../../../components/ui/toaster";

export default function useRecommendations() {
    const fetchRecommendations = async (query: string) => {
        const res = await myApiAgent.Animes.getRecommendations(query)
        if (!res.data) {
            throw new Error("failed to fetch recommendations")
        }

        return res.data
    }

    return useMutation({
        mutationKey: ["recommendations"],
        mutationFn: (query: string) => fetchRecommendations(query),
        onError: () => {
            toaster.create({
                title: "Uh oh, something went wrong",
                description: "We can't get your recommendations at this time. Give us some time to power up and then try again.",
                type: "error",
                duration: 5000,
                closable: true,
            })
        }
    })

}