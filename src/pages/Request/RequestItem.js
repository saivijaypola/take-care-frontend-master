import React, { Component } from 'react'
import { connect } from 'react-redux'
import spiffy from "../../images/icon/yoyoco-safe-5.png";
import dots from "../../images/icon/dots-3.png";
import chat from "../../images/icon/chat-box-2.png";
import marker from "../../images/icon/marker.png";
import wishlist from "../../images/icon/favourite.png";
import calendar from "../../images/icon/calendar_b.svg";
import location from "../../images/icon/location-card.png";
import tag from "../../images/icon/tag-3.png";
import userimg from "../../images/busi01.jpg";
import user from "../../images/icon/user-6.png";
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import firebase from "firebase";
import {
    Row, Col
} from "reactstrap";
import moment from 'moment';

import { getDistance } from 'geolib';
import { UserActions, ProfileAction, RequestActions } from '../../redux/actions';
import UserStatus from '../../components/Shared/UserStatus/Userstatus'
const assetsBaseUrl = process.env.REACT_APP_ASSETS_BASE_URL
export class UserRequestCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            metadata: '',
        }
        this.navigateToDetails = this.navigateToDetails.bind(this)
    }
    componentDidMount() {
        const { request, selectedLocation, key } = this.props
    }
    componentDidUpdate(prevProps) {
        const { serviceDetails } = this.props

        if (prevProps.serviceDetails !== serviceDetails && serviceDetails) {
            if (serviceDetails.orderStatus == "Confirmed") {
                this.props.getOrderDetails({ serviceorderid: serviceDetails && serviceDetails.serviceOrderId })

            }
        }
    }

    navigateToDetails(requestId, userId) {
        console.log("REQUEST PROPS", this.props.request);
        if (this.props.request && this.props.request.careId) {
            this.props.history.push(`/provider/care-timeline/${requestId}/${userId}`)
        } else {
            if (this.props.request.orderStatus && this.props.request.orderStatus !== 'Confirmed' && this.props.request.orderStatus !== null && this.props.request.orderStatus !== 'exclusive' && this.props.request.orderStatus !== "Pending") {
                this.props.history.push(`/provider/timeline/${requestId}/${userId}`)
            } else {
                this.props.history.push(`/provider/request-details/${requestId}/${userId}`)
            }
        }
    }
    render() {
        const { request, selectedLocation, key } = this.props

        return (

            <React.Fragment key={key}>
                {request && !request.careId ?
                    <div className="jobs-card hover-animate pointer inner-job" style={{backgroundColor: '#fff', margin: '6% 0%', height: 350, borderRadius: 6, boxShadow: "0px 3px 21px -1px #ddd"}}>
                        <Row style={{ height: '10%' }}>
                            <Col>
                                <p className="bold text-left font-title" style={{fontSize:17}}>{request && request.fullname}</p>
                                {/* <span><UserStatus userId={request.userId} /></span> */}
                            </Col>
                        </Row>
                        <hr />
                        <Row style={{ height: '10%' }}>
                            <Col>
                                <p className="bold font16 font-title">{request.title}</p>
                            </Col>
                        </Row>
                        <div style={{ height: '40%' }} className="text-overflow-fade">
                            <p className="font-title font-title">{request.description}</p>
                        </div>
                        <Row style={{ height: '10%' }}>
                            <Col xs="2" md="1" lg="1">
                                <img src={location} style={{ width: 20, float: 'left', marginRight: 5 }} />
                            </Col>
                            <Col>
                                <p className="font-title">{request.locationTitle}</p>
                            </Col>
                        </Row>
                        {/* {
                            selectedLocation && selectedLocation && (
                                selectedLocation.latitude && selectedLocation.longitude &&
                                <span className="block font-title text-left font13 location-text">{`${Math.round(getDistance({ latitude: selectedLocation.latitude, longitude: selectedLocation.longitude }, { latitude: request.latitude, longitude: request.longitude }) / 1000)} Km away`}</span>
                            )
                        } */}
                        <hr />
                        <Row>
                            <Col xs="6">
                                <span className="job-date">Needed on</span>
                                {
                                    request.serviceNeedsOn ?
                                        <span className="block font-title text-left font13">{moment(request.serviceNeedsOn).format('LL')}</span> :
                                        <span className="block font-title text-left font13">Flexible</span>
                                }

                            </Col>
                            <Col xs="6">
                                <Button onClick={() => this.navigateToDetails(request.requestId, request.userId)} className="accept full-width hover-grow-0 pointer">Details</Button>
                            </Col>
                        </Row>
                    </div>

                    :
                    <div className="jobs-card hover-animate pointer inner-job" style={{backgroundColor: '#fff', margin: '6% 0%', height: 350, borderRadius: 6, boxShadow: "0px 3px 21px -1px #ddd"}}>
                        <Row style={{ height: '10%' }}>
                            <Col>
                                <p className="bold font16 text-left font-title">{request && request.userFullName}</p>
                                {request && request.city && request.city && <span style={{ marginLeft: -15, textTransform: "capitalize" }}>{request && request.city && request.city}, {request && request.state && request.state}, {request && request.country && request.country}</span>}
                                <br />
                            </Col>
                        </Row>
                        <Row style={{ height: '15%' }}>
                            <Col>
                                <p className="bold font16 font-title">{request.tblCarePackageByCareId.careTitle && request.tblCarePackageByCareId.careTitle}</p>
                            </Col>
                        </Row>
                        <div style={{ height: '40%' }} className="text-overflow-fade">
                            <p className="font-title font-title">{request.tblCarePackageByCareId.careDescription && request.tblCarePackageByCareId.careDescription}</p>
                        </div>
                        <Row style={{ height: '15%' }}>
                            <Col xs="2" md="1" lg="1">
                                <img src={location} style={{ width: 20, float: 'left', marginRight: 5 }} />
                            </Col>
                            <Col>
                                <p className="font-title">{request.userAddress}</p>
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col xs="6">
                                <span className="job-date">Needed on</span>
                                {
                                    request.orderAcceptedOn ? <span className="job-date font-title">{moment(request.orderAcceptedOn).format('LL')}</span> :
                                        <span className="job-date font-title">Flexible</span>
                                }

                            </Col>
                            <Col xs="6">
                                <Button onClick={() => this.navigateToDetails(request.careId, request.careOrderId)} className="accept hover-grow-0 pointer full-width">Details</Button>
                            </Col>
                        </Row>
                    </div>
                }
            </React.Fragment >

        )
    }
}

const mapStateToProps = (state) => ({
    selectedLocation: state.profile.selectedLocation,
    selectedPost: state.user.selectedPost,
    serviceDetails: state.request.serviceDetails,
    orderDetails: state.request.orderDetails,
    chatId: state.request.chatId
})

const mapDispatchToProps = {
    ...ProfileAction,
    ...RequestActions,
    ...UserActions
}

export default connect(mapStateToProps, mapDispatchToProps)(UserRequestCard)
