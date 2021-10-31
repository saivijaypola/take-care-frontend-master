import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Container, Row, Col, Modal, Button, ModalBody } from "reactstrap";
import OwlCarousel from 'react-owl-carousel';
import { ProfileAction, RequestActions, UserActions } from '../../redux/actions';
import { connect } from 'react-redux'
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { v4 as uuidv4 } from 'uuid';
import './style.css'
import back from "../../images/icon/left-arrow.svg";
import hamper from "../../images/hamper.jpg";
import FloatingInput from '../../components/Shared/GeoSuggest/FloatingInput';
import { getDistance } from 'geolib';
import assets from '../../assets/images';
class DelightItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userLocation: '',
            selectedLocation: '',
            deliveryMessage: false,
            buildOwn: false,
            description: "",
            pinModal: false
        }
        this.onSelectLocation = this.onSelectLocation.bind(this)
        this.onChangeText = this.onChangeText.bind(this)
        this.createRequest = this.createRequest.bind(this)
        this.togglePinModal = this.togglePinModal.bind(this)
    }

    createRequest() {
        const { delight } = this.props;
        if (this.state.userLocation) {
            var desc = delight && delight.itemsIncluded && delight.itemsIncluded

            // desc = desc.toString()
            // desc = this.state.description + desc
            var request = {
                "inputRequest": {
                    "requestId": uuidv4(),
                    "serviceCategory": this.state.serviceCategory,
                    "title": delight && delight.productTitle,
                    "description": desc,
                    "userId": localStorage.getItem("userId"),
                    "locationTitle": this.state.userLocation.locationTitle,
                    "latitude": this.state.userLocation.latitude,
                    "longitude": this.state.userLocation.longitude,
                    "isHealthcare": false,
                    "isDisabled": false,
                    "isCompleted": false,
                    "isDateFlexible": true,
                    "createdAt": new Date()
                }
            }
            localStorage.setItem("delightId", this.props.match.params.id)
            // localStorage.setItem("hamperRequest", this.state.description)
            localStorage.setItem("locationTitle", this.state.userLocation.locationTitle)
            localStorage.setItem("latitude", this.state.userLocation.latitude)
            localStorage.setItem("longitude", this.state.userLocation.longitude)
            if (localStorage.getItem("userId")) {
                this.props.history.push("/delight-confirm")
            } else {
                localStorage.setItem("target", "/delight-confirm")
                this.props.history.push("/sign-in/hamper")
            }
        }
        else {
            this.setState({
                pinModal: true
            })
        }
        // this.props.postNewRequest(request)
    }
    togglePinModal() {
        this.setState({
            pinModal: !this.state.pinModal
        })
    }
    onChangeText(event) {

        this.setState({
            description: event.target.value
        })
    }
    onSelectLocation = (selectedLocation) => {
        this.setState({
            userLocation: selectedLocation
        }, () => {
            this.props.changeLocation(selectedLocation)
        })
        var delivery = Math.round(getDistance({ latitude: selectedLocation && selectedLocation.latitude, longitude: selectedLocation && selectedLocation.longitude }, { latitude: this.props.delight && this.props.delight.tblUserByProviderId && this.props.delight.tblUserByProviderId.tblUserLocationByUserId && this.props.delight.tblUserByProviderId.tblUserLocationByUserId.latitude && this.props.delight.tblUserByProviderId.tblUserLocationByUserId.latitude, longitude: this.props.delight && this.props.delight.tblUserByProviderId && this.props.delight.tblUserByProviderId.tblUserLocationByUserId && this.props.delight.tblUserByProviderId.tblUserLocationByUserId.longitude && this.props.delight.tblUserByProviderId.tblUserLocationByUserId.longitude }) / 1000)
        delivery = parseInt(delivery)
        console.log("distance", delivery)
        if (delivery < 25) {
            this.setState({
                deliveryMessage: true,
                buildOwn: false
            })
        } else if (25 <= delivery) {
            this.setState({
                deliveryMessage: false,
                buildOwn: true
            })
        }
    }
    componentDidMount() {
        window.scrollTo(0, 0)
        this.props.getDelightsById({
            "productId": this.props.match.params.id
        })
        this.setState({
            userLocation: this.props.selectedLocation
        })
    }
    componentDidUpdate(prevProps, prevState) {
        const { selectedLocation } = this.props;
        if (prevProps.selectedLocation !== selectedLocation && selectedLocation == null) {
            this.setState({
                userLocation: "",
                deliveryMessage: false
            })
        }
    }
    render() {
        const { delight } = this.props;
        console.log("🚀 ~ file: DelightItem.js ~ line 130 ~ DelightItem ~ render ~ delight", delight)
        return (
            <React.Fragment>
                <div style={{ paddingBottom: 200 }} className="safe-cover delight-cover">
                    <Container>
                        <Row className="align-items-center text-center">
                            <Col lg="12">
                                <h2> Yoco Delights</h2>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <div>
                    <Container className="relative rise-card2">
                        <img onClick={() => this.props.history.push("/YoCoDelights")} className="back-icon" src={back} />
                        <div style={{ padding: 70 }}>
                            <Row>
                                <Col md="12">
                                    <h3><b>{delight && delight.productTitle}</b></h3>
                                    <p className="font-title adjusted-para font13">
                                        {delight && delight.productDescription}
                                    </p>
                                    <h3 className="bold">Rs {delight && delight.price}</h3>
                                    <hr></hr>
                                </Col>
                                <Col md="4">
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


                                    {delight && delight.providerId === 'wFmrLCiyFdVlJk8JE0TB4rTdxQz2' &&
                                        <div className="delight-location-wrapper">
                                            <img src={assets.images.location} />
                                            <p className="bold text-muted font14 adjusted-para">This product is made and delivered from <br /><span>Meenadom, Kottayam</span></p>
                                        </div>
                                    }
                                </Col>
                                <Col md="8">

                                    <h5><b>What’s Inside?</b></h5>
                                    <ul>

                                        {delight && delight.itemsIncluded && delight.itemsIncluded.map((item, index) =>
                                            <li>{item}</li>
                                        )}
                                        <hr />

                                    </ul>
                                    <h5><b>Customize</b></h5>
                                    <p className="font-title font14 adjusted-para">
                                        If you do not want any item listed above, it can be replaced with additional quantity of another item in the hampers. The price remains same and customization is subject to availability.
                                    </p>
                                    <hr />
                                    <h5><b>Delivery</b></h5>
                                    <p className="font-title font14 adjusted-para">
                                        Please key in your pin code to determine if your area of delivery is serviceable.
                                    </p>

                                    <Row className="pin">
                                        <Col md="4">
                                            <FloatingInput onSelectLocation={this.onSelectLocation} value={this.state.selectedLocation} label={"Enter your ZIP code"} />
                                        </Col>
                                    </Row>
                                    <p style={{ marginTop: 10 }} className="bold font14 purple-text">{this.state.deliveryMessage}</p>
                                    <div>
                                        <a onClick={this.createRequest} className="rad-button hamper-button">Choose Item</a>
                                    </div>
                                    <br />
                                    {
                                        this.state.deliveryMessage &&
                                        <p className="font-title font14">
                                            Upto 5km: Free delivery in person
                                            <br />
                                            Upto 25km: Paid delivery in person
                                        </p>
                                    }
                                    {
                                        this.state.buildOwn &&
                                        <React.Fragment>
                                            <p className="font-title font14">
                                                More than 25km: Paid delivery by courier
                                            </p>
                                            <p className="font-title font14 adjusted-para">
                                                If you are particular about hand-delivering a delight and this one can’t be done so, please don’t be disappointed!
                                            </p>
                                            <p className="bold font-title font14 adjusted-para">
                                                You have another option! Get a trusted companion to put together a custom delight and deliver it to this location.
                                                <br />
                                                <a onClick={() => this.props.history.push("/build-delight")} className="text-link">Build Your Own</a>
                                            </p>

                                        </React.Fragment>
                                    }
                                </Col>
                            </Row>
                        </div>
                        <Modal isOpen={this.state.pinModal}>
                            <ModalBody>
                                <h6>Enter zip code</h6>
                                <Button onClick={this.togglePinModal}>Close</Button>
                            </ModalBody>

                        </Modal>
                    </Container>
                </div>

            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({

    delights: state.request.delights,
    delight: state.request.delight,
    selectedLocation: state.profile.selectedLocation

})

const mapDispatchToProps = {
    ...RequestActions,
    ...ProfileAction,
    ...UserActions
}

export default connect(mapStateToProps, mapDispatchToProps)(DelightItem)
