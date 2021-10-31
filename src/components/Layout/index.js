import React, { Component, Suspense } from 'react';
import { withRouter ,useLocation} from 'react-router-dom';

// Scroll up button
import { TinyButton as ScrollUpButton } from "react-scroll-up-button";
import TopBar from './TopBar';
import Footer from './Footer';
import UserInfo from '../Shared/UserInfo';
import imgbg from "../../assets/images/account/bg.jpg";

import { Col,Row,Container } from "reactstrap";

class Layout extends Component {

    render() {
         
        return (

            <React.Fragment>
                <TopBar />
                 
                {this.props.children}
                <Footer />
                <div id="bottomIcon">
                    {/* scrollup button */}
                    <ScrollUpButton className="bottomIcon" />
                </div>
            </React.Fragment>
        )
    }
}
export default withRouter(Layout);
