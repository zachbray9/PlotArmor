import Anime from "../../../models/anime"

export interface RecommendationResponse {
    query: string
    recommendations: AnimeWithSimilarityResult[]
    explanations: RecommendationExplanation[]
}

export interface AnimeWithSimilarityResult {
    anime: Anime
    similarity: number
}

export interface RecommendationExplanation {
    title: string
    reason: string
}

export interface Recommendation {
    anime: Anime
    similarity: number
    reason: string
}