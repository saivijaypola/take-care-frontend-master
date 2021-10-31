import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Link } from 'react-router-dom';
import { Container, Row, Col, Input, Label, FormGroup, Button } from 'reactstrap';
import { AvForm, AvField, AvGroup } from 'availity-reactstrap-validation';
import * as firebase from 'firebase';
// import images
import loginImg from '../../assets/images/user/login.png';
import about from '../../assets/images/about.jpg';
import { AuthAction, ProfileAction } from '../../redux/actions';

import SectionTitle from "../../components/Shared/section-title";
import SectionTitleLeft from "../../components/Shared/section-title-left";
import LaddaButton, { XL, SLIDE_UP } from 'react-ladda';
import { setUser, getUser } from '../../handler/authenticate';
import { clearUserPreferences } from '../../utils/cache';


const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();

export class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            userDetails: [],
            loginLoader: false,
            isLoginSuccess: 0,
            errorMsg: '',
            features_lines: [
                { title: "Digital Marketing Solutions for Tomorrow" },
                { title: "Our Talented & Experienced Marketing Agency" },
                { title: "Create your own skin to match your brand" },
            ],
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0)
        //clearUserPreferences()
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
        const { isRegistrationSuccess, loginUserId, isUserLoad, userDetails, isLoginSuccess } = this.props;

        if (prevProps.isRegistrationSuccess !== isRegistrationSuccess) {
            if (isRegistrationSuccess === 1) {
                localStorage.setItem("userId", loginUserId);

                if (userDetails.role && userDetails.role[0] === "provider") {
                    this.props.history.push("/provider/requests");
                } else if (userDetails.role && userDetails.role[0] === "user") {
                    if (this.props.location.pathname.includes('hamper')) {

                    }
                    else {
                        this.props.history.push("/user");
                    }

                }
                //window.location.href('/profile')
            } else if (isRegistrationSuccess === 2) {
                alert("Login Failed");
            }

        }
        //Is User by email exist
        if (prevProps.isUserLoad !== isUserLoad) {
            if (isUserLoad === 1 && userDetails) {
                localStorage.setItem("userId", userDetails.userId);

                if (userDetails.role && userDetails.role[0] === "provider") {
                    this.props.history.push("/dashboard");
                } else if (userDetails.role && userDetails.role[0] === "user") {
                    if (this.props.location.pathname.includes('hamper')) {

                    }
                    else {
                        this.props.history.push("/user");
                    }
                } else if (userDetails.role && userDetails.role[0] === "admin") {
                    this.props.history.push("/admin/all-providers");
                }
                //window.location.href('/profile')
            } else if (isUserLoad === 2) {
                var that = this
                var user = firebase.auth().currentUser;
                that.setState({
                    errorMsg: "Failed to login, server error",
                    registrationLoader: false
                })

            }
        }
        //Check if login success
        if (prevProps.isLoginSuccess !== isLoginSuccess) {
            if (isLoginSuccess === 1) {
                this.props.getUserProfileByEmail({
                    email: this.state.email
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

                        })
                        this.props.getUserProfileByEmail({
                            email: res.user.email
                        })
                    }
                })
                .catch(e => {
                    let msg = '';
                    if (e.code === "auth/user-not-found") {
                        msg = "No user account associated with this id";
                    } else if (e.code === "auth/wrong-password") {
                        msg = "Incorrect password";
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
                    })
                    this.props.getUserProfileByEmail({
                        email: res.user.email
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
                        email: res.user.email
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

                <section className="bg-home height-top-sign-in d-flex align-items-center">
                    <Container>
                        <Row className="align-items-center">
                            <Col lg="7" md="6">

                                <div className="section-title">
                                    <SectionTitleLeft
                                        desc="Using YoCo to get your needs never worrying about designing another page or cross browser compatibility. Our ever-growing library of components and pre-designed layouts will make your life easier."
                                        features={this.state.features_lines}
                                        class="h4 mr-2"
                                    >
                                        <p className="title mb-4 font16">Speed up your life <br /> with <span className="text-primary">YoCo.</span></p>
                                    </SectionTitleLeft>
                                    <Link to="#" className="mt-3 text-primary">Find Out More <i className="mdi mdi-chevron-right"></i></Link>
                                </div>

                            </Col>
                            <Col lg="5" md="6" className="mt-4 mt-sm-0 pt-2 pt-sm-0">
                                <div className="login-page bg-white  rounded p-3" style={{ boxShadow: '0 0 3px rgba(60, 72, 88, 0.15) !important', border: 'solid 0.5px #efefef', borderRadius: '10px !important' }}>
                                    <div className="text-center">
                                        <p className="mb-4 font16 bold">Login</p>
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
                                                            pattern: { value: '.{1,}@[^.]{1,}', errorMessage: 'E-Mail is not valid!' },
                                                        }}
                                                    />
                                                </AvGroup>
                                            </Col>

                                            <Col lg="12">
                                                <AvGroup className="form-group position-relative">
                                                    <Label for="password">Password<span className="text-danger">*</span></Label>
                                                    <i className="mdi mdi-key ml-3 icons"></i>
                                                    <AvField type="password" className="form-control pl-5" onChange={this.onChangeText} name="password" id="password" placeholder="Enter password" required
                                                        errorMessage=""
                                                        validate={{
                                                            required: { value: true, errorMessage: "Please enter Password" },

                                                        }}
                                                    />
                                                </AvGroup>
                                            </Col>

                                            <Col lg="12">
                                                <p className="float-right forgot-pass"><Link to="page-recovery-password.html" className="text-dark font-weight-bold">Forgot password?</Link></p>
                                                <FormGroup>
                                                    <div className="custom-control custom-checkbox">
                                                        <Input type="checkbox" className="custom-control-input" id="customCheck1" />
                                                        <Label className="custom-control-label" for="customCheck1">Remember me</Label>
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
                                                >
                                                    Sign In
                                                </LaddaButton>

                                                <div className="text-danger error-msg">{errorMsg} </div>

                                            </Col>
                                            <Col lg="12" className="mt-4 text-center">
                                                <h6>Or</h6>
                                                <ul className="list-unstyled social-icon mb-0 mt-3">
                                                    <li className="list-inline-item ml-1"><Link to="#" className="rounded" onClick={this.onClickFacebook}><i className="mdi mdi-facebook" title="Facebook"></i></Link></li>
                                                    <li className="list-inline-item ml-1"><Link to="#" className="rounded" onClick={this.onClickGoogle}><i className="mdi mdi-google-plus" title="Google"></i></Link></li>
                                                    {/* <li className="list-inline-item ml-1"><Link to="#" className="rounded"><i className="mdi mdi-github-circle" title="Github"></i></Link></li> */}
                                                </ul>
                                            </Col>
                                            <Col xs="12" className="text-center">
                                                <p className="mb-0 mt-3"><small className="text-dark mr-2">Don't have an account?</small> <Link to="/provider-signup" className="text-dark font-weight-bold">Sign Up</Link></p>
                                            </Col>
                                        </Row>
                                    </AvForm>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    isRegistrationSuccess: state.auth.isRegistrationSuccess,
    loginUserId: state.auth.loginUserId,
    userDetails: state.profile.userDetails,
    isUserLoad: state.profile.isUserLoad,
    isLoginSuccess: state.auth.isLoginSuccess
})

const mapDispatchToProps = {
    ...AuthAction,
    ...ProfileAction
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)
