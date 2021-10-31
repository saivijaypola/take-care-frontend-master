import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import { Container, Row, Col, Input, Label, FormGroup, Button, InputGroup, InputGroupText, InputGroupAddon, Modal, ModalBody } from 'reactstrap';

import where from "../../images/icon/where.png";
import go from "../../images/icon/go.png";
import alert from "../../images/icon/alert-2.png";
import SectionTitle from "../../components/Shared/section-title";
import SectionTitleLeft from "../../components/Shared/section-title-left";
// import images
import about from '../../assets/images/about.jpg';
import user from "../../images/icon/userwhite.svg";
import imgbg from "../../assets/images/account/bg.jpg";
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

const assetsBaseUrl = process.env.REACT_APP_ASSETS_BASE_URL

const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
export class ProfileBasic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedLocation: '',
            userId: '',
            fullName: '',
            email: '',
            phone: '',
            address1: '',
            address2: '',
            userCity: '',
            userState: 'Kerala',
            countries: [],
            states: [],
            userCountry: 'India',
            aboutMe: '',
            userZipCode: '',
            myCountryCode: '+91',
            avatarUrl: '',
            loadProfileUpdate: false,
            userLocation: '',
            isLocationDetected: false,
            errorMessage: '',
            isModalVisible: false,
            isHelpModalVisible: false,
            modalMessage: '',
            userLocalProfile: '',
            cameraUploadModal: false,
            pictureModal: false,
            listView: true,
            isCameraOpen: false,
            userPicture: null,
            uploadprogress: 0,
            loadProfileUpdate: false,
            capturedImage: '',
            isCameraPermissionGiven: "loading",
            isAvatarLoadFailed: false,
            redirect: true,
            saveEnabled: false,
            basic: false
        }
        this.onSelectLocation = this.onSelectLocation.bind(this)
        this.handelSubmitProfile = this.handelSubmitProfile.bind(this)
        this.onChangeText = this.onChangeText.bind(this)
        this.onChangeCountry = this.onChangeCountry.bind(this)
        this.onChangeCountryCode = this.onChangeCountryCode.bind(this)
        this.getGeoInfo = this.getGeoInfo.bind(this)
        this.setCode = this.setCode.bind(this)
        this.initializeCountryState = this.initializeCountryState.bind(this)
        this.toggleCameraModal = this.toggleCameraModal.bind(this)
        this.togglePictureModal = this.togglePictureModal.bind(this)
        this.captureImage = this.captureImage.bind(this)
        this.onClear = this.onClear.bind(this)
        this.handleSubmitUpload = this.handleSubmitUpload.bind(this)
        this.capture = this.capture.bind(this)
        this.dataURLtoFile = this.dataURLtoFile.bind(this)
        this.resetPicture = this.resetPicture.bind(this)
        this.onImageLoadError = this.onImageLoadError.bind(this)
        this.handleNavigation = this.handleNavigation.bind(this)
    }
    captureImage(img) {
        this.setState({
            userPicture: img
        }, () => {

        })
        this.setState({
            saveEnabled: true
        })
    }
    onClear() {
        this.setState({
            userPicture: undefined
        })
        this.setState({
            saveEnabled: false
        })
    }

    onImageLoadError = () => {

        this.setState({
            isAvatarLoadFailed: true
        })
    }


    toggleCameraModal = () => {
        this.setState(prevState => ({
            cameraUploadModal: !prevState.cameraUploadModal,
            pictureModal: false
        }));
        this.setState({
            saveEnabled: false
        })
    }
    togglePictureModal = () => {
        this.setState(prevState => ({
            pictureModal: !prevState.pictureModal
        }));
    }
    toggleLiveModal = () => {
        this.setState(prevState => ({
            liveModal: !prevState.liveModal
        }));
    }
    setRef = webcam => {
        this.webcam = webcam;
    };

    capture = () => {
        const imageSrc = this.webcam.getScreenshot();

        if (imageSrc) {
            this.setState({
                capturedImage: imageSrc
            })
        } else {
            alert("Please check your browser settings to enable camera access")
        }

    };
    dataURLtoFile(dataurl, filename) {

        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], filename, { type: mime });
    }

    resetPicture() {
        this.setState({
            capturedImage: ''
        })
    }

    handleNavigation(targetUrl) {
        this.props.history.push(targetUrl)
    }
    onSelectLocation = (selectedLocation) => {
        this.setState({
            userLocation: selectedLocation
        }, () => {
            this.props.changeLocation(selectedLocation)
        })
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
    getGeoInfo = async () => {
        var response = await axios.get('https://ipapi.co/json')
        console.log("MY COUNTRY CODE", response.data.country_calling_code.toString())
        if (response.data.country_calling_code) {
            this.setCode(response.data.country_calling_code)
        }
    };
    setCode(code) {
        this.setState({
            myCountryCode: code
        })
    }

    toggleHelpModal() {
        this.setState({
            isHelpModalVisible: !this.state.isHelpModalVisible
        })
    }
    componentDidMount() {
        this.props.getUserProfileById({
            userId: localStorage.getItem('userId')
        })
        var countries = csc.getAllCountries()
        this.initializeCountryState()
        console.log("countries", countries)
        this.setState({
            countries: countries
        })
        this.setState({
            userId: localStorage.getItem('userId')
        })
        if (this.props.userDetails && this.props.userDetails.country && this.props.userDetails.country) {
            for (var i = 0; i < countries.length; i++) {
                if (countries[i].name == this.props.userDetails.country) {
                    var states = csc.getStatesOfCountry(countries[i].id)
                    this.setState({
                        states: states
                    })
                }
            }
        }
        if (this.props.userDetails && this.props.userDetails.countryCode && this.props.userDetails.countryCode) {
            this.setState({
                myCountryCode: this.props.userDetails.countryCode
            })
        } else {
            this.getGeoInfo()
        }
        try {
            if (this.props && this.props.userDetails) {
                const { userDetails } = this.props
                this.setState({
                    fullName: userDetails.fullname,
                    userLocalProfile: userDetails,
                    email: userDetails.email,
                    phone: userDetails.phoneNumber ? userDetails.phoneNumber : '',
                    address1: userDetails.adressline1 ? userDetails.adressline1 : '',
                    address2: userDetails.adressline2 ? userDetails.adressline2 : '',
                    userId: userDetails && userDetails.userId,
                    userLocation: this.props.userLocation ? this.props.userLocation : JSON.parse(localStorage.getItem('userLocation')),
                    userCity: userDetails.city ? userDetails.city : this.state.userCity,
                    userState: userDetails.state && userDetails.state !== "" ? userDetails.state : this.state.userState,
                    userCountry: userDetails.country ? userDetails.country : this.state.userCountry,
                    userZipCode: userDetails.zipCode ? userDetails.zipCode : this.state.userZipCode,
                    avatarUrl: userDetails.avatarUrl,
                    aboutMe: userDetails.aboutme ? userDetails.aboutme : ''
                }, () => {

                    this.props.changeLocation(this.state.userLocation)
                })
            }
        } catch (err) {

        }

    }
    onChangeText(event) {

        this.setState({
            [event.target.name]: event.target.value
        })
    }
    onChangeCountry(event) {
        console.log('COUNTRY ID', event.target.value)
        this.setState({
            [event.target.name]: event.target.value
        })

        var country = csc.getCountryById(event.target.value).name
        var states = csc.getStatesOfCountry(event.target.value)
        var phonecode = csc.getCountryById(event.target.value).phonecode
        this.setState({
            userCountry: country,
            states: states
        })
    }
    initializeCountryState() {
        const defaultCountryId = 101
        var country = csc.getCountryById("101")
        console.log('COUNTRY', country)
        var states = csc.getStatesOfCountry("101")
        console.log('states', states)
        // var phonecode = csc.getCountryById(event.target.value).phonecode
        this.setState({
            userCountry: country,
            states: states
        })
    }
    onChangeCountryCode(event) {
        this.setState({
            myCountryCode: event.target.value
        })
    }
    componentDidUpdate(prevProps, prevState) {
        const { isUserLoad, userDetails, showingList, requestDetails, isProfileUpdate, isProfileUpdating } = this.props;

        if (prevProps.isProfileUpdate !== isProfileUpdate && isProfileUpdating !== prevProps.isProfileUpdating) {
            if (isProfileUpdate === 1 && this.state.basic) {
                this.props.history.push('/profile-full')
            } else if (isProfileUpdate === 2) {

            }
        }
        if (prevProps.isUserLoad !== isUserLoad && userDetails) {
            this.setState({
                fullName: userDetails.fullname,
                email: userDetails.email,
                phone: userDetails.phoneNumber,
                avatarUrl: userDetails.avatarUrl,
                aboutMe: userDetails.aboutme,

            })
            this.props.setAvatar({ avatarUrl: userDetails && userDetails.avatarUrl })
        }
        if (prevProps.userDetails !== userDetails) {
            this.setState({
                avatarUrl: userDetails.avatarUrl,
            })
        }
    }
    handleSubmitUpload(event, errors, values) {
        var that = this
        if (errors && errors.length > 0) {
        }
        else if (!this.state.userPicture) {
            alert("Check your browser settings to enable camera")
        }
        else {
            let jwtToken = firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    user.getIdToken().then(function (idToken) {
                        var fileName = new Date().toString() + ".jpg"

                        var file = new File([that.state.userPicture], fileName, { lastModified: new Date().toString() });

                        fileUploadService.upload(file, { "type": "avatar" }, 'avatar', user, (event) => {
                            that.setState({
                                uploadprogress: (Math.round((100 * event.loaded) / event.total))
                            }, () => {

                            })
                        }).then((response) => {

                            if (response.data.data && response.data.data.length > 0) {
                                that.toggleCameraModal()
                                that.props.setAvatar({ avatarUrl: response.data.data[0] })
                                //Update file name in DB
                                that.props.updateUserProfile({
                                    "tblUser": {
                                        avatarUrl: response.data.data[0]
                                    },
                                    "id": user.uid
                                })

                            }
                        }).catch((err) => {

                            that.setState({
                                uploadprogress: 0
                            })
                        });
                    });
                }
            });
        }
    }
    handelSubmitProfile(event, errors, values) {
        if (errors && errors.length > 0) {
            console.log("errors", errors)
        } else {
            const { fullName, email, phone, address1, address2, userCity, userState, userCountry, userZipCode, aboutMe, userId, userLocation } = this.state;
            this.setState({
                loadProfileUpdate: true,
                errorMessage: ''
            })
            //var userLocation = JSON.parse(localStorage.getItem('userLocation'))
            // var newLocation = userLocation ? userLocation : this.props.userLocation
            var userLocalProfile = { ...this.state.userLocalProfile }
            userLocalProfile.fullname = fullName.trim()
            userLocalProfile.updatedAt = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })

            this.setState({ userLocalProfile })

            this.props.updateUserProfile({
                "tblUser": {
                    "fullname": fullName.trim()
                },
                "id": userId
            })
            this.setState({
                basic: true
            })
            this.props.setLocalProfile(this.state.userLocalProfile)
            localStorage.setItem("fullname", fullName)

        }

    }
    render() {
        const { fullName, email, phone, address1, address2, userCity, userZipCode, aboutMe, errorMessage, userCountry, userState, myCountryCode } = this.state
        const { userLocation } = this.props
        return (
            <React.Fragment>
                <section className="new-purple" style={{ background: `url(${imgbg}) center center` }}>
                    <h2>User / New Request</h2>
                </section>
                <section className="new-bg">

                    <Container className="pop-where">
                        <div className="pop-header">
                            <div style={{ padding: "10px 20px" }} className="relative">
                                <div className="basic-image">
                                    <img onClick={this.togglePictureModal} src={this.props.avatarUrl !== '' ? `${assetsBaseUrl}/Users/${this.props.userDetails && this.props.userDetails.userId}/Avatar/${this.props.avatarUrl}` : user} className={this.props.avatarUrl == '' ? "padd10" : ""} alt="" />
                                </div>
                                <div className="">
                                    <img onClick={this.toggleCameraModal} style={{ width: 20, height: 20, marginLeft: 5 }} className="basic-bubble" src={camera} />
                                    {/* <Spiffy className={"left"} /> */}
                                </div>
                                <Modal isOpen={this.state.cameraUploadModal} role="dialog" autoFocus={true} centered={true}>
                                    <ModalBody>
                                        <Camera
                                            onCapture={blob => this.captureImage(blob)}
                                            onClear={() => this.onClear(undefined)}
                                        />
                                        {this.state.userPicture !== null &&
                                            <Row className="text-center">
                                                <Col lg="2"></Col>
                                                <Col lg="4">
                                                    {this.state.saveEnabled &&
                                                        <div className="camera-buttons" onClick={this.handleSubmitUpload}>Save</div>
                                                    }

                                                </Col>
                                                <Col lg="4">
                                                    <div className="camera-buttons" onClick={this.toggleCameraModal}>Close</div>
                                                </Col>
                                                <Col lg="2">

                                                </Col>
                                            </Row>
                                        }
                                    </ModalBody>
                                </Modal>
                                <Modal isOpen={this.state.pictureModal} role="dialog" autoFocus={true} centered={true}>
                                    <ModalBody>
                                        <img style={{ marginBottom: 10 }} src={this.state.avatarUrl !== '' ? `${this.state.assetsBaseUrl}/Users/${this.props.userDetails && this.props.userDetails.userId}/Avatar/${this.state.avatarUrl}` : user}></img>
                                        <Row>
                                            <Col xs="6">
                                                <Button className="close-button" onClick={this.togglePictureModal}>Close</Button>
                                            </Col>
                                            <Col xs="6">
                                                <Button className="update-button" onClick={this.toggleCameraModal}>Update</Button>
                                            </Col>
                                        </Row>
                                    </ModalBody>
                                </Modal>
                                {/* <h3 className="title mb-0 userbox-name">{this.props.userDetails && this.props.userDetails.fullname}</h3> */}
                            </div>
                        </div>
                        <div className="new-profile">
                            <AvForm className="login-form" onSubmit={this.handelSubmitProfile}>

                                <AvGroup className="form-group position-relative">
                                    <Label for="email"> Full Name</Label>
                                    <AvField type="text" maxlength="200" className="form-control" required value={this.state.fullName} name="fullName" id="fullName" onChange={this.onChangeText}
                                        errorMessage="Please enter your full name"
                                    />
                                </AvGroup>
                                <AvGroup className="form-group position-relative">
                                    <Label for="email"> Email</Label>
                                    <AvField disabled type="text" maxlength="200" className="form-control" value={this.state.email} name="email" id="email"
                                        errorMessage=""
                                    />
                                </AvGroup>
                                <button className="trans-button">
                                    <img src={go} />
                                </button>

                                <Modal isOpen={this.state.isHelpModalVisible} role="dialog" autoFocus={true} centered={true}>
                                    <ModalBody>
                                        <p className="helpmodal">Please key in your exact location here and pick the most appropriate choice that shows in the dropdown options.
                                <br></br> <br></br>
                                All service requests within 40 Km of this location will be notified to you.
                            </p>
                                        <Button className="post-request" onClick={this.toggleHelpModal}>Close</Button>
                                    </ModalBody>
                                </Modal>
                                <Modal isOpen={this.state.isModalVisible}>
                                    <ModalBody>
                                        <div style={{ textAlign: 'center' }}>
                                            <h6 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 1, color: '#861b8d' }}>{this.state.modalMessage}</h6>
                                            <p>{this.state.modalDescription}</p>
                                            <Button onClick={() => this.setState({ isModalVisible: false, modalMessage: '', modalDescription: '' })}>Close</Button>
                                        </div>
                                    </ModalBody>
                                </Modal>
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
    userDetails: state.profile.userDetails,
    isProfileUpdate: state.profile.isProfileUpdate,
    isProfileUpdating: state.profile.isProfileUpdating,
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
