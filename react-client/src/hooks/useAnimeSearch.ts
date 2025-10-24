import { useInfiniteQuery } from "@tanstack/react-query";
import { myApiAgent } from "../api/myApiAgent";
import { SearchResponse } from "../models/responses/searchResponse";
import useDebounce from "./useDebounce";

interface Props {
    query: string
    page?: number
    limit?: number
    sort?: string
}

export default function useAnimeSearch({ query, limit = 20, sort = "relevance" }: Props) {
    const debouncedQuery = useDebounce(query, 300)

    const fetchSearch = async ({pageParam = 1}): Promise<SearchResponse> => {
        const res = await myApiAgent.Animes.search({
            query: debouncedQuery,
            page: pageParam,
            limit,
            sort
        });

        if (!res.data) {
            throw new Error("Failed to search anime");
        }

        return res.data;
    };

    const {
        data,
        isPending,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage } = useInfiniteQuery({
            queryKey: ["animeSearch", debouncedQuery, limit],
            queryFn: fetchSearch,
            enabled: query.length >= 2,  // Only search with 2+ characters
            initialPageParam: 1,
            getNextPageParam: (lastPage) => {
                // Return next page number if there are more pages, otherwise undefined
                return lastPage.pagination.hasMore
                    ? lastPage.pagination.currentPage + 1
                    : undefined;
            },
            staleTime: 5 * 60 * 1000,    // Cache for 5 minutes
        });

    // Flatten all pages into a single array of results
    const results = data?.pages.flatMap(page => page.results) || [];
    const totalResults = data?.pages[0]?.pagination.totalResults || 0;

    return {
        results,
        totalResults,
        isPending: isPending || (query !== debouncedQuery),
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        error
    };
}
