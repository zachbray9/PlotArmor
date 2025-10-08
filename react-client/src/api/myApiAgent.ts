import { AxiosError, AxiosResponse } from "axios";
import { myApi } from "./axios";
import { LoginResponse } from "../models/responses/loginResponse";
import { AniListAnime } from "../models/aniListAnime";
import { GetUserAnimeDetailsResponse } from "../models/responses/getUserAnimeDetailsResponse";
import { UserAnimePatchRequest } from "../models/requests/userAnimePatchRequest";
import { GetListResponse } from "../models/responses/getListResponse";
import { RefreshResponse } from "../models/responses/refreshResponse";
import { store } from "../stores/store";
import { toaster } from "../components/ui/toaster";
import ApiResponse from "../models/responses/apiResponse";
import Genre from "../models/genre";
import Studio from "../models/studio";
import CreateAnimeRequest from "../models/requests/createAnimeRequest";
import { RegisterFormFields } from "../schemas/registerSchema";
import { LoginFormFields } from "../schemas/loginSchema";
import { User } from "../models/user";

const ResponseBody = <T>(response: AxiosResponse<T>) => response.data;

myApi.interceptors.response.use(
    (res) => res,
    (err: AxiosError) => {
        const { response } = err

        if (response?.status === 401 && store.userStore.isLoggedIn) {
            store.userStore.logout()
            
            toaster.create({
                title: "Logged out",
                description: "Your session has expired. Please login again to power up.",
                type: "warning",
                closable: true,
                duration: 7000,
            })
        }
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
    register: (request: RegisterFormFields) => requests.post<LoginResponse>('/users/register', request),
    getCurrentUser: () => requests.get<LoginResponse>('/users/getCurrentUser'),
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