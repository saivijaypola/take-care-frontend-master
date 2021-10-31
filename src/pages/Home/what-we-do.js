import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import yocoauth from "../../images/icon/yoco-auth.png";
import yocotrack from "../../images/icon/yoco-track.png";
import yocosafe from "../../images/icon/yoco-safe.png";

//Import Components
import SectionTitleIcon from "../../components/Shared/section-title-icon";

// import images
import img2 from '../../assets/images/app/classic02.png';
import img from '../../assets/images/Yocosafe.jpg';

class WhatWeDo extends Component {
    constructor() {
        super()
        this.state = {
            features1: [
                { icon: yocosafe, title: "Spiffy – Follow the Spiffy strength score in each profile to find the individual that suits your service needs." },
                { icon: yocoauth, title: "Authenticate – When Your companion arrives, ensure that person you signed up is the one who shows up for providing the service." },
                { icon: yocotrack, title: "Track – When the companion serves, receive real time status updates at each step of the service." },
            ] 
        }
    }

    render() {
        return (
            <React.Fragment>
                <Container className="mt-10 mt-10">
                    <Row className="align-items-center">
                        <Col lg="6" md="5">
                            <div className="position-relative">
                                <div className="text-center text-md-left">
                                    <img src={img} className="img-fluid" alt="" />
                                </div>
                            </div>
                        </Col>

                        <Col lg="6" md="7" className="mt-5 mt-sm-0">
                            <div className="section-title">
                                <SectionTitleIcon
                                    desc="Safety of your loved ones is our priority. All our service providers are trusted companions verified after a background check and they come with a strength score."
                                    features={this.state.features1}
                                    class="mdi-18px h5 mr-2"
                                >
                                    <p style={{fontSize:24, fontWeight:"bold"}} className="title mb-3">YoCo Safe</p>
                                </SectionTitleIcon>
                                <div className="mt-4">
                                    <Link to="/yocosafe" style={{cursor:"pointer"}} className="mt-3 text-primary">Learn More <i className="mdi mdi-chevron-right"></i></Link>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>

            </React.Fragment>
        );
    }
}

export default WhatWeDo;