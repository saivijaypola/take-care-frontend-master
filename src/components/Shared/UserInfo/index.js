import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Offline, Online } from "react-detect-offline";
import { Link } from "react-router-dom";
import {
    Row, Col,

    Modal, Button,

    ModalBody,


} from "reactstrap";
import * as firebase from 'firebase';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import list from "../../../images/icon/list.png";
import providers from "../../../images/icon/providers.png";
import add from "../../../images/icon/add.png";
import { ProfileAction, RequestActions } from '../../../redux/actions';
import Camera from "../Camera";
import camera from "../../../images/icon/camera.png";
import emailicon from "../../../images/icon/test.png";
import reservation from "../../../images/icon/check-list.png";
import range2 from "../../../images/icon/2range.png";
import tiles from "../../../images/tiles.png";
import user from "../../../images/icon/user-6.png";
import bell from "../../../images/icon/bell.svg";
import notification from "../../../images/icon/notification.svg";
import Spiffy from '../Spiffy';
import fileUploadService from '../../../handler/fileUploadService';
// import Webcam from "react-webcam";
import { messaging } from "../../../init-fcm";
import gmail from "../../../images/icon/gmail.png";
import walletIcon from "../../../images/icon/wallet.png";

const assetsBaseUrl = process.env.REACT_APP_ASSETS_BASE_URL


class ProfileBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            profileview: false,
            cameraUploadModal: false,
            liveModal: false,
            isModalVisible: false,
            isCameraOpen: false,
            userPicture: null,
            uploadprogress: 0,
            userLocation: '',
            loadProfileUpdate: false,
            capturedImage: '',
            isCameraPermissionGiven: "loading",
            isAvatarLoadFailed: false,
            avatarUrl: '',
            userLocalProfile: '',
            isValidateVisible: false
        }
        this.toggleLiveModal = this.toggleLiveModal.bind(this)
        this.toggleModal = this.toggleModal.bind(this)
        this.gotoSettings = this.gotoSettings.bind(this)
        this.toggleCameraModal = this.toggleCameraModal.bind(this)
        this.captureImage = this.captureImage.bind(this)
        this.onClear = this.onClear.bind(this)
        this.handleSubmitUpload = this.handleSubmitUpload.bind(this)
        this.capture = this.capture.bind(this)
        this.dataURLtoFile = this.dataURLtoFile.bind(this)
        this.resetPicture = this.resetPicture.bind(this)
        this.onImageLoadError = this.onImageLoadError.bind(this)
        this.handleNavigation = this.handleNavigation.bind(this)
        this.toggleValidateModal = this.toggleValidateModal.bind(this)
    }
    toggleValidateModal() {
        this.setState(prevState => ({
            isValidateVisible: !prevState.isValidateVisible
        }));
        if (!this.state.profileview) {
            this.props.history.push('/provider/profile')
        }
    }
    toggleModal() {
        this.setState(prevState => ({
            isModalVisible: !prevState.isModalVisible
        }));
    }
    captureImage(img) {
        this.setState({
            userPicture: img
        }, () => {

        })
    }
    onClear() {
        this.setState({
            userPicture: undefined
        })
    }
    toggleLiveModal = () => {
        this.setState(prevState => ({
            liveModal: !prevState.liveModal
        }));
    }
    gotoSettings() {
        this.props.history.push('/provider/settings')
    }

    onImageLoadError = () => {

        this.setState({
            isAvatarLoadFailed: true
        })
    }


    toggleCameraModal = () => {
        this.setState(prevState => ({
            cameraUploadModal: !prevState.cameraUploadModal
        }));
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.isUserLoad !== prevState.isUserLoad) {
            if (nextProps.isUserLoad > 0) {
                return nextProps.userDetails;
            }
        }

        //Is Profile updated
        if (nextProps.isProfileUpdate !== prevState.isProfileUpdate) {
            if (nextProps.isProfileUpdate > 0) {
                return nextProps.userDetails;
            }
        }
        return null

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

    componentDidMount() {

        const versionRef = firebase.database().ref('AppVersion');
        var userId = localStorage.getItem("userId")
        const metadataRef = firebase.database().ref('provider/' + userId + '/settings/notifications/data');
        metadataRef.once('value', snapshot => {
            const checkNotification = snapshot.val();
            if (checkNotification == null) {
                var notificationSettings = {
                    NEW_REQUEST: {
                        whatsapp: true,
                        email: true,
                        sms: true,
                        push: true
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
                metadataRef.update(notificationSettings)
            }
        })




        if (firebase.messaging.isSupported && messaging) {
            messaging.getToken({ vapidKey: "BDA9QXk5QhL4K0s5GPeKCqdrLbSXKptHg19VLSOSyO96hVckL5IDfQyJpn8H8d8gKbOXCfVBG0bgtnuBd-kNeJ0" }).then((token) => {
                if (token) {
                    console.log('TOKEN', token)
                } else {
                    console.log("FAILED")
                }
            }).catch((err) => {
                console.log('ERRROR TOKEN', err);
            })
        }

        // if (versionRef) {
        //     versionRef.on('value', snapshot => {
        //         const getVersion = snapshot.val();
        //         console.log('VERSION', getVersion)
        //         if (localStorage.getItem('version') === null || localStorage.getItem('version') !== getVersion.version) {
        //             window.location.reload()
        //             localStorage.setItem('version', getVersion.version)
        //         }
        //         //
        //     })

        // }


        const { userDetails } = this.props
        if (this.props.location.pathname === "/provider/profile") {
            this.setState({
                profileview: true
            })
        } else {
            this.setState({
                profileview: false
            })
        }
        window.scrollTo(0, 0)

        if (localStorage.getItem("userId") !== null && !userDetails) {
            this.props.getUserProfileById({
                userId: localStorage.getItem('userId')
            })
            this.props.getProviderOrders({ provider_id: localStorage.getItem('userId') })
            this.props.getProviderWallet({ provider_id: localStorage.getItem('userId') })
            this.props.getSpiffyStrength({
                userId: localStorage.getItem('userId')
            })

        }
    }

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
        if (targetUrl === '/provider/requests') {
            if (this.props.userDetails && this.props.userDetails.avatarUrl !== "" && this.props.userDetails.phoneNumber !== null && this.props.userDetails.tblEducationsByUserId.nodes.length > 0 && this.props.userDetails.tblDocumentUploadsByUserId.nodes.length > 1) {
                this.props.history.push(targetUrl)
            } else {
                this.setState({
                    isValidateVisible: true
                })

            }
        } else {
            this.props.history.push(targetUrl)
        }
        console.log('MODAL VISIBLE', this.state.isValidateVisible);
    }
    handleSubmitUpload(event, errors, values) {

        var userLocalProfile = { ...this.state.userLocalProfile }

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
                                that.setState({ avatarUrl: response.data.data[0] })
                                userLocalProfile.avatarUrl = response.data.data[0]
                                that.setState({ userLocalProfile })
                                that.props.setLocalProfile(that.state.userLocalProfile)
                                that.props.setAvatar({ avatarUrl: response.data.data[0] })
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
    componentDidUpdate(prevProps, prevState) {
        const { isUserLoad, userDetails } = this.props;
        if (prevProps.isUserLoad !== isUserLoad && userDetails) {
            this.setState({
                userLocalProfile: userDetails,
                fullName: userDetails.fullname,
                email: userDetails.email,
                phone: userDetails.phoneNumber,
                avatarUrl: userDetails.avatarUrl,
                aboutMe: userDetails.aboutme,
                userLocation: this.props.userLocation ? this.props.userLocation : localStorage.getItem('userLocation'),


            }, () => {
                this.props.changeLocation(this.state.userLocation)
                this.props.setAvatar({ avatarUrl: userDetails && userDetails.avatarUrl })
            })


        }

    }

    getWalletBalance(advanceTotal, payableTotal, amountPaid) {
        if (!isNaN(advanceTotal) && !isNaN(payableTotal) && !isNaN(amountPaid)) {
            const balance = (parseFloat(advanceTotal) + parseFloat(payableTotal)) - parseFloat(amountPaid)
            return balance.toFixed(0)
        } else {
            return 0.00
        }
    }

    render() {
        const videoConstraints = {

            facingMode: "user"
        };
        const documentsVerified = this.props.userDetails && this.props.userDetails.tblDocumentUploadsByUserId && this.props.userDetails.tblDocumentUploadsByUserId.nodes.filter(d => d.isVerified === true);
        const { userPicture } = this.state;
        const { requests, orders, wallet, careOrders } = this.props
        const { userDetails, avatarUrl } = this.props
        const educationHistory = userDetails && userDetails.tblEducationsByUserId && userDetails.tblEducationsByUserId.nodes && userDetails.tblEducationsByUserId.nodes.length > 0 ? userDetails.tblEducationsByUserId.nodes : []
        const employmentHistory = userDetails && userDetails.tblEmploymentsByUserId && userDetails.tblEmploymentsByUserId.nodes && userDetails.tblEmploymentsByUserId.nodes.length > 0 ? userDetails.tblEmploymentsByUserId.nodes : []
        var ordersLength = ((orders && orders.length ? orders.length : 0) + (careOrders && careOrders.length ? careOrders.length : 0))
        return (
            <React.Fragment>
                <div>
                    <div className="public-profile mobile-hide position-relative p-4 bg-white overflow-hidden subtle-shadow" style={{ zIndex: "1" }}>
                        {
                            userDetails && (

                                <Row className="align-items-center">
                                    {/* <Col lg="2" md="3" className="text-md-left text-center">
                                            <div className="relative">
                                                <img key={userDetails.avatarUrl} src={userDetails.avatarUrl !== '' ? `${assetsBaseUrl}/Users/${userDetails.userId}/Avatar/${userDetails.avatarUrl}` : user} className="avatar avatar-medium rounded-pill subtle-shadow d-block mx-auto profile-img" alt="" />
                                                <div onClick={this.toggleCameraModal} className="profile-bubble subtle-shadow">
                                                    <img style={{ width: 20, height: 20, marginLeft: 5 }} className="left" src={camera} />
                                                    <Spiffy className={"left"} />
                                                </div>
                                            </div>

                                        </Col> */}

                                    <Col lg="12" md="12">
                                        <Row className="align-items-center">
                                            <Col md='1'></Col>
                                            <Col md="4" className="text-md-left text-center mt-4 mt-sm-0">
                                                <p className="title font19 mb-0">{userDetails && userDetails.fullname}</p>
                                                <ul className="list-inline mb-0">
                                                    {/* {
                                                        employmentHistory.length > 0 ? (
                                                            <React.Fragment>
                                                                <li className="list-inline-item mr-2" style={{ fontSize: 12 }}><Link to="#" className="font-title" title="Linkedin">{employmentHistory[0].jobTitle}@{employmentHistory[0].companyName}</Link></li><br />
                                                            </React.Fragment>
                                                        ) : educationHistory.length > 0 ? (
                                                            <React.Fragment>
                                                                <li className="list-inline-item mr-2" style={{ fontSize: 12 }}><Link to="#" className="font-title" title="Linkedin">{educationHistory[0].degreeTitle}@{educationHistory[0].college}</Link></li><br />
                                                            </React.Fragment>
                                                        ) : ''
                                                    } */}
                                                    <li className="list-inline-item"><Link to="#" className="font-title" title="Skype"><img src={gmail} style={{ height: 13, marginRight: 10 }} />{userDetails.email}</Link></li>
                                                </ul>
                                            </Col>
                                            <Col md="7" className="text-md-right text-center">
                                                <div className="profile-bar fixed-top-bar">
                                                    <Row style={{marginTop: 10}}>
                                                        <Col md="4" xs="4">
                                                            <div
                                                                className={this.props.location.pathname.includes("/provider/requests") && "active-user-tab"}
                                                                onClick={() => this.handleNavigation('/provider/requests')}>
                                                                <div className="img-notifi">
                                                                    <img src={emailicon} />
                                                                    {requests && requests.length > 0 &&
                                                                        <span className="badge zoom-in-out2">{requests.length}</span>}
                                                                </div>
                                                                <h6>PENDING REQUESTS </h6>
                                                            </div>
                                                        </Col>
                                                        <Col md="4" xs="4">
                                                            <div onClick={() => this.handleNavigation(`/provider/orders/${localStorage.getItem('userId')}`)}
                                                                className={this.props.location.pathname.includes("/provider/orders") && "active-user-tab"}>
                                                                <div className="img-notifi">
                                                                    <img src={reservation} />
                                                                    {ordersLength > 0 &&
                                                                        <span className="badge zoom-in-out2">{ordersLength}</span>}
                                                                </div>
                                                                <h6>CONFIRMED REQUESTS</h6>
                                                            </div>
                                                        </Col>
                                                        <Col md="4" xs="4">
                                                            <div onClick={() => this.handleNavigation(`/provider/wallet/${localStorage.getItem('userId')}`)}
                                                                className={this.props.location.pathname.includes("/provider/wallet") && "active-user-tab"}>
                                                                <img src={walletIcon} className="img-notifi" />
                                                                {/* <span>Rs {this.getWalletBalance(wallet.advanceTotal, wallet.payableTotal, wallet.amountPaid)}</span> */}
                                                                <h6>MY WALLET</h6>
                                                            </div>
                                                        </Col>
                                                        {/* <Col md="3 tiles">
                                                                <a className="mobile-hide" onClick={() => this.handleNavigation('/provider/dashboard')}>
                                                                    <img src={tiles}></img>
                                                                    <h5>Dashboard</h5>
                                                                </a>
                                                            </Col> */}
                                                    </Row>

                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>

                            )
                        }
                        <Modal isOpen={this.state.liveModal}>
                            <ModalBody className="golivemodal">
                                <h6>Currently, the YoCo 'Mock-User Training' is going on (October 28, 29, 30)</h6>
                                <p className="font-title">Familiarize yourself with the process of finding a service request, interacting with the user to understand their requirements, providing a quote, and getting an offer accepted.</p>
                                <p>YOU DO NOT HAVE TO DELIVER THE SERVICE.<br></br> YOU WILL NOT RECEIVE PAYMENTS.</p>
                                <Button className="post-request" onClick={this.toggleLiveModal}>Close</Button>
                            </ModalBody>
                        </Modal>
                        <Modal isOpen={this.state.cameraUploadModal} role="dialog" autoFocus={true} centered={true}>
                            <ModalBody>

                                <Camera
                                    onCapture={blob => this.captureImage(blob)}
                                    onClear={() => this.onClear(undefined)}
                                />
                                {userPicture !== null &&
                                    <Row className="text-center">
                                        <Col lg="2"></Col>
                                        <Col lg="4">
                                            <div className="camera-buttons" onClick={this.handleSubmitUpload}>Save</div>{'    '}
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
                    </div>

                        :

                        <div className="mobile-show mobile-shows profile-box">
                        <Row>
                            <Col xs="12">
                                {/* <div className="mock">
                                    <h6 >
                                        <span onClick={this.gotoSettings}><img src={bell} style={{ width: 20, marginRight: 5, marginTop: -5 }} />
                                        Update notifications settings now!</span><span onClick={this.toggleModal} className="know-more">Know More</span></h6>
                                </div> */}
                            </Col>
                            <Offline>
                                <Col xs="12">
                                    <div className="offline">
                                        <h6 style={{ textAlign: 'center' }}>
                                            <ErrorOutlineIcon />You are not connected to internet</h6>
                                    </div> </Col>
                            </Offline>
                            <Col md="3" xs="4" className={this.props.location.pathname === "/provider/requests" ? "img-with-count active-profile-tab" : "img-with-count"}>
                                <div className="center-assist">
                                    <a onClick={() => this.handleNavigation('/provider/requests')}>
                                        <img src={emailicon}></img>
                                        <span>{requests === null ? 0 : requests.length}</span>
                                        <p className="bold font14">Requests</p>
                                    </a>
                                </div>
                            </Col>
                            <Col md="3" xs="4" className={this.props.location.pathname === `/provider/orders/${localStorage.getItem('userId')}` ? "img-with-count active-profile-tab" : "img-with-count"}>
                                <a onClick={() => this.handleNavigation(`/provider/orders/${localStorage.getItem('userId')}`)} className="center-assist">
                                    <img src={reservation}></img>
                                    <span>{ordersLength}</span>
                                    <p className="bold font14">Orders</p>
                                </a>
                            </Col>
                            <Col md="3" xs="4" className={this.props.location.pathname === `/provider/wallet/${localStorage.getItem('userId')}` ? "img-with-count active-profile-tab" : "img-with-count"}>
                                <a onClick={() => this.handleNavigation(`/provider/wallet/${localStorage.getItem('userId')}`)} className="center-assist">
                                    <span>Rs {this.getWalletBalance(wallet.advanceTotal, wallet.payableTotal, wallet.amountPaid)}</span>
                                    <p className="bold font14">My Wallet</p>
                                </a>
                            </Col>
                            <Col md="3 tiles">
                                <a className="mobile-hide" onClick={() => this.handleNavigation('/provider/dashboard')}>
                                    <img src={tiles}></img>
                                    <p className="bold font14">Dashboard</p>
                                </a>
                            </Col>
                        </Row>
                        {/* <div className="notification-bell">
                            <img onClick={() => this.props.history.push('/notifications')} src={notification} />
                        </div> */}
                        <Modal isOpen={this.state.isModalVisible}>
                            <ModalBody>
                                <p className="font-title">
                                    You can opt to receive notifications on email or WhatsApp when there is any activity (a user posts a new request in your area, a user accepts your offer, a user approves your service etc.). Set your notification preferences right away by clicking Profile/ Settings.
                                </p>
                                <Button className="post-request" onClick={this.toggleModal}>Close</Button>
                            </ModalBody>
                        </Modal>
                    </div>
                </div>
                <Modal isOpen={this.state.isValidateVisible} role="dialog" autoFocus={true} centered={true}>
                    <ModalBody>
                        <p className="font-title">
                            Please provide all the necessary <b>Personal</b> and <b>Education</b> details {documentsVerified && documentsVerified.length < 2 && (<text>, <b>Photo proof</b> and <b>Address proof</b></text>)} to respond to the service requests.
                        </p>
                        <Button className="post-request" onClick={this.toggleValidateModal}>Ok</Button>
                    </ModalBody>
                </Modal>
            </React.Fragment >

        )
    }
}

function mapStateToProps(state) {
    return {
        requests: state.request.requests,
        userDetails: state.profile.userDetails,
        isUserLoad: state.profile.isUserLoad,
        isProfileUpdate: state.profile.isProfileUpdate,
        avatarUrl: state.profile.avatarUrl,
        userLocation: state.profile.userLocation,
        orders: state.request.orders,
        wallet: state.request.wallet,
        careOrders: state.request.providerCareOrders
    }
}
export default connect(mapStateToProps, { ...ProfileAction, ...RequestActions })(ProfileBar)