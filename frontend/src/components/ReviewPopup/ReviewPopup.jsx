import { useState } from 'react';
import Popup from '../Popup/Popup';
import { Rate } from 'antd';
import './ReviewPopup.scss';

const ReviewPopup = ({ active, setActive }) => {

    const [info, setInfo] = useState({
        rate: 0,
        advantages: '',
        disadvantages: '',
        comment: ''
    });

    const changeInfo = (key, value) => {
        setInfo((prev) => ({
            ...prev,
            [key]: value
        }));
    };

    const writeReview = async () => {
        console.log({info});
    };

    return (
        <Popup active={active} setActive={setActive} title={'Отзыв'}>
            <div className="input-wrapper">
                <p className="placeholder">Оценка</p>
                <Rate
                    className="review-popup__rate"
                    onChange={(value) => changeInfo('rate', value)}
                    value={info.rate}
                />
            </div>
            <div className="input-wrapper">
                <p className="placeholder">Преимущества</p>
                <textarea
                    value={info.advantages}
                    onChange={(e) => changeInfo('advantages', e.target.value)}
                    className="textarea"
                    placeholder="Преимущества"
                ></textarea>
            </div>
            <div className="input-wrapper">
                <p className="placeholder">Недостатки</p>
                <textarea
                    value={info.disadvantages}
                    onChange={(e) => changeInfo('disadvantages', e.target.value)}
                    className="textarea"
                    placeholder="Недостатки"
                ></textarea>
            </div>
            <div className="input-wrapper">
                <p className="placeholder">Комментарий</p>
                <textarea
                    value={info.comment}
                    onChange={(e) => changeInfo('comment', e.target.value)}
                    className="textarea"
                    placeholder="Комментарий"
                ></textarea>
            </div>
            <button onClick={writeReview} className="btn popup__btn">
                Отправить
            </button>
        </Popup>
    );
};

export default ReviewPopup;
