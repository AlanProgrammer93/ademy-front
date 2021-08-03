import {Link} from 'react-router-dom';
import { useEffect, useState } from 'react';

const InstructorNav = () => {
    const [current, setCurrent] = useState('');

    useEffect(() => {
        process.browser && setCurrent(window.location.pathname);
    }, [process.browser && window.location.pathname]);

    return (
        <div className="nav flex-column nav-pills">
            <Link to="/instructor" className={`nav-link ${current === '/instructor' && 'active'}`}>
                Dashboard
            </Link>
            <Link to="/instructor/course/create" className={`nav-link ${current === '/instructor/course/create' && 'active'}`}>
                Crear Curso
            </Link>
            <Link to="/instructor/revenue" className={`nav-link ${current === '/instructor/revenue' && 'active'}`}>
                Ingresos
            </Link>
        </div>
    )
}

export default InstructorNav;