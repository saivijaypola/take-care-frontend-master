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
import calendar from "../../images/icon/calendar.svg";
// import marker from "../../images/icon/pink-marker.png";
import chevright from "../../images/icon/arrow-point-to-right.png";
import platform from "../../images/icon/platform.png";
import marker from "../../images/icon/location-marker.svg";
import group from "../../images/icon/group.svg";
import completed from "../../images/icon/check.svg";
import chat from "../../images/icon/chat-2.png";
import quote from "../../images/icon/invoices.png";
import { ProfileAction, UserActions, RequestActions } from '../../redux/actions';


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
import { Calendar } from 'react-date-range';

export class NewRequest extends Component {
    constructor(props) {

        super(props);
        this.state = {
            isDateModalVisible: false,
            isHelpModalVisible: false,
            title: '',
            editing: false,
            isError: false,
            chars_left: 1000,
            errorMessage: '',
            description: '',
            section1Complete: false,
            section2Complete: false,
            section3Complete: false,
            showingScreen: "section1",
            selectedRequestId: '',
            isFlexibleDate: true,
            isSpecificDate: false,
            userId: '',
            isSuccess: false,
            // selectedDate: [{
            //     startDate: new Date(),
            //     endDate: new Date(),
            //     key: 'selection'
            // }],
            selectedDate: new Date(),
            requestLocation: '',
            testLocation: "",
            serviceCategory: "",
            categories: [
                { id: 1, title: "Healthcare", description: "Get instantly connected with local health professionals who provide in-home services like nursing care, physiotherapy and routine health checkup." },
                { id: 2, title: "Wellbeing", description: "Reliable individuals can thoughtfully serve by spending time with the elderly and providing them companionship, or accompanying them for doctor visits." },
                { id: 3, title: "Lab Tests", description: "Avoid the commute to provide samples; qualified professionals can handle this safely at the convenience of your home." },
                { id: 4, title: "Property Maintenance", description: "We have experts who gauge and coordinate any maintenance work required at home or other properties." },
                { id: 5, title: "Utility Support", description: "You can rely on our pool of enthusiastic individuals who can take up simple tasks like helping with bank transactions, paying utility bills or land taxes, deliver groceries, medicines or any essentials." },
                { id: 6, title: "Technical Assistance", description: "Guidance to use laptops and other smart devices; help with resolving internet and connectivity problems." },
                { id: 7, title: "Others", description: "Any other help you need which does not fall under the six categories mentioned." },
            ],
            categoryDescription: ""
        }
        this.toggleModal = this.toggleModal.bind(this)
        this.toggleHelpModal = this.toggleHelpModal.bind(this)
        this.step1Complete = this.step1Complete.bind(this)
        this.step2Complete = this.step2Complete.bind(this)
        this.step3Complete = this.step3Complete.bind(this)
        this.step3CompleteEdit = this.step3CompleteEdit.bind(this)
        this.step2prev = this.step2prev.bind(this)
        this.step3prev = this.step3prev.bind(this)
        this.onChangeText = this.onChangeText.bind(this)
        this.onChangeSelect = this.onChangeSelect.bind(this)
        this.handleCharCount = this.handleCharCount.bind(this)
        this.saveRequest = this.saveRequest.bind(this)
        this.updateRequest = this.updateRequest.bind(this)
        this.onSelectLocation = this.onSelectLocation.bind(this)
        this.onSelectDate = this.onSelectDate.bind(this)
        this.onFocus = this.onFocus.bind(this)
        this.onSuccessNavigation = this.onSuccessNavigation.bind(this)
        this.gotoProviders = this.gotoProviders.bind(this)
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
        this.props.changeLocation(null)
        if (this.props.match.params.requestid) {
            this.setState({
                editing: true,
                selectedRequestId: this.props.match.params.requestid
            })
            this.props.getRequestDetails({
                requestId: this.props.match.params.requestid
            })
        }
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
        const { isPosted, selectedPost, requestDetails, isRequestUpdated } = this.props;
        const { selectedDate } = this.state
        if (prevProps.isRequestUpdated !== isRequestUpdated && selectedPost) {
            if (isRequestUpdated) {
                // this.setState({
                //     isSuccess: true
                // })
            } else {
                // window.alert("Failed to post your request")
            }
        }
        if (prevProps.isPosted !== isPosted && selectedPost) {
            if (isPosted) {
                // this.props.history.push(`/user/providers/${selectedPost.requestId}`)
                this.props.getNearByProviders(
                    {
                        locationData: {
                            "user_latitude": this.state.requestLocation && this.state.requestLocation.latitude,
                            "user_longitude": this.state.requestLocation && this.state.requestLocation.longitude,
                            "user_radius": process.env.REACT_APP_PROVIDER_RADIUS ? parseFloat(process.env.REACT_APP_PROVIDER_RADIUS) : 40000
                        }
                    })
            } else {
                // window.alert("Failed to post your request")
            }
        }
        if (requestDetails && prevProps.requestDetails !== requestDetails) {
            var locationData = {
                'locationTitle': requestDetails.locationTitle,
                'latitude': requestDetails.latitude,
                'longitude': requestDetails.longitude
            }
            this.props.changeLocation(locationData)
            // alert(requestDetails.serviceNeedsOn,)
            this.setState({
                title: requestDetails.title,
                serviceCategory: requestDetails.serviceCategory,
                description: requestDetails.description,
                selectedDate: requestDetails.serviceNeedsOn,
                chars_left: 1000 - requestDetails.description.length,
                requestLocation: locationData
            })
            // console.log("sheeet", requestDetails.serviceNeedsOn)
            for (var i = 0; i < this.state.categories.length; i++) {
                if (this.state.categories[i].title == requestDetails.serviceCategory) {
                    this.setState({
                        categoryDescription: this.state.categories[i].description
                    })
                    break
                }
            }
            if (requestDetails.serviceNeedsOn) {
                var dateData = [
                    {
                        "startDate": new Date(requestDetails.serviceNeedsOn),
                        "endDate": new Date(requestDetails.serviceEndsOn),
                        "key": "selection"
                    }
                ]
                this.setState({
                    isFlexibleDate: false,
                    isSpecificDate: true,
                    // selectedDate: dateData
                })
            }
        }
        // if (selectedDate && prevProps.selectedDate !== selectedDate) {

        // }

    }

    onChangeText(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    onChangeSelect(event) {
        this.setState({
            serviceCategory: event.target.value
        })
        for (var i = 0; i < this.state.categories.length; i++) {
            if (this.state.categories[i].title == event.target.value) {
                this.setState({
                    categoryDescription: this.state.categories[i].description
                })
                break
            }
        }
    }
    toggleModal() {
        this.setState({
            isDateModalVisible: !this.state.isDateModalVisible
        })
    }
    gotoProviders() {
        this.props.history.push(`/user/providers/${this.props.selectedPost.requestId}/new`)
    }
    step1Complete() {
        if (this.state.serviceCategory !== '') {
            this.setState({
                showingScreen: "section2",
                section1Complete: true
            })
        }
        else {
            this.setState({
                isError: true,
                errorMessage: 'Please select a category'
            })
        }

    }
    step2Complete() {
        if (this.state.title !== '' && this.state.description !== '') {
            this.setState({
                showingScreen: "section3",
                section2Complete: true
            })
        }
        else {
            this.setState({
                isError: true,
                errorMessage: 'All fields are mandatory'
            })
        }

    }
    step2prev() {
        this.setState({
            showingScreen: "section1",
            section2Complete: false,
            section1Complete: false
        })
    }
    step3Complete() {
        const { requestLocation } = this.state
        if (this.state.title !== '' && this.state.description !== '' && this.state.userId !== '' && requestLocation && this.state.serviceCategory !== '') {
            var request = {
                "inputRequest": {
                    "requestId": uuidv4(),
                    "serviceCategory": this.state.serviceCategory,
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
                request.inputRequest.serviceNeedsOn = this.state.selectedDate
                request.inputRequest.serviceEndsOn = this.state.selectedDate
            }
            this.setState({
                showingScreen: "section4",
                section3Complete: true
            })
            this.props.postNewRequest(request)
        } else {
            this.setState({
                isError: true,
                errorMessage: 'Failed to post your request. All fields are mandatory'
            })
        }

    }
    step3CompleteEdit() {
        const { requestLocation } = this.state
        if (this.state.title !== '' && this.state.description !== '' && this.state.userId !== '' && requestLocation) {
            var request = {
                "requestId": this.state.selectedRequestId,
                "requestData": {
                    "title": this.state.title,
                    "serviceCategory": this.state.serviceCategory,
                    "description": this.state.description,
                    "userId": this.state.userId,
                    "locationTitle": requestLocation.locationTitle,
                    "latitude": requestLocation.latitude,
                    "longitude": requestLocation.longitude,
                    "isHealthcare": false,
                    "isDisabled": false,
                    "isCompleted": false,
                    "isDateFlexible": this.state.isFlexibleDate,
                    "updatedAt": new Date()
                }
            }
            if (!this.state.isFlexibleDate) {
                request.requestData.serviceNeedsOn = this.state.selectedDate
                request.requestData.serviceEndsOn = this.state.selectedDate
            }
            this.setState({
                showingScreen: "section4",
                section3Complete: true
            })
            this.props.updateRequest(request)
        } else {
            this.setState({
                isError: true,
                errorMessage: 'Failed to post your request. All fields are mandatory'
            })
        }
    }
    step3prev() {
        this.setState({
            showingScreen: "section2",
            section3Complete: false,
            section2Complete: false
        })
    }
    toggleHelpModal() {
        this.setState({
            isHelpModalVisible: !this.state.isHelpModalVisible
        })
    }
    onSuccessNavigation = () => {
        this.props.history.push(`/user/requests`)
    }
    saveRequest() {
        const { requestLocation } = this.state
        if (this.state.title !== '' && this.state.description !== '' && this.state.userId !== '' && requestLocation) {
            var request = {
                "inputRequest": {
                    "requestId": uuidv4(),
                    "serviceCategory": this.state.serviceCategory,
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
                request.inputRequest.serviceNeedsOn = this.state.selectedDate
                request.inputRequest.serviceEndsOn = this.state.selectedDate
            }
            this.props.postNewRequest(request)
        } else {
            this.setState({
                isError: true,
                errorMessage: 'Failed to post your request. All fields are mandatory'
            })
        }

    }
    updateRequest() {
        const { requestLocation } = this.state
        if (this.state.title !== '' && this.state.description !== '' && this.state.userId !== '' && requestLocation) {
            var request = {
                "requestId": this.state.selectedRequestId,
                "requestData": {
                    "title": this.state.title,
                    "serviceCategory": this.state.serviceCategory,
                    "description": this.state.description,
                    "userId": this.state.userId,
                    "locationTitle": requestLocation.locationTitle,
                    "latitude": requestLocation.latitude,
                    "longitude": requestLocation.longitude,
                    "isHealthcare": false,
                    "isDisabled": false,
                    "isCompleted": false,
                    "isDateFlexible": this.state.isFlexibleDate,
                    "updatedAt": new Date()
                }
            }
            if (!this.state.isFlexibleDate) {
                request.requestData.serviceNeedsOn = this.state.selectedDate
                request.requestData.serviceEndsOn = this.state.selectedDate
            }
            this.props.updateRequest(request)
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
        const { requestLocation, providers, nearByProviders, isDateModalVisible, isFlexibleDate, isSpecificDate, isError, isSuccess } = this.state
        return (
            <React.Fragment>

                <section className="purple-backdrop" style={{ paddingTop: 15 }}>
                    <Container>
                        <Row>
                            {/* <Col lg="4">
                                <div className="subtle-shadow mobile-hide" style={{ borderRadius: 8 }}>

                                    {
                                        this.state.userId && (
                                            <JobCard {...this.props} userId={this.state.userId} isActive={true}></JobCard>
                                        )
                                    }
                                </div>
                            </Col> */}
                            <Col lg="12">
                                <div className="post-steps">
                                    <Row>
                                        <Col xs="3"
                                            className={
                                                this.state.showingScreen == "section1" ?
                                                    "step-active"
                                                    :
                                                    ""
                                            }
                                        >
                                            <div className=
                                                {this.state.section1Complete ?
                                                    "post-step completed right-dots"
                                                    :
                                                    "post-step right-dots"
                                                }>
                                                <span>1</span>
                                                <p className="font14">Category</p>
                                            </div>
                                        </Col>
                                        <Col xs="3"
                                            className={
                                                this.state.showingScreen == "section2" ?
                                                    "step-active"
                                                    :
                                                    ""
                                            }
                                        >
                                            <div className=
                                                {this.state.section2Complete ?
                                                    "post-step completed right-dots"
                                                    :
                                                    "post-step right-dots"
                                                }>
                                                <span>2</span>
                                                <p className="font14">Description</p>
                                            </div>
                                        </Col>
                                        <Col xs="3"
                                            className={
                                                this.state.showingScreen == "section3" ?
                                                    "step-active"
                                                    :
                                                    ""
                                            }
                                        >
                                            <div className=
                                                {this.state.section3Complete ?
                                                    "post-step completed right-dots"
                                                    :
                                                    "post-step right-dots"
                                                }>
                                                <span>3</span>
                                                <p className="font14">Location</p>
                                            </div>
                                        </Col>
                                        <Col xs="3"
                                            className={
                                                this.state.showingScreen == "section4" ?
                                                    "step-active"
                                                    :
                                                    ""
                                            }
                                        >
                                            <div className=
                                                {this.state.section4Complete ?
                                                    "post-step completed"
                                                    :
                                                    "post-step"
                                                }>
                                                <span>4</span>
                                                <p className="font14">Results</p>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                            <Col lg="12">
                                <div className="new-request">
                                    {this.state.showingScreen == "section1" &&
                                        <div>
                                            {this.state.editing ?
                                                <p className="bold font14  text-left" style={{ marginBottom: 0 }}>Edit Request</p>
                                                :
                                                <p className="bold font14 text-left" style={{ marginBottom: 0 }}>Start A New Request</p>
                                            }
                                            <p className="font-title font14" style={{ borderBottom: "4px solid #ececec", paddingBottom: 7 }}>
                                                YoCo is a platform to find trusted companions with any help you need. Here, readiness to help stands ahead of specialised skills. Even if service providers cannot do a task themselves, they will make sure that they arrange the service.
                                    </p>
                                        </div>
                                    }
                                    <Row>
                                        <Col lg="6">
                                            <Form autoComplete="off">
                                                {this.state.showingScreen == "section1" &&
                                                    <div>
                                                        <Row>
                                                            <Col xs="12"><label><b>Choose a service category for your request</b></label></Col>
                                                            <Col xs="10">

                                                                <select onChange={this.onChangeSelect} className="form-control selectbig">
                                                                    <option selected disabled>Choose from these categories</option>
                                                                    {
                                                                        this.state.categories.map((category) =>
                                                                            <option value={category.title} selected={this.state.serviceCategory == category.title}>{category.title}</option>
                                                                        )
                                                                    }
                                                                </select>

                                                            </Col>
                                                            <Col xs="2">

                                                            </Col>
                                                            <Col xs="12">
                                                                {
                                                                    this.state.categoryDescription &&
                                                                    <p style={{ marginBottom: 0, marginTop: 5 }} className="font-title font14">
                                                                        {this.state.categoryDescription}
                                                                    </p>
                                                                }
                                                                <br />
                                                            </Col>
                                                        </Row>
                                                        <div className="bottom-post">
                                                            <Row>
                                                                <Col xs="6">
                                                                    <a onClick={() => this.props.history.push('/user/requests')} className="bottom-cancel">Cancel</a>
                                                                </Col>
                                                                <Col xs="6">
                                                                    <a className="bottom-continue" onClick={this.step1Complete}>Continue <img style={{ width: 25 }} src={chevright} /></a>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </div>
                                                }
                                                {
                                                    this.state.showingScreen == "section2" &&
                                                    <div>
                                                        <p className="bold font14 text-left" style={{ marginBottom: 5 }}>Describe your request further</p>
                                                        <Row>
                                                            <Col xs="10">
                                                                <input type="text" className="form-control" name="title" onChange={this.onChangeText} placeholder="Title of your request" defaultValue={this.state.title}></input>
                                                            </Col>
                                                            <Col xs="2"></Col>

                                                            <Col xs="10">
                                                                <br />
                                                                <textarea rows="4" style={{ marginBottom: 7 }} type="text" onChange={this.handleCharCount} value={this.state.description} className="form-control" name="description" placeholder="Please describe your request" maxLength="1000"></textarea>
                                                                <span className="font-title" style={{ paddingLeft: 5, float: "left", fontSize: 12, marginBottom: 8 }}>{this.state.chars_left}/1000 characters left</span>
                                                            </Col>
                                                            <Col xs="2">
                                                                <img onClick={this.toggleHelpModal} className="help-img" src={help}></img>
                                                            </Col>
                                                            <Col xs="12">
                                                                <p className="font-title font14">
                                                                    You can get your service even more customised when you discuss the details with service providers after you post this.
                                                        </p>
                                                                <br />
                                                            </Col>
                                                        </Row>
                                                        <div className="bottom-post">
                                                            <Row>
                                                                <Col xs="6">
                                                                    <a onClick={this.step2prev} className="bottom-cancel">Prev</a>
                                                                </Col>
                                                                <Col xs="6">
                                                                    <a className="bottom-continue" onClick={this.step2Complete}>Continue <img style={{ width: 25 }} src={chevright} /></a>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </div>


                                                }
                                                {
                                                    this.state.showingScreen == "section3" &&
                                                    <div>
                                                        <p className="bold font14 text-left" style={{ marginBottom: 5 }}>Describe your request further</p>
                                                        <Row>
                                                            <Col xs="1">
                                                                <img style={{ width: 30, marginTop: 4 }} src={marker}></img>
                                                            </Col>
                                                            <Col xs="11">
                                                                <label className="request-label">Where do you want this service to be delivered?</label>
                                                            </Col>
                                                            <Col xs="1">

                                                            </Col>
                                                            <Col xs="9" style={{ marginBottom: 7 }}>
                                                                <FloatingInput autoComplete="off" onFocus={this.onFocus} onSelectLocation={this.onSelectLocation} value={this.state.requestLocation} label={"Select Location"} initialLocation={this.state.requestLocation ? this.state.requestLocation : ''}  {...this.props} />
                                                            </Col>
                                                            <Col xs="2">

                                                            </Col>
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

                                                                <input defaultValue={this.state.selectedDate} onClick={() => this.onSelectDate()} checked={isSpecificDate} type="radio" style={{ width: 20, display: "inline-block", marginLeft: 20 }} className="form-control" name="when">
                                                                </input>
                                                                <label onClick={() => this.onSelectDate()} className="form-control-label font-title">Specific Date</label>
                                                                {
                                                                    !isFlexibleDate && (
                                                                        <p>{new Date(this.state.selectedDate).toDateString()}</p>
                                                                    )
                                                                }
                                                                <p>
                                                                    {/* {this.state.selectedDate} */}
                                                                </p>
                                                            </Col>
                                                            <Col xs="2">

                                                            </Col>

                                                        </Row>
                                                        <div className="bottom-post">
                                                            <Row>
                                                                <Col xs="6">
                                                                    <a onClick={this.step3prev} className="bottom-cancel">Prev</a>
                                                                </Col>
                                                                {this.state.editing ?
                                                                    <Col xs="6">
                                                                        <a className="bottom-continue" onClick={this.step3CompleteEdit}>Continue <img style={{ width: 25 }} src={chevright} /></a>
                                                                    </Col>
                                                                    :
                                                                    <Col xs="6">
                                                                        <a className="bottom-continue" onClick={this.step3Complete}>Continue <img style={{ width: 25 }} src={chevright} /></a>
                                                                    </Col>
                                                                }
                                                            </Row>
                                                        </div>
                                                    </div>

                                                }
                                                {this.state.showingScreen == "section4" &&
                                                    <div>
                                                        {
                                                            !this.props.isPosted ?
                                                                <div className="provider-loader">
                                                                    <img src={marker} />
                                                                </div> :
                                                                <div>
                                                                    {
                                                                        this.props.providers &&
                                                                        <div>
                                                                            {
                                                                                this.props.providers.length >= 0 ?
                                                                                    <div>
                                                                                        <div className="posted-banner">
                                                                                            <h6><img src={completed} /> Your request is posted</h6>
                                                                                        </div>
                                                                                        <div className="whats-next">
                                                                                            <p className="font16 bold"><b>What's Next ?</b></p>
                                                                                            <Row>
                                                                                                <Col xs="3">
                                                                                                    <img src={chat} />
                                                                                                    <h6><b>CHAT</b></h6>
                                                                                                </Col>
                                                                                                <Col xs="9">
                                                                                                    <p className="font-title">
                                                                                                        View profiles of providers and evaluate their credibility. Initiate a chat with the ones that interest you.
                                                                    </p>
                                                                                                </Col>
                                                                                            </Row>
                                                                                            <hr />
                                                                                            <Row>
                                                                                                <Col xs="3">
                                                                                                    <img src={quote} />
                                                                                                    <h6><b>QUOTE</b></h6>
                                                                                                </Col>
                                                                                                <Col xs="9">
                                                                                                    <p className="font-title">
                                                                                                        Alternatively, service providers interested in your request may provide quotes too.
                                                                    </p>
                                                                                                </Col>
                                                                                            </Row>
                                                                                        </div>
                                                                                        <div className="providers-found">
                                                                                            <Row>
                                                                                                <Col xs="3">
                                                                                                    <img src={group} />
                                                                                                </Col>
                                                                                                <Col xs="9">
                                                                                                    <h6 className="text-center"><b>YoCo found <span style={{ color: "orange" }}>{this.props.providers.length} </span> provider{this.props.providers.length > 1 && <span>s</span>} for your request</b></h6>
                                                                                                </Col>
                                                                                            </Row>

                                                                                            {/* <Button onClick={this.gotoProviders} className="post-request">View Providers</Button> */}
                                                                                        </div>
                                                                                        <div className="bottom-post">
                                                                                            <Row>
                                                                                                <Col xs="6">
                                                                                                    <a onClick={() => this.props.history.push('/user/requests')} className="bottom-cancel">SKIP</a>
                                                                                                </Col>
                                                                                                <Col xs="6">
                                                                                                    {
                                                                                                        this.props.providers.length > 0 ?
                                                                                                        <a className="bottom-continue" onClick={this.gotoProviders}>View Providers <img style={{ width: 25 }} src={chevright} /></a>
                                                                                                        :
                                                                                                        <a className="bottom-continue" onClick={this.gotoProviders}>Proceed<img style={{ width: 25 }} src={chevright} /></a>
                                                                                                    }
                                                                                                   
                                                                                                </Col>
                                                                                            </Row>
                                                                                        </div>
                                                                                    </div>

                                                                                    :
                                                                                    <h6 className="text-center"><b>There is currently no service provider in this area.
                                                                                    A YoCo Care specialist will get in touch with you soon to help you get the service required.)</b></h6>
                                                                            }


                                                                        </div>

                                                                    }

                                                                </div>
                                                        }
                                                    </div>

                                                }
                                            </Form>
                                        </Col>
                                    </Row>
                                    <br />
                                    {/* {this.state.editing ?
                                        <Button onClick={this.updateRequest} className="post-request"> Update Request</Button>
                                        :
                                        <Button onClick={this.saveRequest} className="post-request"> Post Request</Button>
                                    } */}

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
                        <Calendar
                            editableDateInputs={true}
                            onChange={(item) => this.setState({ selectedDate: item })}
                        />
                        <br />
                        <Button onClick={this.toggleModal}>Close</Button>
                    </ModalBody>
                </Modal>
                <Modal isOpen={isError} role="dialog" autoFocus={true} centered={true}>
                    <ModalBody>
                        <Alert color="danger">
                            <p className="bold fonot16 alert-heading">Failed</p>
                            <p>
                                {this.state.errorMessage}
                            </p>
                            <Button onClick={() => this.setState({ isError: false, errorMessage: '' })}>Close</Button>
                        </Alert>
                    </ModalBody>
                </Modal>
                <Modal isOpen={isSuccess} role="dialog" autoFocus={true} centered={true}>
                    <ModalBody>

                        <p className="bold font16 alert-heading">Success</p>
                        <p>
                            Request updated Successfully
                            </p>
                        <Button onClick={() => this.onSuccessNavigation()}>Ok</Button>

                    </ModalBody>
                </Modal>
                {/* {
                    this.props.isLoading || this.props.isRequestDetailsLoading ? (
                        <Modal className="spinner-modal" isOpen={true}>
                            <Spinner animation="border" />
                        </Modal>
                    ) : ''
                } */}
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    userDetails: state.profile.userDetails,
    isUserLoad: state.profile.isUserLoad,
    userLocation: state.profile.userLocation,
    allPosts: state.user.allPosts,
    requestDetails: state.request.requestDetails,
    isLoading: state.user.isLoading,
    isRequestDetailsLoading: state.request.isRequestDetailsLoading,
    isPosted: state.user.isPosted,
    isRequestUpdated: state.user.isRequestUpdated,
    selectedPost: state.user.selectedPost,
    nearByProviders: state.user.nearByProviders,
    providers: state.user.providers,
    avatarUrl: state.profile.userDetails && state.profile.userDetails.avatarUrl

})

const mapDispatchToProps = {
    ...ProfileAction,
    ...UserActions,
    ...RequestActions
}

export default connect(mapStateToProps, mapDispatchToProps)(NewRequest)
