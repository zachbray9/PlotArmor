import { createContext, useContext } from "react";
import CommonStore from "./commonStore";
import UserStore from "./userStore";
import ListStore from "./listStore";

interface Store{
    commonStore: CommonStore,
    userStore: UserStore,
    listStore: ListStore
}

export const store: Store = {
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    listStore: new ListStore()
}

export const StoreContext = createContext(store)

export function useStore(){
    return useContext(StoreContext)
}