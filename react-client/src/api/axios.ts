import axios from "axios";

export const myApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
})