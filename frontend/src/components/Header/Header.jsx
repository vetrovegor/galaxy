import { Link } from "react-router-dom"
import "./Header.scss";
import useUserStore from "../../stores/userStore";
import { authService } from "../../services/authService";
import Search from "../Search/Search";

export const Header = ({ showSearch }) => {
    const { user, logout } = useUserStore();

    const logoutHandler = async () => {
        logout();
        await authService.logout();
        localStorage.clear();
    }

    return (
        <header className="header">
            <div className="container">
                <div className="header__inner">
                    <Link to="/" className="logo">Galaxy</Link>
                    {showSearch && (
                        <Search placeholder="Поиск товаров" />
                    )}
                    <div className="header__links">
                        {user ? (
                            <>
                                <Link to="/favorites" className="item link header__link">
                                    <svg width={24} height={24} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                    </svg>
                                    Избранное
                                </Link>
                                <Link to="/basket" className="item link header__link">
                                    <svg width={24} height={24} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                    </svg>
                                    Корзина
                                </Link>
                                {user.roles.includes("ADMIN") && (
                                    <Link to="/admin" className="item link header__link">
                                        <svg width={24} height={24} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" />
                                        </svg>
                                        Админка
                                    </Link>
                                )}
                                <div className="dropdown-wrapper">
                                    <Link to="/profile" className="item link header__link">
                                        <svg width={24} height={24} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                        {user.nickname}
                                    </Link>
                                    <div className="dropdown right">
                                        <Link to="/profile" className="item link dropdown__link">
                                            Профиль
                                        </Link>
                                        {user.roles.includes("ADMIN") && (
                                            <Link to="/admin" className="item link dropdown__link">
                                                Админка
                                            </Link>
                                        )}
                                        <button onClick={logoutHandler} className="item link dropdown__link">
                                            Выход
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <Link to="/auth" className="item link header__link">
                                <svg width={24} height={24} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                                </svg>
                                Авторизация
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}