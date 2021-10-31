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
import money from "../../images/icon/money-bag.png";
import drug from "../../assets/images/icon/drug.png";
import technical from "../../assets/images/icon/technical.png";
import essentials from "../../assets/images/icon/essentials.png";
import house from "../../assets/images/icon/house.png";
import map from "../../images/icon/map.svg";
import calendar from "../../images/icon/calendar-3.png";
import FloatingInput from '../../components/Shared/GeoSuggest/FloatingInput';
import { Calendar } from 'react-date-range';
class NewPost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            title: "",
            description: "",
            error: "",
            budget: "",
            userLocation: "",
            category: "",
            age: "",
            sex: "",
            medicalCondition: "",
            gender: "",
            visit: "",
            material: "",
            selectedDate: "",
            selectedLocation: '',
            modalVisible: false,
            isDateModalVisible: false,
            summary: false,
            editing: false,
        }
        this.onRadioChanged = this.onRadioChanged.bind(this)
        this.onSelectLocation = this.onSelectLocation.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.toggleModal = this.toggleModal.bind(this)
        this.toggleCalendarModal = this.toggleCalendarModal.bind(this)
        this.toggleEdit = this.toggleEdit.bind(this)
        this.createRequest = this.createRequest.bind(this)
        this.setCategory = this.setCategory.bind(this)
        this.showPopup = this.showPopup.bind(this)
    }
    showPopup() {
        this.setState({
            error: "Please mention specific details like have hypertension / diabetic for 10 years / had a bypass surgery last year",
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

    componentDidUpdate(prevProps, prevState) {
        const { selectedLocation, isPosted } = this.props;
        if (prevProps.selectedLocation !== selectedLocation && selectedLocation == null) {
            this.setState({
                userLocation: "",
            })
        }
        if (prevProps.isPosted !== isPosted && isPosted) {
            this.props.history.push("/post-success")
        }
    }
    componentDidMount() {
        var userId = localStorage.getItem("userId")
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
    }
    render() {
        const { delights } = this.props;
        return (
            <React.Fragment>
                <div>
                    <Container className="relative rise-card2" style={{ marginTop: 50 }}>
                        {
                            <div className="summary">
                                <div className="summary-header">
                                    <p className="bold font22">Summary</p>
                                </div>
                                <div style={{ padding: 30 }}>
                                    <Row>
                                        <Col md="2">
                                        </Col>
                                        <Col md="10">
                                            {
                                                <div>
                                                    <h6 className="font-title bold">Request Title</h6>
                                                    <input value={this.state.title} onChange={this.handleChange} className="form-control" name="title" type="text" />
                                                    <br />
                                                    <h6 className="font-title bold">Description</h6>
                                                    <textarea rows="4" value={this.state.description} onChange={this.handleChange} className="form-control" name="description" type="text" >
                                                    </textarea>
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
                                            }

                                        </Col>
                                    </Row>
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
    selectedLocation: state.profile.selectedLocation,
    requestDetails: state.request.requestDetails,
})

const mapDispatchToProps = {
    ...RequestActions,
    ...ProfileAction,
    ...UserActions
}

export default connect(mapStateToProps, mapDispatchToProps)(NewPost)
