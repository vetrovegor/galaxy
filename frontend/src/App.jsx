import React, { useEffect, useState } from "react";
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import Main from "./pages/Main/Main";
import Auth from "./pages/Auth/Auth";
import Profile from "./pages/Profile/Prodile";
import Admin from "./pages/Admin/Admin";
import Protected from "./pages/Protected/Protected";
import './App.scss';
import useUserStore from "./stores/userStore";
import { authService } from "./services/authService";
import NoAuth from "./pages/NoAuth/NoAuth";
import Product from "./pages/Product/Product";
import NotFound from "./pages/NotFound/NotFound";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AdminType from "./pages/Admin/AdminType";
import AdminBrand from "./pages/Admin/AdminBrand";
import AdminProduct from "./pages/Admin/AdminProduct";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Main />,
        errorElement: <Navigate to="/404" />
    },
    {
        path: "/auth",
        element: <NoAuth compontent={Auth} />

    },
    {
        path: "/profile",
        element: <Protected compontent={Profile} />

    },
    {
        path: "/admin",
        element: <Protected compontent={Admin} role="ADMIN" />

    },
    {
        path: "/admin/types",
        element: <Protected compontent={AdminType} role="ADMIN" />

    },
    {
        path: "/admin/brands",
        element: <Protected compontent={AdminBrand} role="ADMIN" />

    },
    {
        path: "/admin/products",
        element: <Protected compontent={AdminProduct} role="ADMIN" />

    },
    {
        path: "/product/:productId",
        element: <Product />
    },
    {
        path: "/404",
        element: <NotFound />
    }
]);

export function App() {
    const { login } = useUserStore();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUserShortInfo = async () => {
            const userData = await authService.getUserShortInfo();

            login(userData?.user);
            setLoading(false);
        };

        if (localStorage.getItem('accessToken')) {
            getUserShortInfo();
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return <>Loading...</>;
    }

    return (
        <>
            <RouterProvider router={router} />
            <ToastContainer />
        </>
    );
}
