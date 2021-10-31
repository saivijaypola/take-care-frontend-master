import React, { Component } from 'react'
import {
    Container, Row, Col, Nav,
    NavItem,
    NavLink, TabContent,
    TabPane
} from "reactstrap";
import { connect } from 'react-redux'
import profile from "../../../assets/images/client/05.jpg";
import send from "../../../images/icon/send.png";
import { formatAMPM } from "../../../utils/helper";

export class ChatMe extends Component {
    render() {
        return (
            <div className="chat-me">
                <Row>
                    <Col xs="12">
                        <div className="chat-text pull-right">
                            <h6 className="bold">{this.props.chat.user}</h6>
                            <p> {this.props.chat.message}</p>
                            <span>{new Date(this.props.chat.date).toDateString() + ' ' + formatAMPM(new Date(this.props.chat.date))}</span>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(ChatMe)
