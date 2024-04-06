import { useMutation } from 'react-query';
import './Address.scss';
import { userService } from '../../services/userService';

const Address = ({ address, deleteAddress }) => {
    const { id, street, floor, flat } = address;

    const { mutate } = useMutation({
        mutationKey: ['delete-address'],
        mutationFn: () => userService.deleteAddresses(id),
        onSuccess(success) {
            deleteAddress(id);
        }
    });

    return (
        <div className="address">
            <div className="item">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-map-pin"
                >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                </svg>
                <p className="bold">{street}</p>
            </div>
            <p>
                Этаж: <span className="bold">{floor}</span>
            </p>
            <p>
                Квартира: <span className="bold">{flat}</span>
            </p>
            <button onClick={mutate} className="address__delete-btn item">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    <line x1="10" x2="10" y1="11" y2="17" />
                    <line x1="14" x2="14" y1="11" y2="17" />
                </svg>
            </button>
        </div>
    );
};

export default Address;
