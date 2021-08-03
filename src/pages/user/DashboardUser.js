import { useState, useEffect } from 'react';
import {Avatar} from 'antd';
import {Link} from 'react-router-dom';
import { SyncOutlined, PlayCircleOutlined } from '@ant-design/icons';
import UserRoute from '../../components/routes/UserRoute';
import clientAxios from '../../utils/axios';

const DashboardUser = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadCourses();
    }, [])

    const loadCourses = async () => {
        try {
            setLoading(true);
            const {data} = await clientAxios.get('/api/user-courses');
            setCourses(data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    return (
        <UserRoute>
            {
                loading && (
                    <SyncOutlined 
                        spin
                        className="d-flex justify-content-center display-1 text-danger p-5"
                    />
                )
            }
            <h1 className="jumbotron text-center square">Dashboard</h1>

            {
                courses.length > 0 && courses.map(course => (
                    <div key={course._id} className="media pt-2 pb-1">
                        <Avatar 
                            size={80} 
                            shape="square"
                            src={course.image ? course.image.Location : '/course.png'}
                        />
                        <div className="media-body pl-2">
                            <div className="row">
                                <div className="col-md-9">
                                    <Link to={`/user/course/${course.slug}`} className="pointer-event">
                                        <h5 className="mt-2 text-primary">{course.name}</h5>
                                    </Link>
                                    <p style={{marginTop: '-10px'}}>
                                        {course.lessons.length} lecciones
                                    </p>
                                    <p className="text-muted" style={{marginTop: '-15px', fontSize: '12px'}}>
                                        Por {course.instructor.name}
                                    </p>
                                </div>
                                <div className="col-md-3 mt-3 text-center">
                                    <Link to={`/user/course/${course.slug}`}>
                                        <PlayCircleOutlined className="h2 pointer-event text-primary" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            }
        </UserRoute>
    )
}

export default DashboardUser;
