import React, { Component } from 'react';
import { Container, Row, Col } from "reactstrap";

class SectionTitleIcon extends Component {
    render() {
        return (
            <React.Fragment>
                {
                    this.props.children ?
                        this.props.children
                    :
                        <h4 className="title mb-4">{this.props.title}</h4>
                }
                <p className="text-muted"> {this.props.desc} </p>
                <p className="text-muted"> {this.props.desc2} </p>
                
                    {
                        this.props.features.map((feature, key) =>
                        <Row key={key}>
                            <Col lg="2">
                            <img style={{maxWidth:"100%"}}src={feature.icon}></img>
                            </Col>
                            <Col lg="10">
                            <p className="text-muted">{feature.title}</p>
                            </Col>
                        </Row>
                           
                        )
                    }
                
             
            </React.Fragment>
        );
    }
}

export default SectionTitleIcon;