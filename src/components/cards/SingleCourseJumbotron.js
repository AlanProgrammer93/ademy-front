import { Badge, Button } from 'antd';
import ReactPlayer from 'react-player';
import { LoadingOutlined, SafetyOutlined } from '@ant-design/icons';
import { currencyFormatter } from '../../utils/helpers';

const SingleCourseJumbotron = ({ 
    course, 
    showModal, 
    setShowModal, 
    preview,
    setPreview,
    loading,
    user,
    showModalCardCredit,
    handlePaidEnrollment,
    handleFreeEnrollment,
    enrolled,
    setEnrolled
}) => {
    const {
        name, 
        description, 
        instructor, 
        updatedAt,
        lessons,
        image,
        price,
        paid,
        category,
        
    } = course;

    return (
        <div className="jumbotron bg-primary square">
            <div className="row">
                <div className="col-md-8">
                    <h1 className="text-light font-weight-bold">{name}</h1>
                    
                    <p className="lead">
                        {description && description.length > 120 ? `${description.substring(0, 120)}...` : description}
                    </p>

                    <Badge 
                        count={category} 
                        style={{backgroundColor: '#03a9f4'}}
                        className="pb-4 mr-2" 
                    />

                    <p>Creado por {instructor.name}</p>

                    <p>Ultima Actualizacion {new Date(updatedAt).toLocaleDateString()}</p>

                    <h4 className="text-light">
                        {
                            paid ? currencyFormatter({
                                amount: price,
                                currency: 'usd',
                            }) : "Gratis"
                        }
                    </h4>
                </div>
                <div className="col-md-4">
                    {lessons[0].video && lessons[0].video.Location ? (
                        <div onClick={() => {
                            setPreview(lessons[0].video.Location);
                            setShowModal(!showModal);
                        }}>
                            <ReactPlayer 
                                className="react-player-div"
                                url={lessons[0].video.Location}
                                light={image.Location}
                                width="100%"
                                height="225px" 
                            />
                        </div>
                    ) : (
                        <>
                            <img 
                                src={image.Location} 
                                alt={name}
                                className="img img-fluid"
                            />
                        </>
                    )}

                    {
                        loading ? (
                            <div className="d-flex justify-content-center">
                                <LoadingOutlined className="h1 text-danger" />
                            </div>
                        ) : (
                            <Button
                                className="mb-3 mt-3"
                                type="danger"
                                block
                                shape="round"
                                icon={<SafetyOutlined />}
                                size="large"
                                disabled={loading}
                                onClick={paid ? enrolled.status ? handlePaidEnrollment : showModalCardCredit : handleFreeEnrollment}
                            >
                                {user 
                                    ? enrolled.status
                                        ? 'Ir al curso'
                                        : 'Enrolar'
                                    : 'Iniciar sesion para enrolarse'}
                            </Button>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default SingleCourseJumbotron
