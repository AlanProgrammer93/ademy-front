import {Button, Progress, Switch} from 'antd';
import ReactPlayer from 'react-player';

const UpdateLessonForm = ({
    current,
    setCurrent,
    handleVideo,
    handleUpdateLesson,
    uploadVideoButtonText,
    progress,
    uploading
}) => {
    return (
        <div className="container pt-3">
            <form onSubmit={handleUpdateLesson}>
                <input 
                    type="text" 
                    className="form-control square" 
                    onChange={e => setCurrent({...current, title: e.target.value})} 
                    value={current.title}
                    autoFocus
                    required
                />

                <textarea 
                    className="form-control mt-3"
                    cols="7" 
                    rows="7"
                    onChange={e => setCurrent({ ...current, content: e.target.value })}
                    value={current.content}
                ></textarea>

                <div>
                    
                    {
                        !uploading && current.video && current.video.Location && (
                            <div className="pt-2 d-flex justify-content-center">
                                <ReactPlayer 
                                    url={current.video.Location}
                                    width="410px"
                                    height="240px"
                                    controls
                                />
                            </div>
                        )
                    }

                    <label className="btn btn-dark btn-block text-left mt-3">
                        {uploadVideoButtonText}
                        <input onChange={handleVideo} type="file" accept="video/*" hidden />
                    </label>

                </div>

                {
                    progress > 0 && (
                        <Progress 
                            className="d-flex justify-content-center p-2"
                            percent={progress} 
                            steps={10}
                        />
                    )
                }
                {/* {current.free_preview ? "Si" : "No"} */}
                <div className="d-flex justify-content-between">
                    <span className="pt-3 badge">Vista Previa</span>
                    <Switch 
                        className="float-right mt-2"
                        disabled={uploading}
                        checked={current.free_preview} 
                        name="free_preview"
                        onChange={v => setCurrent({...current, free_preview: v})}
                    />
                </div>

                <Button 
                    onClick={handleUpdateLesson}
                    className="col mt-3"
                    size="large"
                    type="primary"
                    loading={uploading}
                    shape="round"
                >
                    Guardar
                </Button>
            </form>
        </div>
    )
}

export default UpdateLessonForm
