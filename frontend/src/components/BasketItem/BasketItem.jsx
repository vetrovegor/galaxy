import { useMutation } from 'react-query';
import './BasketItem.scss';
import { Close } from '../../components/Icons/Close';
import { Delete } from '../../components/Icons/Delete';
import { basketService } from '../../services/basketService';
import useBasketStore from '../../stores/basketStore';

const BasketItem = ({ basketItem }) => {
    const { _id, model, price, picture, quantity, sum } = basketItem;

    const { removeProduct } = useBasketStore();

    const { mutate } = useMutation({
        mutationKey: ['remove-product'],
        mutationFn: () => basketService.removeProduct(_id),
        onSuccess(success) {
            if(success) {
                removeProduct(_id);
            }
        }
    });

    return (
        <div className="basket-item">
            <a href={`/product/${_id}`} className="basket-item__picture ibg">
                <img src={picture} alt="picture" />
            </a>
            <div className="basket-item__info">
                <div className="basket-item__header">
                    <a href={`/product/${_id}`} className="link">
                        {model}
                    </a>
                    <button
                        onClick={mutate}
                        className="basket-item__delete item"
                    >
                        <Delete width={16} />
                    </button>
                </div>
                <div className="basket-item__price bold">
                    <p>
                        {quantity}
                        <Close width={12} strokeWidth={3} />
                        {price}₽
                    </p>
                    <p>{sum}₽</p>
                </div>
            </div>
        </div>
    );
};

export default BasketItem;
