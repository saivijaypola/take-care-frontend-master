import React, { Component } from 'react';
import { Progress } from "reactstrap";
import { Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';

class VerifyPrice extends Component {
    render() {
        return (
            <div className="verify-mini text-center-mobile">
                <Row>
                    <Col md="2">
                        <h5>${this.props.price}</h5>
                    </Col>
                    <Col md="10">
                        <h6>{this.props.title}</h6>
                        <a className="verify-button"> Verify</a>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default VerifyPrice;