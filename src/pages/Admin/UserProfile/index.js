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
import Progressbar from '../../../components/Shared/Progressbar';
import VerifyPrice from '../../../components/Shared/PhotoVerify/VerifyPrice';

//Import Images
import imgbg from "../../../assets/images/account/bg.jpg";

import address from "../../../images/icon/paper.png";
import refreshing from "../../../images/icon/refreshing.png";
import photoproof from "../../../images/icon/frame.png";
import Experience from './Experience';
import { ProfileAction } from '../../../redux/actions';
import Education from './Education';
import Training from './Training';

import ProfileInputForm from './ProfileInputForm';
import Recommendation from './Recommendation';
import InfoBox from '../../../components/Shared/InfoBox';
import Spiffy from '../../../components/Shared/Spiffy';

// import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
// import 'react-html5-camera-photo/build/css/index.css';

import UploadPhotoProof from '../../../components/Shared/PhotoVerify/UploadPhotoProof';
import UserInfo from '../../../components/Shared/UserInfo';
import UploadAdressProof from '../../../components/Shared/DocVerify/UploadAdressProof';
import warning from "../../../images/icon/warning.png";
import UploadPhotoProofAdmin from '../../../components/Shared/PhotoVerify/UploadPhotoProofAdmin';
import UploadAdressProofAdmin from '../../../components/Shared/DocVerify/UploadAdressProofAdmin';
import assets from '../../../assets/images';
import back from "../../../images/icon/back.png";

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
            modalVisible: false

        }
        this.toggle = this.toggle.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onChangeVideo = this.onChangeVideo.bind(this)
        this.onChangeVideoCourse2 = this.onChangeVideoCourse2.bind(this)
        this.onChangeVideoCourse3 = this.onChangeVideoCourse3.bind(this)
        this.stopVideo = this.stopVideo.bind(this)
        this.onClickOk = this.onClickOk.bind(this)
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


    componentDidMount() {
        let pathName = this.props.location.pathname;

        const userId = pathName.substring(pathName.lastIndexOf('/') + 1)

        if (userId !== null) {
            this.setState({
                userId: userId
            }, () => {
                this.props.getUserProfileById({
                    userId: userId
                })
            })
        }
        window.scroll(0, 0);
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
                // this.setState({
                //     modalVisible: allDocuments && !allDocuments[0].isVerified
                // })
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
        // if (videoElement) {
        //     var iframe = videoElement.querySelector('iframe');
        //     if (iframe) {
        //         var video = videoElement.querySelector('video');
        //         if (iframe) {
        //             var iframeSrc = iframe.src;
        //             iframe.src = iframeSrc;
        //         }
        //         if (video) {
        //             video.pause();
        //         }
        //     }
        // }
    }
    shouldComponentUpdate() {
        return true;
    }
    onClickBack = () => {
        this.props.history.goBack()
    }

    render() {
        const { allEducations, userId } = this.state;
        const { userDetails, allEmployments, allTraining, allRecommendations, avatarUrl } = this.props;

        return (
            <React.Fragment>

                <section className="section mt-60 purple-backdrop">
                    <Container className="mt-lg-3">
                        {/* <Row>
                            <img xs="2" md='1' className="relative" onClick={() => this.onClickBack()} className="back-go go-button" src={back} />
                            <span>Back</span>
                        </Row> */}
                        <Row>
                            <Col lg="4" md="5" xs="12">
                                <div className="sidebar p-4 rounded subtle-shadow">
                                    <Row>
                                        <Col lg="8" xs="8">
                                            <div className="widget">
                                                <div className="progress-box mt-4">
                                                    <h6 className="bold">Profile completion</h6>
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

                                                <UploadPhotoProofAdmin img={photoproof} text={"Upload"} userId={this.state.userId} userDetails={userDetails} desc={"Photo Proof"} />
                                            </Col>
                                            <Col lg="6" xs="6">
                                                <UploadAdressProofAdmin userId={this.state.userId} img={address} text={"Upload"} desc={"Address Proof"} />
                                            </Col>
                                        </Row>
                                        {
                                            this.props.allDocuments && this.props.allDocuments.length > 0 && !this.props.allDocuments[0].isVerified && (
                                                <Modal isOpen={this.state.modalVisible} role="dialog" autoFocus={true} centered={true}>
                                                    <ModalBody>
                                                        <div style={{ padding: 10 }}>
                                                            <Row style={{ justifyContent: 'center' }}>
                                                                <img src={warning} style={{ width: 30, height: 26 }} />
                                                                <p style={{ textAlign: 'center', paddingLeft: 10, fontSize:16 }}><b>Upload not successful</b></p>
                                                            </Row>

                                                            <ul>
                                                                <li><h6>Ensure you have uploaded the correct document (matching with the document type you selected)</h6></li>
                                                                <li><h6>Check the file size - it should be under 5MB</h6></li>
                                                                <li><h6>Photo should be clearly visible</h6></li>
                                                                <li><h6>Preferred file format - .jpg or .jpeg</h6></li>
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
                                </div>
                            </Col>

                            <Col lg="8" md="7" xs="12" className="mt-4 mt-sm-0 pt-2 pt-sm-0">
                                <div className="ml-lg-3">

                                    <div className="border-bottom pb-4">
                                        <Row>
                                            <Col lg="12">

                                                <Nav pills className="nav-justified bottom-shadow vertipadd">
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
                                                                <p className="title font-weight-normal mb-0 font16">Personal</p>
                                                            </div>
                                                        </NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink
                                                            className={classnames({ active: this.state.activeTab === '2' }) + " rounded"}
                                                            onClick={() => { this.toggle('2'); }}
                                                        >
                                                            <div className="text-center pt-1 pb-1">
                                                                <p className="title font-weight-normal mb-0 font16">Employment</p>
                                                            </div>
                                                        </NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink
                                                            className={classnames({ active: this.state.activeTab === '3' }) + " rounded"}
                                                            onClick={() => { this.toggle('3'); }}
                                                        >
                                                            <div className="text-center pt-1 pb-1">
                                                                <p className="title font-weight-normal font16 mb-0">Education</p>
                                                            </div>
                                                        </NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink
                                                            className={classnames({ active: this.state.activeTab === '4' }) + " rounded"}
                                                            onClick={() => { this.toggle('4'); }}
                                                        >
                                                            <div className="text-center pt-1 pb-1">
                                                                <p className="title font-weight-normal mb-0">Recommendation</p>
                                                            </div>
                                                        </NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink
                                                            className={classnames({ active: this.state.activeTab === '5' }) + " rounded"}
                                                            onClick={() => { this.toggle('5'); }}
                                                        >
                                                            <div className="text-center pt-1 pb-1">
                                                                <p className="title font-weight-normal font16 mb-0">Training</p>
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
                                                navText={['', `<span>${this.state.owlNavText}</span>`]}
                                                nav
                                            >
                                                <div ref="iframe_container1" id="iframe_container1" className="item" key={"item1"}>
                                                    {

                                                        <iframe width="100%" height="250" key={this.state.selectedVideo} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={"allowFullScreen"} tabIndex='-1'
                                                            src={this.state.selectedVideo} />

                                                    }
                                                    <div style={{ textAlign: "center", padding: "0px 10px" }}>
                                                        <Button className="text-muted" key={"English1"} onClick={() => this.onChangeVideo('English')} style={{ fontSize: 12, fontWeight: this.state.selectedVideoLanguage === "English" ? 'bold' : 300 }} href="">ENGLISH</Button> | <Button key={"Malayalam1"} style={{ fontSize: 12, fontWeight: this.state.selectedVideoLanguage === "Malayalam" ? 'bold' : 300 }} onClick={() => this.onChangeVideo('Malayalam')} className="text-muted"  >MALAYALAM</Button>
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
                                                    <div style={{ textAlign: "center", padding: "0px 10px", marginTop: 10, marginBottom: 20 }}>
                                                        <Button className="text-muted" key={"English2"} onClick={() => this.onChangeVideoCourse2('English')} style={{ fontSize: 12, fontWeight: this.state.selectedCourse2Language === "English" ? 'bold' : 300 }} >ENGLISH</Button> | <Button key={"Malayalam2"} style={{ fontSize: 12, fontWeight: this.state.selectedCourse2Language === "Malayalam" ? 'bold' : 300 }} onClick={() => this.onChangeVideoCourse2('Malayalam')} className="text-muted"  >MALAYALAM</Button>
                                                    </div>
                                                </div>
                                                <div className="item" id="iframe_container3" key={"item3"}>
                                                    {

                                                        <iframe width="100%" height="250" key={this.state.selectedCourse3} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={"allowFullScreen"} tabIndex='-1'
                                                            src={this.state.selectedCourse3} />

                                                    }
                                                    <div style={{ textAlign: "center", padding: "0px 10px", marginTop: 10, marginBottom: 20 }}>
                                                        <Button className="text-muted" key={"English3"} onClick={() => this.onChangeVideoCourse3('English')} style={{ fontSize: 12, fontWeight: this.state.selectedCourse3Language === "English" ? 'bold' : 300 }}  >ENGLISH</Button> | <Button key={"Malayalam3"} style={{ fontSize: 12, fontWeight: this.state.selectedCourse3Language === "Malayalam" ? 'bold' : 300 }} onClick={() => this.onChangeVideoCourse3('Malayalam')} className="text-muted"  >MALAYALAM</Button>
                                                    </div>

                                                </div>
                                            </OwlCarousel>
                                            <Button className="skip-button" onClick={this.closeModal}>Close</Button>
                                        </ModalBody>
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
