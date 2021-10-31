import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Container, Row, Col, Modal, Button, ModalBody } from "reactstrap";
import OwlCarousel from 'react-owl-carousel';
import { ProfileAction, RequestActions, UserActions } from '../../redux/actions';
import { connect } from 'react-redux'
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { v4 as uuidv4 } from 'uuid';
// import './style.css'
import check from "../../images/icon/check.svg";
import imgbg from "../../assets/images/account/bg.jpg";
import message from '../../images/icon/message-yellow.png'
import quote from '../../images/icon/quote-yellow.png'
import bell from '../../images/icon/yellowbell.svg'
import pay from '../../images/icon/pay.svg'
import hamper from "../../images/hamper.jpg";
import FloatingInput from '../../components/Shared/GeoSuggest/FloatingInput';
import { getDistance } from 'geolib';
import chat_icon from "../../images/icon/whatsapp.png";

class QuoteSuccess extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }


    componentDidMount() {
        window.scrollTo(0, 0)
    }
    render() {
        const { delight } = this.props;
        console.log('PROPS', this.props);
        return (
            <React.Fragment>
                <div>
                    <Container className="relative ">
                        <div className="text-center" style={{ padding: 100, paddingBottom: 20 }}>
                            <p className="bold font23 purple-text">Your quote has been received</p>
                            <img style={{ width: 90 }} src={check} />
                            <br />



                            <p sm className="bold font23 purple-text">What's next?</p>
                        </div>
                        <div className="next-grey">
                            {
                                <Row>
                                    <Col md="3">
                                        <div className="next-card">
                                            <img src={message} />
                                            <h6 className="bold">CHAT</h6>
                                            <p className="font14">
                                                If the user has any question, they will message you
                                                and you can chat with them.
                                            </p>
                                        </div>
                                    </Col>
                                    <Col md="3">
                                        <div className="next-card">
                                            <img src={quote} />
                                            <h6 className="bold">QUOTE</h6>
                                            <p className="font14">
                                                If the user likes your offer, they will approve the
                                                quote.
                                            </p>
                                        </div>
                                    </Col>
                                    <Col md="3">
                                        <div className="next-card">
                                            <img src={bell} />
                                            <h6 className="bold">NOTIFICATIONS</h6>
                                            <p className="font14">
                                                You will receive notifications whenever user takes any action on
                                                your request. You can set your notification preferences in
                                                <a onClick={() => this.props.history.push('/provider/settings')} className="text-link"> Settings </a>
                                            </p>
                                        </div>
                                    </Col>
                                    <Col md="3">
                                        <div className="next-card">
                                            <img src={pay} />
                                            <h6 className="bold">PAYMENT</h6>
                                            <p className="font14">
                                                Once the service is delivered and the order is complete, you will receive a payment link via SMS and email. Enter your bank details there and collect your payment.
                                            </p>
                                        </div>
                                    </Col>
                                </Row>}

                        </div>
                        <div style={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center', padding: 30 }}>
                            <a href="https://wa.me/918129123104?text=I%20am%20interested%20in%20taking%20up%20this%20service.%20Please%20give%20me%20more%20details.?" target='_blank'><img className="hover-grow-1" src={chat_icon} style={{ width: 50, height: 50 }} /></a><h4 style={{ fontSize: 18 }} className="font-title bold"><a href="https://wa.me/918129123104?text=I%20am%20interested%20in%20taking%20up%20this%20service.%20Please%20give%20me%20more%20details.?" target='_blank'>+91 8129123104</a></h4>
                            <p style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 20, marginBottom: 0, fontSize:14 }}>Click to chat with YoCo helpline, if you need more information about the request.</p>
                        </div>
                        <div className="text-center" style={{ padding: 40 }}>
                            <a onClick={() => this.props.history.push(`/provider/request-details/${this.props.match.params.requestid}/${this.props.match.params.userId}`)} className="hamper-button">View Request</a>
                        </div>


                    </Container>
                </div>

            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({

    delights: state.request.delights,
    delight: state.request.delight,
    selectedLocation: state.profile.selectedLocation

})

const mapDispatchToProps = {
    ...RequestActions,
    ...ProfileAction,
    ...UserActions
}

export default connect(mapStateToProps, mapDispatchToProps)(QuoteSuccess)
