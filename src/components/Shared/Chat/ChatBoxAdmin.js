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
import chat_icon from "../../../images/icon/chat-box-3.png";
import { getUser } from '../../../handler/authenticate';
import { usePageVisibility } from 'react-page-visibility';


export class ChatBoxAdmin extends Component {

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

    }
    componentDidMount() {
        this.scrollToBottom();
        const { chatId } = this.props
        firebase.auth().onAuthStateChanged(user => {
            console.log("🚀 ~ file: ChatBoxAdmin.js ~ line 76 ~ ChatBoxAdmin ~ firebase.auth ~ user", user)
            if (user) {
                this.setState({ user });
            }
        })

        if (chatId) {

            const chatRef = firebase.database().ref(chatId);

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



    }
    componentDidUpdate() {

    }


    render() {
        const { requestDetails, userDetails, providerId } = this.props
        return (
            <div className="chatbox-container" >
                <div className="chat-box">
                    <h6 className="bold">Messages</h6>
                    <hr></hr>
                    <div className="chat-scroll" id="fakediv" >
                        {
                            this.state.chats.length > 0 ? (
                                this.state.chats && this.state.chats.map((chat, index) =>
                                    chat && chat.uid === providerId ? (
                                        <ChatMe key={index} chat={chat} />
                                    ) :
                                        chat && chat.uid !== this.state.user.uid ? (
                                            <ChatOther key={index} chat={chat} />
                                        ) : ''


                                )
                            ) : <div style={{ textAlign: 'center', padding: 30 }}>
                                    <img src={chat_icon} style={{ width: 70, height: 70 }} />
                                    <h5 style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 0, marginBottom: 0 }}>No messages found</h5>

                                </div>

                        }
                        <div className="" style={{ float: "left", clear: "both" }}
                            ref={(el) => { this.messagesEnd = el; }}>
                        </div>
                    </div>

                </div>
            </div>

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

export default connect(mapStateToProps, mapDispatchToProps)(ChatBoxAdmin)
