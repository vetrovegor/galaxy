import React, { useState } from "react"
import AdminLayout from "./AdminLayout";
import Search from "../../components/Search/Search";
import Popup from "../../components/Popup/Popup";
import { useQueryClient } from "react-query";
import { typeService } from "../../services/typeService";
import { brandService } from "../../services/brandService";
import { Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const AdminProduct = () => {
    const queryClient = useQueryClient();

    const [openCreateForm, setOpenCreateForm] = useState(false);
    const [types, setTypes] = useState([]);
    const [brands, setBrands] = useState([]);
    const [charateristics, setCharateristics] = useState([]);
    const [info, setInfo] = useState({
        type: { typeId: '', name: '' },
        brand: { brandId: '', name: '' },
        model: '',
        desc: '',
        picture: null,
        price: '',
        charateristics: []
    });

    const handleOpenCreateProductPopup = async () => {
        setOpenCreateForm(true);

        const types = await queryClient.fetchQuery({
            queryKey: ['types'],
            queryFn: () => typeService.getTypes()
        });

        const brands = await queryClient.fetchQuery({
            queryKey: ['brands'],
            queryFn: () => brandService.getBrands()
        });

        setTypes(types);
        setBrands(brands);
    };

    const handleTypeChange = async (e) => {
        const typeId = e.target.value;

        setInfo(prev => {
            return {
                ...prev,
                type: {
                    typeId,
                    name: e.target[e.target.selectedIndex].text
                }
            }
        });

        const charateristics = await queryClient.fetchQuery({
            queryKey: ['charateristics'],
            queryFn: () => typeService.getTypeCharacteristics(typeId)
        });

        setCharateristics(charateristics);

        setInfo(prev => {
            return {
                ...prev,
                charateristics: charateristics.map(charateristic => ({
                    charateristic,
                    value: ''
                }))
            };
        });
    }

    const handleCharacteristicChange = (charateristic, value) => {
        const index = info.charateristics.findIndex(item => item.charateristic == charateristic);

        const updatedCharacteristics = [...info.charateristics];

        updatedCharacteristics[index].value = value;

        setInfo(prev => ({
            ...prev,
            charateristics: updatedCharacteristics
        }));
    };

    const handlePictureChange = (info) => {
        if (info.file.status === 'done') {
            // Обновляем состояние с выбранным файлом
            setInfo(prev => ({
                ...prev,
                picture: info.file.originFileObj // сохраняем файл в состоянии
            }));
        }
    };

    const handleCreateProduct = async (e) => {
        console.log({ ...info });
    }

    return (
        <>
            <AdminLayout>
                <div className="admin__header">
                    <h1 className="title">Товары</h1>
                    <Search placeholder="Поиск" />
                    <button
                        onClick={handleOpenCreateProductPopup}
                        className="btn admin__btn">
                        Добавить
                    </button>
                </div>
            </AdminLayout>
            <Popup
                active={openCreateForm}
                setActive={setOpenCreateForm}
                title="Создание товара"
            >
                <div className="inputs">
                    <div className="input-wrapper">
                        <p className="placeholder">Тип</p>
                        <select
                            className="select"
                            value={info.type.typeId}
                            onChange={handleTypeChange}
                        >
                            <option value="" disabled hidden>Выберите тип</option>
                            {types.map(type => (
                                <option key={type._id} value={type._id}>{type.name}</option>
                            ))}
                        </select>
                    </div>
                    {info.type.typeId} {info.type.name}
                    <div className="input-wrapper">
                        <p className="placeholder">Бренд</p>
                        <select
                            className="select"
                            value={info.brand.brandId}
                            onChange={e => setInfo(prev => {
                                return {
                                    ...prev,
                                    brand: {
                                        brandId: e.target.value,
                                        name: e.target[e.target.selectedIndex].text
                                    }
                                }
                            })}
                        >
                            <option value="" disabled hidden>Выберите бренд</option>
                            {brands.map(brand => (
                                <option key={brand._id} value={brand._id}>{brand.name}</option>
                            ))}
                        </select>
                    </div>
                    {info.brand.brandId} {info.brand.name}
                    <div className="input-wrapper">
                        <p className="placeholder">Модель</p>
                        <input
                            value={info.model}
                            onChange={e => setInfo(prev => {
                                return {
                                    ...prev,
                                    model: e.target.value
                                }
                            })}
                            type="text"
                            className="input"
                            placeholder="Модель"
                        />
                    </div>
                    <div className="input-wrapper">
                        <p className="placeholder">Описание</p>
                        <textarea
                            value={info.desc}
                            onChange={e => setInfo(prev => {
                                return {
                                    ...prev,
                                    desc: e.target.value
                                }
                            })}
                            className="textarea"
                            placeholder="Описание"
                        ></textarea>
                    </div>
                    <Upload listType="picture-card" onChange={handlePictureChange}>
                        <button style={{ border: 0, background: 'none' }} type="button">
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </button>
                    </Upload>
                    <div className="input-wrapper">
                        <p className="placeholder">Цена</p>
                        <input
                            value={info.price}
                            onChange={e => setInfo(prev => {
                                return {
                                    ...prev,
                                    price: e.target.value
                                }
                            })}
                            type="number"
                            className="input"
                            placeholder="Цена"
                            min={0}
                        />
                    </div>
                    {charateristics.map((charateristic, i) => (
                        <div key={i} className="input-wrapper">
                            <p className="placeholder">{charateristic}</p>
                            <input
                                value={info.charateristics[i].value || ''}
                                onChange={e => handleCharacteristicChange(charateristic, e.target.value)}
                                type="text"
                                className="input"
                                placeholder={charateristic}
                            />
                        </div>
                    ))}
                </div>
                <button
                    onClick={handleCreateProduct}
                    className="btn admin__btn">
                    Создать товар
                </button>
            </Popup>
        </>
    )
};

export default AdminProduct;