import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import { Container, Row, Col, Input, Label, FormGroup, Button, InputGroup, InputGroupText, InputGroupAddon, Modal, ModalBody } from 'reactstrap';

import where from "../../images/icon/where.png";
import go from "../../images/icon/go.png";
import fbicon from "../../images/icon/facebook.svg";
import googleicon from "../../images/icon/google.svg";
import alert from "../../images/icon/alert-2.png";
import SectionTitle from "../../components/Shared/section-title";
import SectionTitleLeft from "../../components/Shared/section-title-left";
// import images
import about from '../../assets/images/about.jpg';
import user from "../../images/icon/user.svg";
import * as firebase from 'firebase';
import axios from "axios";
import { AvForm, AvField, AvGroup } from 'availity-reactstrap-validation';
import AvInput from 'availity-reactstrap-validation/lib/AvInput';
import csc from 'country-state-city'
import { AuthAction, ProfileAction } from '../../redux/actions';
import LaddaButton, { XL, SLIDE_UP } from 'react-ladda';
import DialogBox from '../../components/Shared/dialog-box';
import FloatingInput from '../../components/Shared/GeoSuggest/FloatingInput';
import { setUser } from '../../handler/authenticate';
import { clearUserPreferences } from '../../utils/cache';
import imgbg from "../../assets/images/account/bg.jpg";

const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
export class UserSignup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            firstname: '',
            lastname: '',
            password: '',
            confirmpassword: '',
            errorMsg: '',
            isCheckAccept: true,
            userDetails: [],
            registrationLoader: false,
            isTermsDialogOpen: false,
        }
        this.onChangeText = this.onChangeText.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        window.scrollTo(0, 0)
        clearUserPreferences()
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.isRegistrationSuccess !== prevState.isRegistrationSuccess) {
            if (nextProps.isRegistrationSuccess > 0) {
                return nextProps.isRegistrationSuccess;
            }
        }
        //Is User by email exist
        if (nextProps.isUserLoad !== prevState.isUserLoad) {
            if (nextProps.isUserLoad > 0) {
                return nextProps.isUserLoad;
            }
        }
        return null;

    }
    componentDidUpdate(prevProps, prevState) {
        const { isRegistrationSuccess, loginUserId, authLoader, isUserLoad, userBasicDetails } = this.props;
        if (prevProps.isRegistrationSuccess !== isRegistrationSuccess) {
            if (isRegistrationSuccess === 1) {
                this.setState({
                    registrationLoader: false
                })
                localStorage.setItem("userId", loginUserId);
                localStorage.setItem('role', 'user')
                var notificationSettings = {
                    SEND_QUOTE: {
                        whatsapp: true,
                        email: true,
                        sms: false,
                        push: false
                    },
                    NEW_MESSAGE: {
                        whatsapp: true,
                        email: true,
                        sms: false,
                        push: false
                    },
                    UPDATE_STATUS: {
                        whatsapp: true,
                        email: true,
                        sms: false,
                        push: false
                    }
                };
                var userId = loginUserId
                const metadataRef = firebase.database().ref('user/' + userId + '/settings/notifications/data');
                metadataRef.update(notificationSettings)
                this.props.history.push("/profile");

            } else if (isRegistrationSuccess === 2) {
                var that = this
                var user = firebase.auth().currentUser;

                // user.delete().then(function () {
                //     // User deleted.
                this.setState({
                    errorMsg: "Failed to register, server error",
                    registrationLoader: false
                })
                // }).catch(function (error) {
                //     that.setState({
                //         errorMsg: "Failed to register, server error",
                //         registrationLoader: false
                //     })
                // });
            }
        }

        //Is User by email exist
        if (prevProps.isUserLoad !== isUserLoad) {
            if (isUserLoad === 1) {
                if (userBasicDetails.role[0] === "user") {
                    localStorage.setItem("userId", userBasicDetails.userId);
                    localStorage.setItem('role', 'user')
                    this.props.history.push("/profile");
                } else {
                    this.setState({
                        errorMsg: 'Email already registered'
                    }, () => {
                        clearUserPreferences()
                    })
                }
            } else if (isUserLoad === 2) {
                this.props.userRegistration({
                    fullName: this.state.userDetails.displayName,
                    email: this.state.userDetails.email,
                    username: this.state.userDetails.email,
                    role: "user",
                    avatar: '',
                    password: '',
                    uid: this.state.userDetails.uid
                })
                this.setState({
                    registrationLoader: false
                })
            }
        }
    }
    onChangeText(event) {
        this.setState({
            [event.target.name]: event.target.value
        });

    }
    handleCloseTermsDialog = () => {
        this.setState({
            isTermsDialogOpen: false
        })
    }
    handleSubmit(event, errors, values) {
        if (errors && errors.length > 0) {

        } else {
            if (this.state.isCheckAccept) {
                this.setState({
                    registrationLoader: true,
                    errorMsg: ''
                })
                firebase
                    .auth()
                    .createUserWithEmailAndPassword(this.state.email, this.state.password)
                    .then(res => {
                        this.props.userRegistration({
                            fullName: this.state.firstname.trim() + ' ' + this.state.lastname.trim(),
                            email: this.state.email,
                            username: this.state.email,
                            role: "user",
                            avatar: "",
                            password: '',
                            uid: res.user.uid

                        })

                    })
                    .catch(e => {

                        let msg = "";
                        if (e.code === "auth/email-already-in-use") {
                            msg = "Email id already exists";
                        }
                        this.setState({
                            errorMsg: msg
                        })

                    });
            } else {
                this.setState({
                    isTermsDialogOpen: true
                })
            }
        }


    }


    onClickGoogle = () => {
        firebase
            .auth()
            .signInWithPopup(googleAuthProvider)
            .then(async (res) => {

                if (res.user) {

                    setUser(await res.user.getIdToken(), res.user.refreshToken, res.user.email)
                    localStorage.setItem('fullName', res.user.displayName)
                    this.setState({
                        userDetails: res.user
                    })
                    this.props.getUserProfileByEmail({
                        userId: res.user.uid
                    })

                }
            })
            .catch(e => {

            });
    }
    onClickFacebook = () => {
        firebase
            .auth()
            .signInWithPopup(facebookAuthProvider)
            .then(res => {
                if (res.user) {
                    this.setState({
                        userDetails: res.user
                    })
                    this.props.getUserProfileByEmail({
                        userId: res.user.uid
                    })
                }


            })
            .catch(e => {

            });
    }
    onCheckAccept = () => {
        this.setState(prevState => ({
            isCheckAccept: !prevState.isCheckAccept
        }))
    }
    render() {
        const { fullName, email, phone, address1, address2, userCity, userZipCode, aboutMe, errorMessage, userCountry, userState, myCountryCode } = this.state
        const { userLocation, authLoader } = this.props
        return (
            <React.Fragment>
                <section className="new-purple" style={{ background: `url(${imgbg}) center center` }}>
                    <h2>User / New Request</h2>
                </section>
                <section className="new-bg">

                    <Container className="pop-where">
                        <div className="new-profile">
                            <AvForm className="login-form" onSubmit={this.handleSubmit}>
                                <Row>
                                    <Col lg="12" className="mt-4 text-center">

                                        <Link to="#" className="rounded" onClick={this.onClickFacebook}>
                                            <div className="social-sign fb-sign">
                                                <img src={fbicon} /> Signup using Facebook
                                            </div>


                                        </Link>
                                        <Link to="#" className="rounded" onClick={this.onClickGoogle}>
                                            <div className="social-sign google-sign">
                                                <img src={googleicon} /> Signup using Google
                                            </div>
                                        </Link>
                                    </Col>
                                    <Col xs="12" className="text-center">
                                        <p className="mb-0 mt-3"><b>Or</b></p>
                                        <br />
                                    </Col>
                                    <Col lg="12">
                                        <h6> <b>Signup</b> Using</h6><br />
                                        <AvGroup className="form-group position-relative">
                                            <Label for="email">Your Email <span className="text-danger">*</span></Label>
                                            <i className="mdi mdi-account ml-3 icons"></i>
                                            <AvField type="text" className="form-control pl-5" name="email" id="email" onChange={this.onChangeText} placeholder="Enter Email" required
                                                errorMessage=""
                                                validate={{
                                                    required: { value: true, errorMessage: "Please enter your email" },
                                                    pattern: { value: '.{1,}@[^.]{1,}', errorMessage: 'E-Mail is not valid!' },
                                                }}
                                            />
                                        </AvGroup>
                                    </Col>

                                    <Col lg="12">
                                        <AvGroup className="form-group position-relative">
                                            <Label for="password">Password<span className="text-danger">*</span></Label>
                                            <i className="mdi mdi-key ml-3 icons"></i>
                                            <AvField type="password" className="form-control pl-5" name="password" onChange={this.onChangeText} id="password" placeholder="Enter Password" required
                                                errorMessage=""
                                                validate={{
                                                    required: { value: true, errorMessage: "Please enter Password" },
                                                    minLength: { value: 6, errorMessage: 'Your password must be between 6 and 8 characters' },
                                                    maxLength: { value: 16, errorMessage: 'Your password must be between 6 and 8 characters' }
                                                }}
                                            />
                                        </AvGroup>
                                    </Col>

                                    <Col lg="12">
                                        <AvGroup className="form-group position-relative">
                                            <Label for="confirmpassword">Confirm Password<span className="text-danger">*</span></Label>
                                            <i className="mdi mdi-key ml-3 icons"></i>
                                            <AvField type="password" className="form-control pl-5" name="confirmpassword" onChange={this.onChangeText} id="confirmpassword" placeholder="Confirm Password" required
                                                errorMessage=""
                                                validate={{
                                                    required: { value: true, errorMessage: "Please enter Password" },
                                                    minLength: { value: 6, errorMessage: 'Your password must be between 6 and 8 characters' },
                                                    maxLength: { value: 16, errorMessage: 'Your password must be between 6 and 8 characters' }
                                                }}
                                            />
                                        </AvGroup>
                                    </Col>

                                    {/* <Col lg="12">
                                        <FormGroup>
                                            <div className="custom-control custom-checkbox">
                                                <Input type="checkbox" className="custom-control-input" id="customCheck1" onChange={this.onCheckAccept} value={this.state.isCheckAccept} />
                                                <Label className="custom-control-label" for="customCheck1">I Accept <Link to="legal/resources/pubuser/2" className="text-primary">Terms & Conditions</Link> and <Link to="legal/resources/pubuser/1" className="text-primary">Privacy Policy</Link> </Label>
                                            </div>
                                        </FormGroup>

                                    </Col> */}
                                    <Col lg="12" className="mb-0">
                                        <LaddaButton
                                            loading={authLoader}
                                            className="btn btn-primary w-100"
                                            data-color="#eee"
                                            data-size={XL}
                                            data-style={SLIDE_UP}
                                            data-spinner-size={30}
                                            data-spinner-color="#ddd"
                                            data-spinner-lines={12}
                                        >
                                            Register
                                        </LaddaButton>
                                        {/* <Button className="btn btn-primary w-100" ></Button> */}
                                        <div className="text-danger error-msg">{this.state.errorMsg} </div>
                                    </Col>
                                    <Col xs="12" className="text-center">
                                        <p className="mb-0 mt-3"><small className="text-dark mr-2">Already have an account?</small> <Link to="/sign-in" className="text-dark font-weight-bold">Sign In</Link></p>
                                    </Col>
                                </Row>
                            </AvForm>
                        </div>
                    </Container>
                </section>
                {/* Dialog Terms and condition */}
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    isRegistrationSuccess: state.auth.isRegistrationSuccess,
    loginUserId: state.auth.loginUserId,
    authLoader: state.auth.authLoader,
    userBasicDetails: state.profile.userBasicDetails,
    isUserLoad: state.profile.isUserLoad,
})

const mapDispatchToProps = {
    ...AuthAction,
    ...ProfileAction
}

export default connect(mapStateToProps, mapDispatchToProps)(UserSignup)
