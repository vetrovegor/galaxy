import { useEffect } from 'react';
import './Popup.scss';

const Popup = ({ active, setActive, title, children }) => {
    useEffect(() => {
        const popup = document.querySelector('.popup');

        popup.addEventListener('click', (e) => {
            if (!e.target.closest('.popup__inner')) {
                setActive(false);
            }
        });
    }, []);

    return (
        <div className={`popup${active ? ' active' : ''}`}>
            <div className="popup__container">
                <div className="popup__inner">
                    <div className="popup__header">
                        <p className="title">{title}</p>
                        <button
                            onClick={() => setActive(false)}
                            className="item"
                        >
                            <svg
                                width={32}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18 18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Popup;
