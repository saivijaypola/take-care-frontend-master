import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import {
    Container, Row, Col, Input, Label, FormGroup, Modal,
    ModalBody
} from 'reactstrap';
import { AvForm, AvField, AvGroup } from 'availity-reactstrap-validation';
import * as firebase from 'firebase';
// import images
import fbicon from "../../images/icon/facebook.svg";
import googleicon from "../../images/icon/google.svg";
import loginImg from '../../assets/images/user/login.png';
import about from '../../assets/images/about.jpg';
import { AuthAction, ProfileAction } from '../../redux/actions';

import SectionTitle from "../../components/Shared/section-title";
import SectionTitleLeft from "../../components/Shared/section-title-left";
import LaddaButton, { XL, SLIDE_UP } from 'react-ladda';
import { setUser, getUser } from '../../handler/authenticate';

import find from '../../images/icon/search-4.png';
import quote from '../../images/icon/tag.png';
import serve from '../../images/icon/hand-shake.png';
import monetize from '../../images/icon/wallet.png';
import { clearUserPreferences } from '../../utils/cache';


const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();

export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hamper: false,
            name: '',
            email: '',
            password: '',
            networkError: false,
            userDetails: [],
            loginLoader: false,
            isLoginSuccess: 0,
            errorMsg: '',
            emailRegex: new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i),
            features_lines: [
                { title: "Digital Marketing Solutions for Tomorrow" },
                { title: "Our Talented & Experienced Marketing Agency" },
                { title: "Create your own skin to match your brand" },
            ],
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
    }
    toggleModal() {
        this.setState({
            networkError: !this.state.networkError
        })
    }

    componentDidMount() {
        //clearUserPreferences()
        window.scrollTo(0, 0);
        if (this.props.location.pathname.includes('hamper')) {
            this.setState({
                hamper: true
            })
        }
        else {
            this.setState({
                hamper: false
            })
        }
        clearUserPreferences()
        document.body.classList = "";
        document.getElementById('topnav').classList.add('bg-white');
        window.addEventListener("scroll", this.scrollNavigation, true);
    }
    // Make sure to remove the DOM listener when the component is unmounted.
    componentWillUnmount() {
        window.removeEventListener("scroll", this.scrollNavigation, true);
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
        //Chcek if login success
        if (nextProps.isLoginSuccess !== prevState.isLoginSuccess) {
            if (nextProps.isLoginSuccess > 0) {
                return nextProps.isLoginSuccess;
            }
        }
        return null;

    }
    componentDidUpdate(prevProps, prevState) {
        const { isRegistrationSuccess, loginUserId, isUserLoad, userBasicDetails, isLoginSuccess } = this.props;

        if (prevProps.isRegistrationSuccess !== isRegistrationSuccess && loginUserId) {

            if (isRegistrationSuccess === 1) {

                if (userBasicDetails.role && userBasicDetails.role.length > 0) {

                    localStorage.setItem("userId", loginUserId);
                    if (userBasicDetails.role && userBasicDetails.role[0] === "provider") {
                        localStorage.setItem('role', 'provider')
                        localStorage.setItem('fullName', userBasicDetails.fullname)
                        localStorage.setItem('email', userBasicDetails.email)
                        this.props.history.push("/provider/requests");
                    } else if (userBasicDetails.role && userBasicDetails.role[0] === "user") {
                        localStorage.setItem('role', 'user')
                        localStorage.setItem('fullName', userBasicDetails.fullname)
                        localStorage.setItem('email', userBasicDetails.email)
                        console.log("paara", this.props)
                        if (this.props.location.pathname.includes('hamper')) {
                            var target = localStorage.getItem("target")
                            localStorage.removeItem("target");
                            this.props.history.push(target);
                        }
                        else {
                            this.props.history.push("/user/requests");
                        }

                    }

                }
                //window.location.href('/profile')
            } else if (isRegistrationSuccess === 2) {
                alert("Login Failed");
            }

        }
        //Is User by email exist
        if (prevProps.isUserLoad !== isUserLoad) {

            if (isUserLoad === 1 && userBasicDetails) {

                if (userBasicDetails.role && userBasicDetails.role.length > 0) {
                    localStorage.setItem("userId", userBasicDetails.userId);
                    if (userBasicDetails.role && userBasicDetails.role[0] === "provider") {
                        localStorage.setItem('role', 'provider')
                        localStorage.setItem('fullName', userBasicDetails.fullname)
                        localStorage.setItem('email', userBasicDetails.email)
                        this.props.history.push("/provider/requests");
                    } else if (userBasicDetails.role && userBasicDetails.role[0] === "user") {
                        localStorage.setItem('role', 'user')
                        localStorage.setItem('fullName', userBasicDetails.fullname)
                        localStorage.setItem('email', userBasicDetails.email)
                        if (this.props.location.pathname.includes('hamper')) {
                            var target = localStorage.getItem("target")
                            localStorage.removeItem("target");
                            this.props.history.push(target);
                        }
                        else {
                            this.props.history.push("/user/requests");
                        }
                    } else if (userBasicDetails.role && userBasicDetails.role[0] === "admin") {
                        localStorage.setItem('role', 'admin')
                        localStorage.setItem('fullName', userBasicDetails.fullname)
                        localStorage.setItem('email', userBasicDetails.email)
                        this.props.history.push("/admin/all/user/request");

                    }

                }


            } else if (isUserLoad === 2) {
                var that = this
                var user = firebase.auth().currentUser;
                that.setState({
                    errorMsg: "Account doesn't exists",
                    registrationLoader: false
                })
            }
        }
        //Check if login success
        if (prevProps.isLoginSuccess !== isLoginSuccess) {
            if (isLoginSuccess === 1) {
                this.props.getUserProfileByEmail({
                    userId: this.state.userDetails.uid
                })
            } else if (isLoginSuccess === 2) {
                this.setState({
                    loginLoader: false,
                    isLoginSuccess: 2
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
            this.setState({
                loginLoader: true,
                errorMsg: ''
            })

            firebase
                .auth()
                .signInWithEmailAndPassword(this.state.email, this.state.password)
                .then(async (res) => {
                    if (res.user) {
                        localStorage.setItem("refreshToken", res.user.refreshToken);
                        localStorage.setItem("userId", res.user.uid);
                        setUser(await res.user.getIdToken(), res.user.refreshToken, res.user.email)
                        this.setState({
                            userDetails: res.user,
                        }, () => {

                            this.props.getUserProfileByEmail({
                                userId: res.user.uid
                            })
                        })

                    }
                })
                .catch(e => {
                    // console.log("shit error", e)
                    let msg = '';
                    if (e.code === "auth/user-not-found") {
                        msg = "No user account associated with this id";
                    } else if (e.code === "auth/wrong-password") {
                        msg = "Incorrect password";
                    } else if (e.code === "auth/network-request-failed") {
                        this.setState({
                            networkError: true,
                        })
                    }
                    this.setState({
                        errorMsg: msg,
                        loginLoader: false
                    })
                });
            // this.props.userLogin({
            //     username: this.state.email,
            //     password: this.state.password
            // })
        }


    }

    scrollNavigation = () => {
        var doc = document.documentElement;
        var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
        if (top > 80) {
            document.getElementById('topnav').classList.add('nav-sticky');
        }
        else {
            document.getElementById('topnav').classList.remove('nav-sticky');
        }
    }

    onClickGoogle = () => {

        firebase
            .auth()
            .signInWithPopup(googleAuthProvider)
            .then(async (res) => {

                if (res.user) {
                    localStorage.setItem("refreshToken", res.user.refreshToken);
                    localStorage.setItem("userId", res.user.uid);
                    setUser(await res.user.getIdToken(), res.user.refreshToken, res.user.email)
                    this.setState({
                        userDetails: res.user
                    }, () => {
                        this.props.getUserProfileByEmail({
                            userId: res.user.uid
                        })
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
            .then(async (res) => {
                if (res.user) {
                    localStorage.setItem("refreshToken", res.user.refreshToken);
                    localStorage.setItem("userId", res.user.uid);
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
    render() {
        const { loginLoader, isLoginSuccess, errorMsg } = this.state;

        return (
            <React.Fragment>

                <section className="bg-home height-top-sign-in d-flex align-items-center whitegrad-bg">
                    <Container>
                        <Row className="align-items-center">
                            <Col lg="4" md="6">

                            </Col>
                            <Col lg="4" md="6" className="mt-4 mt-sm-0 pt-2 pt-sm-0">
                                <div className="card-shadow login-page bg-white" style={{ borderRadius: 8, padding: 20 }}>
                                    <div className="text-center">
                                        <p className="mb-4 font20 bold">Sign In</p>
                                    </div>
                                    <AvForm className="login-form" onSubmit={this.handleSubmit}>
                                        <Row>
                                            <Col lg="12">
                                                <AvGroup className="form-group position-relative">
                                                    <Label for="email">Your Email<span className="text-danger">*</span></Label>

                                                    <i className="mdi mdi-account ml-3 icons"></i>
                                                    <AvField type="text" className="form-control pl-5" onChange={this.onChangeText} name="email" id="email" placeholder="Enter Your Email Address" required
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
                                                    <AvField type="password" className="form-control pl-5" onChange={this.onChangeText} name="password" id="password" placeholder="Enter Password" required
                                                        errorMessage=""
                                                        validate={{
                                                            required: { value: true, errorMessage: "Please enter Password" },

                                                        }}
                                                    />
                                                </AvGroup>
                                            </Col>

                                            <Col lg="12">
                                                <p className="float-right forgot-pass"><Link to="forgetpassword" className="text-dark font-weight-bold">Forgot Password?</Link></p>
                                                <FormGroup>
                                                    <div className="custom-control custom-checkbox">
                                                        <Input type="checkbox" className="custom-control-input" id="customCheck1" />
                                                        <Label className="custom-control-label" for="customCheck1">Remember Me</Label>
                                                    </div>
                                                </FormGroup>
                                            </Col>
                                            <Col lg="12" className="mb-0">
                                                <LaddaButton
                                                    loading={loginLoader}
                                                    className="btn btn-primary w-100t"
                                                    data-color="#eee"
                                                    data-size={XL}
                                                    data-style={SLIDE_UP}
                                                    data-spinner-size={30}
                                                    data-spinner-color="#ddd"
                                                    data-spinner-lines={12}
                                                    style={{width: '100%'}}
                                                >
                                                    Sign In
                                                </LaddaButton>

                                                <div className="text-danger error-msg">{errorMsg} </div>

                                            </Col>
                                            <Col lg="12" className="mt-4 text-center">
                                                
                                                <Row style={{marginBottom: 10, marginTop: -10}}>
                                                    <hr style={{width: '40%'}}/>
                                                    <h6 style={{fontSize: 16, marginTop: 5}}>or</h6>
                                                    <hr style={{width: '40%'}}/>
                                                </Row>
                                                
                                                <Link to="#" className="rounded" onClick={this.onClickFacebook}>
                                                    <Button color='facebook' style={{width: '100%', marginTop: 5, marginBottom: 5}}>
                                                        <Icon name='facebook' />Sign In with Facebook
                                                    </Button>
                                                </Link>
                                                <Link to="#" className="rounded" onClick={this.onClickGoogle}>
                                                    <Button color='google plus' style={{width: '100%', marginTop: 5, marginBottom: 5}}>
                                                        <Icon name='google' />Sign In with Google
                                                    </Button>
                                                </Link>
                                            </Col>
                                            <Col xs="12" className="text-center">
                                                <p className="mb-0 mt-3"><small className="text-dark mr-2">Don't have an account?</small>
                                                    {
                                                        this.state.hamper ?
                                                            <Link to="/user-signup" className="text-dark font-weight-bold">Join Now</Link>
                                                            :
                                                            <Link to="/join" className="text-dark font-weight-bold">Join Now</Link>
                                                    }
                                                </p>
                                            </Col>
                                        </Row>
                                    </AvForm>
                                </div>
                            </Col>
                            <Col lg="4" md="6">
                            </Col>

                        </Row>
                        <Modal isOpen={this.state.networkError} role="dialog" autoFocus={true} centered={true}>
                            <ModalBody>

                                <p className="alert-heading bold font16">Error</p>
                                <p>
                                    Login failed..please check your internet connection
                            </p>
                                <Button onClick={this.toggleModal}>Close</Button>

                            </ModalBody>
                        </Modal>
                    </Container>
                </section>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    isRegistrationSuccess: state.auth.isRegistrationSuccess,
    loginUserId: state.auth.loginUserId,
    //userDetails: state.profile.userDetails,
    userBasicDetails: state.profile.userBasicDetails,
    isUserLoad: state.profile.isUserLoad,
    isLoginSuccess: state.auth.isLoginSuccess
})

const mapDispatchToProps = {
    ...AuthAction,
    ...ProfileAction
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
