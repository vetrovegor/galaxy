import React, { useState } from "react"
import AdminLayout from "./AdminLayout";
import Search from "../../components/Search/Search";
import Popup from "../../components/Popup/Popup";
import { useMutation, useQueryClient } from "react-query";
import { brandService } from "../../services/brandService";

const AdminBrand = () => {
    const queryClient = useQueryClient();

    const [openCreateForm, setOpenCreateForm] = useState(false);
    const [name, setName] = useState('');

    const { mutate } = useMutation({
        mutationKey: ['create-brand'],
        mutationFn: (brandName) => brandService.createBrand(brandName),
        onSuccess(data) {
            !!data && setOpenCreateForm(false); 
        }
    });

    return (
        <>
            <AdminLayout>
                <div className="admin__header">
                    <h1 className="title">Бренды</h1>
                    <Search placeholder="Поиск" />
                    <button
                        onClick={() => setOpenCreateForm(true)}
                        className="btn admin__btn"
                    >
                        Добавить
                    </button>
                </div>
            </AdminLayout>
            <Popup
                active={openCreateForm}
                setActive={setOpenCreateForm}
                title="Создание бренда"
            >
                <div className="input-wrapper">
                    <p className="placeholder">Бренд</p>
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        type="text"
                        className="input"
                        placeholder="Бренд"
                    />
                </div>
                <button
                    onClick={() => mutate(name)}
                    className="btn admin__btn">
                    Создать бренд
                </button>
            </Popup>
        </>
    )
};

export default AdminBrand;