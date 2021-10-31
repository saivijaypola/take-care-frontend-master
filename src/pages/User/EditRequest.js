import React, { Component } from 'react'
import { connect } from 'react-redux'
import { v4 as uuidv4 } from 'uuid';
import { Link } from "react-router-dom";
import {
    Container, Row, Col, Modal, ModalBody, Alert, Spinner, Form

} from "reactstrap";

import { AvForm, AvField, AvGroup } from 'availity-reactstrap-validation';

//Import Images
import help from "../../images/icon/help-2.png";
import calendar from "../../images/icon/pink-cal.png";
import marker from "../../images/icon/pink-marker.png";
import { ProfileAction, UserActions } from '../../redux/actions';



import JobCard from '../../components/Shared/JobCard/JobCard';
import JobDetail from '../../components/Shared/JobDetail/JobDetail';
import CandidateCard from '../../components/Shared/CandidateCard/CandidateCard';
// import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
// import 'react-html5-camera-photo/build/css/index.css';

import UploadPhotoProof from '../../components/Shared/PhotoVerify/UploadPhotoProof';
import Userbox from '../../components/Shared/Userbox';
import UploadAdressProof from '../../components/Shared/DocVerify/UploadAdressProof';
import { Button } from '@material-ui/core';
import { lang } from 'moment';
import FloatingInput from '../../components/Shared/GeoSuggest/FloatingInput';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRange } from 'react-date-range';

export class NewRequest extends Component {
    constructor(props) {

        super(props);
        this.state = {
            isDateModalVisible: false,
            isHelpModalVisible: false,
            title: '',
            isError: false,
            chars_left: 1000,
            errorMessage: '',
            description: '',
            isFlexibleDate: true,
            isSpecificDate: false,
            userId: '',
            isSuccess: false,
            selectedDate: [{
                startDate: new Date(),
                endDate: new Date(),
                key: 'selection'
            }],
            requestLocation: ''
        }
        this.toggleModal = this.toggleModal.bind(this)
        this.toggleHelpModal = this.toggleHelpModal.bind(this)
        this.onChangeText = this.onChangeText.bind(this)
        this.handleCharCount = this.handleCharCount.bind(this)
        this.saveRequest = this.saveRequest.bind(this)
        this.onSelectLocation = this.onSelectLocation.bind(this)
        this.onSelectDate = this.onSelectDate.bind(this)
        this.onFocus = this.onFocus.bind(this)
        this.onSuccessNavigation = this.onSuccessNavigation.bind(this)
    } 
    handleCharCount(event) {
        if (event.target.value.length < 1001) {
            this.setState({
                chars_left: 1000 - event.target.value.length,
                [event.target.name]: event.target.value
            });
        }

    }
    componentDidMount() {
        window.scrollTo(0, 0)
        var isFirstTime = localStorage.getItem('isReturningUser', false)
        if (!isFirstTime) {
            this.setState({
                showTutorialModal: true
            }, () => localStorage.setItem('isReturningUser', true))
        }
        if (localStorage.getItem("userId") !== null) {
            this.setState({
                profileModal: true,
                userId: localStorage.getItem("userId")
            }, () => {
                this.props.getUserProfileById({
                    userId: this.state.userId
                })
            })
        }
    }
    componentDidUpdate(prevProps, prevState) {

        //is education stored 
        const { isPosted, selectedPost } = this.props;
        if (prevProps.isPosted !== isPosted && selectedPost) {
            if (isPosted) {
                this.setState({
                    isSuccess: true
                })

            } else {
                // window.alert("Failed to post your request")
            }
        }

    }
    onChangeText(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    toggleModal() {
        this.setState({
            isDateModalVisible: !this.state.isDateModalVisible
        })
    }
    toggleHelpModal() {
        this.setState({
            isHelpModalVisible: !this.state.isHelpModalVisible
        })
    }
    saveRequest() {
        const { requestLocation } = this.state
        if (this.state.title !== '' && this.state.description !== '' && this.state.userId !== '' && requestLocation) {
            var request = {
                "inputRequest": {
                    "requestId": uuidv4(),
                    "title": this.state.title,
                    "description": this.state.description,
                    "userId": this.state.userId,
                    "locationTitle": requestLocation.locationTitle,
                    "latitude": requestLocation.latitude,
                    "longitude": requestLocation.longitude,
                    "isHealthcare": false,
                    "isDisabled": false,
                    "isCompleted": false,
                    "isDateFlexible": this.state.isFlexibleDate,
                    "createdAt": new Date()
                }
            }
            if (!this.state.isFlexibleDate) {
                request.inputRequest.serviceNeedsOn = this.state.selectedDate[0].startDate
                request.inputRequest.serviceEndsOn = this.state.selectedDate[0].endDate
            }
            this.props.postNewRequest(request)
        } else {
            this.setState({
                isError: true,
                errorMessage: 'Failed to post your request. All fields are mandatory'
            })
        }


    }
   
    onFocus = event => {

        if (event.target.autocomplete) {
            event.target.autocomplete = "whatever";
        }

    };
    onSelectLocation = (selectedLocation) => {
        this.setState({
            requestLocation: selectedLocation
        })
    }
    onSelectDate() {
        this.setState({
            isFlexibleDate: false,
            isSpecificDate: true,
            isDateModalVisible: !this.state.isDateModalVisible
        })
    }
    render() {

        const { userDetails, userLocation } = this.props;
        const { isDateModalVisible, isFlexibleDate, isSpecificDate, isError, isSuccess } = this.state
        return (
            <React.Fragment>

                <section className="section padd50 purple-backdrop">
                    <Container>
                        <Row>
                            <Col lg="4">
                                <div className="subtle-shadow mobile-hide" style={{ borderRadius: 8 }}>

                                    {
                                        this.state.userId && (
                                            <JobCard {...this.props} userId={this.state.userId} isActive={true}></JobCard>
                                        )
                                    }
                                </div>
                            </Col>
                            <Col lg="8">
                                <div className="new-request">
                                    <p className="bold font14">Post Your New Request</p>
                                    <Row>
                                        <Col lg="6">
                                            <Form autoComplete="off">
                                                <Row>
                                                    <Col xs="10">
                                                        <input type="text" className="form-control" name="title" onChange={this.onChangeText} placeholder="Title"></input>
                                                    </Col>
                                                    <Col xs="2"></Col>

                                                    <Col xs="10">
                                                        <br />
                                                        <textarea rows="4" style={{ marginBottom: 7 }} type="text" onChange={this.handleCharCount} className="form-control" name="description" placeholder="Please describe your request" maxLength="1000"></textarea>
                                                        <span className="font-title" style={{ paddingLeft: 5 }}>{this.state.chars_left}/1000 characters left</span>
                                                    </Col>
                                                    <Col xs="2">
                                                        <img onClick={this.toggleHelpModal} className="help-img" src={help}></img>
                                                    </Col>
                                                </Row>
                                                <hr />
                                                <Row>
                                                    <Col xs="1">
                                                        <img style={{ width: 30 }} src={marker}></img>
                                                    </Col>
                                                    <Col xs="11">
                                                        <label className="request-label">Where do you want this service to be delivered?</label>
                                                    </Col>
                                                    <Col xs="1">

                                                    </Col>
                                                    <Col xs="9" style={{ marginBottom: 7 }}>
                                                        <FloatingInput autoComplete="off" onFocus={this.onFocus} onSelectLocation={this.onSelectLocation} value={this.state.requestLocation} label={"Select Location"} initialLocation={userLocation && userLocation ? userLocation : ''}  {...this.props} />
                                                    </Col>
                                                    <Col xs="2">

                                                    </Col>
                                                </Row>
                                                <hr />
                                                <Row>
                                                    <Col xs="1">
                                                        <img style={{ width: 30 }} src={calendar}></img>
                                                    </Col>
                                                    <Col xs="11">
                                                        <label className="request-label">When do you require this service completed?</label>
                                                    </Col>
                                                    <Col xs="1">

                                                    </Col>
                                                    <Col xs="9">
                                                        <input onClick={() => this.setState({ isFlexibleDate: true, isSpecificDate: false })} checked={isFlexibleDate} type="radio" style={{ width: 20, marginLeft: 8, display: "inline-block" }} className="form-control" name="when">

                                                        </input>
                                                        <label className="form-control-label font-title">Flexible</label>

                                                        <input onClick={() => this.onSelectDate()} checked={isSpecificDate} type="radio" style={{ width: 20, display: "inline-block", marginLeft: 20 }} className="form-control" name="when">
                                                        </input>
                                                        <label onClick={() => this.onSelectDate()} className="form-control-label font-title">Specific Date</label>
                                                        {
                                                            !isFlexibleDate && (
                                                                <p>{new Date(this.state.selectedDate[0].startDate).toDateString()} - {new Date(this.state.selectedDate[0].endDate).toDateString()}</p>
                                                            )
                                                        }
                                                    </Col>
                                                    <Col xs="2">

                                                    </Col>

                                                </Row>
                                            </Form>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Button onClick={this.saveRequest} className="post-request"> Post Request</Button>
                                </div>
                            </Col>
                        </Row>

                    </Container>
                </section>
                <Modal isOpen={this.state.isHelpModalVisible} role="dialog" autoFocus={true} centered={true}>
                    <ModalBody>
                        <p className="helpmodal">Please key in the specific details of the task here. If any purchase of materials is required, please mention your readiness to pay an advance.
                                <br></br> <br></br>
                                Pricing of the service can be discussed with service providers on a one-on-one basis after they respond to your request.  You can also explore customisation options at this point.
                            </p>
                        <Button className="post-request" onClick={this.toggleHelpModal}>Close</Button>
                    </ModalBody>
                </Modal>
                <Modal isOpen={isDateModalVisible} role="dialog" autoFocus={true} centered={true}>
                    <ModalBody>
                        <DateRange
                            editableDateInputs={true}
                            onChange={(item) => this.setState({ selectedDate: [item.selection] })}
                            moveRangeOnFirstSelection={false}
                            ranges={this.state.selectedDate}
                        />
                        <br />
                        <Button onClick={this.toggleModal}>Close</Button>
                    </ModalBody>
                </Modal>
                <Modal isOpen={isError} role="dialog" autoFocus={true} centered={true}>
                    <ModalBody>
                        <Alert color="danger">
                            <p className="alert-heading font16 bold">Failed</p>
                            <p>
                                {this.state.errorMessage}
                            </p>
                            <Button onClick={() => this.setState({ isError: false, errorMessage: '' })}>Close</Button>
                        </Alert>
                    </ModalBody>
                </Modal>
                <Modal isOpen={isSuccess} role="dialog" autoFocus={true} centered={true}>
                    <ModalBody>

                        <p className="alert-heading font16 bold">Success</p>
                        <p>
                            Request updated Successfully
                            </p>
                        <Button onClick={() => this.onSuccessNavigation()}>Ok</Button>

                    </ModalBody>
                </Modal>
                {
                    this.props.isLoading ? (
                        <Modal className="spinner-modal" isOpen={true}>
                            <Spinner animation="border" />
                        </Modal>
                    ) : ''
                }
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    userDetails: state.profile.userDetails,
    isUserLoad: state.profile.isUserLoad,
    userLocation: state.profile.userLocation,
    allPosts: state.user.allPosts,
    isLoading: state.user.isLoading,
    isPosted: state.user.isPosted,
    selectedPost: state.user.selectedPost,
    avatarUrl: state.profile.userDetails && state.profile.userDetails.avatarUrl

})

const mapDispatchToProps = {
    ...ProfileAction,
    ...UserActions
}

export default connect(mapStateToProps, mapDispatchToProps)(NewRequest)
