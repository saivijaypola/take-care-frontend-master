import React, { Component } from 'react'
import {
    Container, Row, Col, Nav,
    NavItem,
    NavLink, TabContent,
    TabPane
} from "reactstrap";
import { connect } from 'react-redux'
import profile from "../../../assets/images/client/05.jpg";
import send from "../../../images/icon/send-2.png";
import ChatOther from "./ChatOther"
import ChatMe from "./ChatMe"
import firebase from "firebase"
import { ProfileAction, UserActions, RequestActions } from "../../../redux/actions";
import { animateScroll } from "react-scroll";
import chat_icon from "../../../images/icon/whatsapp.png";
import { getUser } from '../../../handler/authenticate';
import { usePageVisibility } from 'react-page-visibility';


export class Chatbox extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user: {},
            chats: [],
            chatId: '',
            serviceOrderId: '',
            content: '',
            readError: null,
            writeError: null,
            myId: ''
        }
    }
    // scrollToBottom() {
    //     animateScroll.scrollToBottom({
    //         containerId: 'fakediv'
    //     });
    // }
    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    componentWillUnmount() {
        const { chatId, userDetails } = this.props
        var userId = localStorage.getItem('userId')
        const lastSeen = firebase.database().ref(chatId + '/userStatus/' + userId + '/LastSeen');
        const activeRef = firebase.database().ref(chatId + '/userStatus/' + userId + '/isActive');
        lastSeen.set(new Date().getTime());
        activeRef.set(false)
        var role = localStorage.getItem('role')
        if (role === 'user') {
            const chatactiveRef = firebase.database().ref(chatId + '/userStatus/' + this.props.towhom && this.props.towhom.userId && this.props.towhom.userId + '/isActive');
            chatactiveRef.on('value', snapshot => {
                const isActive = snapshot.val();
                // console.log('isActive', isActive)
                var toastRef = firebase.database().ref('usermeta/' + this.props.towhom && this.props.towhom.userId + '/toast');
                toastRef.set(false)
            })
        } else {
            var userId = this.props.requestDetails && this.props.requestDetails.tblUserByUserId && this.props.requestDetails.tblUserByUserId.userId && this.props.requestDetails.tblUserByUserId.userId
            const chatactiveRef = firebase.database().ref(chatId + '/userStatus/' + userId + '/isActive');
            chatactiveRef.on('value', snapshot => {
                const isActive = snapshot.val();
                // console.log('isActive', isActive)
                var toastRef = firebase.database().ref('usermeta/' + userId + '/toast');
                toastRef.set(false)
            })
        }
    }
    componentDidMount() {
        this.scrollToBottom();
        const { chatId, userDetails } = this.props
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({ user });
            }
        })
        var amOnline = firebase.database().ref('.info/connected');
        var userId = localStorage.getItem('userId')
        if (chatId) {
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
        const lastSeen = firebase.database().ref(chatId + '/userStatus/' + userId + '/LastSeen');
        const activeRef = firebase.database().ref(chatId + '/userStatus/' + userId + '/isActive');
        amOnline.on('value', function (snapshot) {
            if (snapshot.val()) {
                lastSeen.onDisconnect().set(new Date().getTime());
                activeRef.onDisconnect().set(false)
            }
        });
        activeRef.set(true)
        const chatRef = firebase.database().ref(chatId);
        var unreadRef = firebase.database().ref(chatId + '/userStatus/' + userId + '/unread');
        unreadRef.set(false)
        chatRef.on('value', snapshot => {
            const getChats = snapshot.val();
            let ascChats = [];
            // console.log('GET CHATS', getChats)
            for (let chat in getChats) {
                if (chat !== "Metadata" && chat !== "userStatus") {
                    ascChats.push({
                        id: chat,
                        uid: getChats[chat].uid,
                        message: getChats[chat].message,
                        user: getChats[chat].user,
                        date: getChats[chat].timestamp
                    });
                }
            }
            const chats = ascChats;
            this.setState({ chats });
        });



    }
    componentDidUpdate() {
        this.scrollToBottom();
    }
    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }
    handleSubmit = e => {
        this.scrollToBottom();
        if (this.state.message !== '') {
            const { chatId, requestDetails } = this.props
            e.preventDefault();
            if (this.state.message !== '') {
                const chatRef = firebase.database().ref(chatId);
                if (this.state.chats.length == 0) {
                    // alert("this is the first message")
                    var role = localStorage.getItem('role')
                    if (role === 'provider') {
                        this.props.initiateChat({ chatId: chatId, chatInfo: { chatInititated: true } })
                    }
                }
                const chat = {
                    message: this.state.message,
                    user: this.props.userDetails && this.props.userDetails.fullname,
                    uid: this.state.user.uid,
                    timestamp: new Date().getTime()
                }
                chatRef.push(chat);
                var role = localStorage.getItem('role')
                if (role === 'user') {
                    var userOnlineRef = firebase.database().ref('usermeta/' + this.props.towhom.userId + '/visible');
                    var notifications = firebase.database().ref('usermeta/' + this.props.towhom.userId + '/notifications');
                    // console.log("children",userOnlineRef.child)
                    userOnlineRef.once('value', snapshot => {
                        const isOnline = snapshot.val();
                        // console.log('isOnline', isOnline)
                        var notification = chat
                        notification.type = "chat"
                        notification.chatId = chatId
                        notification.read = false
                        var userId = this.props.requestDetails && this.props.requestDetails.tblUserByUserId && this.props.requestDetails.tblUserByUserId.userId && this.props.requestDetails.tblUserByUserId.userId
                        notification.link = '/provider/request-details/' + requestDetails.requestId + '/' + userId + '/chat'
                        notifications.push(notification)
                        if (!isOnline) {
                            const unreadRef = firebase.database().ref(chatId + '/userStatus/' + this.props.towhom.userId + '/unread');
                            unreadRef.once('value', snapshot => {
                                const isUnread = snapshot.val();
                                // console.log('isUnread', isUnread)
                                if (isUnread !== true) {
                                    var countryCode = this.props.towhom && this.props.towhom.countryCode && this.props.towhom.countryCode.substring(1)
                                    if (countryCode == null) {
                                        countryCode = "91"
                                    }
                                    var phoneNumber = this.props.towhom && this.props.towhom.phoneNumber && this.props.towhom.phoneNumber.substr(this.props.towhom.phoneNumber.length - 10)
                                    var payload = {
                                        "role": role,
                                        "userName": requestDetails && requestDetails.tblUserByUserId && requestDetails.tblUserByUserId.fullname && requestDetails.tblUserByUserId.fullname,
                                        "userEmail": requestDetails && requestDetails.tblUserByUserId && requestDetails.tblUserByUserId.email && requestDetails.tblUserByUserId.email,
                                        "recepientId": this.props.towhom && this.props.towhom.userId && this.props.towhom.userId,
                                        "phoneNumber": countryCode + "" + phoneNumber,
                                        "requestTitle": requestDetails && requestDetails.title,
                                        "recepientName": this.props.towhom && this.props.towhom.fullname && this.props.towhom.fullname,
                                        "recepientEmail": this.props.towhom && this.props.towhom.email && this.props.towhom.email
                                    }
                                    this.props.sendChatNotification(payload)
                                    unreadRef.set(true)
                                }
                            })

                        } else {
                            const chatactiveRef = firebase.database().ref(chatId + '/userStatus/' + this.props.towhom.userId + '/isActive');
                            chatactiveRef.once('value', snapshot => {
                                const isActive = snapshot.val();
                                //console.log('isActive', isActive)
                                var toastRef = firebase.database().ref('usermeta/' + this.props.towhom.userId + '/toast');
                                if (isActive !== true) {
                                    var userId = this.props.requestDetails && this.props.requestDetails.tblUserByUserId && this.props.requestDetails.tblUserByUserId.userId && this.props.requestDetails.tblUserByUserId.userId
                                    chat.link = '/provider/request-details/' + requestDetails.requestId + '/' + userId + '/chat'
                                    toastRef.set(chat)
                                }
                            })
                            // toastRef.set(false)
                        }
                    })
                } else {
                    var userId = this.props.requestDetails && this.props.requestDetails.tblUserByUserId && this.props.requestDetails.tblUserByUserId.userId && this.props.requestDetails.tblUserByUserId.userId
                    var userOnlineRef = firebase.database().ref('usermeta/' + userId + '/visible');
                    var notifications = firebase.database().ref('usermeta/' + userId + '/notifications');
                    // console.log("children",userOnlineRef.child)
                    userOnlineRef.once('value', snapshot => {
                        const isOnline = snapshot.val();
                        //console.log('isOnline', isOnline)
                        var providerId = localStorage.getItem('userId')
                        var notification = chat
                        notification.read = false
                        notification.chatId = chatId
                        notification.type = "chat"
                        notification.link = '/provider-details/' + requestDetails.requestId + '/' + providerId + '/chat'
                        notifications.push(notification)
                        if (isOnline !== true) {
                            // add code to sent notification        
                            const unreadRef = firebase.database().ref(chatId + '/userStatus/' + userId + '/unread');
                            unreadRef.once('value', snapshot => {
                                const isUnread = snapshot.val();
                                //console.log('isUnread', isUnread)
                                if (isUnread !== true) {
                                    var providerName = localStorage.getItem('fullName')
                                    var providerEmail = getUser().email
                                    var countryCode = requestDetails && requestDetails.tblUserByUserId && requestDetails.tblUserByUserId.countryCode && requestDetails.tblUserByUserId.countryCode.substring(1)
                                    var phoneNumber = requestDetails && requestDetails.tblUserByUserId && requestDetails.tblUserByUserId.phoneNumber && requestDetails.tblUserByUserId.phoneNumber.substr(requestDetails.tblUserByUserId.phoneNumber.length - 10)
                                    var payload = {
                                        "role": role,
                                        "userName": providerName,
                                        "userEmail": providerEmail,
                                        "recepientId": requestDetails && requestDetails.tblUserByUserId && requestDetails.tblUserByUserId.userId && requestDetails.tblUserByUserId.userId,
                                        "phoneNumber": countryCode + "" + phoneNumber,
                                        "requestTitle": requestDetails && requestDetails.title,
                                        "recepientName": requestDetails && requestDetails.tblUserByUserId && requestDetails.tblUserByUserId.fullname && requestDetails.tblUserByUserId.fullname,
                                        "recepientEmail": requestDetails && requestDetails.tblUserByUserId && requestDetails.tblUserByUserId.email && requestDetails.tblUserByUserId.email,
                                    }
                                    this.props.sendChatNotification(payload)
                                    unreadRef.set(true)
                                }
                            })

                        } else {
                            // alert(userId)
                            const chatactiveRef = firebase.database().ref(chatId + '/userStatus/' + userId + '/isActive');
                            chatactiveRef.once('value', snapshot => {
                                const isActive = snapshot.val();
                                //console.log('isActive', isActive)
                                var toastRef = firebase.database().ref('usermeta/' + userId + '/toast');
                                if (isActive !== true) {
                                    var providerId = localStorage.getItem('userId')
                                    chat.link = '/provider-details/' + requestDetails.requestId + '/' + providerId + '/chat'
                                    toastRef.set(chat)
                                }
                            })
                        }
                    })
                }
                this.setState({ message: '' });
            }
        }

    }
    render() {
        const { requestDetails, userDetails, towhom } = this.props
        console.log('REQ DETAILS', requestDetails);
        return (
            <div className="chatbox-container" >
                <div className="chat-box">
                    <h6 className="bold">Messages</h6>
                    <hr></hr>
                    <div className="chat-scroll" id="fakediv" >
                        {
                            this.state.chats.length > 0 ? (
                                this.state.chats && this.state.chats.map((chat, index) =>
                                    chat && chat.uid === this.state.user.uid ? (
                                        <ChatMe key={index} chat={chat} />
                                    ) :
                                        chat && chat.uid !== this.state.user.uid ? (
                                            <ChatOther key={index} chat={chat} />
                                        ) : ''


                                )
                            ) : requestDetails && !requestDetails.isCareSubscription ? (

                                <div style={{ textAlign: 'center', padding: 30 }}>
                                    <img src={chat_icon} style={{ width: 70, height: 70, borderRadius: '20%' }} />
                                    <h5 style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 0, marginBottom: 0 }}>No messages found</h5>
                                    {localStorage.getItem('role') !== 'admin' &&
                                        <p style={{ textAlign: 'center', color: '#A8A8A8' }}>Send message to &nbsp;
                                    {
                                                userDetails && userDetails.fullname == (requestDetails && requestDetails.tblUserByUserId && requestDetails.tblUserByUserId.fullname && requestDetails.tblUserByUserId.fullname)
                                                    ?
                                                    <span style={{ color: '#212121' }}>
                                                        {towhom && towhom.fullname}
                                                    </span>
                                                    :

                                                    <span style={{ color: '#212121' }}>
                                                        {requestDetails && requestDetails.tblUserByUserId && requestDetails.tblUserByUserId.fullname}
                                                    </span>
                                            }


                                        </p>
                                    }
                                </div>
                            ) : <div style={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center', padding: 30 }}>
                                    <a href="https://wa.me/918129123104?text=Can%20I%20have%20more%20info%20about%20this%20YoCo%20Care%20request?" target='_blank'><img className="pointer" src={chat_icon} style={{ width: 70, height: 70, borderRadius: 15 }} /></a>
                                    <h5 style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 20, marginBottom: 0 }}>Click to chat with YoCo helpline, if you need more information about the request.</h5>
                                </div>

                        }
                        <div className="" style={{ float: "left", clear: "both" }}
                            ref={(el) => { this.messagesEnd = el; }}>
                        </div>
                    </div>

                    <hr></hr>
                    <form onSubmit={this.handleSubmit} autoComplete="off">
                        {

                            this.state.user && requestDetails && !requestDetails.isCareSubscription && (
                                <Row>
                                    <Col md="10" xs="10">
                                        <textarea name="message" id="message" value={this.state.message} onChange={this.handleChange} type="text" placeholder="Type your message here" className="chat-input"></textarea>
                                    </Col>
                                    <Col md="2" xs="2">
                                        <a onClick={this.handleSubmit}> <img src={send} className="send-icon"></img></a>
                                    </Col>
                                </Row>
                            )
                        }
                    </form>


                </div>
            </div >

        )
    }
}

const mapStateToProps = (state) => ({
    userDetails: state.profile.userDetails,
    requestDetails: state.request.requestDetails,
})

const mapDispatchToProps = {
    ...ProfileAction,
    ...UserActions,
    ...RequestActions
}

export default connect(mapStateToProps, mapDispatchToProps)(Chatbox)
