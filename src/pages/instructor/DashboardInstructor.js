import { useEffect, useState } from 'react';
import {Avatar, Tooltip} from 'antd';
import {Link} from 'react-router-dom';
import {CheckCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';
import InstructorRoute from '../../components/routes/InstructorRoute';
import clientAxios from '../../utils/axios';

const DashboardInstructor = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        const {data} = await clientAxios.get('/api/instructor-courses');
        setCourses(data);
    }

    const myStyle = { marginTop: "-15px", fontSize: "13px" }

    return (
        <InstructorRoute>
            <h1 className="jumbotron text-center square">
                Dashboard Instructor
            </h1>
            {
                courses && courses.map((course, index) => (
                    
                    <div className="media pt-2" key={index}>
                        <Avatar 
                            size={80} 
                            src={course.image ? course.image.Location : "/course.png"} 
                        />
                        <div className="media-body pl-2">
                            <div className="row">
                                <div className="col-md-9">
                                    <Link 
                                        to={`/instructor/course/view/${course.slug}`} 
                                        className="pointer-event mt-2 text-primary"
                                    >
                                        <h5 className="pt-2">{course.name}</h5>
                                    </Link>
                                    <p style={{ marginTop: "-10px" }}>
                                        {course.lessons.length} Lecciones
                                    </p>
                                    {
                                        course.lessons.length < 5 ? (
                                            <p style={myStyle} className="text-warning">
                                                Al menos 5 lecciones son requeridas para publicar un curso.
                                            </p>
                                        ) : course.published ? (
                                            <p style={myStyle} className="text-success">
                                                Tu curso está disponible en la tienda.
                                            </p>
                                        ) : (
                                            <p style={myStyle} className="text-success">
                                                Tu curso está listo para publicar.
                                            </p>
                                        )
                                    }
                                </div>
                                <div className="col-md-3 mt-3 text-center">
                                    {
                                        course.published ? (
                                            <Tooltip title="Publicar">
                                                <CheckCircleOutlined className="h5 pointer-event text-success" />
                                            </Tooltip>
                                        ) : (
                                            <Tooltip title="Quitar Curso">
                                                <CloseCircleOutlined className="h5 pointer-event text-warning" />
                                            </Tooltip>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    
                ))
            }
        </InstructorRoute>
    )
}

export default DashboardInstructor
