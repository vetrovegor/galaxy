import React, { useEffect, useState } from "react";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { useQuery, useQueryClient } from "react-query";
import { productService } from "../../services/productService";
import { Link, useNavigate } from "react-router-dom";
import "./Main.scss";
import Layout from "../Layout/Layout";
import { typeService } from "../../services/typeService";
import Product from "../../components/Product/Product";
import { Pagination } from "antd";
import useFavoriteStore from "../../stores/favoriteStore";

const Main = () => {
    const queryClient = useQueryClient();

    const navigate = useNavigate();

    const queryParams = new URLSearchParams(window.location.search);

    const [page, setPage] = useState(queryParams.get("page") || 1);
    const limit = 9;
    const [type, setType] = useState(queryParams.get("type"));
    const [productsData, setProductsData] = useState(null);
    const [totalCount, setTotalCount] = useState(0);

    const { data: types } = useQuery({
        queryKey: ['types'],
        queryFn: () => typeService.getTypes()
    });

    const handlePageChange = (newPage) => {
        setPage(newPage);
        navigate(`?page=${newPage}`);
    };

    const handleTypehange = (typeId) => {
        setType(typeId);
        handlePageChange(1);
    };

    const fetchProducts = async () => {
        const productsData = await queryClient.fetchQuery({
            queryKey: ['products'],
            queryFn: () => productService.getProducts(
                page,
                limit,
                type,
                queryParams.get("brand")
            )
        });

        setProductsData(productsData);
        setTotalCount(productsData.totalCount);
    }

    useEffect(() => {
        fetchProducts();
    }, [page, type]);

    return (
        <Layout showSearch={true}>
            <div className="main__inner">
                <Sidebar>
                    {types?.map(type => (
                        <li key={type._id} className="sidebar__item">
                            <button onClick={() => handleTypehange(type._id)} className="sidebar__link link item">
                                <svg width={24} height={24} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                                </svg>
                                {type.name}
                                <svg width={12} height={12} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="sidebar__arrow">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>
                        </li>
                    ))}
                </Sidebar>
                <div className="main__content">
                    <div className="products">
                        {productsData?.data.map(product => (
                            <Product key={product._id} product={product} />
                        ))}
                    </div>
                    <Pagination
                        defaultCurrent={page}
                        total={totalCount}
                        pageSize={limit}
                        onChange={handlePageChange}
                    />
                </div>
            </div>
        </Layout>
    )
};

export default Main;