import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Link } from "react-router-dom";
import {
    Container, Row, Col,
    Button,

} from "reactstrap";

import './style.css'


//Import Images
import imgbg from "../../assets/images/account/bg.jpg";
import profile from "../../assets/images/client/05.jpg";
import address from "../../images/icon/paper.png";
import photoproof from "../../images/icon/frame.png";
import criminal from "../../images/criminal.png";
import cop from "../../images/cop.png";
import emailicon from "../../images/icon/email.png";
import reservation from "../../images/icon/reservation.png";
import range2 from "../../images/icon/2range.png";
import { ProfileAction } from '../../redux/actions';
import UploadDocModel from './UploadDocModel';
import UserInfo from '../../components/Shared/UserInfo';



export class index extends Component {
    constructor(props) {
        super(props);
        this.state = {

            isModelOpen: false
        }

        this.onChangeText = this.onChangeText.bind(this);
        this.onToggleUploadModel = this.onToggleUploadModel.bind();
    }

    componentDidMount() {
        if (localStorage.getItem("userId") !== null) {
            this.setState({
                userId: localStorage.getItem("userId")
            }, () => {
                this.props.getUserProfileById({
                    userId: this.state.userId
                })
            })
        }
    }
    componentDidUpdate(prevProps, prevState) {
        const { isUserLoad, userDetails, allEducations, allEmployments, isProfileUpdate, isTrainingInsert, allTraining } = this.props;
        if (prevProps.isUserLoad !== isUserLoad && userDetails) {
            this.setState({
                fullName: userDetails.fullname,
                email: userDetails.email,
                phone: userDetails.phoneNumber,
                address1: userDetails.adressline1,
                address2: userDetails.adressline2,
                city: userDetails.city,
                userState: userDetails.state,
                country: userDetails.country,
                zipCode: userDetails.zipCode,
                avatarUrl: userDetails.avatarUrl,
                aboutMe: userDetails.aboutme,
                allEducations,
                allEmployments

            })
        }



    }
    onChangeText(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    onToggleUploadModel = () => {
        this.setState(prevState => ({
            isModelOpen: !prevState.isModelOpen
        }));
    }


    render() {
        const {
            fullName,
            userId, avatarUrl, email, isModelOpen } = this.state;
        const { isUserLoad ,userDetails} = this.props;
        return (
            <React.Fragment>
                <UploadDocModel isModelOpen={isModelOpen} onToggle={this.onToggleUploadModel} />
                <section className="bg-profile d-table w-100" style={{ background: `url(${imgbg}) center center` }}>
                    <Container>
                        <Row>
                        <Col lg="12">
                            {
                                    userDetails && (
                                        <UserInfo/>
                                    )
                                }
                                  
                            </Col>
                        </Row>
                    </Container>
                </section>
                <section className="section mt-60">
                    <Container className="mt-lg-3">
                        <p className="font23 bold">Upload your scanned verification copies</p>
                        <hr></hr>
                        <div className="">

                            <Row>
                                <Col lg="5">
                                    <Row>
                                        <Col lg="6">
                                            <div className="upload-card" onClick={this.onToggleUploadModel}>
                                                <p style={{fontSize:14}}>Upload</p>
                                                <p className="font-title">Address Proof</p>
                                                <img src={address}></img>
                                            </div>
                                        </Col>
                                        <Col lg="6">
                                            <div className="upload-card" onClick={this.onToggleUploadModel}>
                                                <p style={{fontSize:14}}>Upload</p>
                                                <p className="font-title">Photo Proof</p>
                                                <img src={photoproof}></img>
                                            </div>
                                        </Col>
                                    </Row>


                                </Col>
                                <Col lg="7">

                                </Col>
                            </Row>
                            <br></br><br></br><br></br>
                            <p className="font23 bold">Verify Your Account</p>
                            <p className="font14">The users are looking for trusted individuals to provide a service. You will have more chances of getting an offer if you increase your credibility.
                            We had partnered with leading attesting agencies to extend their services to you at an affordable price. You can optionally
                            opt for additional validation to increase your credibility score.
                        </p>
                            <Row>
                                <Col lg="2">

                                </Col>
                                <Col lg="4">
                                    <div className="verify-card">
                                        <div className="verify-bg" style={{ backgroundImage: "url(" + criminal + " )" }}>

                                        </div>
                                        <div className="relative text-center padd30">
                                            <div className="dollar">
                                                <h6>INR 385</h6>
                                            </div>
                                            <p style={{fontSize:14, fontWeight:"bold"}}>Comprehensive Criminal Record Verification</p>
                                        </div>
                                        <a className="verify-button"> Verify</a>
                                    </div>
                                </Col>
                                <Col lg="4">
                                    <div className="verify-card">
                                        <div className="verify-bg" style={{ backgroundImage: "url(" + cop + " )" }}>

                                        </div>
                                        <div className="relative text-center padd30">
                                            <div className="dollar">
                                                <h6>$14</h6>
                                            </div>
                                            <h5>Police Clearance Certificate</h5>

                                        </div>
                                        <a className="verify-button"> Verify</a>
                                    </div>
                                </Col>
                                <Col lg="2">

                                </Col>
                            </Row>
                        </div>
                    </Container>
                </section>
            </React.Fragment >
        )
    }
}

const mapStateToProps = (state) => ({
    userDetails: state.profile.userDetails,
    isUserLoad: state.profile.isUserLoad,
    isDocumentUploadDone: state.profile.isDocumentUploadDone,
    isUploading: state.profile.isUploading,

})

const mapDispatchToProps = {
    ...ProfileAction
}

export default connect(mapStateToProps, mapDispatchToProps)(index)
