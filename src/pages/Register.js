import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { SyncOutlined } from '@ant-design/icons';
import {Link, useHistory} from 'react-router-dom';
import { Context } from '../context';
import clientAxios from '../utils/axios';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const {state} = useContext(Context);
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
            const {data} = await clientAxios.post(`/api/register`, {
                name,
                email,
                password
            });

            toast.success(`Usuario ${data.name} registrado correctamente!`);
            setName('');
            setEmail('');
            setPassword('');
            setLoading(false);
            router.push('/login');
        } catch (error) {
            toast.error(error.response.data);
            setLoading(false);
        }
    }

    return (
        <>
            <h1 className="jumbotron text-center bg-primary square">Registrarse</h1>
            <div className="container col-md-4 offset-md-4 pb-5">
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        className="form-control mb-4 p-4" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ingresar Nombre" 
                        required
                    />
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
                        disabled={!name || !email || !password || loading}
                    >
                        {loading ? <SyncOutlined spin /> : "Aceptar"}
                    </button>
                </form>

                <p className="text-center p-3">
                    Ya Estas Registrado?{" "}
                    <Link to="/login">
                        Iniciar Sesion
                    </Link>
                </p>
            </div>
        </>
    )
}

export default Register

