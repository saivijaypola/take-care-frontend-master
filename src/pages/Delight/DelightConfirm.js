import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Container, Row, Col, Spinner, Modal, Label } from "reactstrap";
import OwlCarousel from 'react-owl-carousel';
import { ProfileAction, RequestActions, UserActions } from '../../redux/actions';
import { connect } from 'react-redux'
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import back from "../../images/icon/left-arrow.svg";
import { v4 as uuidv4 } from 'uuid';
import './style.css'
import gift from "../../images/icon/gift-1.png";
import hamper from "../../images/hamper.jpg";
import FloatingInput from '../../components/Shared/GeoSuggest/FloatingInput';
import { AvForm, AvField, AvGroup } from 'availity-reactstrap-validation';
import { getDistance } from 'geolib';
import LaddaButton, { XL, SLIDE_UP } from 'react-ladda';
import Delight from './Delight';
import { de } from 'date-fns/locale';
import { Calendar } from 'react-date-range';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
    KeyboardDateTimePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import calendar from "../../images/icon/calendar-3.png";

class DelightConfirm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            description: "",
            request: "",
            locationTitle: "",
            latitude: "",
            longitude: "",
            selectedDate: new Date((new Date().getTime())).toISOString(),
        }
        this.onChangeText = this.onChangeText.bind(this)
        this.createRequest = this.createRequest.bind(this)
        this.onDateChange = this.onDateChange.bind(this)
    }
    onChangeText(event) {

        this.setState({
            description: event.target.value
        })
    }
    onDateChange = (name, event) => {
        const target = event.target; // Do we need this?(unused in the function scope)!
        this.setState({
            [name]: event
        }, () => {
        });
    };
    createRequest() {
        const { delight } = this.props;
        var desc = delight && delight.itemsIncluded && delight.itemsIncluded
        var title = 'YoCo Delights: ' + (delight && delight.productTitle)
        desc = desc.toString()
        desc = this.state.description
        var request = {
            "inputRequest": {
                "requestId": uuidv4(),
                "serviceCategory": "other",
                "title": title,
                "description": desc,
                "userId": localStorage.getItem("userId"),
                "locationTitle": this.state.locationTitle,
                "latitude": parseFloat(this.state.latitude),
                "longitude": parseFloat(this.state.longitude),
                "isHealthcare": false,
                "isDisabled": false,
                "isCompleted": false,
                "isDateFlexible": true,
                "serviceNeedsOn": this.state.selectedDate,
                "serviceEndsOn": this.state.selectedDate,
                "createdAt": new Date()
            }
        }
        if (this.state.description.length > 5) {
            this.props.postNewRequest(request)
        }
    }
    componentDidMount() {
        // var description = localStorage.getItem("hamperRequest")
        var locationTitle = localStorage.getItem("locationTitle")
        var latitude = localStorage.getItem("latitude")
        var longitude = localStorage.getItem("longitude")
        this.setState({
            locationTitle: locationTitle,
            latitude: latitude,
            longitude: longitude,
        })
        window.scrollTo(0, 0)
        this.props.getDelightsById({
            "productId": localStorage.getItem("delightId")
        })
    }
    componentDidUpdate(prevProps, prevState) {
        const { isPosted, delight, isServiceOrderCreated } = this.props;
        if (prevProps.isPosted !== isPosted && isPosted) {
            var request = {
                "serviceOrder": {
                    "serviceOrderId": uuidv4(),
                    "requestId": this.props.selectedPost && this.props.selectedPost.requestId,
                    "userId": localStorage.getItem("userId"),
                    "providerId": delight && delight.providerId,
                    "orderTotalAmount": delight && delight.price,
                    "advanceAmount": 0,
                    "amountPaid": 0,
                    "orderStatus": "exclusive",
                    "createdAt": new Date()
                }
            }
            this.props.createServiceOrder(request)
        }
        if (prevProps.isServiceOrderCreated !== isServiceOrderCreated && isServiceOrderCreated) {
            this.props.history.push("/hamper-success")
        }
    }
    render() {
        console.log('DATE', this.state.selectedDate);
        const { delight } = this.props;
        return (
            <React.Fragment>
                <div style={{ paddingBottom: 200 }} className="safe-cover delight-cover">
                    <Container>
                        <Row className="align-items-center text-center">
                            <Col lg="12">
                                <h2>Yoco Delights</h2>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <div>
                    <Container className="relative rise-card2">
                        <img onClick={() => this.props.history.push("delight/" + delight.productId)} className="back-icon" src={back} />
                        <div style={{ padding: 70 }}>
                            <div>
                                <h2 className="bold">Summary</h2>
                                {/* <p className="font-title">Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet </p> */}

                            </div>
                            <hr /><br />
                            <Row>
                                <Col md="3">
                                    {
                                        delight && delight.coverImages && delight.coverImages && (
                                            delight.coverImages.length > 1
                                                ?
                                                <Carousel>
                                                    {delight && delight.coverImages && delight.coverImages.map((cover, index) =>
                                                        <div>
                                                            <img src={cover} />
                                                        </div>
                                                    )}
                                                </Carousel>
                                                :
                                                <img className="width100" src={delight && delight.coverImages[0]} />
                                        )
                                    }
                                </Col>
                                <Col md="9">
                                    <h3><b>{delight && delight.productTitle}</b></h3>
                                    <p className="font-title adjusted-para font13">
                                        {delight && delight.productDescription}
                                    </p>

                                    <h3 className="bold">Rs {delight && delight.price}</h3>
                                    <hr></hr>
                                    <h6 className="font-title"><b>Delivery</b></h6>
                                    <p className="bold font14 adjusted-para">
                                        {this.state.locationTitle}
                                    </p>
                                    <hr />

                                    <div>

                                        <AvForm onSubmit={this.createRequest}>
                                            <div>
                                                <h6 className="font-title bold">When do you need this?</h6>
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
                                                <hr />
                                            </div>
                                            <AvGroup className="form-group position-relative">
                                                <AvField type="textarea" rows="3" className="form-control" value={this.state.description} name="personalMessage" id="personalMessage" onChange={this.onChangeText} placeholder="Enter a personal message" required
                                                    errorMessage=""
                                                    validate={{
                                                        required: { value: true, errorMessage: "Please enter a personal message" },
                                                        minLength: { value: 6, errorMessage: 'Please enter at least 6 characters' }
                                                    }}
                                                />
                                            </AvGroup>
                                            <LaddaButton
                                                loading={this.state.loadProfileUpdate}
                                                className="submitBnt btn btn-primary pull-left"
                                                data-color="#eee"
                                                data-size={XL}
                                                data-style={SLIDE_UP}
                                                data-spinner-size={30}
                                                data-spinner-color="#ddd"
                                                data-spinner-lines={12}
                                            // onClick={this.toggleModal}
                                            >
                                                Confirm
                                            </LaddaButton>
                                        </AvForm>
                                    </div>

                                </Col>
                            </Row>
                        </div>
                        {
                            this.props.isLoading ? (
                                <Modal className="spinner-modal" isOpen={true}>
                                    <Spinner animation="border" />
                                </Modal>
                            ) : ''
                        }
                    </Container>
                </div>

            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({

    delights: state.request.delights,
    delight: state.request.delight,
    isPosted: state.user.isPosted,
    isLoading: state.user.isLoading,
    isServiceOrderCreated: state.user.isServiceOrderCreated,
    selectedPost: state.user.selectedPost
})

const mapDispatchToProps = {
    ...RequestActions,
    ...ProfileAction,
    ...UserActions
}

export default connect(mapStateToProps, mapDispatchToProps)(DelightConfirm)
