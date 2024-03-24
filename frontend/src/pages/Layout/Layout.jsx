import React from "react"
import { Header } from "../../components/Header/Header";
import "./Layout.scss";

const Layout = ({ children, showSearch = false }) => {
    return (
        <div className="wrapper">
            <Header showSearch={showSearch} />
            <main className="main">
                <div className="container main__container">
                    {children}
                </div>
            </main>
        </div>
    )
};

export default Layout;