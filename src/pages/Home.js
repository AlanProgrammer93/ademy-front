import React, { useEffect, useState } from 'react'
import CourseCard from '../components/cards/CourseCard';
import clientAxios from '../utils/axios';

const Home = () => {
    
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        const {data} = await clientAxios.get('/api/courses');
        setCourses(data);
    }
    
    return (
        <>
            <h1 className="jumbotron text-center bg-primary square">
                Tienda de Cursos Online
            </h1>
            <div className="container-fluid">
                <div className="row">
                    {
                        courses?.map((course) => (
                            <div key={course._id} className="col-md-4">
                                <CourseCard course={course} />
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    )
}

export default Home
