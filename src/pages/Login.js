import React, { useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { SyncOutlined } from '@ant-design/icons';
import { Link, useHistory } from 'react-router-dom';
import { Context } from '../context';
import clientAxios from '../utils/axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const {state, dispatch} = useContext(Context);
    const { user } = state;

    const router = useHistory();

    useEffect(() => {
        if (user !== null) router.push('/');
        // eslint-disable-next-line
    }, [user])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const {data} = await clientAxios.post(`/api/login`, {
                email,
                password
            });

            dispatch({
                type: "LOGIN",
                payload: data.user,
            });
            clientAxios.defaults.headers["x-token"] = data.token;

            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            
            //router.push("/user");
            //setLoading(false);
        } catch (error) {
            toast.error(error.response.data);
            setLoading(false);
        }
    }

    return (
        <>
            <h1 className="jumbotron text-center bg-primary square">Iniciar Sesion</h1>
            <div className="container col-md-4 offset-md-4 pb-5">
                <form onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        className="form-control mb-4 p-4" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Ingresar Email" 
                        required
                    />
                    <input 
                        type="password" 
                        className="form-control mb-4 p-4" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Ingresar Contraseña" 
                        required
                    />
                    <br />
                    <button 
                        type="submit" 
                        className="btn btn-block btn-primary"
                        disabled={!email || !password || loading}
                    >
                        {loading ? <SyncOutlined spin /> : "Aceptar"}
                    </button>
                </form>

                <p className="text-center pt-3">
                    No tienes una cuenta?{" "}
                    <Link to="/register">
                        Registrate aqui
                    </Link>
                </p>

                <p className="text-center">
                    <Link to="/forgot-password" className="text-danger">
                        Recuperar Contraseña
                    </Link>
                </p>
            </div>
        </>
    )
}

export default Login

