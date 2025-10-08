import axios, { AxiosResponse } from "axios";
import { myApi } from "./axios";
import { AniListAnime } from "../models/aniListAnime";
import { GetUserAnimeDetailsResponse } from "../models/responses/getUserAnimeDetailsResponse";
import { UserAnimePatchRequest } from "../models/requests/userAnimePatchRequest";
import { GetListResponse } from "../models/responses/getListResponse";
import { RefreshResponse } from "../models/responses/refreshResponse";
import ApiResponse from "../models/responses/apiResponse";
import Genre from "../models/genre";
import Studio from "../models/studio";
import CreateAnimeRequest from "../models/requests/createAnimeRequest";
import { RegisterFormFields } from "../schemas/registerSchema";
import { LoginFormFields } from "../schemas/loginSchema";
import { User } from "../models/user";
import { BadRequestError, ConflictError, NotFoundError, TooManyRequestsError, UnauthorizedError } from "./errors/httpErrors";

const ResponseBody = <T>(response: AxiosResponse<T>) => response.data;

myApi.interceptors.response.use(
    (res) => res,
    (err) => {
        if(axios.isAxiosError(err)){
            const errorMessage = err.response?.data.error

            switch(err.response?.status) {
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
    add: (anime: AniListAnime) => requests.post('/user/anime', anime),
    getList: () => requests.get<GetListResponse>('/user/anime'),
    getUserAnimeDetails: (animeId: number) => requests.get<GetUserAnimeDetailsResponse>(`/user/anime/${animeId}`),
    updateUserAnime: (animeId: number, patchRequest: UserAnimePatchRequest) => requests.patch(`/user/anime/${animeId}`, patchRequest),
    remove: (animeId: number) => requests.delete(`/user/anime/${animeId}`)
}

const Anime = {
    create: (request: CreateAnimeRequest) => requests.post<ApiResponse<AniListAnime>>("/anime", request) //will change return type to Anime once it is created
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
    Anime,
    Genres,
    Studios,
    Images
}