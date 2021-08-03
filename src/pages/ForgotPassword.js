import {useState, useContext, useEffect} from 'react';
import {toast} from 'react-toastify';
import {SyncOutlined} from '@ant-design/icons';
import {useHistory} from 'react-router-dom';
import clientAxios from '../utils/axios';
import { Context } from '../context';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(false);
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const {state: {user}} = useContext(Context);

    const router = useHistory();

    useEffect(() => {
        if (user !== null) router.push('/');
        // eslint-disable-next-line
    }, [user]);

    const handlerSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await clientAxios.post('/api/forgot-password', { email });
            setSuccess(true);
            toast('Revisa tu email para ver el codigo');
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast(error.response.data);
        }
    }

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await clientAxios.post('/api/reset-password', {
                email,
                code,
                newPassword
            });
            setEmail('');
            setCode('');
            setNewPassword('');
            setLoading(false);
            toast.success("Correcto! Ahora puedes iniciar sesion con tu nueva contraseña");
        } catch (error) {
            setLoading(false);
            toast(error.response.data);
        }
    }

    return (
        <>
            <h1 className="jumbotron text-center bg-primary square">
                Recuperar Contraseña
            </h1>

            <div className="container col-md-4 offset-md-4 pb-5">
                <form onSubmit={success ? handleResetPassword : handlerSubmit}>
                    <input 
                        type="email"
                        className="form-control mb-4 p-4"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Correo"
                        required
                    />
                    {
                        success && (
                            <>
                            <input 
                                type="text"
                                className="form-control mb-4 p-4"
                                value={code}
                                onChange={e => setCode(e.target.value)}
                                placeholder="Ingresar codigo"
                                required
                            />

                            <input 
                                type="password"
                                className="form-control mb-4 p-4"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                placeholder="Nueva Contraseña"
                                required
                            />
                            </>
                        )
                    }
                    
                    <button 
                        type="submit"
                        className="btn btn-primary btn-block p-2"
                        disabled={loading || !email}
                    >
                        {loading ? <SyncOutlined /> : "Aceptar"}
                    </button>
                </form>
            </div>
        </>
    )
}

export default ForgotPassword
