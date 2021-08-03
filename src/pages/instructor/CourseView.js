import {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import InstructorRoute from '../../components/routes/InstructorRoute';
import {Avatar, Tooltip, Button, Modal, List} from 'antd';
import {
    EditOutlined, 
    CheckOutlined, 
    UploadOutlined, 
    QuestionOutlined, 
    CloseOutlined,
    UserSwitchOutlined,
    SyncOutlined
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import {toast} from 'react-toastify';
import Item from 'antd/lib/list/Item';
import clientAxios from '../../utils/axios';
import AddLessonForm from '../../components/forms/AddLessonForm';

const CourseView = ({match}) => {
    const [course, setCourse] = useState({});
    const [visible, setVisible] = useState(false);
    const [values, setValues] = useState({
        title: '',
        content: '',
        video: {}
    });
    const [uploading, setUploading] = useState(false);
    const [uploadButtonText, setUploadButtonText] = useState('Subir Video');
    const [progress, setProgress] = useState(0);
    // student count
    const [students, setStudents] = useState(0);

    const router = useHistory();
    const {slug} = match.params;
    
    useEffect(() => {
        loadCourse();
        course && studentCount();
        // eslint-disable-next-line
    }, []);

    const loadCourse = async () => {
        const {data} = await clientAxios.post(`/api/course/${slug}`);
        console.log('PRIMER SOLICITUD "curso"', data);
        setCourse(data);
    }

    const studentCount = async () => {
        const {data} = await clientAxios.post(`/api/instructor/student-count`, {
            courseId: course._id,
        });
        console.log('SEGUNDA SOLICITUD', data.length);
        setStudents(data.length);
    }

    const handleAddLesson = async (e) => {
        e.preventDefault();
        try {
            const {data} = await clientAxios.post(
                `/api/course/lesson/${slug}/${course.instructor._id}`,
                values 
            );

            setValues({...values, title: '', content: '', video: {}});
            setProgress(0);
            setUploadButtonText('Subir Video');
            setVisible(false);
            setCourse(data);
            toast.success('Leccion Creada');
        } catch (error) {
            console.log(error);
            toast.warning('Error Al Crear Leccion');
        }
    }

    const handleVideo = async (e) => {
        
        try {
            const file = e.target.files[0];
            setUploadButtonText(file.name);
            setUploading(true);

            const videoData = new FormData();
            videoData.append('video', file);

            const {data} = await clientAxios.post(`/api/course/video-upload/${course.instructor._id}`, videoData, {
                onUploadProgress: (e) => {
                    setProgress(Math.round((100 * e.loaded) / e.total))
                }
            });

            setValues({...values, video: data});
            setUploading(false);
        } catch (error) {
            console.log(error);
            setUploading(false);
            toast.warning('Error al subir video.');
        }
    }

    const handleVideoRemove = async () => {
        try {
            setUploading(true);
            const {data} = await clientAxios.post(`/api/course/video-remove/${course.instructor._id}`, values.video);
            console.log(data);
            setValues({...values, video: {}});
            setUploading(false);
            setUploadButtonText('Subir otro video');
        } catch (error) {
            console.log(error);
            setUploading(false);
            toast.warning('Error al eliminar video.');
        }
    }

    const handleUnpublish = async (e, courseId) => {
        try {
            let answer = window.confirm('Confirmar para quitar tu curso de la tienda.');
            if (!answer) return;
            const {data} = await clientAxios.put(`/api/course/unpublish/${courseId}`);
            setCourse(data);
            toast.success('Tu curso ya no esta disponible.');
        } catch (error) {
            toast.warning('Error al eliminar curso. Intentelo otra ves.');
        }
    }

    const handlePublish = async (e, courseId) => {
        try {
            let answer = window.confirm('Confirmar para poner tu curso en la tienda.');
            if (!answer) return;
            const {data} = await clientAxios.put(`/api/course/publish/${courseId}`);
            setCourse(data);
            toast.success('FELICITACIONES! tu curso esta en linea.');
        } catch (error) {
            toast.warning('Error al publicar curso. Intentelo otra ves.');
        }
    }

    return (
        
        course ? (
            <InstructorRoute>
                <div className="container-fluid pt-3">
                    {
                        course && (
                            <div className="container-fluid pt-1">
                                <div className="media pt-2">
                                    <Avatar
                                        size={80}
                                        src={course.image ? course.image.Location : "/course.png"} 
                                    />
                                    <div className="media-body pl-2">
                                        <div className="row">
                                            <div className="col">
                                                <h5 className="mt-2 text-primary">{course.name}</h5>
                                                <p style={{ marginTop: "-10px" }}>
                                                    {course.lessons && course.lessons.length} Lecciones
                                                </p>
                                                <p style={{ marginTop: "-15px", fontSize: "10px" }}>
                                                    {course.category}
                                                </p>
                                            </div>

                                            <div className="d-flex pt-4">
                                                <Tooltip title={`${students} Enrolados`}>
                                                    <UserSwitchOutlined 
                                                    className="h5 pointer-event text-info mr-4" 
                                                    />
                                                </Tooltip>
                                                <Tooltip title="Editar">
                                                    <EditOutlined 
                                                        onClick={() => router.push(`/instructor/course/edit/${slug}`)}
                                                        className="h5 pointer-event text-warning mr-4" 
                                                    />
                                                </Tooltip>

                                                {
                                                    course.lessons && course.lessons.length < 5 ? (
                                                        <Tooltip title="Require al menos 5 lecciones para publicar">
                                                            <QuestionOutlined className="h5 pointer-event text-danger" />
                                                        </Tooltip>
                                                    ) : course.published ? (
                                                        <Tooltip title="Quitar Curso">
                                                            <CloseOutlined 
                                                                onClick={e => handleUnpublish(e, course._id)} 
                                                                className="h5 pointer-event text-danger" 
                                                            />
                                                        </Tooltip>
                                                    ) : (
                                                        <Tooltip title="Publicar">
                                                            <CheckOutlined
                                                                onClick={e => handlePublish(e, course._id)} 
                                                                className="h5 pointer-event text-success" 
                                                            />
                                                        </Tooltip>
                                                    )
                                                }

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col">
                                        <ReactMarkdown source={course.description} />
                                    </div>
                                </div>
                                <div className="row">
                                    <Button 
                                        onClick={() => setVisible(true)}
                                        className="col-md-6 offset-md-3 text-center"
                                        type="primary"
                                        shape="round"
                                        icon={<UploadOutlined />}
                                        size="large"
                                    >
                                        Agregar Leccion
                                    </Button>
                                </div>
                                <br />

                                <Modal 
                                    title="+ Agregar Leccion"
                                    centered
                                    visible={visible}
                                    onCancel={() => setVisible(false)}
                                    footer={null}
                                >
                                    <AddLessonForm
                                        values={values} 
                                        setValues={setValues}
                                        handleAddLesson={handleAddLesson} 
                                        uploading={uploading}
                                        uploadButtonText={uploadButtonText}
                                        handleVideo={handleVideo}
                                        progress={progress}
                                        handleVideoRemove={handleVideoRemove}
                                    />
                                </Modal>

                                <div className="row pb-5">
                                    <div className="col lesson-list">
                                        <h4>{course && course.lessons && course.lessons.length} Lecciones</h4>
                                        <List 
                                            itemLayout="horizontal" 
                                            dataSource={course && course.lessons} 
                                            renderItem={(item, index) => (
                                                <Item>
                                                    <Item.Meta 
                                                        avatar={<Avatar>{index + 1}</Avatar>}
                                                        title={item.title}
                                                    ></Item.Meta>
                                                </Item>
                                            )}
                                        ></List>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </InstructorRoute>
        ) : (
            <SyncOutlined 
                spin 
                className="d-flex justify-content-center display-1 text-primary p-5" 
            />
        )
        
    )
}

export default CourseView