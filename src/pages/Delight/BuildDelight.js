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
import box from "../../images/icon/heart-box.png";
import confetti from "../../images/icon/confetti.png";
import go from "../../images/icon/go.png";
import left from "../../images/icon/left.png";
import right from "../../images/icon/right.png";
import money from "../../images/icon/money-bag.png";
import map from "../../images/icon/map.svg";
import calendar from "../../images/icon/calendar-3.png";
import FloatingInput from '../../components/Shared/GeoSuggest/FloatingInput';
import { Calendar } from 'react-date-range';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
    KeyboardDateTimePicker,
} from '@material-ui/pickers';
class Delight extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            title: "",
            description: "",
            error: "",
            budget: "",
            userLocation: this.props.selectedLocation !== '' ? this.props.selectedLocation : '',
            selectedDate: new Date((new Date().getTime())).toISOString(),
            selectedLocation: this.props.selectedLocation !== '' ? this.props.selectedLocation : '',
            modalVisible: false,
            isDateModalVisible: false,
            summary: false,
            edit: false,
        }
        this.prevStep = this.prevStep.bind(this)
        this.nextStep = this.nextStep.bind(this)
        this.onSelectLocation = this.onSelectLocation.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.toggleModal = this.toggleModal.bind(this)
        this.toggleCalendarModal = this.toggleCalendarModal.bind(this)
        this.toggleEdit = this.toggleEdit.bind(this)
        this.createRequest = this.createRequest.bind(this)
        this.onDateChange = this.onDateChange.bind(this)

    }
    createRequest() {
        if (this.state.title !== '' && this.state.description !== '' && this.state.userLocation !== "" && this.state.selectedDate !== "") {
            var request = {
                "inputRequest": {
                    "requestId": uuidv4(),
                    "serviceCategory": "Other",
                    "title": 'YoCo Delights: ' + this.state.title,
                    "description": this.state.description + "-- Budget: " + this.state.budget,
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
    toggleEdit() {
        this.setState({
            edit: !this.state.edit
        })
    }
    onSelectLocation = (location) => {
        this.setState({
            userLocation: location,
            selectedLocation: location


        }, () => {
            this.props.changeLocation(location)
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
    onDateChange = (name, event) => {
        const target = event.target; // Do we need this?(unused in the function scope)!
        this.setState({
            [name]: event
        }, () => {
        });
    };
    nextStep() {
        if (!(this.state.step > 4)) {
            if (this.state.step == 0) {
                if (this.state.title == "") {
                    this.setState({
                        error: "Please enter the occassion",
                        modalVisible: true
                    })
                }
                else {
                    this.setState({
                        step: this.state.step + 1
                    })
                }
            }
            if (this.state.step == 1) {
                if (this.state.description.length < 50) {
                    this.setState({
                        error: "Please tell us what would you like to do in more than 50 characters",
                        modalVisible: true
                    })
                }
                else {
                    this.setState({
                        step: this.state.step + 1
                    })
                }
            }
            if (this.state.step == 2) {
                if (this.state.budget == "") {
                    this.setState({
                        error: "Please enter the budget",
                        modalVisible: true
                    })
                }
                else {
                    this.setState({
                        step: this.state.step + 1
                    })
                }
            }
            if (this.state.step == 3) {
                if (this.state.selectedLocation === "") {
                    this.setState({
                        error: "Please choose the location",
                        modalVisible: true
                    })
                }
                else {
                    this.setState({
                        step: this.state.step + 1,
                        userLocation: this.state.selectedLocation

                    })
                }
            }
            if (this.state.step == 4) {
                if (this.state.selectedDate == "") {
                    this.setState({
                        error: "Please choose a date",
                        modalVisible: true
                    })
                }
                else {
                    this.setState({
                        step: this.state.step + 1,
                        summary: true
                    })
                }
            }


        }
    }
    prevStep() {
        if (!(this.state.step < 1)) {
            this.setState({
                step: this.state.step - 1
            })
        }
    }
    componentDidUpdate(prevProps, prevState) {
        const { selectedLocation, isPosted } = this.props;
        console.log("🚀 ~ file: BuildDelight.js ~ line 203 ~ Delight ~ componentDidUpdate ~ selectedLocation", selectedLocation)
        if (prevProps.selectedLocation !== selectedLocation && selectedLocation == null) {
            this.setState({
                userLocation: "",
            })
        }
        if (prevProps.isPosted !== isPosted && isPosted) {
            this.props.history.push("/delight-success")
        }
    }
    componentDidMount() {
        var userId = localStorage.getItem("userId")
        if (!userId) {
            localStorage.setItem("target", "/build-delight")
            this.props.history.push("/sign-in/hamper")
        }
        window.scrollTo(0, 0)
        this.props.getDelights()
        this.props.getDelightsById({
            "productId": "0d658ac3-1e10-46ec-9474-a7f6ffb962b2"
        })
    }
    render() {
        const { delights } = this.props;
        return (
            <React.Fragment>
                <div style={{ paddingBottom: 200 }} className="safe-cover delight-cover">
                    <Container>
                        <Row className="align-items-center text-center">
                            <Col lg="12">
                                <h2>YoCo Delights</h2>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <div>
                    <Container className="relative rise-card2">
                        {
                            this.state.summary
                                ?
                                <div className="summary">
                                    <div className="summary-header">
                                        <h2 className="bold">Order Summary</h2>
                                    </div>
                                    <div style={{ padding: 30 }}>
                                        <Row>
                                            <Col md="2">
                                                <img style={{ width: 70 }} src={box} />
                                            </Col>
                                            <Col md="10">
                                                {
                                                    this.state.edit
                                                        ?
                                                        <div>
                                                            <h6 className="font-title bold">Occasion</h6>
                                                            <input value={this.state.title} onChange={this.handleChange} className="form-control" name="title" type="text" placeholder="Tell us about the occasion for which you are planning this" />
                                                            <br />
                                                            <h6 className="font-title bold">Description</h6>
                                                            <textarea rows="4" value={this.state.description} onChange={this.handleChange} className="form-control" name="description" type="text" placeholder="Tell us more about how you want to delight your loved one on this occasion. ">
                                                            </textarea>
                                                            <br />
                                                            <h6 className="font-title bold">Budget</h6>
                                                            <input value={this.state.budget} onChange={this.handleChange} className="form-control" name="budget" type="text" placeholder="Tell us the amount you are willing to spend on this." />
                                                            <br />
                                                            <h6 className="font-title bold">Delivery Location</h6>
                                                            <div className="relative">

                                                                <FloatingInput onSelectLocation={this.onSelectLocation} value={this.state.selectedLocation} label={"Enter your location"} />
                                                            </div>
                                                            <br />
                                                            <h6 className="font-title bold">Date</h6>
                                                            <input value={this.state.selectedDate && new Date(this.state.selectedDate).toDateString()} onClick={this.toggleCalendarModal} className="form-control" name="selectedDate" type="text" placeholder="Select a Date"></input>
                                                            <br />
                                                            <a onClick={this.toggleEdit} className="hamper-button">Save</a>
                                                        </div>
                                                        :
                                                        <div>
                                                            <h3 className="bold">{this.state.title}</h3>
                                                            <p className="font-title">{this.state.description}</p>
                                                            <hr />
                                                            <h6 className="font-title bold">Budget</h6>
                                                            <h4 className="bold">{this.state.budget}</h4>
                                                            <hr />
                                                            <h6 className="font-title bold">Delivery Location</h6>
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
                                    <div className="build-box">
                                        {
                                            this.state.step == 0 &&
                                            <div>
                                                <img style={{ width: 70, marginBottom: 15 }} src={box} />
                                                <h4 className="bold">What is your occasion?</h4>
                                                <br />
                                                <input value={this.state.title} onChange={this.handleChange} className="form-control" name="title" type="text" placeholder="Tell us about the occasion for which you are planning this">

                                                </input>
                                            </div>

                                        }
                                        {
                                            this.state.step == 1 &&
                                            <div>
                                                <img style={{ width: 70, marginBottom: 15 }} src={confetti} />
                                                <h4 className="bold">What would you like to do?</h4>
                                                <p className="font-title font14">Please give us specific information about what you want to buy or do. The more details you include, the more meaningful the responses you get from our service providers.</p>
                                                <br />
                                                <textarea rows="4" value={this.state.description} onChange={this.handleChange} className="form-control" name="description" type="text" placeholder="Tell us about how you want to delight your loved one on this occasion in more than 50 characters. ">

                                                </textarea>
                                            </div>
                                        }
                                        {
                                            this.state.step == 2 &&
                                            <div>
                                                <img style={{ width: 70, marginBottom: 15 }} src={money} />
                                                <h4 className="bold">What is your budget?</h4>
                                                <br />
                                                <input value={this.state.budget} onChange={this.handleChange} className="form-control" name="budget" type="text" placeholder="Tell us the amount you are willing to spend on this.">

                                                </input>
                                            </div>
                                        }
                                        {
                                            this.state.step == 3 &&
                                            <div>
                                                <img style={{ width: 70, marginBottom: 15 }} src={map} />
                                                <h4 className="bold">Where do you want the delivery?</h4>
                                                <p className="font-title font14">
                                                    Tell us the exact location where you need this to be delivered.
                                        </p>
                                                <br />
                                                <div className="relative">

                                                    <FloatingInput onSelectLocation={this.onSelectLocation} value={this.state.selectedLocation} label={"Enter your location"} />
                                                </div>
                                            </div>
                                        }
                                        {
                                            this.state.step == 4 &&
                                            <div>
                                                <img style={{ width: 70, marginBottom: 15 }} src={calendar} />
                                                <h4 className="bold">When do you need this?</h4>
                                                <p className="font-title">Tell us the exact or latest date by when you need this to be delivered.</p>
                                                <br />
                                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                    <KeyboardDateTimePicker
                                                        margin="normal"
                                                        id="time-picker"
                                                        disablePast={true}
                                                        label=""
                                                        className="form-control"
                                                        value={this.state.selectedDate}
                                                        onChange={(event) => this.onDateChange("selectedDate", event)}
                                                    />
                                                </MuiPickersUtilsProvider>
                                                {/* <input value={this.state.selectedDate && new Date(this.state.selectedDate).toDateString()} onClick={this.toggleCalendarModal} className="form-control" name="selectedDate" type="text" placeholder="Select a Date">

                                                </input> */}
                                            </div>
                                        }
                                        <br /><br />
                                        <div>
                                        <img onClick={this.prevStep} style={{paddingRight: 15}} className="go-button-left" src={left} />
                                        <img onClick={this.nextStep} style={{paddingLeft: 15}} className="go-button-right" src={right} />
                                        </div>
                                    </div>
                                </div>

                        }
                    </Container>
                </div>
                <Modal isOpen={this.state.isDateModalVisible} role="dialog" autoFocus={true} centered={true}>
                    <ModalBody>
                        <Calendar
                            editableDateInputs={true}
                            onChange={(item) => this.setState({ selectedDate: item })}
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
    selectedLocation: state.profile.selectedLocation
})

const mapDispatchToProps = {
    ...RequestActions,
    ...ProfileAction,
    ...UserActions
}

export default connect(mapStateToProps, mapDispatchToProps)(Delight)
