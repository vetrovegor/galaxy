import { useMutation } from 'react-query';
import Popup from '../Popup/Popup';
import { userService } from '../../services/userService';
import { useState } from 'react';

const AddressPopup = ({ active, setActive, addAddress }) => {
    const initialValue = {
        street: '',
        floor: '',
        flat: ''
    };

    const [info, setInfo] = useState(initialValue);

    const changeInfo = (key, value) => {
        setInfo((prev) => ({
            ...prev,
            [key]: value
        }));
    };

    const { mutate } = useMutation({
        mutationKey: ['addresses'],
        mutationFn: () => userService.createAddresses(info),
        onSuccess(address) {
            setInfo(initialValue);
            setActive(false);
            addAddress(address);
        }
    });

    return (
        <Popup title="Добавление адреса" active={active} setActive={setActive}>
            <div className="input-wrapper">
                <p className="placeholder">Улица</p>
                <input
                    value={info.street}
                    onChange={(e) => changeInfo('street', e.target.value)}
                    type="text"
                    className="input"
                    placeholder="Улица"
                />
            </div>
            <div className="input-wrapper">
                <p className="placeholder">Этаж</p>
                <input
                    value={info.floor}
                    onChange={(e) =>
                        changeInfo('floor', Number(e.target.value))
                    }
                    type="number"
                    className="input"
                    placeholder="Этаж"
                />
            </div>
            <div className="input-wrapper">
                <p className="placeholder">Квартира</p>
                <input
                    value={info.flat}
                    onChange={(e) => changeInfo('flat', Number(e.target.value))}
                    type="number"
                    className="input"
                    placeholder="Квартира"
                    min={1}
                />
            </div>
            <button onClick={mutate} className="btn popup__btn">
                Добавить
            </button>
        </Popup>
    );
};

export default AddressPopup;
