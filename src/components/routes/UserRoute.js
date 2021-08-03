import { useEffect, useState } from 'react';
import {useHistory} from 'react-router-dom';
import {SyncOutlined} from '@ant-design/icons';
import UserNav from '../nav/UserNav';
import clientAxios from '../../utils/axios';

const UserRoute = ({ children }) => {
    const [ok, setOk] = useState(false);

    const router = useHistory();

    useEffect(() => {
        fetchUser();
        // eslint-disable-next-line
    }, []);

    const fetchUser = async () => {
        try {
            const { data } = await clientAxios.get('/api/current-user');
            if (data.ok) setOk(true);
        } catch (error) {
            console.log(error);
            setOk(false);
            router.push('/');
        }
    }

    return (
        <>
        {
            !ok ? (
                <SyncOutlined 
                    spin 
                    className="d-flex justify-content-center display-1 text-primary p-5" 
                />
            ) : (
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-2">
                            <UserNav />
                        </div>
                        <div className="col-md-10">{children}</div>
                    </div>
                </div>
            )
        }
        </>
    )
}

export default UserRoute;
