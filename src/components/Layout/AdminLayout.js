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

class AdminLayout extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }

    }

    componentDidMount() {

    }
    SlideTransition(props) {

    }
    handleVisibilityChange = isVisible => {

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
                    <div className="notification-bell" onClick={() => this.props.history.push('/notifications')} >
                        <img src={notification} />
                        {
                            this.state.unread > 0 &&
                            <Badge badgeContent={this.state.unread} color="secondary" />
                        }

                    </div>
                    <TopBar />
                    <PwaReloader />
                    {
                        !this.state.sendQuote &&

                        <section className="bg-profile d-table w-100" style={{ background: `url(${imgbg}) center center` }}>
                            <Container>
                                <Row>
                                    <Col lg="12">
                                        {
                                            localStorage.getItem('role') && localStorage.getItem('role').toString() === 'provider' ? (
                                                <UserInfo {...this.props} />
                                            ) : localStorage.getItem('role').toString() === 'admin' ?
                                                    <></> :
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
