import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Container, Row, Col, Modal, Button, ModalBody, Spinner } from "reactstrap";
import { v4 as uuidv4 } from 'uuid';
import { connect } from 'react-redux'
import OwlCarousel from 'react-owl-carousel';
import { ProfileAction, RequestActions, UserActions } from '../../redux/actions';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import './style.css'
import describe from '../../images/icon/index.png'
import question from '../../images/icon/question-mark.svg'
import heart from "../../images/icon/heart.png";
import gender from "../../images/icon/gender.png";
import confetti from "../../images/icon/confetti.png";
import go from "../../images/icon/go.png";
import left from "../../images/icon/left.png";
import right from "../../images/icon/right.png";
import money from "../../images/icon/money-bag.png";
import drug from "../../assets/images/icon/drug.png";
import technical from "../../assets/images/icon/technical.png";
import essentials from "../../assets/images/icon/essentials.png";
import house from "../../assets/images/icon/house.png";
import map from "../../images/icon/map.svg";
import calendar from "../../images/icon/calendar-3.png";
import FloatingInput from '../../components/Shared/GeoSuggest/FloatingInput';
import { Calendar } from 'react-date-range';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
    KeyboardDateTimePicker,
} from '@material-ui/pickers';
import moment from 'moment';
class NewPost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            title: "",
            description: "",
            error: "",
            selectedRequestId: "",
            budget: "",
            buyItem: "",
            itemBudget: "",
            userLocation: "",
            category: "",
            age: "",
            sex: "",
            medicalCondition: "",
            gender: "",
            visit: "",
            material: "",
            selectedDate: null,
            selectedLocation: '',
            modalVisible: false,
            isDateModalVisible: false,
            summary: false,
            edit: false,
            editPost: false,
        }
        this.onRadioChanged = this.onRadioChanged.bind(this)
        this.prevStep = this.prevStep.bind(this)
        this.nextStep = this.nextStep.bind(this)
        this.onSelectLocation = this.onSelectLocation.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.toggleModal = this.toggleModal.bind(this)
        this.toggleCalendarModal = this.toggleCalendarModal.bind(this)
        this.toggleEdit = this.toggleEdit.bind(this)
        this.createRequest = this.createRequest.bind(this)
        this.updateRequest = this.updateRequest.bind(this)
        this.setCategory = this.setCategory.bind(this)
        this.showPopup = this.showPopup.bind(this)
        this.onDateChange = this.onDateChange.bind(this)
    }
    onDateChange = (name, event) => {
        const target = event.target; // Do we need this?(unused in the function scope)!
        this.setState({
            [name]: event
        }, () => {
        });
    };
    showPopup() {
        this.setState({
            error: "Please mention specific details like: have hypertension / diabetic for 10 years / had a bypass surgery last year",
            modalVisible: true
        })
    }
    createRequest() {
        if (this.state.title !== '' && this.state.description !== '' && this.state.userLocation !== "" && this.state.selectedDate !== "") {
            var request = {
                "inputRequest": {
                    "requestId": uuidv4(),
                    "serviceCategory": "Other",
                    "title": 'YoCo Buddy: ' + this.state.title,
                    "description": this.state.description,
                    "userId": localStorage.getItem("userId"),
                    "locationTitle": this.state.userLocation.locationTitle,
                    "latitude": this.state.userLocation.latitude,
                    "longitude": this.state.userLocation.longitude,
                    "isHealthcare": false,
                    "isDisabled": false,
                    "isCompleted": false,
                    "isDateFlexible": false,
                    "serviceNeedsOn": this.state.selectedDate,
                    "serviceEndsOn": this.state.selectedDate,
                    "createdAt": new Date(),
                    "status": 'Active'
                }
            }
            this.props.postNewRequest(request)
        } else {
            this.setState({
                modalVisible: true,
                error: 'Failed to post your request. All fields are mandatory'
            })
        }
    }

    updateRequest() {
        const { userLocation } = this.state
        if (this.state.title !== '' && this.state.description !== '' && userLocation) {
            var request = {
                "requestId": this.state.selectedRequestId,
                "requestData": {
                    "title": this.state.title,
                    "serviceCategory": this.state.category,
                    "description": this.state.description,
                    "userId": localStorage.getItem("userId"),
                    "locationTitle": userLocation.locationTitle,
                    "latitude": userLocation.latitude,
                    "longitude": userLocation.longitude,
                    "isHealthcare": false,
                    "isDisabled": false,
                    "isCompleted": false,
                    "isDateFlexible": false,
                    "serviceNeedsOn": this.state.selectedDate,
                    "serviceEndsOn": this.state.selectedDate,
                    "updatedAt": new Date(),
                    "status": 'Active'
                }
            }
            this.props.updateRequest(request)
        } else {
            this.setState({
                modalVisible: true,
                error: 'Failed to post your request. All fields are mandatory'
            })
        }
    }
    setCategory(category) {
        this.setState({
            category: category,
            title: category
        })
        if (category == "Health care and wellbeing") {
            this.setState({
                step: 3
            })
        } else {
            this.setState({
                step: 0
            })
        }
    }
    toggleEdit() {
        this.setState({
            edit: !this.state.edit
        })
    }
    onSelectLocation = (selectedLocation) => {
        this.setState({
            userLocation: selectedLocation
        }, () => {
            this.props.changeLocation(selectedLocation)
        })
    }
    toggleModal() {
        this.setState({
            modalVisible: !this.state.modalVisible
        })
    }
    toggleCalendarModal() {
        this.setState({
            isDateModalVisible: !this.state.isDateModalVisible
        })
    }
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    onRadioChanged(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    nextStep() {
        window.scrollTo(0, 0)
        switch (this.state.step) {
            case 3:
                if ((this.state.age == "") || (this.state.sex == "")) {
                    this.setState({
                        error: "Please enter the Age and Sex",
                        modalVisible: true
                    })
                } else {
                    this.setState({
                        step: 4
                    })
                }

                break;
            case 4:
                if (this.state.medicalCondition == "") {
                    this.setState({
                        error: "Please enter medical / health condition",
                        modalVisible: true
                    })
                } else {
                    this.setState({
                        step: 5
                    })
                }
                break;
            case 5:
                if (this.state.gender == "") {
                    this.setState({
                        error: "Please enter gender preference",
                        modalVisible: true
                    })
                } else {
                    this.setState({
                        step: 0
                    })
                }
                break;
            case 6:
                this.setState({
                    step: 0
                })
                break;
            case 0:
                if (this.state.category == "Purchase / delivery of items" && (this.state.buyItem == "" || this.state.itemBudget == "")) {
                    this.setState({
                        error: "Please provide all necessary details.",
                        modalVisible: true
                    })
                } else if (this.state.category == "Maintenance" && (this.state.material == "" || this.state.visit == "")) {
                    this.setState({
                        error: "Please provide all necessary details.",
                        modalVisible: true
                    })
                } else if (this.state.description.length < 30) {
                    this.setState({
                        error: "Describe your need in more than 30 characters.",
                        modalVisible: true
                    })
                } else {
                    this.setState({
                        step: 1
                    })
                }
                break;
            case 1:
                if (this.state.userLocation == "") {
                    this.setState({
                        error: "Please select the location",
                        modalVisible: true
                    })
                } else {
                    this.setState({
                        step: 2
                    })
                }
                break;
            case 2:
                if (this.state.selectedDate == "") {
                    this.setState({
                        error: "Please select the date",
                        modalVisible: true
                    })
                } else {
                    this.setState({
                        step: 10,
                        summary: true
                    })
                }
                if (this.state.category == "Health care and wellbeing") {
                    this.setState({
                        description: "Age: " + this.state.age + "\n" + "Sex: " + this.state.sex + "\n" +
                            "Medical Condition: " + this.state.medicalCondition + "\n" +
                            "Gender Preference: " + this.state.gender + "\n" + this.state.description

                    })
                } else if (this.state.category == "Maintenance") {
                    this.setState({
                        description: "Site visit and estimate needed: " + this.state.visit + "\n" +
                            "Should Service Provider buy materials: " + this.state.material + "\n" + this.state.description
                    })
                } else if (this.state.category == "Purchase / delivery of items") {
                    this.setState({
                        description: "I need to buy " + this.state.buyItem + "\n" +
                            "the budget is : " + this.state.itemBudget + "\n" + this.state.description
                    })
                }

                break;
        }
    }
    prevStep() {
        window.scrollTo(0, 0)
        switch (this.state.step) {
            case 4:
                this.setState({
                    step: 3
                })
                break;
            case 5:
                this.setState({
                    step: 4
                })
                break;
            case 0:
                if (this.state.category == "Health care and wellbeing") {
                    this.setState({
                        step: 5
                    })
                } else {
                    this.setState({
                        category: ""
                    })
                }
                break;
            case 1:
                this.setState({
                    step: 0
                })
                break;
            case 2:
                this.setState({
                    step: 1
                })
                break;
            case 10:
                this.setState({
                    step: 2
                })
            case 3:
                this.setState({
                    category: ""
                })
                break;
        }
    }
    componentDidUpdate(prevProps, prevState) {
        const { selectedLocation, isPosted, requestDetails } = this.props;
        if (prevProps.selectedLocation !== selectedLocation && selectedLocation == null) {
            this.setState({
                userLocation: "",
            })
        }
        if (prevProps.isPosted !== isPosted && isPosted) {
            if (requestDetails.isCareSubscription && requestDetails.isCareSubscription !== null) {
                this.props.history.push('/subscription-success')
            } else {
                this.props.history.push("/post-success")
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
                category: requestDetails.serviceCategory,
                description: requestDetails.description,
                selectedDate: requestDetails.status === 'Active' ? requestDetails.serviceNeedsOn : new Date((new Date().getTime())).toISOString(),
                chars_left: 1000 - requestDetails.description.length,
                userLocation: locationData
            })
            // console.log("sheeet", requestDetails.serviceNeedsOn)
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
    }
    componentDidMount() {
        var userId = localStorage.getItem("userId")
        if (!userId) {
            localStorage.setItem("target", "/user/new-post")
            this.props.history.push("/sign-in/hamper")
        }
        if (this.props.match.params.requestid) {
            this.setState({
                edit: true,
                summary: true,
                step: 10,
                category: "test",
                editPost: true,
                selectedRequestId: this.props.match.params.requestid
            })
            this.props.getRequestDetails({
                requestId: this.props.match.params.requestid
            })
        }
        if (this.props.selectedLocation !== null) {
            this.setState({
                userLocation: this.props.selectedLocation,
            })
        }
        window.scrollTo(0, 0)
    }
    render() {
        console.log('CATEGORY', this.props.requestDetails)
        const { delights } = this.props;
        return (
            <React.Fragment>
                <div className='whitegrad-bg' style={{paddingTop: 50, paddingBottom: 50}}>
                    <Container className="relative">
                        {
                            this.state.summary
                                ?
                                <div className="summary card-shadow" style={{backgroundColor: '#fff', borderRadius: 8}}>
                                    <div className="summary-header">
                                        {
                                            this.state.editPost
                                                ?
                                                <p className="bold font22">Edit Request</p>
                                                :
                                                <p className="bold font22">Summary</p>
                                        }

                                    </div>
                                    <div style={{ padding: 30 }}>
                                        <Row>
                                            <Col md="2">
                                                {/* <img style={{ width: 70 }} src={box} /> */}
                                            </Col>
                                            <Col md="10">
                                                {
                                                    this.state.edit
                                                        ?
                                                        <div>
                                                            <h6 className="font-title bold">Request Title</h6>
                                                            <h6 className="font-title">{this.state.title}</h6>
                                                            <br />
                                                            <h6 className="font-title bold">Description</h6>
                                                            <textarea rows="4" value={this.state.description} onChange={this.handleChange} className="form-control" name="description" type="text" >
                                                            </textarea>
                                                            <br />
                                                            <h6 className="font-title bold">Delivery Location</h6>
                                                            <div className="relative">

                                                                <FloatingInput onSelectLocation={this.onSelectLocation} value={this.state.userLocation} label={"Enter your location"} />
                                                            </div>
                                                            <br />
                                                            <h6 className="font-title bold">Date</h6>
                                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                                <KeyboardDatePicker
                                                                    margin="normal"
                                                                    id="time-picker"
                                                                    disablePast={true}
                                                                    label="Select date and time"
                                                                    value={this.state.selectedDate}
                                                                    onChange={(event) => this.onDateChange("selectedDate", event)}
                                                                />
                                                            </MuiPickersUtilsProvider>
                                                            <div style={{height: 10}}></div>
                                                            <br />
                                                            {
                                                                this.state.editPost
                                                                    ?
                                                                    <a onClick={this.updateRequest} className="hamper-button">Update</a>
                                                                    :
                                                                    <a onClick={this.toggleEdit} className="hamper-button">Save</a>
                                                            }

                                                        </div>
                                                        :
                                                        <div>
                                                            <h6 className="font-title bold">Request Title</h6>
                                                            <h6 className="bold">YoCo Buddy: {this.state.title}</h6>
                                                            <hr />
                                                            <h6 className="font-title bold">Description</h6>
                                                            <p className="font-title">{this.state.description}</p>
                                                            <hr />
                                                            <h6 className="font-title bold">Delivery Location</h6>
                                                            <h6 className="bold">{this.state.userLocation.locationTitle}</h6>
                                                            <hr />
                                                            <h6 className="font-title bold">Date</h6>
                                                                    <h6 className="bold">{this.state.selectedDate && moment(this.state.selectedDate).format('LL')}</h6>
                                                            <br />
                                                            <a onClick={this.createRequest} className="hamper-button">Confirm</a>
                                                            <a onClick={this.toggleEdit} style={{ marginLeft: 10 }} className="hamper-button edit-button">Edit</a>
                                                        </div>
                                                }

                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                :
                                <div className="delight-bottom">
                                    {
                                        this.state.category

                                            ?
                                            <div className="build-box card-shadow" style={{paddingLeft: 50, paddingRight: 50, backgroundColor: '#fff', borderRadius: 8}}>
                                                {
                                                    this.state.step == 0 &&
                                                    <div>
                                                        <img style={{ width: 70, marginBottom: 15 }} src={describe} />
                                                        {
                                                            this.state.category == "Purchase / delivery of items" &&
                                                            <div>
                                                                <p className="bold font14">What do you want to be bought or delivered?</p>
                                                                <br />
                                                                <input value={this.state.buyItem} onChange={this.handleChange} className="form-control" name="buyItem" type="text"></input>
                                                                <br />
                                                                <p className="bold font16">What is your budget for this item?</p>
                                                                <br />
                                                                <input value={this.state.itemBudget} onChange={this.handleChange} className="form-control" name="itemBudget" type="text"></input>
                                                                <br />
                                                            </div>
                                                        }
                                                        {this.state.category == "Purchase / delivery of items" ? <p className="bold font16">Any special instructions</p> : <p className="bold font16">Describe your need</p>}
                                                        <p className="font-title font14">Give specific information about the service you need. The more details you include, the more meaningful responses you get from service providers.</p>
                                                        <br />
                                                        <textarea rows="4" value={this.state.description} onChange={this.handleChange} className="form-control" name="description" type="text" placeholder="Enter at least 30 characters">

                                                        </textarea>
                                                        {
                                                            this.state.category == "Maintenance" &&
                                                            <div>
                                                                <br />
                                                                <Row>
                                                                    <Col xs="8">
                                                                        <h6 className="bold text-left" style={{ marginTop: 25 }}>Do you want the service provider to buy materials required for the service as well?</h6>
                                                                    </Col>
                                                                    <Col xs="2">
                                                                        <label>Yes</label>
                                                                        <input className="form-control" type="radio" name="material"
                                                                            value="Yes"
                                                                            checked={this.state.material === "Yes"}
                                                                            onChange={this.onRadioChanged} />
                                                                    </Col>
                                                                    <Col xs="2">
                                                                        <label>No</label>
                                                                        <input className="form-control" type="radio" name="material"
                                                                            value="No"
                                                                            checked={this.state.material === "No"}
                                                                            onChange={this.onRadioChanged} />
                                                                    </Col>
                                                                </Row>
                                                                <br />
                                                                <Row>
                                                                    <Col xs="8">
                                                                        <h6 className="bold text-left" style={{ marginTop: 25 }}>Do you want them to visit the place and give an estimate in advance? </h6>
                                                                    </Col>
                                                                    <Col xs="2">
                                                                        <label>Yes</label>
                                                                        <input className="form-control" type="radio" name="visit"
                                                                            value="Yes"
                                                                            checked={this.state.visit === "Yes"}
                                                                            onChange={this.onRadioChanged} />
                                                                    </Col>
                                                                    <Col xs="2">
                                                                        <label>No</label>
                                                                        <input className="form-control" type="radio" name="visit"
                                                                            value="No"
                                                                            checked={this.state.visit === "No"}
                                                                            onChange={this.onRadioChanged} />
                                                                    </Col>
                                                                </Row>

                                                            </div>
                                                        }

                                                    </div>
                                                }
                                                {
                                                    this.state.step == 1 &&
                                                    <div>
                                                        <img style={{ width: 70, marginBottom: 15 }} src={map} />
                                                        <p className="bold font16">Where do you want this service to be delivered?</p>
                                                        <p className="font-title font14">
                                                            Tell us the exact location
                                                        </p>
                                                        <br />
                                                        <div className="relative">

                                                            <FloatingInput onSelectLocation={this.onSelectLocation} value={this.state.userLocation} label={"Enter service location"} />
                                                        </div>
                                                    </div>
                                                }
                                                {
                                                    this.state.step == 2 &&
                                                    <div>
                                                        <img style={{ width: 70, marginBottom: 15 }} src={calendar} />
                                                        <p className="bold font16">When do you need this service to be delivered?</p>
                                                        <p className="font-title">Choose the exact or latest date</p>
                                                        <br />
                                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                            <Grid container justify="space-around">
                                                                <KeyboardDateTimePicker
                                                                    margin="normal"
                                                                    id="time-picker"
                                                                    disablePast={true}
                                                                    label="Select date and time"
                                                                    value={this.state.selectedDate}
                                                                    onChange={(event) => this.onDateChange("selectedDate", event)}
                                                                />
                                                            </Grid>
                                                        </MuiPickersUtilsProvider>
                                                    </div>
                                                }
                                                {
                                                    this.state.step == 3 &&
                                                    <div>
                                                        <img style={{ width: 70, marginBottom: 15 }} src={gender} />
                                                        <p className="bold font16">Give us more information about the person who will receive the service.</p>
                                                        <br />
                                                        <Row>
                                                            <Col md="6">
                                                                <label>Age</label>
                                                                <input value={this.state.age} onChange={this.handleChange} className="form-control" name="age" type="text" >

                                                                </input>
                                                            </Col>
                                                            <Col md="6">
                                                                <label>Sex</label>
                                                                <input value={this.state.sex} onChange={this.handleChange} className="form-control" name="sex" type="text" >

                                                                </input>
                                                            </Col>
                                                        </Row>

                                                    </div>
                                                }
                                                {
                                                    this.state.step == 4 &&
                                                    <div>
                                                        <img style={{ width: 70, marginBottom: 15 }} src={heart} />
                                                        <p className="bold font16">Does the person have any existing medical condition?
                                                       <br /> <img style={{ width: 25, cursor: "pointer" }} onClick={this.showPopup} src={question} />
                                                        </p>
                                                        <br />
                                                        <textarea value={this.state.medicalCondition} onChange={this.handleChange} className="form-control" name="medicalCondition" type="text" >

                                                        </textarea>
                                                    </div>
                                                }
                                                {
                                                    this.state.step == 5 &&
                                                    <div>
                                                        <img style={{ width: 70, marginBottom: 15 }} src={gender} />
                                                        <p className="bold font16">Please mark your gender preference for the person who will deliver the service.</p>
                                                        <br />
                                                        <Row>
                                                            <Col xs="4">
                                                                <label>Male</label>
                                                                <input className="form-control" type="radio" name="gender"
                                                                    value="male"
                                                                    checked={this.state.gender === "male"}
                                                                    onChange={this.onRadioChanged} />
                                                            </Col>
                                                            <Col xs="4">
                                                                <label>Female</label>
                                                                <input className="form-control" type="radio" name="gender"
                                                                    value="female"
                                                                    checked={this.state.gender === "female"}
                                                                    onChange={this.onRadioChanged} />
                                                            </Col>
                                                            <Col xs="4">
                                                                <label>No Preferences</label>
                                                                <input className="form-control" type="radio" name="gender"
                                                                    value="any"
                                                                    checked={this.state.gender === "any"}
                                                                    onChange={this.onRadioChanged} />
                                                            </Col>
                                                        </Row>



                                                    </div>
                                                }
                                                <br /><br />
                                                <div>
                                                <img onClick={this.prevStep} style={{paddingRight: 15}} className="go-button-left" src={left} />
                                                <img onClick={this.nextStep} style={{paddingLeft: 15}} className="go-button-right" src={right} />
                                                </div>
                                            </div>

                                            :
                                            <Row>
                                                <Col md="3">
                                                    <div className="category-card">
                                                    <img className="icon-img" style={{ width: 55 }} src={drug} />
                                                        <p className="bold font16">Purchase & delivery of items</p>
                                                        <p className="text-muted font14">Medicines, grocery or even thoughtfully handpicked gifts</p>
                                                        <img className="category-go" onClick={() => this.setCategory("Purchase / delivery of items")} src={right} />
                                                    </div>
                                                </Col>
                                                <Col md="3">
                                                    <div className="category-card">
                                                        <img className="icon-img" style={{ width: 55 }} src={technical} />
                                                        <p className="bold font20">Maintenance</p>
                                                        <p className="font-title font14">Upkeep of house / property / vehicles</p>
                                                        <img className="category-go" onClick={() => this.setCategory("Maintenance")} src={right} />
                                                    </div>
                                                </Col>
                                                <Col md="3">
                                                    <div className="category-card">
                                                        <img className="icon-img" style={{ width: 55 }} src={essentials} />
                                                        <p className="bold font20">Utilities</p>
                                                        <p className="text-muted font14">Documentation work, bank transactions, bill and tax payments, chauffeuring</p>
                                                        <img className="category-go" onClick={() => this.setCategory("Utilities")} src={right} />
                                                    </div>
                                                </Col>
                                                <Col md="3">
                                                    <div className="category-card">
                                                        <img className="icon-img" style={{ width: 55 }} src={house} />
                                                        <p className="bold font20">Others</p>
                                                        <p className="font-title font14">Any other unique need that is not covered in the other three categories</p>
                                                        <img className="category-go" onClick={() => this.setCategory("Others")} src={right} />
                                                    </div>
                                                </Col>
                                            </Row>
                                    }
                                </div>

                        }
                    </Container>
                </div>
                <Modal isOpen={this.state.isDateModalVisible} role="dialog" autoFocus={true} centered={true}>
                    <ModalBody>
                        <Calendar
                            editableDateInputs={true}
                            onChange={(item) => this.setState({ selectedDate: item, isDateModalVisible: false })}
                        />
                        <br />
                        <Button onClick={this.toggleCalendarModal}>Close</Button>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalVisible}>
                    <ModalBody>
                        <h6>{this.state.error}</h6>
                        <Button onClick={this.toggleModal}>Close</Button>
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
        );
    }
}
const mapStateToProps = (state) => ({

    delights: state.request.delights,
    isPosted: state.user.isPosted,
    isLoading: state.user.isLoading,
    selectedLocation: state.profile.selectedLocation,
    requestDetails: state.request.requestDetails,
})

const mapDispatchToProps = {
    ...RequestActions,
    ...ProfileAction,
    ...UserActions
}

export default connect(mapStateToProps, mapDispatchToProps)(NewPost)