import {useState, useEffect, createElement} from 'react';
import { Button, Menu, Avatar, Tooltip } from 'antd';
import ReactPlayer from 'react-player';
import ReactMarkdown from 'react-markdown';
import { 
    PlayCircleOutlined, 
    MenuFoldOutlined, 
    MenuUnfoldOutlined,
    CheckCircleFilled,
    MinusCircleFilled
} from '@ant-design/icons';
import clientAxios from '../../utils/axios';

const {Item} = Menu;

const UserViewCourse = ({match}) => {
    const [clicked, setClicked] = useState(-1);
    const [collapsed, setCollapsed] = useState(false);
    const [course, setCourse] = useState({ lessons: [] });
    const [completedLessons, setCompletedLessons] = useState([]);
    // para forzar actualizar los estados (setCompletedLessons)
    const [updateState, setUpdateState] = useState(false);

    const {slug} = match.params;

    useEffect(() => {
        if (slug) loadCourse();
        // eslint-disable-next-line
    }, [slug]);

    useEffect(() => {
        if(course) loadCompletedLessons();
        // eslint-disable-next-line
    }, [course]);

    const loadCourse = async () => {
        const {data} = await clientAxios.get(`/api/user/course/${slug}`);
        setCourse(data);
    }

    const loadCompletedLessons = async () => {
        const {data} = await clientAxios.post(`/api/list-completed`, {
            courseId: course._id,
        });
        setCompletedLessons(data);
    }

    const markCompleted = async () => {
        const {data} = await clientAxios.post(`/api/mark-completed`, {
            courseId: course._id,
            lessonId: course.lessons[clicked]._id,
        });
        console.log(data);
        setCompletedLessons([...completedLessons, course.lessons[clicked]._id]);
    }

    const markIncompleted = async () => {
        try {
            const {data} = await clientAxios.post(`/api/mark-incomplete`, {
                courseId: course._id,
                lessonId: course.lessons[clicked]._id,
            });
            console.log(data);
            const all = completedLessons;
            const index = all.indexOf(course.lessons[clicked]._id);
            if (index > -1) {
                all.splice(index, 1);
                setCompletedLessons(all);
                setUpdateState(!updateState);
            }
        } catch (error) {
            console.log(error);
        }
    }
     
    return (
        <div className="container-fluid">
            <div className="row">
                <div style={{ maxWidth: 320 }} className="col-md-4 m-1">
                    <Button 
                        onClick={() => setCollapsed(!collapsed)} 
                        className="text-primary mt-1 btn-block mb-2"
                    >
                        {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}{" "}
                        {!collapsed && "Lecciones"}
                    </Button>
                    <Menu
                        defaultSelectedKeys={[clicked]}
                        inlineCollapsed={collapsed}
                        style={{ height: '80vh', overflow: 'scroll' }}
                    >
                        {
                            course.lessons.map((lesson, index) => (
                                <Item 
                                    onClick={() => setClicked(index)}
                                    key={index}
                                    icon={<Avatar>{index + 1}</Avatar>}
                                >
                                    <Tooltip title={lesson.title}>
                                        {lesson.title.length > 23 ? `${lesson.title.substring(0, 23)}...` : lesson.title}
                                    </Tooltip>
                                     
                                    {completedLessons.includes(lesson._id) ? (
                                        <CheckCircleFilled 
                                            className="float-right text-primary ml-2" 
                                            style={{ marginTop: "13px" }}
                                        />
                                    ) : (
                                        <MinusCircleFilled 
                                            className="float-right text-danger ml-2" 
                                            style={{ marginTop: "13px" }}
                                        />
                                    )}
                                </Item>
                            ))
                        }
                    </Menu>
                </div>

                <div className="col-md-8">
                    {clicked !== -1 ? (
                        <>
                            <div className="col alert alert-primary square">
                                <b>{course.lessons[clicked].title.substring(0, 30)}</b>
                                {
                                    completedLessons.includes(course.lessons[clicked]._id) ? (
                                        <span className="float-right pointer-event" onClick={markIncompleted}>
                                            Marcar como incompleto
                                        </span>
                                    ) : (
                                        <span className="float-right pointer-event" onClick={markCompleted}>
                                            Marcar como completado
                                        </span>
                                    )
                                }
                            </div>
                            {course.lessons[clicked].video && course.lessons[clicked].video.Location && (
                                <>
                                <div className="wrapper">
                                    <ReactPlayer 
                                        className="player"
                                        url={course.lessons[clicked].video.Location}
                                        width="100%"
                                        height="100%"
                                        controls
                                        onEnded={() => markCompleted()}
                                    />
                                </div>
                                </>
                            )}

                            <ReactMarkdown 
                                source={course.lessons[clicked].content}
                                className="single-post"
                            />
                        </>
                    ) : (
                        <div className="d-flex justify-content-center p-5">
                            <div className="text-center p-5">
                                <PlayCircleOutlined className="text-primary display-1 p-5" />
                                <p className="lead">Haz click en alguna leccion para comenzar.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserViewCourse
