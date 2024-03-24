import React, { useState } from "react"
import AdminLayout from "./AdminLayout";
import Search from "../../components/Search/Search";
import Popup from "../../components/Popup/Popup";
import { useQueryClient } from "react-query";
import { typeService } from "../../services/typeService";
import { brandService } from "../../services/brandService";
import { Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { productService } from "../../services/productService";

const AdminProduct = () => {
    const queryClient = useQueryClient();

    const [openCreateForm, setOpenCreateForm] = useState(false);
    const [types, setTypes] = useState([]);
    const [brands, setBrands] = useState([]);
    const [characteristics, setcharacteristics] = useState([]);
    const [info, setInfo] = useState({
        type: { id: '', name: '' },
        brand: { id: '', name: '' },
        model: '',
        desc: '',
        picture: null,
        price: '',
        characteristics: []
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
        const id = e.target.value;
        const name = e.target[e.target.selectedIndex].text;

        const characteristics = await queryClient.fetchQuery({
            queryKey: ['characteristics'],
            queryFn: () => typeService.getTypeCharacteristics(id)
        });

        setcharacteristics(characteristics);

        setInfo(prev => ({
            ...prev,
            model: `${name} ${info.brand.name} `,
            type: {
                id,
                name
            },
            characteristics: characteristics.map(characteristic => ({
                characteristic,
                value: ''
            }))
        }));
    }

    const handleBrandChange = (e) => {
        const id = e.target.value;
        const name = e.target[e.target.selectedIndex].text;

        setInfo(prev => ({
            ...prev,
            model: `${info.type.name} ${name} `,
            brand: {
                id,
                name
            }
        }));
    }

    const changeInfo = (key, value) => {
        setInfo(prev => ({
            ...prev,
            [key]: value
        }))
    }

    const handleCharacteristicChange = (characteristic, value) => {
        const index = info.characteristics.findIndex(item => item.characteristic == characteristic);

        const updatedCharacteristics = [...info.characteristics];

        updatedCharacteristics[index].value = value;

        changeInfo('characteristics', updatedCharacteristics);
    };

    const handlePictureChange = (e) => {
        changeInfo('picture', e.file);
        return false;
    };

    const handleCreateProduct = async () => {
        const { type, brand, model, desc, picture, price, characteristics } = info;

        const formData = new FormData();

        formData.append('type', type.id);
        formData.append('brand', brand.id);
        formData.append('model', model);
        formData.append('desc', desc);
        formData.append('picture', picture);
        formData.append('price', price);

        characteristics.forEach((item, index) => {
            formData.append(`characteristics[${index}][characteristic]`, item.characteristic);
            formData.append(`characteristics[${index}][value]`, item.value);
        });

        await productService.createProduct(formData);

        setOpenCreateForm(false);
    }

    return (
        <>
            <AdminLayout>
                <div className="admin__header">
                    <h1 className="title">Товары</h1>
                    <Search placeholder="Поиск" />
                    <button
                        onClick={handleOpenCreateProductPopup}
                        className="btn admin__btn"
                    >
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
                            value={info.type.id}
                            onChange={handleTypeChange}
                        >
                            <option value="" disabled hidden>Выберите тип</option>
                            {types.map(type => (
                                <option key={type._id} value={type._id}>{type.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="input-wrapper">
                        <p className="placeholder">Бренд</p>
                        <select
                            className="select"
                            value={info.brand.id}
                            onChange={handleBrandChange}
                        >
                            <option value="" disabled hidden>Выберите бренд</option>
                            {brands.map(brand => (
                                <option key={brand._id} value={brand._id}>{brand.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="input-wrapper">
                        <p className="placeholder">Модель</p>
                        <input
                            value={info.model}
                            onChange={e => changeInfo('model', e.target.value)}
                            type="text"
                            className="input"
                            placeholder="Модель"
                        />
                    </div>
                    <div className="input-wrapper">
                        <p className="placeholder">Описание</p>
                        <textarea
                            value={info.desc}
                            onChange={e => changeInfo('desc', e.target.value)}
                            className="textarea"
                            placeholder="Описание"
                        ></textarea>
                    </div>
                    <Upload
                        listType="picture-card"
                        accept=".png,.jpeg,.jpg"
                        maxCount={1}
                        onChange={handlePictureChange}
                        beforeUpload={() => false}
                    >
                        <button style={{ border: 0, background: 'none' }} type="button">
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </button>
                    </Upload>
                    <div className="input-wrapper">
                        <p className="placeholder">Цена</p>
                        <input
                            value={info.price}
                            onChange={e => changeInfo('price', e.target.value)}
                            type="number"
                            className="input"
                            placeholder="Цена"
                            min={0}
                        />
                    </div>
                    {characteristics.map((characteristic, i) => (
                        <div key={i} className="input-wrapper">
                            <p className="placeholder">{characteristic}</p>
                            <input
                                value={info.characteristics[i].value || ''}
                                onChange={e => handleCharacteristicChange(characteristic, e.target.value)}
                                type="text"
                                className="input"
                                placeholder={characteristic}
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