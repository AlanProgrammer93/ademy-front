import {useContext} from 'react';
import {Context} from '../../context';
import {
    DollarOutlined,
    SettingOutlined
} from '@ant-design/icons';
import InstructorRoute from '../../components/routes/InstructorRoute';

const InstructorRevenue = () => {
    const {state} = useContext(Context);
    const { user } = state;

    return (
        <InstructorRoute>
            <div className="container">
                <div className="row pt-2">
                    <div className="col-md-8 offset-md-2 bg-light p-5">
                        <h2>
                            Ganancias <DollarOutlined className="float-right" /> {" "}
                        </h2>
                        <small>Obtendras tu pago directamente en tu cuenta cada ves que un usuario compre tu curso.</small>
                        <hr />
                        <h4>Total De Ingresos</h4>

                        <p>
                            $ {
                                user.profits === undefined ? 0 : user.profits
                            }
                        </p>
                        <hr />
                        <h4>
                            Pagos {" "}
                            <SettingOutlined 
                                className="float-right" 
                            />
                        </h4>
                        <small>
                            Modificar tu cuenta o ver tus pagos anteriores
                        </small>
                    </div>
                </div>
            </div>
        </InstructorRoute>
    )
}

export default InstructorRevenue
