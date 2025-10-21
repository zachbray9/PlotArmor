import { makeAutoObservable, runInAction } from "mobx";
import { User } from "../models/user";
import { myApiAgent } from "../api/myApiAgent";
import router from "../router/routes";
import { RegisterFormFields } from "../schemas/registerSchema";
import { LoginFormFields } from "../schemas/loginSchema";

export default class UserStore {
    user: User | null = null

    constructor() {
        makeAutoObservable(this)
    }

    get isLoggedIn() {
        return !!this.user
    }

    login = async (values: LoginFormFields) => {
        const response = await myApiAgent.Auth.login(values)

        if (!response.success || !response.data) {
            throw new Error(response.message)
        }

        runInAction(() => this.user = response.data!)
        router.navigate('/')
    }

    register = async (values: RegisterFormFields) => {
        const response = await myApiAgent.Auth.register(values)

        if (!response.success || !response.data) {
            throw new Error(response.message)
        }

        runInAction(() => this.user = response.data!)
        router.navigate('/')
    }

    logout = async () => {
        try {
            await myApiAgent.Auth.logout()
        } catch (error) {
            console.log(error)
        }
        runInAction(() => this.user = null)
    }

    setUser = (user: User) => {
        this.user = user
    }

    clearUser = () => {
        this.user = null
    }

}