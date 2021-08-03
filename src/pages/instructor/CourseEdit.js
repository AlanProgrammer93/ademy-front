import { useEffect, useState } from 'react';
import Resizer from 'react-image-file-resizer';
import {toast} from 'react-toastify';
import { List, Avatar, Modal } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import InstructorRoute from '../../components/routes/InstructorRoute';
import clientAxios from '../../utils/axios';
import CourseCreateForm from '../../components/forms/CourseCreateForm';
import UpdateLessonForm from '../../components/forms/UpdateLessonForm';

const { Item } = List

const CourseEdit = ({match}) => {
    const [values, setValues] = useState({
        name: '',
        description: '',
        price: '9.99',
        uploading: false,
        paid: true,
        category: '',
        loading: false,
        lessons: [],
    });
    const [image, setImage] = useState({});
    const [preview, setPreview] = useState('');
    const [uploadButtonText, setUploadButtonText] = useState('Subir Imagen');

    // state para editar leccion
    const [visible, setVisible] = useState(false);
    const [current, setCurrent] = useState({});
    const [uploadVideoButtonText, setUploadVideoButtonText] = useState('Subir Video');
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);

    const {slug} = match.params;

    useEffect(() => {
        loadCourse();
        // eslint-disable-next-line
    }, [slug])

    const loadCourse = async () => {
        const {data} = await clientAxios.post(`/api/course/${slug}`);
        if (data) setValues(data);
        if (data && data.image) setImage(data.image);
    }
    
    const handleChange = e => {
        setValues({...values, [e.target.name]: e.target.value});
    }

    const handleImage = (e) => {
        let file = e.target.files[0];
        setPreview(URL.createObjectURL(file));
        setUploadButtonText(file.name);
        setValues({...values, loading: true});

        Resizer.imageFileResizer(file, 720, 500, 'JPEG', 100, 0, async (uri) => {
            try {
                let {data} = await clientAxios.post('/api/course/upload-image', {
                    image: uri,
                });
                console.log("image uploaded", data);

                setImage(data);
                setValues({...values, loading: false});
            } catch (error) {
                console.log(error);
                setValues({...values, loading: false});
                toast.warning('Falló la carga de la imagen. Intentelo de nuevo.');
            }
        })
    }

    const handleImageRemove = async () => {
        try {
            setValues({...values, loading: true});
            await clientAxios.post('/api/course/remove-image', {image});
            setImage({});
            setPreview('');
            setUploadButtonText("Subir Imagen");
            setValues({...values, loading: false});
        } catch (error) {
            console.log(error);
            setValues({...values, loading: false});
            toast.warning('Falló la carga de la imagen. Intentelo de nuevo.');
        }
    }

    const handleSubmit = async e => {
        e.preventDefault();
        
        try {
            await clientAxios.put(`/api/course/${slug}`, {
                ...values,
                image
            });
            toast.success('Curso Editado.');
        } catch (error) {
            toast.warning(error.response.data);
        }
    }

    const handleDrag = (e, index) => {
        e.dataTransfer.setData('itemIndex', index);
    }

    const handleDrop = async (e, index) => {
        const movingItemIndex = e.dataTransfer.getData('itemIndex');
        const targetItemIndex = index;
        let allLessons = values.lessons;

        let movingItem = allLessons[movingItemIndex]; // clicked/dragged item to re-order
        allLessons.splice(movingItemIndex, 1); // remove 1 item from the given index
        allLessons.splice(targetItemIndex, 0, movingItem); // push item after target item index

        setValues({...values, lessons: [...allLessons]});

        await clientAxios.put(`/api/course/${slug}`, {
            ...values,
            image
        });

    }

    const handleDelete = async (index) => {
        const answer = window.confirm('Estas seguro que quieres eliminar?');
        if (!answer) return;
        let allLessons = values.lessons;
        const removed = allLessons.splice(index, 1);
        setValues({...values, lessons: allLessons});

        await clientAxios.put(`/api/course/${slug}/${removed[0]._id}`);
        
    }

    const handleVideo = async (e) => {
        if (current.video && current.video.Location) {
            await clientAxios.post(`/api/course/video-remove/${values.instructor._id}`, current.video);
        }

        const file = e.target.files[0];
        setUploadVideoButtonText(file.name);
        setUploading(true);

        const videoData = new FormData();
        videoData.append('video', file);
        videoData.append('courseId', values._id);

        const {data} = await clientAxios.post(`/api/course/video-upload/${values.instructor._id}`, videoData, {
            onUploadProgress: (e) => setProgress(Math.round((100 * e.loaded) / e.total)),
        });

        setCurrent({ ...current, video: data });
        setUploading(false);
    }

    const handleUpdateLesson = async (e) => {
        e.preventDefault();
        const {data} = await clientAxios.put(`/api/course/lesson/${slug}/${current._id}`, current);
        
        setUploadVideoButtonText('Subir Video');
        setVisible(false);

        if (data.ok) {
            let arr = values.lessons;
            const index = arr.findIndex((el) => el._id === current._id);
            arr[index] = current;
            setValues({ ...values, lessons: arr });
            toast.success('Leccion Editada');
        }
    }

    return (
        <InstructorRoute>
            <h1 className="jumbotron text-center square">
                Crear Curso
            </h1>
            <div className="pt-3 pb-3">
                <CourseCreateForm
                    handleSubmit={handleSubmit}
                    handleImage={handleImage}
                    handleChange={handleChange}
                    values={values}
                    setValues={setValues}
                    preview={preview}
                    uploadButtonText={uploadButtonText}
                    handleImageRemove={handleImageRemove}
                    editPage={true}
                />
            </div>
            <hr />
            <div className="row pb-5">
                <div className="col lesson-list">
                    <h4>{values && values.lessons && values.lessons.length} Lecciones</h4>
                    <List 
                        onDragOver={(e) => e.preventDefault()}
                        itemLayout="horizontal" 
                        dataSource={values && values.lessons} 
                        renderItem={(item, index) => (
                            <Item
                                draggable
                                onDragStart={e => handleDrag(e, index)}
                                onDrop={e => handleDrop(e, index)}
                            >
                                <Item.Meta 
                                    onClick={() => {
                                        setVisible(true);
                                        setCurrent(item);
                                    }}
                                    avatar={<Avatar>{index + 1}</Avatar>}
                                    title={item.title}
                                ></Item.Meta>

                                <DeleteOutlined 
                                    onClick={() => handleDelete(index)} 
                                    className="text-danger float-right"
                                />
                            </Item>
                        )}
                    ></List>
                </div>
            </div>

            <Modal 
                title="Editar Leccion" 
                centered 
                visible={visible}
                onCancel={() => setVisible(false)}
                footer={null}
            >
                <UpdateLessonForm
                    current={current} 
                    setCurrent={setCurrent} 
                    handleVideo={handleVideo}
                    handleUpdateLesson={handleUpdateLesson}
                    uploadVideoButtonText={uploadVideoButtonText}
                    progress={progress}
                    uploading={uploading}
                />
            </Modal>

        </InstructorRoute>
    )
}

export default CourseEdit
