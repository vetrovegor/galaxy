import { Link } from 'react-router-dom';
import './Header.scss';
import useUserStore from '../../stores/userStore';
import { authService } from '../../services/authService';
import Search from '../Search/Search';
import useFavoriteStore from '../../stores/favoriteStore';
import BasketItem from '../BasketItem/BasketItem';
import useBasketStore from '../../stores/basketStore';

export const Header = ({ showSearch }) => {
    const { user, logout } = useUserStore();
    const { clear } = useFavoriteStore();
    const { basket } = useBasketStore();

    const logoutHandler = async () => {
        logout();
        clear();
        await authService.logout();
        localStorage.removeItem('accessToken');
    };

    return (
        <header className="header">
            <div className="container">
                <div className="header__inner">
                    <Link to="/" className="logo">
                        Galaxy
                    </Link>
                    {showSearch && <Search placeholder="Поиск товаров" />}
                    <div className="header__links">
                        {user ? (
                            <>
                                <Link
                                    to="/favorites"
                                    className="item link header__link"
                                >
                                    <svg
                                        width={24}
                                        height={24}
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                        />
                                    </svg>
                                    Избранное
                                </Link>
                                <div className="dropdown-wrapper">
                                    <Link
                                        to="/basket"
                                        className="item link header__link basket-link"
                                    >
                                        <svg
                                            width={24}
                                            height={24}
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="w-6 h-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                                            />
                                        </svg>
                                        Корзина
                                        {basket.productsQuantity > 0 && (
                                            <span className="basket-count">
                                                {basket.productsQuantity}
                                            </span>
                                        )}
                                    </Link>
                                    <div className="dropdown basket-dropdown">
                                        {basket.productsQuantity > 0 ? (
                                            <>
                                                <div className="basket-dropdown__list">
                                                    {basket.products.map(
                                                        (basketItem) => (
                                                            <BasketItem
                                                                key={
                                                                    basketItem._id
                                                                }
                                                                basketItem={
                                                                    basketItem
                                                                }
                                                            />
                                                        )
                                                    )}
                                                </div>
                                                <div className="basket-dropdown__total">
                                                    Итого:
                                                    <p className="bold">{basket.totalSum}₽</p>
                                                </div>
                                                <div className="basket-dropdown__btns">
                                                    <Link to="#" className="basket-dropdown__btn order">
                                                        Оформить заказ
                                                    </Link>
                                                    <Link to="/basket" className="basket-dropdown__btn btn">
                                                        В корзину
                                                    </Link>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="52.91"
                                                    height="44.051"
                                                    viewBox="0 0 52.91 44.051"
                                                >
                                                    <path
                                                        id="Path_1"
                                                        data-name="Path 1"
                                                        d="M57.832-45.4q.123.123,0,.123L52.664-24.24a.965.965,0,0,1-.984.738H20.18a2.5,2.5,0,0,0-1.846.738,2.951,2.951,0,0,0-.615,1.723,2.361,2.361,0,0,0,.738,1.723,2.361,2.361,0,0,0,1.723.738H51.926a4.316,4.316,0,0,1,3.261,1.354,4.479,4.479,0,0,1,1.292,3.2,4.42,4.42,0,0,1-1.292,3.261,4.42,4.42,0,0,1-3.261,1.292,4.479,4.479,0,0,1-3.2-1.292,4.316,4.316,0,0,1-1.354-3.261,4.271,4.271,0,0,1,.861-2.461H23.871a4.34,4.34,0,0,1,.738,2.461,4.328,4.328,0,0,1-1.23,3.2,4.374,4.374,0,0,1-3.2,1.354,4.42,4.42,0,0,1-3.261-1.292,4.42,4.42,0,0,1-1.292-3.261,4.328,4.328,0,0,1,1.23-3.2.355.355,0,0,0,.246-.123.355.355,0,0,1,.246-.123,4.317,4.317,0,0,1-1.723-3.568,4.328,4.328,0,0,1,1.23-3.2,7.957,7.957,0,0,1,1.969-1.107L13.9-45.281l-1.6-6.152H6.152a.979.979,0,0,1-1.107-1.107q0-.984,1.107-.984h7.014a.86.86,0,0,1,.984.738l1.6,6.275h8.244a.87.87,0,0,1,.984.984.87.87,0,0,1-.984.984H16.242l4.676,18.949h29.9l4.676-18.949H47.865q-1.107,0-1.107-.984t1.107-.984h9.352l.123.123a.109.109,0,0,0,.123.123.355.355,0,0,1,.246.123.944.944,0,0,0,.123.369v.123l.123.123ZM50.2-12.3a2.361,2.361,0,0,0,1.723.738,2.361,2.361,0,0,0,1.723-.738,2.361,2.361,0,0,0,.738-1.723,2.361,2.361,0,0,0-.738-1.723,2.361,2.361,0,0,0-1.723-.738,2.361,2.361,0,0,0-1.723.738,2.361,2.361,0,0,0-.738,1.723A2.361,2.361,0,0,0,50.2-12.3Zm-31.746,0a2.361,2.361,0,0,0,1.723.738A2.361,2.361,0,0,0,21.9-12.3a2.361,2.361,0,0,0,.738-1.723A2.361,2.361,0,0,0,21.9-15.75a2.361,2.361,0,0,0-1.723-.738,2.5,2.5,0,0,0-1.846.738,2.951,2.951,0,0,0-.615,1.723A2.361,2.361,0,0,0,18.457-12.3ZM41.59-39.867a1.064,1.064,0,0,1-.738.369.828.828,0,0,1-.738-.369L35.93-44.051l-4.307,4.184q-.123.369-.738.369a1.064,1.064,0,0,1-.738-.369,1.035,1.035,0,0,1,0-1.477l4.307-4.184-4.307-4.184a1.035,1.035,0,0,1,0-1.477q.861-.861,1.477,0L35.93-47l4.184-4.184q.615-.861,1.477,0a1.035,1.035,0,0,1,0,1.477l-4.184,4.184,4.184,4.184A1.035,1.035,0,0,1,41.59-39.867Z"
                                                        transform="translate(-5.045 53.525)"
                                                        fill="#bbb"
                                                    />
                                                </svg>
                                                Корзина пуста
                                            </>
                                        )}
                                    </div>
                                </div>
                                {user.roles.includes('ADMIN') && (
                                    <Link
                                        to="/admin"
                                        className="item link header__link"
                                    >
                                        <svg
                                            width={24}
                                            height={24}
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z"
                                            />
                                        </svg>
                                        Админка
                                    </Link>
                                )}
                                <div className="dropdown-wrapper">
                                    <Link
                                        to="/profile"
                                        className="item link header__link"
                                    >
                                        <svg
                                            width={24}
                                            height={24}
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="w-6 h-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                            />
                                        </svg>
                                        {user.nickname}
                                    </Link>
                                    <div className="dropdown right">
                                        <Link
                                            to="/profile"
                                            className="item link dropdown__link"
                                        >
                                            Профиль
                                        </Link>
                                        {user.roles.includes('ADMIN') && (
                                            <Link
                                                to="/admin"
                                                className="item link dropdown__link"
                                            >
                                                Админка
                                            </Link>
                                        )}
                                        <button
                                            onClick={logoutHandler}
                                            className="item link dropdown__link"
                                        >
                                            Выход
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <Link to="/auth" className="item link header__link">
                                <svg
                                    width={24}
                                    height={24}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                                    />
                                </svg>
                                Авторизация
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
