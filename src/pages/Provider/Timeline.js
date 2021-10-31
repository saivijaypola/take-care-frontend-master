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
import back from "../../images/icon/back.png";
import ChatDrawer from '../../components/Shared/Chat/ChatDrawer';
import ChatButton from '../../components/Shared/Chat/ChatButton';
import RequestDetail from '../Request/RequestMain';
import SendQuote from '../Request/SendQuote';
import firebase from "firebase"

class TimeLine extends Component {
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
            chatOpen: false
        }
        this.onChangeText = this.onChangeText.bind(this);
        this.initializeTimeline = this.initializeTimeline.bind(this)
    }
    componentDidMount() {
        if (localStorage.getItem('userId')) {

            this.props.getRequestDetails({
                requestId: this.props.match.params.requestid
            })
            //this.initializeTimeline()
            this.props.getServiceDetails({
                requestid: this.props.match.params.requestid, providerid: localStorage.getItem('userId')
            })
            this.props.getChat({
                requestid: this.props.match.params.requestid,
                userid: this.props.match.params.userId,
                providerid: localStorage.getItem('userId'),
            })
        }
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
        if (prevProps.chatId !== chatId) {
            this.initializeTimeline()
        }
        if (prevProps.serviceDetails !== serviceDetails && serviceDetails) {
            if (serviceDetails.orderStatus == "Confirmed") {

                this.props.getOrderDetails({ serviceorderid: serviceDetails && serviceDetails.serviceOrderId })

            }
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

    render() {

        const { chatData, chatId, serviceDetails, requestDetails, orderDetails } = this.props
        console.log('TIMELINE', chatId)
        return (
            <React.Fragment>
                <div className="provider-top-bar" style={{ zIndex: 101 }}>
                    <Container>
                        <Row>
                            <Col onClick={() => this.props.history.push(`/provider/request-details/${this.props.match.params.requestid}/${this.props.match.params.userId}`)} xs="2" md='1' className="relative">
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
                <section className="section padd50" style={{ marginTop: 127 }}>
                    <Container className="mt-lg-3">
                        <Row>
                            <Col lg="12">
                                <div style={{ padding: "0 15px" }}>
                                    {
                                        orderDetails && requestDetails && serviceDetails && this.state.metadata && chatId && this.state.metadata && this.state.metadata.orderStatus === 'Confirmed' && (
                                            <Timeline chatId={chatId} orderDetails={orderDetails} myRequestDetails={requestDetails} serviceDetails={serviceDetails}  {...this.props} />
                                        )
                                    }
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

export default connect(mapStateToProps, mapDispatchToProps)(TimeLine)
