import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import './style.css'
import growth from "../../images/spiffy-growth.png";
class FeatureDescription extends Component {
    render() {
        return (
            <React.Fragment>
                <div style={{paddingBottom:200}} className="safe-cover">
                    <Container>
                        <Row className="align-items-center text-center">
                            <Col lg="12">
                                <h1>Safety of your loved ones is our priority!</h1>
                                <p>All our service providers are trusted companions verified after a background check and they come with a strength score.  
                                <br></br>YoCo SAFE features will guide you to safety at every step of the service.</p>
                            </Col>
                        </Row>
                    </Container>
                </div>
                    <Container className="relative rise-card">
                        <Row className="">
                            {
                                this.props.facilities1.map((facility, key) =>
                                    <Col lg="4" key={key}>
                                        <div className="safe-card">
                                            <img style={{ width: 90 }} src={facility.icon} ></img>
                                            <h2> {facility.title} </h2>
                                            <h4> {facility.subtitle} </h4>
                                            <p className="font-title mb-0">{facility.desc}</p>
                                            <br>
                                            </br>
                                            <p className="font-title mb-0">{facility.desc2}</p>
                                        </div>
                                    </Col>
                                )
                            }
                        </Row>
                        <br></br><br></br>
                        <div className="text-center">
                            <h2>Spiffy – The YoCo strength score</h2>
                            <p className="font-title mb-0">Note the badges assigned to each profile and gauge their credibility before <br></br> you decide on the companion who can serve you.</p>
                            <br></br><br></br>
                            <Row>
                                <Col lg="8">
                                    <Row>
                                    
                                        {
                                            this.props.yokorange.map((range, key) =>
                                                <Col lg="4" key={key} className="spiffy-range">
                                                        <img src={range.icon}></img>
                                                        <p style={{ fontSize: 14, lineHeight: 1.4}} className="font-title mb-0">{range.desc}</p>
                                                </Col>
                                            )
                                        }
                                    </Row>
                                </Col>
                                <Col lg="4">
                                    <div className="growth">
                                    <img src={growth}></img>
                                    <h3>Spiffy</h3>
                                    <p>THE YOCO <br/>STRENGTH SCORE</p>
                                    </div>
                                </Col>


                            </Row>
                        </div>
                    </Container>
            </React.Fragment>
        );
    }
}

export default FeatureDescription;