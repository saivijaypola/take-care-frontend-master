import React, { Component, Suspense } from 'react';
import { withRouter, useLocation } from 'react-router-dom';

// Scroll up button
import { TinyButton as ScrollUpButton } from "react-scroll-up-button";
import TopBar from './TopBar';
import Footer from './Footer';
import UserInfo from '../Shared/UserInfo';
import imgbg from "../../assets/images/account/bg.jpg";
import firebase from "firebase"
import { Col, Row, Container } from "reactstrap";
import Userbox from '../Shared/Userbox';
import { PwaReloader } from '../Shared/PwaReloader';
import Badge from '@material-ui/core/Badge';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Link } from 'react-router-dom'
import PageVisibility from 'react-page-visibility';
import notification from "../../images/icon/notification.svg";

class Layout extends Component {
    constructor(props) {
        super(props)

        this.state = {
            open: false,
            message: "",
            chatlink: "",
            sendQuote: false,
            visible: true,
            unread: 0,
            Transition: Slide,
        }
        this.handleClose = this.handleClose.bind(this)
        this.openChat = this.openChat.bind(this)
    }
    handleClose = (event, reason) => {
        var userId = localStorage.getItem('userId')
        var toastRef = firebase.database().ref('usermeta/' + userId + '/toast');
        toastRef.set(false)
        this.setState({
            message: "",
            open: false
        })
    };
    openChat = (event, reason) => {
        var userId = localStorage.getItem('userId')
        var toastRef = firebase.database().ref('usermeta/' + userId + '/toast');
        var chatlink = this.state.chatlink
        toastRef.set(false)
        this.setState({
            message: "",
            open: false
        })
        if (this.props.location.pathname.includes('provider-details')) {
            if (!this.props.location.pathname.includes('/chat')) {
                var currentlink = this.props.location.pathname + "/chat"
            } else {
                var currentlink = this.props.location.pathname
            }
        } else if (this.props.location.pathname.includes('request-details')) {
            if (!this.props.location.pathname.includes('/chat')) {
                var currentlink = this.props.location.pathname + "/chat"
            } else {
                var currentlink = this.props.location.pathname
            }
        }
        if (currentlink != chatlink) {
            this.props.history.push(chatlink)
        }
        else {
            if (this.props.location.pathname.includes('provider-details')) {
                chatlink = chatlink.replace(/provider-details/g, "provider-info");
                this.props.history.push(chatlink)
            } else if (this.props.location.pathname.includes('request-details')) {
                chatlink = chatlink.replace(/request-details/g, "request-info");
                this.props.history.push(chatlink)
            }
        }
    };
    componentDidMount() {
        var userId = localStorage.getItem('userId')
        if (this.props.location.pathname.includes('send-quote')) {
            this.setState({
                sendQuote: true
            })
        }
        var notificationsRef = firebase.database().ref('usermeta/' + userId + '/notifications');
        notificationsRef.on('value', snapshot => {
            const getNotifications = snapshot.val();
            let ascNotifications = [];
            console.log('GET Notifications', getNotifications)
            var unread_count = 0
            for (let notification in getNotifications) {
                console.log(getNotifications[notification].read)
                if (!getNotifications[notification].read == true) {
                    unread_count++
                }
            }
            this.setState({ unread: unread_count });
        });
        var userBrowserRef = firebase.database().ref('usermeta/' + userId + '/visible');
        userBrowserRef.set(true)
        var amOnline = firebase.database().ref('.info/connected');
        var userId = localStorage.getItem('userId')
        var userRef = firebase.database().ref('usermeta/' + userId + '/online');
        var toastRef = firebase.database().ref('usermeta/' + userId + '/toast');
        toastRef.on('value', snapshot => {
            const toast = snapshot.val();
            if (toast) {

                this.setState({
                    message: toast.user + " sent you a message",
                    chatlink: toast.link,
                    open: true
                })
            }
            else {
                toastRef.set(false)
                this.setState({
                    message: "",
                    chatlink: "",
                    open: false
                })
            }
        });
        amOnline.on('value', function (snapshot) {
            if (snapshot.val()) {
                userRef.onDisconnect().set(false);
                userRef.set(true);
            }
        });
    }
    SlideTransition(props) {
        return <Slide {...props} direction="up" />;
    }
    handleVisibilityChange = isVisible => {
        var userId = localStorage.getItem('userId')
        this.setState({ visible: isVisible });
        var userBrowserRef = firebase.database().ref('usermeta/' + userId + '/visible');
        userBrowserRef.set(this.state.visible)
        var lastSeenRef = firebase.database().ref('usermeta/' + userId + '/lastseen');
        lastSeenRef.set(new Date().getTime())
    }
    render() {
        return (
            <PageVisibility onChange={this.handleVisibilityChange}>
                <React.Fragment>
                    <Snackbar
                        anchorOrigin={{ vertical: "top", horizontal: "center" }}
                        open={this.state.open}
                        onClose={this.handleClose}
                        TransitionComponent={this.state.Transition}
                        message={this.state.message}
                        autoHideDuration={60000}
                        key={this.state.Transition.name}
                        action={
                            <React.Fragment>
                                <Button className="showchat" onClick={this.openChat}>Show</Button>
                                <IconButton className="closetoast" size="small" aria-label="close" color="inherit" onClick={this.handleClose}>
                                    <CloseIcon fontSize="small" />
                                </IconButton>

                                {/* <Button onClick={() => alert(this.state.chatlink)}>Show</Button> */}
                            </React.Fragment>
                        }
                    />
                    {localStorage.getItem('role') && localStorage.getItem('role').toString() !== 'admin' &&
                        <div className="notification-bell" onClick={() => this.props.history.push('/notifications')} >
                            <img src={notification} />
                            {
                                this.state.unread > 0 &&
                                <Badge badgeContent={this.state.unread} color="secondary" />
                            }

                        </div>
                    }
                    <TopBar />
                    <PwaReloader />
                    {localStorage.getItem('role') && localStorage.getItem('role').toString() === 'admin' ?
                        <React.Fragment></React.Fragment>
                        :
                        !this.state.sendQuote &&

                        <section className="bg-profile d-table w-100" style={{ background: `url(${imgbg}) center center` }}>
                            <Container>
                                <Row>
                                    <Col lg="12">
                                        {
                                            localStorage.getItem('role') && localStorage.getItem('role').toString() === 'provider' ? (
                                                <UserInfo {...this.props} />
                                            ) :
                                                <Userbox  {...this.props} />
                                        }


                                    </Col>
                                </Row>
                            </Container>
                        </section>
                    }

                    {this.props.children}
                    <Footer />
                    <div id="bottomIcon">
                        {/* scrollup button */}
                        <ScrollUpButton className="bottomIcon" />
                    </div>
                </React.Fragment>
            </PageVisibility>
        )
    }
}
export default withRouter(Layout);
