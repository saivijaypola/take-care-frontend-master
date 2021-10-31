import { setUser, getUser } from "../../handler/authenticate";
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import {
    Container, Row, Col, Input, Label, FormGroup, Button, Modal,
    ModalBody
} from 'reactstrap';
import { AvForm, AvField, AvGroup } from 'availity-reactstrap-validation';
import ModalVideo from 'react-modal-video'
import find from '../../images/icon/search-4.png';
import quote from '../../images/icon/tag.png';
import serve from '../../images/icon/hand-shake.png';
import monetize from '../../images/icon/wallet.png';
import fbicon from "../../images/icon/facebook.svg";
import googleicon from "../../images/icon/google.svg";

import { AuthAction, ProfileAction } from '../../redux/actions';
import LaddaButton, { XL, SLIDE_UP } from 'react-ladda';
import DialogBox from '../../components/Shared/dialog-box';
import SectionTitle from "../../components/Shared/section-title";
import * as firebase from 'firebase';
import { clearLocalStorage, clearUserPreferences } from "../../utils/cache";
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();

export class ProviderSignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            features: [
                { icon: find, title: "Find", desc: "View service requests from all customers and find the one that suits you." },
                { icon: quote, title: "Quote", desc: "Respond to customer request. Interact to understand their need and provide a customized quote based on the time and effort that needs to be invested, and of course, your skills too." },
                { icon: serve, title: "Serve", desc: "Reach the service location on time, produce proof to authenticate your identity, deliver the service and send status updates to the customer." },
                { icon: monetize, title: "Monetize", desc: "Receive payment in your bank account instantly and keep track of all revenue and contracts in one place." },
            ],
            features_lines: [
                { title: "Digital Marketing Solutions for Tomorrow" },
                { title: "Our Talented & Experienced Marketing Agency" },
                { title: "Create your own skin to match your brand" },
            ],
            name: '',
            email: '',
            emailRegex: new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i),
            firstname: '',
            lastname: '',
            password: '',
            errorMsg: '',
            confirmpassword: '',
            isCheckAccept: true,
            isSocialMediaCheckAccept: true,
            isTermsDialogOpen: false,
            isSocialTermsDialogOpen: false,
            registrationLoader: false,

        }
        this.onChangeText = this.onChangeText.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }
    closeModal() {
        this.setState(prevState => ({
            profileModal: !prevState.profileModal
        }));
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
        const { isRegistrationSuccess, loginUserId, isUserLoad, userBasicDetails } = this.props;
        if (prevProps.isRegistrationSuccess !== isRegistrationSuccess) {
            if (isRegistrationSuccess === 1) {

                this.props.signupConfirm({ email: getUser().email, fullName: localStorage.getItem('fullName') })
                localStorage.setItem("userId", loginUserId);
                localStorage.setItem('role', 'provider')
                localStorage.setItem('email', getUser().email)
                var notificationSettings = {
                    NEW_REQUEST: {
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
                    QUOTE_ACCEPT: {
                        whatsapp: true,
                        email: true,
                        sms: false,
                        push: false
                    },
                    ON_APPROVED: {
                        whatsapp: true,
                        email: true,
                        sms: false,
                        push: false
                    }
                };
                var userId = loginUserId
                const metadataRef = firebase.database().ref('provider/' + userId + '/settings/notifications/data');
                metadataRef.update(notificationSettings)
                this.props.history.push("/provider/profile");

            } else if (isRegistrationSuccess === 2) {

                var user = firebase.auth().currentUser;
                var that = this
                // user.delete().then(function () {
                //     // User deleted.
                that.setState({
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

                localStorage.setItem("userId", userBasicDetails && userBasicDetails.userId);
                localStorage.setItem('role', 'provider')
                localStorage.setItem('email', userBasicDetails && userBasicDetails.email)
                this.props.history.push("/provider/profile");
            } else if (isUserLoad === 2) {

                this.props.userRegistration({
                    fullName: this.state.userDetails.displayName,
                    email: this.state.userDetails.email,
                    username: this.state.userDetails.email,
                    role: "provider",
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
    handleSubmit(event, errors, values) {
        if (errors && errors.length > 0) {

        } else {
            if (this.state.isCheckAccept) {
                this.setState({
                    registrationLoader: true,
                    errorMsg: ''
                })
                if (this.state.password != this.state.confirmpassword) {
                    this.setState({
                        errorMsg: "passwords does not match",
                        registrationLoader: false
                    })
                } else {
                    firebase
                        .auth()
                        .createUserWithEmailAndPassword(this.state.email.toString().trim(), this.state.password.trim())
                        .then(async (res) => {
                            //Set user data in localstorage
                            setUser(await res.user.getIdToken(), res.user.refreshToken, res.user.email)

                            var splitFStr = this.state.firstname.toLowerCase().split(' ');
                            for (var i = 0; i < splitFStr.length; i++) {
                                splitFStr[i] = splitFStr[i].charAt(0).toUpperCase() + splitFStr[i].substring(1);
                            }
                            var joinFStr = splitFStr.join(' ');

                            var splitLStr = this.state.lastname.toLowerCase().split(' ');
                            for (var i = 0; i < splitLStr.length; i++) {
                                splitLStr[i] = splitLStr[i].charAt(0).toUpperCase() + splitLStr[i].substring(1);
                            }
                            var joinLStr = splitLStr.join(' ');

                            var fullName = joinFStr.trim() + ' ' + joinLStr.trim()
                            localStorage.setItem('fullName', fullName)
                            if (this.state.password != this.state.confirmpassword) {
                                this.setState({
                                    errorMsg: "passwords does not match",
                                    registrationLoader: false
                                })
                            }
                            else {
                                this.props.userRegistration({
                                    fullName: fullName,
                                    email: this.state.email.trim(),
                                    username: this.state.email.trim(),
                                    role: "provider",
                                    avatar: "",
                                    password: '',
                                    uid: res.user.uid
                                })
                            }
                        })
                        .catch(e => {
                            let msg = "";
                            if (e.code === "auth/email-already-in-use") {
                                msg = "Email id already exists";
                            }
                            this.setState({
                                errorMsg: msg,
                                registrationLoader: false
                            })

                        });
                }

            } else {
                this.setState({
                    isTermsDialogOpen: true
                })
            }
        }


    }

    onCheckAccept = () => {
        this.setState(prevState => ({
            isCheckAccept: !prevState.isCheckAccept
        }))
    }
    onSocialMediaCheckAccept = () => {
        this.setState(prevState => ({
            isSocialMediaCheckAccept: !prevState.isSocialMediaCheckAccept
        }))
    }

    onClickGoogle = () => {

        if (this.state.isSocialMediaCheckAccept) {
            this.setState({
                registrationLoader: true,
                errorMsg: ''
            })

            firebase
                .auth()
                .signInWithPopup(googleAuthProvider)
                .then(async (res) => {
                    if (res.user) {
                        //Set user data in localstorage

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
        else {
            this.setState({
                isSocialTermsDialogOpen: true
            })
        }
    }
    onClickFacebook = () => {
        if (this.state.isSocialMediaCheckAccept) {
            this.setState({
                registrationLoader: true,
                errorMsg: ''
            })
            firebase
                .auth()
                .signInWithPopup(facebookAuthProvider)
                .then(async (res) => {
                    if (res.user) {

                        //Set user data in localstorage
                        setUser(await res.user.getIdToken(), res.user.refreshToken, res.user.email)

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
        else {
            this.setState({
                isSocialTermsDialogOpen: true
            })
        }
    }

    handleCloseTermsDialog = () => {
        this.setState({
            isTermsDialogOpen: false,
            isSocialTermsDialogOpen: false
        })
    }

    render() {
        const { isTermsDialogOpen, errorMsg } = this.state;
        return (
            <React.Fragment>

                <section className="bg-home height-top-provider-join-in d-flex align-items-center">

                    <Container className='card-shadow whitegrad-bg'>
                        <div className="new-profile ">
                            <Row className="">
                                <Col lg="12" md="12" className="mt-sm-0 pt-2 pt-sm-0">
                                    {/* <div className="mobile-show">
                            <Link className="mobile-show" to="#" onClick={() => this.setState({ isOpen: true })} id="playbtn" style={{ marginTop: "-34px" }} className="btn btn-primary video-button text-center">Watch Video &nbsp; <i className="mdi mdi-play"></i></Link>
                            </div>   */}
                                    {/* <SectionTitle title="How It's Work" desc=" that can provide everything you need to generate awareness, drive traffic, connect." /> */}
                                    <div >
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
                                        </Row>
                                    </div>
                                    <div >
                                        <div className="text-center">
                                            <p style={{ fontSize: 16, fontWeight: "bold" }} className="mb-4">Sign up With</p>
                                        </div>
                                        <AvForm className="login-form" onSubmit={this.handleSubmit}>
                                            <Row>
                                                <Col md="6">
                                                    <AvGroup className="form-group position-relative">
                                                        <Label for="firstname">First Name <span className="text-danger">*</span></Label>
                                                        <i className="mdi mdi-account ml-3 icons"></i>
                                                        <AvField type="text" className="form-control pl-5" name="firstname" id="firstname" placeholder="First Name" onChange={this.onChangeText} required
                                                            errorMessage=""
                                                            validate={{
                                                                required: { value: true, errorMessage: "Please enter first name" },
                                                            }}
                                                        />
                                                    </AvGroup>
                                                </Col>
                                                <Col md="6">
                                                    <AvGroup className="form-group position-relative">
                                                        <Label for="lastname">Last Name <span className="text-danger">*</span></Label>
                                                        <i className="mdi mdi-account ml-3 icons"></i>
                                                        <AvField type="text" className="form-control pl-5" name="lastname" id="lastname" placeholder="Last Name" onChange={this.onChangeText} required
                                                            errorMessage=""
                                                            validate={{
                                                                required: { value: true, errorMessage: "Please enter last name" },
                                                            }}
                                                        />
                                                    </AvGroup>
                                                </Col>
                                                <Col lg="12">
                                                    <AvGroup className="form-group position-relative">
                                                        <Label for="email">Your Email <span className="text-danger">*</span></Label>
                                                        <i className="mdi mdi-account ml-3 icons"></i>
                                                        <AvField type="text" className="form-control pl-5" name="email" id="email" placeholder="Enter Email" onChange={this.onChangeText} required
                                                            errorMessage=""
                                                            validate={{
                                                                required: { value: true, errorMessage: "Please enter your email" },
                                                                pattern: { value: this.state.emailRegex, errorMessage: 'E-Mail is not valid!' },
                                                            }}
                                                        />
                                                    </AvGroup>
                                                </Col>

                                                <Col lg="12">
                                                    <AvGroup className="form-group position-relative">
                                                        <Label for="password">Password<span className="text-danger">*</span></Label>
                                                        <i className="mdi mdi-key ml-3 icons"></i>
                                                        <AvField type="password" className="form-control pl-5" name="password" id="password" onChange={this.onChangeText} placeholder="Enter Password" required
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
                                                        <AvField type="password" className="form-control pl-5" name="confirmpassword" id="confirmpassword" onChange={this.onChangeText} placeholder="Confirm Password" required
                                                            errorMessage=""
                                                            validate={{
                                                                required: { value: true, errorMessage: "Please Enter Password" },
                                                                minLength: { value: 6, errorMessage: 'Your password must be between 6 and 8 characters' },
                                                                maxLength: { value: 16, errorMessage: 'Your password must be between 6 and 8 characters' }
                                                            }}
                                                        />
                                                    </AvGroup>
                                                </Col>

                                                {/* <Col lg="12">
                                                    <FormGroup>
                                                        <div className="custom-control custom-checkbox">
                                                            <Input type="checkbox" className="custom-control-input" id="customCheck1" value={this.state.isCheckAccept} onChange={this.onCheckAccept} />
                                                            <Label className="custom-control-label" for="customCheck1">I Accept <Link to="/legal/resources/pubprovider/2/" target="_blank" className="text-primary">Terms & Condition</Link> and <Link to="/legal/resources/pubprovider/1" target="_blank" className="text-primary">Privacy Policy</Link></Label>
                                                        </div>
                                                    </FormGroup>
                                                </Col> */}
                                                <Col lg="12" className="mb-0">
                                                    <LaddaButton
                                                        loading={this.state.registrationLoader}
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
                                                    <div className="text-danger error-msg">{errorMsg} </div>
                                                </Col>

                                                <Col xs="12" className="text-center">
                                                    <p className="mb-0 mt-3"><small className="text-dark mr-2">Already have an account?</small> <Link to="/sign-in" className="text-dark font-weight-bold">Sign In</Link></p>
                                                </Col>
                                            </Row>
                                        </AvForm>
                                    </div>
                                </Col>
                            </Row>

                        </div>
                        <ModalVideo className="modalVideoCloseBtn" channel='youtube' isOpen={this.state.isOpen} videoId='_NJ-NWnbbe4' onClose={() => this.setState({ isOpen: false })} />
                    </Container>
                </section>
                {/* Dialog Terms and condition */}
                <DialogBox
                    isDialogOpen={isTermsDialogOpen}
                    title={"Accept Terms & Conditions"}
                    handleClose={this.handleCloseTermsDialog}
                    message={"Please accept terms & conditions before signup."}
                    handleClickDialog={this.handleCloseTermsDialog}
                />
                <DialogBox
                    isDialogOpen={this.state.isSocialTermsDialogOpen}
                    title={"Accept Terms & Conditions"}
                    handleClose={this.handleCloseTermsDialog}
                    message={"Please accept terms & conditions before signup."}
                    handleClickDialog={this.handleCloseTermsDialog}
                />
            </React.Fragment>

        )
    }
}

const mapStateToProps = (state) => ({
    isRegistrationSuccess: state.auth.isRegistrationSuccess,
    loginUserId: state.auth.loginUserId,
    // userDetails: state.profile.userDetails,
    userBasicDetails: state.profile.userBasicDetails,

    isUserLoad: state.profile.isUserLoad,
})

const mapDispatchToProps = {
    ...AuthAction,
    ...ProfileAction
}

export default connect(mapStateToProps, mapDispatchToProps)(ProviderSignUp)
