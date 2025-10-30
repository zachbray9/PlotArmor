import Anime from "../anime";
import Genre from "../genre";
import { Pagination } from "./searchResponse";

export default interface BrowseResponse {
    results: Anime[],
    pagination: Pagination,
    genre: Genre
}