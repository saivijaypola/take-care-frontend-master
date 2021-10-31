import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Container, Row, Col, Modal, Button, ModalBody, Table, Nav,
    NavItem,
    NavLink, TabContent,
    TabPane,
} from "reactstrap";
import OwlCarousel from 'react-owl-carousel';
import { ProfileAction, RequestActions, UserActions, AdminActions } from '../../redux/actions';
import { connect } from 'react-redux'
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { v4 as uuidv4 } from 'uuid';
import './style.css'
import viewquote from "../../images/icon/viewquote.png";
import message from '../../images/icon/message-yellow.png'
import rejected from '../../images/icon/rejected.svg'
import envelope from "../../images/icon/chat-2.png";
import house from "../../assets/images/icon/house.png";
import FloatingInput from '../../components/Shared/GeoSuggest/FloatingInput';
import { getDistance } from 'geolib';
import ProviderCardForCare from '../../components/Shared/AdminComponents/ProviderCardForCare';
import RequestResponse from '../../components/Shared/Request/RequestResponse';
import classnames from 'classnames';
import like from "../../images/icon/like.svg";
import dislike from "../../images/icon/dislike.svg";
import likeFilled from "../../images/icon/like-filled.png";
import dislikeFilled from "../../images/icon/dislike-filled.png";
import hat from "../../images/icon/hat.png";
import back from "../../images/icon/back.png";
import suitcase from "../../images/icon/suitcase.png";
import providerIcon from "../../images/icon/service-provider.svg";
import invoice from "../../images/icon/invoice.svg";
import termsIcon from "../../images/icon/accepted.svg";
import Timeline from '../../components/Shared/Timeline/CareUserTimeline';
import firebase from "firebase";
import _ from "lodash";
import exclamation from "../../images/icon/exclamation.png";
import user from "../../images/icon/user-6.png";
import UserStatus from '../../components/Shared/UserStatus/Userstatus'
import { th } from 'date-fns/locale';

const assetsBaseUrl = process.env.REACT_APP_ASSETS_BASE_URL

class CareProviderDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCare: [],
            isPricing: true,
            activeProviderTab: this.props.location.state.tab,
            activeTimelineTab: 0,
            activeTab: 'spTab',
            selectedCareProvider: this.props.location.state.provider,
            selectedCareOrder: [],
            monthlyFee: 0,
            perVisitFee: 0,
            oneTimeFee: 0,
            totalPayableAmount: 0,
            mtpAmount: 0,
            pricingTerms: `All prices are cover the service charges. Any incidental expenses like medicines, 
            lab tests,doctor charges etc. will be charged extra as per actuals.`,
            metaData: null,
            amountPayable: 0,
            optedMtp: null
        }
        console.log('PROPS', this.props.location.state);
        this.toggle = this.toggle.bind(this)
        this.toggleProvider = this.toggleProvider.bind(this)
        this.initializeTimeline = this.initializeTimeline.bind(this)
        this.onClickYes = this.onClickYes.bind(this)
        this.onClickNo = this.onClickNo.bind(this)
    }


    componentDidMount() {
        window.scrollTo(0, 0)

        if (this.props.careDetails && this.props.careDetails && this.props.careDetails.length > 0) {
            let selectedCareDetails = this.props.careDetails.filter(data => data.careId === this.props.match.params.careid)
            console.log("🚀 ~ file: CareDetails.js ~ line 72 ~ CareDetails ~ componentDidMount ~ selectedCareDetails", selectedCareDetails)
            this.setState({
                selectedCare: selectedCareDetails
            }, () => {
                let providerTotal = this.state.selectedCare[0].tblCareProvidersByCareId.nodes.reduce((a, b) => a = a + b.totalAmountByUser, 0);
                let oneTimeFeeSum = this.state.selectedCare[0].tblPackagePricingsByCareId.nodes.reduce((a, b) => a = a + b.amount, 0);
                let mtpFee = this.state.selectedCare[0].mtpFee * this.state.selectedCare[0].noOfMtp;
                let crvFee = this.state.selectedCare[0].crvFee * this.state.selectedCare[0].noOfCrv;

                this.setState({
                    oneTimeFeeSum: oneTimeFeeSum + crvFee,
                    totalPayableAmount: (providerTotal + oneTimeFeeSum + crvFee),
                    mtpAmount: mtpFee,
                })
                if (selectedCareDetails[0] && selectedCareDetails[0].optedMtp === true) {
                    this.setState({
                        amountPayable: (providerTotal + oneTimeFeeSum + crvFee)
                    })
                }

            })
        }
        this.initializeTimeline()
        var params = {
            "careId": this.props.match.params.careid
        }
        this.props.getAllCareOrders(params)
        // this.props.getAllCareDetailsByRequestId({ requestId: this.props.match.params.requestid })
        // this.props.getRequestDetailsByRequestId({ requestId: this.props.match.params.requestid })
    }

    // componentDidUpdate(prevProps){
    //     const careDetails = this.props
    //     if(prevProps.careDetails !== careDetails && careDetails && careDetails.length > 0){
    //         let selectedCareDetails = this.props.careDetails.filter(data => data.careId === this.props.match.params.careid)
    //         this.setState({
    //             selectedCare: selectedCareDetails
    //         })
    //     }
    // }

    componentDidUpdate(prevProps) {

        if (prevProps.careOrders !== this.props.careOrders) {
            this.initializeTimeline()
        }
    }

    initializeTimeline() {
        if (this.props.match.params.careid) {
            var careId = this.props.match.params.careid
            if (careId && this.props.careOrders && this.props.careOrders.length > 0) {
                const metadataRef = firebase.database().ref('Care/' + careId + '/Metadata/');
                metadataRef.on('value', snapshot => {
                    const getMetadata = snapshot.val();
                    this.setState({
                        metaData: getMetadata,
                        activeTab: 'pricingTab'
                    })
                })
            }
        }
    }

    toggleProvider(tab, careData) {
        if (this.state.activeProviderTab !== tab) {
            this.setState({
                activeProviderTab: tab,
                selectedCareProvider: careData
            });
        }
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    onClickYes = () => {
        this.setState({
            amountPayable: this.state.mtpAmount,
            optedMtp: true
        })
    }

    onClickNo = () => {
        this.setState({
            amountPayable: this.state.totalPayableAmount,
            optedMtp: false
        })
    }

    onClickPayNow = () => {
        this.props.setMtpOpted(this.state.optedMtp)
        this.props.history.push(`/user/care-payment/${this.state.selectedCare[0].requestId}/${this.props.match.params.careid}`)
    }

    uniqueCareProvider = (data, key) => {
        return [
            ...new Map(
                data.map(x => [key(x), x])
            ).values()
        ]
    }

    render() {
        const { selectedCare, isPricing, activeProviderTab, selectedCareProvider } = this.state;
        const { careRequestDetails, careDetails, careOrders } = this.props;

        return (
            <React.Fragment>
                <section style={{ paddingTop: 20 }} className="whitegrad-bg">
                    <div className="provider-top-bar">
                        <Container>
                            <Row>
                                <Col onClick={() => {
                                    selectedCare[0] && selectedCare[0].status === 'Confirmed' ?
                                        this.props.history.push(`/user/orders`) : this.props.history.goBack();
                                }} xs="2" md='1' className="relative">
                                    <Row>
                                        <img src={back} />
                                        <span>Back</span>
                                    </Row>
                                </Col>
                                <Col xs='1' md='1'></Col>
                                <Col xs="9" md='10'>
                                    <h6 style={{ fontSize: 18 }} className="bold">{`${careRequestDetails && careRequestDetails.title}-${selectedCare[0] && selectedCare[0].careTitle}`}</h6>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                    <Container className="mt-lg-3">
                        <Row>
                            <Col md="12" xs="12" sm="12">
                                <div className="requests-container card-shadow" style={{ backgroundColor: '#fff', borderRadius: 20, marginBottom: 30 }}>
                                    <Row>
                                        <Col md="12">

                                            <>
                                                {/* List all selected providers */}
                                                <div xs="4" className="provider-box-main-wrapper" >
                                                    {selectedCare[0] && this.uniqueCareProvider(selectedCare[0].tblCareProvidersByCareId && selectedCare[0].tblCareProvidersByCareId.nodes, x => x.providerId).map((data, index) =>
                                                        careRequestDetails && careRequestDetails !== null && data !== null && (
                                                            <div className={`request-details-profile provider-box-wrapper ${index === activeProviderTab ? 'active-box' : ''}`} onClick={() => { this.toggleProvider(index, data); }}>
                                                                <Row>
                                                                    <Col xs="12" md="12" className="box-wrapper">
                                                                        <p style={{fontSize:16, fontWeight:"bold"}}>{data.tblUserByProviderId.fullname}</p>
                                                                        <p style={{ marginTop: -8 }} className="text font14">{data.supportDescription}</p>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        )
                                                    )}

                                                </div>
                                                <div style={{paddingBottom: 20}}>
                                                    {/* Provider Details  */}
                                                    {
                                                        selectedCareProvider.tblUserByProviderId && selectedCareProvider.tblUserByProviderId && (
                                                            <div>
                                                                <Col xs="12" md="8" lg="6">
                                                                    <RequestResponse data={selectedCareProvider.tblUserByProviderId} myRequestDetails={[]} />
                                                                </Col>
                                                                <p style={{ fontSize: 14, lineHeight: 1.29, marginTop: 10 }} className="font-title">{selectedCareProvider.tblUserByProviderId.aboutme}</p>
                                                                {
                                                                    selectedCareProvider.tblUserByProviderId.tblEducationsByUserId && selectedCareProvider.tblUserByProviderId.tblEducationsByUserId.nodes && selectedCareProvider.tblUserByProviderId.tblEducationsByUserId.nodes.length > 0 ?
                                                                        (< div >
                                                                            <p className="bold font14 profile-sections">
                                                                                <img src={hat}></img>Education</p>
                                                                            {selectedCareProvider.tblUserByProviderId.tblEducationsByUserId.nodes && selectedCareProvider.tblUserByProviderId.tblEducationsByUserId.nodes.map((edu, index) =>
                                                                                <div className="provider-profile-card">
                                                                                    <Row>
                                                                                        <Col md="12">
                                                                                            <p className="font14">{edu.degreeTitle} - {edu.fromYear} - {edu.toYear}</p>
                                                                                            <p style={{ marginBottom: 3 }} className="font-title">{edu.college}</p>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </div>
                                                                            )}
                                                                        </div>)
                                                                        :
                                                                        <div >
                                                                            <p className="bold font14 profile-sections">
                                                                                <img src={hat}></img>Education</p>
                                                                            <p className="font-title">Education details not entered by provider</p>
                                                                        </div>
                                                                }
                                                                {
                                                                    selectedCareProvider.tblUserByProviderId.tblEmploymentsByUserId && selectedCareProvider.tblUserByProviderId.tblEmploymentsByUserId.nodes && selectedCareProvider.tblUserByProviderId.tblEmploymentsByUserId.nodes.length > 0 ?
                                                                        (< div >
                                                                            <p className="bold font14 profile-sections">
                                                                                <img src={suitcase}></img>
                                                                                        Employment</p>
                                                                            {selectedCareProvider.tblUserByProviderId.tblEmploymentsByUserId && selectedCareProvider.tblUserByProviderId.tblEmploymentsByUserId.nodes && selectedCareProvider.tblUserByProviderId.tblEmploymentsByUserId.nodes.length > 0 && selectedCareProvider.tblUserByProviderId.tblEmploymentsByUserId.nodes.map((emp, index) =>
                                                                                <div className="provider-profile-card">
                                                                                    <Row>
                                                                                        <Col md="12">
                                                                                            <p className="font14"> {emp.jobTitle} @ {emp.companyName} </p>
                                                                                            <span className="font-title">{emp.fromYear} - {emp.toYear}</span>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </div>
                                                                            )}
                                                                        </div>)
                                                                        :
                                                                        <div >
                                                                            <p className="bold font14 profile-sections">
                                                                                <img src={suitcase}></img>Employment</p>
                                                                            <p className="font-title">Employment details not entered by provider</p>
                                                                        </div>
                                                                }
                                                                {
                                                                    selectedCareProvider.tblUserByProviderId && selectedCareProvider.tblUserByProviderId.tblTrainingsByUserId && selectedCareProvider.tblUserByProviderId.tblTrainingsByUserId.nodes.length > 0 ?
                                                                        (< div >
                                                                            <p className="bold font14 profile-sections">
                                                                                <img src={suitcase}></img>
                                                                                            Training</p>
                                                                            {selectedCareProvider.tblUserByProviderId.tblTrainingsByUserId.nodes.map((edu, index) =>
                                                                                <div className="provider-profile-card">
                                                                                    <Row>
                                                                                        <Col md="12">
                                                                                            <p className="font14"> {edu.title} from {edu.issuingAuthority} </p>
                                                                                            <p>{edu.description}</p>
                                                                                            <span className="font-title">{edu.year}</span>
                                                                                        </Col>
                                                                                    </Row>

                                                                                </div>
                                                                            )}
                                                                        </div>)
                                                                        :
                                                                        <div >
                                                                            <p className="bold font14 profile-sections">
                                                                                <img src={suitcase}></img>Training</p>
                                                                            <p className="font-title">No specific training or certification entered by provider</p>
                                                                        </div>
                                                                }
                                                                {
                                                                    <div >
                                                                        <p className="bold font14 profile-sections">
                                                                            <img src={hat}></img>Recommendations</p>
                                                                        <p className="font-title">No recommendations available for the provider</p>
                                                                    </div>
                                                                }
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            </>


                                        </Col>
                                    </Row>
                                </div>

                            </Col>


                            <Col md="12" xs="12" sm="12">

                            </Col>




                        </Row>
                    </Container>
                </section>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({

    careDetails: state.admin.carePackageDetails,
    isLoading: state.admin.isLoading,
    careRequestDetails: state.admin.careRequestDetails,
    isCareOrderCreated: state.request.isOrderCreated,
    orderId: state.request.orderId,
    isCareOrdersLoading: state.request.isCareOrdersLoading,
    careOrders: state.request.careOrders,
    mtpPaymentSuccess: state.user.mtpPaymentSuccess
})

const mapDispatchToProps = {
    ...RequestActions,
    ...ProfileAction,
    ...UserActions,
    ...AdminActions
}

export default connect(mapStateToProps, mapDispatchToProps)(CareProviderDetails)
