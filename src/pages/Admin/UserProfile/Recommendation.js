import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import { ProfileAction } from '../../../redux/actions';
import { AvForm, AvField, AvGroup } from 'availity-reactstrap-validation';
import LaddaButton, { XL, SLIDE_UP } from 'react-ladda';
import { v4 as uuidv4 } from 'uuid';
import {
    Row, Col,
    FormGroup,
    Label,
    Badge,
    Input,
    Modal,
    Spinner,
    Alert,
    ModalHeader,
    ModalBody,
    Button,
    ModalFooter,

} from "reactstrap";
import { getUser } from '../../../handler/authenticate';
import { Nodata } from '../../../components/Nodata/Nodata';
import nodata from "../../../images/icon/nodata.png"
import view from "../../../images/icon/eye.png"


class Recommendation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            recFullName: '',
            recEmail: '',
            loaderRecommendation: false,
            isModalVisible: false,
            recModel: false,
            errorMessage: '',
            errorDescription: '',
            resendInviteLoader: false,
            allRecommendations: [],
            recommendationResponse: '',
            selectedRecommendation: '',
            isSelectedRecModalVisible: false
        }

        this.onChangeText = this.onChangeText.bind(this)
        this.handelSubmitRecommendation = this.handelSubmitRecommendation.bind(this)
        this.toggleModal = this.toggleModal.bind(this)
        this.resetError = this.resetError.bind(this)
        this.resendInvite = this.resendInvite.bind(this)
        this.onSelectRecItem = this.onSelectRecItem.bind(this)
        this.hideSelectedRecModal = this.hideSelectedRecModal.bind(this)
    }

    onChangeText(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    componentDidMount() {
        if (this.props && this.props.allRecommendations) {
            const { allRecommendations } = this.props
            this.setState({
                allRecommendations: allRecommendations
            })
        }
    }
    componentDidUpdate(prevProps, prevState) {

        //is education stored 
        const { isSentRecommendation, allRecommendations, recommendationResponse, isRecommendationResend } = this.props;
        if (prevProps.isSentRecommendation !== isSentRecommendation && recommendationResponse) {
            if (isSentRecommendation === 1 && !isRecommendationResend) {
                this.setState({
                    recModel: recommendationResponse.inviteStatus === "Already Invited" ? true : false,
                    loaderRecommendation: false,
                    resendInviteLoader: false,
                    recommendationResponse: recommendationResponse.inviteStatus,
                    // isModalVisible: true,
                    allRecommendations: allRecommendations
                }, () => {
                    this.props.getSpiffyStrength({
                        userId: this.props.userId
                    })
                    this.props.getProfileCompletionProgress({
                        userId: this.props.userId
                    })
                })
                // const { allRecommendations } = this.props
                // this.setState({
                //     allRecommendations: allRecommendations
                // })
            }
            if (isSentRecommendation === 1 && isRecommendationResend) {
                this.setState({
                    loaderRecommendation: false,
                    isModalVisible: true,
                    errorMessage: "Invite Resent",
                    errorDescription: "Invitation resent successfully",
                    //  resendInviteLoader:false,
                    recommendationResponse: recommendationResponse.inviteStatus,
                    // isModalVisible: true,
                    allRecommendations: allRecommendations
                })
            }
        }
        if (prevProps.isSentRecommendation !== isSentRecommendation && isSentRecommendation === 2) {

            console.log('HELLO')
            this.setState({
                loaderRecommendation: false,
                isModalVisible: true,
                errorMessage: "Failed to send invite",
                errorDescription: "Check your Internet Connection"

            })


        }

    }


    handelSubmitRecommendation(event, errors, values) {
        const { recEmail, recFullName } = this.state;
        const { userDetails } = this.props
        var currentUserData = getUser()
        if (errors && errors.length > 0) {

        } else if (currentUserData.email !== recEmail) {
            this.props.insertRecommendation({
                name: recFullName,
                email: recEmail,
                providerName: userDetails.fullname,
                userId: this.props.userId
            })
        } else {
            this.setState({
                isModalVisible: true,
                errorMessage: "You cannot invite yourself",
                errorDescription: 'Try a different email id to send recommend invite'
            })
        }
    }
    toggleModal() {
        this.setState({
            recFullName: '',
            recEmail: '',
            recModel: !this.state.recModel,
            recommendationResponse: ''
        })
    }
    resetError() {
        this.setState({
            errorMessage: '',
            errorDescription: '',
            isModalVisible: false,
            recommendationResponse: ''

        })
    }
    resendInvite(name, email) {
        const { userDetails } = this.props

        this.setState({
            resendInviteLoader: true
        }, () => {
            this.props.insertRecommendation({
                name: name,
                email: email,
                providerName: userDetails.fullname,
                userId: this.props.userId
            })
        })

    }
    hideSelectedRecModal() {
        this.setState({
            isSelectedRecModalVisible: false
        })
    }
    onSelectRecItem = (item) => {
        this.setState({
            selectedRecommendation: item,
            isSelectedRecModalVisible: true
        })
    }
    renderRecommendations = (rec, index) => <li key={index} style={{ boxShadow: '0 0 3px rgba(60, 72, 88, 0.15) !important', border: 'solid 0.5px #efefef', borderRadius: '10px !important' }} className={this.props.key === 0 ? "d-flex p-3 bg-white rounded " : "d-flex p-3 bg-white rounded  mt-4"} >
        <div className="icons text-center rounded-pill mr-1 mt-2">
            {/* <img src={rec.image} className="avatar avatar-ex-sm" alt="" /> */}
        </div>
        <div className="content" style={{ width: '100%' }}>
            <Row>
                <Col md="10" xs="9">
                    <p style={{ wordWrap: "break-word, fontt16" }} className="title mb-0">{rec.name}</p>

                    <p style={{ wordWrap: "break-word", fontSize: 12 }} className="text-muted mb-0">{rec.email}</p>
                    <Link onClick={() => this.resendInvite(rec.name, rec.email)}>Resend Invite</Link>{`     `}
                </Col>
                <Col md="2" xs="3" style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <div onClick={() => this.onSelectRecItem(rec)} style={{ textAlign: 'center', cursor: 'pointer' }}>
                        <img src={view} style={{ width: 20, height: 20 }} />
                        <p>View</p>
                    </div>
                </Col>
            </Row>
            {/* <Badge className="badge-outline-primary" pill> {rec.isVerified ? "Verified" : "Not Verified"} </Badge> */}
        </div>
    </li>
    render() {

        const { recFullName, recEmail, loaderRecommendation, allRecommendations, isModalVisible, errorMessage, errorDescription, recModel, selectedRecommendation, isSelectedRecModalVisible } = this.state

        return (
            <Fragment>
                <Row>
                    <Col lg="10" className="clearfix" >
                        <p style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 2 }}>It is always better and more believable if other people can talk for you. </p>
                        <p style={{fontSize:12, color:'#616161'}}>In this section, give the contact of people who know you and will recommend you. Recommendations from your teachers / managers / any other respected individuals add credibility to your profile.</p>
                    </Col>
                    <Col lg="2" className="clearfix" >
                        <Link to="#" onClick={this.toggleModal} className="btn btn-outline-primary float-right"> Add </Link>
                    </Col>
                </Row>
                <Col lg="12" className="mt-4 pt-2 pt-sm-0 ml-0">
                    <ul style={{ paddingLeft: 0 }}>
                        {
                            allRecommendations && allRecommendations.length > 0 ? (
                                allRecommendations.map((rec, index) =>
                                    this.renderRecommendations(rec, index)
                                )
                            ) : <Nodata img={nodata} title={"No Data Found"} desc="Please add your recommendations here"></Nodata>
                        }
                    </ul>
                </Col>
                <Modal isOpen={recModel} role="dialog" autoFocus={true} centered={true}>
                    <ModalHeader toggle={this.toggleEmpModal}>Add your recommendations here</ModalHeader>
                    <ModalBody>

                        <AvForm className="login-form" onSubmit={this.handelSubmitRecommendation}>
                            <Row>
                                <Col md={12}>

                                    <AvGroup className="form-group position-relative">
                                        <Label for="email">Full Name<span className="text-danger">*</span></Label>
                                        <AvField type="text" className="form-control" value={recFullName} name="recFullName" id="recFullName" onChange={this.onChangeText} placeholder="Full Name" required
                                            errorMessage=""
                                            validate={{
                                                required: { value: true, errorMessage: "Name is mandatory" },
                                            }}
                                        />
                                    </AvGroup>
                                </Col>

                                <Col md={12}>
                                    <AvGroup className="form-group position-relative">
                                        <Label for="email">Email<span className="text-danger">*</span></Label>
                                        <AvField type="email" className="form-control" value={recEmail} name="recEmail" id="recEmail" onChange={this.onChangeText} placeholder="Enter Email Id" required
                                            errorMessage=""
                                            validate={{
                                                required: { value: true, errorMessage: "Email Id is mandatory" },
                                            }}
                                        />
                                    </AvGroup>
                                </Col>
                                <Col md={12}>
                                    <p style={{ color: 'blue' }}>{this.state.recommendationResponse}</p>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm="12">
                                    <LaddaButton
                                        loading={loaderRecommendation}
                                        className="submitBnt btn btn-primary pull-right"
                                        data-color="#eee"
                                        data-size={XL}
                                        data-style={SLIDE_UP}
                                        data-spinner-size={30}
                                        data-spinner-color="#ddd"
                                        data-spinner-lines={12}
                                    >
                                        Send
                                </LaddaButton>
                                    {' '}
                                    <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                                </Col>
                            </Row>


                        </AvForm >

                    </ModalBody>
                </Modal>
                {
                    this.props.isLoading ? (
                        <Modal className="spinner-modal" isOpen={true}>
                            <Spinner animation="border" />
                        </Modal>
                    ) : ''
                }

                <Modal isOpen={isModalVisible} role="dialog" autoFocus={true} centered={true}>
                    {
                        errorMessage !== '' ? (

                            <ModalBody>
                                <div className="text-center" style={{ padding: 30, }}>
                                    <p className="title mb-1 font16">{errorMessage}</p>
                                    <p className="text-muted para-desc mx-auto mb-4">{errorDescription}</p>
                                    <Button color="secondary" onClick={this.resetError}>Close</Button>
                                </div>
                            </ModalBody>

                        ) : (
                            <ModalBody>
                                <div className="text-center" style={{ padding: 30 }}>
                                    <p className="title mb-1 font16">Success</p>
                                    <p className="text-muted para-desc mx-auto mb-4">You have successfully sent recommendation invite. </p>
                                    <Button color="secondary" onClick={this.toggleModal}>Ok</Button>
                                </div>
                            </ModalBody>
                        )
                    }
                </Modal>
                <Modal isOpen={isSelectedRecModalVisible} role="dialog" autoFocus={true} centered={true}>
                    <ModalBody>

                        <div className="component-wrapper rounded" >
                            <div className="p-4 border-bottom">
                                <p className="title mb-0">Recommendation Status</p>
                            </div>

                            <div className="p-4">
                                <Alert color="success">
                                    <p className="alert-heading font16">{selectedRecommendation.name}</p>
                                    <p>{selectedRecommendation.email}</p>
                                    <p>{selectedRecommendation.isCommentPublic ? selectedRecommendation.comment : "Comment is Pending"}</p>
                                </Alert>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.hideSelectedRecModal}>Close</Button>
                    </ModalFooter>
                </Modal>
            </Fragment>

        )
    }

}

function mapStateToProps(state) {
    return {
        isSentRecommendation: state.profile.isSentRecommendation,
        allRecommendations: state.profile.allRecommendations,
        recommendationResponse: state.profile.recommendationResponse,
        isRecommendationResend: state.profile.isRecommendationResend,
        userDetails: state.profile.userDetails
    }
}
export default connect(mapStateToProps, { ...ProfileAction })(Recommendation)
