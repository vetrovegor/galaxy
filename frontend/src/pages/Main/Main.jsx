import React from "react";
import { Header } from "../../components/Header/Header";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { useQuery } from "react-query";
import { productService } from "../../services/productService";
import { Link } from "react-router-dom";
import "./Main.scss";
import Layout from "../Layout/Layout";
import { typeService } from "../../services/typeService";
import { Rate } from "antd";
import Product from "../../components/Product/Product";

const Main = () => {
    const { data: types } = useQuery({
        queryKey: ['types'],
        queryFn: () => typeService.getTypes()
    });

    const { data: productsData } = useQuery({
        queryKey: ['products'],
        queryFn: () => productService.getProducts()
    });

    return (
        <Layout showSearch={true}>
            <div className="main__inner">
                <Sidebar>
                    {types?.map(type => (
                        <li key={type._id} className="sidebar__item">
                            <Link to={`?type=${type.name}`} className="sidebar__link link item">
                                <svg width={24} height={24} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                                </svg>
                                {type.name}
                                <svg width={12} height={12} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="sidebar__arrow">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                            </Link>
                        </li>
                    ))}
                </Sidebar>
                <div className="main__content products">
                    {productsData?.data.map(product => (
                        <Product key={product._id} product={product} />
                    ))}
                </div>
            </div>
        </Layout>
    )
};

export default Main;