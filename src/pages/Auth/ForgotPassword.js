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

import find from '../../images/icon/search-4.png';
import quote from '../../images/icon/tag.png';
import serve from '../../images/icon/hand-shake.png';
import monetize from '../../images/icon/wallet.png';
import { clearUserPreferences } from '../../utils/cache';


const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();

export class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginLoader: false,
            errorMsg: '',
            email: '',
            isRequestSent: false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
    }

    componentDidMount() {
        //clearUserPreferences()
        window.scrollTo(0, 0)
        clearUserPreferences()
        document.body.classList = "";
        document.getElementById('topnav').classList.add('bg-white');
        window.addEventListener("scroll", this.scrollNavigation, true);
    }

    componentDidUpdate(prevProps, prevState) {

    }
    onChangeText(event) {
        this.setState({
            [event.target.name]: event.target.value
        });

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
    handleSubmit(event, errors, values) {
        if (errors && errors.length > 0) {

        } else {
            var that = this
            this.setState({
                loginLoader: true
            })
             
            firebase.auth().sendPasswordResetEmail(this.state.email).then((data) => {
            
                that.setState({
                    isRequestSent: true,
                    loginLoader: false
                })

            })
        }
    }

    render() {
        const { loginLoader, errorMsg, isRequestSent } = this.state;

        return (
            <React.Fragment>

                <section className="bg-home height-top-sign-in d-flex align-items-center">
                    <Container>
                        <Row className="align-items-center">
                            <Col lg="4" md="6">

                            </Col>
                            <Col lg="4" md="6" className="mt-4 mt-sm-0 pt-2 pt-sm-0">
                                <div className="login-page bg-white  rounded p-3" style={{ boxShadow: '0 0 3px rgba(60, 72, 88, 0.15) !important', border: 'solid 0.5px #efefef', borderRadius: '10px !important' }}>
                                    <div className="text-center">
                                        <p className="mb-4 font16">Reset your password</p>
                                    </div>
                                    {
                                        !isRequestSent ? (

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

                                                                }}
                                                            />
                                                        </AvGroup>
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
                                                            Send Reset Link
                                                </LaddaButton>

                                                        <div className="text-danger error-msg">{errorMsg} </div>

                                                    </Col>


                                                    <Col xs="12" className="text-center">
                                                        <p className="mb-0 mt-3"><small className="text-dark mr-2">Back to login ?</small> <Link to="/sign-in" className="text-dark font-weight-bold">Sign In</Link></p>
                                                    </Col>
                                                </Row>
                                            </AvForm>

                                        ) : (
                                                <Row>
                                                    <Col lg="12">
                                                        <h6>Password reset link has been sent to your email - <b>{this.state.email}</b></h6>

                                                    </Col>
                                                    <Col xs="12" className="text-center">
                                                        <p className="mb-0 mt-3"><small className="text-dark mr-2">Back to login ?</small> <Link to="/sign-in" className="text-dark font-weight-bold">Sign In</Link></p>
                                                    </Col>
                                                </Row>
                                            )
                                    }


                                </div>
                            </Col>
                            <Col lg="4" md="6">
                            </Col>

                        </Row>

                    </Container>
                </section>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword)
