import Anime from "./anime"

export default interface HomePageData {
    featured: Anime[],
    topAiring: Anime[],
    popular: Anime[],
    upcoming: Anime[]
}