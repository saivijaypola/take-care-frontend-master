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
import edit from "../../../images/icon/edit-2.png";
import trash from "../../../images/icon/trash.png";
import { useHistory } from "react-router";
import {

    useParams
} from "react-router-dom";
import gmail from "../../../images/icon/gmail.png";
import call from "../../../images/icon/call.png";
import postcssFlexbugsFixes from 'postcss-flexbugs-fixes';
import getSymbolFromCurrency from 'currency-symbol-map';

const assetsBaseUrl = process.env.REACT_APP_ASSETS_BASE_URL

export const ProviderCardForCare = ({ data, onSelect, type, amount, monthly, perVisit, serviceFee, props }) => {
    console.log("DATA", data);
    const history = useHistory();
    let { careid, requestid } = useParams();

    const onClickEdit = (item) => {
        console.log("ITEM", item);
        history.push({
            pathname: `/admin/update-careprovider/${careid}/${requestid}/${data.currnecyType}`,

            state: { providerData: item }

        });
    }


    return (
        <React.Fragment>
            {
                data && (

                    <div className="jobs-card inner-job ">

                        <Row>
                            <Col xs="3">
                                <img style={{ width: 70, height: 70, borderRadius: '50%' }} src={data && data.avatarUrl !== '' ? `${assetsBaseUrl}/Users/${data.providerId}/Avatar/${data.tblUserByProviderId.avatarUrl}` : user} alt="user_img" />
                            </Col>
                            <Col style={{ marginLeft: 5 }}>
                                <Row style={{ height: '40%' }}>
                                    <Col>
                                        <p className="bold text-left font14">{data.tblUserByProviderId && data.tblUserByProviderId.fullname}</p>
                                    </Col>
                                    <Col xs="3">
                                        <img className="pointer" onClick={() => onClickEdit(data)} style={{ width: 30, height: 30, marginRight: 30 }} src={edit} />
                                    </Col>

                                </Row>
                                <Row style={{ height: '30%' }}>
                                    <Col xs="2" md="1" lg="1">
                                        <img src={gmail} style={{ height: 15, float: 'left', marginRight: 5, marginTop: 3 }} />
                                    </Col>
                                    <Col>
                                        <p className="font-title">{data.tblUserByProviderId.email}</p>
                                    </Col>
                                </Row>
                                <Row style={{ height: '30%' }}>
                                    <Col xs="2" md="1" lg="1">
                                        <img src={call} style={{ height: 15, float: 'left', marginRight: 5, marginTop: 3 }} />
                                    </Col>
                                    <Col>
                                        <p className="font-title">{data.tblUserByProviderId.phoneNumber}</p>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>



                        <hr />
                        <div style={{ height: '45%' }} className="text-overflow-fade">
                            <p className="font-title">{data.supportDescription}</p>
                            <p className="font-title">{data.briefDescription}</p>
                            <p className="font-title">{data.yocoComments}</p>
                        </div>
                        <div className="">
                            <Row>
                                <Col>
                                    <p style={{ textAlign: 'center', fontSize: 14 }}><b>Monthly Fee</b></p>
                                    <p className="purple-text bold" style={{ textAlign: 'center', marginTop: 5 }}><b>{getSymbolFromCurrency(data.currnecyType)} {monthly}</b></p>
                                </Col>
                                <Col>
                                    <p style={{ textAlign: 'center', fontSize: 14 }}><b>Per Visit</b></p>
                                    <p className="purple-text bold" style={{ textAlign: 'center', marginTop: 5 }}><b>{getSymbolFromCurrency(data.currnecyType)} {perVisit}</b></p>
                                </Col>
                                <Col>
                                    <p style={{ textAlign: 'center', fontSize: 14 }}><b>Service Fee</b></p>
                                    <p className="purple-text bold" style={{ textAlign: 'center', marginTop: 5 }}><b>{serviceFee} %</b></p>
                                </Col>
                            </Row>
                        </div>
                        <hr />
                        <Row>


                        </Row>

                    </div>

                )
            }


        </React.Fragment>
    )
}


export default ProviderCardForCare
