import {Select, Button, Avatar, Badge} from 'antd';

const { Option } = Select;

const CourseCreateForm = ({
    handleSubmit, 
    handleImage, 
    handleChange, 
    values, 
    setValues,
    preview,
    uploadButtonText,
    handleImageRemove = (f) => f,
    editPage = false
}) => {
    const children = [];
    for (let i = 9.99; i <= 100.99; i++) {
        children.push(<Option key={i.toFixed(2)}>${i.toFixed(2)}</Option>)
    }

    return (
        <>
        {values && (
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input 
                        type="text" 
                        name="name" 
                        className="form-control"
                        placeholder="Nombre"
                        value={values.name}
                        onChange={handleChange} 
                    />
                </div>
        
                <div className="form-group">
                    <textarea 
                        name="description" 
                        cols="7"
                        rows="7"
                        className="form-control"
                        value={values.description}
                        onChange={handleChange} 
                    />
                </div>
        
                <div className="form-row">
                    <div className="col">
                        <div className="form-group">
                            <Select
                                style={{ width: "100%" }}
                                size="large"
                                value={values.paid}
                                onChange={v => setValues({...values, paid: v, price: 0})}
                            >
                                <Option value={true}>Pagado</Option>
                                <Option value={false}>Gratis</Option>
                            </Select>
                        </div>
                    </div>

                    {
                        values.paid && (
                            <div className="form-group">
                                <Select
                                    defaultValue="$9.99"
                                    style={{ width: "100%" }}
                                    onChange={(v) => setValues({ ...values, price: v })}
                                    tokenSeparators={[,]}
                                    size="large"
                                >
                                    {children}
                                </Select>
                            </div>
                        )
                    }
                </div>

                <div className="form-group">
                    <input 
                        type="text" 
                        name="category" 
                        className="form-control"
                        placeholder="Categoria"
                        value={values.category}
                        onChange={handleChange} 
                    />
                </div>
        
                <div className="form-row">
                    <div className="col">
                        <div className="form-group">
                            <label className="btn btn-outline-secondary btn-block text-left">
                                { uploadButtonText }
                                <input 
                                    type="file" 
                                    name="image" 
                                    onChange={handleImage} 
                                    accept="image/*" 
                                    hidden
                                />
                            </label>
                        </div>
                    </div>

                    {
                        preview && (
                            <Badge 
                                count="X" 
                                onClick={handleImageRemove}
                                className="pointer-event"
                            >
                                <Avatar width={200} src={preview} />
                            </Badge>
                        )
                    }

                    {
                        editPage && values.image && <Avatar width={200} src={values.image.Location} />
                    }
                </div>
        
                <div className="row">
                    <div className="col">
                        <Button 
                            onClick={handleSubmit}
                            disabled={values.loading || values.uploading}
                            className="btn btn-primary"
                            loading={values.loading}
                            type="primary"
                            size="large"
                            shape="round"
                        >
                            {values.loading ? 'Guardando...' : 'Guardar y Continuar'}
                        </Button>
                    </div>
                </div>
            </form>
        )}
        </>
    )
}


export default CourseCreateForm
