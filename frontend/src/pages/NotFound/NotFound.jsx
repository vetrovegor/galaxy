import React from "react"
import { NotFound as NotFoundIcon } from "../../components/Icons/NotFound";
import "./NotFound.scss";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="notfound">
            <NotFoundIcon width={512} />
            <Link to="/" className="btn notfound__btn">На главную</Link>
        </div>
    )
};

export default NotFound;