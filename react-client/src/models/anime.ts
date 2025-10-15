import Genre from "./genre"
import Studio from "./studio"

export default interface Anime {
    id: number
    englishTitle: string
    romajiTitle: string
    synopsis: string
    format: string
    status: string
    episodes: number
    duration: number
    totalDuration: number
    startDate: Date
    endDate: Date
    season: string
    seasonYear: number
    posterImage: string
    bannerImage: string
    trailerUrl: string
    favorites: number
    isAdult: boolean
    ageRating: string
    studio: Studio
    genres: Genre[]
}