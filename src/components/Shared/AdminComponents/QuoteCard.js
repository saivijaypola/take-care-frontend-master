import React, { Component } from 'react'
import { connect } from 'react-redux'

import user from "../../../images/icon/user-6.png";

import SpiffyOnAvatar from "../../Shared/Spiffy/spiffyonavatar";

import ReadMoreReact from 'read-more-react';
import _ from "lodash";
import { QuoteHeading } from '../../../pages/Admin/AdminStyled'
import { v4 as uuidv4 } from 'uuid';
import {
    Row, Col,
    Modal,
    ModalHeader,
    ModalFooter,
    ModalBody
} from "reactstrap";
import { getDistance } from 'geolib';
import { UserActions } from '../../../redux/actions';
const assetsBaseUrl = process.env.REACT_APP_ASSETS_BASE_URL

export class QuoteCard extends Component {


    constructor() {
        super()

    }






    render() {
        const { data, key } = this.props

        return (
            <React.Fragment>
                {
                    data && (

                        <div className="candidate-card candidate-card-admin dropshadow">
                            <Row>
                                <Col xs="4">
                                    <img className="candidate-img" src={data && data.avatarUrl !== '' ? `${assetsBaseUrl}/Users/${data.userId}/Avatar/${data.avatarUrl}` : user} alt="user_img"></img>
                                </Col>
                                <Col xs="8">
                                    <div className="neg-m-l-20">
                                        <p className="bold font14">{data && data.fullname}</p>

                                        <p className="font-title">{`Email: ${data.email}`}</p>
                                        <p className="font-title">{`Ph No: ${data.countryCode} ${data.phoneNumber}`}</p>
                                        {/* <UserStatus userId={data.userId} /> */}

                                    </div>
                                </Col>
                            </Row>

                            <SpiffyOnAvatar className={"candidate-spiffy"} spiffyStrength={!_.isNull(data.spiffy) && data.spiffy.length > 0 ? data.spiffy[0] : 0} />
                            <hr />

                            <QuoteHeading><span className="quote-span">Order Amount : </span>{data.orderTotalAmount}</QuoteHeading>
                            <QuoteHeading><span className="quote-span">Advance Amount : </span>{data.advanceAmount}</QuoteHeading>
                            <QuoteHeading><span className="quote-span">Order Status : </span>{data.orderStatus}</QuoteHeading>
                            <br />
                            <p className="font-title"><b><u>Provider Comments</u></b></p>

                            {!_.isEmpty(data) && !_.isNull(data.providerComments) &&
                                <ReadMoreReact
                                    className="font-title text-left"
                                    text={data.providerComments}
                                    min={20}
                                    ideal={100}
                                    max={100}
                                    readMoreText="More.." />
                            }





                        </div>

                    )
                }


            </React.Fragment>

        )
    }
}

const mapStateToProps = (state) => ({

    selectedPost: state.user.selectedPost

})

const mapDispatchToProps = {

    ...UserActions
}

export default connect(mapStateToProps, mapDispatchToProps)(QuoteCard)
