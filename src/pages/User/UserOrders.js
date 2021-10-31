import React, { Component } from 'react'
import { connect } from 'react-redux'
import OwlCarousel from 'react-owl-carousel';
import firebase from "firebase";
import { Link, Redirect } from "react-router-dom";
import {
    Container, Row, Col, Spinner, Modal

} from "reactstrap";

import { ProfileAction, UserActions } from '../../redux/actions';

import JobCard from '../../components/Shared/JobCard/JobCard';
import JobDetail from '../../components/Shared/JobDetail/JobDetail';
import CandidateCard from '../../components/Shared/CandidateCard/CandidateCard';
// import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
// import 'react-html5-camera-photo/build/css/index.css';
import right from "../../images/icon/right.svg";

import Userbox from '../../components/Shared/Userbox';

export class UserOrders extends Component {
    constructor(props) {

        super(props);
        this.state = {
            activeJobId: '',
            allPosts: []
        }

    }

    async componentDidMount() {

        var isFirstTime = localStorage.getItem('isReturningUser', false)
        if (!isFirstTime) {
            this.setState({
                showTutorialModal: true
            }, () => localStorage.setItem('isReturningUser', true))
        }
        if (localStorage.getItem("userId") !== null) {
            this.setState({
                profileModal: true,
                userId: localStorage.getItem("userId")
            }, () => {
                //  this.props.getAllRequests({ id: this.state.userId })
                // this.props.getUserProfileById({
                //     userId: this.state.userId
                // })

            })
        }
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
        const { allPosts } = this.props;
        if (prevProps.allPosts !== allPosts) {
            this.setState({
                allPosts: allPosts
            })
        }
        const { selectedPost, isLoading, nearByProviders } = this.props;

        // if (localStorage.getItem('role') && this.props && prevProps.allPosts !== allPosts && allPosts.length === 0) {
        //     this.props.history.push('/user/new-request')
        // }

        // if (selectedPost && prevProps.selectedPost !== selectedPost) {
        //     this.props.getNearByProviders({
        //         "user_latitude": selectedPost.latitude,
        //         "user_longitude": selectedPost.longitude,
        //         "user_radius": process.env.REACT_APP_PROVIDER_RADIUS ? process.env.REACT_APP_PROVIDER_RADIUS : 40000
        //     })
        // }
    }
    _renderProviders(provider, index) {

        return (
            <div className="item" key={index}> <CandidateCard key={index} data={provider} {...this.props} /></div>
        )
    }
    render() {

        const { userDetails, nearByProviders, isLoading, selectedPost } = this.props;
        const { allPosts } = this.state
        return (
            <React.Fragment>
                <section className='whitegrad-bg'>
                    <Container>
                        <br />
                        <Row>
                            <Col lg="12">
                                <div className="cards-container">

                                    {
                                        this.state.userId && (
                                            <JobCard {...this.props} userId={this.state.userId} isActive={true} sourceOfPage="user-order"></JobCard>

                                        )
                                    }
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
    allPosts: state.user.allPosts,
    isLoading: state.user.isLoading,
    selectedPost: state.user.selectedPost,
    avatarUrl: state.profile.userDetails && state.profile.userDetails.avatarUrl,
    nearByProviders: state.user.nearByProviders
})

const mapDispatchToProps = {
    ...ProfileAction,
    ...UserActions
}

export default connect(mapStateToProps, mapDispatchToProps)(UserOrders)
