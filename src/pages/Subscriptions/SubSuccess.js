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
import './style.css'
import check from "../../images/icon/check.svg";
import whatsapp from "../../images/icon/whatsapp.png";
import message from '../../images/icon/message-yellow.png'
import quote from '../../images/icon/quote-yellow.png'
import hamper from "../../images/hamper.jpg";
import FloatingInput from '../../components/Shared/GeoSuggest/FloatingInput';
import { getDistance } from 'geolib';
class SubSuccess extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    onNavigateToCareOptions = () => {
        this.props.setEditRequest(false)
        this.props.history.push(`/user/requests`)
    }

    componentDidMount() {
        window.scrollTo(0, 0)
    }
    render() {
        const { delight } = this.props;
        return (
            <React.Fragment>
                <Container>
                    <div className="care-cover">
                    <h1 className='text-center'>YoCo Care</h1>
                    </div>
                </Container>
                <div>
                    <Container className="relative">
                        <div className="text-center" style={{ padding: 40 }}>
                            {/* <h1 className="bold purple-text">Success</h1> */}



                            {
                                this.props.editRequest ?
                                    <p className="bold purple-text font22">
                                        Your changes have been saved.
                                    </p>
                                    :
                                    <p className="bold purple-text font22">
                                        Your request has been posted
                                    </p>
                            }
                            <img style={{ width: 90 }} src={check} />
                            <br />
                            <p className="bold font22 purple-text text-center">What's next?</p>
                        </div>

                        <div className="next-grey" style={{ position: "relative" }}>
                            <Row>
                                <Col xs="12" md="12">
                                    <div className="next-step">
                                        <p className="font16 bold">A dedicated Care Specialist will get in touch with you with a personalized package.</p>
                                        <p className="bold font16">
                                            This may take 2-3 days since we want you to get the best options possible. Please watch out for our email.
                                        </p>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <div className="text-center" style={{ padding: 40 }}>
                            <p style={{fontSize:18}}>If you have any questions, please contact the YoCo helpline</p>
                            <a href="https://wa.me/918129123104?text=I%20just%20posted%20a%20YoCo%20Care%20request%20and%20I'd%20like%20you%20to%20get%20in%20touch%20with%20me%20soon" target='_blank'><img className="hover-grow-1" style={{ width: 50, height: 50, borderRadius: 8 }} src={whatsapp} /></a><br /><br />
                            <p style={{ fontSize: 18 }} className="font-title bold"><a href="https://wa.me/918129123104?text=I%20just%20posted%20a%20YoCo%20Care%20request%20and%20I'd%20like%20you%20to%20get%20in%20touch%20with%20me%20soon" target='_blank'>+91 8129123104</a></p>
                        </div>
                        <div className="text-center" style={{ paddingTop: 20, paddingBottom: 40 }}>
                            <a onClick={this.onNavigateToCareOptions} className="hamper-button">Back To Requests</a>
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
    selectedLocation: state.profile.selectedLocation,
    editRequest: state.user.editRequest
})

const mapDispatchToProps = {
    ...RequestActions,
    ...ProfileAction,
    ...UserActions
}

export default connect(mapStateToProps, mapDispatchToProps)(SubSuccess)
