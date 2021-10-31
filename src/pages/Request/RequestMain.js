import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    Container, Row, Col, Nav,
    NavItem,
    NavLink, TabContent,
    TabPane, Modal, Spinner, Input, Button, ModalBody
} from "reactstrap";
import profile from "../../assets/images/client/05.jpg";
import marker from "../../images/icon/marker.png";
import calendar from "../../images/icon/calendar_b.svg";
import user from "../../images/icon/user-6.png";
import { RequestActions } from "../../redux/actions";
import { v4 as uuidv4 } from 'uuid';
import { getDistance } from 'geolib';
import firebase from "firebase";
import moment from 'moment';

import UserStatus from '../../components/Shared/UserStatus/Userstatus'
const assetsBaseUrl = process.env.REACT_APP_ASSETS_BASE_URL

class RequesMain extends Component {

    constructor(props) {
        super(props)

        this.state = {
            advanceAmount: '',
            totalAmount: '',
            providerFeedback: '',
            isModalVisible: false,
            serviceOrderId: ''
        }
        this.onChangeText = this.onChangeText.bind(this)
        this.updateRequest = this.updateRequest.bind(this)
    }

    componentDidMount() {
        window.scrollTo(0, 0)
        if (localStorage.getItem('userId')) {
            this.props.getRequestDetails({
                requestId: this.props.match.params.requestid
            })
            this.props.getServiceDetails({
                requestid: this.props.match.params.requestid, providerid: localStorage.getItem('userId')
            })

        }
    }

    onChangeText(event) {

        this.setState({
            [event.target.name]: event.target.value
        })
    }
    updateRequest() {
        const { serviceDetails } = this.props

        var params = {
            "serviceid": serviceDetails && serviceDetails.serviceOrderId ? serviceDetails.serviceOrderId : uuidv4(),
            "requestid": this.props.match.params.requestid,
            "userid": this.props.match.params.userId,
            "providerid": localStorage.getItem('userId'),
            "order_total_amount": parseFloat(this.state.totalAmount.trim()),
            "advance_amount": parseFloat(this.state.advanceAmount.trim()),
            "amount_paid": 0.00,
            "payment_method": "Bank",
            "provider_comments": this.state.providerFeedback.trim(),
            "user_comments": "",
            "order_status": "Pending"
        }
        this.props.updateRequest(params)

    }
    componentDidUpdate(prevProps) {

        const { isRequestUpdated, serviceDetails } = this.props
        if (prevProps.isRequestUpdated !== isRequestUpdated && isRequestUpdated) {
            this.setState({
                isModalVisible: true
            })
        }
        if (serviceDetails && prevProps.serviceDetails !== serviceDetails) {

            this.setState({
                advanceAmount: serviceDetails.advanceAmount,
                totalAmount: serviceDetails.orderTotalAmount,
                providerFeedback: serviceDetails.providerComments
            })

        }

    }
    render() {
        const { requestDetails, isRequestDetailsLoading, isRequestUpdating, selectedLocation } = this.props
        return (
            <div>

                <div className="request-details-profile req-provider">
                    <Row>
                        <Col xs="4">
                            <img src={requestDetails && requestDetails.tblUserByUserId && requestDetails.tblUserByUserId.avatarUrl !== '' ? `${assetsBaseUrl}/Users/${requestDetails.userId}/Avatar/${requestDetails.tblUserByUserId.avatarUrl}` : user} ></img>
                        </Col>
                        <Col xs="8">
                            <p className="bold font14">{requestDetails && requestDetails.tblUserByUserId && requestDetails.tblUserByUserId.fullname}</p>
                            {requestDetails && requestDetails.tblUserByUserId &&
                                requestDetails.tblUserByUserId.city &&
                                <span style={{ marginLeft: -15, textTransform: "capitalize" }}>
                                    {requestDetails && requestDetails.tblUserByUserId &&
                                        requestDetails.tblUserByUserId.city ? requestDetails.tblUserByUserId.city + ", " : ""}
                                    {requestDetails && requestDetails.tblUserByUserId &&
                                        requestDetails.tblUserByUserId.state ? requestDetails.tblUserByUserId.state + ", " : ""}
                                    {requestDetails && requestDetails.tblUserByUserId &&
                                        requestDetails.tblUserByUserId.country ? requestDetails.tblUserByUserId.country : ""}</span>
                            }
                            <br />
                            <span style={{ marginLeft: -15 }}><UserStatus userId={this.props.match.params.userId} /></span>
                        </Col>
                    </Row>
                </div>
                <br />
                <p className="bold font14"> {requestDetails && requestDetails.title} </p>

                <p className="request-details-para">
                    {requestDetails && requestDetails.description}
                </p>
                <Row>
                    <Col lg="12">
                        {
                            requestDetails && selectedLocation && (
                                <Row>

                                    <Col xs="1">
                                        <img className="request-icon" src={marker}></img>
                                    </Col>
                                    <Col xs="4">
                                        <span className="bold block font-title text-left font13">Location</span>
                                        <span className="block font-title text-left font13">{requestDetails.locationTitle && requestDetails.locationTitle}</span>
                                    </Col>
                                    <Col xs="1">
                                        <img className="request-icon" src={calendar}></img>
                                    </Col>
                                    <Col xs="5">
                                        <span className="bold block font-title text-left font13">Service needed by</span>
                                        <span className="block font-title text-left font13">{requestDetails && requestDetails.serviceNeedsOn ? moment(requestDetails.serviceNeedsOn).format('LL') : <p>Flexible</p>}</span>

                                    </Col>
                                </Row>
                            )
                        }

                    </Col>
                </Row>
                <hr className="negmarg30"></hr>
                {/* <Row>
                    <Col md="6">
                        <Input type="text" name="advanceAmount" id="advanceAmount" value={this.state.advanceAmount} onChange={this.onChangeText} placeholder="Advance" className="big-input"></Input>
                    </Col>
                    <Col md="6">
                        <Input type="text" name="totalAmount" id="totalAmount" value={this.state.totalAmount} onChange={this.onChangeText} placeholder="Total Amount" className="big-input"></Input>
                    </Col>
                    <Col md="12">
                        <textarea className="big-input" name="providerFeedback" value={this.state.providerFeedback} id="providerFeedback" onChange={this.onChangeText} placeholder="Comments"></textarea>
                    </Col>
                </Row>
                <Button onClick={() => this.updateRequest()} className="quote-button">Send Quote</Button>
                {
                    isRequestDetailsLoading || isRequestUpdating && (
                        <Modal className="spinner-modal" isOpen={true}>
                            <Spinner style={{ margin: "10px auto" }} animation="border" />
                        </Modal>
                    )
                }
                <Modal isOpen={this.state.isModalVisible}>
                    <ModalBody>
                        <div style={{ textAlign: 'center' }}>
                            <h6 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 1, color: '#861b8d' }}>Request Sent</h6>
                            <p>Your request has been sent</p>
                            <Button onClick={() => this.setState({ isModalVisible: false, modalMessage: '', modalDescription: '' })}>Close</Button>
                        </div>
                    </ModalBody>
                </Modal> */}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    requestDetails: state.request.requestDetails,
    serviceDetails: state.request.serviceDetails,
    isRequestDetailsLoading: state.request.isRequestDetailsLoading,
    isRequestUpdating: state.request.isRequestUpdating,
    isRequestUpdated: state.request.isRequestUpdated,
    selectedLocation: state.profile.selectedLocation,

})

const mapDispatchToProps = {
    ...RequestActions
}

export default connect(mapStateToProps, mapDispatchToProps)(RequesMain)
