import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    Container, Row, Col, Nav,
    Modal,
    Button,
    NavItem,
    NavLink, TabContent,
    TabPane
} from "reactstrap";
import { ProfileAction, RequestActions } from '../../../redux/actions';
import profile from "../../../assets/images/client/05.jpg";
import marker from "../../../images/icon/marker.png";
import spiffy from "../../../images/icon/yoyoco-safe-3.png"
import calendar from "../../../images/icon/calendar_b.svg";
import SpiffyOnAvatar from '../Spiffy/spiffyonavatar';
import { getDistance } from 'geolib';
import user from "../../../images/icon/user-6.png";
import firebase from "firebase"
import UserStatus from '../UserStatus/Userstatus';
import gmail from "../../../images/icon/gmail.png";
import call from "../../../images/icon/call.png";

const assetsBaseUrl = process.env.REACT_APP_ASSETS_BASE_URL
export default class RequestResponse extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pictureModal: false,
        }
        this.togglePicture = this.togglePicture.bind(this);
    }
    togglePicture() {
        if (this.props.data.avatarUrl !== '') {
            this.setState({
                pictureModal: !this.state.pictureModal
            });
        }

    }
    render() {
        const { myRequestDetails, data } = this.props

        return (
            <div>
                <Modal className="" isOpen={this.state.pictureModal}>
                    <img src={data.avatarUrl !== '' ? `${assetsBaseUrl}/Users/${data.userId}/Avatar/${data.avatarUrl}` : user} />
                    <Button onClick={this.togglePicture}>Close</Button>
                </Modal>
                <div className="request-details-profile">
                    <Row>
                        <Col xs="3">
                            <img className="pointer" onClick={this.togglePicture} src={data.avatarUrl !== '' ? `${assetsBaseUrl}/Users/${data.userId}/Avatar/${data.avatarUrl}` : user}></img>
                        </Col>
                        <Col xs="8">
                            <p className="bold font16">{data.fullname}</p>
                            {
                                data.title !== null && (
                                    <span style={{ fontSize: 13 }} className="">{`${data.title}`}</span>
                                )
                            }
                            {/* {
                                myRequestDetails && myRequestDetails.latitude && data && data.tblUserLocationByUserId && data.tblUserLocationByUserId.longitude && (
                                    <span className="block  text-left font13">{`${Math.round(getDistance({ latitude: myRequestDetails.latitude, longitude: myRequestDetails.longitude }, { latitude: data.tblUserLocationByUserId && data.tblUserLocationByUserId.latitude, longitude: data.tblUserLocationByUserId && data.tblUserLocationByUserId.longitude }) / 1000)} Km away`}</span>
                                )
                            } */}
                            <UserStatus userId={data.userId} />
                            {
                                localStorage.getItem('role') === 'admin' &&
                                <>
                                    <br />
                                    <Row style={{ height: '25%' }}>
                                        <Col xs="2" md="1" lg="1">
                                            <img src={gmail} style={{ height: 15, width: 15, float: 'left', marginRight: 5, marginTop: 3 }} />
                                        </Col>
                                        <Col>
                                            <p className="font-title">{data && data.email}</p>
                                        </Col>
                                    </Row>
                                    <Row style={{ height: '25%' }}>
                                        <Col xs="2" md="1" lg="1">
                                            <img src={call} style={{ height: 15, width: 15, float: 'left', marginRight: 5, marginTop: 3 }} />
                                        </Col>
                                        <Col>
                                            <p className="font-title">{data && data.phoneNumber}</p>
                                        </Col>
                                    </Row>
                                </>
                            }
                        </Col>
                        <Col xs="1">
                            <div className="spiffy">
                                <SpiffyOnAvatar spiffyStrength={data && data.spiffy && data.spiffy[0]} />
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>

        )
    }
}


