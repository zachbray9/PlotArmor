export default interface CreateAnimeRequest {
    englishTitle: string
    romajiTitle: string
    synopsis: string
    ageRating: string
    season: string
    seasonYear: number
    format: string
    genres: number[]
    studioId: number
    episodes: number
    duration: number
    startDate: Date
    endDate: Date
    trailerUrl: string
    isAdult: boolean
    poster: string
    banner: string

}