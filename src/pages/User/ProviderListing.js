import React, { Component } from 'react'
import { connect } from 'react-redux'
import OwlCarousel from 'react-owl-carousel';
import firebase from "firebase";
import { Link, Redirect } from "react-router-dom";
import {
    Container,
    Row,
    Col,
    Spinner,
    Modal

} from "reactstrap";

import { ProfileAction, UserActions, RequestActions } from '../../redux/actions';

import JobCard from '../../components/Shared/JobCard/JobCard';
import JobDetail from '../../components/Shared/JobDetail/JobDetail';
import CandidateCard from '../../components/Shared/CandidateCard/CandidateCard';
import marker from "../../images/icon/location-marker.svg";
// import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
// import 'react-html5-camera-photo/build/css/index.css';
import right from "../../images/icon/right.svg";

import Userbox from '../../components/Shared/Userbox';

export class UserProfile extends Component {
    constructor(props) {

        super(props);
        this.state = {
            activeJobId: '',
            allPosts: [],
            selectedFilter: 'All',
            selectedRequestId: '',
            requestId: "",
            isInitialrender: true
        }
    }

    componentDidMount() {
        var myCustomFilter = {
            filterBy: 'quotesOnly',
            spiffyMin: 1,
            spiffyMax: 5,
            profilePic: false,
            likeValue: "",
            showFull: false,
            isStrict: false
        }
        var selectedPost = this.props.selectedPost ? this.props.selectedPost : JSON.parse(localStorage.getItem('selectedPost'))
        console.log('SELECTED POST', selectedPost)
        this.setState({
            isInitialrender: true
        })
        var myFilter = localStorage.getItem('filter')
        if (!myFilter) {
            console.log("NO FILTER FOUND")

            this.props.updateFilters(myCustomFilter)
        } else {
            myCustomFilter = JSON.parse(localStorage.getItem('filter'))
        }
        if (this.props.match.params.type != "new") {
            switch (myCustomFilter.filterBy) {
                case "quotesOnly": this.props.setActiveFilterMessage("Filtered by Offers")
                    break;
                case "rejectedOnly": this.props.setActiveFilterMessage("Rejected Offers")
                    break;
                case "": this.props.setActiveFilterMessage("Showing All Results")
                    break;
            }
            if (myCustomFilter && myCustomFilter.filterBy == "") {
                switch (myFilter.likeValue) {
                    case "liked": this.props.setActiveFilterMessage("Liked Providers")
                        break;
                    case "disliked": this.props.setActiveFilterMessage("Disliked Providers")
                        break;
                    case "": this.props.setActiveFilterMessage("Showing All Results")
                        break;
                }
            }
            // this.props.setActiveFilterMessage(myCustomFilter.filterBy === "quotesOnly" ? "Filtered by Offers" : "Showing All Results")
            this.props.getProviders({
                locationData: {
                    "user_latitude": selectedPost && selectedPost.latitude,
                    "user_longitude": selectedPost && selectedPost.longitude,
                    "user_radius": process.env.REACT_APP_PROVIDER_RADIUS ? parseFloat(process.env.REACT_APP_PROVIDER_RADIUS) : 40000
                },
                filters: myCustomFilter,
                requestId: {
                    requestId: this.props.match.params.requestid
                }
            })
        }
        // this.props.getRespondsFromProvider({ requestId: this.state.selectedRequestId })
        if (this.props.match.params.type != "new") {
            // this.props.resetProviders()
        }
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
                this.props.getRequestDetails({ requestId: this.props.match.params.requestid })
            })

            if (this.props.match.params.requestid) {
                this.setState({
                    selectedRequestId: this.props.match.params.requestid
                })

                //Fetch providers who responded if any response from providers

            }
        }

        window.scrollTo(0, 0)
    }
    componentWillUnmount() {
        // var filters = {
        //     filterBy: "quotesOnly",
        //     spiffyMin: 1,
        //     spiffyMax: 5,
        //     profilePic: false,
        //     likeValue: "",
        //     showFull: false,
        //     isStrict: false
        // }
        // this.props.updateFilters(filters)
    }
    componentDidUpdate(prevProps) {
        //is employment stored 
        const { selectedPost, listFilter, isLoading, nearByProviders, providers, requestDetails, allPosts } = this.props;
        if (prevProps.allPosts !== allPosts) {
            this.setState({
                allPosts: allPosts
            })
        }

        if (localStorage.getItem('role') && this.props && prevProps.allPosts !== allPosts && allPosts.length === 0) {
            this.props.history.push('/user/new-request')
        }

        if (prevProps.requestDetails !== requestDetails && requestDetails) {

        }
        // alert(providers && providers.length)
        if (selectedPost && providers && providers.length === 0 && listFilter.filterBy === 'quotesOnly' && listFilter && !listFilter.isStrict && this.state.isInitialrender) {
            console.log('FILTER CHANGED TO SHOW ALL')
            this.setState({
                isInitialrender: false
            })
            this.props.setActiveFilterMessage("Showing All Results")
            var filters = {
                filterBy: "",
                spiffyMin: listFilter.spiffyMin,
                spiffyMax: listFilter.spiffyMax,
                profilePic: listFilter.profilePic,
                likeValue: listFilter.likeValue,
                showFull: true,
                isStrict: false
            }
            this.props.updateFilters(filters)
            this.props.getProviders({
                locationData: {
                    "user_latitude": selectedPost && selectedPost.latitude,
                    "user_longitude": selectedPost && selectedPost.longitude,
                    "user_radius": process.env.REACT_APP_PROVIDER_RADIUS ? parseFloat(process.env.REACT_APP_PROVIDER_RADIUS) : 40000
                },
                filters: {
                    filterBy: "",
                    spiffyMin: listFilter.spiffyMin,
                    spiffyMax: listFilter.spiffyMax,
                    profilePic: listFilter.profilePic,
                    likeValue: listFilter.likeValue,
                    showFull: true,
                    isStrict: false
                },
                requestId: {
                    requestId: this.props.match.params.requestid
                }
            })
        }


    }
    _renderProviders(provider, index) {

        return (<div className="item" key={index} > <CandidateCard key={index} data={provider} {...this.props} /></div >)
    }
    render() {

        const { userDetails, nearByProviders, providers, isLoading, selectedPost, requestDetails } = this.props;
        const { allPosts } = this.state
        return (
            <React.Fragment>
                <section style={{ paddingTop: 60 }} className="whitegrad-bg">
                    <Container>
                        <Row>
                            <Col lg="12" xs="12" >
                                <Row className="" > {!isLoading && providers && providers.length > 0 ? (
                                    providers.map((provider, index) =>
                                        <Col lg="4" key={index} >
                                            <CandidateCard key={index}
                                                data={provider}
                                                selectedPost={requestDetails} {...this.props} /> </Col>
                                    )

                                ) :
                                    <div> {
                                        isLoading ? (<Modal className="spinner-modal" isOpen={true} >
                                            <Spinner style={{ margin: "10px auto" }} animation="border" />
                                        </Modal>

                                        ) : providers && providers.length == 0 &&
                                        <div style={{ padding: 50, justifyContent: 'center', textAlign: 'center' }} >
                                            {
                                                this.props.activeFilterMessage && this.props.activeFilterMessage == "Showing All Results"
                                                    ?
                                                    <p style={{ color: '#fff' }}> Currently,
                                                        there are no service providers in this area. <br />
                                                        A YoCo Care specialist will get in touch with you soon to help you with this service request. </p>
                                                    :
                                                    <p style={{ color: '#fff' }}> No service providers were found for your request. try changing your filters</p>

                                            }

                                        </div>
                                    }

                                    </div>
                                }



                                </Row>


                            </Col>

                        </Row> <br />
                    </Container> </section> </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    userDetails: state.profile.userDetails,
    isUserLoad: state.profile.isUserLoad,
    allPosts: state.user.allPosts,
    listFilter: state.user.listFilter,
    isLoading: state.user.isLoading,
    requestDetails: state.request.requestDetails && state.request.requestDetails,
    selectedPost: state.request.selectedPost ? state.request.selectedPost : JSON.parse(localStorage.getItem('selectedPost')),
    avatarUrl: state.profile.userDetails && state.profile.userDetails.avatarUrl,
    nearByProviders: state.user.nearByProviders,
    providers: state.user.providers,
    responds: state.user.responds,
    requestDetails: state.request.requestDetails,
    activeFilterMessage: state.user.activeFilterMessage
})

const mapDispatchToProps = {
    ...ProfileAction,
    ...UserActions,
    ...RequestActions
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile)