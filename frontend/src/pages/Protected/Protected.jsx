import React from "react"
import { Navigate } from "react-router-dom";
import useUserStore from "../../stores/userStore";
import NotVerified from "../NotVerified/NotVerified";

const AuthProtected = ({ compontent: RouteComponent, role }) => {
    const { user } = useUserStore();

    if (!user || role && !user.roles.includes(role)) {
        return <Navigate to="/" />
    }

    if (!user.isVerified) {
        return <NotVerified email={user.email} />
    }

    return <RouteComponent />;
};

export default AuthProtected;