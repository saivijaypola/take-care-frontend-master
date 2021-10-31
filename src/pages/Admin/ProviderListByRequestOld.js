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
    TabContent, TabPane, Nav, NavItem, NavLink,
    Table

} from "reactstrap";
import classnames from 'classnames';
import { ProfileAction, UserActions, RequestActions, AdminActions } from '../../redux/actions';
import AdminCandidateCard from '../../components/Shared/CandidateCard/AdminCandidateCard';
import marker from "../../images/icon/location-marker.svg";
import _ from "lodash";
import { QuoteCard } from '../../components/Shared/AdminComponents/QuoteCard';
import "./AdminStyle.css"
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
            activeTab: "1",
        }
    }

    componentDidMount() {

        console.log("location", this.props.location.search)
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
            filters: [],
            requestId: {
                requestId: this.props.match.params.requestid
            }
        })

        this.props.getAllResponds({
            requestId: this.props.match.params.requestid
        })

        this.props.getActiveChatResponse(
            {
                requestId: this.props.match.params.requestid
            }
        )

        // this.props.getRespondsFromProvider({ requestId: this.state.selectedRequestId })


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

    }
    componentWillUnmount() {

    }
    componentDidUpdate(prevProps) {
        //is employment stored 
        const { selectedPost, listFilter, isLoading, nearByProviders, providers, requestDetails, allPosts } = this.props;




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
    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }
    _renderProviders(provider, index) {

        return (<div className="item" key={index} > <AdminCandidateCard key={index} data={provider} {...this.props} /></div >)
    }

    render() {

        const { providers, isLoading, requestDetails, allResponds, activeChats } = this.props;
        return (<React.Fragment>
            <section style={{ paddingTop: 80 }} className="purple-backdrop purple-bg">
                <Container>
                    <Nav pills className="nav-justified vertipadd">
                        <NavItem>
                            <NavLink
                                className={classnames({ activeadmin: this.state.activeTab === '1' })}
                                onClick={() => { this.toggle('1'); }}
                            >
                                Provider List
          </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ activeadmin: this.state.activeTab === '2' })}
                                onClick={() => { this.toggle('2'); }}
                            >
                                Quote Information
          </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ activeadmin: this.state.activeTab === '3' })}
                                onClick={() => { this.toggle('3'); }}
                            >
                                Active Chats
          </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1" className="p-3">
                            <Row>
                                <Col lg="12" xs="12" >
                                    <Row className="" > {!isLoading && providers && providers.length > 0 ? (
                                        providers.map((provider, index) =>
                                            <Col lg="4" key={index} >

                                                <AdminCandidateCard key={index}
                                                    data={provider}
                                                    selectedPost={requestDetails} {...this.props} /> </Col >
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

                                                </div >
                                        }

                                        </div>
                                    }



                                    </Row>


                                </Col>

                            </Row>
                        </TabPane>
                        <TabPane tabId="2" className="p-3">
                            <Row>
                                {!_.isEmpty(allResponds) && allResponds.length > 0 &&
                                    allResponds.map((data, index) =>
                                        <Col lg="4" key={data.serviceOrderId} >
                                            <QuoteCard data={data} key={data.serviceOrderId} />
                                        </Col>

                                    )
                                }
                            </Row>
                        </TabPane>
                        <TabPane tabId="3" className="p-3">
                            <Table hover>
                                <thead>
                                    <tr>
                                        <th>User Id</th>
                                        <th>Full Name</th>
                                        <th>Phone Number</th>
                                        <th>About Me</th>
                                        <th>Is Active</th>
                                        <th>Chat Initiated</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {!_.isEmpty(activeChats) && activeChats.length > 0 &&
                                        activeChats.map((data, index) =>
                                            <tr>
                                                <td>{data.userId}</td>
                                                <td>{data.fullname}</td>
                                                <td>{data.phoneNumber}</td>
                                                <td>{data.aboutme}</td>
                                                <td>{data.isActive ? 'Active' : 'Not Active'}</td>
                                                <td>{data.chatInititated ? 'Initiated' : 'Not Initiated'}</td>
                                            </tr>

                                        )
                                    }
                                </tbody>
                            </Table>
                        </TabPane>

                    </TabContent>

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
    activeFilterMessage: state.user.activeFilterMessage,
    allResponds: state.admin.allResponds,
    activeChats: state.admin.activeChats
})

const mapDispatchToProps = {
    ...ProfileAction,
    ...UserActions,
    ...RequestActions,
    ...AdminActions
}

export default connect(mapStateToProps, mapDispatchToProps)(ProviderListByRequest)