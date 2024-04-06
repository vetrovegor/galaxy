import { useState } from 'react';
import Popup from '../Popup/Popup';
import { Rate, Upload } from 'antd';
import './ReviewPopup.scss';
import { PlusOutlined } from '@ant-design/icons';
import { reviewService } from '../../services/reviewService';
import useUserStore from '../../stores/userStore';

const ReviewPopup = ({ productId, active, setActive, addReviewToTop }) => {
    const { user } = useUserStore();

    const infoDefaultValue = {
        productId,
        rate: 0,
        advantages: '',
        disadvantages: '',
        comment: '',
        images: []
    };

    const [info, setInfo] = useState(infoDefaultValue);

    const changeInfo = (key, value) => {
        setInfo((prev) => ({
            ...prev,
            [key]: value
        }));
    };

    const writeReview = async () => {
        const { productId, rate, advantages, disadvantages, comment, images } =
            info;

        const formData = new FormData();

        formData.append('productId', productId);
        formData.append('rate', rate);
        formData.append('advantages', advantages);
        formData.append('disadvantages', disadvantages);
        formData.append('comment', comment);

        images.forEach(({ originFileObj }) => {
            formData.append('images', originFileObj);
        });

        const { review } = await reviewService.writeReview(formData);

        if (review) {
            setInfo(infoDefaultValue);
            addReviewToTop({
                ...review,
                user
            });
            setActive(false);
        }
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
                    onChange={(e) =>
                        changeInfo('disadvantages', e.target.value)
                    }
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
            <Upload
                listType="picture-card"
                accept=".png,.jpeg,.jpg"
                multiple
                fileList={info.images}
                onChange={({ fileList }) => changeInfo('images', fileList)}
                beforeUpload={() => false}
            >
                <button style={{ border: 0, background: 'none' }} type="button">
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                </button>
            </Upload>
            <button onClick={writeReview} className="btn popup__btn">
                Отправить
            </button>
        </Popup>
    );
};

export default ReviewPopup;
