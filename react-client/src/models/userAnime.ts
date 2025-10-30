import Anime from "./anime"

export interface UserAnime{
    rating: number
    watchStatus: string
    numEpisodesWatched: number
    id?: number
    anime: Anime
}