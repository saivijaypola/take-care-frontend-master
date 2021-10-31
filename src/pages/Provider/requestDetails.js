import React, { Component } from 'react'
import { connect } from 'react-redux'
import { v4 as uuidv4 } from 'uuid';
import { Link } from "react-router-dom";
import {
    Container, Row, Col, Nav,
    NavItem,
    NavLink, TabContent,
    TabPane,
    Button,
    Modal, Spinner, Input, ModalBody
} from "reactstrap";

import { Launcher } from 'react-chat-window'
import classnames from 'classnames';

import chat from "../../images/icon/chat.svg";
import right from "../../images/icon/chev-right-white.svg";

import { ProfileAction, RequestActions } from '../../redux/actions';
import Chatbox from '../../components/Shared/Chat/Chatbox';
import Timeline from '../../components/Shared/Timeline/providertimeline'
import ChatDrawer from '../../components/Shared/Chat/ChatDrawer';
import ChatButton from '../../components/Shared/Chat/ChatButton';
import RequestDetail from '../Request/RequestMain';
import SendQuote from '../Request/SendQuote';
import firebase from "firebase";


class RequestDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: "1",
            isAlertVisible: false,
            chatId: '',
            chatData: '',
            modalTitle: '',
            modalDesc: '',
            isModalVisible: false,
            isRequestLoaded: false,
            isOrderCreated: false,
            metadata: null,
            chatOpen: false,
            isValidateVisible: false
        }
        this.toggle = this.toggle.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.initializeTimeline = this.initializeTimeline.bind(this)
        this.onClickOk = this.onClickOk.bind(this)
    }
    componentDidMount() {
        window.scrollTo(0, 0)
        if (localStorage.getItem('userId')) {
            if (this.props.location.pathname.includes("chat")) {
                this.setState({
                    chatOpen: true
                })
            }
            this.props.getRequestDetails({
                requestId: this.props.match.params.requestid
            })
            // this.props.getChat({
            //     requestId: this.props.match.params.requestid,
            //     providerid: localStorage.getItem('userId'),
            //     userid: this.props.match.params.userId
            // })

            this.props.enableChat({
                chatid: uuidv4(),
                requestId: this.props.match.params.requestid,
                userid: this.props.match.params.userId,
                providerid: localStorage.getItem('userId'),
                isactive: true
            })
            this.initializeTimeline()
            this.props.getServiceDetails({
                requestid: this.props.match.params.requestid, providerid: localStorage.getItem('userId')
            })
        }
    }
    onClickOk() {
        this.setState({
            isValidateVisible: false
        })
        this.props.history.push("/provider/profile")
    }
    initializeTimeline() {
        if (this.props.chatId) {
            const { chatId } = this.props
            if (chatId) {
                const metadataRef = firebase.database().ref(chatId + '/Metadata');
                metadataRef.on('value', snapshot => {
                    const getMetadata = snapshot.val();

                    this.setState({
                        metadata: getMetadata
                    })
                })
            }
        }
    }
    componentDidUpdate(prevProps) {
        const { chatId, serviceDetails, chatData, isChatLoading, requestDetails, isRequestDetailsLoading } = this.props

        if (prevProps.requestDetails !== requestDetails && isRequestDetailsLoading !== prevProps.isRequestDetailsLoading) {
            this.setState({
                isRequestLoaded: true
            }, () => {

            })

        }
        if (prevProps.serviceDetails !== serviceDetails && serviceDetails) {
            if (serviceDetails.orderStatus == "Confirmed") {
                this.setState({
                    editing: false
                })
                this.props.getOrderDetails({ serviceorderid: serviceDetails && serviceDetails.serviceOrderId })
                this.toggle('2')

            }
        }

        if (chatId !== prevProps.chatId) {
            if (chatId) {
                this.initializeTimeline()
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
    respond() {
        if (this.props.userDetails && this.props.userDetails.avatarUrl !== "" && this.props.userDetails.phoneNumber !== null && this.props.userDetails.tblEducationsByUserId.nodes.length > 0 && this.props.userDetails.tblDocumentUploadsByUserId.nodes.length > 1) {
            if (this.props.requestDetails.isCareSubscription) {
                this.props.history.push("/send-care-quote/" + this.props.match.params.requestid + "/" + this.props.match.params.userId)
            } else {
                this.props.history.push("/send-quote/" + this.props.match.params.requestid + "/" + this.props.match.params.userId)
            }
        } else {
            this.setState({
                isValidateVisible: true
            })
        }

        // if ((this.props.userDetails && this.props.userDetails.spiffy && this.props.userDetails.spiffy[0] == 0) || (this.props.userDetails && this.props.userDetails.spiffy == null)) {
        //     this.setState({
        //         modalDescription: "update profile (dp + education / employment ) before proceeding",
        //         isModalVisible: true
        //     })
        // } else if (this.props.userDetails && this.props.userDetails.avatarUrl == "") {
        //     this.setState({
        //         modalDescription: "Profile picture not present: Update dp before proceeding.",
        //         isModalVisible: true
        //     })
        // } else {
        //     this.props.history.push("/send-quote/" + this.props.match.params.requestid + "/" + this.props.match.params.userId)
        // }

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
            userid: this.props.match.params.userId,
            providerid: localStorage.getItem('userId'),
            isactive: true
        })
    }

    render() {
        const { chatData, chatId, serviceDetails, requestDetails, orderDetails } = this.props
        console.log('PROPS', this.props.serviceDetails)
        const documentsVerified = this.props.userDetails && this.props.userDetails.tblDocumentUploadsByUserId && this.props.userDetails.tblDocumentUploadsByUserId.nodes.filter(d => d.isVerified === true);
        return (
            <React.Fragment>

                <section className="section mt-60 padd50">
                    <Container className="mt-lg-3">
                        <Row>
                            <Col lg="12">
                                <div className="requests-container">

                                    <Row>
                                        <Col md="6">
                                            <Nav pills className="nav-justified vertipadd">

                                                <NavItem>
                                                    <NavLink
                                                        className={classnames({ active: this.state.activeTab === '1' }) + ""}
                                                        onClick={() => { this.toggle('1'); }}
                                                    >
                                                        <div className="text-center pt-1 pb-1">
                                                            <p style={{ color: this.state.activeTab === '1' && '#fff' }} className="font16 title font-weight-normal mb-0">Details</p>
                                                        </div>
                                                    </NavLink>
                                                </NavItem>
                                                {
                                                    serviceDetails === null ?
                                                        ""
                                                        :
                                                        <NavItem>
                                                            <NavLink
                                                                className={classnames({ active: this.state.activeTab === '2' }) + " rounded"}
                                                                onClick={() => { this.toggle('2'); }}
                                                            >
                                                                <div className="text-center pt-1 pb-1">

                                                                    {
                                                                        serviceDetails && serviceDetails.orderStatus === 'Confirmed' ?
                                                                            <p style={{ color: this.state.activeTab === '2' && '#fff' }} className="font16 title font-weight-normal mb-0">Order</p>
                                                                            :
                                                                            <p style={{ color: this.state.activeTab === '2' && '#fff' }} className="font16 title font-weight-normal mb-0">Quote</p>
                                                                    }

                                                                </div>
                                                            </NavLink>
                                                        </NavItem>
                                                }

                                                <div className="mobile-show chat-sec">
                                                    {
                                                        this.props && this.props.chatId && (
                                                            <ChatDrawer key={"chatProvider"} chatOpen={this.state.chatOpen} chatId={this.props.chatId} {...this.props} />
                                                        )
                                                    }
                                                </div>


                                            </Nav>

                                            <TabContent activeTab={this.state.activeTab}>
                                                <TabPane tabId="1" className="p-3">
                                                    {/* <h6 className="font-title">Click on <b>'Quote'</b> tab to view / edit your quote.</h6> */}
                                                    <RequestDetail {...this.props} />
                                                    {
                                                        serviceDetails === null ? (
                                                            <div style={{ textAlign: "center" }}>
                                                                <Button onClick={() => { this.respond(); }} className="post-request post-quote">Respond
                                                            <img style={{ padding: 4 }} src={right}></img>
                                                                </Button>
                                                            </div>
                                                        ) :

                                                            <ChatButton key={"chatProvider"} chatId={this.props.chatId} {...this.props} />
                                                    }
                                                </TabPane>
                                                <TabPane tabId="2" className="p-3">
                                                    {
                                                        orderDetails && requestDetails && serviceDetails && this.state.metadata && chatId && this.state.metadata && this.state.metadata.orderStatus === 'Confirmed' ? (
                                                            // <Timeline chatId={chatId} orderDetails={orderDetails} myRequestDetails={requestDetails} serviceDetails={serviceDetails}  {...this.props} />
                                                            <div>
                                                                <p className="bold font20 text-center" style={{ paddingBottom: 10 }}>Order Summary</p>
                                                                <Row>
                                                                    <Col xs>
                                                                        <h6 className="bold font-title">Advance Amount : </h6>
                                                                    </Col>
                                                                    <Col xs>
                                                                        <h6 className="bold font-title">Rs. {serviceDetails.advanceAmount}</h6>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col>
                                                                        <h6 className="bold font-title">Service Charge : </h6>
                                                                    </Col>
                                                                    <Col>
                                                                        <h6 className="bold font-title">Rs. {parseFloat(serviceDetails.orderTotalAmount) - parseFloat(serviceDetails.advanceAmount)}</h6>
                                                                    </Col>
                                                                </Row>
                                                                <br /><hr />
                                                                <Row><Col>
                                                                    <h5 className="bolder" style={{ paddingBottom: 10 }}> Total: </h5>
                                                                </Col>
                                                                    <Col>
                                                                        <h5 className="font-title" style={{color:'#f19c00', fontWeight:"bolder"}}>Rs. {serviceDetails.orderTotalAmount}</h5>
                                                                    </Col></Row><br />
                                                                <a onClick={() => this.props.history.push(`/provider/timeline/${this.props.match.params.requestid}/${this.props.match.params.userId}`)} className="hamper-button">Start</a>
                                                            </div>
                                                        ) :
                                                            <SendQuote chatId={chatId} {...this.props}></SendQuote>
                                                    }
                                                </TabPane>
                                            </TabContent>
                                        </Col>
                                        <Col md="6">
                                            {/* <Row>
                                                <Col lg="12">
                                                    <h5 className="pull-right bold mobile-hide"><img style={{ width: 40 }} src={chat}></img> Message</h5>
                                                </Col>
                                            </Row> */}
                                            <Row>
                                                <Col lg="12">
                                                    <div className="mobile-hide">
                                                        {
                                                            this.props && this.props.chatId && (
                                                                <Chatbox key={"web_request_chat"} chatId={this.props.chatId} {...this.props} />
                                                            )
                                                        }
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>
                <Modal isOpen={this.state.isModalVisible}>
                    <ModalBody>
                        <div style={{ textAlign: 'center' }}>
                            <h6 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 1, color: '#861b8d' }}>{this.state.modalTitle}</h6>
                            <p>{this.state.modalDescription}</p>
                            <Button onClick={() => this.setState({ isModalVisible: false, modalMessage: '', modalDescription: '' })}>Close</Button>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.isValidateVisible} role="dialog" autoFocus={true} centered={true}>
                    <ModalBody>
                        <div style={{ padding: 10 }}>
                            <p className="font-title">
                                Please provide all the necessary <b>Personal</b> and <b>Education</b> details {documentsVerified && documentsVerified.length < 2 && (<text>, <b>Photo proof</b> and <b>Address proof</b></text>)} in the <b>Profile</b> section, to respond to the service requests.
                            </p>
                        </div>
                        <Button className="post-request" onClick={this.onClickOk}>Ok</Button>
                    </ModalBody>
                </Modal>
            </React.Fragment>
        )
    }

}
const mapStateToProps = (state) => ({

    serviceDetails: state.request.serviceDetails,
    serviceId: state.request.serviceId,
    requestDetails: state.request.requestDetails,
    isRequestDetailsLoading: state.request.isRequestDetailsLoading,
    isChatCreated: state.request.isChatCreated,
    chatId: state.request.chatId,
    chatData: state.request.chatData,
    isChatLoading: state.request.isChatLoading,
    orderDetails: state.request.orderDetails,
    userDetails: state.profile.userDetails

})

const mapDispatchToProps = {
    ...RequestActions
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestDetails)
