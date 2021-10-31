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
import gmail from "../../../images/icon/gmail.png";
import call from "../../../images/icon/call.png";
import FormControl from '@material-ui/core/FormControl';
import firebase from "firebase"
import UserStatus from '../UserStatus/Userstatus'
import { Prompt } from 'react-router'

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
const assetsBaseUrl = process.env.REACT_APP_ASSETS_BASE_URL

export class CandidateCard extends Component {


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
        this.likeProvider = this.likeProvider.bind(this)
        this.unlikeProvider = this.unlikeProvider.bind(this)
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
    likeProvider() {


        if (this.state.liked === true) {
            var shouldLike = false
            var shouldDislike = false
            this.setState({
                liked: false
            })
        } else {
            var shouldLike = true
            var shouldDislike = false
            this.setState({
                liked: true,
                disliked: false
            })
        }
        const { data } = this.props
        if (this.state.reactionId) {
            var reactionId = data.reactionId
        } else {
            var reactionId = uuidv4()
        }
        var userId = localStorage.getItem('userId')
        var payload = {
            "reaction_id": reactionId,
            "user_id": userId,
            "provider_id": data.userId,
            "request_id": this.props.match.params.requestid,
            "is_liked": shouldLike,
            "is_disliked": shouldDislike,
            "is_visible": true
        }
        this.props.addReaction(payload)
    }
    unlikeProvider() {
        if (this.state.disliked === true) {
            var shouldLike = false
            var shouldDislike = false
            this.setState({
                disliked: false
            })
        }
        else {
            var shouldLike = false
            var shouldDislike = true
            this.setState({
                liked: false,
                disliked: true
            })
        }
        const { data } = this.props
        if (this.state.reactionId) {
            var reactionId = data.reactionId
        } else {
            var reactionId = uuidv4()
        }
        var userId = localStorage.getItem('userId')
        var payload = {
            "reaction_id": reactionId,
            "user_id": userId,
            "provider_id": data.userId,
            "request_id": this.props.match.params.requestid,
            "is_liked": shouldLike,
            "is_disliked": shouldDislike,
            "is_visible": true
        }
        this.props.addReaction(payload)

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
        this.props.history.push({ pathname: `/provider-details/${requestId}/${userId}`, state: this.state })
    }
    onNavigateToRequestDetailsChat(requestId, userId, data) {
        this.props.history.push({ pathname: `/provider-details/${requestId}/${userId}/chat`, state: this.state })
    }
    render() {
        const { data, selectedPost, key } = this.props

        return (
            <React.Fragment>
                {
                    data && this.state.open && (

                        <div className="candidate-card-provider card-shadow inner-job">
                            {/* <Row>
                                <Col xs="4">
                                    <img className="candidate-img" src={data && data.avatarUrl !== '' ? `${assetsBaseUrl}/Users/${data.userId}/Avatar/${data.avatarUrl}` : user} alt="user_img"></img>
                                </Col>
                                <Col xs="8">
                                    <div className="neg-m-l-20">
                                        <h5 className="bold">{data && data.fullname}</h5>
                                        {
                                            data && data.title !== null && (
                                                <div>
                                                    <span className="font-title">{`${data.title}`}</span>
                                                </div>
                                            )

                                        }
                                        {
                                            selectedPost && (
                                                selectedPost.latitude && selectedPost.longitude && data && data.latitude && data.longitude &&
                                                <span className="font-title"> {`${Math.round(getDistance({ latitude: selectedPost.latitude, longitude: selectedPost.longitude }, { latitude: data.latitude, longitude: data.longitude }) / 1000)} Km away`}</span>

                                            )
                                        }
                                        <UserStatus userId={data.userId} />

                                    </div>
                                </Col>
                            </Row> */}
                            <Row>
                                <Col xs="3">
                                    <img style={{ width: 70, height: 70, borderRadius: '50%' }} src={data && data.avatarUrl !== '' ? `${assetsBaseUrl}/Users/${data.userId}/Avatar/${data.avatarUrl}` : user} alt="user_img" />
                                </Col>
                                <Col style={{ marginLeft: 5 }}>
                                    <Row style={{ height: '25%' }}>
                                        <Col>
                                            <p className="bold font16 text-left">{data && data.fullname}</p>
                                            {/* <span><UserStatus userId={request.userId} /></span> */}
                                        </Col>
                                    </Row><br />
                                    <Row>
                                    <Col style={{ height: '25%' }}>
                                        <UserStatus userId={data.userId} />
                                    </Col>
                                    </Row>
                                    <Row style={{ height: '22%' }}>
                                        <Col xs="2" md="1" lg="1">
                                            <img src={gmail} style={{  width: 16, height: 16, float: 'left', marginRight: 5, marginTop: 3 }} />
                                        </Col>
                                        <Col>
                                            <p className="font-title">{data && data.email}</p>
                                        </Col>
                                    </Row>
                                    <Row style={{ height: '23%' }}>
                                        <Col xs="2" md="1" lg="1">
                                            <img src={call} style={{ width: 16, height: 16, float: 'left', marginRight: 5, marginTop: 5 }} />
                                        </Col>
                                        <Col>
                                            <p className="font-title">{data && data.phoneNumber}</p>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                           
                            
                           

                            <br />
                            {data.quoteAmount ?
                                <div className="text-center quote-section">
                                    <span className="font-title bold font14">You have an offer</span>
                                    <p style={{ color: "purple", fontSize:'15'}}><b>Rs {data.quoteAmount}</b></p>
                                    <hr />
                                    <Row style={{paddingTop: 40}}>
                                        {
                                            data.orderStatus && data.orderStatus == "Rejected" ?
                                                <Col xs="4" style={{ filter: "opacity(0.5)" }}>
                                                    <img src={rejected} />
                                                    <p><b>Rejected</b></p>
                                                </Col>
                                                :
                                                <Col xs="4" onClick={this.toggleModal}>
                                                    <img src={rejected} />
                                                    <p><b>Reject</b></p>
                                                </Col>
                                        }

                                        <Col xs="4" onClick={() => this.onNavigateToRequestDetails(this.props.match.params.requestid, data.userId, data)}>
                                            <img src={viewquote} />
                                            <p className="purple-text"><b>View offer</b></p>
                                        </Col>
                                        <Col xs="4" onClick={() => this.onNavigateToRequestDetailsChat(this.props.match.params.requestid, data.userId, data)}>
                                            <img src={envelope} />
                                            <p><b>Ask a question</b></p>
                                        </Col>
                                    </Row>
                                </div>
                                :
                                <div>
                                <p className="font-title text-overflow-fade">{data.aboutme}</p><br />
                                <div style={{ height: '50%' }}>
                              
                                    <div className="text-center quote-section">


                                        <Row>
                                            <Col xs="2">

                                            </Col>
                                            <Col xs="4" onClick={this.likeProvider}>
                                                <div className={this.state.liked ? "liked-container" : "like-container"}>
                                                    <img src={like} />
                                                </div>

                                            </Col>
                                            <Col xs="4" onClick={this.unlikeProvider}>
                                                <div className={this.state.disliked ? "disliked-container" : "like-container"}>
                                                    <img src={dislike} />
                                                </div>
                                            </Col>
                                            
                                            <Col xs="2">

                                            </Col>
                                        </Row>
                                        
                                       
                                    </div>
                                    </div>
                                    
                                    <hr />
                                    <Row className="bottom-candidate">
                                        <Col xs="6">
                                        {/* <SpiffyOnAvatar className={"candidate-spiffy"} spiffyStrength={data.spiffy && data.spiffy.length > 0 ? data.spiffy[0] : 0} /> */}
                                        <SpiffyOnAvatar width={50} height={50} spiffyStrength={data.spiffy && data.spiffy.length > 0 ? data.spiffy[0] : 0} />
                                
                                        </Col>
                                        <Col className="bottom-candidate-h" xs="6" onClick={() => this.onNavigateToRequestDetailsChat(this.props.match.params.requestid, data.userId, data)}>
                                            <p className="purple-text"><img src={envelope} className="ask" /><b>Chat</b></p>
                                        </Col>
                                    </Row>

                                </div>
                            }


                        </div>

                    )
                }
                <Modal isOpen={this.state.isInfoModalOpen}>
                    <ModalHeader>
                        <p className="bold purple-text font15">
                            The service provider has been removed from this request.
                        </p>
                    </ModalHeader>
                    <ModalFooter>
                        <Row style={{ width: "100%" }}>
                            <Col xs="12">
                                <Button onClick={this.toggleInfoModal} className="close-button purple-button">
                                    Close
                                </Button>
                            </Col>
                        </Row>

                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.isModelOpen}>
                    <ModalHeader>
                        <p className="bold purple-text font15">
                            <img style={{ width: 25, marginRight: 10 }} src={rejected} /> Reject This Offer
                        </p>
                    </ModalHeader>
                    <ModalBody>
                        <p><b>Please select the reason</b></p>
                        <Row style={{ paddingLeft: 20 }}>
                            <div style={{ width: 230 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.faraway}
                                            onChange={this.handleCheck}
                                            name="faraway"
                                            color="primary"
                                        />
                                    }
                                    label="Provider is far away"
                                />
                            </div>
                            <div style={{ width: 230 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.quality}
                                            onChange={this.handleCheck}
                                            name="quality"
                                            color="primary"
                                        />
                                    }
                                    label="Profile quality not good"
                                /></div>
                            <div style={{ width: 230 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.highprice}
                                            onChange={this.handleCheck}
                                            name="highprice"
                                            color="primary"
                                        />
                                    }
                                    label="Price is too high"
                                /></div>
                            <div style={{ width: 230 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.communication}
                                            onChange={this.handleCheck}
                                            name="communication"
                                            color="primary"
                                        />
                                    }
                                    label="Communication not good"
                                /></div>
                            <div style={{ width: 230 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.other}
                                            onChange={this.handleCheck}
                                            name="other"
                                            color="primary"
                                        />
                                    }
                                    label="I just don't like it"
                                />
                            </div>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <span>Comments (optional)</span>
                        <textarea onChange={this.handleText} className="goodbox" rows="4" maxLength="240">

                        </textarea>
                        <br />
                        <Row style={{ width: "100%" }}>
                            <Col xs="6">
                                <Button onClick={this.rejectQuote} className="close-button purple-button">
                                    SUBMIT
                                </Button>
                            </Col>
                            <Col xs="6">
                                <Button onClick={this.toggleModal} className="close-button">
                                    Cancel
                                </Button>
                            </Col>
                        </Row>

                    </ModalFooter>
                </Modal>
            </React.Fragment>

        )
    }
}

const mapStateToProps = (state) => ({

    selectedPost: state.user.selectedPost

})

const mapDispatchToProps = {

    ...UserActions
}

export default connect(mapStateToProps, mapDispatchToProps)(CandidateCard)
