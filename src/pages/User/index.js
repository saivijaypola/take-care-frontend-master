import React, { Component } from 'react'
import { connect } from 'react-redux'
import OwlCarousel from 'react-owl-carousel';

import { Link } from "react-router-dom";
import {
    Container, Row, Col 
} from "reactstrap";

//Import Images
import imgbg from "../../assets/images/account/bg.jpg";
 

export default class UserDashboard extends Component {
    constructor(props) {

        super(props);
         
    }
     
    render() {
       
        return (
            <React.Fragment>
                <section className="bg-profile d-table w-100" style={{ background: `url(${imgbg}) center center` }}>
                    <Container>
                        <Row>
                            <Col lg="12">
                                 
                            </Col>
                        </Row>
                    </Container>
                </section>


                <section className="section mt-60 padd50 purple-backdrop">
                    <Container className="mt-lg-3">
                        <Row>
                            <Col lg="4" md="5" xs="12">
                                <div className="sidebar p-4 rounded subtle-shadow">
                                    
                                </div>
                            </Col>

                            <Col lg="8" md="7" xs="12" className="mt-4 mt-sm-0 pt-2 pt-sm-0">
                                <div className="ml-lg-3">

                                    <div className="border-bottom pb-4">
                                        <Row>
                                            <Col lg="12">
                                            
                                            </Col>
                                        </Row>
                                        <Row className="pt-2">
                                            <Col>
                                                
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <div>
 
                        </div>
                    </Container>
                </section>
 
            </React.Fragment>
        )
    }
}
