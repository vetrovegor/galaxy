import { Link, useNavigate } from 'react-router-dom';
import { Rate, Skeleton } from 'antd';
import { useMutation } from 'react-query';
import './Product.scss';
import useFavoriteStore from '../../stores/favoriteStore';
import { favoriteService } from '../../services/favoriteService';
import useUserStore from '../../stores/userStore';
import useBasketStore from '../../stores/basketStore';
import { basketService } from '../../services/basketService';

const Product = ({ product }) => {
    const { _id, picture, model, stats, price } = product;

    const { user } = useUserStore();
    const navigate = useNavigate();
    const { favorites, toggle } = useFavoriteStore();
    const { basket, addProduct } = useBasketStore();

    const toggleFavorite = async (e) => {
        e.preventDefault();

        if (!user) {
            return navigate('/auth');
        }

        const success = await favoriteService.toggle(_id);

        if (success) {
            toggle(_id);
        }
    };

    const { mutate: addToBasket } = useMutation({
        mutationKey: ['add-product'],
        mutationFn: () => basketService.addProduct(_id, 1),
        onSuccess(success) {
            if (success) {
                addProduct({ _id, picture, model, price }, 1);
            }
        }
    });

    return (
        <div className="product">
            <Link to={`/product/${_id}`} className="product__image ibg">
                <img src={picture} alt="image" />
                <button
                    onClick={toggleFavorite}
                    className={`product__fav-btn btn${
                        favorites?.includes(_id) ? ' active' : ''
                    }`}
                >
                    <svg
                        width={20}
                        height={20}
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
                </button>
            </Link>
            <Link to={`/product/${_id}`} className="product__model text link">
                {model}
            </Link>
            {stats ? (
                <div className="rating item">
                    <Rate disabled defaultValue={stats?.avgRating} allowHalf />
                    <div className="rating__stats">
                        <p className="product__avg">{stats?.avgRating}</p>/
                        <p className="rating__reviews-count">
                            {stats?.reviewsCount}
                        </p>
                    </div>
                </div>
            ) : (
                <Skeleton.Input style={{ width: 135, height: 16 }} active />
            )}
            <div className="product__bottom">
                <p className="product__price">{price}₽</p>
                {basket.products.some((product) => product._id == _id) ? (
                    <Link to="/basket" className="product__basket-btn active">
                        В корзине
                        <span className="product__basket-icon">
                            <svg
                                width={20}
                                height={20}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m4.5 12.75 6 6 9-13.5"
                                />
                            </svg>
                        </span>
                    </Link>
                ) : (
                    <button
                        onClick={addToBasket}
                        className="product__basket-btn"
                    >
                        В корзину
                        <span className="product__basket-icon">
                            <svg
                                width={20}
                                height={20}
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
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default Product;
