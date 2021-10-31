import React, { Component } from 'react'
import { connect } from 'react-redux'
import spiffy from "../../../images/icon/yoyoco-safe-5.png";
import dots from "../../../images/icon/dots-3.png";
import chat from "../../../images/icon/chat-box-2.png";
import tag from "../../../images/icon/tag-3.png";
import userimg from "../../../images/busi01.jpg";
import user from "../../../images/icon/user-6.png";
import { Button } from '@material-ui/core';
import {
    Row, Col
} from "reactstrap";
import { getDistance } from 'geolib';
import { UserActions } from '../../../redux/actions';
const assetsBaseUrl = process.env.REACT_APP_ASSETS_BASE_URL
export class UserRequestCard extends Component {
    render() {
        const { data, selectedPost, key } = this.props

        return (
            <React.Fragment>
                <div className="candidate-card">
                    <img src={userimg}></img>
                    <p className="bold font14">John Doe</p>
                    <p className="font-title">Vaikom, Kerala</p>
                    <p>Need a driver to take my parents to vaikom temple and back</p>
                    <div className="mobile-hide">
                        <Button className="accept">Accept for $30</Button>
                        <Button className="primary">Details</Button>
                        <Button className="primary pull-right">Contact</Button>
                    </div>
                    <div className="mobile-show">
                        <Row>
                            <Col xs="4">
                                <div className="candiate-actions">
                                    <a><img src={dots}></img><span>Details</span></a>
                                </div>
                            </Col>
                            <Col xs="4">
                                <div className="candiate-actions">
                                    <a><img src={chat}></img><span>Chat</span></a>
                                </div>
                            </Col>
                            <Col xs="4">
                                <div className="candiate-actions" style={{ marginLeft: 0 }}>
                                    <a><img src={tag}></img><span>Offer</span></a>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </React.Fragment>

        )
    }
}

const mapStateToProps = (state) => ({

    selectedPost: state.user.selectedPost,

})

const mapDispatchToProps = {

    ...UserActions
}

export default connect(mapStateToProps, mapDispatchToProps)(UserRequestCard)
