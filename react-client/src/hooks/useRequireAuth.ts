import { useNavigate } from "react-router-dom";
import { toaster } from "../components/ui/toaster";
import { useStore } from "../stores/store";

export default function useRequireAuth() {
    const { userStore } = useStore()
    const navigate = useNavigate()

    const requireAuth = (action: () => void) => {
        if (!userStore.isLoggedIn) {
            toaster.create({
                title: "Login required",
                description: "Please log in to continue",
                type: "info",
                duration: 3000,
                closable: true
            });
            navigate('/login', {
                state: { from: window.location.pathname }
            });
            return;
        }

        action();
    };

    return { requireAuth, isLoggedIn: userStore.isLoggedIn };
}