import React, { Component } from 'react'
import { connect } from 'react-redux'
import edit from "../../../images/icon/edit-2.png";
import tick from '../../../images/icon/maps-and-flags.png';
import warningRed from '../../../images/icon/warning_red.png';
import warningGreen from '../../../images/icon/warning_green.png';
import right from "../../../images/icon/chev-right.svg";
import yoco_req from "../../../images/icon/yoco_requests.png";
import location from "../../../images/icon/location-card.png";
import {
    Row, Col, Button, Modal, Spinner, ModalBody, Label
} from "reactstrap";
import { UserActions } from '../../../redux/actions';
import { Item } from 'semantic-ui-react';
import _, { isEmpty } from "lodash";
import moment from 'moment';

export class JobCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            modalDescription: '',
            modalInactiveVisible: false
        }
        this.onSelectItem = this.onSelectItem.bind(this)
        this.onEditItem = this.onEditItem.bind(this)
        this.onClickInactive = this.onClickInactive.bind(this)
        this.onClickOk = this.onClickOk.bind(this)
    }
    componentDidMount() {

        // this.props.getAllRequests({ id: localStorage.getItem('userId') })
        // this.props.getConfirmedRequests({ userId: localStorage.getItem('userId'), status: 'Confirmed' })
    }
    onSelectItem = (item, requestId) => {
        console.log("🚀 ~ file: JobCard.js ~ line 23 ~ JobCard ~ item", item)
        this.props.selectPost(item)
        const pathname = this.props.location.pathname;
        console.log('PATH NAME', pathname);

        if (item.isCareSubscription) {
            this.props.history.push(`/subscription-next/${requestId}`)
        } else {
            this.props.history.push(`/user/providers/${requestId}/list`)
            if (pathname.includes("/user/new-request")) {
                this.props.history.push('/user/requests')
            }
        }
    }
    onClickInactive = (item, requestId) => {
        if (item.status === 'Inactive') {
            this.setState({
                modalVisible: true,
                modalDescription: 'This request is Inactive. Please update the date of requirement of the service to re-activate the request.',
            })
        } else if (item.status === 'Cancelled') {
            this.setState({
                modalVisible: true,
                modalDescription: 'This request has been cancelled. Please post a new request to avail YoCo services.',
            })
        } else if (item.status === 'On Hold') {
            this.setState({
                modalVisible: true,
                modalDescription: 'This request has been put on hold. Please contact support to activate the request.',
            })
        }
    }
    onClickOk = (item, requestId) => {

        this.setState({
            modalVisible: false,
            modalDescription: ''
        })

    }
    onEditItem = (item, requestId) => {
        this.props.selectPost(item)
        this.props.history.push(`/user/new-post/${requestId}`)
        this.props.setEditRequest(true)
    }
    render() {
        const { allPosts, showingList, allConfirmedRequests, selectedPost, isLoading } = this.props
        return (
            <React.Fragment>
                <Row>
                    {
                        showingList === "All"
                            ?
                            (
                                !isLoading && allPosts && allPosts.length > 0 ? (
                                    allPosts.map((post, index) =>
                                        <Col key={index} sm='12' md="4"  >
                                            <div key={index} className="jobs-card hover-animate pointer inner-job" style={{backgroundColor: '#fff', margin: '6% 0%', height: 350, borderRadius: 6, boxShadow: "0px 3px 21px -1px #ddd"}}>
                                                <Row style={{ height: '10%' }}>
                                                    <Col>
                                                        <p className="bold font-title font16">{post.title}</p>
                                                    </Col>
                                                    {
                                                        post && post.status !== 'Cancelled' &&
                                                        <Col xs="2" md="2" lg="2">
                                                            <img onClick={() => this.onEditItem(post, post.requestId)} style={{ width: 20, float: "right" }} src={edit}></img>
                                                        </Col>
                                                    }
                                                </Row>
                                                <div style={{height: '90%', marginTop:15}} onClick={() => post.status === 'Active' ? this.onSelectItem(post, post.requestId) : this.onClickInactive(post, post.requestId)}>
                                                    <div style={{ height: '65%'}} className="text-overflow-fade">
                                                        <p className="font-title font-title">{post.description}</p>
                                                    </div>
                                                    <Row style={{ height: '15%' }}>
                                                        <Col xs="2" md="1" lg="1">
                                                            <img src={location} style={{ width: 20, float: 'left', marginRight: 5 }} />
                                                        </Col>
                                                        <Col>
                                                            <p className="font-title">{post.locationTitle}</p>
                                                        </Col>
                                                    </Row>
                                                    <div style={{ height: '5%', paddingTop: '2%' }}>
                                                        {
                                                            post && post.status && post.status === 'Active' ?
                                                                <div className='progress-bar-purple' style={{ height: 4, width: '100%' }}></div>
                                                                :
                                                                post && post.status && post.status === 'On Hold' ?
                                                                    <div className='progress-bar-orange' style={{ height: 4, width: '100%' }}></div>
                                                                    :
                                                                    post && post.status && post.status === 'Cancelled' ?
                                                                        <div className='progress-bar-red' style={{ height: 4, width: '100%' }}></div>
                                                                        :
                                                                        <div className='progress-bar-grey' style={{ height: 4, width: '100%' }}></div>
                                                        }
                                                    </div>
                                                    <Row>
                                                        <Col xs="6">
                                                            <span className="job-date">Needed on</span>
                                                            {
                                                                post.serviceNeedsOn ? <span className="job-date font-title">{moment(post.serviceNeedsOn).format('LL')}</span> :
                                                                    <span className="job-date font-title">Flexible</span>
                                                            }

                                                        </Col>
                                                        <Col xs="3">
                                                            <span className="job-date">Status</span>
                                                            {
                                                                post && post.status ? <span className="job-date font-title">{post.status}</span> :
                                                                    <></>
                                                            }

                                                        </Col>
                                                        <Col xs="3">
                                                            <span className="job-date">Offers</span>
                                                            {
                                                                post && post.quotesCount && post.status !== 'Cancelled' ? <span className="job-count zoom-in-out">{post.quotesCount}</span> :
                                                                    <span>0</span>
                                                            }
                                                        </Col>
                                                    </Row>
                                                    {
                                                        <Modal isOpen={this.state.modalVisible} role="dialog" autoFocus={true} centered={true}>
                                                            <ModalBody>
                                                                <div style={{ textAlign: 'center' }}>
                                                                    <p>{this.state.modalDescription}</p>
                                                                    <Button onClick={() => this.onClickOk(post, post.requestId)}>Okay</Button>
                                                                </div>
                                                            </ModalBody>
                                                        </Modal>
                                                    }
                                                </div>
                                            </div>
                                        </Col>

                                    )
                                ) :
                                    isLoading ? (
                                        <Modal className="spinner-modal" isOpen={true}>
                                            <Spinner style={{ margin: "10px auto" }} animation="border" />
                                        </Modal>
                                    ) :
                                        <div className="zero-request" >
                                            <img src={yoco_req} style={{ width: 100 }} />
                                            <p style={{ textAlign: 'center', marginBottom: 0, fontSize:13 }}><b>0 Requests Found</b></p>
                                            <p style={{ textAlign: 'center' }}>Post your first request to see the list of service providers who can help you with it </p>
                                            <Button onClick={() => this.props.history.push('/user/new-request')} className="post-request post-zero"> Post Request</Button>
                                        </div>
                            )
                            :
                            (
                                !isLoading && allConfirmedRequests && allConfirmedRequests.length > 0 ? (
                                    allConfirmedRequests.sort((a, b) => (a.createdAt > b.createdAt) - (a.createdAt < b.createdAt)).reverse().map((post, index) =>

                                        <Col key={index} md="4">
                                            <div key={index} className="jobs-card hover-animate pointer inner-job" style={{backgroundColor: '#fff', margin: '6% 0%', height: 350, borderRadius: 6, boxShadow: "0px 3px 21px -1px #ddd"}} onClick={() => this.onSelectItem(post, post.requestId)}>
                                                <Row style={{ height: '15%' }}>
                                                    <Col>
                                                        <p className="bold font-title font16">{post.title}</p>
                                                    </Col>
                                                    {
                                                        post && post.status === 'Approved' ?
                                                            <Col xs="2" md="2" lg="2">
                                                                <img style={{ width: 20, float: "right" }} src={tick}></img>
                                                            </Col>
                                                            :
                                                            post && post.status === 'Completed' &&
                                                            <Col xs="2" md="2" lg="2">
                                                                <img className="zoom-in-out" style={{ width: 20, float: "right" }} src={warningGreen}></img>
                                                            </Col>
                                                    }
                                                </Row>
                                                <div style={{ height: '50%' }} className="text-overflow-fade">
                                                    <p className="font-title font-title">{post.description}</p>
                                                </div>
                                                <Row style={{ height: '15%' }}>
                                                    <Col xs="2" md="1" lg="1">
                                                        <img src={location} style={{ width: 20, float: 'left', marginRight: 5 }} />
                                                    </Col>
                                                    <Col>
                                                        <p className="font-title">{post.locationTitle}</p>
                                                    </Col>
                                                </Row>
                                                <div style={{ height: '5%', paddingTop: '2%' }}>
                                                    {
                                                        post && post.status && post.status === 'Confirmed' ?
                                                            <div className='progress-bar-purple' style={{ height: 4, width: '100%' }}></div>
                                                            :
                                                            post && post.status && post.status === 'Approved' ?
                                                                <div className='progress-bar-grey' style={{ height: 4, width: '100%' }}></div>
                                                                :
                                                                post && post.status && post.status === 'Disputed' ?
                                                                    <div className='progress-bar-red' style={{ height: 4, width: '100%' }}></div>
                                                                    :
                                                                    post && post.status && post.status === 'Completed' ?
                                                                        <div className='progress-bar-green' style={{ height: 4, width: '100%' }}></div>
                                                                        :
                                                                        <div className='progress-bar-orange-2' style={{ height: 4, width: '100%' }}></div>
                                                    }
                                                </div>
                                                <Row>
                                                    <Col xs="6">
                                                        <span className="job-date">Needed on</span>
                                                        {
                                                            post.serviceNeedsOn ? <span className="job-date font-title">{moment(post.serviceNeedsOn).format('LL')}</span> :
                                                                <span className="job-date font-title">Flexible</span>
                                                        }

                                                    </Col>
                                                    <Col xs="6">
                                                        <span className="job-date">Status</span>
                                                        {
                                                            post && post.status && post.status !== 'Work Started' && post.status !== 'Active' ? <span className="job-date font-title">{post.status}</span> :
                                                                <span className="job-date font-title">In Progress</span>
                                                        }

                                                    </Col>
                                                </Row>
                                                {
                                                    <Modal isOpen={this.state.modalVisible} role="dialog" autoFocus={true} centered={true}>
                                                        <ModalBody>
                                                            <div style={{ textAlign: 'center' }}>
                                                                <p>{this.state.modalDescription}</p>
                                                                <Button onClick={() => this.onClickOk(post, post.requestId)}>Ok</Button>
                                                            </div>
                                                        </ModalBody>
                                                    </Modal>
                                                }
                                            </div>
                                        </Col>

                                    )
                                ) :
                                    isLoading ? (
                                        <Modal className="spinner-modal" isOpen={true}>
                                            <Spinner style={{ margin: "10px auto" }} animation="border" />
                                        </Modal>
                                    ) :
                                        <div className="zero-request" >
                                            <img src={yoco_req} style={{ width: 100 }} />
                                            <p style={{ textAlign: 'center', marginBottom: 0, fontSize:13 }}><b>0 Orders Found</b></p>
                                            <p style={{ textAlign: 'center' }}>Once you accept an offer from a service provider and pay for it, it becomes an order.<br /> Check your available offers right away in the 'Requests' tab. </p>
                                            {/* <Button onClick={() => this.props.history.push('/user/new-request')} className="post-request post-zero"> Check Later</Button> */}
                                        </div>
                            )
                    }
                </Row>

            </React.Fragment>

        )
    }
}

const mapStateToProps = (state) => ({
    selectedPost: state.user.selectedPost,
    allPosts: state.user.allPosts,
    showingList: state.request.showingList,
    isLoading: state.user.isLoading,
    allConfirmedRequests: state.user.allConfirmedRequests
})

const mapDispatchToProps = {
    ...UserActions,
}

export default connect(mapStateToProps, mapDispatchToProps)(JobCard)
