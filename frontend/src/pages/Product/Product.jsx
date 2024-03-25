import React, { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom";
import "./Products.scss";
import { productService } from "../../services/productService";
import { useQuery, useQueryClient } from "react-query";
import { reviewService } from "../../services/reviewService";
import Review from "../../components/Review/Review";
import Layout from "../Layout/Layout";
import { Rate, Skeleton } from "antd";
import useUserStore from "../../stores/userStore";
import useFavoriteStore from "../../stores/favoriteStore";
import { favoriteService } from "../../services/favoriteService";

const Product = () => {
    const queryClient = useQueryClient();

    const { productId } = useParams();

    const { data: product, isLoading: productLoading } = useQuery({
        queryKey: ['product'],
        queryFn: () => productService.getProductById(productId)
    });

    const { user } = useUserStore();
    const navigate = useNavigate();
    const { favorites, toggle } = useFavoriteStore();

    const toggleFavorite = async () => {
        if (!user) {
            return navigate('/auth');
        }

        const success = await favoriteService.toggle(product._id);

        if (success) {
            toggle(product._id);
        }
    }

    const [count, setCount] = useState(1);
    const [openReviews, setOpenReviews] = useState(false);
    const [reviewImages, setReviewImages] = useState([]);
    const [reviewsData, setReviewsData] = useState(null);

    const handleReviewsBtnClick = async () => {
        setOpenReviews(true);

        if (product.stats && !reviewsData) {
            const reviewImages = await queryClient.fetchQuery({
                queryKey: ['reviews'],
                queryFn: () => reviewService.getProductReviewImages(productId)
            });

            const reviewsData = await queryClient.fetchQuery({
                queryKey: ['reviews'],
                queryFn: () => reviewService.getProductReviews(productId)
            });

            setReviewImages(reviewImages);
            setReviewsData(reviewsData);
        }
    }

    return (
        <Layout>
            <div className="product-page__inner">
                <div className="product-page__cols">
                    <div className="product-page__col product-page__image-col ibg">
                        <img src={product?.picture} alt="image" />
                    </div>
                    <div className="product-page__col product-page__info-col">
                        <h1 className="title">{product?.model}</h1>
                        <ul className="breadcrumbs item">
                            <li className="item">
                                <Link to="/" className="link">Galaxy</Link>
                                <svg width={12} height={12} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                            </li>
                            <li className="item">
                                <Link to={`/?type=${product?.type._id}`} className="link">{product?.type.name}</Link>
                                <svg width={12} height={12} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                            </li>
                            <li className="item">
                                <span className="dim">{product?.model}</span>
                            </li>
                        </ul>
                        {product?.stats ? (
                            <div className="rating product-page__rating item">
                                <Rate disabled defaultValue={product?.stats.avgRating} allowHalf />
                                <div className="rating__stats">
                                    <p className="rating__avg">{product?.stats.avgRating}</p>/<p className="rating__reviews-count">{product?.stats.reviewsCount}</p>
                                </div>
                            </div>
                        ) : (
                            <Skeleton.Input style={{ width: 155, height: 20.5 }} active />
                        )}
                        <div className="product-page__buy-block">
                            <p className="product-page__price">{product?.price}₽</p>
                            <div className="product-page__basket-block">
                                <div className="product-page__counter">
                                    <button onClick={() => setCount(prev => prev - 1)} className={`product-page__change-count item${count == 1 && " disabled"}`}>
                                        <svg width={24} height={24} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                                        </svg>
                                    </button>
                                    <p className="product-page__count">{count}</p>
                                    <button onClick={() => setCount(prev => prev + 1)} className="product-page__change-count item">
                                        <svg width={24} height={24} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                    </button>
                                </div>
                                <button className="product-page__add-basket item btn">
                                    В корзину
                                    <svg width={24} height={24} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <p className="text">{product?.desc}</p>
                        <button
                            onClick={toggleFavorite}
                            className={`product-page__wish-btn item${favorites?.includes(product?._id) ? " active" : ""}`}
                        >
                            В избранно{favorites?.includes(product?._id) ? "м" : "е"}
                            <svg width={24} height={24} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="var(--primaryColor)">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="product-tabs">
                    <div className="product-tabs__header">
                        <button
                            onClick={() => setOpenReviews(false)}
                            className={`product-tabs__btn dim${!openReviews ? " active" : ""}`}>
                            Характеристики
                        </button>
                        <button
                            onClick={handleReviewsBtnClick}
                            className={`product-tabs__btn item dim${openReviews ? " active" : ""}`}>
                            Отзывы ({product?.stats?.reviewsCount})
                        </button>
                    </div>
                    {!openReviews ? (
                        <div className="product-tabs__content">
                            <p className="title">Характеристики</p>
                            <div className="table">
                                <div className="table__row">
                                    <p className="bold">Тип</p>
                                    <Link to={`/?type=${product?.type._id}`} className="main-color">{product?.type.name}</Link>
                                </div>
                                <div className="table__row">
                                    <p className="bold">Бренд</p>
                                    <Link to={`/?type=${product?.brand._id}`} className="main-color">{product?.brand.name}</Link>
                                </div>
                                {product?.characteristics.map(item =>
                                    <div key={item._id} className="table__row">
                                        <p className="bold">{item.characteristic}</p>
                                        <p>{item.value}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="product-tabs__content">
                            <div className="product-tabs__title">
                                <p className="title">Отзывы</p>
                                <button className="product-page__add-basket item btn">
                                    Оставить отзыв
                                    <svg width={24} height={24} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                </button>
                            </div>
                            {product?.stats ? (
                                product.stats.reviewsCount > 0 ? (
                                    <div className="reviews">
                                        {reviewImages.length > 0 && (
                                            <div className="reviews__images">
                                                {reviewImages.map(image => (
                                                    <div key={image.id} className="reviews__image ibg">
                                                        <img src={image.url} alt="image" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <div className="reviews__list">
                                            {reviewsData?.reviews.map(review => (
                                                <Review key={review.id} review={review} />
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <>Отзывов никто не оставлял</>
                                )
                            ) : (
                                <>Произошла оишбка при загрузке отзывов</>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    )
};

export default Product;