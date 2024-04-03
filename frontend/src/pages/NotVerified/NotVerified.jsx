import { Link } from 'react-router-dom';
import { useState } from 'react';
import { userService } from '../../services/userService';
import { useQueryClient } from 'react-query';
import './NotVerified.scss';

const Verified = ({ email }) => {
    const queryClient = useQueryClient();

    const [isLoading, setLoading] = useState(false);

    const handleSendVerifyCode = async () => {
        setLoading(true);

        await queryClient.fetchQuery({
            queryKey: ['verify-code'],
            queryFn: () => userService.sendVerifyCode()
        });

        setLoading(false);
    };

    return (
        <div className="not-verified">
            <h1 className="not-verified__title title">Верификация</h1>
            <p className="not-verified__text">
                Ссылка для подтверждения была выслана на адрес:{' '}
                <span className="main-color bold">{email}</span>
            </p>
            <div className="not-verified__btns">
                <Link to="/" className="not-verified__btn btn">
                    На главную
                </Link>
                <button
                    onClick={handleSendVerifyCode}
                    className={`not-verified__btn btn not-verified__again-btn${isLoading ? ' disabled' : ''}`}
                >
                    Выслать повторно
                </button>
            </div>
        </div>
    );
};

export default Verified;
