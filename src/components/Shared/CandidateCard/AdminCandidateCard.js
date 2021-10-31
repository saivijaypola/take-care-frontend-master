import React, { Component } from 'react'
import { connect } from 'react-redux'
import spiffy from "../../../images/icon/yoyoco-safe-5.png";
import dots from "../../../images/icon/dots-3.png";
import chat from "../../../images/icon/chat-box-2.png";
import listIcon from "../../../images/icon/invoices.png";
import envelope from "../../../images/icon/chat-2.png";
import eye from "../../../images/icon/eye.svg";
import viewquote from "../../../images/icon/viewquote.png";
import like from "../../../images/icon/like.svg";
import dislike from "../../../images/icon/dislike.svg";
import rejected from "../../../images/icon/rejected.svg";
import user from "../../../images/icon/user-6.png";
import { Button } from '@material-ui/core';
import Badge from '@material-ui/core/Badge';
import SpiffyOnAvatar from "../../Shared/Spiffy/spiffyonavatar";
import ReactDOM from 'react-dom';
import Checkbox from '@material-ui/core/Checkbox';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import firebase from "firebase"
import UserStatus from '../UserStatus/Userstatus'
import ReadMoreReact from 'read-more-react';
import _ from "lodash";
import gmail from "../../../images/icon/gmail.png";
import call from "../../../images/icon/call.png";
import { v4 as uuidv4 } from 'uuid';
import {
    Row, Col,
    Modal,
    ModalHeader,
    ModalFooter,
    ModalBody
} from "reactstrap";
import { getDistance } from 'geolib';
import { UserActions } from '../../../redux/actions';
import getSymbolFromCurrency from 'currency-symbol-map';

const assetsBaseUrl = process.env.REACT_APP_ASSETS_BASE_URL

export class AdminCandidateCard extends Component {


    constructor() {
        super()
        this.state = {
            open: true,
            isModelOpen: false,
            isInfoModalOpen: false,
            faraway: false,
            other: false,
            quality: false,
            communication: false,
            highprice: false,
            comments: "",
            rejectReason: [],
            liked: false,
            disliked: false,
            reactionId: null
        }
        this.onNavigateToRequestDetails = this.onNavigateToRequestDetails.bind(this)
        this.onNavigateToRequestDetailsChat = this.onNavigateToRequestDetailsChat.bind(this)
        this.rejectQuote = this.rejectQuote.bind(this)
        this.toggleModal = this.toggleModal.bind(this)
        this.toggleInfoModal = this.toggleInfoModal.bind(this)
        this.handleCheck = this.handleCheck.bind(this)
        this.handleText = this.handleText.bind(this)

    }
    componentDidMount() {
        const { data, selectedPost, key } = this.props

        if (data.reactionId) {
            this.setState({
                reactionId: data.reactionId
            })
            if (data.isLiked) {
                this.setState({
                    liked: true,
                    disliked: false
                })
            } else if (data.isDisliked) {
                this.setState({
                    liked: false,
                    disliked: true
                })
            }
        }
    }
    toggleInfoModal() {
        this.setState({
            isInfoModalOpen: !this.state.isInfoModalOpen
        })
    }


    handleText(event) {
        this.setState({
            comments: event.target.value
        })
    }
    handleCheck(event) {
        this.setState({
            [event.target.name]: event.target.checked
        })
    }
    toggleModal() {
        this.setState({
            isModelOpen: !this.state.isModelOpen
        })
    }
    rejectQuote() {
        var serviceId = this.props.data.serviceOrderId
        var reasons = []
        if (this.state.faraway) {
            reasons.push("Provider far away")
        }
        if (this.state.quality) {

            reasons.push("Profile quality not good enough")
        }
        if (this.state.highprice) {
            reasons.push("Price too high")

        }
        if (this.state.communication) {
            reasons.push("Communication Not good")

        }
        if (this.state.other) {
            reasons.push("I just don't like it")
        }
        var payload = {
            "serviceOrderId": serviceId,
            "serviceOrderPatch": {
                "rejectReason": reasons,
                "orderStatus": "Rejected",
                "userComments": this.state.comments
            }
        }
        this.props.rejectOffer(payload)
        this.setState(
            {
                open: false,
                isInfoModalOpen: true,
                isModelOpen: !this.state.isModelOpen
            }
        )
    }

    onNavigateToRequestDetails(requestId, userId, data) {
        if (this.props.type && this.props.type === 'edit-user') {
            localStorage.setItem("userId", userId);
            this.props.history.push({ pathname: `/admin/provider-profile-edit/${userId}`, state: this.state })
        } else {
            this.props.history.push({ pathname: `/admin/provider-details/${requestId}/${userId}`, state: this.state })
        }   
    }
    onNavigateToRequestDetailsChat(requestId, userId, data) {
        // this.props.history.push({ pathname: `/admin/provider-details/${requestId}/${userId}/chat`, state: this.state })
    }
    render() {
        const { data, selectedPost, key } = this.props
        return (
            <React.Fragment>
                {
                    data && this.state.open && (

                        <div className="jobs-card-admin card-shadow inner-job">
                            <Row>
                                <Col xs="3">
                                    <img style={{ width: 70, height: 70, borderRadius: '50%' }} src={data && data.avatarUrl !== '' ? `${assetsBaseUrl}/Users/${data.userId}/Avatar/${data.avatarUrl}` : user} alt="user_img" />
                                </Col>
                                <Col style={{ marginLeft: 5 }}>
                                    <Row style={{ height: '30%' }}>
                                        <Col>
                                            <p className="bold text-left font16">{data && data.fullname}</p>
                                            {/* <span><UserStatus userId={request.userId} /></span> */}
                                        </Col>
                                    </Row>
                                    <div style={{ height: '25%' }}>
                                        <UserStatus userId={data.userId} />
                                    </div>
                                    <Row style={{ height: '25%' }}>
                                        <Col xs="2" md="1" lg="1">
                                            <img src={gmail} style={{ height: 15, float: 'left', marginRight: 5, marginTop: 3 }} />
                                        </Col>
                                        <Col>
                                            <p className="font-title">{data && data.email}</p>
                                        </Col>
                                    </Row>
                                    <Row style={{ height: '25%' }}>
                                        <Col xs="2" md="1" lg="1">
                                            <img src={call} style={{ height: 15, float: 'left', marginRight: 5, marginTop: 3 }} />
                                        </Col>
                                        <Col>
                                            <p className="font-title">{data && data.phoneNumber}</p>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <hr />
                            <div style={{ height: '40%' }} className="text-overflow-fade">
                                <p className="font-title">{data.aboutme}</p>
                                <p className="font-title">{data.providerComments}</p>
                            </div>
                            <hr />
                            <Row>
                                <Col xs='2'>
                                    <SpiffyOnAvatar width={50} height={50} spiffyStrength={data.spiffy && data.spiffy.length > 0 ? data.spiffy[0] : 0} />
                                </Col>
                                {
                                    data.quoteAmount ?
                                    <Col xs='4'>
                                        <p style={{ color: "purple", marginTop: 20, textAlign: 'center', fontSize:16 }}><b>{getSymbolFromCurrency('INR')} {data.quoteAmount}</b></p>
                                    </Col>
                                    :
                                    <Col xs='4'></Col>
                                }
                                <Col xs='6'>
                                    <Button style={{ marginTop: 10 }} onClick={() => this.onNavigateToRequestDetails(this.props.match.params.requestid, data.userId, data)} className="accept full-width hover-grow-0 pointer">Details</Button>
                                </Col>
                            </Row>

                        </div>

                    )
                }


            </React.Fragment>

        )
    }
}

const mapStateToProps = (state) => ({

    selectedPost: state.request.requestDetails,


})

const mapDispatchToProps = {

    ...UserActions
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminCandidateCard)
