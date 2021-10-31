import React, { Component } from 'react'
import { connect } from 'react-redux'
import { v4 as uuidv4 } from 'uuid';
import { Link } from "react-router-dom";
import {
    Container, Row, Col, Nav,
    NavItem,
    NavLink, TabContent,
    TabPane,
    Modal,
    Spinner,
    Button
} from "reactstrap";
import { AvForm, AvField, AvGroup } from 'availity-reactstrap-validation';
import classnames from 'classnames';
import Progressbar from '../../components/Shared/Progressbar';
import Reference from '../../components/Shared/Reference/Reference';
import exclamation from "../../images/icon/exclamation.png";
import user from "../../images/icon/user-7.png";
import hat from "../../images/icon/hat.png";
import back from "../../images/icon/back.png";
import like from "../../images/icon/like.svg";
import dislike from "../../images/icon/dislike.svg";
import likeFilled from "../../images/icon/like-filled.png";
import dislikeFilled from "../../images/icon/dislike-filled.png";
import suitcase from "../../images/icon/suitcase.png";
import { ProfileAction, RequestActions, UserActions } from '../../redux/actions';
import Chatbox from '../../components/Shared/Chat/Chatbox';
import ChatDrawer from '../../components/Shared/Chat/ChatDrawer';
import RequestResponse from '../../components/Shared/Request/RequestResponse';
import UploadAdressProof from '../../components/Shared/DocVerify/UploadAdressProof';
import UploadPhotoProof from '../../components/Shared/PhotoVerify/UploadPhotoProof';
import requestDetails from '../Provider/requestDetails';
import Timeline from '../../components/Shared/Timeline/usertimeline'
import firebase from "firebase"
import _ from "lodash";



export class ProviderDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: "1",
            isAlertVisible: false,
            metaData: null,
            liked: false,
            disliked: false,
            chatOpen: false,
            reactionId: ""
        }
        this.toggle = this.toggle.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.enableChat = this.enableChat.bind(this)
        this.initializeTimeline = this.initializeTimeline.bind(this)
        this.likeProvider = this.likeProvider.bind(this)
        this.unlikeProvider = this.unlikeProvider.bind(this)
    }
    componentDidMount() {
        console.log('PROVIDER DETAILS PAGE');
        var userRef = firebase.database().ref('usermeta/' + this.props.match.params.providerid + '/online');
        userRef.on('value', snapshot => {
            const isOnline = snapshot.val();
            console.log('isOnline', isOnline)
        })

        this.props.getProviderProfileById({
            "id": this.props.match.params.providerid
        })
        if (this.props.location.pathname.includes("chat")) {
            this.setState({
                chatOpen: true
            })
        }


        if (localStorage.getItem('userId')) {
            this.props.getRequestDetails({
                requestId: this.props.match.params.requestid
            })
            this.props.getServiceDetails({
                requestid: this.props.match.params.requestid, providerid: this.props.match.params.providerid
            })

            // this.props.getChat({
            //     requestId: this.props.match.params.requestid,
            //     providerid: this.props.match.params.providerid,
            //     userid: localStorage.getItem('userId')
            // })
            this.enableChat()

        }
        this.initializeTimeline()


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

        var userId = localStorage.getItem('userId')
        var payload = {
            "reaction_id": this.state.reactionId !== "" ? this.state.reactionId : uuidv4(),
            "user_id": userId,
            "provider_id": this.props.match.params.providerid,
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

        var userId = localStorage.getItem('userId')
        var payload = {
            "reaction_id": this.state.reactionId !== "" ? this.state.reactionId : uuidv4(),
            "user_id": userId,
            "provider_id": this.props.match.params.providerid,
            "request_id": this.props.match.params.requestid,
            "is_liked": shouldLike,
            "is_disliked": shouldDislike,
            "is_visible": true
        }
        this.props.addReaction(payload)

    }
    initializeTimeline() {
        if (this.props.chatId) {
            const { chatId } = this.props
            if (chatId) {
                const metadataRef = firebase.database().ref(chatId + '/Metadata');
                metadataRef.on('value', snapshot => {
                    const getMetadata = snapshot.val();
                    console.log("🚀 ~ file: ProviderDetails.js ~ line 160 ~ ProviderDetails ~ initializeTimeline ~ getMetadata", getMetadata)
                    this.setState({
                        metaData: getMetadata
                    })
                })
            }
        }
    }
    componentDidUpdate(prevProps) {
        const { chatData, chatId, isOrderCreated, orderId, serviceDetails, requestDetails } = this.props

        if (prevProps.chatId !== chatId) {
            this.initializeTimeline()
        }
        if (prevProps.serviceDetails !== serviceDetails && serviceDetails) {
            if (serviceDetails.orderStatus == "Confirmed" || serviceDetails.orderStatus == "Pending") {
                this.toggle('3')
            }
            this.props.getOrderDetails({ serviceorderid: serviceDetails && serviceDetails.serviceOrderId })
        }
        if (prevProps.requestDetails !== requestDetails && requestDetails) {
            if (requestDetails.tblUserReactionsByRequestId.nodes && requestDetails.tblUserReactionsByRequestId.nodes.length > 0) {
                var userReactions = requestDetails && requestDetails.tblUserReactionsByRequestId.nodes
                var providerReaction = userReactions.filter((reaction) => reaction.providerId === this.props.match.params.providerid)
                if (providerReaction.length > 0) {
                    console.log('PROVIDER REACTIONS', providerReaction)
                    this.setState({
                        liked: providerReaction[0].isLiked,
                        disliked: providerReaction[0].isDisliked,
                        reactionId: providerReaction[0].reactionId
                    })
                } else {

                }
            }
        }
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }
    onChangeText(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    toggleTrainingModal = () => {
        this.setState(prevState => ({
            trainingModel: !prevState.trainingModel
        }));
    }
    enableChat() {
        this.props.enableChat({
            chatid: uuidv4(),
            requestId: this.props.match.params.requestid,
            userid: localStorage.getItem('userId'),
            providerid: this.props.match.params.providerid,
            isactive: true
        })
    }

    acceptOrder() {
        const { serviceDetails } = this.props
        this.props.history.push(`/user/payment/${this.props.match.params.requestid}/${this.props.match.params.providerid}`)
    }
    render() {
        const { orderDetails, providerDetails, serviceDetails, requestDetails, isRequestDetailsLoading, tblEmploymentsByUserId, chatId } = this.props
        console.log("metadata", this.state.metaData)

        return (
            <React.Fragment>
                <section className="relative">
                    <div className="provider-top-bar">
                        <Container>
                            <Row>
                                <Col onClick={() => {
                                    if (!_.isEmpty(this.state.metaData) && this.state.metaData.orderStatus === "Confirmed") {
                                        this.props.history.push(`/user/orders`)
                                    } else {
                                        this.props.history.goBack();
                                    }
                                }} xs="2" md='1' className="relative">
                                    <Row>
                                        <img src={back} />
                                        <span>Back</span>
                                    </Row>
                                </Col>
                                <Col xs='1' md='1'></Col>
                                <Col xs="9" md='10'>
                                    <h6 style={{ fontSize: 18 }} className="bold">{requestDetails && requestDetails.title}</h6>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                    <Container className="mt-lg-3">
                        <Row>
                            <Col lg="12">
                                <div style={{ marginTop: 40 }} className="requests-container">

                                    <Row>
                                        {/* condition checkin for order is already approved or no */}
                                        {!_.isEmpty(this.state.metaData) && this.state.metaData.orderStatus === "Confirmed" ?
                                            <Col md="12">
                                                <Nav pills className="nav-justified profile-tabs vertipadd">
                                                    <NavItem>
                                                        <NavLink
                                                            className={classnames({ active: this.state.activeTab === '3' }) + " rounded"}
                                                            onClick={() => { this.toggle('3'); }}
                                                        >
                                                            <div className="text-center pt-1 pb-1">
                                                                {serviceDetails && serviceDetails.orderStatus == "Confirmed" ?
                                                                    <p style={{ color: this.state.activeTab === '3' && '#fff' }} className="title font16 font-weight-normal mb-0">ORDER</p>
                                                                    :
                                                                    <p style={{ color: this.state.activeTab === '3' && '#fff' }} className="title font16 font-weight-normal mb-0">OFFER</p>
                                                                }

                                                            </div>
                                                        </NavLink>
                                                    </NavItem>
                                                </Nav>
                                                <TabContent activeTab={this.state.activeTab}>
                                                    <TabPane tabId="3" className="p-3">
                                                        <Row>
                                                            <Col xs="12">
                                                                {serviceDetails && requestDetails && orderDetails && this.state.metaData && this.state.metaData.orderStatus === 'Confirmed' && chatId && (
                                                                    <Timeline myRequestDetails={requestDetails} orderDetails={orderDetails} serviceDetails={serviceDetails} {...this.props} chatId={chatId} />
                                                                )
                                                                }
                                                            </Col>
                                                        </Row>
                                                    </TabPane>
                                                </TabContent>

                                            </Col>
                                            :
                                            <>
                                                <Col md="6">


                                                    <div>
                                                        <br /><br />
                                                        {
                                                            providerDetails && requestDetails && requestDetails !== null && providerDetails !== null ? (
                                                                <RequestResponse data={providerDetails} myRequestDetails={requestDetails && requestDetails} />
                                                            ) : ''
                                                        }
                                                    </div>
                                                    <div className="like-float">
                                                        <Row>
                                                            <Col xs="4" onClick={this.likeProvider} className="right-bar">
                                                                {
                                                                    this.state.liked ?
                                                                        <img src={likeFilled} />
                                                                        :
                                                                        <img src={like} />
                                                                }

                                                            </Col>
                                                            <Col xs="4" onClick={this.unlikeProvider} className="right-bar">

                                                                {
                                                                    this.state.disliked ?
                                                                        <img className="" src={dislikeFilled} />
                                                                        :
                                                                        <img className="dislike" src={dislike} />
                                                                }
                                                            </Col>
                                                            <Col xs="4">
                                                                {
                                                                    this.props && this.props.chatId && (
                                                                        <ChatDrawer towhom={providerDetails && providerDetails} chatId={this.props.chatId} chatOpen={this.state.chatOpen}   {...this.props} />
                                                                    )
                                                                }
                                                            </Col>
                                                        </Row>
                                                    </div>


                                                    <Nav pills className="nav-justified profile-tabs vertipadd">
                                                        <NavItem>
                                                            <NavLink
                                                                className={classnames({ active: this.state.activeTab === '1' }) + ""}
                                                                onClick={() => { this.toggle('1'); }}
                                                            >
                                                                <div className="text-center pt-1 pb-1">
                                                                    <p style={{ color: this.state.activeTab === '1' && '#fff' }} className="title font16 font-weight-normal mb-0">ABOUT</p>
                                                                </div>
                                                            </NavLink>
                                                        </NavItem>
                                                        <NavItem>
                                                            <NavLink
                                                                className={classnames({ active: this.state.activeTab === '2' }) + " rounded"}
                                                                onClick={() => { this.toggle('2'); }}
                                                            >
                                                                <div className="text-center pt-1 pb-1">
                                                                    <p style={{ color: this.state.activeTab === '2' && '#fff' }} className="title font16 font-weight-normal mb-0">RECOMMENDATIONS</p>
                                                                </div>
                                                            </NavLink>
                                                        </NavItem>
                                                        <NavItem>
                                                            <NavLink
                                                                className={classnames({ active: this.state.activeTab === '3' }) + " rounded"}
                                                                onClick={() => { this.toggle('3'); }}
                                                            >
                                                                <div className="text-center pt-1 pb-1">
                                                                    {serviceDetails && serviceDetails.orderStatus == "Confirmed" ?
                                                                        <p style={{ color: this.state.activeTab === '3' && '#fff' }} className="title font16 font-weight-normal mb-0">ORDER</p>
                                                                        :
                                                                        <p style={{ color: this.state.activeTab === '3' && '#fff' }} className="title font16 font-weight-normal mb-0">OFFER</p>
                                                                    }

                                                                </div>
                                                            </NavLink>
                                                        </NavItem>
                                                        {/* <div className="mobile-show">
                                                    {
                                                        this.props && this.props.chatId && (
                                                            <ChatDrawer towhom={providerDetails && providerDetails} chatId={this.props.chatId} chatOpen={this.state.chatOpen}   {...this.props} />
                                                        )
                                                    }
                                                </div> */}
                                                    </Nav>
                                                    <TabContent activeTab={this.state.activeTab}>

                                                        <TabPane tabId="1" className="p-3">
                                                            {
                                                                providerDetails && (
                                                                    <div>
                                                                        <p style={{ fontSize: 14, lineHeight: 1.29 }} className="font-title">{providerDetails.aboutme}</p>
                                                                        {
                                                                            providerDetails.tblEducationsByUserId && providerDetails.tblEducationsByUserId.nodes && providerDetails.tblEducationsByUserId.nodes.length > 0 ?
                                                                                (< div >
                                                                                    <p className="bold font14 profile-sections">
                                                                                        <img src={hat}></img>Education</p>
                                                                                    {providerDetails.tblEducationsByUserId.nodes && providerDetails.tblEducationsByUserId.nodes.map((edu, index) =>
                                                                                        <div className="provider-profile-card">
                                                                                            <Row>
                                                                                                <Col md="12">
                                                                                                    <p className="font14">{edu.degreeTitle} - {edu.fromYear} - {edu.toYear}</p>
                                                                                                    <p style={{ marginBottom: 3 }} className="font-title">{edu.college}</p>
                                                                                                </Col>
                                                                                            </Row>
                                                                                        </div>
                                                                                    )}
                                                                                </div>)
                                                                                :
                                                                                <div >
                                                                                    <p className="bold font14 profile-sections">
                                                                                        <img src={hat}></img>Education</p>
                                                                                    <p className="font-title">Education details not entered by provider</p>
                                                                                </div>
                                                                        }
                                                                        {
                                                                            providerDetails.tblEmploymentsByUserId.nodes.length > 0 ?
                                                                                (< div >
                                                                                    <p className="bold font14 profile-sections">
                                                                                        <img src={suitcase}></img>
                                                                                        Employment</p>
                                                                                    {tblEmploymentsByUserId && tblEmploymentsByUserId.nodes && tblEmploymentsByUserId.nodes.length > 0 && tblEmploymentsByUserId.nodes.map((emp, index) =>
                                                                                        <div className="provider-profile-card">
                                                                                            <Row>
                                                                                                <Col md="12">
                                                                                                    <p className="font14"> {emp.jobTitle} @ {emp.companyName} </p>
                                                                                                    <span className="font-title">{emp.fromYear} - {emp.toYear}</span>
                                                                                                </Col>
                                                                                            </Row>
                                                                                        </div>
                                                                                    )}
                                                                                </div>)
                                                                                :
                                                                                <div >
                                                                                    <p className="bold font14 profile-sections">
                                                                                        <img src={suitcase}></img>Employment</p>
                                                                                    <p className="font-title">Employment details not entered by provider</p>
                                                                                </div>
                                                                        }
                                                                        {
                                                                            providerDetails.tblTrainingsByUserId.nodes.length > 0 ?
                                                                                (< div >
                                                                                    < h5 className="bold profile-sections">
                                                                                        <img src={suitcase}></img>
                                                                                        Training</h5>
                                                                                    {providerDetails.tblTrainingsByUserId.nodes.map((edu, index) =>
                                                                                        <div className="provider-profile-card">
                                                                                            <Row>
                                                                                                <Col md="12">
                                                                                                    <p className="font14"> {edu.title} from {edu.issuingAuthority} </p>
                                                                                                    <p>{edu.description}</p>
                                                                                                    <span className="font-title">{edu.year}</span>
                                                                                                </Col>
                                                                                            </Row>

                                                                                        </div>
                                                                                    )}
                                                                                </div>)
                                                                                :
                                                                                <div >
                                                                                    <p className="bold font14 profile-sections">
                                                                                        <img src={suitcase}></img>Training</p>
                                                                                    <p className="font-title">No specific training or certification entered by provider</p>
                                                                                </div>
                                                                        }
                                                                    </div>
                                                                )
                                                            }
                                                        </TabPane>
                                                        <TabPane tabId="2" className="p-3">
                                                            {
                                                                providerDetails && (
                                                                    providerDetails.tblRecommendationsByUserId.nodes.map((recommend, index) =>

                                                                        recommend.isCommentPublic && <Reference recommend={recommend}></Reference>

                                                                    )
                                                                )}
                                                        </TabPane>
                                                        <TabPane tabId="3" className="p-3">
                                                            <Row>
                                                                <Col xs="12">
                                                                    {
                                                                        serviceDetails && !this.state.metaData ? (
                                                                            <div>
                                                                                {
                                                                                    serviceDetails.providerComments &&
                                                                                    <div>
                                                                                        <span style={{ fontSize: 14 }}>Provider Comments</span>
                                                                                        <p style={{ fontSize: 14 }} className="font-title">
                                                                                            {serviceDetails.providerComments}
                                                                                        </p>
                                                                                    </div>
                                                                                }<br />
                                                                                {
                                                                                    serviceDetails.phoneNumber &&
                                                                                    <div>
                                                                                        <span style={{ fontSize: 14 }}>Contact Number: </span>
                                                                                        <p style={{ fontSize: 14 }} className="font-title">
                                                                                            {serviceDetails.countryCode} {serviceDetails.phoneNumber}
                                                                                        </p>
                                                                                    </div>
                                                                                }<br />
                                                                                {
                                                                                    serviceDetails.serviceNeededOn &&
                                                                                    <div>
                                                                                        <span style={{ fontSize: 14 }}>Service will be provided on: </span>
                                                                                        <p style={{ fontSize: 14 }} className="font-title">
                                                                                            {new Date(serviceDetails.serviceNeededOn).toString()}
                                                                                        </p>
                                                                                    </div>
                                                                                }<br /> 

                                                                                <table className="table request-table">
                                                                                    <tr>
                                                                                        <td><span className="bold">Advance</span></td>
                                                                                        <td><span className="bold">Rs {parseFloat(serviceDetails.advanceAmount).toFixed(2)}</span></td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td><span className="bold">Payable on completion</span></td>
                                                                                        <td><span className="bold">Rs {(parseFloat(serviceDetails.orderTotalAmount).toFixed(2) - parseFloat(serviceDetails.advanceAmount)).toFixed(2)}</span></td>
                                                                                    </tr>
                                                                                    <tr className="border-top">
                                                                                        <td><span style={{ fontSize: 21 }} className="bold">Total</span></td>
                                                                                        <td><span style={{ fontSize: 21, color: '#ff8a00' }} className="bold">Rs {parseFloat(serviceDetails.orderTotalAmount).toFixed(2)}</span></td>
                                                                                    </tr>
                                                                                </table>
                                                                                {/* <Button onClick={() => this.createOrder()} style={{ marginTop: "20px !important" }} className="details-button accept-pay">Accept & Pay</Button> */}
                                                                                <Button onClick={() => this.acceptOrder()} style={{ marginTop: "20px !important" }} className="details-button accept-pay">Accept & Pay</Button>
                                                                                {/* <p style={{ textAlign: "center", fontSize: "14", marginTop: 15 }} className="font-title">You will have to pay the full amount now</p> */}
                                                                            </div>
                                                                        ) : serviceDetails && requestDetails && orderDetails && this.state.metaData && this.state.metaData.orderStatus === 'Confirmed' && chatId ? (
                                                                            <Timeline myRequestDetails={requestDetails} orderDetails={orderDetails} serviceDetails={serviceDetails} {...this.props} chatId={chatId} />
                                                                        ) :
                                                                            <div className="no-response">
                                                                                <img src={exclamation}></img>
                                                                                <span className="block"> <b>No quotes from the provider yet. </b></span>
                                                                                <span className="block font-title">If you wish, please initiate a chat.</span>
                                                                            </div>
                                                                    }

                                                                </Col>
                                                            </Row>
                                                        </TabPane>
                                                    </TabContent>
                                                </Col>


                                                <Col md="6">
                                                    <Row className="sticky">
                                                        <Col lg="12">
                                                            <div className="mobile-hide">

                                                                {
                                                                    this.props && this.props.chatId && (
                                                                        <Chatbox towhom={providerDetails && providerDetails} chatId={this.props.chatId}  {...this.props} />
                                                                    )
                                                                }
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </>
                                        }

                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>
                {
                    isRequestDetailsLoading && (
                        <Modal className="spinner-modal" isOpen={true}>
                            <Spinner style={{ margin: "10px auto" }} animation="border" />
                        </Modal>
                    )
                }

            </React.Fragment >
        )
    }
}

const mapStateToProps = (state) => ({

    serviceDetails: state.request.serviceDetails,
    providerDetails: state.request.providerDetails,
    tblEmploymentsByUserId: state.request.providerDetails && state.request.providerDetails.tblEmploymentsByUserId && state.request.providerDetails.tblEmploymentsByUserId,
    serviceId: state.request.serviceId,
    requestDetails: state.request.requestDetails && state.request.requestDetails,
    isRequestDetailsLoading: state.request.isRequestDetailsLoading,
    isChatCreated: state.request.isChatCreated,
    chatId: state.request.chatId,
    chatData: state.request.chatData,
    isChatLoading: state.request.isChatLoading,
    isOrderCreated: state.request.isOrderCreated,
    orderId: state.request.orderId,
    orderDetails: state.request.orderDetails
})

const mapDispatchToProps = {
    ...RequestActions,
    ...UserActions
}

export default connect(mapStateToProps, mapDispatchToProps)(ProviderDetails)
