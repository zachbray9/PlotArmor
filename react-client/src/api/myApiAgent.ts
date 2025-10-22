import axios, { AxiosResponse } from "axios";
import { myApi } from "./axios";
import { RefreshResponse } from "../models/responses/refreshResponse";
import ApiResponse from "../models/responses/apiResponse";
import Genre from "../models/genre";
import Studio from "../models/studio";
import CreateAnimeRequest from "../models/requests/createAnimeRequest";
import { RegisterFormFields } from "../schemas/registerSchema";
import { LoginFormFields } from "../schemas/loginSchema";
import { User } from "../models/user";
import { BadRequestError, ConflictError, NotFoundError, TooManyRequestsError, UnauthorizedError } from "./errors/httpErrors";
import Anime from "../models/anime";
import HomePageData from "../models/homePageData";
import { UserAnime } from "../models/userAnime";
import { UpdateUserAnimeFormFields } from "../schemas/updateUserAnimeSchema";
import SearchParams from "../models/searchParams";
import { SearchResponse } from "../models/responses/searchResponse";

const ResponseBody = <T>(response: AxiosResponse<T>) => response.data;

myApi.interceptors.response.use(
    (res) => res,
    (err) => {
        if (axios.isAxiosError(err)) {
            const errorMessage = err.response?.data.error

            switch (err.response?.status) {
                case 400: throw new BadRequestError(errorMessage)
                case 401: throw new UnauthorizedError(errorMessage)
                case 404: throw new NotFoundError(errorMessage)
                case 409: throw new ConflictError(errorMessage)
                case 429: throw new TooManyRequestsError(errorMessage)
            }
        }

        throw err
    }
)

const requests = {
    get: <T>(url: string) => myApi.get<T>(url).then(ResponseBody),
    post: <T>(url: string, body: object) => myApi.post<T>(url, body).then(ResponseBody),
    postFormData: <T>(url: string, body: FormData) => myApi.post<T>(url, body).then(ResponseBody),
    put: <T>(url: string, body: object) => myApi.put<T>(url, body).then(ResponseBody),
    patch: <T>(url: string, body: object) => myApi.patch<T>(url, body).then(ResponseBody),
    delete: <T>(url: string) => myApi.delete<T>(url).then(ResponseBody)
}

const Auth = {
    login: (request: LoginFormFields) => requests.post<ApiResponse<User>>('/users/login', request),
    register: (request: RegisterFormFields) => requests.post<ApiResponse<User>>('/users/register', request),
    getCurrentUser: () => requests.get<ApiResponse<User>>('/users/getCurrentUser'),
    refresh: () => requests.get<RefreshResponse>('/users/refresh'),
    logout: () => requests.delete('/users/logout')
}

const List = {
    add: (animeId: number) => requests.post('/user/anime', { animeId: animeId }),
    getList: () => requests.get<ApiResponse<UserAnime[]>>('/user/anime'),
    getUserAnimeDetails: (animeId: number) => requests.get<ApiResponse<UserAnime>>(`/user/anime/${animeId}`),
    updateUserAnime: (animeId: number, patchRequest: UpdateUserAnimeFormFields) => requests.patch(`/user/anime/${animeId}`, patchRequest),
    remove: (animeId: number) => requests.delete(`/user/anime/${animeId}`)
}

const Animes = {
    getById: (animeId: number) => requests.get<ApiResponse<Anime>>(`/anime/${animeId}`),
    homePage: () => requests.get<ApiResponse<HomePageData>>("/home"),
    create: (request: CreateAnimeRequest) => requests.post<ApiResponse<Anime>>("/anime", request),
    search: (params: SearchParams) => requests.get<ApiResponse<SearchResponse>>(`/anime/search?q=${params.query}&page=${params.page}&limit=${params.limit}&sort=${params.sort}`)
}

const Genres = {
    getAll: () => requests.get<ApiResponse<Genre[]>>("/genres")
}

const Studios = {
    getAll: () => requests.get<ApiResponse<Studio[]>>("/studios")
}

const Images = {
    upload: (formData: FormData) => requests.postFormData<ApiResponse<string>>("/images/upload", formData)
}

export const myApiAgent = {
    Auth,
    List,
    Animes,
    Genres,
    Studios,
    Images
}