import { useNavigate } from 'react-router-dom';
import useUserStore from '../../stores/userStore';
import './CommentForm.scss';
import { reviewService } from '../../services/reviewService';
import { useState } from 'react';
import { formatDate } from '../../utils/date';

const CommentForm = ({ reviewId, insertComment }) => {
    const { user } = useUserStore();
    const navigate = useNavigate();
    const [comment, setComment] = useState('');

    const writeComment = async () => {
        if (!user) {
            return navigate('/auth');
        }

        const status = await reviewService.writeComment(reviewId, comment);

        if (status == 201) {
            const now = Date.now();

            insertComment({
                id: now,
                reviewId,
                comment,
                date: formatDate(now),
                user: { id: user.id, nickname: user.nickname }
            });

            setComment('');
        }
    };

    return (
        <div className="comment-form">
            <textarea
                className="textarea comment-form__textarea"
                placeholder="Написать комментарий"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            ></textarea>
            <button className="btn comment-form__btn" onClick={writeComment}>
                Отправить
            </button>
        </div>
    );
};

export default CommentForm;
