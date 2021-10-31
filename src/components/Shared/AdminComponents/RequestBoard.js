import React from 'react'
import { connect } from 'react-redux'
import { useDispatch, useSelector } from "react-redux"
import { Container, Row, Col, Button, Modal, Spinner, ModalBody } from "reactstrap";
import _ from "lodash";
import ReadMoreReact from 'read-more-react';
import moment from 'moment';
import location from "../../../images/icon/location-card.png";
import gmail from "../../../images/icon/gmail.png";
import call from "../../../images/icon/call.png";
import schedule from "../../../images/icon/schedule.png";

import assets from '../../../assets/images';
const assetsBaseUrl = process.env.REACT_APP_ASSETS_BASE_URL

export const RequestBoard = ({ key, request, ...props }) => {

    const navigateToDetails = (requestId, request) => {
        // localStorage.setItem('selectedPost', request);
        localStorage.setItem('selectedPost', JSON.stringify(request));
        props.history.push(`/admin/request/providers/${requestId}/${request.latitude}/${request.longitude}`)
    }
    const navigateToCarePackage = (requestId, request) => {
        console.log("🚀 ~ file: RequestBoard.js ~ line 19 ~ navigateToCarePackage ~ requestId", requestId)
        props.history.push(`/admin/care-package/${requestId}`)
    }
    console.log("🚀 ~ file: RequestMain.js ~ line 93 ~ RequesMain ~ render ~ requestDetails", request)

    return (
        <React.Fragment key={key}>
            <div className="jobs-card-admin card-shadow inner-job" >
                <Row style={{ height: '8%' }}>
                    <Col>
                        <p className="bold text-left" style={{fontSize:16}}>{request && request.fullname}</p>
                        {/* <span><UserStatus userId={request.userId} /></span> */}
                    </Col>
                </Row>
                <Row style={{ height: '6%' }}>
                    <Col xs="2" md="1" lg="1">
                        <img src={gmail} style={{ height: 15, float: 'left', marginRight: 5, marginTop: 3 }} />
                    </Col>
                    <Col>
                        <p className="font-title">{request && request.email}</p>
                    </Col>
                </Row>
                <Row style={{ height: '5%' }}>
                    <Col xs="2" md="1" lg="1">
                        <img src={call} style={{ height: 15, float: 'left', marginRight: 5, marginTop: 3 }} />
                    </Col>
                    <Col>
                        <p className="font-title">{request && request.phoneNumber}</p>
                    </Col>
                </Row>
                <hr />
                <Row xs='12' style={{ height: '8%' }}>
                    <Col xs='12'> 
                        <p className="bold font-title font16">{request.title}</p>
                    </Col>
                </Row>
                <div style={{ height: '32%' }} className="text-overflow-fade">
                    <p className="font-title font-title">{request.description}</p>
                </div>
                <Row style={{ height: '6%', marginTop: 5 }}>
                    <Col xs="2" md="1" lg="1">
                        <img src={schedule} style={{ height: 20, float: 'left', marginRight: 5 }} />
                    </Col>
                    <Col>
                        <p className="font-title">{moment(request.serviceNeedsOn).format('LL')}</p>
                    </Col>
                </Row>
                <Row style={{ height: '10%' }}>
                    <Col xs="2" md="1" lg="1">
                        <img src={location} style={{ width: 20, float: 'left', marginRight: 5 }} />
                    </Col>
                    <Col>
                        <p className="font-title">{request.locationTitle}</p>
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col xs="5">
                        <Button onClick={() => navigateToDetails(request.requestId, request)} className="accept hover-grow-0 pointer full-width">Providers</Button>
                    </Col>
                    <Col xs="7">
                        {request.isCareSubscription && request.isCareSubscription !== null &&
                            <Button onClick={() => navigateToCarePackage(request.requestId, request)} className="accept hover-grow-0 pointer full-width">Care Packages</Button>
                        }
                    </Col>
                </Row>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(RequestBoard)
