import React, { Component } from 'react'
import { connect } from 'react-redux'
import OwlCarousel from 'react-owl-carousel';
import Switch from '@material-ui/core/Switch';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import EmailIcon from '@material-ui/icons/Email';
import { Link } from "react-router-dom";
import {
    Container, Row, Col, Nav,
    NavItem,
    NavLink, TabContent,
    TabPane,
    Modal,
    ModalBody

} from "reactstrap";

import { ProfileAction } from '../../redux/actions';

import classnames from 'classnames';
// import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
// import 'react-html5-camera-photo/build/css/index.css';

import { Button } from '@material-ui/core';
import firebase from "firebase"

export class index extends Component {
    constructor(props) {

        super(props);
        this.state = {
            newRequestWhatsapp: false,
            newMessageWhatsapp: false,
            quoteAcceptWhatsapp: false,
            onApproveWhatsapp: false,
            newRequestEmail: false,
            newMessageEmail: false,
            quoteAcceptEmail: false,
            onApproveEmail: false,
            isOpen: false,
            isErrorOpen: false
        }
        this.updateSettings = this.updateSettings.bind(this)
        this.toggleModal = this.toggleModal.bind(this)
        this.toggleErrorModal = this.toggleErrorModal.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.checked
        })
    }
    toggleModal() {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }
    toggleErrorModal() {
        this.setState({
            isErrorOpen: !this.state.isErrorOpen
        })
    }


    updateSettings() {
        if (this.props.userDetails && !this.props.userDetails.email || this.props.userDetails && !this.props.userDetails.phoneNumber) {
            this.setState({
                isErrorOpen: !this.state.isErrorOpen
            })
        }
        else {
            var notificationSettings = {
                NEW_REQUEST: {
                    whatsapp: this.state.newRequestWhatsapp,
                    email: this.state.newRequestEmail,
                    sms: false,
                    push: false
                },
                NEW_MESSAGE: {
                    whatsapp: this.state.newMessageWhatsapp,
                    email: this.state.newMessageEmail,
                    sms: false,
                    push: false
                },
                QUOTE_ACCEPT: {
                    whatsapp: this.state.quoteAcceptWhatsapp,
                    email: this.state.quoteAcceptEmail,
                    sms: false,
                    push: false
                },
                ON_APPROVED: {
                    whatsapp: this.state.onApproveWhatsapp,
                    email: this.state.onApproveEmail,
                    sms: false,
                    push: false
                }
            };
            var userId = localStorage.getItem("userId")
            const metadataRef = firebase.database().ref('provider/' + userId + '/settings/notifications/data');
            metadataRef.update(notificationSettings)
            this.toggleModal()
        }
    }
    componentDidMount() {
        var userId = localStorage.getItem("userId")
        const metadataRef = firebase.database().ref('provider/' + userId + '/settings/notifications/data');
        metadataRef.on('value', snapshot => {
            const getMetadata = snapshot.val();
            console.log(getMetadata)
            if (getMetadata) {
                this.setState({
                    newRequestWhatsapp: getMetadata.NEW_REQUEST.whatsapp,
                    newMessageWhatsapp: getMetadata.NEW_MESSAGE.whatsapp,
                    quoteAcceptWhatsapp: getMetadata.QUOTE_ACCEPT.whatsapp,
                    onApproveWhatsapp: getMetadata.ON_APPROVED.whatsapp,
                    newRequestEmail: getMetadata.NEW_REQUEST.email,
                    newMessageEmail: getMetadata.NEW_MESSAGE.email,
                    quoteAcceptEmail: getMetadata.QUOTE_ACCEPT.email,
                    onApproveEmail: getMetadata.ON_APPROVED.email,
                })
            }
        })
    }

    componentDidUpdate(prevProps, prevState) {


    }


    render() {

        return (
            <React.Fragment>

                <section style={{ paddingTop: 90 }} className="padd50 purple-backdrop">
                    <Container className="mt-lg-3">
                        <Row>
                            <Col xs="6">
                                <h5 style={{ color: "purple", fontSize:15 }} className="text-center"><b>Notifications</b></h5>
                            </Col>
                            <Col xs="3">
                                <WhatsAppIcon style={{ margin: "0 auto", display: "block" }} />
                            </Col>
                            <Col xs="3">
                                <EmailIcon style={{ margin: "0 auto", display: "block" }} />
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col xs="6">
                                <label className="pull-right" style={{ textAlign: 'right' }}>When a user posts a request near you</label>
                            </Col>
                            <Col xs="3">
                                <Switch name="newRequestWhatsapp" checked={this.state.newRequestWhatsapp} onChange={this.handleChange} />
                            </Col>
                            <Col xs="3">
                                <Switch name="newRequestEmail" checked={this.state.newRequestEmail} onChange={this.handleChange} />
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col xs="6">
                                <label className="pull-right" style={{ textAlign: 'right' }}>When a user messages you</label>
                            </Col>
                            <Col xs="3">
                                <Switch name="newMessageWhatsapp" checked={this.state.newMessageWhatsapp} onChange={this.handleChange} />
                            </Col>
                            <Col xs="3">
                                <Switch name="newMessageEmail" checked={this.state.newMessageEmail} onChange={this.handleChange} />
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col xs="6">
                                <label className="pull-right" style={{ textAlign: 'right' }}>When a user accepts your quote</label>
                            </Col>
                            <Col xs="3">
                                <Switch name="quoteAcceptWhatsapp" checked={this.state.quoteAcceptWhatsapp} onChange={this.handleChange} />
                            </Col>
                            <Col xs="3">
                                <Switch name="quoteAcceptEmail" checked={this.state.quoteAcceptEmail} onChange={this.handleChange} />
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col xs="6">
                                <label className="pull-right" style={{ textAlign: 'right' }}>When user approves service</label>
                            </Col>
                            <Col xs="3">
                                <Switch name="onApproveWhatsapp" checked={this.state.onApproveWhatsapp} onChange={this.handleChange} />
                            </Col>
                            <Col xs="3">
                                <Switch name="onApproveEmail" checked={this.state.onApproveEmail} onChange={this.handleChange} />
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col xs="12">
                                <h6><b>Email : </b>{this.props.userDetails && this.props.userDetails.email}</h6>
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col xs="12">
                                <h6><b>Mobile Number : </b>{this.props.userDetails && this.props.userDetails.phoneNumber}</h6>
                            </Col>
                        </Row>
                        <hr />
                        <Row className="post-request" style={{ width: '80%', borderRadius: '1%' }}>
                            <Button onClick={this.updateSettings} className="post-request">Save</Button>
                        </Row>

                    </Container>
                </section>
                <Modal isOpen={this.state.isOpen} role="dialog" autoFocus={true} centered={true}>
                    <ModalBody>

                        <p className="font20 bold alert-heading" style={{color:"Orange"}}>Success</p>
                        <p>
                            Settings updated successfully
                        </p>
                        <Button onClick={this.toggleModal}>Ok</Button>

                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.isErrorOpen} role="dialog" autoFocus={true} centered={true}>
                    <ModalBody>
                        <p>
                            Please add your phone number and email to your profile first.
                        </p>
                        <Button onClick={this.toggleErrorModal}>Ok</Button>

                    </ModalBody>
                </Modal>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    userDetails: state.profile.userDetails,
    isUserLoad: state.profile.isUserLoad

})

const mapDispatchToProps = {
    ...ProfileAction
}

export default connect(mapStateToProps, mapDispatchToProps)(index)
