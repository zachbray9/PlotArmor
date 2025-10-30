import Anime from "./anime"

export default interface HomePageData {
    featured: Anime[],
    trending: Anime[],
    popular: Anime[],
    upcoming: Anime[]
}