import React, { Component } from 'react';
import { Container, Row, Col } from "reactstrap";

class SectionTitleCheck extends Component {
    render() {
        return (
            <React.Fragment>
                {
                    this.props.children ?
                        this.props.children
                    :
                        <h4 className="title mb-4">{this.props.title}</h4>
                }
                <p className=""> {this.props.desc} </p>
                <p className=""> {this.props.desc2} </p>
                
                    {
                        this.props.features.map((feature, key) =>
                        <Row key={key}>
                            <Col lg="1">
                            <img style={{maxWidth:"20px"}}src={feature.icon}></img>
                            </Col>
                            <Col lg="11">
                            <p className="">{feature.title}</p>
                            </Col>
                        </Row>
                           
                        )
                    }
                
             
            </React.Fragment>
        );
    }
}

export default SectionTitleCheck;