import React, { useEffect, useState } from 'react';
import './Review.scss';
import { reviewService } from '../../services/reviewService';
import { useQueryClient } from 'react-query';
import { formatDate } from '../../utils/date';
import { Rate, Image, Skeleton } from 'antd';
import CommentForm from '../CommentForm/CommentForm';

const Review = ({ review }) => {
    const {
        id,
        user,
        date,
        rate,
        advantages,
        disadvantages,
        comment,
        images,
        commentsCount,
        likesCount,
        dislikesCount
    } = review || {};

    const queryClient = useQueryClient();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [commentsData, setCommentsData] = useState({
        comments: [],
        elementsCount: 0,
        isLastPage: true,
        totalCount: 0
    });
    const [commentsPage, setCommentsPage] = useState(1);

    const updateComments = async () => {
        const commentsData = await queryClient.fetchQuery({
            queryKey: ['comments'],
            queryFn: () => reviewService.getReviewComments(id, commentsPage)
        });

        setCommentsData((prev) => ({
            ...commentsData,
            comments: [...prev.comments, ...commentsData.comments]
        }));
    };

    const handleOpenComments = async () => {
        setDropdownOpen((prev) => !prev);

        if (commentsData.comments.length == 0) {
            await updateComments();
        }
    };

    const addCommentToTop = (comment) => {
        setCommentsData((prev) => ({
            ...prev,
            comments: [comment, ...prev.comments]
        }));
    };

    useEffect(() => {
        if (commentsPage > 1) {
            updateComments();
        }
    }, [commentsPage]);

    return (
        <div className="review">
            <div className="review__block">
                <div className="bold item">
                    {user ? (
                        <>
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
                        </>
                    ) : (
                        <>
                            <Skeleton.Avatar
                                style={{ width: 24, height: 24 }}
                                active
                            />
                            <Skeleton.Input
                                style={{ width: 100, height: 24 }}
                                active
                            />
                        </>
                    )}
                </div>
                <p className="dim">{formatDate(date)}</p>
            </div>
            <Rate disabled defaultValue={rate} allowHalf />
            <p className="bold">Достоинства</p>
            <p className="text">{advantages}</p>
            <p className="bold">Недостатки</p>
            <p className="text">{disadvantages}</p>
            <p className="bold">Комментарий</p>
            <p className="text">{comment}</p>
            <div className="reviews__images">
                <Image.PreviewGroup>
                    {images.map((image) => (
                        <Image
                            key={image.id}
                            width={125}
                            src={image.url}
                            style={{
                                aspectRatio: '1/1',
                                objectFit: 'cover',
                                borderRadius: 8
                            }}
                        />
                    ))}
                </Image.PreviewGroup>
            </div>
            <div className="review__block">
                <button
                    onClick={handleOpenComments}
                    className={`main-color item${
                        dropdownOpen ? ' active' : ''
                    }`}
                >
                    {commentsCount > 0
                        ? `Комментарии (${commentsCount})`
                        : 'Комментировать'}
                    <svg
                        width={12}
                        height={12}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m19.5 8.25-7.5 7.5-7.5-7.5"
                        />
                    </svg>
                </button>
                <div className="review__reactions item">
                    <div className="item">
                        <button className="item">
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
                                    d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                                />
                            </svg>
                        </button>
                        {likesCount}
                    </div>
                    <div className="item">
                        <button className="item">
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
                                    d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54"
                                />
                            </svg>
                        </button>
                        {dislikesCount}
                    </div>
                </div>
            </div>
            <div className={`review__comments${dropdownOpen ? ' active' : ''}`}>
                <CommentForm reviewId={id} addCommentToTop={addCommentToTop} />
                {commentsData?.comments.map((comment) => (
                    <div key={comment.id} className="review__comment">
                        <div className="review__block">
                            <div className="bold item">
                                {comment?.user ? (
                                    <>
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
                                        {comment.user.nickname}
                                    </>
                                ) : (
                                    <>
                                        <Skeleton.Avatar
                                            style={{ width: 24, height: 24 }}
                                            active
                                        />
                                        <Skeleton.Input
                                            style={{ width: 100, height: 24 }}
                                            active
                                        />
                                    </>
                                )}
                            </div>
                            <p className="dim">{formatDate(comment.date)}</p>
                        </div>
                        <p className="text">{comment.comment}</p>
                    </div>
                ))}
                {!commentsData?.isLastPage && (
                    <button
                        onClick={() => setCommentsPage((prev) => prev + 1)}
                        className="main-color"
                    >
                        Показать еще
                    </button>
                )}
            </div>
        </div>
    );
};

export default Review;
