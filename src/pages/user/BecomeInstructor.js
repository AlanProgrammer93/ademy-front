import {useContext, useState} from 'react';
import {
    UserSwitchOutlined,
} from '@ant-design/icons';
import {toast} from 'react-toastify';
import { useHistory } from 'react-router-dom';
import clientAxios from '../../utils/axios';
import { Context } from '../../context';

const BecomeInstructor = () => {
    const [loading, setLoading] = useState(false);
    const router = useHistory();
    const {dispatch} = useContext(Context);

    const [dataInstructor, setDataInstructor] = useState({
        bankName: '',
        number: '',
        nameTarget: '',
        validDate: '',
        ccv: ''
    });


    const becameInstructor = () => {
        console.log(dataInstructor);
        setLoading(true);
        
        // TODO: hacer las validaciones de la tarjeta

        clientAxios.post('/api/make-instructor', dataInstructor)
            .then(res => {
                let dataStorage = JSON.parse(localStorage.getItem("user"));
                
                dataStorage.role[0] = 'Instructor';
                localStorage.setItem("user", JSON.stringify(dataStorage));
                
                const userLocalStorage = localStorage.getItem('user');
        
                dispatch({
                    type: "LOGIN",
                    payload: JSON.parse(userLocalStorage)
                });
                clientAxios.defaults.headers["x-token"] = localStorage.getItem('token');
        
                toast.success('Todo listo! Ya puedes publicar tus cursos!');
                setLoading(false);
                router.push('/instructor');
            })
            .catch(err => {
                console.log(err);
                toast.warning('Error al registrarse como instructor. Intentelo otra ves.');
                setLoading(false);
            })
    }

    return (
        <>
            <h1 className="jumbotron text-center square">
                Ser un Instructor
            </h1>

            <div className="container">
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        <div className="pt-3">
                            <div className="text-center">
                                <UserSwitchOutlined className="display-1 pb-3" />
                                <br />

                                <p className="lead text-primary">
                                    Asociar Ademy con una tarjeta para transferir ganancias a tu cuanta bancaria
                                </p>
                            </div>

                            <div className="body-custom">
                            <div className="payment-custom">
                                <div className="bg-custom"></div>

                                <div className="card-custom">
                                    <img src="/chip.png" className="chip-custom" alt="chip" />
                                    <div className="logo-custom"></div>
                                    <div className="inputBox-custom">
                                            <input 
                                                className="bankName-custom" 
                                                type="text" 
                                                placeholder="Nombre del banco" 
                                                maxLength="19" 
                                                name="bankName"
                                                onChange={e => setDataInstructor(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                                            />
                                        </div>
                                    <form className="form-card-custom">
                                        <div className="inputBox-custom">
                                            <span>Nº de Tarjeta</span>
                                            <input 
                                                type="text" 
                                                placeholder="0123 4567 8901 2345" 
                                                maxLength="19" 
                                                name="number"
                                                onChange={e => setDataInstructor(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                                            />
                                        </div>
                                        <div className="inputBox-custom">
                                            <span>Titular</span>
                                            <input 
                                                type="text" 
                                                placeholder="Leonardo Noriega" 
                                                name="nameTarget"
                                                onChange={e => setDataInstructor(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                                            />
                                        </div>
                                        <div className="group-custom">
                                            <div className="inputBox-custom">
                                                <span>Valido Hasta</span>
                                                <input 
                                                    type="text" 
                                                    placeholder="MM/YY" 
                                                    maxLength="5"
                                                    name="validDate"
                                                    onChange={e => setDataInstructor(prev => ({ ...prev, [e.target.name]: e.target.value }))} 
                                            />
                                            </div>
                                            <div className="inputBox-custom">
                                                <span>CCV</span>
                                                <input 
                                                    type="password" 
                                                    placeholder="***" 
                                                    maxLength="4" 
                                                    name="ccv"
                                                    onChange={e => setDataInstructor(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                                                />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <button className="btn-custom" onClick={becameInstructor}>{loading ? "Procesando..." : "Confirmar"}</button>
                            </div>
                            </div>
                            <br/>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BecomeInstructor;