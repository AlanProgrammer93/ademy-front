import React from 'react'
import {Card, Badge} from 'antd';
import {Link} from 'react-router-dom';
import { currencyFormatter } from '../../utils/helpers';

const CourseCard = ({course}) => {
    const { name, instructor, price, image, slug, paid, category } = course;

    return (
        <Link to={`/course/${slug}`}>
            <Card
                className="mb-4"
                cover={
                    <img 
                        src={image.Location} 
                        alt={name} 
                        style={{height: "200px", width: "100%", objectFit: "cover"}}
                        className="p-1"
                    />
                }
            >
                <h2 className="font-weight-bold">{name}</h2>
                <p>por {instructor.name}</p>
                <Badge 
                    count={category} 
                    style={{ backgroundColor: "#03a9f4" }}
                    className="pb-2 mr-2" 
                />
                <h4 className="pt-2">{paid ? currencyFormatter({
                    amount: price,
                    currency: "usd",
                }) : 'Gratis'}</h4>
            </Card>
        </Link>
    )
}

export default CourseCard
