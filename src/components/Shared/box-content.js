import React, { Component } from 'react';
import { Col } from 'reactstrap';
import { Link } from 'react-router-dom';

class BoxContent extends Component {
    render() {
        return (
            <React.Fragment>
                {
                    this.props.contents.map((data, key) =>
                    <Col lg="4" md="6" className="mt-4 pt-2" key={key} name="blog">
                        <div className="blog position-relative overflow-hidden  rounded">
                            <div className="position-relative">
                                <img src={data.image} className="img-fluid rounded-top" alt=""/>
                                <div className="overlay rounded-top bg-dark"></div>
                            </div>
                            <div className="content p-4">
                                <h4><Link to="#" className="title text-dark">{data.title}</Link></h4>
                                <p>{data.desc}</p>
                            </div>
                           
                        </div>
                    </Col>
                    )
                }
            </React.Fragment>
        );
    }
}

export default BoxContent;