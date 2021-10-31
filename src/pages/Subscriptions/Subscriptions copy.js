import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Container, Row, Col, Modal, Button, ModalBody, Spinner } from "reactstrap";
import { connect } from 'react-redux'
import { v4 as uuidv4 } from 'uuid';
import Moment from 'react-moment';
import OwlCarousel from 'react-owl-carousel';
import { ProfileAction, RequestActions, UserActions } from '../../redux/actions';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import './style.css'
import gift from "../../images/icon/gift-1.png";
import describe from '../../images/icon/index.png'
import heart from "../../images/icon/heart.png";
import heartplus from "../../images/icon/heartplus.png";
import question from '../../images/icon/question-mark.svg'
import gender from "../../images/icon/gender.png";
import gender2 from "../../images/icon/sex.svg";
import go from "../../images/icon/go.png";
import left from "../../images/icon/left.png";
import right from "../../images/icon/right.png";
import back from "../../images/icon/arrow.svg"
import help from "../../images/help_vector.png";
import care1 from "../../images/care1.png";
import care2 from "../../images/care2.png";
import care3 from "../../images/care3.png";
import care4 from "../../images/care4.png";
import care5 from "../../images/care5.png";
import care6 from "../../images/care6.png";
import closeicon from "../../images/icon/close.svg"
import add from "../../images/icon/add-button.svg"
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
class Subscriptions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 3,
            title: "YoCo Care",
            description: "",
            error: "",
            selectedRequestId: "",
            budget: "",
            userLocation: "",
            category: "Health care and wellbeing",
            age: "",
            sex: "",
            medicalCondition: "",
            gender: "",
            visit: "",
            material: "",
            selectedLocation: '',
            modalVisible: false,
            isDateModalVisible: false,
            summary: false,
            edit: false,
            editPost: false,
            selectedDate: new Date((new Date().getTime())).toISOString().slice(0, -8),
            cart: [],
            proceeded: false,
            plans: [
                {
                    id: 1, title: "FUNDAMENTALS\n",
                    pic: care1,
                    inCart: false,
                    desc: "24/7 on call companion for any medical or non medical emergency who will do the needful like",
                    feature1: "Call doctor / nurse for intervention",
                    feature2: "Arrange hospitalization",
                    feature3: "Buy items for urgent need",
                },
                {
                    id: 2, title: "Weekly vitals",
                    pic: care2,
                    inCart: false,
                    desc: "In-Home nurse visit to check basic vitals once a week and report any abnormalities",
                    feature1: "Blood Pressure",
                    feature2: "Blood Sugar (using kits)",
                    feature3: "Pulse and Respiration",
                    feature4: "Oxygen Saturation",
                    feature5: "Temperature"
                },
                {
                    id: 3, title: "Monthly testing",
                    pic: care3,
                    inCart: false,
                    desc: "In-Home nurse visit to collect samples for\
                    lab tests, drop samples in lab,\
                    collect results and share a digital copy",
                    feature1: "Choose the tests you want to be done",
                    feature2: "Lab tests cost as per actuals",
                },
                {
                    id: 4, title: "Post hospitalization care",
                    pic: care4,
                    inCart: false,
                    desc: "Setting up proper home care\
                    with expert consultation, necessary\
                    medical equipment and support from\
                    a healthcare professional",
                    feature1: "Administering medicines on time",
                    feature2: "Hygiene maintenance",
                    feature3: "Coordinating needs like physiotherapy",
                },
                {
                    id: 5, title: "Weekly companion",
                    pic: care5,
                    inCart: false,
                    desc: "In-Home visit by a trusted companion\
                    once a week to spend 1-2 hours\
                    to provide companionship or\
                    coordinate any activities",
                    feature1: "Customize the time requirement",
                    feature2: "Specify the need to be met",
                },
                {
                    id: 6, title: "Daily essentials",
                    pic: care6,
                    inCart: false,
                    desc: "Purchase and deliver daily essentials\
                    2 times a week and refill medical supplies\
                    as needed",
                    feature1: "Specify store choices and budget",
                    feature2: "End to end hassle-free delivery",
                },
            ],

        }
        this.setProceed = this.setProceed.bind(this)
        this.addToCart = this.addToCart.bind(this)
        this.removeFromCart = this.removeFromCart.bind(this)
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
        this.showPopup = this.showPopup.bind(this)
        this.reset = this.reset.bind(this)
        this.onDateChange = this.onDateChange.bind(this)
    }
    removeFromCart(id) {
        var cart = this.state.cart
        var plans = this.state.plans
        var cartItem = cart.find(x => x.id === id);
        var index = cart.indexOf(cartItem)
        cart.splice(index, 1);
        plans.find(x => x.id === id).inCart = false;
        this.setState({
            cart: cart,
            plans: plans
        })
    }
    onDateChange = (name, event) => {
        const target = event.target; // Do we need this?(unused in the function scope)!
        this.setState({
            [name]: event
        }, () => {
        });
    };
    setProceed(val) {
        if (val) {
            var userId = localStorage.getItem("userId")
            if (!userId) {
                if (this.state.cart.length > 0) {
                    localStorage.setItem("cart", JSON.stringify(this.state.cart))
                }
                localStorage.setItem("target", "/YoCoCare?proceeded=yes")
                this.props.history.push("/sign-in/hamper")
            }
            
        }
        window.scrollTo(0, 0)
        this.setState({
            proceeded: val
        })
    }
    reset() {
        this.setState({
            summary: false,
            proceeded: false,
            description:"",
            age:"",
            sex: "",
            medicalCondition: "",
            gender: "",
            step: 3
        })
    }
    addToCart(id) {
        var cart = this.state.cart
        var plans = this.state.plans
        var plan = this.state.plans.find(x => x.id === id);
        if (!plan.inCart) {
            cart.push(plan)
            plans.find(x => x.id === id).inCart = true;
            this.setState({
                cart: cart,
                plans: plans
            })
        }

    }
    showPopup() {
        this.setState({
            error: "Please mention specific details like: \nhave hypertension / diabetic for 10 years / had a bypass surgery last year",
            modalVisible: true
        })
    }
    createRequest() {
        if (this.state.title !== '' && this.state.description !== '' && this.state.userLocation !== "" && this.state.selectedDate !== "") {
            var request = {
                "inputRequest": {
                    "requestId": uuidv4(),
                    "serviceCategory": "Other",
                    "title": this.state.title,
                    "description": this.state.description,
                    "userId": localStorage.getItem("userId"),
                    "locationTitle": this.state.userLocation.locationTitle,
                    "latitude": this.state.userLocation.latitude,
                    "longitude": this.state.userLocation.longitude,
                    "isHealthcare": false,
                    "isDisabled": false,
                    "isCompleted": false,
                    "isCareSubscription": true,
                    "isDateFlexible": false,
                    "serviceNeedsOn": this.state.selectedDate,
                    "serviceEndsOn": this.state.selectedDate,
                    "createdAt": new Date()
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
                    "updatedAt": new Date()
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
                if (this.state.description == "") {
                    this.setState({
                        error: "Please provide details about the service you need",
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
                    var services = ""
                    if (this.state.cart.length > 0) {
                        for (let i = 0; i < this.state.cart.length; i++) {
                            services = services + this.state.cart[i].title + " ,"
                        }
                        services = services.substring(0, services.length - 1);
                    }
                    this.setState({
                        description: "Age: " + this.state.age + "\n" + "Sex: " + this.state.sex + "\n" +
                            "Medical Condition: " + this.state.medicalCondition + "\n" +
                            "Gender Preference: " + this.state.gender + "\n" +
                            "Services needed: " + services + "\n" +
                            this.state.description
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
                    proceeded: false
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
            this.props.history.push("/subscription-success")
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
                selectedDate: requestDetails.serviceNeedsOn,
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
        var cart = JSON.parse(localStorage.getItem("cart") || "[]");
        
        this.setState({
            cart: cart
        })
        if(cart.length>0){
            this.setState({
                proceeded:true,
                step:3
            })
        }
        localStorage.removeItem("cart");
        if (this.props.selectedLocation !== null) {
            this.setState({
                userLocation: this.props.selectedLocation,
            })
        }
        window.scrollTo(0, 0)
    }
    render() {
        return (
            <React.Fragment>
                <div style={{ paddingBottom: 200 }} className="safe-cover care-cover">
                    <Container>
                        <Row className="align-items-center text-center">
                            <Col lg="12">
                                <h2>YoCo Care</h2>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <div>
                    <Container className="subscriptions relative rise-card2" style={{ overflow: "hidden" }}>

                        {
                            this.state.proceeded ?
                                <div>
                                    {this.state.summary

                                        ?
                                        <div className="summary" style={{ paddingTop: 0 }}>
                                            <img className="help-vector" src={help} />
                                            <div className="light-summary">
                                                {/* <Row>
                                                    <Col xs="1">
                                                        <img style={{ width: 70 }} src={heartplus} />
                                                    </Col>
                                                    <Col xs="11">
                                                        <h4 className="bold">Continuous care, even from a distance.</h4>
                                                        <p className="font-title font14" style={{ paddingRight: "30%" }}>
                                                        Healthcare and wellbeing packages for long-term to ensure continuous and consistent care to the people you love the most!

                                                    </p>
                                                    </Col>
                                                </Row> */}
                                            </div>
                                            <div className="pink-summary" style={{ padding: 16 }}>
                                                <Row style={{marginTop:-45}}>
                                                    <Col xs="1">
                                                        <img onClick={this.reset} src={back} />
                                                    </Col>
                                                    <Col xs="11">

                                                        <h4 className="bold">Order Summary</h4>
                                                    </Col>
                                                </Row>


                                            </div>
                                            <div style={{ padding: 30 }}>
                                                <Row>
                                                    <Col md="1">

                                                    </Col>
                                                    <Col md="7">
                                                        {
                                                            this.state.edit
                                                                ?
                                                                <div>
                                                                    <h6 className="font-title bold">Request Title</h6>
                                                                    <input value={this.state.title} onChange={this.handleChange} className="form-control" name="title" type="text" />
                                                                    <br />
                                                                    <h6 className="font-title bold">Description</h6>
                                                                    <textarea rows="4" value={this.state.description} onChange={this.handleChange} className="form-control" name="description" type="text" >
                                                                    </textarea>
                                                                    <br />
                                                                    <h6 className="font-title bold">Location</h6>
                                                                    <div className="relative">

                                                                        <FloatingInput onSelectLocation={this.onSelectLocation} value={this.state.userLocation} label={"Enter your location"} />
                                                                    </div>
                                                                    <br />
                                                                    <h6 className="font-title bold">Date</h6>
                                                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                                    <KeyboardDateTimePicker
                                                                    margin="normal"
                                                                    id="time-picker"
                                                                    label="Select date and time"
                                                                    value={this.state.selectedDate}
                                                                    onChange={(event) => this.onDateChange("selectedDate", event)}
                                                                    />
                                                            </MuiPickersUtilsProvider>
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
                                                                    {
                                                                        this.state.cart.length > 0 &&
                                                                        <h6 className="bold">{this.state.cart.length} item{this.state.cart.length > 1 && "s"} selected</h6>
                                                                    }
                                                                    <Row>
                                                                        {
                                                                            this.state.cart.length > 0 &&
                                                                            this.state.cart.map((item, key) =>
                                                                                <Col md="6">
                                                                                    <div className="cart-item-final">
                                                                                        <h6>{item.title}</h6>
                                                                                        <p>{item.desc}</p>
                                                                                    </div>
                                                                                </Col>
                                                                            )
                                                                        }
                                                                    </Row>
                                                                    <h6 className="font-title bold">Request Title</h6>
                                                                    <h6 className="bold">{this.state.title}</h6>
                                                                    <hr />
                                                                    <h6 className="font-title bold">Description</h6>
                                                                    <p className="bold">{this.state.description}</p>
                                                                    <hr />
                                                                    <h6 className="font-title bold">Location</h6>
                                                                    <h6 className="bold">{this.state.userLocation.locationTitle}</h6>
                                                                    <hr />
                                                                    <h6 className="font-title bold">Date</h6>
                                                                    <h6 className="bold">{this.state.selectedDate && new Date(this.state.selectedDate).toDateString()}</h6>
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
                                                <div className="build-box">
                                                    {
                                                        this.state.step == 0 &&
                                                        <div>
                                                            <img style={{ width: 70, marginBottom: 15 }} src={describe} />
                                                            <h4 className="bold">Customization requirement</h4>
                                                            <p className="font-title font14">Give specific information about the service you need.</p>
                                                            <br />
                                                            <textarea rows="4" value={this.state.description} onChange={this.handleChange} className="form-control" name="description" type="text">

                                                            </textarea>
                                                            {
                                                                this.state.category == "Maintenance" &&
                                                                <div>
                                                                    <br />
                                                                    <Row>
                                                                        <Col md="8">
                                                                            <h6 className="bold" style={{ marginTop: 25 }}>Do you want the service provider to buy materials required for the service as well?</h6>
                                                                        </Col>
                                                                        <Col md="2">
                                                                            <label>Yes</label>
                                                                            <input className="form-control" type="radio" name="material"
                                                                                value="yes"
                                                                                checked={this.state.material === "yes"}
                                                                                onChange={this.onRadioChanged} />
                                                                        </Col>
                                                                        <Col md="2">
                                                                            <label>No</label>
                                                                            <input className="form-control" type="radio" name="material"
                                                                                value="no"
                                                                                checked={this.state.material === "no"}
                                                                                onChange={this.onRadioChanged} />
                                                                        </Col>
                                                                    </Row>
                                                                    <br />
                                                                    <Row>
                                                                        <Col md="8">
                                                                            <h6 className="bold" style={{ marginTop: 25 }}>Do you want them to visit the place and give an estimate in advance? </h6>
                                                                        </Col>
                                                                        <Col md="2">
                                                                            <label>Yes</label>
                                                                            <input className="form-control" type="radio" name="visit"
                                                                                value="yes"
                                                                                checked={this.state.visit === "yes"}
                                                                                onChange={this.onRadioChanged} />
                                                                        </Col>
                                                                        <Col md="2">
                                                                            <label>No</label>
                                                                            <input className="form-control" type="radio" name="visit"
                                                                                value="no"
                                                                                checked={this.state.visit === "no"}
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
                                                            <h4 className="bold">Where do you want this service to be delivered?</h4>
                                                            <p className="font-title font14">
                                                                Exact location required
                                                </p>
                                                            <br />
                                                            <div className="relative">

                                                                <FloatingInput onSelectLocation={this.onSelectLocation} value={this.state.userLocation} label={"Enter your location"} />
                                                            </div>
                                                        </div>
                                                    }
                                                    {
                                                        this.state.step == 2 &&
                                                        <div>
                                                            <img style={{ width: 70, marginBottom: 15 }} src={calendar} />
                                                            <h4 className="bold">When do you need this service to be delivered?</h4>
                                                            <p className="font-title">Choose the exact or latest date</p>
                                                            <br />
                                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                                <Grid container justify="space-around">
                                                                    <KeyboardDateTimePicker
                                                                    margin="normal"
                                                                    id="time-picker"
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
                                                            <img style={{ width: 70, marginBottom: 15 }} src={gender2} />
                                                            <h4 className="bold">Give us more information about the person who will <i style={{color:"#9c0097"}}>receive</i> the service.</h4>
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
                                                            <h4 className="bold">Does the person have any existing medical condition?
                                                           
                                                            </h4>
                                                            <p className="font-title font14">Please mention specific details like: <br/>have hypertension / diabetic for 10 years / had a bypass surgery last year</p>
                                                            <br />
                                                            <input value={this.state.medicalCondition} onChange={this.handleChange} className="form-control" name="medicalCondition" type="text" >

                                                            </input>
                                                        </div>
                                                    }
                                                    {
                                                        this.state.step == 5 &&
                                                        <div>
                                                            <img style={{ width: 70, marginBottom: 15 }} src={gender} />
                                                            <h4 className="bold">Please mark your gender preference for the person who will <b style={{color:"#9c0097"}}>deliver</b> the service.</h4>
                                                            <br />
                                                            <Row>
                                                                <Col xs="4">
                                                                    <label style={{height:45}}>Male</label>
                                                                    <input className="form-control" type="radio" name="gender"
                                                                        value="male"
                                                                        checked={this.state.gender === "male"}
                                                                        onChange={this.onRadioChanged} />
                                                                </Col>
                                                                <Col xs="4">
                                                                    <label style={{height:45}}>Female</label>
                                                                    <input className="form-control" type="radio" name="gender"
                                                                        value="female"
                                                                        checked={this.state.gender === "female"}
                                                                        onChange={this.onRadioChanged} />
                                                                </Col>
                                                                <Col xs="4">
                                                                    <label style={{height:45}}>No Preferences</label>
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
                                            }
                                        </div>
                                    }
                                </div>

                                :
                                <div>
                                    <div className="grey-header">
                                        <Row>
                                            <Col md="1" className="mobile-hide">
                                                <img style={{ width: 50, margin: "0 auto", display: "block" }} src={gift} />
                                            </Col>
                                            <Col md ="11" xs="12">
                                                <h4 style={{ marginBottom: 0 }}><b>Continuous care, even from a distance.</b></h4>
                                                <p className="font14 font-title">Healthcare and wellbeing packages for long-term <br/>  to ensure continuous and consistent care to the people you love the most!</p>
                                            </Col>
                                        </Row>
                                    </div>

                                    <div style={{ padding: 20 }}>
                                        <div className="small-info">
                                            <h6 style={{ marginBottom: 0 }}> <b>Meet The Parents: </b> <span className="font14 font-title"> An opportunity to introduce your elderly family members to potential service providers and clear any apprehension they may have. So yes, commit only after they approve. What's more? The first meeting is completely free!</span></h6>
                                        </div>
                                        <div className="covid-info">
                                            <h6 style={{ marginBottom: 0 }}> <b>Covid Concerns: </b> <span className="font14 font-title"> We understand that these are challenging times and we will do everything possible to keep you worry-free. Basic safety protocols are in place for our service providers; but if you have any more specific requirements, we will cover those too!</span></h6>
                                        </div>
                                        <Row>
                                            <Col md="8">
                                                <Row>
                                                    {
                                                        this.state.plans.map((plan, key) =>

                                                            <Col md="4">
                                                                <div className="subs-card">
                                                                    <div className="img-container">
                                                                        <img src={plan.pic} />
                                                                    </div>
                                                                    <h5><b>{plan.title}</b></h5>
                                                                    <div className="grey-sub">
                                                                        <p className="bold">
                                                                            {plan.desc}
                                                                        </p>
                                                                    </div>
                                                                    <ul>
                                                                        {plan.feature1 &&
                                                                            <li>
                                                                                {plan.feature1}
                                                                            </li>
                                                                        }
                                                                        {plan.feature2 &&
                                                                            <li>
                                                                                {plan.feature2}
                                                                            </li>
                                                                        }
                                                                        {plan.feature3 &&
                                                                            <li>
                                                                                {plan.feature3}
                                                                            </li>
                                                                        }
                                                                        {plan.feature4 &&
                                                                            <li>
                                                                                {plan.feature4}
                                                                            </li>
                                                                        }
                                                                        {plan.feature5 &&
                                                                            <li>
                                                                                {plan.feature5}
                                                                            </li>
                                                                        }
                                                                    </ul>
                                                                    {
                                                                        plan.inCart ?
                                                                            <a onClick={() => this.addToCart(plan.id)} className="sub-button incart">Added</a>
                                                                            :
                                                                            <a onClick={() => this.addToCart(plan.id)} className="sub-button"><span><img style={{ width: 18 }} src={add} />ADD</span></a>
                                                                    }

                                                                </div>
                                                            </Col>
                                                        )
                                                    }
                                                </Row>
                                            </Col>
                                            <Col md="4">

                                                <div className="cart">
                                                    <h4 className="bold">Selected services</h4>
                                                    <br />
                                                    {
                                                        this.state.cart.map((item, key) =>
                                                            <div className="cart-item">
                                                                <h4>{item.title}</h4>
                                                                <Row>
                                                                    <Col xs="10">
                                                                        <p>{item.desc}</p>
                                                                    </Col>
                                                                    <Col xs="2">
                                                                        <img onClick={() => this.removeFromCart(item.id)} src={closeicon} />
                                                                    </Col>
                                                                </Row>

                                                                <hr />
                                                            </div>

                                                        )
                                                    }

                                                    <Row>
                                                        <Col md="6">
                                                            {this.state.cart.length > 0 &&
                                                                <a onClick={() => this.setProceed(true)} className="cart-button proceed-button">Proceed</a>
                                                            }
                                                        </Col>

                                                    </Row>

                                                </div>
                                                <br />
                                              
                                            </Col>
                                        </Row>

                                    </div>
                                    <div className="delight-bottom">
                                        <div className="or">
                                            <span>OR</span>
                                        </div>
                                        <p>If you are looking for something else and want to customize your subscription</p>
                                        <br />
                                        <a onClick={() => this.setProceed(true)} className="hamper-button rad-button">Click Here</a>
                                    </div>
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
                        <p>{this.state.error}</p>
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

    isPosted: state.user.isPosted,
    isLoading: state.user.isLoading,
    selectedLocation: state.profile.selectedLocation,

})

const mapDispatchToProps = {
    ...RequestActions,
    ...ProfileAction,
    ...UserActions
}

export default connect(mapStateToProps, mapDispatchToProps)(Subscriptions)
