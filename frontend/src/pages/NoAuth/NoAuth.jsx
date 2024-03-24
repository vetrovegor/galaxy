import React from "react"
import { Navigate } from "react-router-dom";
import useUserStore from "../../stores/userStore";

const NoAuth = ({ compontent: RouteComponent }) => {
    const { user } = useUserStore();

    if (user) {
        return <Navigate to="/" />
    }

    return <RouteComponent />;
};

export default NoAuth;