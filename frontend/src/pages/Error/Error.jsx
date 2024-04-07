import { BugFixing } from '../../components/Icons/BugFixing';
import './Error.scss';

const Error = () => {
    return (
        <div className="error-page">
            <BugFixing width={512} />
            <h1 className="title">Ведутся технические работы</h1>
        </div>
    );
};

export default Error;
