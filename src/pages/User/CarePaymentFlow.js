import React, { Component } from 'react'
import { connect } from 'react-redux'
import OwlCarousel from 'react-owl-carousel';
import firebase from "firebase";
import { v4 as uuidv4 } from 'uuid';
import { Link, Redirect } from "react-router-dom";
import {
    Container, Row, Col, Spinner, Modal

} from "reactstrap";

import { ProfileAction, UserActions, RequestActions } from '../../redux/actions';

import JobCard from '../../components/Shared/JobCard/JobCard';
import JobDetail from '../../components/Shared/JobDetail/JobDetail';
import CandidateCard from '../../components/Shared/CandidateCard/CandidateCard';
import CarePaymentTabs from './CarePaymentTabs'
// import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
// import 'react-html5-camera-photo/build/css/index.css';
import right from "../../images/icon/right.svg";

import Userbox from '../../components/Shared/Userbox';

export class CarePaymentFlow extends Component {
    constructor(props) {

        super(props);
        this.state = {
            activeJobId: '',
            allPosts: [],
            selectedCare: []
        }

    }

    componentDidMount() {
        window.scrollTo(0, 0)
        if (this.props.careDetails && this.props.careDetails && this.props.careDetails.length > 0) {
            let selectedCareDetails = this.props.careDetails.filter(data => data.careId === this.props.match.params.careid)
            this.setState({
                selectedCare: selectedCareDetails
            })
        }

    }
    
    _renderProviders(provider, index) {

        return (
            <div className="item" key={index}> <CandidateCard key={index} data={provider} {...this.props} /></div>
        )
    }
    render() {
        console.log('REQ DETAILS', this.props.careRequestDetails);
        const { userDetails, careRequestDetails, chatId } = this.props;
        const { selectedCare } = this.state
        return (
            <React.Fragment>
                <section style={{ paddingTop: 30 }} className="purple-backdrop">
                    <Container>
                        {
                            selectedCare && selectedCare[0] && careRequestDetails && careRequestDetails ? (
                                <CarePaymentTabs userDetails={userDetails} serviceDetails={selectedCare[0]} requestDetails={careRequestDetails} {...this.props} />
                            ) : <p>Loading....</p>
                        }
                    </Container>
                </section>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    userDetails: state.profile.userDetails,
    isUserLoad: state.profile.isUserLoad,
    providerDetails: state.request.providerDetails,
    allPosts: state.user.allPosts,
    isLoading: state.user.isLoading,
    selectedPost: state.user.selectedPost,
    avatarUrl: state.profile.userDetails && state.profile.userDetails.avatarUrl,
    careDetails: state.admin.carePackageDetails,
    careRequestDetails: state.admin.careRequestDetails,
})

const mapDispatchToProps = {
    ...ProfileAction,
    ...UserActions,
    ...RequestActions
}

export default connect(mapStateToProps, mapDispatchToProps)(CarePaymentFlow)
