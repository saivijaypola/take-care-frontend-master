import React, { Component } from 'react';
import { connect } from 'react-redux'

import { Link } from "react-router-dom";
import {
    Row, Col,
    Modal,
    ModalBody,
    Spinner,


} from "reactstrap";
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import * as firebase from 'firebase';
import { ProfileAction, UserActions, RequestActions } from '../../../redux/actions';
import Camera from "../Camera";
import JobDetail from '../../../components/Shared/JobDetail/JobDetail';
import Filter from '../../../components/Shared/Filter/Filter';
import camera from "../../../images/icon/camera.png";
import emailicon from "../../../images/icon/email.png";
import pay from "../../../images/icon/pay.png";
import add from "../../../images/icon/add.png";
import requests from "../../../images/icon/test.png";
import order from "../../../images/icon/check-list.png";
import newpost from "../../../images/icon/add-new.png";
import gmail from "../../../images/icon/gmail.png";
import list from "../../../images/icon/list.png";
import { Offline, Online } from "react-detect-offline";
import providers from "../../../images/icon/providers.png";
import user from "../../../images/icon/user-6.png";
import fileUploadService from '../../../handler/fileUploadService';
import notification from "../../../images/icon/notification.svg";
import JobDrawer from '../../Layout/JobDrawer'
import { Button } from '@material-ui/core';

const assetsBaseUrl = process.env.REACT_APP_ASSETS_BASE_URL

class UserProfileNav extends Component {
    constructor(props) {
        super(props)
        this.state = {
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
            // showingList: "All",
            allPostsLength: 0,
            selectedFilter: 'All',
            redirect: true,
            selectedRequestId: ''
        }
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
    }
    onClear() {
        this.setState({
            userPicture: undefined
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
        window.scrollTo(0, 0)
        const { userDetails, showingList, allConfirmedRequests } = this.props
        var userId = localStorage.getItem("userId")
        const metadataRef = firebase.database().ref('user/' + userId + '/settings/notifications/data');
        metadataRef.once('value', snapshot => {
            const checkNotification = snapshot.val();
            // console.log("sheit",checkNotification)
            if (checkNotification == null) {
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
                metadataRef.update(notificationSettings)
            }
        })
        if (this.props.location.pathname === "/user/orders") {
            this.props.getConfirmedRequests({ userId: localStorage.getItem('userId'), status: 'Confirmed' })
            this.setState({
                listView: true
            })
            this.props.setFilter({
                "filter": "orders"
            })
        }
        if (this.props.location.pathname === "/user/requests") {

            this.props.getAllRequests({ id: localStorage.getItem('userId') })
            this.props.setFilter({
                "filter": "All"
            })
        }
        if (localStorage.getItem("userId") !== null && !userDetails) {
            this.props.getUserProfileById({
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
        this.props.history.push(targetUrl)
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
    componentDidUpdate(prevProps, prevState) {
        const { isUserLoad, userDetails, showingList, requestDetails } = this.props;

        const { allPosts, allConfirmedRequests } = this.props;
        if (prevProps.allPosts !== allPosts) {
            this.setState({
                allPostsLength: allPosts && allPosts.length
            })
        }
        if (prevProps.allConfirmedRequests !== allConfirmedRequests) {
            this.setState({
                allPostsLength: allConfirmedRequests && allConfirmedRequests.length
            })
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
        if (prevProps.requestDetails !== requestDetails && requestDetails) {
            console.log(requestDetails.tblServiceOrdersByRequestId && requestDetails.tblServiceOrdersByRequestId.nodes.length > 0 ? requestDetails.tblServiceOrdersByRequestId.nodes[0].orderStatus : "test")
            if (requestDetails.tblServiceOrdersByRequestId && requestDetails.tblServiceOrdersByRequestId.nodes.length > 0) {
                for (var i = 0; i < requestDetails.tblServiceOrdersByRequestId.nodes.length; i++) {
                    if (requestDetails.tblServiceOrdersByRequestId.nodes[i].orderStatus === "Confirmed") {
                        this.props.history.push({ pathname: `/provider-details/${requestDetails.requestId}/${requestDetails.tblServiceOrdersByRequestId.nodes[i].providerId}`, state: { data: requestDetails.tblServiceOrdersByRequestId.nodes[i].providerId } })
                    }
                }
            }
        }

    }
    render() {
        const videoConstraints = {

            facingMode: "user"
        };
        const { userDetails, avatarUrl, showingList, requestDetails } = this.props
        const educationHistory = userDetails && userDetails.tblEducationsByUserId && userDetails.tblEducationsByUserId.nodes && userDetails.tblEducationsByUserId.nodes.length > 0 ? userDetails.tblEducationsByUserId.nodes : []
        const employmentHistory = userDetails && userDetails.tblEmploymentsByUserId && userDetails.tblEmploymentsByUserId.nodes && userDetails.tblEmploymentsByUserId.nodes.length > 0 ? userDetails.tblEmploymentsByUserId.nodes : []

        return (
            <div>
                <div className="mobile-show mobile-shows profile-box">
                    <Offline>
                        <div className="offline">


                            <Col xs="12">
                                <p style={{ textAlign: 'center', fontWeight:"bold" }}>
                                    <ErrorOutlineIcon />You are not connected to internet</p>
                            </Col>
                        </div>
                    </Offline>
                    <div className="fixed-top-bar">
                        {this.props.location.pathname.includes("/provider-details") ?
                            <span></span>
                            :
                            <Row>
                                <Col xs="4">
                                    <div
                                        className={this.props.location.pathname.includes("/user/requests") && "active-user-tab"}
                                        onClick={() => this.props.history.push('/user/requests')}>
                                        <img src={requests} />
                                        <p style={{fontWeight:"bold"}}>REQUESTS</p>
                                    </div>
                                </Col>
                                <Col xs="4">
                                    <div
                                        className={this.props.location.pathname.includes("/user/orders") && "active-user-tab"}
                                        onClick={() => this.props.history.push('/user/orders')}>
                                        <img src={order} />
                                        <p style={{fontWeight:"bold"}}>ORDERS</p>
                                    </div>
                                </Col>
                                <Col xs="4">
                                    <div
                                        className={this.props.location.pathname.includes("/user/new-reques") && "active-user-tab"}
                                        onClick={() => this.props.history.push('/user/new-request')}>
                                        <img src={newpost} />
                                        <p style={{fontWeight:"bold"}}>POST NEW</p>
                                    </div>
                                </Col>
                            </Row>
                        }
                        {/* <div className="notification-bell">
                        <img onClick={() => this.props.history.push('/notifications')} src={notification}/>
                        </div> */}

                    </div>
                    {/* <img src={avatarUrl !== '' ? `${assetsBaseUrl}/Users/${userDetails && userDetails.userId}/Avatar/${avatarUrl}` : user} className="mobile-profile-img rounded-pill d-block profile-img" alt="" /> */}
                    {/* {this.state.listView ?
                        <div>
                            <span className="requests-count" >
                                {this.state.allPostsLength} Requests</span>
                            <Link onClick={() => this.props.history.push('/user/new-request')}><img className="big-icon mobile-add" src={add}></img></Link>
                            <select onChange={this.onChangeFilter} style={{ width: 100, float: "right", marginRight: 15 }} className="form-control b-r-10 custom-select">
                                <option value="All" selected={showingList == "All"}>All</option>
                                <option value="orders" selected={showingList == "orders"}>Orders</option>
                            </select>
                        </div>

                        : */}
                    <div>
                        {!this.props.location.pathname.includes("/user/providers") ?
                            <div>
                                {/* {this.props.location.pathname.includes("/provider-details") &&
                                    <span className="bold" style={{ fontSize: 14, display: "block", paddingTop: 7, marginLeft: 12, float: "left" }}>{requestDetails && requestDetails.title}</span>
                                } */}
                                {this.props.location.pathname.includes("user/payment/") &&
                                    <span className="bold" style={{ fontSize: 14, display: "block", paddingTop: 7, paddingBottom: 7, marginLeft: 12, float: "left" }}>{requestDetails && requestDetails.title}</span>
                                }

                                {this.props.location.pathname.includes("/user/profile") ?
                                    <div style={{ padding: "10px 20px" }} className="relative">
                                        <img onClick={this.togglePictureModal} src={avatarUrl !== '' ? `${assetsBaseUrl}/Users/${userDetails.userId}/Avatar/${avatarUrl}` : user} className="user-profile-img avatar avatar-medium rounded-pill subtle-shadow d-block mx-auto profile-img" alt="" />
                                        <div onClick={this.toggleCameraModal} className="profile-bubble user-profile-bubble subtle-shadow">
                                            <img style={{ width: 20, height: 20, marginLeft: 5 }} className="left" src={camera} />
                                            {/* <Spiffy className={"left"} /> */}
                                        </div>
                                        <Modal isOpen={this.state.pictureModal} role="dialog" autoFocus={true} centered={true}>
                                            <ModalBody>
                                                <img style={{ marginBottom: 10 }} src={avatarUrl !== '' ? `${assetsBaseUrl}/Users/${userDetails.userId}/Avatar/${avatarUrl}` : user}></img>
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
                                        <p className="title mb-0 userbox-name bold" style={{fontSize:19}}>{userDetails && userDetails.fullname}</p>
                                    </div>
                                    :
                                    this.props.location.pathname.includes("/provider-details") && (
                                        // <div style={{ paddingBottom: 7 }}>
                                        //     {

                                        //         <Link onClick={() => this.props.history.push(`/user/providers/${this.props.match.params.requestid}/list`)}><img className="pull-left big-icon mobile-add" src={providers}></img></Link>

                                        //     }
                                        // </div>
                                        <span></span>
                                    )
                                }
                                {/* <Link onClick={() => this.props.history.push('/user/requests')}><img className="pull-left big-icon mobile-add" src={list}></img></Link> */}
                            </div> :
                            <div>
                                <Row>
                                    <Col xs="12">
                                        <JobDetail defaultFilter={this.state.selectedFilter} />
                                    </Col>
                                </Row>
                            </div>
                        }

                    </div>

                    {/* <h6 style={{ marginTop: 10 }} className="bold title mb-0">{userDetails && userDetails.fullname}</h6> */}
                </div>
                {
                    this.props.location.pathname.includes("/user/providers") &&
                    <div className="mobile-hide desktop-filter">
                        <JobDetail defaultFilter={this.state.selectedFilter} />
                    </div>
                }

                <div className="public-profile mobile-hide position-relative p-4 bg-white overflow-hidden subtle-shadow" style={{ zIndex: "1" }}>

                    {
                        userDetails && (

                            <Row className="align-items-center">
                                {/* <Col lg="2" md="3" className="text-md-left text-center">
                                    <div className="relative">
                                        <img src={avatarUrl !== '' ? `${assetsBaseUrl}/Users/${userDetails.userId}/Avatar/${avatarUrl}` : user} className="avatar avatar-medium rounded-pill subtle-shadow d-block mx-auto profile-img" alt="" />
                                        <div onClick={this.toggleCameraModal} className="profile-bubble subtle-shadow">
                                            <img style={{ width: 20, height: 20, marginLeft: 5 }} className="left" src={camera} />
                                        </div>
                                    </div>
                                </Col> */}

                                <Col lg="12" md="12">
                                    <Row className="align-items-center">
                                        <Col md='1'></Col>
                                        <Col md="4" className="text-md-left text-center mt-4 mt-sm-0">
                                            <p className="title mb-0 font20 bold font-title">{userDetails && userDetails.fullname}</p>
                                            <ul className="list-inline mb-0">
                                                {
                                                    employmentHistory.length > 0 ? (
                                                        <React.Fragment>
                                                            <li className="list-inline-item mr-2" style={{ fontSize: 12 }}><Link to="#" className="font-title" title="Linkedin">{employmentHistory[0].jobTitle}@{employmentHistory[0].companyName}</Link></li><br />
                                                        </React.Fragment>
                                                    ) : educationHistory.length > 0 ? (
                                                        <React.Fragment>
                                                            <li className="list-inline-item mr-2" style={{ fontSize: 12 }}><Link to="#" className="font-title" title="Linkedin">{educationHistory[0].degreeTitle}@{educationHistory[0].college}</Link></li><br />
                                                        </React.Fragment>
                                                    ) : ''
                                                }
                                                <li className="list-inline-item"><Link to="#" className="font-title" title="Skype"><img src={gmail} style={{height: 13, marginRight: 10}}/>{userDetails.email}</Link></li>
                                            </ul>
                                        </Col>
                                        <Col md="7" className="text-md-right text-center">
                                            <div className="profile-bar fixed-top-bar">
                                                <Row>
                                                    {/* <Col md="4" xs="4" className="img-with-count">
                                                        <div className="center-assist">
                                                            <Link onClick={() => this.props.history.push('/user/requests')}>   <img className="big-icon" src={emailicon}></img></Link>
                                                            <span className="orange-span">{this.state.allPostsLength}</span>
                                                            <h5>Requests</h5>
                                                        </div>
                                                    </Col>
                                                    <Col md="4" xs="4" className="img-with-count">
                                                        <div className="center-assist">
                                                            <img className="big-icon" src={pay}></img>
                                                            <h5>Payments</h5>
                                                        </div>
                                                    </Col>
                                                    <Col md="4" xs="4" className="img-with-count">
                                                        <div className="center-assist">
                                                            <Link onClick={() => this.props.history.push('/user/new-request')}> <img className="big-icon" src={add}></img></Link>
                                                        </div>
                                                    </Col> */}
                                                    <Col xs="4" md='4'>
                                                        <div
                                                            className={this.props.location.pathname.includes("/user/requests") && "active-user-tab"}
                                                            onClick={() => this.props.history.push('/user/requests')}>
                                                            <img src={requests} />
                                                            {/* <span className="orange-span">{this.state.allPostsLength}</span> */}
                                                            <h6>PENDING REQUESTS</h6>
                                                        </div>
                                                    </Col>
                                                    <Col xs="4" md='4'>
                                                        <div
                                                            className={this.props.location.pathname.includes("/user/orders") && "active-user-tab"}
                                                            onClick={() => this.props.history.push('/user/orders')}>
                                                            {/* <span className="orange-span">{this.state.allC}</span> */}
                                                            <img src={order} />
                                                            <h6>CONFIRMED REQUESTS</h6>
                                                        </div>
                                                    </Col>
                                                    <Col xs="4" md='4'>
                                                        <div
                                                            className={this.props.location.pathname.includes("/user/new-reques") && "active-user-tab"}
                                                            onClick={() => this.props.history.push('/user/new-request')}>
                                                            <img src={newpost} />
                                                            <h6>POST NEW REQUEST</h6>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                        )
                    }
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

                    {/* {
                        this.props.isLoading ? (
                            <Modal className="spinner-modal" isOpen={true}>
                               <Spinner animation="border" />
                            </Modal>
                        ):''
                    } */}
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        userDetails: state.profile.userDetails,
        isUserLoad: state.profile.isUserLoad,
        showingList: state.request.showingList,
        allPosts: state.user.allPosts,
        nearByProviders: state.user.nearByProviders,
        selectedPost: state.user.selectedPost,
        isProfileUpdate: state.profile.isProfileUpdate,
        avatarUrl: state.profile.avatarUrl,
        responds: state.user.responds,
        allConfirmedRequests: state.user.allConfirmedRequests,
        requestDetails: state.request.requestDetails


    }
}
export default connect(mapStateToProps, { ...ProfileAction, ...UserActions, ...RequestActions })(UserProfileNav)