import React from 'react'
import {
    Row, Col
} from "reactstrap";
import user from "../../../images/icon/user-6.png";
import eye from "../../../images/icon/eye.svg";
import SpiffyOnAvatar from "../../Shared/Spiffy/spiffyonavatar";
import _ from "lodash";
import ReadMoreReact from 'read-more-react';
import UserStatus from '../UserStatus/Userstatus';
import gmail from "../../../images/icon/gmail.png";
import call from "../../../images/icon/call.png";
import getSymbolFromCurrency from 'currency-symbol-map';

const assetsBaseUrl = process.env.REACT_APP_ASSETS_BASE_URL

export const SearchProviderCard = ({ data, onSelect, type, currency, monthly, perVisit, serviceFee, props }) => {
    return (
        <React.Fragment>
            {
                data && (

                    <div className="card-shadow jobs-card inner-job" style={{ height: 220 }}>
                        <Row>
                            <Col xs='12'>
                                <p style={{ marginLeft: 10, height: 40 }} className="bold font16 text-left">{data && data.fullname}</p>
                                {/* <span><UserStatus userId={request.userId} /></span> */}
                            </Col>

                            <Col xs="3">
                                <img style={{ width: 70, height: 70, borderRadius: '50%' }} src={data && data.avatarUrl !== '' ? `${assetsBaseUrl}/Users/${data.userId}/Avatar/${data.avatarUrl}` : user} alt="user_img" />
                            </Col>
                            <Col style={{ marginLeft: 5, marginBottom: 10 }}>
                                <Row style={{ height: '50%', paddingTop: 10 }}>
                                    <Col xs="2" md="1" lg="1">
                                        <img src={gmail} style={{ height: 15, float: 'left', marginRight: 5, marginTop: 3 }} />
                                    </Col>
                                    <Col>
                                        <p className="font-title" style={{ float: 'left' }}>{data && data.email}</p>
                                    </Col>
                                </Row>
                                <Row style={{ height: '50%', paddingTop: 10 }}>
                                    <Col xs="2" md="1" lg="1">
                                        <img src={call} style={{ height: 15, float: 'left', marginRight: 5, marginTop: 3 }} />
                                    </Col>
                                    <Col>
                                        <p style={{ float: 'left' }} className="font-title">{data && data.phoneNumber}</p>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <hr />
                        {type === 'list' ?
                            <div>
                                <Row className="">
                                    <Col xs="12" className="right-border" onClick={() => onSelect(data.userId, data)}>
                                        <p className="hamper-button pointer"><b>Select </b></p>
                                    </Col>

                                </Row>

                            </div>
                            :
                            <div className="">
                                <Row>
                                    <Col>
                                        <p style={{ textAlign: 'center', fontSize: 14 }}><b>Monthly Fee</b></p>
                                        <p className="purple-text" style={{ textAlign: 'center', marginTop: 5 }}><b>{getSymbolFromCurrency(currency)} {monthly}</b></p>
                                    </Col>
                                    <Col>
                                        <p style={{ textAlign: 'center', fontSize: 14 }}><b>Per Visit Fee</b></p>
                                        <p className="purple-text" style={{ textAlign: 'center', marginTop: 5 }}><b>{getSymbolFromCurrency(currency)} {perVisit}</b></p>
                                    </Col>
                                    <Col>
                                        <p style={{ textAlign: 'center', fontSize: 14 }}><b>Service Fee</b></p>
                                        <p className="purple-text" style={{ textAlign: 'center', marginTop: 5 }}><b>{serviceFee} %</b></p>
                                    </Col>
                                </Row>
                            </div>
                        }




                    </div>

                )
            }


        </React.Fragment>
    )
}


export default SearchProviderCard
