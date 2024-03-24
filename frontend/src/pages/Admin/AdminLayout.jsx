import React, { Children } from "react"
import "./Admin.scss";
import Layout from "../Layout/Layout";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { Link } from "react-router-dom";

const AdminLayout = ({children}) => {
    return (
        <Layout>
            <div className="main__inner">
                <Sidebar>
                    <li className="sidebar__item">
                        <Link to="/admin/types" className="sidebar__link link item">
                            <svg width={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucideWashing-machine"><path d="M3 6h3" /><path d="M17 6h.01" /><rect width="18" height="20" x="3" y="2" rx="2" /><circle cx="12" cy="13" r="5" /><path d="M12 18a2.5 2.5 0 0 0 0-5 2.5 2.5 0 0 1 0-5" /></svg>
                            Типы
                            <svg width={12} height={12} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="sidebar__arrow">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </Link>
                    </li>
                    <li className="sidebar__item">
                        <Link to="/admin/brands" className="sidebar__link link item">
                            <svg width={24} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chrome"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><line x1="21.17" x2="12" y1="8" y2="8" /><line x1="3.95" x2="8.54" y1="6.06" y2="14" /><line x1="10.88" x2="15.46" y1="21.94" y2="14" /></svg>
                            Бренды
                            <svg width={12} height={12} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="sidebar__arrow">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </Link>
                    </li>
                    <li className="sidebar__item">
                        <Link to="/admin/products" className="sidebar__link link item">
                            <svg width={24} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-align-justify"><line x1="3" x2="21" y1="6" y2="6" /><line x1="3" x2="21" y1="12" y2="12" /><line x1="3" x2="21" y1="18" y2="18" /></svg>
                            Товары
                            <svg width={12} height={12} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="sidebar__arrow">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </Link>
                    </li>
                    <li className="sidebar__item">
                        <Link to="/admin/reviews" className="sidebar__link link item">
                            <svg width={24} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star-half"><path d="M12 17.8 5.8 21 7 14.1 2 9.3l7-1L12 2" /></svg>
                            Отзывы
                            <svg width={12} height={12} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="sidebar__arrow">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </Link>
                    </li>
                    <li className="sidebar__item">
                        <Link to="/admin/orders" className="sidebar__link link item">
                            <svg width={24} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send-to-back"><rect x="14" y="14" width="8" height="8" rx="2" /><rect x="2" y="2" width="8" height="8" rx="2" /><path d="M7 14v1a2 2 0 0 0 2 2h1" /><path d="M14 7h1a2 2 0 0 1 2 2v1" /></svg>
                            Заказы
                            <svg width={12} height={12} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="sidebar__arrow">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </Link>
                    </li>
                </Sidebar>
                <div className="main__content admin__content">
                    {children}
                </div>
            </div>
        </Layout>
    )
};

export default AdminLayout;