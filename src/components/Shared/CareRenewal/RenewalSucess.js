import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Container, Row, Col, Modal, Button, ModalBody } from "reactstrap";
import check from "../../../images/icon/check.svg";
import chat_icon from "../../../images/icon/whatsapp.png";
import { connect } from 'react-redux';
import renewDetails from "../../../pages/User/CareDetailsNew";
import careRenewal from './CareRenewal'

const RenewalSucess = (props) => {
    const { isRenew, isLoading } = props

    console.log("ISRENEW", props);
    return (
        <React.Fragment>
            {isRenew ?
                <div className='whitegrad-bg' style={{ paddingTop: 50, paddingBottom: 50 }}>
                    <Container className="relative rise-card2">
                        <div className="text-center" style={{ marginTop: 200, padding: 80, paddingBottom: 20 }}>
                            <h2 className="bold purple-text"> Your Subscription has been renewed successfully</h2>
                            <img style={{ width: 90 }} src={check} />

                            <br /><hr />
                            <h2 sm className="bold purple-text">Thank you for your subscription</h2>
                        </div>
                        <div className="next-grey">

                            <Row>
                                <Col xs="12" md="12">
                                    <div className="next-step">
                                        <p style={{ fontSize: 18 }}>A Care Specialist will be in touch with you soon.</p>

                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <div style={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center', padding: 30 }}>
                            <a href="https://wa.me/918129123104?text=I%20am%20interested%20in%20taking%20up%20this%20service.%20Please%20give%20me%20more%20details.?" target='_blank'><img className="pointer" src={chat_icon} style={{ width: 50, height: 50 }} /></a><br />
                            <h4 style={{ fontSize: 18 }} className="font-title bold"><a href="https://wa.me/918129123104?text=I%20am%20interested%20in%20taking%20up%20this%20service.%20Please%20give%20me%20more%20details.?" target='_blank'>+91 8129123104</a></h4>
                            <h5 style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 20, marginBottom: 0 }}>Click to chat with YoCo helpline, if you need more information about the request.</h5>
                        </div>
                        <div className="text-center" style={{ padding: 40 }}>
                            <a onClick={() => props.history.push(`/user/orders`)} className="hamper-button">Back to Request</a>
                        </div>


                    </Container>
                </div>
                :
                <div className='whitegrad-bg' style={{ paddingTop: 50, paddingBottom: 50 }}>
                    <Container className="relative rise-card2">
                        <div className="text-center" style={{ marginTop: 200, padding: 80, paddingBottom: 20 }}>
                            <h2 className="bold purple-text"> Your Payment has been completed successfully</h2>
                            <img style={{ width: 90 }} src={check} />

                            <br /><hr />
                            <h2 sm className="bold purple-text">Thank you for your subscription</h2>
                        </div>
                        <div className="next-grey">

                            <Row>
                                <Col xs="12" md="12">
                                    <div className="next-step">
                                        <p style={{ fontSize: 18 }}>A Care Specialist will be in touch with you soon.</p>

                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <div style={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center', padding: 30 }}>
                            <a href="https://wa.me/918129123104/" target='_blank'><img className="pointer" src={chat_icon} style={{ width: 50, height: 50 }} /></a><br />
                            <h4 style={{ fontSize: 18 }} className="font-title bold"><a href="https://wa.me/918129123104/" target='_blank'>+91 8129123104</a></h4>
                            <h5 style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 20, marginBottom: 0 }}>Click to chat with YoCo helpline, if you need more information about the request.</h5>
                        </div>
                        <div className="text-center" style={{ padding: 40 }}>
                            <a onClick={() => props.history.push(`/user/orders`)} className="hamper-button">Back to Request</a>
                        </div>


                    </Container>
                </div>
            }
        </React.Fragment>
    );
}
export default RenewalSucess;