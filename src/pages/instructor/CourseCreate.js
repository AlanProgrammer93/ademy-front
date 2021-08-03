import { useState } from 'react';
import Resizer from 'react-image-file-resizer';
import {toast} from 'react-toastify';
import { useHistory } from 'react-router-dom';
import InstructorRoute from '../../components/routes/InstructorRoute';
import CourseCreateForm from '../../components/forms/CourseCreateForm';
import clientAxios from '../../utils/axios';

const CourseCreate = () => {
    const [values, setValues] = useState({
        name: '',
        description: '',
        price: '9.99',
        uploading: false,
        paid: true,
        category: '',
        loading: false
    });
    const [image, setImage] = useState({});
    const [preview, setPreview] = useState('');
    const [uploadButtonText, setUploadButtonText] = useState('Subir Imagen');

    const router = useHistory();
    
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
            await clientAxios.post('/api/course', {
                ...values,
                image
            });
            toast.success('Correcto! Ahora puedes subir las lecciones.');
            router.push('/instructor');
        } catch (error) {
            toast.warning(error.response.data);
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
                />
            </div>

        </InstructorRoute>
    )
}

export default CourseCreate
