import {Link} from 'react-router-dom';
import { useEffect, useState } from 'react';

const UserNav = () => {
    const [current, setCurrent] = useState('');

    useEffect(() => {
        process.browser && setCurrent(window.location.pathname);
        // eslint-disable-next-line
    }, [process.browser && window.location.pathname]);

    return (
        <div className="nav flex-column nav-pills">
            <Link to="/user" className={`nav-link ${current === '/user' && 'active'}`}>
                Dashboard
            </Link>
        </div>
    )
}

export default UserNav;