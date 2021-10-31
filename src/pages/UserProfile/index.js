import React, { Component } from 'react'
import { connect } from 'react-redux'
import OwlCarousel from 'react-owl-carousel';
import Switch from '@material-ui/core/Switch';
import Checkbox from '@material-ui/core/Checkbox';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import EmailIcon from '@material-ui/icons/Email';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Link } from "react-router-dom";
import {
    Container, Row, Col, Nav,
    NavItem,
    NavLink, TabContent,
    TabPane,
    Modal,
    ModalBody

} from "reactstrap";

import { ProfileAction } from '../../redux/actions';
import ProfileInputForm from './ProfileInputForm';
import firebase from "firebase"

import classnames from 'classnames';
// import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
// import 'react-html5-camera-photo/build/css/index.css';

import UploadAdressProof from '../../components/Shared/DocVerify/UploadAdressProof';
import { Button } from '@material-ui/core';


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
            newQuoteWhatsapp: false,
            newMessageWhatsapp: false,
            quoteAcceptWhatsapp: false,
            updateStatusWhatsapp: false,
            newQuoteEmail: false,
            newMessageEmail: false,
            quoteAcceptEmail: false,
            updateStatusEmail: false

        }
        this.toggle = this.toggle.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onChangeVideo = this.onChangeVideo.bind(this)
        this.onChangeVideoCourse2 = this.onChangeVideoCourse2.bind(this)
        this.onChangeVideoCourse3 = this.onChangeVideoCourse3.bind(this)
        this.stopVideo = this.stopVideo.bind(this)
        this.updateSettings = this.updateSettings.bind(this)
        this.toggleModal = this.toggleModal.bind(this)
        this.toggleErrorModal = this.toggleErrorModal.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }
    updateSettings() {
        if (this.props.userDetails && !this.props.userDetails.email || this.props.userDetails && !this.props.userDetails.phoneNumber) {
            this.setState({
                isErrorOpen: !this.state.isErrorOpen
            })
        }
        else {
            var notificationSettings = {
                SEND_QUOTE: {
                    whatsapp: this.state.newQuoteWhatsapp,
                    email: this.state.newQuoteEmail,
                    sms: false,
                    push: false
                },
                NEW_MESSAGE: {
                    whatsapp: this.state.newMessageWhatsapp,
                    email: this.state.newMessageEmail,
                    sms: false,
                    push: false
                },
                UPDATE_STATUS: {
                    whatsapp: this.state.updateStatusWhatsapp,
                    email: this.state.updateStatusEmail,
                    sms: false,
                    push: false
                }
            };
            var userId = localStorage.getItem("userId")
            const metadataRef = firebase.database().ref('user/' + userId + '/settings/notifications/data');
            metadataRef.update(notificationSettings)
            this.toggleModal()
        }
    }
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.checked
        })
    }
    toggleModal() {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }
    toggleErrorModal() {
        this.setState({
            isErrorOpen: !this.state.isErrorOpen
        })
    }
    closeModal() {
        this.setState(prevState => ({
            profileModal: !prevState.profileModal
        }));
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
        var userId = localStorage.getItem("userId")
        const metadataRef = firebase.database().ref('user/' + userId + '/settings/notifications/data');
        metadataRef.on('value', snapshot => {
            const getMetadata = snapshot.val();
            console.log(getMetadata)
            if (getMetadata) {
                this.setState({
                    newQuoteWhatsapp: getMetadata.SEND_QUOTE.whatsapp,
                    newMessageWhatsapp: getMetadata.NEW_MESSAGE.whatsapp,
                    updateStatusWhatsapp: getMetadata.UPDATE_STATUS.whatsapp,
                    newQuoteEmail: getMetadata.SEND_QUOTE.email,
                    newMessageEmail: getMetadata.NEW_MESSAGE.email,
                    updateStatusEmail: getMetadata.UPDATE_STATUS.email,
                })
            }
        })
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
    componentDidUpdate(prevProps, prevState) {
        const { isUserLoad, userDetails } = this.props;
        if (prevProps.isUserLoad !== isUserLoad && userDetails) {
            this.setState({
                fullName: userDetails.fullname,
                email: userDetails.email,
                phone: userDetails.phoneNumber,
                avatarUrl: userDetails.avatarUrl,
                aboutMe: userDetails.aboutme,

            })
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
        const { userId } = this.state;
        const { userDetails, avatarUrl } = this.props;

        return (
            <React.Fragment>

                <section style={{ paddingTop: 90 }} className="padd50 purple-backdrop">
                    <Container className="mt-lg-3">
                        <Row>
                            <Col lg="8" md="7" xs="12" className="mt-sm-0 pt-sm-0">
                                <div className="ml-lg-3">

                                    <div className="border-bottom pb-4">
                                        <Row>
                                            <Col lg="12">
                                                {/* <span className="onlystate">
                                                    Only state and city visible to users

                                                    Information for contact and support purpose only
                                                </span> */}
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
                                                                <p style={{ color: this.state.activeTab === '1' && '#fff' }} className="title font16 font-weight-normal mb-0">Personal</p>
                                                            </div>
                                                        </NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink
                                                            className={classnames({ active: this.state.activeTab === '2' }) + " rounded"}
                                                            onClick={() => { this.toggle('2'); }}
                                                        >
                                                            <div className="text-center pt-1 pb-1">
                                                                <p style={{ color: this.state.activeTab === '3' && '#fff' }} className="title font16 font-weight-normal mb-0">Settings</p>
                                                            </div>
                                                        </NavLink>
                                                    </NavItem>
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
                                                    <TabPane tabId="2" style={{ paddingTop: 15 }} className="settings-tab">
                                                        <Row>
                                                            <Col xs="6">
                                                                <p style={{ color: "purple" }} className="text-center font16"><b>Notifications</b></p>
                                                            </Col>
                                                            <Col xs="3">
                                                                <WhatsAppIcon style={{ margin: "0 auto", display: "block" }} />
                                                            </Col>
                                                            <Col xs="3">
                                                                <EmailIcon style={{ margin: "0 auto", display: "block" }} />
                                                            </Col>
                                                        </Row>
                                                        <hr />
                                                        <Row>
                                                            <Col xs="6">
                                                                <label className="pull-right" style={{ textAlign: 'right' }}>When a provider responds with a message</label>
                                                            </Col>
                                                            <Col xs="3">
                                                                <Switch name="newMessageWhatsapp" checked={this.state.newMessageWhatsapp} onChange={this.handleChange} />
                                                            </Col>
                                                            <Col xs="3">
                                                                <Switch name="newMessageEmail" checked={this.state.newMessageEmail} onChange={this.handleChange} />
                                                            </Col>
                                                        </Row>
                                                        <hr />
                                                        <Row>
                                                            <Col xs="6">
                                                                <label className="pull-right" style={{ textAlign: 'right' }}>When a provider provides a quote</label>
                                                            </Col>
                                                            <Col xs="3">
                                                                <Switch name="newQuoteWhatsapp" checked={this.state.newQuoteWhatsapp} onChange={this.handleChange} />
                                                            </Col>
                                                            <Col xs="3">
                                                                <Switch name="newQuoteEmail" checked={this.state.newQuoteEmail} onChange={this.handleChange} />
                                                            </Col>
                                                        </Row>
                                                        <hr />
                                                        <Row>
                                                            <Col xs="6">
                                                                <label className="pull-right" style={{ textAlign: 'right' }}>When a service status is updated</label>
                                                            </Col>
                                                            <Col xs="3">
                                                                <Switch name="updateStatusWhatsapp" checked={this.state.updateStatusWhatsapp} onChange={this.handleChange} />
                                                            </Col>
                                                            <Col xs="3">
                                                                <Switch name="updateStatusEmail" checked={this.state.updateStatusEmail} onChange={this.handleChange} />
                                                            </Col>
                                                        </Row>
                                                        <hr />
                                                        {/* <Row>
                                                            <Col xs="6">
                                                                <label className="pull-right" style={{ textAlign: 'right' }}>When a service delivery is completed</label>
                                                            </Col>
                                                            <Col xs="3">
                                                                <Switch />
                                                            </Col>
                                                            <Col xs="3">
                                                                <Switch />
                                                            </Col>
                                                        </Row> */}
                                                        <Row>
                                                            <Col xs="12">
                                                                <h6><b>Email : </b>{this.props.userDetails && this.props.userDetails.email}</h6>
                                                            </Col>
                                                        </Row>
                                                        <hr />
                                                        <Row>
                                                            <Col xs="12">
                                                                <h6><b>Mobile Number : </b>{this.props.userDetails && this.props.userDetails.phoneNumber}</h6>
                                                            </Col>
                                                        </Row>
                                                        <hr />
                                                        <div style={{width: '100%'}}>
                                                            <Button onClick={this.updateSettings} className="post-request">Save</Button>
                                                        </div>
                                                    </TabPane>
                                                </TabContent>
                                            </Col>
                                        </Row>
                                        <Modal isOpen={this.state.isOpen} role="dialog" autoFocus={true} centered={true}>
                                            <ModalBody>

                                                <p className="font16 bold alert-heading">Success</p>
                                                <p>
                                                    Settings updated successfully
                            </p>
                                                <Button onClick={this.toggleModal}>Ok</Button>

                                            </ModalBody>
                                        </Modal>
                                        <Modal isOpen={this.state.isErrorOpen} role="dialog" autoFocus={true} centered={true}>
                                            <ModalBody>
                                                <p>
                                                    Please add your phone number and email to your profile first.
                            </p>
                                                <Button onClick={this.toggleErrorModal}>Ok</Button>

                                            </ModalBody>
                                        </Modal>
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
                                                        <Button className="font-title" key={"English1"} onClick={() => this.onChangeVideo('English')} style={{ fontSize: 12, fontWeight: this.state.selectedVideoLanguage === "English" ? 'bold' : 300 }} href="">ENGLISH</Button> | <Button key={"Malayalam1"} style={{ fontSize: 12, fontWeight: this.state.selectedVideoLanguage === "Malayalam" ? 'bold' : 300 }} onClick={() => this.onChangeVideo('Malayalam')} className="font-title"  >MALAYALAM</Button>
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
                                                        <Button className="font-title" key={"English2"} onClick={() => this.onChangeVideoCourse2('English')} style={{ fontSize: 12, fontWeight: this.state.selectedCourse2Language === "English" ? 'bold' : 300 }} >ENGLISH</Button> | <Button key={"Malayalam2"} style={{ fontSize: 12, fontWeight: this.state.selectedCourse2Language === "Malayalam" ? 'bold' : 300 }} onClick={() => this.onChangeVideoCourse2('Malayalam')} className="font-title"  >MALAYALAM</Button>
                                                    </div>
                                                </div>
                                                <div className="item" id="iframe_container3" key={"item3"}>
                                                    {

                                                        <iframe width="100%" height="250" key={this.state.selectedCourse3} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={"allowFullScreen"} tabIndex='-1'
                                                            src={this.state.selectedCourse3} />

                                                    }
                                                    <div style={{ textAlign: "center", padding: "0px 10px", marginTop: 10, marginBottom: 20 }}>
                                                        <Button className="font-title" key={"English3"} onClick={() => this.onChangeVideoCourse3('English')} style={{ fontSize: 12, fontWeight: this.state.selectedCourse3Language === "English" ? 'bold' : 300 }}  >ENGLISH</Button> | <Button key={"Malayalam3"} style={{ fontSize: 12, fontWeight: this.state.selectedCourse3Language === "Malayalam" ? 'bold' : 300 }} onClick={() => this.onChangeVideoCourse3('Malayalam')} className="font-title"  >MALAYALAM</Button>
                                                    </div>

                                                </div>
                                            </OwlCarousel>
                                            <Button className="skip-button" onClick={() => this.setState({ profileModal: false })}>Close</Button>
                                        </ModalBody>
                                    </Modal>
                                )
                            }
                        </div>

                    </Container>
                </section>

            </React.Fragment >
        )
    }
}

const mapStateToProps = (state) => ({
    userDetails: state.profile.userDetails,
    isUserLoad: state.profile.isUserLoad,
    isProfileUpdate: state.profile.isProfileUpdate,
    avatarUrl: state.profile.userDetails && state.profile.userDetails.avatarUrl,
    allDocuments: state.documents.allDocuments

})

const mapDispatchToProps = {
    ...ProfileAction
}

export default connect(mapStateToProps, mapDispatchToProps)(index)
