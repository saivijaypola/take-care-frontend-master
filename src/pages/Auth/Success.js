import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import { Container, Row, Col, Input, Label, FormGroup, Button, InputGroup, InputGroupText, InputGroupAddon, Modal, ModalBody } from 'reactstrap';

import where from "../../images/icon/where.png";
import newpost from "../../images/icon/new.png";
import works from "../../images/icon/works.png";
import alert from "../../images/icon/alert-2.png";
import SectionTitle from "../../components/Shared/section-title";
import SectionTitleLeft from "../../components/Shared/section-title-left";
// import images
import about from '../../assets/images/about.jpg';
import imgbg from "../../assets/images/account/bg.jpg";
import check from "../../images/icon/check.svg";
import * as firebase from 'firebase';
import axios from "axios";
import { AvForm, AvField, AvGroup } from 'availity-reactstrap-validation';
import AvInput from 'availity-reactstrap-validation/lib/AvInput';
import csc from 'country-state-city'
import { AuthAction, ProfileAction } from '../../redux/actions';
import LaddaButton, { XL, SLIDE_UP } from 'react-ladda';
import DialogBox from '../../components/Shared/dialog-box';
import Camera from "../../components/Shared/Camera";
import FloatingInput from '../../components/Shared/GeoSuggest/FloatingInput';
import { setUser } from '../../handler/authenticate';
import fileUploadService from '../../handler/fileUploadService';
import camera from "../../images/icon/camera.png";
import user from "../../images/icon/user.svg";

const assetsBaseUrl = process.env.REACT_APP_ASSETS_BASE_URL

const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
export class ProfileBasic extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }

    }
    componentDidMount() {
        this.props.getUserProfileById({
            userId: localStorage.getItem('userId')
        })
        window.scrollTo(0, 0);
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.userDetails !== prevState.userDetails) {
            if (nextProps.userDetails) {
                return nextProps.userDetails;
            }
        }
        if (nextProps.isProfileUpdate !== prevState.isProfileUpdate) {
            if (nextProps.isProfileUpdate > 0) {
                return nextProps.userDetails;
            }
        }
        return null
    }
    render() {

        return (
            <React.Fragment>
                <section className="new-purple" style={{ background: `url(${imgbg}) center center` }}>
                    <h2>User / New Request</h2>
                </section>
                <section className="new-bg">

                    <Container className="pop-where">
                        <div className="pop-header">
                            <Row>
                                <Col xs="1">
                                    <img className={this.props.avatarUrl ? "custom-profile-pic" : ""} src={this.props.avatarUrl !== '' ? `${assetsBaseUrl}/Users/${this.props.userDetails && this.props.userDetails.userId}/Avatar/${this.props.avatarUrl}` : user} />
                                </Col>
                                <Col xs="11">
                                    <p style={{fontSize:19, fontWeight:"bold"}}>{this.props.userDetails && this.props.userDetails.fullname}</p>
                                    <p className="font-title font14 ">{this.props.userDetails && this.props.userDetails.email}</p>
                                </Col>
                            </Row>
                        </div>
                        <div className="success-div">
                            <p style={{fontSize:21, fontWeight:"bold"}}> Success</p>

                            <img style={{ marginBottom: 15 }} className="success" src={check} />
                            <p>Hurray!
Thank you for completing the registration and welcome aboard. </p>
                            {/* <p className="font14 bold font-title">Give more details of the service</p> */}
                        </div>
                        <Row>
                            <Col md="12">
                                <div onClick={() => this.props.history.push("/user/new-request")} className="success-card">
                                    <img src={newpost} />
                                    <h6>Post a new request</h6>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>
                {/* Dialog Terms and condition */}
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    userDetails: state.profile.userDetails,
    isRegistrationSuccess: state.auth.isRegistrationSuccess,
    loginUserId: state.auth.loginUserId,
    userBasicDetails: state.profile.userBasicDetails,
    avatarUrl: state.profile.avatarUrl,
    isUserLoad: state.profile.isUserLoad,
})

const mapDispatchToProps = {
    ...AuthAction,
    ...ProfileAction
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileBasic)
