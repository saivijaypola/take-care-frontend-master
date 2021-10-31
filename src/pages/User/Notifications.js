import React, { Component } from 'react'
import { connect } from 'react-redux'
import OwlCarousel from 'react-owl-carousel';
import Switch from '@material-ui/core/Switch';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import EmailIcon from '@material-ui/icons/Email';
import chaticon from '../../images/icon/chat-2.png'
import arrow from '../../images/icon/arrow-point-to-right.png'
import { Link } from "react-router-dom";
import bell from "../../images/icon/bell.svg";
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

export class Notifications extends Component {
    constructor(props) {

        super(props);
        this.state = {

        }
        this.handleChange = this.handleChange.bind(this)
        this.handleNotification = this.handleNotification.bind(this)
    }
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.checked
        })
    }
    handleNotification(notification) {
        var userId = localStorage.getItem("userId")
        var chatId = notification.root
        var notificationRef = firebase.database().ref('usermeta/' + userId + '/notifications/' + notification.id + '/read/');
        notificationRef.set(true)
        if(chatId){
            var notificationRef = firebase.database().ref('usermeta/' + userId + '/notifications/')
            notificationRef.once('value', snapshot => {
                const getNotifications = snapshot.val();
                for (let notif in getNotifications) {
                    var chatRef = getNotifications[notif].chatId
                    if (chatRef == chatId) {
                        var testRef = firebase.database().ref('usermeta/' + userId + '/notifications/' + notif + '/read/');
                        testRef.set(true)
                    }
                }
            })
        }
        this.props.history.push(notification.link)
    }

    componentDidMount() {
        var userId = localStorage.getItem("userId")
        var notificationsRef = firebase.database().ref('usermeta/' + userId + '/notifications');
        notificationsRef.on('value', snapshot => {
            const getNotifications = snapshot.val();
            let ascNotifications = [];
            console.log('GET Notifications', getNotifications)
            for (let notification in getNotifications) {
                ascNotifications.push({
                    id: notification,
                    link: getNotifications[notification].link,
                    uid: getNotifications[notification].uid,
                    message: getNotifications[notification].message,
                    root: getNotifications[notification].chatId,
                    user: getNotifications[notification].user,
                    read: getNotifications[notification].read,
                    date: getNotifications[notification].timestamp
                });
            }
            const notifications = ascNotifications.reverse();;
            this.setState({ notifications });
        });
    }

    componentDidUpdate(prevProps, prevState) {


    }


    render() {

        return (
            <React.Fragment>

                <section className="padd50 purple-backdrop">
                    <Container>
                        <p style={{ color: "purple", fontSize:16, fontWeight:"bold" }}><b>Notifications</b></p>
                        {
                            this.state.notifications && this.state.notifications.length > 0 ? (
                                this.state.notifications && this.state.notifications.map((notification, index) =>
                                    <div className={notification.read !== true ? "notification-container unread" : "notification-container"} onClick={() => this.handleNotification(notification)}>

                                        <Row>
                                            <Col xs="2">
                                                <img src={chaticon} />
                                            </Col>
                                            <Col xs="8">
                                                <p><b>{notification.user}</b> Sent you a message</p>
                                                <p className="single-line font-title">{notification.message}</p>
                                                <span style={{ fontSize: 13 }}>{new Date(notification.date).toDateString()}</span>
                                            </Col>
                                            <Col xs="2">
                                                <img style={{ padding: 5 }} src={arrow} />
                                                {/* <img onClick={() => console.log(notification.link)} style={{ padding: 5 }} src={arrow} /> */}
                                            </Col>
                                        </Row>
                                    </div>))
                                :
                                <div className="zero-notification">


                                    <img src={bell} />
                                    <h6>0 Notifications</h6>
                                </div>
                        }
                    </Container>

                </section>
            </React.Fragment >
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

export default connect(mapStateToProps, mapDispatchToProps)(Notifications)
