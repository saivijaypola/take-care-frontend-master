import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Row, Col } from 'reactstrap';
import { Link } from "react-router-dom";

//Import reuseable components


import ModalVideo from 'react-modal-video'
//Service Image
import del1 from '../../images/del1.png';
import del2 from '../../images/del2.png';
import del3 from '../../images/del3.png';

import flower from "../../assets/images/icon/flower.png";
import check from "../../images/icon/group.png"
import health from "../../assets/images/icon/drug.png";
import video from "../../assets/images/icon/video.svg";
import house from "../../assets/images/icon/house.png";
import essentials from "../../assets/images/icon/essentials.png";
import technical from "../../assets/images/icon/technical.png";
import lab from "../../assets/images/icon/lab-2.png";
import sandClock from "../../assets/images/icon/sand-clock.svg";
import ProcessBox from "../../components/Shared/process-box";
//Import AOS animation
import AOS from 'aos';
import '../../../node_modules/aos/dist/aos.css';
import service from "../../images/icon/service.png";
import care_sub from "../../images/icon/care_sub.png";
import yoco_delight from "../../images/icon/yoco_delight.png";
export class PreRequest extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }

    }



    componentDidMount() {
        //Refresh Aos Animation whenever components will render

    }
    // Make sure to remove the DOM listener when the component is unmounted.


    render() {
        return (
            <div className='whitegrad-bg'>
                <React.Fragment>
                    {/* Partners */}
                    <section className="pt-5 pb-5 border-bottom border-top">
                        <section id="service" name="service">
                            <Container>

                                <Row>
                                    <Col md="6">
                                        <div className="service-card">
                                            <img src={care_sub} />
                                            <p style={{fontWeight:"bolder", fontSize:19}}>YoCo Care</p>

                                            {/* <p className="text-muted">Even while you are away from home, be present for your parents and elderly family back home by being in charge of their health and wellbeing. Choose from our packages or make your own package to ensure consistent care for your loved ones and peace of mind for yourself.</p> */}
                                            <p className="font-title">We will find you a suitable person, who can be
                                            like your own family member, to take care of
                                            the health and well-being requirements of your
                                            dear ones.</p>
                                            <Row>
                                                <Col className="text-center" xs="12">
                                                    <span> PREVENTIVE CARE  </span><span> MEDICAL CARE</span>
                                                </Col>
                                                <Col className="text-center" xs="12">

                                                    <span>COMPANION CARE </span>
                                                </Col>
                                            </Row>
                                            <hr className="small-hr" />
                                            <Row>
                                                <Col xs="12">
                                                    {/* <h6 className="text-muted text-center" style={{ fontSize: 12 }}>Know more about our offerings, understand how a subscription works, and make your own package</h6> */}
                                                    <h6 className="font-title text-center" style={{ fontSize: 12 }}>Choose from our offerings or customize your own package</h6>
                                                </Col>
                                            </Row>
                                            <div className="left width100">
                                                <a onClick={() => this.props.history.push("/YoCoCare")} className="btn btn-primary">MAKE A PACKAGE</a>
                                            </div>
                                        </div>
                                    </Col>

                                    <Col md="6">
                                        <div className="service-card">
                                            <img src={service} />
                                            <p style={{fontWeight:"bolder", fontSize:19}}>YoCo Buddy</p>
                                            {/* <p className="text-muted">For each of the unique needs back home that require your presence, find a trusted companion on YoCo instead!</p> */}
                                            <p className="font-title">Errand, chore or the more serious stuff – find a
                                            reliable person whom you can trust as your own
                                            friend to get the task done!</p>

                                            <Row>
                                                <Col className="text-center" xs="12">
                                                    <span>
                                                        BANK WORK  </span><span> TAX PAYMENTS</span><span>HOME MAINTENANCE </span>
                                                </Col>
                                                <Col className="text-center" xs="12">
                                                    <span>
                                                        PURCHASE & DELIVERY </span><span> THOUGHTFUL GIFTS</span><span>ANY OTHER ASSISTANCE </span>
                                                </Col>
                                            </Row>

                                            <hr className="small-hr" />
                                            <Row>
                                                <Col xs="12">
                                                    {/* <h6 className="text-muted text-center" style={{ fontSize: 12 }}>Know more about our offerings, understand how a subscription works, and make your own package</h6> */}
                                                    <h6 className="font-title text-center" style={{ fontSize: 12 }}>A network of 7000+ qualified professionals and students ready to provide diverse services</h6>
                                                </Col>
                                            </Row>

                                            <div className="left width100">
                                                <a onClick={() => this.props.history.push("/user/new-post")} className="btn btn-primary">  FIND A SERVICE </a>

                                            </div>
                                        </div>
                                    </Col>

                                </Row>
                            </Container>

                        </section>
                    </section>
                </React.Fragment>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(PreRequest)