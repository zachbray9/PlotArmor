import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";

export default observer(function RequireAdmin() {
    const { userStore } = useStore()
    const location = useLocation()

    if (!userStore.isLoggedIn) {
        return <Navigate to='/login' state={{ from: location }} />
    }

    if (userStore.user?.role !== "admin") {
        return <Navigate to='/unauthorized' state={{ from: location }} />
    }

    return <Outlet />
})