import Layout from '../Layout/Layout';
import { Delete } from '../../components/Icons/Delete';

const Basket = () => {
    return (
        <Layout>
            <div className="basket__cols">
                <div className="basket__col basket__col_products">
                    <h1 className="title">Корзина</h1>
                    <div className="table-basket">
                        <div className="table-basket__part">
                            <div className="table-basket__column table-basket__product-column"></div>
                            <div className="table-basket__column table-basket__price-column"></div>
                            <div className="table-basket__column table-basket__quantity-column"></div>
                            <div className="table-basket__column table-basket__total-column"></div>
                            <div className="table-basket__column table-basket__delete-column"></div>
                        </div>
                    </div>
                </div>
                <div className="basket__col basket__col_total"></div>
            </div>
        </Layout>
    );
};

export default Basket;
