import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home"
import AnimeDetails from "../pages/AnimeDetails";
import Search from "../pages/Search";
import Login from "../pages/Login";
import Register from "../pages/Register";
import List from "../pages/List";
import RequireAuth from "./requireAuth";
import Browse from "../pages/Browse";
import CreateEntry from "../pages/CreateEntry";
import RequireAdmin from "./requireAdmin";
import Unauthorized from "../pages/Unauthorized";


const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                element: <RequireAuth />, children: [
                    { path: 'anime/list', element: <List /> },
                ]
            },
            {
                element: <RequireAdmin />, children: [
                    { path: "anime/contribute", element: <CreateEntry /> }
                ]
            },
            { path: '', element: <Home /> },
            { path: 'anime/:animeId/details', element: <AnimeDetails /> },
            { path: 'anime/search', element: <Search /> },
            { path: 'login', element: <Login /> },
            { path: 'register', element: <Register /> },
            { path: 'anime/browse/:category?', element: <Browse /> },
            { path: "unauthorized", element: <Unauthorized /> }
        ],
    },
])

export default router