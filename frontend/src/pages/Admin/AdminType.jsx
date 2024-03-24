import React from "react"
import AdminLayout from "./AdminLayout";
import Search from "../../components/Search/Search";

const AdminType = () => {
    return (
        <AdminLayout>
            <div className="admin__header">
                <h1 className="title">Типы</h1>
                <Search placeholder="Поиск" />
                <button className="btn admin__btn">Добавить</button>
            </div>
        </AdminLayout>
    )
};

export default AdminType;