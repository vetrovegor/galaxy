import { useState } from 'react';
import { userService } from '../../services/userService';
import Layout from '../Layout/Layout';
import './Profile.scss';
import { useQuery } from 'react-query';
import Address from '../../components/Address/Address';
import AddressPopup from '../../components/AddressPopup/AddressPopup';

const Profile = () => {
    const [addresses, setAddresses] = useState([]);
    const [openAddressPopup, setPpenAddressPopup] = useState(false);

    useQuery({
        queryKey: ['types'],
        queryFn: () => userService.getAddresses(),
        onSuccess(data) {
            setAddresses(data);
        }
    });

    const addAddress = (address) => {
        setAddresses((prev) => [...prev, address]);
    };

    const deleteAddress = (addressId) => {
        setAddresses((prev) =>
            prev.filter((address) => address.id !== addressId)
        );
    };

    return (
        <>
            <Layout>
                <div className="profile__columns">
                    <div className="profile__column">
                        <p className="title">Адреса</p>
                        <div className="profile__addresses">
                            {addresses.map((address) => (
                                <Address
                                    key={address.id}
                                    address={address}
                                    deleteAddress={deleteAddress}
                                />
                            ))}
                        </div>
                        <button
                            onClick={() => setPpenAddressPopup(true)}
                            className="btn profile__btn"
                        >
                            Добавить адрес
                        </button>
                    </div>
                    <div className="profile__column">
                        <p className="title">Заказы</p>
                    </div>
                </div>
            </Layout>
            <AddressPopup
                active={openAddressPopup}
                setActive={setPpenAddressPopup}
                addAddress={addAddress}
            />
        </>
    );
};

export default Profile;
