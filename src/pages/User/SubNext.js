import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Container, Row, Col, Modal, Button, ModalBody } from "reactstrap";
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
import user from "../../images/icon/user-6.png";
import house from "../../assets/images/icon/house.png";
import next from "../../images/icon/next-grad.png";
import FloatingInput from '../../components/Shared/GeoSuggest/FloatingInput';
import { getDistance } from 'geolib';
import { CircularProgress } from '@material-ui/core';
import ReadMoreReact from 'read-more-react';
import { isEmpty } from 'lodash';
import yoco_req from "../../images/icon/yoco_requests.png";

const assetsBaseUrl = process.env.REACT_APP_ASSETS_BASE_URL

class SubSuccess extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
        this.navigateCareDetails = this.navigateCareDetails.bind(this)
        this.navigateCareProviderDetails = this.navigateCareProviderDetails.bind(this)
    }


    componentDidMount() {
        this.props.getAllCareDetailsByRequestId({ requestId: this.props.match.params.requestid })
        this.props.getRequestDetailsByRequestId({ requestId: this.props.match.params.requestid })
        window.scrollTo(0, 0)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.careDetails !== this.props.careDetails && prevProps.careDetailsSuccess !== this.props.careDetailsSuccess) {
            const ordersCare = this.props.careDetails && this.props.careDetails.filter(care => care.status === 'Confirmed')
            if (ordersCare.length > 0 && this.props.careDetailsSuccess === true) {
                this.navigateCareDetails(ordersCare[0].careId)
            }
        }
    }

    navigateCareDetails = (careId) => {
        this.props.history.push(`/care-details-new/${this.props.match.params.requestid}/${careId}`);
        this.props.resetCareDetailsStatus(false)
    }

    navigateCareProviderDetails = (careId, provider, index) => {
        this.props.history.push({
            pathname: `/care-provider-details/${this.props.match.params.requestid}/${careId}`,
            state: {tab: index, provider: provider}
        });
        this.props.resetCareDetailsStatus(false)
    }


    renderCareDetails = (data) => {

        return data && data.map((careData, index) => {
            let monthlySum = careData.tblCareProvidersByCareId.nodes.reduce((a, b) => a = a + b.monthlyFee, 0);
            let perVisitSum = careData.tblCareProvidersByCareId.nodes.reduce((a, b) => a = a + b.perVisitCharge, 0);
            let oneTimeFeeSum = careData.tblPackagePricingsByCareId.nodes.reduce((a, b) => a = a + b.amount, 0);
            let crvFee = careData.crvFee
            let totalUserCurrencyAmount = careData.tblCareProvidersByCareId.nodes.reduce((a, b) => a = a + b.totalAmountByUser, 0);
            let totalPayable = (totalUserCurrencyAmount + oneTimeFeeSum + crvFee)
            if (careData.status !== 'draft') {
                return (
                    <Col md="4" style={{ paddingBottom: 10 }}>
                        <div className="category-card-new">
                            <div className="care-description-wrapper">
                                <p className="bold font14" style={{ fontSize: 26, color: '#efefef' }}>{careData.careTitle} </p>
                                <div className="" style={{ height: 60 }}>
                                    <h6 style={{ color: '#efefef' }} className="font-title">{careData.careDescription}</h6>
                                </div>
                            </div>
                            <div class="custom-shape-divider-top-1631787174">
                                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" class="shape-fill"></path>
                                </svg>
                            </div>

                            <div style={{ height: 150 }}>
                                {careData.tblCareProvidersByCareId && careData.tblCareProvidersByCareId.nodes && careData.tblCareProvidersByCareId.nodes.map((serviceItem, index) =>
                                    <Col>
                                        <Row style={{ paddingBottom: 10 }}>
                                            <Col xs='4' style={{ height: 70, }}>
                                                <img style={{ width: 70, height: 70, borderRadius: '50%' }} src={serviceItem.tblUserByProviderId.avatarUrl !== '' ? `${assetsBaseUrl}/Users/${serviceItem.tblUserByProviderId.userId}/Avatar/${serviceItem.tblUserByProviderId.avatarUrl}` : user} className='hover-grow-1 pointer' onClick={() => this.navigateCareProviderDetails(careData.careId, serviceItem, index)}></img>
                                            </Col>
                                            <Col xs='8' style={{ height: 70, paddingTop: 15}}>
                                                <h6><b>{serviceItem.tblUserByProviderId && serviceItem.tblUserByProviderId.fullname}</b></h6>
                                                <p>{serviceItem.supportDescription}</p>
                                            </Col>
                                        </Row>
                                    </Col>
                                )}
                            </div>
                            <div className="text-center">
                                <hr />
                                <Row>
                                    {careData.optedMtp ?
                                        <Col xs="6">
                                            <h6 style={{ fontSize: 14, marginTop: 5 }} className="font-title"><b>Meet The Parent:</b> <b style={{ color: 'green' }}>PAID</b></h6>
                                        </Col>
                                        :
                                        <Col xs="6"></Col>}
                                    <Col className="pointer hover-grow-2" xs onClick={() => this.navigateCareDetails(careData.careId)}>
                                        <Row style={{ float: 'right', marginRight: 20, marginTop: 10 }}>
                                            <h6 style={{ color: '#5e2490', fontSize: 16 }} ><b>Details</b></h6>
                                            <img src={next} style={{ width: 20, height: 20, marginTop: -2 }} />
                                        </Row>
                                    </Col>
                                </Row>
                            </div>

                        </div>

                    </Col>
                )
            }
        })
    }




    render() {
        const { careDetails, isLoading } = this.props;
        const confirmedCare = careDetails.filter(care => care.status !== 'draft')
        return (
            <React.Fragment>

                <section className="whitegrad-bg">
                    <Container>
                        <Row>

                            {

                                !isLoading && careDetails && careDetails.length > 0 ?
                                    this.renderCareDetails(confirmedCare)
                                    :
                                    !isLoading && isEmpty(confirmedCare) ?
                                        <div className="zero-request">
                                            <img src={yoco_req} style={{ width: 100 }} />
                                            <p style={{ textAlign: 'center', marginBottom: 2, fontSize:16 }}><b>Your package, custom-made by your Care Specialist, is on its way!  </b></p>
                                            <p style={{ textAlign: 'center', fontSize:16 }}>We appreciate your patience. </p>
                                        </div>
                                        :
                                        <div className="loader-wrapper">
                                            <CircularProgress size={60} thickness={5} color="primary" />
                                        </div>


                            }


                        </Row>
                    </Container>
                </section>
            </React.Fragment >
        );
    }
}

const mapStateToProps = (state) => ({

    delights: state.request.delights,
    delight: state.request.delight,
    selectedLocation: state.profile.selectedLocation,
    careDetails: state.admin.carePackageDetails,
    isLoading: state.admin.isLoading,
    careDetailsSuccess: state.admin.careDetailsSuccess
})

const mapDispatchToProps = {
    ...RequestActions,
    ...ProfileAction,
    ...UserActions,
    ...AdminActions
}

export default connect(mapStateToProps, mapDispatchToProps)(SubSuccess)
