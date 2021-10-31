import React  from 'react';
import {   Row, Col } from 'reactstrap';
import usericon from '../../../images/user-6.png';


export default function ProfileCard(props) {

    const { userDetails } = props
    const educationHistory = userDetails && userDetails.tblEducationsByUserId && userDetails.tblEducationsByUserId.nodes && userDetails.tblEducationsByUserId.nodes.length > 0 ? userDetails.tblEducationsByUserId.nodes : []
    const employmentHistory = userDetails && userDetails.tblEmploymentsByUserId && userDetails.tblEmploymentsByUserId.nodes && userDetails.tblEmploymentsByUserId.nodes.length > 0 ? userDetails.tblEmploymentsByUserId.nodes : []
    return (
        <Row>
            <Col lg="2" xs="3">
                <img src={usericon} alt={"user_icon_yoco"}></img>
            </Col>
            {
                userDetails ? (
                    <Col lg="10"  xs="9">
                        <div className="profile-card">
                            <p className="bold font16">{userDetails.fullname}</p>
                            {
                                employmentHistory.length > 0 ? (
                                    <p className="font-title">{employmentHistory[0].jobTitle}@{employmentHistory[0].companyName}</p>
                                ) : educationHistory.length > 0 ? (
                                    <p className="font-title">{educationHistory[0].degreeTitle}@{educationHistory[0].college}</p>
                                ) : ''
                            }
                            <span>{userDetails && userDetails.email}</span>
                        </div>
                    </Col>
                ):<p>Loading...</p>
            }
        </Row>
    )
}