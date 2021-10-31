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
    Modal,
    Nav,
    NavItem,
    NavLink, TabContent,
    TabPane,

} from "reactstrap";
import classnames from 'classnames';
import { ProfileAction, UserActions, RequestActions } from '../../redux/actions';

import JobCard from '../../components/Shared/JobCard/JobCard';
import JobDetail from '../../components/Shared/JobDetail/JobDetail';
import AdminCandidateCard from '../../components/Shared/CandidateCard/AdminCandidateCard';
import marker from "../../images/icon/location-marker.svg";
import "./AdminStyle.css"
import providerData from './provider.json';
import { FormRowHorizontal } from './AdminStyled';


export class ProviderListByRequest extends Component {
    constructor(props) {

        super(props);
        this.state = {
            activeJobId: '',
            allPosts: [],
            selectedFilter: 'All',
            selectedRequestId: '',
            requestId: "",
            isInitialrender: true,
            activeTab: '1'
        }
        this.toggle = this.toggle.bind(this);

    }

    componentDidMount() {
        var myCustomFilter = {
            filterBy: '',
            spiffyMin: 1,
            spiffyMax: 5,
            profilePic: false,
            likeValue: "",
            showFull: true,
            isStrict: false,
            activeChat: false
        }
        var selectedPost = this.props.selectedPost ? this.props.selectedPost : JSON.parse(localStorage.getItem('selectedPost'))
        console.log('SELECTED POST', selectedPost)
        this.setState({
            isInitialrender: true
        })
        var myFilter = localStorage.getItem('filter')


        if (this.props.match.params.type != "new") {
            switch (myCustomFilter.filterBy) {
                case "quotesOnly": this.props.setActiveFilterMessage("Filtered by Offers")
                    break;
                case "rejectedOnly": this.props.setActiveFilterMessage("Rejected Offers")
                    break;
                case "": this.props.setActiveFilterMessage("Showing All Results")
                    break;
            }

            // this.props.setActiveFilterMessage(myCustomFilter.filterBy === "quotesOnly" ? "Filtered by Offers" : "Showing All Results")

            this.props.getProviders({
                locationData: {
                    "user_latitude": parseFloat(this.props.match.params.lat),
                    "user_longitude": parseFloat(this.props.match.params.lng),
                    "user_radius": process.env.REACT_APP_PROVIDER_RADIUS ? parseFloat(process.env.REACT_APP_PROVIDER_RADIUS) : 40000
                },
                filters: myCustomFilter,
                requestId: {
                    requestId: this.props.match.params.requestid
                }
            })
        }


        if (this.props.match.params.requestid) {
            this.setState({
                selectedRequestId: this.props.match.params.requestid
            }, () => {
                this.props.getRequestDetails({ requestId: this.props.match.params.requestid })
            })



        }



    }

    componentDidUpdate(prevProps) {
        //is employment stored 
        const { selectedPost, listFilter, isLoading, nearByProviders, providers, requestDetails, allPosts } = this.props;
        if (prevProps.allPosts !== allPosts) {
            this.setState({
                allPosts: allPosts
            })
        }



        // alert(providers && providers.length)
        if (providers && providers.length === 0 && listFilter.filterBy === 'quotesOnly' && listFilter && !listFilter.isStrict && this.state.isInitialrender) {
            console.log('FILTER CHANGED TO SHOW ALL')
            this.setState({
                isInitialrender: false
            })
            this.props.setActiveFilterMessage("Showing All Results")

            this.props.getProviders({
                locationData: {
                    "user_latitude": parseFloat(this.props.match.params.lat),
                    "user_longitude": parseFloat(this.props.match.params.lng),
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

        return (<div className="item" key={index} > <AdminCandidateCard key={index} data={provider} {...this.props} /></div>)
    }
    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    onNavigatePackageDetails = () => {
        this.props.history.push(`/admin/package/${this.props.match.params.requestid}`);
    }
    render() {

        const { userDetails, nearByProviders, providers, isLoading, selectedPost, requestDetails } = this.props;
        const { allPosts } = this.state
        return (<React.Fragment>

            <section style={{ paddingTop: 60 }} className="whitegrad-bg">
                <div style={{
                    marginTop: 20,
                    backgroundColor: '#e9d1fe'
                }}>
                    <Row>
                        <Col xs="12">
                            <JobDetail defaultFilter={this.state.selectedFilter} />
                        </Col>
                    </Row>
                </div>
                <Container>
                    <Row>
                        <Col lg="12" xs="12" >


                            <Row className="" > {!isLoading && providers && providers.length > 0 ? (
                                providers.map((provider, index) =>
                                    <Col md='4' key={index} >
                                        <AdminCandidateCard key={index}
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

export default connect(mapStateToProps, mapDispatchToProps)(ProviderListByRequest)