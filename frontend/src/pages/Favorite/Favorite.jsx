import { useQuery } from 'react-query';
import { favoriteService } from '../../services/favoriteService';
import Layout from '../Layout/Layout';
import Product from '../../components/Product/Product';

const Favorite = () => {
    const { data: products } = useQuery({
        queryKey: ['favorites'],
        queryFn: () => favoriteService.getFavorites()
    });

    return (
        <Layout>
            <div className="main__content">
                <h1 className="title">Избранное</h1>
                <div className="products">
                    {products?.map((product) => (
                        <Product key={product._id} product={product} />
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default Favorite;
