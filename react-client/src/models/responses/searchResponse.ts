import Anime from "../anime";

export interface SearchParams {
    query: string;
    page?: number;
    limit?: number;
    sort?: string;
}

export interface Pagination {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    limit: number;
    hasMore: boolean;
}

export interface SearchResponse {
    results: Anime[];
    pagination: Pagination;
    query: string;
}