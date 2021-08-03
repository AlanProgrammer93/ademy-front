import { useEffect, useState, useContext } from 'react';
import { Menu } from 'antd';
import {Link, useHistory} from 'react-router-dom';
import {
    AppstoreOutlined,
    CoffeeOutlined,
    LoginOutlined,
    UserAddOutlined,
    CarryOutOutlined,
    TeamOutlined
} from '@ant-design/icons'
import {Context} from '../context';
import clientAxios from '../utils/axios';

const { Item, SubMenu, ItemGroup } = Menu;

const TopNav = () => {
    const [current, setCurrent] = useState('');

    const {state, dispatch} = useContext(Context);
    const { user } = state;

    const router = useHistory();

    useEffect(() => {
        process.browser && setCurrent(window.location.pathname);
        // eslint-disable-next-line
    }, [process.browser && window.location.pathname]);

    const logout = async () => {
        dispatch({ type: "LOGOUT" });
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        await clientAxios.get("/api/logout");
        router.push('/login');
    }

    return (
        <Menu theme="dark" mode="horizontal" selectedKeys={[current]} className="mb-2" style={{display: 'flex', justifyContent: 'space-around'}}>
            <Item key="/" onClick={e => setCurrent(e.key)} icon={<AppstoreOutlined />}>
                <Link to="/">
                    ADEMY
                </Link>
            </Item>

            {
                user && user.role && user.role.includes('Instructor') && (
                    <Item  
                        key="/instructor" 
                        onClick={e => setCurrent(e.key)} 
                        icon={<TeamOutlined />}
                    
                    >
                        <Link to="/instructor">
                            Dashboard
                        </Link>
                    </Item>
                )
            }

            {
                user && user.role && user.role.includes('Instructor') ? (
                    <Item  
                        key="/instructor/course/create" 
                        onClick={e => setCurrent(e.key)} 
                        icon={<CarryOutOutlined />}
                    >
                        <Link to="/instructor/course/create">
                            Crear Curso
                        </Link>
                    </Item>
                ) : user != null && user.role && user.role.includes('Subscriber') && (
                    <Item  
                        key="/user" 
                        onClick={e => setCurrent(e.key)} 
                        icon={<TeamOutlined />}
                    >
                        <Link to="/user">
                            Dashboard
                        </Link>
                    </Item>
                )
            }

            {
                user === null && (
                    <>
                        <Item  key="/login" onClick={e => setCurrent(e.key)} icon={<LoginOutlined />}>
                            <Link to="/login">
                                Iniciar
                            </Link>
                        </Item>
                        <Item  key="/register" onClick={e => setCurrent(e.key)} icon={<UserAddOutlined />}>
                            <Link to="/register">
                                Registro
                            </Link>
                        </Item>
                    </>
                )
            }

            {
                user !== null && (
                    <SubMenu key="user-menu" icon={<CoffeeOutlined />} title={user && user.name} >
                        <ItemGroup>
                            {
                                user.role.includes('Subscriber') ? (
                                    <>
                                        <Item key="/user">
                                            <Link 
                                                to="/user"
                                                onClick={e => setCurrent(e.key)}
                                            >
                                                Dashboard
                                            </Link>
                                        </Item>
                                        <Item key="/user/become-instructor">
                                            <Link 
                                                to="/user/become-instructor"
                                                onClick={e => setCurrent(e.key)}
                                            >
                                                Convertirse En Instructor
                                            </Link>
                                        </Item>
                                    </>
                                ) : (
                                    <>
                                        <Item 
                                            key="/instructor"
                                            onClick={e => setCurrent(e.key)}
                                        >
                                            <Link to="/instructor">
                                                Dashboard
                                            </Link>
                                        </Item>
                                        <Item  
                                            key="/instructor/course/create" 
                                            onClick={e => setCurrent(e.key)} 
                                        >
                                            <Link to="/instructor/course/create">
                                                Crear Curso
                                            </Link>
                                        </Item>
                                    </>
                                )
                            }
                            <Item key="signout" onClick={logout}>
                                Salir
                            </Item>
                        </ItemGroup>
                    </SubMenu>
                )
            }
        </Menu>
    )
}

export default TopNav
