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
import PaymentTabs from './PaymentTabs'
// import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
// import 'react-html5-camera-photo/build/css/index.css';
import right from "../../images/icon/right.svg";

import Userbox from '../../components/Shared/Userbox';

export class PaymentFlow extends Component {
    constructor(props) {

        super(props);
        this.state = {
            activeJobId: '',
            allPosts: []
        }
        this.enableChat = this.enableChat.bind(this)

    }

    enableChat() {
        this.props.enableChat({
            chatid: uuidv4(),
            requestId: this.props.match.params.requestid,
            userid: localStorage.getItem('userId'),
            providerid: this.props.match.params.providerid,
            isactive: true
        })
    }
    async componentDidMount() {


        this.props.getRequestDetails({
            requestId: this.props.match.params.requestid
        })

        this.enableChat()

        if (localStorage.getItem('role') !== null) {
            var that = this
            // firebase.auth().onAuthStateChanged(function (user) {

            //     if (user.uid === localStorage.getItem('userId') && localStorage.getItem('role') === 'user') {

            //     }
            // })
            if (that.props.selectedPost && that.props.selectedPost) {
                // that.props.getNearByProviders(
                //     {
                //         locationData: {
                //             "user_latitude": that.props.selectedPost.latitude,
                //             "user_longitude": that.props.selectedPost.longitude,
                //             "user_radius": process.env.REACT_APP_PROVIDER_RADIUS ? parseFloat(process.env.REACT_APP_PROVIDER_RADIUS) : 40000
                //         }
                //     })
            }
        }
        window.scrollTo(0, 0)
    }
    componentDidUpdate(prevProps, prevState) {
        //is employment stored 
        const { allPosts, serviceDetails, requestDetails } = this.props;

        if (prevProps.allPosts !== allPosts) {
            this.setState({
                allPosts: allPosts
            })
        }

        if (prevProps.requestDetails !== requestDetails) {
            this.props.getServiceDetails({
                requestid: this.props.match.params.requestid, providerid: this.props.match.params.providerid
            })
        }
        const { selectedPost, isLoading, nearByProviders } = this.props;

        // if (localStorage.getItem('role') && this.props && prevProps.allPosts !== allPosts && allPosts.length === 0) {
        //     this.props.history.push('/user/new-request')
        // }

        if (selectedPost && prevProps.selectedPost !== selectedPost) {
            // this.props.getNearByProviders({
            //     locationData:{
            //     "user_latitude": selectedPost.latitude,
            //     "user_longitude": selectedPost.longitude,
            //     "user_radius": process.env.REACT_APP_PROVIDER_RADIUS ? parseFloat(process.env.REACT_APP_PROVIDER_RADIUS) : 40000
            // }})
        }
    }
    _renderProviders(provider, index) {

        return (
            <div className="item" key={index}> <CandidateCard key={index} data={provider} {...this.props} /></div>
        )
    }
    render() {

        const { userDetails, nearByProviders, isLoading, selectedPost, serviceDetails, requestDetails, chatId } = this.props;
        const { allPosts } = this.state
        return (
            <React.Fragment>
                <section style={{ paddingTop: 30 }} className="purple-backdrop">
                    <Container>
                        {
                            serviceDetails && requestDetails && chatId ? (
                                <PaymentTabs userDetails={userDetails} serviceDetails={serviceDetails} chatId={chatId} requestDetails={requestDetails} {...this.props} />
                            ) : <p>Loading</p>
                        }
                    </Container>
                </section>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    serviceDetails: state.request.serviceDetails,
    requestDetails: state.request.requestDetails,
    userDetails: state.profile.userDetails,
    isUserLoad: state.profile.isUserLoad,
    providerDetails: state.request.providerDetails,
    allPosts: state.user.allPosts,
    isLoading: state.user.isLoading,
    selectedPost: state.user.selectedPost,
    avatarUrl: state.profile.userDetails && state.profile.userDetails.avatarUrl,
    nearByProviders: state.user.nearByProviders,
    chatId: state.request.chatId
})

const mapDispatchToProps = {
    ...ProfileAction,
    ...UserActions,
    ...RequestActions
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentFlow)
