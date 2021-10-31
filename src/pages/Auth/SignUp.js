import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import { Container, Row, Col, Input, Label, FormGroup, Button } from 'reactstrap';
import { AvForm, AvField, AvGroup } from 'availity-reactstrap-validation';

import next from "../../images/icon/double-next.png";
import alert from "../../images/icon/alert-2.png";
import SectionTitle from "../../components/Shared/section-title";
import SectionTitleLeft from "../../components/Shared/section-title-left";
// import images
import about from '../../assets/images/about.jpg';
import * as firebase from 'firebase';

import { AuthAction, ProfileAction } from '../../redux/actions';
import LaddaButton, { XL, SLIDE_UP } from 'react-ladda';
import DialogBox from '../../components/Shared/dialog-box';
import { clearUserPreferences } from '../../utils/cache';
import { setUser } from '../../handler/authenticate';

const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
export class SignUp extends Component {
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
            isCheckAccept: false,
            userDetails: [],
            registrationLoader: false,
            isTermsDialogOpen: false,
            processes: [
                { id: 1, title: "Describe your service needs", desc: "Search for the service needed. YoCo will instantly connect you to trusted individuals near your location of service.", link: "#" },
                { id: 2, title: "Hire your trusted companion", desc: "YoCo Safe feature will help you zero in on a reliable individual. Get to know the person, discuss customization and pricing, before you finalize.", link: "#" },
                { id: 3, title: "Secure payments and tracking", desc: "Make secure payments and sign up for the service. Receive live updates and track the status of your service at each stage.", link: "#" },
            ],
            features_lines: [
                { title: "Digital Marketing Solutions for Tomorrow" },
                { title: "Our Talented & Experienced Marketing Agency" },
                { title: "Create your own skin to match your brand" },
            ],

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
        const { isRegistrationSuccess, loginUserId, isUserLoad, userBasicDetails } = this.props;
        if (prevProps.isRegistrationSuccess !== isRegistrationSuccess) {
            if (isRegistrationSuccess === 1) {
                this.setState({
                    registrationLoader: false
                })
                localStorage.setItem("userId", loginUserId);
                localStorage.setItem('role','user')   
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
                this.props.history.push("/user/profile");

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
                if( userBasicDetails.role[0]==="user"){
                    localStorage.setItem("userId", userBasicDetails.userId);
                    localStorage.setItem('role','user')                
                    this.props.history.push("/user/profile");
                }else{
                    this.setState({
                        errorMsg:'Email already registered'
                    },()=>{
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
            .then(async(res) => {
                 
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
        const { isTermsDialogOpen, errorMsg } = this.state;
        return (
            <React.Fragment>

                <section className="bg-home height-top-join-in d-flex align-items-center">

                    <Container>
                        
                        <Row className="">
                            <Col lg="7" md="6">
                                <br></br>
                            {/* <div style={{background:"#Fdf8ff", borderRadius: 6, padding: 5}}>
                                <img style={{width:62, margin:"0 auto", marginTop:"-35px",marginBottom:10, display:"block"}}src={alert}></img>        
                                <p className="text-center" style={{lineHeight:"1.3"}}>We are happy you are here! Please know that we are currently onboarding our service provider network in Kerala and our application is only partially launched to the users. All user features may not be available for the next few weeks.
                                
                                </p>
                                <p  className="text-center"  style={{lineHeight:"1.3"}}>
                                For now, post your request, sit back and relax. Our care specialist will get in touch with you to fulfill your request.
                                </p>
                            </div> */}
                                <Row style={{ marginTop: 10 }}>
                                    {
                                        this.state.processes.map((process, key) =>
                                            <Col md="4" className="mt-4 pt-2" key={key}>
                                                <div className="work-process small rounded" style={{ boxShadow: '0 0 3px rgba(60, 72, 88, 0.15) !important', border: 'solid 0.5px #efefef', borderRadius: '10px !important' }}>
                                                    <div className="countbox">{key + 1}</div>
                                                    <p className="bold font14">{process.title}</p>
                                                    <p className="text-muted para">{process.desc}</p>
                                                    <img src={next}></img>
                                                </div>
                                            </Col>
                                        )
                                    }
                                </Row>
                            </Col>
                            <Col lg="5" md="6" className="mt-4 mt-sm-0 pt-2 pt-sm-0">
                                {/* <SectionTitle title="How It's Work" desc=" that can provide everything you need to generate awareness, drive traffic, connect." /> */}
                                <div className="login-page bg-white  rounded p-4" style={{ boxShadow: '0 0 3px rgba(60, 72, 88, 0.15) !important', border: 'solid 0.5px #efefef', borderRadius: '10px !important' }}>
                                    <div className="text-center">
                                        <p className="mb-4 bold font16">User Signup</p>
                                    </div>
                                    <AvForm className="login-form" onSubmit={this.handleSubmit}>
                                        <Row>
                                            <Col md="6">
                                                <AvGroup className="form-group position-relative">
                                                    <Label for="firstname">First Name <span className="text-danger">*</span></Label>
                                                    <i className="mdi mdi-account ml-3 icons"></i>
                                                    <AvField type="text" className="form-control pl-5" name="firstname" id="firstname" onChange={this.onChangeText} placeholder="First Name" required
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
                                                    <AvField type="text" className="form-control pl-5" name="lastname" id="lastname" onChange={this.onChangeText} placeholder="Last Name" required
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

                                            <Col lg="12">
                                                <FormGroup>
                                                    <div className="custom-control custom-checkbox">
                                                        <Input type="checkbox" className="custom-control-input" id="customCheck1" onChange={this.onCheckAccept} value={this.state.isCheckAccept} />
                                                        <Label className="custom-control-label" for="customCheck1">I Accept <Link to="legal/resources/pubuser/2" className="text-primary">Terms & Conditions</Link> and <Link to="legal/resources/pubuser/1" className="text-primary">Privacy Policy</Link> </Label>
                                                    </div>
                                                </FormGroup>

                                            </Col>
                                            <Col lg="12" className="mb-0">


                                                <LaddaButton
                                                    loading={this.state.loadProfileUpdate}
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
                                                <div className="text-danger error-msg">{errorMsg} </div>
                                            </Col>
                                            <Col lg="12" className="mt-4 text-center">
                                                <h6>Or Sign up With</h6>
                                                <ul className="list-unstyled social-icon mb-0 mt-3">
                                                    <li className="list-inline-item ml-1"><Link to="#" className="rounded" onClick={this.onClickFacebook}><i className="mdi mdi-facebook" title="Facebook"></i></Link></li>
                                                    <li className="list-inline-item ml-1"><Link to="#" className="rounded" onClick={this.onClickGoogle}><i className="mdi mdi-google-plus" title="Google"></i></Link></li>
                                                    {/* <li className="list-inline-item ml-1"><Link to="#" className="rounded"><i className="mdi mdi-github-circle" title="Github"></i></Link></li> */}
                                                </ul>
                                            </Col>
                                            <Col xs="12" className="text-center">
                                                <p className="mb-0 mt-3"><small className="text-dark mr-2">Already have an account?</small> <Link to="/sign-in" className="text-dark font-weight-bold">Sign In</Link></p>
                                            </Col>
                                        </Row>
                                    </AvForm>
                                </div>
                            </Col>
                        </Row>
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
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    isRegistrationSuccess: state.auth.isRegistrationSuccess,
    loginUserId: state.auth.loginUserId,
    userBasicDetails: state.profile.userBasicDetails,
    isUserLoad: state.profile.isUserLoad,
})

const mapDispatchToProps = {
    ...AuthAction,
    ...ProfileAction
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)
