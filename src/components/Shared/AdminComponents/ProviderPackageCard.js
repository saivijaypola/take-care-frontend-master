import React from 'react'
import {
    Row, Col
} from "reactstrap";
import user from "../../../images/icon/user-6.png";
import eye from "../../../images/icon/eye.svg";
import SpiffyOnAvatar from "../../Shared/Spiffy/spiffyonavatar";
import _ from "lodash";
import ReadMoreReact from 'read-more-react';
import UserStatus from '../UserStatus/Userstatus'

const assetsBaseUrl = process.env.REACT_APP_ASSETS_BASE_URL

export const ProviderPackageCard = ({ data, onSelect, type, props }) => {
    return (
        <React.Fragment>
            {
                data && (

                    <div className="candidate-card candidate-card-summery dropshadow package-provider-card">
                        <Row className="package-provider-info">
                            <Col xs="4">
                                <img className="candidate-img" src={data && data.avatarUrl !== '' ? `${assetsBaseUrl}/Users/${data.userId}/Avatar/${data.avatarUrl}` : user} alt="user_img"></img>
                            </Col>
                            <Col xs="8">
                                <div className="neg-m-l-20">
                                    <p className="bold font14">{data && data.fullname}</p>
                                    {
                                        data && data.title !== null && (
                                            <div>
                                                <span className="font-title">{`${data.title}`}</span>
                                            </div>
                                        )

                                    }

                                    <UserStatus userId={data.userId} />
                                    <br />
                                    <p className="email-phone-p">Email : {data.email}</p>
                                    <p className="email-phone-p">Phone : {data.phoneNumber}</p>

                                </div>
                            </Col>
                        </Row>










                        <div className="summery-price-wrapper">
                            <h5>Total Amount</h5>
                            <h6>{data.amount}</h6>
                        </div>


                    </div>

                )
            }


        </React.Fragment>
    )
}


export default ProviderPackageCard
