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
import Timeline from '../../components/Shared/Timeline/CareProviderTimeline';
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
            chatOpen: false,
            selectedOrder: []
        }
        this.onChangeText = this.onChangeText.bind(this);
        this.initializeTimeline = this.initializeTimeline.bind(this)
    }
    componentDidMount() {
        this.props.getProviderCareOrders({ providerId: localStorage.getItem('userId') })
        this.props.getCareServiceDetails({ providerId: localStorage.getItem('userId'), careid: this.props.match.params.careid })
        if (this.props.careOrders) {
            var selectedCareOrder = this.props.careOrders.filter(x => x.careOrderId === this.props.match.params.careOrderId)
            this.setState({
                selectedOrder: selectedCareOrder[0]
            })
        }
        this.initializeTimeline()
    }
    initializeTimeline() {
        if (this.props.match.params.careid && this.props.match.params.careOrderId) {
            var careId = this.props.match.params.careid
            var careOrderId = this.props.match.params.careOrderId
            if (careId && careOrderId) {
                const metadataRef = firebase.database().ref('Care/' + careId + '/Metadata/' + careOrderId);
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

        if (prevProps.careOrders !== this.props.careOrders) {
            var selectedCareOrder = this.props.careOrders.filter(x => x.careOrderId === this.props.match.params.careOrderId)
            this.setState({
                selectedOrder: selectedCareOrder[0]
            })
            console.log('CARE ORDER DETAILS', selectedCareOrder[0]);
        }

        if (prevProps.match.params.careid !== this.props.match.params.careid) {
            this.initializeTimeline()
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

        const { selectedOrder, metadata } = this.state
        const { careServiceDetails } = this.props
        return (
            <React.Fragment>
                <div className="provider-top-bar" style={{ zIndex: 101 }}>
                    <Container>
                        <Row>
                            <Col onClick={() => this.props.history.push(`/provider/orders/${localStorage.getItem('userId')}}`)} xs="2" md='1' className="relative">
                                <Row>
                                    <img src={back} />
                                    <span>Back</span>
                                </Row>
                            </Col>
                            <Col xs='1' md='1'></Col>
                            <Col xs="9" md='10'>
                                <h6 style={{ fontSize: 18 }} className="bold">{selectedOrder && selectedOrder.tblCarePackageByCareId && selectedOrder.tblCarePackageByCareId.careTitle}</h6>
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
                                        this.props.match.params.careOrderId && this.props.match.params.careid && metadata && metadata.orderStatus === 'Confirmed' && (
                                            <Timeline chatId={this.props.match.params.careid} orderId={this.props.match.params.careOrderId} orderDetails={selectedOrder} myRequestDetails={selectedOrder} serviceDetails={careServiceDetails[0]}  {...this.props} />
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

    careOrders: state.request.providerCareOrders,
    careServiceDetails: state.request.careServiceDetails
})

const mapDispatchToProps = {
    ...RequestActions
}

export default connect(mapStateToProps, mapDispatchToProps)(TimeLine)
