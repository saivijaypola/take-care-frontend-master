import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Container, Row, Col, Modal, Button, ModalBody, ModalFooter, ModalHeader, Table, Nav,
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
import help2 from "../../images/icon/help-2.png";

const assetsBaseUrl = process.env.REACT_APP_ASSETS_BASE_URL

class CareDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCare: [],
            isPricing: true,
            activeProviderTab: 0,
            activeTimelineTab: 0,
            activeTab: 'serviceTab',
            selectedCareProvider: [],
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
            optedMtp: false,
            providerTotal: 0,
            isHelpModalVisible: false,
            isInfoModalOpen: false
        }
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
                    selectedCareProvider: this.state.selectedCare[0].tblCareProvidersByCareId && this.state.selectedCare[0].tblCareProvidersByCareId.nodes[0],
                    providerTotal: providerTotal,
                    oneTimeFeeSum: oneTimeFeeSum + crvFee,
                    totalPayableAmount: (providerTotal + oneTimeFeeSum + crvFee),
                    amountPayable: (providerTotal + oneTimeFeeSum + crvFee),
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
            amountPayable: this.state.optedMtp ? this.state.totalPayableAmount : this.state.mtpAmount,
            optedMtp: !this.state.optedMtp
        })
    }

    onClickNo = () => {
        this.setState({
            amountPayable: this.state.totalPayableAmount,
            optedMtp: false
        })
    }

    onClickPB = () => {
        this.setState({
            isInfoModalOpen: true
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

    toggleModal = () => {
        this.setState({
            isHelpModalVisible: !this.state.isHelpModalVisible
        })
    }

    toggleInfoModal = () => {
        this.setState({
            isInfoModalOpen: !this.state.isInfoModalOpen
        })
    }

    render() {
        const { selectedCare, isPricing, activeProviderTab, selectedCareProvider } = this.state;
        const { careRequestDetails, careDetails, careOrders } = this.props;
        console.log('SELECTED CARE PROVIDER', selectedCareProvider);
        console.log('CARE ORDERS', careOrders);
        return (
            <React.Fragment>
                <section style={{ paddingTop: 20 }} className="purple-backdrop purple-bg">
                    <div className="provider-top-bar">
                        <Container>
                            <Row>
                                <Col onClick={() => { selectedCare[0] && selectedCare[0].status === 'Confirmed' ? this.props.history.push(`/user/orders`) : this.props.history.goBack(); }} xs="2" md='1' className="relative">
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
                                <div className="requests-container" style={{ backgroundColor: '#fff', borderRadius: 20, marginBottom: 10 }}>
                                    <Row>
                                        {!_.isEmpty(this.state.metaData) && this.state.metaData !== null ?
                                            <Col md="12">
                                                <Row>
                                                    <Col xs="12" style={{ marginLeft: 10 }}>
                                                        <div className="provider-box-main-wrapper" >
                                                            {selectedCare[0] && selectedCare[0].tblCareProvidersByCareId && selectedCare[0].tblCareProvidersByCareId.nodes.map((data, index) =>
                                                                careRequestDetails && careRequestDetails !== null && data !== null && (
                                                                    <div className={`request-details-profile provider-box-wrapper ${index === activeProviderTab ? 'active-box' : ''}`} onClick={() => { this.toggleProvider(index, data); }}>
                                                                        <Row>
                                                                            <Col xs="12" md="12" className="box-wrapper">
                                                                                <p className="bold font16">{data.tblUserByProviderId.fullname}</p>
                                                                                <p style={{ marginTop: -8, fontSize:14 }} className="text">{data.supportDescription}</p>
                                                                            </Col>
                                                                        </Row>
                                                                    </div>
                                                                )
                                                            )}

                                                        </div>
                                                        {selectedCare[0] && careRequestDetails && this.state.metaData && careOrders && careOrders.length > 0 && this.props.match.params.careid && selectedCare[0].tblCareProvidersByCareId && selectedCare[0].tblCareProvidersByCareId.nodes.length > 0 &&
                                                            <Timeline myRequestDetails={careRequestDetails} orderDetails={careOrders.filter(x => x.careProviderId === selectedCareProvider.careProviderId)} serviceDetails={selectedCareProvider} {...this.props} chatId={this.props.match.params.careid} />
                                                        }
                                                    </Col>
                                                </Row>
                                            </Col>
                                            :
                                            <Col md="12" xs="12" sm="12">
                                                <Nav pills className="nav-justified profile-tabs vertipadd">
                                                    <NavItem>
                                                        <NavLink
                                                            className={classnames({ active: this.state.activeTab === 'serviceTab' }) + ""}
                                                            onClick={() => { this.toggle('serviceTab'); }}
                                                        >
                                                            <div className="text-center pt-1 pb-1">
                                                                <p style={{ color: this.state.activeTab === 'serviceTab' && '#fff' }} className="title font16 font-weight-normal mb-0">SERVICES DETAILS</p>
                                                            </div>
                                                        </NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink
                                                            className={classnames({ active: this.state.activeTab === 'pricingTab' }) + " rounded"}
                                                            onClick={() => { this.toggle('pricingTab'); }}
                                                        >
                                                            <div className="text-center pt-1 pb-1">

                                                                {this.state.metaData && this.state.metaData.orderStatus == "Confirmed" ?
                                                                    <p style={{ color: this.state.activeTab === 'pricingTab' && '#fff' }} className="title font16 bold font-weight-normal mb-0">ORDER</p>
                                                                    :
                                                                    <p style={{ color: this.state.activeTab === 'pricingTab' && '#fff' }} className="title font16 font-weight-normal mb-0">PRICING</p>
                                                                }
                                                            </div>
                                                        </NavLink>
                                                    </NavItem>
                                                    {/* <NavItem>
                                                        <NavLink
                                                            className={classnames({ active: this.state.activeTab === 'spTab' }) + ""}
                                                            onClick={() => { this.toggle('spTab'); }}
                                                        >
                                                            <div className="text-center pt-1 pb-1">
                                                                <h4 className="title font-weight-normal mb-0">PROVIDER PROFILES</h4>
                                                            </div>
                                                        </NavLink>
                                                    </NavItem> */}
                                                </Nav>
                                                <TabContent activeTab={this.state.activeTab}>
                                                    <TabPane tabId='spTab' className="p-3">
                                                        <>
                                                            {/* List all selected providers */}
                                                            <div className="provider-box-main-wrapper" >
                                                                {selectedCare[0] && this.uniqueCareProvider(selectedCare[0].tblCareProvidersByCareId && selectedCare[0].tblCareProvidersByCareId.nodes, x => x.providerId).map((data, index) =>
                                                                    careRequestDetails && careRequestDetails !== null && data !== null && (
                                                                        <div className={`request-details-profile provider-box-wrapper ${index === activeProviderTab ? 'active-box' : ''}`} onClick={() => { this.toggleProvider(index, data); }}>
                                                                            <Row>
                                                                                <Col xs="12" md="12" className="box-wrapper">
                                                                                    <img src={data.tblUserByProviderId.avatarUrl !== '' ? `${assetsBaseUrl}/Users/${data.tblUserByProviderId.userId}/Avatar/${data.tblUserByProviderId.avatarUrl}` : user}></img>
                                                                                    <p style={{fontSize: 14, fontWeight:"bold"}}>{data.tblUserByProviderId.fullname}</p>
                                                                                </Col>
                                                                            </Row>
                                                                        </div>
                                                                    )
                                                                )}

                                                            </div>
                                                            <div>
                                                                {/* Provider Details  */}
                                                                {
                                                                    selectedCareProvider.tblUserByProviderId && selectedCareProvider.tblUserByProviderId && (
                                                                        <div>
                                                                            <Col xs="6" md="6">
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
                                                                                                        <p className="bold font14">{edu.degreeTitle} - {edu.fromYear} - {edu.toYear}</p>
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
                                                                                                        <p className="bold font14"> {emp.jobTitle} @ {emp.companyName} </p>
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
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>
                                                        </>

                                                    </TabPane>
                                                    <TabPane tabId='serviceTab' className="p-3">
                                                        <div>
                                                            {selectedCare[0] && selectedCare[0].tblCareProvidersByCareId && selectedCare[0].tblCareProvidersByCareId.nodes.map((data, index) =>
                                                                <>
                                                                    <p className="bold font14 profile-sections">
                                                                        <img style={{ width: 80, height: 80, borderRadius: '50%', paddingRight: 10 }} src={data.tblUserByProviderId.avatarUrl !== '' ? `${assetsBaseUrl}/Users/${data.tblUserByProviderId.userId}/Avatar/${data.tblUserByProviderId.avatarUrl}` : user}></img>{data.tblUserByProviderId.fullname}</p>
                                                                    <div className="provider-profile-card">
                                                                        <Row>
                                                                            <Col md="12">
                                                                                <p style={{fontSize:14, fontWeight:"bold"}}>Service Supported</p>
                                                                                <p>{data.supportDescription}</p>
                                                                                <br />
                                                                                <p style={{fontSize:14, fontWeight:"bold"}}>Service Details</p>                                                                               <p>{data.briefDescription}</p>
                                                                                <br />
                                                                                <p style={{fontSize:14, fontWeight:"bold"}}>YoCo Comments</p>
                                                                                <p>{data.yocoComments}</p>
                                                                            </Col>
                                                                        </Row>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </TabPane>
                                                    <TabPane tabId='pricingTab' className="p-3">
                                                        {/* Payment Terms  */}
                                                        <div>
                                                            <h5 className="bold profile-sections">
                                                                <img src={termsIcon}></img>Payment Terms</h5>
                                                            <div
                                                                dangerouslySetInnerHTML={{
                                                                    __html: selectedCare[0] && selectedCare[0].paymentTerms
                                                                }}></div>
                                                            <Row style={{ padding: 5, paddingLeft: 15 }}>
                                                                <h5 style={{ fontSize: 14 }} className="bold">Start Date:&nbsp;</h5><h5 style={{ fontSize: 14 }} className="font-title">TBD</h5>
                                                            </Row>
                                                            <Row style={{ padding: 5, paddingLeft: 15 }}>
                                                                <h5 style={{ fontSize: 14 }} className="bold">Cancellation:&nbsp;</h5><h5 style={{ fontSize: 14 }} className="font-title">20 Day Notice</h5>
                                                            </Row>
                                                            {/* <p>{this.state.pricingTerms}</p> */}

                                                        </div>
                                                        <hr />
                                                        {/* Provider Fee */}
                                                        <div >
                                                            <h5 className="bold profile-sections">
                                                                <img src={invoice}></img>Service Fee</h5>
                                                            {selectedCare[0] && selectedCare[0].tblCareProvidersByCareId && selectedCare[0].tblCareProvidersByCareId.nodes.map((data, index) => {
                                                                return (<>
                                                                    <table className="care-pricing table request-table ">
                                                                        <tr>
                                                                            <td><span className="">{data.tblUserByProviderId.fullname}</span></td>
                                                                            <td><span className="bold">{`${selectedCare[0] && selectedCare[0].userCurrency} ${parseFloat(data.totalAmountByUser).toFixed(2)}`}</span></td>
                                                                        </tr>
                                                                    </table>
                                                                </>
                                                                )
                                                            })}
                                                            <br />
                                                            {
                                                                <Modal isOpen={this.state.isInfoModalOpen}>
                                                                    <ModalHeader>
                                                                        <h5 className="bold purple-text">
                                                                            Price Breakdown
                                                                        </h5>
                                                                    </ModalHeader>
                                                                    <ModalBody>
                                                                        {selectedCare[0] && selectedCare[0].tblCareProvidersByCareId && selectedCare[0].tblCareProvidersByCareId.nodes.map((data, index) => {
                                                                            let providerFee = ((data.monthlyFee + data.yocoServiceCharge) / data.currencyRate).toFixed(2)
                                                                            let perVisitCharge = (data.perVisitCharge / data.currencyRate.toFixed(2))
                                                                            return (<>
                                                                                <h6 className="pricing-provider-head">{`Provider : ${data.tblUserByProviderId.fullname}`}</h6>
                                                                                <table className="care-pricing table request-table ">
                                                                                    <tr>
                                                                                        <td><span className="">Monthly Fee</span></td>
                                                                                        <td><span className="bold">{`${selectedCare[0] && selectedCare[0].userCurrency} ${parseFloat(providerFee).toFixed(2)}`}</span></td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td><span className="">Per Visit Fee</span></td>
                                                                                        <td><span className="bold">{selectedCare[0] && selectedCare[0].userCurrency} {parseFloat(perVisitCharge).toFixed(2)}</span></td>
                                                                                    </tr>
                                                                                    {parseInt(data.noOfVisits) !== 0 &&
                                                                                        <tr>
                                                                                            <td><span className="">No Of Visit Specified</span></td>
                                                                                            <td><span className="bold">{parseInt(data.noOfVisits)}</span></td>
                                                                                        </tr>
                                                                                    }
                                                                                    <hr />
                                                                                    <tr>
                                                                                        <td><span className="">Total Payable</span></td>
                                                                                        <td><span className="bold">{selectedCare[0] && selectedCare[0].userCurrency} {parseFloat(data.totalAmountInr / data.currencyRate).toFixed(2)}</span></td>
                                                                                    </tr>
                                                                                    <hr />
                                                                                </table>
                                                                            </>
                                                                            )
                                                                        })}

                                                                        <h6 className="pricing-provider-head">One Time Fee:</h6>
                                                                        <table className="table request-table care-pricing">
                                                                            <tr>
                                                                                <td><span className="">Criminal Record Verification</span></td>
                                                                                <td><span className="bold">{selectedCare[0] && selectedCare[0].userCurrency} {parseFloat(selectedCare[0] && selectedCare[0].noOfCrv && (parseInt(selectedCare[0].crvFee) * parseInt(selectedCare[0].noOfCrv))).toFixed(2)}</span></td>
                                                                            </tr>
                                                                            {selectedCare[0] && selectedCare[0].tblPackagePricingsByCareId && selectedCare[0].tblPackagePricingsByCareId.nodes.filter(x => x.priceItem !== 'MEET THE PARENT').map((data, index) => {
                                                                                if (parseInt(data.amount) !== 0) {
                                                                                    return (
                                                                                        <tr>
                                                                                            <td><span className="">{data.priceItem}</span></td>
                                                                                            <td><span className="bold">{selectedCare[0] && selectedCare[0].userCurrency} {parseFloat(data.amount).toFixed(2)}</span></td>
                                                                                        </tr>
                                                                                    )
                                                                                }
                                                                            }

                                                                            )}
                                                                            <hr />
                                                                            <tr>
                                                                                <td><span className="price-span-title"><span>Total Amount</span></span></td>
                                                                                <td><span className="bold price-span">{`${selectedCare[0] && selectedCare[0].userCurrency} ${parseFloat(this.state.totalPayableAmount).toFixed(2)}`}</span></td>
                                                                            </tr>
                                                                        </table>
                                                                        <br />
                                                                    </ModalBody>
                                                                    <ModalFooter>
                                                                        <Row style={{ width: "100%" }}>
                                                                            <Col xs="12">
                                                                                <Button onClick={this.toggleInfoModal} className="close-button purple-button">
                                                                                    Close
                                                                                </Button>
                                                                            </Col>
                                                                        </Row>

                                                                    </ModalFooter>
                                                                </Modal>
                                                            }
                                                        </div>
                                                        {/* One Time fee  */}
                                                        <div>
                                                            <h5 className="bold profile-sections">
                                                                <img src={invoice}></img>One Time Fee</h5>
                                                            <table className="table request-table care-pricing">
                                                                <tr>
                                                                    <td><span className="">Criminal Record Verification</span></td>
                                                                    <td><span className="bold">{selectedCare[0] && selectedCare[0].userCurrency} {parseFloat(selectedCare[0] && selectedCare[0].crvFee).toFixed(2)} x {selectedCare[0] && selectedCare[0].noOfCrv > 0 && selectedCare[0].noOfCrv} {selectedCare[0] && selectedCare[0].noOfCrv > 0 && selectedCare[0].noOfCrv === 1 ? 'Provider' : 'Providers'}</span></td>
                                                                </tr>
                                                                {selectedCare[0] && selectedCare[0].tblPackagePricingsByCareId && selectedCare[0].tblPackagePricingsByCareId.nodes.filter(x => x.priceItem !== 'MEET THE PARENT').map((data, index) => {
                                                                    if (parseInt(data.amount) !== 0) {
                                                                        return (
                                                                            <tr>
                                                                                <td><span className="">{data.priceItem}</span></td>
                                                                                <td><span className="bold">{selectedCare[0] && selectedCare[0].userCurrency} {parseFloat(data.amount).toFixed(2)}</span></td>
                                                                            </tr>
                                                                        )
                                                                    }
                                                                }

                                                                )}
                                                            </table>
                                                            <br />

                                                        </div>
                                                        <hr />
                                                        <div>

                                                            <table className="table request-table care-pricing">

                                                                <tr>
                                                                    <td><span className="price-span-title"><span>Total Amount</span></span></td>
                                                                    <td><span className="bold price-span">{`${selectedCare[0] && selectedCare[0].userCurrency} ${parseFloat(this.state.totalPayableAmount).toFixed(2)}`}</span></td>
                                                                </tr>
                                                                <tr>
                                                                    <td></td>
                                                                    <td><span className="pointer" onClick={() => this.onClickPB()} style={{ fontSize: 12 }}><u>View Price Breakdown</u></span></td>
                                                                </tr>
                                                            </table>
                                                            <br />

                                                        </div>
                                                        {/* Meet The Parent  */}
                                                        {selectedCare[0] && selectedCare[0].optedMtp !== true &&
                                                            <div className="provider-profile-card" style={{ backgroundColor: '#fcf2e9', borderColor: '#fdd9b6' }}>
                                                                <h5 className="bold profile-sections">
                                                                    <img src={invoice}></img>Optional Service</h5>
                                                                <table className="table request-table care-pricing">

                                                                    <tr>
                                                                        <td><span className="">Meet The Parent</span></td>
                                                                        <td><span className="bold">{selectedCare[0] && selectedCare[0].userCurrency} {parseFloat(selectedCare[0].mtpFee).toFixed(2)} x {selectedCare[0] && selectedCare[0].noOfMtp > 0 && selectedCare[0].noOfMtp} {selectedCare[0] && selectedCare[0].noOfMtp > 0 && selectedCare[0].noOfMtp === 1 ? 'Provider' : 'Providers'}</span></td>
                                                                    </tr>

                                                                </table>
                                                                <br />
                                                                {
                                                                    <Modal isOpen={this.state.isHelpModalVisible} role="dialog" autoFocus={true} centered={true}>
                                                                        <ModalHeader>
                                                                            <h4 style={{ textAlign: 'center' }}>What is Meet The Parent?</h4>
                                                                        </ModalHeader>
                                                                        <ModalBody style={{ padding: 20 }}>
                                                                            <p>Before paying the fees mentioned above and confirming the subscription, get a meet-and-greet session arranged for your parent and the service provider. Only if both parties are comfortable with each other, you need to proceed.</p>
                                                                            <Button className="post-request" onClick={this.toggleModal}>Ok</Button>
                                                                        </ModalBody>
                                                                    </Modal>
                                                                }

                                                                <Col md="10">
                                                                    <Row>
                                                                        <p style={{ paddingRight: 35 }}>OPT FOR 'MEET THE PARENT' BEFORE CONFIRMING THE SUBSCRIPION&nbsp;<img onClick={() => this.toggleModal()} style={{ width: 30, height: 30 }} src={help2} /></p><br />
                                                                        {/* <button onClick={() => this.onClickYes()} className="yes-no-btn">Yes</button>
                                                                    <button onClick={() => this.onClickNo()} className="yes-no-btn">No</button> */}
                                                                        {this.state.optedMtp ?
                                                                            <label class="mtp-container">
                                                                                <input type="radio" name="mtp" checked onClick={() => this.onClickYes()} />
                                                                                <span class="mtp-checkmark"></span>
                                                                            </label>
                                                                            :
                                                                            <label class="mtp-container">
                                                                                <input type="radio" name="mtp" checked={false} onClick={() => this.onClickYes()} />
                                                                                <span class="mtp-checkmark"></span>
                                                                            </label>}
                                                                    </Row>
                                                                </Col>
                                                                <br />

                                                            </div>}
                                                        {/* Total   */}
                                                        {this.state.optedMtp !== null && selectedCare[0] && selectedCare[0].optedMtp !== true &&
                                                            <div className="text-center">

                                                                <br />
                                                                {/* <h4>To start your subscription you will pay the monthly fee and the one time fee. <br />You pay <span class="bold price-span">{`${'USD'} ${this.state.totalPayableAmount.toFixed(2)}`}</span> today</h4> */}
                                                                {this.state.optedMtp === true ?
                                                                    <h4 style={{ textAlign: 'center' }}>Pay <b>{selectedCare[0] && selectedCare[0].userCurrency} {this.state.mtpAmount}</b> and book 'Meet The Parent'</h4>
                                                                    :
                                                                    this.state.optedMtp === false &&
                                                                    <h4>Pay <b>{selectedCare[0] && selectedCare[0].userCurrency}    {this.state.totalPayableAmount}</b> and confirm the subscription</h4>
                                                                }

                                                                <button onClick={() => this.onClickPayNow()} style={{ marginTop: "20px !important" }} className="accept-pay accept-btn">Accept & Pay</button>
                                                            </div>

                                                        }
                                                        {
                                                            selectedCare[0] && selectedCare[0].optedMtp === true &&
                                                            <div className="text-center">

                                                                <hr />

                                                                <br />
                                                                {/* <h4>To start your subscription you will pay the monthly fee and the one time fee. <br />You pay <span class="bold price-span">{`${'USD'} ${this.state.totalPayableAmount.toFixed(2)}`}</span> today</h4> */}

                                                                <h4>Pay <b>{selectedCare[0] && selectedCare[0].userCurrency}    {this.state.totalPayableAmount}</b> and confirm the subscription</h4>

                                                                <button onClick={() => this.onClickPayNow()} style={{ marginTop: "20px !important" }} className="accept-pay accept-btn">Accept & Pay</button>
                                                            </div>
                                                        }

                                                    </TabPane>
                                                </TabContent>
                                            </Col>
                                        }
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

export default connect(mapStateToProps, mapDispatchToProps)(CareDetails)
