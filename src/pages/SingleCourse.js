import { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
//import { loadStripe } from '@stripe/stripe-js';
import clientAxios from '../utils/axios';
import SingleCourseJumbotron from '../components/cards/SingleCourseJumbotron';
import PreviewModal from '../components/modal/PreviewModal';
import { Context } from '../context'; 
import SingleCourseLessons from '../components/cards/SingleCourseLessons';
import { SyncOutlined } from '@ant-design/icons';
import ModalCardCredit from '../components/modal/ModalCardCredit';

const SingleCourse = ({match}) => {
    const [showModal, setShowModal] = useState(false);
    const [preview, setPreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [enrolled, setEnrolled] = useState({});

    const [course, setCourse] = useState(null);

    const [showModalCard, setShowModalCard] = useState(false);
    const [dataStudent, setDataStudent] = useState({
        bankName: '',
        number: '',
        nameTarget: '',
        validDate: '',
        ccv: ''
    });

    const router = useHistory();
    const {slug} = match.params;

    const {state: {user}} = useContext(Context);

    useEffect(() => {
        loadCourse();
        // eslint-disable-next-line
    }, [slug])

    const loadCourse = async () => {
        const {data} = await clientAxios.post(`/api/course/${slug}`);
        if (data) setCourse(data);
    }

    useEffect(() => {
        setLoading(true);
        if (user && course) checkEnrollment();
        setLoading(false);
        // eslint-disable-next-line
    }, [user, course]); 

    const checkEnrollment = async () => {
        const {data} = await clientAxios.get(`/api/check-enrollment/${course._id}`);
        setEnrolled(data);
    }

    const handlePaidEnrollment = async () => {
        
        try {
            if (!user) router.push('/login');

            if (enrolled.status) router.push(`/user/course/${enrolled.course.slug}`);

            setLoading(true);
            const {data} = await clientAxios.post(`/api/paid-enrollment/${course._id}`, {
                dataStudent
            });
            setLoading(false);
            if (data.success) {
                router.push(`/user/course/${data.course.slug}`);
            }
        } catch (error) {
            toast.warning('Error al Pagar el curso. Intentelo otra ves.');
            setLoading(false);
        } 
    }

    const handleFreeEnrollment = async (e) => {
        e.preventDefault();
        try {
            if (!user) router.push('/login');

            if (enrolled.status) 
                return router.push(`/user/course/${enrolled.course.slug}`);

            setLoading(true);
            const {data} = await clientAxios.post(`/api/free-enrollment/${course._id}`);
            toast.success(data.message);
            setLoading(false);
            router.push(`/user/course/${data.course.slug}`);
        } catch (error) {
            toast.warning('Error al enrolarse. Intentelo otra ves.');
            setLoading(false);
        }
    }

    const showModalCardCredit = () => {
        setShowModalCard(!showModalCard);
    }

    return (
        
        course ? <>
            <SingleCourseJumbotron
                course={course}
                showModal={showModal}
                setShowModal={setShowModal}
                preview={preview}
                setPreview={setPreview}
                user={user}
                loading={loading}
                showModalCardCredit={showModalCardCredit}
                handlePaidEnrollment={handlePaidEnrollment}
                handleFreeEnrollment={handleFreeEnrollment}
                enrolled={enrolled}
                setEnrolled={setEnrolled}
            />

            <PreviewModal
                showModal={showModal}
                setShowModal={setShowModal}
                preview={preview}
            />

            <ModalCardCredit
                showModalCard={showModalCard}
                setShowModalCard={setShowModalCard}
                setDataStudent={setDataStudent}
                loading={loading}
                handlePaidEnrollment={handlePaidEnrollment}
            />

            {
                course?.lessons && (
                    <SingleCourseLessons
                        lessons={course.lessons} 
                        setPreview={setPreview}
                        showModal={showModal}
                        setShowModal={setShowModal}
                    />
                )
            } 
            
        </>
        : (
            <SyncOutlined 
                spin 
                className="d-flex justify-content-center display-1 text-primary p-5" 
            />
        )
    )
}


export default SingleCourse;