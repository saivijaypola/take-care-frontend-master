import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Link } from "react-router-dom";
import {
    Container, Row, Col


} from "reactstrap";
import UserRequestList from '../../components/Shared/UserRequestList/UserRequestList';
import { AvForm, AvField, AvGroup } from 'availity-reactstrap-validation';
import classnames from 'classnames';
import Progressbar from '../../components/Shared/Progressbar';
import UploadCard from '../../components/Shared/PhotoVerify/UploadPhotoProof';
import VerifyPrice from '../../components/Shared/PhotoVerify/VerifyPrice';

//Import Images
import imgbg from "../../assets/images/account/bg.jpg";
import profile from "../../assets/images/client/05.jpg";
import address from "../../images/icon/paper.png";
import photoproof from "../../images/icon/frame.png";

import emailicon from "../../images/icon/email.png";
import reservation from "../../images/icon/reservation.png";
import range2 from "../../images/icon/2range.png";
import tiles from "../../images/tiles.png";
import refreshing from "../../images/icon/refreshing.png";
import { ProfileAction } from '../../redux/actions';
import InfoBox from '../../components/Shared/InfoBox';
import SpiffyIcon from '../../components/Shared/Spiffy';
import Spiffy from '../../components/Shared/Spiffy';
import UserInfo from '../../components/Shared/UserInfo';
import UploadAdressProof from '../../components/Shared/DocVerify/UploadAdressProof';
import UploadPhotoProof from '../../components/Shared/PhotoVerify/UploadPhotoProof';

export class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: "1",
            isAlertVisible: false
        }
        this.toggle = this.toggle.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0)
        if (localStorage.getItem("userId") !== null) {
            this.setState({
                userId: localStorage.getItem("userId")
            }, () => {
                // this.props.getUserProfileById({
                //     userId: this.state.userId
                // })
            })
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.isUserLoad !== prevState.isUserLoad) {
            if (nextProps.isUserLoad > 0) {
                return nextProps.isUserLoad;
            }
        }

        //Is Profile updated
        if (nextProps.isProfileUpdate !== prevState.isProfileUpdate) {
            if (nextProps.isProfileUpdate > 0) {
                return nextProps.isProfileUpdate;
            }
        }
        return null

    }
    componentDidUpdate(prevProps, prevState) {
        const { isUserLoad, userDetails, allEducations, allEmployments, isProfileUpdate, isTrainingInsert, allTraining } = this.props;
        if (prevProps.isUserLoad !== isUserLoad && userDetails) {
            this.setState({
                fullName: userDetails.fullname,
                email: userDetails.email,
                phone: userDetails.phoneNumber,
                avatarUrl: userDetails.avatarUrl,
                aboutMe: userDetails.aboutme,

            })
        }

    }
    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    onChangeText(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    toggleTrainingModal = () => {
        this.setState(prevState => ({
            trainingModel: !prevState.trainingModel
        }));
    }



    render() {
        const { laddaLoader, fullName, email, avatarUrl, allEducations, userId } = this.state;
        const { isUserLoad, userDetails, allEmployments, allTraining } = this.props;

        return (
            <React.Fragment>
                

                <section className="section mt-60 padd50">
                    <Container className="mt-lg-3">
                        <Row>
                            <Col lg="4" md="5" xs="12">
                                <div className="sidebar p-4 rounded subtle-shadow">
                                    <Row>
                                        <Col lg="8" xs="8">
                                            <div className="widget">
                                                <div className="progress-box mt-4">
                                                    <h6 className="bold">Profile Completion</h6>
                                                    <Progressbar value={50} ></Progressbar>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col lg="3" xs="3">
                                            <Spiffy style={{ width: 60, height: 50, marginTop: 18 }} />
                                        </Col>
                                    </Row>
                                    <div className="widget mt-4 pt-2">
                                        <Row>
                                            <Col md="7">
                                                <h6 className="bold text-center-mobile" style={{ marginBottom: 25 }}>Verify Account</h6>

                                            </Col>
                                            <Col md="4" style={{ textAlign: 'center', marginBottom: 5, cursor: 'pointer' }} >
                                                <div onClick={() => window.location.reload(true)}>
                                                    <img src={refreshing} style={{ width: 20, height: 20 }} /><span style={{ marginLeft: 5, fontSize: 12 }}>Refresh</span>

                                                </div>

                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col lg="6" xs="6">
                                                <UploadPhotoProof img={photoproof} text={"Upload"} userDetails={userDetails} desc={"Photo Proof"} />
                                            </Col>
                                            <Col lg="6" xs="6">
                                                <UploadAdressProof img={address} text={"Upload"} desc={"Address Proof"} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            {
                                                this.state.isAlertVisible ? (
                                                    <InfoBox title={"Document Uploaded!!"} desc={"You have successfully uploaded your document to verify.You will get a confirmation email, once it is verified"} />

                                                ) : ''
                                            }
                                        </Row>
                                    </div>
                                    {/* <VerifyPrice price={385} title={"Comprehensive Criminal Record Verification"}></VerifyPrice> */}
                                    <hr></hr>

                                </div>
                            </Col>

                            <Col lg="8" md="7" xs="12" className="mt-4 mt-sm-0 pt-2 pt-sm-0">
                                <div className="ml-lg-3">
                                    <div className="pb-4">
                                        <p style={{fontSize:19, fontWeight:"bold"}}>Dashboard</p>

                                        {/* <UserRequestList></UserRequestList> */}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    userDetails: state.profile.userDetails,
    isUserLoad: state.profile.isUserLoad,
    isEducationStored: state.profile.isEducationStored,
    isEmploymentStored: state.profile.isEmploymentStored,
    isProfileUpdate: state.profile.isProfileUpdate,
    allEducations: state.profile.allEducations,
    allEmployments: state.profile.allEmployments,
    isTrainingInsert: state.profile.isTrainingInsert,
    allTraining: state.profile.allTraining,
    userDetails: state.profile.userDetails
})

const mapDispatchToProps = {
    ...ProfileAction
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
