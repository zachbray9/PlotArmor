import { useQuery } from "@tanstack/react-query";
import { myApiAgent } from "../api/myApiAgent";
import { SearchResponse } from "../models/responses/searchResponse";
import useDebounce from "./useDebounce";

interface Props {
    query: string
    page?: number
    limit?: number
    sort?: string
}

export default function useAnimeSearch({query, page = 1, limit = 20, sort = "relevance"} : Props) {
    const debouncedQuery = useDebounce(query, 300)

    const fetchSearch = async (): Promise<SearchResponse> => {
        const res = await myApiAgent.Animes.search({
            query: debouncedQuery,
            page,
            limit,
            sort
        });
        
        if (!res.data) {
            throw new Error("Failed to search anime");
        }
        
        return res.data;
    };

    const { data, isPending, error } = useQuery({
        queryKey: ["animeSearch", debouncedQuery, page, limit, sort],
        queryFn: fetchSearch,
        enabled: query.length >= 2,  // Only search with 2+ characters
        staleTime: 5 * 60 * 1000,    // Cache for 5 minutes
    });

    return { 
        results: data?.results || [], 
        pagination: data?.pagination,
        isPending, 
        error 
    };
}
