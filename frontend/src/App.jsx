import React, { useEffect, useState } from 'react';
import {
    Navigate,
    RouterProvider,
    createBrowserRouter
} from 'react-router-dom';
import Main from './pages/Main/Main';
import Auth from './pages/Auth/Auth';
import Admin from './pages/Admin/Admin';
import Protected from './pages/Protected/Protected';
import './App.scss';
import useUserStore from './stores/userStore';
import { authService } from './services/authService';
import NoAuth from './pages/NoAuth/NoAuth';
import Product from './pages/Product/Product';
import NotFound from './pages/NotFound/NotFound';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminType from './pages/Admin/AdminType';
import AdminBrand from './pages/Admin/AdminBrand';
import AdminProduct from './pages/Admin/AdminProduct';
import { healthService } from './services/healthService';
import Error from './pages/Error/Error';
import useFavoriteStore from './stores/favoriteStore';
import Favorite from './pages/Favorite/Favorite';
import Profile from './pages/Profile/Profile';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Main />,
        errorElement: <Navigate to="/404" />
    },
    {
        path: '/auth',
        element: <NoAuth compontent={Auth} />
    },
    {
        path: '/profile',
        element: <Protected compontent={Profile} />
    },
    {
        path: '/favorites',
        element: <Protected compontent={Favorite} />
    },
    {
        path: '/admin',
        element: <Protected compontent={Admin} role="ADMIN" />
    },
    {
        path: '/admin/types',
        element: <Protected compontent={AdminType} role="ADMIN" />
    },
    {
        path: '/admin/brands',
        element: <Protected compontent={AdminBrand} role="ADMIN" />
    },
    {
        path: '/admin/products',
        element: <Protected compontent={AdminProduct} role="ADMIN" />
    },
    {
        path: '/product/:productId',
        element: <Product />
    },
    {
        path: '/404',
        element: <NotFound />
    }
]);

export function App() {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    const { login } = useUserStore();
    const { init } = useFavoriteStore();

    const initialize = async () => {
        const status = await healthService.checkHealth();

        if (status != 200) {
            return setError(true);
        }

        if (!localStorage.getItem('accessToken')) {
            return setLoading(false);
        }

        const userData = await authService.getUserShortInfo();

        login(userData?.user);
        init(userData?.favorites);

        return setLoading(false);
    };

    useEffect(() => {
        initialize();
    }, []);

    if (error) {
        return <Error />;
    }

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
