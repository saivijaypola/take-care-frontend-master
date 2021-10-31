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
import covid from "../../images/icon/coronavirus.png"
import calendar1 from "../../images/icon/calendar1.png"
import convo from "../../images/icon/conversation.png"
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
import moment from 'moment';

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
            selectedDate: null,
            cart: [],
            proceeded: false,
            mtpModal: false,
            trialModal: false,
            covidModal: false,
            width: 0,
            height: 0,
            formattedDate: null,
            modalText: '',
            services: '',
            cusDescription: '',
            dateAlertVisible: false,
            isCustomized: false,
            plans: [
                {
                    id: 1, title: "Fundamentals",
                    pic: care1,
                    inCart: false,
                    desc: "24/7 on-call companion for any medical or non-medical emergency",
                    features: "Call doctor / nurse for intervention | Arrange hospitalization | Buy items for urgent need",
                },
                {
                    id: 2, title: "Weekly Vitals",
                    pic: care2,
                    inCart: false,
                    desc: "In-home nurse visit to check basic vitals once a week and report any abnormalities",
                    features: "Blood Pressure | Blood Sugar | Pulse and Respiration | Oxygen Saturation | Temperature",
                },
                {
                    id: 3, title: "Monthly Testing",
                    pic: care3,
                    inCart: false,
                    desc: "In-home nurse visit to collect samples for\
                    lab tests, drop samples in lab,\
                    collect results and share a digital copy",
                    features: "Choose the tests you want to be done | Lab tests cost as per actuals",
                },
                {
                    id: 4, title: "Post Hospitalization Care",
                    pic: care4,
                    inCart: false,
                    desc: "Setting up home care support\ with expert consultation, bystander support",
                    features: "Administering medicines on time | Hygiene maintenance | Coordinating needs like physiotherapy",
                },
                {
                    id: 5, title: "Weekly Companion",
                    pic: care5,
                    inCart: false,
                    desc: "In-home visit by a trusted companion\ to spend time or coordinate any activities",
                    features: "Customize the time requirement | Specify the need to be met",
                },
                {
                    id: 6, title: "Daily Essentials",
                    pic: care6,
                    inCart: false,
                    desc: "Purchase and deliver daily essentials,\ refill medical supplies as needed",
                    features: "Specify store choices and budget | End to end hassle-free delivery",
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
        this.showMtpModal = this.showMtpModal.bind(this)
        this.showTrialModal = this.showTrialModal.bind(this)
        this.showCovidModal = this.showCovidModal.bind(this)
        this.toggleMtpModal = this.toggleMtpModal.bind(this)
        this.toggleTrialModal = this.toggleTrialModal.bind(this)
        this.toggleCovidModal = this.toggleCovidModal.bind(this)
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }
    ageOptions() {

        var arr = [];

        for (let i = 0; i <= 100; i++) {
            arr.push(<option key={i} value={i}>{i}</option>)
        }

        return arr;
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
            var dateDiff = new Date(this.state.selectedDate).getDate() - new Date().getDate()
            var monthDiff = new Date(this.state.selectedDate).getMonth() - new Date().getMonth()
            if (dateDiff < 4 && monthDiff === 0) {
                console.log('DATE DIFF');
                this.setState({
                    dateAlertVisible: true
                })
            }
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
            proceeded: val,
        })
    }
    setProceedCus(val) {
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
            proceeded: val,
            isCustomized: true
        })
    }
    reset() {
        this.setState({
            summary: false,
            proceeded: false,
            description: "",
            cusDescription: '',
            age: "",
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
    showMtpModal() {
        this.setState({
            modalText: "An opportunity to introduce your elderly family members to potential service providers and clear any apprehension they may have. So yes, commit only after they approve.",
            mtpModal: true
        })
    }
    showTrialModal() {
        this.setState({
            modalText: "Once approved, you can ask the provider to offer their services on a trial basis for a week. Pay per day during the trial and confirm the subscription for a longer period only if you are happy at the end of the first week!",
            trialModal: true
        })
    }
    showCovidModal() {
        this.setState({
            modalText: "We understand that these are challenging times and we will do everything possible to keep you worry-free. Basic safety protocols are in place for our service providers; but if you have any more specific requirements, we will cover those too!",
            covidModal: true
        })
    }
    showPopup() {
        this.setState({
            error: "Please mention specific details like: \nhave hypertension / diabetic for 10 years / had a bypass surgery last year",
            modalVisible: true
        })
    }
    createRequest() {
        if (this.state.title !== '' && this.state.description !== '' && this.state.userLocation !== "" && this.state.selectedDate !== "" && this.state.cusDescription !== '') {
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
                    "status": "Active",
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
                    "updatedAt": new Date(),

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
    toggleMtpModal() {
        this.setState({
            mtpModal: !this.state.mtpModal
        })
    }
    toggleTrialModal() {
        this.setState({
            trialModal: !this.state.trialModal
        })
    }
    onClickDate() {
        this.setState({
            dateAlertVisible: false
        })
    }
    toggleCovidModal() {
        this.setState({
            covidModal: !this.state.covidModal
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
                if (this.state.userLocation == "") {
                    this.setState({
                        error: "Please select the location",
                        modalVisible: true
                    })
                }
                else {
                    this.setState({
                        step: 1
                    })
                }
                break;
            case 1:
                if (this.state.selectedDate == "" || this.state.selectedDate === null) {
                    this.setState({
                        error: "Please select the date",
                        modalVisible: true
                    })
                } else {
                    this.setState({
                        step: 2
                    })
                }
                break;
            case 2:
                if (this.state.cusDescription == "") {
                    this.setState({
                        error: "Please provide details about the service you need",
                        modalVisible: true
                    })
                }
                else {
                    this.setState({
                        step: 10,
                        summary: true
                    })
                }
                if (this.state.category == "Health care and wellbeing") {
                    var services = ""
                    console.log('IS CUSTOMIZED', this.state.isCustomized);
                    if (this.state.cart.length > 0 && !this.state.isCustomized && this.state.isCustomized === false) {
                        for (let i = 0; i < this.state.cart.length - 1; i++) {
                            services = services + this.state.cart[i].title + ', '
                        }
                        services = services + this.state.cart[this.state.cart.length - 1].title + '.'
                        services = services.substring(0, services.length - 1);
                        this.setState({
                            services: services
                        })
                    } else {
                        services = 'Customized Service';
                        this.setState({
                            services: services
                        })
                    }
                    this.setState({
                        description: "Age: " + this.state.age + "\n" + "Sex: " + this.state.sex + "\n" +
                            "Medical Condition: " + this.state.medicalCondition + "\n" +
                            "Gender Preference: " + this.state.gender + "\n" + "\n" +
                            "Services needed: " + services + "\n" + "\n" +
                            "Customization requirement: " + this.state.cusDescription
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
        if (prevState.selectedDate !== this.state.selectedDate) {
            let day = new Date(this.state.selectedDate).getDate()
            let month = new Date(this.state.selectedDate).getMonth()
            if (month == 0) {
                month = 'January'
            } else if (month == 1) {
                month = 'February'
            } else if (month == 2) {
                month = 'March'
            } else if (month == 3) {
                month = 'April'
            } else if (month == 4) {
                month = 'May'
            } else if (month == 5) {
                month = 'June'
            } else if (month == 6) {
                month = 'July'
            } else if (month == 7) {
                month = 'August'
            } else if (month == 8) {
                month = 'September'
            } else if (month == 9) {
                month = 'October'
            } else if (month == 10) {
                month = 'November'
            } else if (month == 11) {
                month = 'December'
            }
            let year = new Date(this.state.selectedDate).getFullYear()
            var date = day + ' ' + month + ' ' + year

            this.setState({
                formattedDate: date
            })
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

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    componentDidMount() {
        var userId = localStorage.getItem("userId")
        var cart = JSON.parse(localStorage.getItem("cart") || "[]");

        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

        this.setState({
            cart: cart
        })
        if (cart.length > 0) {
            this.setState({
                proceeded: true,
                step: 3
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
                {
                    !this.state.proceeded ?
                        <Container>
                            <div className="care-cover">
                            <h1 className='text-center'>YoCo Care</h1>  
                            </div>
                        </Container>
                        :
                        <></>
                }

                <div>
                    <Container className="subscriptions relative" style={{ overflow: "hidden", paddingTop: 50, paddingBottom: 50 }}>

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
                                                <Row style={{ marginTop: -23, marginRight: -20 }}>
                                                    <Col xs="3">
                                                        <img onClick={this.reset} src={back} />
                                                    </Col>
                                                    <Col xs="9">

                                                        <p className="bold font22">Order Summary</p>
                                                    </Col>
                                                </Row>


                                            </div>
                                            <div style={{ padding: 30 }}>
                                                <Row>
                                                    <Col md="1">

                                                    </Col>
                                                    <Col md="10">
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
                                                                            disablePast={true}
                                                                            label="Select date and time"
                                                                            value={this.state.selectedDate}
                                                                            onChange={(event) => this.onDateChange("selectedDate", event)}
                                                                        />
                                                                    </MuiPickersUtilsProvider>
                                                                    <div style={{ height: 8 }}></div>
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
                                                                    <p className=""><b>Age: </b> {this.state.age} <br /><br /> <b>Sex: </b>{this.state.sex} <br /><br /> <b>Medical Condition: </b>{this.state.medicalCondition} <br /><br /> <b>Gender Preference: </b> {this.state.gender} <br /><br /> <b>Services needed: </b>{this.state.services} <br /><br /> <b>Customization requirement: </b><br /><br /> {this.state.cusDescription} </p>
                                                                    <hr />
                                                                    <h6 className="font-title bold">Location</h6>
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

                                        <div className="delight-bottom card-shadow" style={{ marginTop: 70 }}>
                                            {
                                                <div className="build-box">
                                                    {
                                                        this.state.step == 0 &&

                                                        <div>
                                                            <img style={{ width: 70, marginBottom: 15 }} src={map} />
                                                            <p className="bold font16">Where do you want this service to be delivered?</p>
                                                            <p className="font-title font14">
                                                                Exact location required
                                                            </p>
                                                            <br />
                                                            <div className="relative">

                                                                <FloatingInput onSelectLocation={this.onSelectLocation} value={this.state.userLocation} label={"Enter service location"} />
                                                            </div>
                                                        </div>


                                                    }
                                                    {
                                                        this.state.step == 1 &&
                                                        <div>
                                                            <img style={{ width: 70, marginBottom: 15 }} src={calendar} />
                                                            <p className="bold font16">When do you need this service to be delivered?</p>
                                                            <p className="font-title">We take 2-3 days to process a YoCo Care request.</p>
                                                            <br />
                                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                                <Grid container justify="space-around">
                                                                    <KeyboardDatePicker
                                                                        margin="normal"
                                                                        minDate={new Date()}
                                                                        disablePast={true}
                                                                        id="date-picker"
                                                                        label="Select date"
                                                                        clearLabel
                                                                        value={this.state.selectedDate}
                                                                        onChange={(event) => this.onDateChange("selectedDate", event)}
                                                                    />
                                                                </Grid>
                                                            </MuiPickersUtilsProvider>
                                                            {
                                                                <Modal isOpen={this.state.dateAlertVisible} role="dialog" autoFocus={true} centered={true}>
                                                                    <ModalBody>
                                                                        <div style={{ padding: 20 }} className="d-block">
                                                                            <p className="font-title">We usually take 2-3 days to process a YoCo Care request. However we will do our best to take care of your request within the time frame you have chosen.</p>
                                                                            <div className="button-align">
                                                                                <Button onClick={() => this.onClickDate()}>OK</Button>
                                                                            </div>
                                                                        </div>
                                                                    </ModalBody>

                                                                </Modal>
                                                            }
                                                        </div>
                                                    }
                                                    {
                                                        this.state.step == 2 &&
                                                        <div>
                                                            <img style={{ width: 70, marginBottom: 15 }} src={describe} />
                                                            <p className="bold font16">Customization requirement</p>
                                                            <p className="font-title font14">Give specific information about the service you need.</p>
                                                            <br />
                                                            <textarea rows="4" value={this.state.cusDescription} onChange={this.handleChange} className="form-control" name="cusDescription" type="text">

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
                                                        this.state.step == 3 &&
                                                        <div>
                                                            <img style={{ width: 70, marginBottom: 15 }} src={gender2} />
                                                            <p className="bold font16">Give us more information about the person who will <b style={{ color: "#9c0097" }}>receive</b> the service.</p>
                                                            <br />
                                                            <Row>
                                                                <Col md="6">
                                                                    <label>Age</label>
                                                                    <select onChange={this.handleChange} className="form-control" name="age" type="select">
                                                                        {this.ageOptions()}
                                                                    </select>

                                                                    {/* <input value={this.state.age} onChange={this.handleChange} className="form-control" name="age" type="text" >

                                                                    </input> */}
                                                                </Col>
                                                                <Col md="6">
                                                                    <label>Sex</label>
                                                                    <select value={this.state.sex} onChange={this.handleChange} className="form-control" name="sex" type="text" >
                                                                        <option>Select</option>
                                                                        <option>Male</option>
                                                                        <option>Female</option>
                                                                        <option>Others</option>
                                                                    </select>
                                                                </Col>
                                                            </Row>

                                                        </div>
                                                    }
                                                    {
                                                        this.state.step == 4 &&
                                                        <div>
                                                            <img style={{ width: 70, marginBottom: 15 }} src={heart} />
                                                            <p className="bold font16">Does the person have any existing medical condition?

                                                            </p>
                                                            <p className="font-title font14">Please mention specific details like: <br />have hypertension / diabetic for 10 years / had a bypass surgery last year</p>
                                                            <br />
                                                            <textarea value={this.state.medicalCondition} onChange={this.handleChange} className="form-control" name="medicalCondition" type="text" >

                                                            </textarea>
                                                        </div>
                                                    }
                                                    {
                                                        this.state.step == 5 &&
                                                        <div>
                                                            <img style={{ width: 70, marginBottom: 15 }} src={gender} />
                                                            <p className="font16 bold">Please mark your gender preference for the person who will <b style={{ color: "#9c0097" }}>deliver</b> the service.</p>
                                                            <br />
                                                            <Row>
                                                                <Col xs="4">
                                                                    <label style={{ height: 45 }}>Male</label>
                                                                    <input className="form-control" type="radio" name="gender"
                                                                        value="Male"
                                                                        checked={this.state.gender === "Male"}
                                                                        onChange={this.onRadioChanged} />
                                                                </Col>
                                                                <Col xs="4">
                                                                    <label style={{ height: 45 }}>Female</label>
                                                                    <input className="form-control" type="radio" name="gender"
                                                                        value="Female"
                                                                        checked={this.state.gender === "Female"}
                                                                        onChange={this.onRadioChanged} />
                                                                </Col>
                                                                <Col xs="4">
                                                                    <label style={{ height: 45 }}>No Preferences</label>
                                                                    <input className="form-control" type="radio" name="gender"
                                                                        value="Any"
                                                                        checked={this.state.gender === "Any"}
                                                                        onChange={this.onRadioChanged} />
                                                                </Col>
                                                            </Row>



                                                        </div>
                                                    }
                                                    <br /><br />
                                                    <div>
                                                        <img onClick={this.prevStep} style={{ paddingRight: 15 }} className="go-button-left" src={left} />
                                                        <img onClick={this.nextStep} style={{ paddingLeft: 15 }} className="go-button-right" src={right} />
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
                                            <Col md="7" xs="6" style={{ margin: '2% 2%' }}>
                                                <p style={{ marginBottom: 0, fontSize:19 }}><b>Continuous care, even from a distance</b></p>
                                                <br />
                                                <p className="font14 font-title">For any healthcare and wellbeing requirement of your loved ones back home, we have a solution!<br />Choose from these offerings and make your own package, or custom-make a new plan on your own.</p>
                                            </Col>
                                            <Col md='2' xs='2' style={{paddingTop: '1%', paddingBottom: '1%'}}>
                                                <a onClick={() => this.showMtpModal()} className="d-block">
                                                    <img src={convo} style={{ width: 50, margin: "0 auto", marginTop: 10, display: "block" }} />
                                                    <p className="font-title text-center" style={{ fontSize: 14, margin: "0 auto", marginTop: 10, marginLeft: 10 }}>Meet the Parents</p>
                                                </a>
                                            </Col>
                                            <Col md='2' xs='2' style={{paddingTop: '1%', paddingBottom: '1%'}}>
                                                <a onClick={() => this.showCovidModal()} className="d-block">
                                                    <img src={covid} style={{ width: 50, margin: "0 auto", marginTop: 10, display: "block" }} />
                                                    <p className="font-title text-center" style={{ fontSize: 14, margin: "0 auto", marginTop: 10, marginLeft: 15 }}>Covid Concerns</p>
                                                </a>
                                            </Col>
                                        </Row>
                                    </div>
                                    {
                                        <Modal isOpen={this.state.mtpModal} role="dialog" centered={true}>
                                            <ModalBody>
                                                <div className="d-block">
                                                    <img src={convo} style={{ width: 80, margin: "0 auto", marginTop: 10, marginBottom: 20, display: "block" }} />
                                                    <p className="text-center">Meet The Parents</p>
                                                    <p className="font-title">{this.state.modalText}</p>
                                                    <div className="button-align">
                                                        <Button onClick={this.toggleMtpModal}>Close</Button>
                                                    </div>
                                                </div>
                                            </ModalBody>

                                        </Modal>
                                    }
                                    {
                                        <Modal isOpen={this.state.trialModal} role="dialog" autoFocus={true} centered={true}>
                                            <ModalBody>
                                                <div className="d-block">
                                                    <img src={calendar1} style={{ width: 80, margin: "0 auto", marginTop: 10, marginBottom: 20, display: "block" }} />
                                                    <p className="text-center">One Week Trial</p>
                                                    <p className="font-title">{this.state.modalText}</p>
                                                    <div className="button-align">
                                                        <Button onClick={this.toggleTrialModal}>Close</Button>
                                                    </div>
                                                </div>
                                            </ModalBody>

                                        </Modal>
                                    }
                                    {
                                        <Modal isOpen={this.state.covidModal} role="dialog" autoFocus={true} centered={true}>
                                            <ModalBody>
                                                <div className="d-block">
                                                    <img src={covid} style={{ width: 80, margin: "0 auto", marginTop: 10, marginBottom: 20, display: "block" }} />
                                                    <p className="text-center">Covid Concerns</p>
                                                    <p className="font-title">{this.state.modalText}</p>
                                                    <div className="button-align">
                                                        <Button onClick={this.toggleCovidModal}>Close</Button>
                                                    </div>
                                                </div>
                                            </ModalBody>

                                        </Modal>
                                    }
                                    <div style={{ padding: 20 }}>
                                        <Row>
                                            <Col md="12">
                                                <Row>
                                                    {
                                                        this.state.plans.map((plan, key) =>

                                                            <Col md="4">
                                                                <div className="subs-card card-shadow">
                                                                    <div className="img-container">
                                                                        <img src={plan.pic} />
                                                                    </div>
                                                                    <h5><b>{plan.title}</b></h5>
                                                                    <div className="grey-sub">
                                                                        <p className="bold" style={{ fontSize: 12 }}>
                                                                            {plan.desc}
                                                                        </p>
                                                                    </div>
                                                                    <p style={{ fontSize: 12, marginInline: 20, marginTop: 10 }}>{plan.features}</p>
                                                                    {
                                                                        plan.inCart ?
                                                                            <a onClick={() => this.addToCart(plan.id)} className="sub-button incart">Added</a>
                                                                            :
                                                                            <a onClick={() => this.addToCart(plan.id)} className="sub-button hover-grow-0"><span><img style={{ width: 18 }} src={add} />ADD</span></a>
                                                                    }

                                                                </div>
                                                            </Col>
                                                        )
                                                    }
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Col md="12">

                                            <div className="cart">
                                                <p className="bold font16">Selected services</p>
                                                <br />
                                                {
                                                    this.state.cart.map((item, key) =>
                                                        <div className="cart-item">
                                                            <p style={{ color: "black", fontWeight:"bold", fontSize:16 }}>{item.title}</p>
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
                                                    <Col md="3">
                                                        {this.state.cart.length > 0 &&
                                                            <a onClick={() => this.setProceed(true)} className="cart-button proceed-button">Proceed</a>
                                                        }
                                                    </Col>

                                                </Row>

                                            </div>
                                            <br />

                                        </Col>
                                    </div>
                                    <div className="delight-bottom card-shadow">
                                        <div className="or">
                                            <span>OR</span>
                                        </div>
                                        <br />
                                        <p style={{fontSize: 16}}>If you want to customize your subscription</p>
                                        <br />
                                        <a onClick={() => this.setProceedCus(true)} className="hamper-button rad-button">Click Here</a>
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