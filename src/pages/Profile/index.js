import React, { Component } from 'react'
import { connect } from 'react-redux'
import OwlCarousel from 'react-owl-carousel';

import { Link } from "react-router-dom";
import {
    Container, Row, Col, Nav,
    NavItem,
    NavLink, TabContent,
    TabPane,
    Modal,
    ModalBody,
    Button
} from "reactstrap";


import classnames from 'classnames';
import Progressbar from '../../components/Shared/Progressbar';
import VerifyPrice from '../../components/Shared/PhotoVerify/VerifyPrice';

//Import Images
import imgbg from "../../assets/images/account/bg.jpg";

import address from "../../images/icon/paper.png";
import refreshing from "../../images/icon/refreshing.png";
import photoproof from "../../images/icon/frame.png";
import Experience from './Experience';
import { ProfileAction } from '../../redux/actions';
import Education from './Education';
import Training from './Training';

import ProfileInputForm from './ProfileInputForm';
import Recommendation from './Recommendation';
import InfoBox from '../../components/Shared/InfoBox';
import Spiffy from '../../components/Shared/Spiffy';

// import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
// import 'react-html5-camera-photo/build/css/index.css';

import UploadPhotoProof from '../../components/Shared/PhotoVerify/UploadPhotoProof';
import UserInfo from '../../components/Shared/UserInfo';
import UploadAdressProof from '../../components/Shared/DocVerify/UploadAdressProof';
import warning from "../../images/icon/warning.png";
import camera from "../../images/icon/camera.png";
import user from "../../images/icon/user-6.png";
import Camera from "../../components/Shared/Camera";
import * as firebase from 'firebase';
import fileUploadService from '../../handler/fileUploadService';
import cancel from '../../images/icon/cancel-2.png';

const assetsBaseUrl = process.env.REACT_APP_ASSETS_BASE_URL

export class index extends Component {
    constructor(props) {

        super(props);
        this.state = {
            activeTab: "1",
            isAlertVisible: false,
            cameraUploadModal: false,
            showTutorialModal: false,
            profileModal: false,
            owlNavText: 'Next',
            isCameraOpen: false,
            userPicture: null,
            currentSlideIndex: 0,
            selectedVideoLanguage: 'English',
            englishVideoLink: 'https://www.youtube.com/embed/wHvvNHGcslI',
            malayalamVideoLink: 'https://www.youtube.com/embed/V9MkwP-uDgE',
            selectedVideo: 'https://www.youtube.com/embed/wHvvNHGcslI',
            course2English: 'https://www.youtube.com/embed/Nx8gUOOkbls',
            course2Malayalam: 'https://www.youtube.com/embed/tCxjE-DLKfY',
            selectedCourse2: 'https://www.youtube.com/embed/Nx8gUOOkbls',
            selectedCourse2Language: 'English',
            course3English: 'https://www.youtube.com/embed/i396BSKpTjw',
            course3Malayalam: 'https://www.youtube.com/embed/UYgI9k36JX4',
            selectedCourse3: 'https://www.youtube.com/embed/i396BSKpTjw',
            selectedCourse3Language: 'English',
            modalVisible: false,
            userLocalProfile: ''
        }
        this.toggle = this.toggle.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onChangeVideo = this.onChangeVideo.bind(this)
        this.onChangeVideoCourse2 = this.onChangeVideoCourse2.bind(this)
        this.onChangeVideoCourse3 = this.onChangeVideoCourse3.bind(this)
        this.stopVideo = this.stopVideo.bind(this)
        this.onClickOk = this.onClickOk.bind(this)
        this.toggleCameraModal = this.toggleCameraModal.bind(this)
        this.captureImage = this.captureImage.bind(this)
        this.onClear = this.onClear.bind(this)
        this.handleSubmitUpload = this.handleSubmitUpload.bind(this)
    }
    closeModal() {
        this.setState(prevState => ({
            profileModal: !prevState.profileModal
        }));
    }
    onClickOk() {
        this.setState({
            modalVisible: false
        })
    }
    onChangeVideo(language) {

        this.setState({
            selectedVideoLanguage: language,
            currentSlideIndex: 0,
            selectedVideo: language === "English" ? "https://www.youtube.com/embed/wHvvNHGcslI" : "https://www.youtube.com/embed/V9MkwP-uDgE"
        }, () => {
            this.setState({
                selectedVideoLanguage: language,
                selectedVideo: language === "English" ? "https://www.youtube.com/embed/wHvvNHGcslI" : "https://www.youtube.com/embed/V9MkwP-uDgE"
            })
        })
    }
    onChangeVideoCourse2(language) {

        this.setState({
            selectedCourse2Language: language,
            currentSlideIndex: 1,
            selectedCourse2: language === "English" ? this.state.course2English : this.state.course2Malayalam
        }, () => {
            this.setState({
                selectedCourse2Language: language,
                selectedCourse2: language === "English" ? this.state.course2English : this.state.course2Malayalam
            })
        })
    }
    onChangeVideoCourse3(language) {

        this.setState({
            selectedCourse3Language: language,
            currentSlideIndex: 2,
            selectedCourse3: language === "English" ? this.state.course3English : this.state.course3Malayalam
        }, () => {
            this.setState({
                selectedCourse3Language: language,
                selectedCourse3: language === "English" ? this.state.course3English : this.state.course3Malayalam
            })
        })
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

    componentDidMount() {

        var isFirstTime = localStorage.getItem('isReturningUser', false)
        if (isFirstTime != "true") {
            this.setState({
                showTutorialModal: true,
                profileModal: true
            }, () => localStorage.setItem('isReturningUser', true))
        }
        if (localStorage.getItem("userId") !== null) {
            this.setState({
                userId: localStorage.getItem("userId")
            }, () => {
                // this.props.getUserProfileById({
                //     userId: this.state.userId
                // })
            })
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.isUserLoad !== prevState.isUserLoad) {
            if (nextProps.isUserLoad > 0) {
                return nextProps.isUserLoad;
            }
        }

        //Is Profile updated
        if (nextProps.isProfileUpdate !== prevState.isProfileUpdate) {
            if (nextProps.isProfileUpdate > 0) {
                return nextProps.isProfileUpdate;
            }
        }
        return null

    }
    toggleCameraModal = () => {
        this.setState(prevState => ({
            cameraUploadModal: !prevState.cameraUploadModal
        }));
    }

    componentDidUpdate(prevProps, prevState) {
        const { isUserLoad, userDetails, allDocuments } = this.props;
        if (prevProps.isUserLoad !== isUserLoad && userDetails) {
            this.setState({
                fullName: userDetails.fullname,
                email: userDetails.email,
                phone: userDetails.phoneNumber,
                avatarUrl: userDetails.avatarUrl,
                aboutMe: userDetails.aboutme,

            })
        }
        if (prevProps.allDocuments !== allDocuments) {
            if (allDocuments[0] && allDocuments[0].isVerified === false) {
                this.setState({
                    modalVisible: allDocuments && !allDocuments[0].isVerified
                })
            }

        }

    }
    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    onChangeText(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    toggleTrainingModal = () => {
        this.setState(prevState => ({
            trainingModel: !prevState.trainingModel
        }));
    }
    stopVideo() {



        var element1 = document.getElementById('iframe_container1')
        var element2 = document.getElementById('iframe_container2')
        var element3 = document.getElementById('iframe_container3')
        if (element1) {
            this.stopActiveVideo(element1)
        } if (element2) {
            this.stopActiveVideo(element2)
        } if (element3) {
            this.stopActiveVideo(element3)
            if (this.state.currentSlideIndex === 2) {
                this.setState({
                    owlNavText: 'Close'
                })
            }
        }



    };
    stopActiveVideo(videoElement) {
        if (videoElement) {
            var iframe = videoElement.querySelector('iframe');
            if (iframe) {
                var video = videoElement.querySelector('video');
                if (iframe) {
                    var iframeSrc = iframe.src;
                    iframe.src = iframeSrc;
                }
                if (video) {
                    video.pause();
                }
            }
        }
    }
    shouldComponentUpdate() {
        return true;
    }

    render() {
        const { allEducations, userId, userPicture } = this.state;
        const { userDetails, allEmployments, allTraining, allRecommendations, avatarUrl } = this.props;

        return (
            <React.Fragment>

                <section className="section mt-60 padd50 purple-backdrop">
                    <Container className="mt-lg-3">
                        <Row>
                            <Col lg="4" md="5" xs="12">

                                <div className="sidebar p-4 rounded subtle-shadow">
                                    {
                                        userDetails &&

                                        <div style={{ padding: 20, marginBottom: 20, width: '100%' }}>
                                            <div className='d-block mx-auto' style={{ position: 'relative', width: 110 }}>
                                                <img key={userDetails.avatarUrl} src={userDetails.avatarUrl !== '' ? `${assetsBaseUrl}/Users/${userDetails.userId}/Avatar/${userDetails.avatarUrl}` : user} className="avatar avatar-medium rounded-pill subtle-shadow d-block mx-auto profile-img" alt="" />
                                                <div onClick={this.toggleCameraModal} className="profile-bubble subtle-shadow pointer">
                                                    <img style={{ width: 20, height: 20 }} className="left" src={camera} />
                                                    {/* <Spiffy className={"left"} /> */}
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    <Row>
                                        <Col lg="8" xs="8">
                                            <div className="widget">
                                                <div className="progress-box mt-4">
                                                    <h6 className="bold">Profile Completion</h6>
                                                    <Progressbar value={50} ></Progressbar>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col lg="3" xs="4">
                                            <Spiffy style={{ width: 60, height: 50, marginTop: 18 }} />
                                        </Col>
                                    </Row>
                                    <div className="widget mt-4 pt-2">
                                        <Row>
                                            <Col md="7">
                                                <h6 className="bold text-center-mobile" style={{ marginBottom: 25 }}>Verify Account</h6>

                                            </Col>
                                            <Col md="4" style={{ textAlign: 'center', marginBottom: 5, cursor: 'pointer' }} >
                                                <div onClick={() => window.location.reload(true)}>
                                                    <img src={refreshing} style={{ width: 20, height: 20 }} /><span style={{ marginLeft: 5, fontSize: 12 }}>Refresh</span>

                                                </div>

                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col lg="6" xs="6">
                                                <UploadPhotoProof img={photoproof} text={"Upload"} userDetails={userDetails} desc={"Photo Proof"} />
                                            </Col>
                                            <Col lg="6" xs="6">
                                                <UploadAdressProof img={address} text={"Upload"} desc={"Address Proof"} />
                                            </Col>
                                        </Row>
                                        {
                                            this.props.allDocuments && this.props.allDocuments.length > 0 && !this.props.allDocuments[0].isVerified && (
                                                <Modal isOpen={this.state.modalVisible} role="dialog" autoFocus={true} centered={true}>
                                                    <ModalBody>
                                                        <div style={{ padding: 10 }}>
                                                            <Row style={{ justifyContent: 'center' }}>
                                                                <img src={warning} style={{ width: 30, height: 26 }} />
                                                                <p style={{ textAlign: 'center', paddingLeft: 10, fontSize: 16 }}><b>Upload not successful</b></p>
                                                            </Row>

                                                            <ul>
                                                                <li><h6>Ensure you have uploaded the correct ID as per your document type</h6></li>
                                                                <li><h6>Check the file size - it should be under 5MB</h6></li>
                                                                <li><h6>Your photo on the ID should be clear and visible</h6></li>
                                                                <li><h6>Preferred file format - .JPG or .JPEG</h6></li>
                                                            </ul>
                                                        </div>
                                                        <div style={{ textAlign: 'center' }}><Button onClick={() => this.onClickOk()}>Ok</Button></div>
                                                    </ModalBody>
                                                </Modal>
                                            )
                                        }

                                        <Row>
                                            {
                                                this.state.isAlertVisible ? (
                                                    <InfoBox title={"Document Uploaded!!"} desc={"You have successfully uploaded your document to verify.You will get a confirmation email, once it is verified"} />

                                                ) : ''
                                            }
                                        </Row>
                                    </div>
                                    {/* <hr /> */}
                                    {/* <VerifyPrice className="text-center-mobile" price={6} title={"Comprehensive Criminal Record Verification"}></VerifyPrice> */}
                                    <Modal isOpen={this.state.cameraUploadModal} role="dialog" autoFocus={true} centered={true}>
                                        <ModalBody>
                                            <div style={{position: 'relative'}}>
                                                <img className='pointer hover-grow-1' onClick={this.toggleCameraModal} src={cancel} style={{right: 0, width: 15, height: 15, position: 'absolute'}}/>
                                            <Camera
                                                onCapture={blob => this.captureImage(blob)}
                                                onClear={() => this.onClear(undefined)}
                                            />
                                            </div>
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
                            </Col>

                            <Col lg="8" md="7" xs="12" className="mt-4 mt-sm-0 pt-2 pt-sm-0">
                                <div className="ml-lg-3">

                                    <div className="border-bottom pb-4">
                                        <Row>
                                            <Col lg="12">

                                                <Nav pills className="nav-justified vertipadd">
                                                    {/* <OwlCarousel
                                                    className="owl-theme"
                                                    loop
                                                    margin={10}
                                                    mergeFit
                                                    items={5}
                                                    nav
                                                    dots={false}
                                                > */}
                                                    <NavItem>
                                                        <NavLink
                                                            className={classnames({ active: this.state.activeTab === '1' }) + ""}
                                                            onClick={() => { this.toggle('1'); }}
                                                        >
                                                            <div className="text-center pt-1 pb-1">
                                                                <p style={{ color: this.state.activeTab === '1' && '#fff' }} className="title font-weight-normal mb-0 font16">Personal</p>
                                                            </div>
                                                        </NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink
                                                            className={classnames({ active: this.state.activeTab === '2' }) + " rounded"}
                                                            onClick={() => { this.toggle('2'); }}
                                                        >
                                                            <div className="text-center pt-1 pb-1">
                                                                <p style={{ color: this.state.activeTab === '2' && '#fff' }} className="title font-weight-normal mb-0 font16">Employment</p>
                                                            </div>
                                                        </NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink
                                                            className={classnames({ active: this.state.activeTab === '3' }) + " rounded"}
                                                            onClick={() => { this.toggle('3'); }}
                                                        >
                                                            <div className="text-center pt-1 pb-1">
                                                                <p style={{ color: this.state.activeTab === '3' && '#fff' }} className="title font-weight-normal mb-0 font16">Education</p>
                                                            </div>
                                                        </NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink
                                                            className={classnames({ active: this.state.activeTab === '4' }) + " rounded"}
                                                            onClick={() => { this.toggle('4'); }}
                                                        >
                                                            <div className="text-center pt-1 pb-1">
                                                                <p style={{ color: this.state.activeTab === '4' && '#fff' }} className="font16 title font-weight-normal mb-0">Recommendation</p>
                                                            </div>
                                                        </NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink
                                                            className={classnames({ active: this.state.activeTab === '5' }) + " rounded"}
                                                            onClick={() => { this.toggle('5'); }}
                                                        >
                                                            <div className="text-center pt-1 pb-1">
                                                                <p style={{ color: this.state.activeTab === '5' && '#fff' }} className="font16 title font-weight-normal mb-0">Training</p>
                                                            </div>
                                                        </NavLink>
                                                    </NavItem>
                                                    {/* </OwlCarousel> */}

                                                    {/* Personal  */}


                                                    {/* Employment  */}

                                                    {/* Education  */}

                                                    {/* Recommendation  */}

                                                    {/* Training  */}

                                                </Nav>
                                            </Col>
                                        </Row>
                                        <Row className="pt-2">
                                            <Col>
                                                <TabContent activeTab={this.state.activeTab}>
                                                    <TabPane tabId="1" className="p-3">
                                                        {
                                                            userDetails && (
                                                                <ProfileInputForm userDetails={userDetails} />
                                                            )
                                                        }
                                                    </TabPane>
                                                    <TabPane tabId="2" className="p-3">
                                                        {
                                                            userId && userDetails && (
                                                                <Experience userId={userId} allEmployments={allEmployments} />
                                                            )
                                                        }
                                                    </TabPane>
                                                    <TabPane tabId="3" className="p-3">
                                                        {
                                                            userId && userDetails && (
                                                                <Education userId={userId} allEducations={allEducations} />
                                                            )
                                                        }
                                                    </TabPane>
                                                    <TabPane tabId="4" className="p-3">
                                                        {
                                                            userId && userDetails && (
                                                                <Recommendation allRecommendations={allRecommendations} userId={userId} />
                                                            )
                                                        }
                                                    </TabPane>
                                                    <TabPane tabId="5" className="p-3">
                                                        {
                                                            userId && userDetails && (
                                                                <Training allTraining={allTraining} userId={userId} />
                                                            )
                                                        }
                                                    </TabPane>
                                                </TabContent>

                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <div >
                            {
                                this.state.showTutorialModal && (

                                    <Modal isOpen={this.state.profileModal} key={`modal_3`} role="dialog" autoFocus={true} centered={true} className="custom-modal-body">
                                        <ModalBody>
                                            <OwlCarousel
                                                className="owl-theme custom-carousel"
                                                loop={false}
                                                margin={10}

                                                rewind={false}
                                                startPosition={this.state.currentSlideIndex}
                                                items={1}
                                                onChange={
                                                    this.stopVideo
                                                }
                                                key={"owlCarousel"}
                                                navText={[`<span>Back</span>`, `<span>Next</span>`]}
                                                nav
                                            >
                                                <div ref="iframe_container1" id="iframe_container1" className="item" key={"item1"}>
                                                    {

                                                        <iframe width="100%" height="250" key={this.state.selectedVideo} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={"allowFullScreen"} tabIndex='-1'
                                                            src={this.state.selectedVideo} />

                                                    }
                                                    <div style={{ textAlign: "center", padding: "0px 10px", marginTop: 20 }}>
                                                        <Button className="" key={"English1"} onClick={() => this.onChangeVideo('English')} style={{ fontSize: 12, fontWeight: this.state.selectedVideoLanguage === "English" ? 'bold' : 300, color: 'white' }} href="">ENGLISH</Button> | <Button key={"Malayalam1"} style={{ fontSize: 12, fontWeight: this.state.selectedVideoLanguage === "Malayalam" ? 'bold' : 300 }} onClick={() => this.onChangeVideo('Malayalam')} className=""  >MALAYALAM</Button>
                                                    </div>
                                                    {/* <div style={{ padding: 30 }}>
                                                        <h3>Get Started</h3>
                                                        <p style={{ fontSize: 12 }}>Lorem ipsum dolor sit amet. Lorem ipsum dolor sit ametLorem ipsum dolor sit ameta  Lorem ipsum dolor sit ametLorem  </p>
                                                    </div> */}
                                                </div>
                                                <div id="iframe_container2" className="item" key={"item2"}>
                                                    {

                                                        <iframe width="100%" height="250" key={this.state.selectedCourse2} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={"allowFullScreen"} tabIndex='-1'
                                                            src={this.state.selectedCourse2} />

                                                    }
                                                    <div style={{ textAlign: "center", padding: "0px 10px", marginTop: 20 }}>
                                                        <Button className="" key={"English2"} onClick={() => this.onChangeVideoCourse2('English')} style={{ fontSize: 12, fontWeight: this.state.selectedCourse2Language === "English" ? 'bold' : 300 }} >ENGLISH</Button> | <Button key={"Malayalam2"} style={{ fontSize: 12, fontWeight: this.state.selectedCourse2Language === "Malayalam" ? 'bold' : 300 }} onClick={() => this.onChangeVideoCourse2('Malayalam')} className=""  >MALAYALAM</Button>
                                                    </div>
                                                </div>
                                                <div className="item" id="iframe_container3" key={"item3"}>
                                                    {

                                                        <iframe width="100%" height="250" key={this.state.selectedCourse3} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={"allowFullScreen"} tabIndex='-1'
                                                            src={this.state.selectedCourse3} />

                                                    }
                                                    <div style={{ textAlign: "center", padding: "0px 10px", marginTop: 20 }}>
                                                        <Button className="" key={"English3"} onClick={() => this.onChangeVideoCourse3('English')} style={{ fontSize: 12, fontWeight: this.state.selectedCourse3Language === "English" ? 'bold' : 300 }}  >ENGLISH</Button> | <Button key={"Malayalam3"} style={{ fontSize: 12, fontWeight: this.state.selectedCourse3Language === "Malayalam" ? 'bold' : 300 }} onClick={() => this.onChangeVideoCourse3('Malayalam')} className=""  >MALAYALAM</Button>
                                                    </div>

                                                </div>
                                            </OwlCarousel>
                                        </ModalBody>
                                        <Button className="skip-button" onClick={() => this.setState({ profileModal: false, showTutorialModal: false })}>X</Button>
                                    </Modal>
                                )
                            }
                        </div>

                    </Container>
                </section>

            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    userDetails: state.profile.userDetails,
    isUserLoad: state.profile.isUserLoad,
    isEducationStored: state.profile.isEducationStored,
    isEmploymentStored: state.profile.isEmploymentStored,
    isProfileUpdate: state.profile.isProfileUpdate,
    allEducations: state.profile.allEducations,
    allEmployments: state.profile.allEmployments,
    allRecommendations: state.profile.allRecommendations,
    isTrainingInsert: state.profile.isTrainingInsert,
    allTraining: state.profile.allTraining,
    avatarUrl: state.profile.userDetails && state.profile.userDetails.avatarUrl,
    allDocuments: state.documents.allDocuments

})

const mapDispatchToProps = {
    ...ProfileAction
}

export default connect(mapStateToProps, mapDispatchToProps)(index)
