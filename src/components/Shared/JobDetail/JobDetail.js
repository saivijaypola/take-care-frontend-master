import React, { Component } from 'react'
import { connect } from 'react-redux'
import like from "../../../images/icon/like-1.png";
import marker from "../../../images/icon/marker.png";
import {
    Row, Col, Modal, Button
} from "reactstrap";
import { UserActions } from '../../../redux/actions';
import { Map } from '../Map/Map';
import Filter from '../../../components/Shared/Filter/Filter';
import liked from '../../../images/icon/like-filled.png'
import disliked from '../../../images/icon/dislike-filled.png'
import AdminFilter from '../Filter/AdminFilter';
export class JobDetail extends Component {

    constructor(props) {
        console.log("🚀 ~ file: JobDetail.js ~ line 16 ~ JobDetail ~ constructor ~ props", props)
        super(props)
        this.state = {
            isMapVisible: false,
            isMapModalVisible: false,
            displayString: "",
        }
        this.toggleMapVisibility = this.toggleMapVisibility.bind(this)
        this.toggleModal = this.toggleModal.bind(this)
    }
    componentDidMount() {
        // alert(this.props.location.pathname)
        if (this.props.listFilter && this.props.listFilter.filterBy === "quotesOnly" && this.props.listFilter) {
            this.setState({ displayString: "Filtered by Offers" })
        }
        if (this.props.listFilter && this.props.listFilter.profilePic) {
            this.setState({ displayString: "Filtered by profile quality" })
        }

    }
    componentDidUpdate(prevProps) {
        if (prevProps.listFilter !== this.props.listFilter) {

            if (this.props.listFilter && this.props.listFilter.showFull === false) {
                this.setState({ displayString: "Filtered by Offers" })
            }
            if (this.props.listFilter && this.props.listFilter.profilePic) {
                this.setState({ displayString: "Filtered by profile quality" })
            }
            if (this.props.listFilter && this.props.listFilter.showFull) {
                this.setState({ displayString: "" })
            }
        }
    }
    toggleMapVisibility() {
        this.setState({
            isMapVisible: !this.state.isMapVisible
        })
    }
    toggleModal() {
        this.setState({
            isMapModalVisible: !this.state.isMapModalVisible
        })
    }
    render() {
        const { selectedPost, nearByProviders, providers, defaultFilter } = this.props

        const { isMapModalVisible } = this.state
        return (
            <div className="job-detail">
                {
                    localStorage.getItem('role') !== 'admin' ?

                        selectedPost && (
                            <React.Fragment>
                                <div className="request-head">
                                    <Row>
                                        <Col xs="7">
                                            {/* <span style={{ marginRight: 15, fontSize: 13 }}> <span className="result-count">{providers && providers.length ? providers && providers.length : 0}</span> results</span>
                                        <a className="show-map" onClick={() => this.setState({ isMapModalVisible: !this.state.isMapModalVisible })}>
                                            <img src={marker}></img>
                                        Map</a> */}
                                            <p style={{ marginTop: 7 }} className="font-title">
                                                {this.props.activeFilterMessage == "Liked Providers" ?
                                                    <img src={liked} />
                                                    :
                                                    (
                                                        this.props.activeFilterMessage == "Disliked Providers" ?
                                                            <img src={disliked} />
                                                            :
                                                            this.props.activeFilterMessage
                                                    )
                                                }

                                            </p>

                                        </Col>
                                        <Col xs="5">
                                            <Filter {...this.props} requestId={selectedPost} />
                                        </Col>
                                    </Row>
                                </div>

                                <Modal className="map-modal" isOpen={this.state.isMapModalVisible}>
                                    <Map {...this.props} />
                                    <div style={{ cursor: 'pointer', borderRadius: 0, backgroundColor: '#6f2191', border: 0, textAlign: 'center', padding: 15, color: 'white' }} onClick={this.toggleModal}>Close</div>
                                </Modal>

                            </React.Fragment>
                        )
                        : (
                            <React.Fragment>
                                <div className="request-head">
                                    <Row>
                                        <Col xs="7">
                                            {/* <span style={{ marginRight: 15, fontSize: 13 }}> <span className="result-count">{providers && providers.length ? providers && providers.length : 0}</span> results</span>
                                        <a className="show-map" onClick={() => this.setState({ isMapModalVisible: !this.state.isMapModalVisible })}>
                                            <img src={marker}></img>
                                        Map</a> */}
                                            <p style={{ marginTop: 7 }} className="font-title">
                                                {
                                                    this.props.activeFilterMessage

                                                }

                                            </p>

                                        </Col>
                                        <Col xs="5">
                                            <AdminFilter {...this.props} requestId={localStorage.getItem('selectedPost') !== null ? JSON.parse(localStorage.getItem('selectedPost')) : []} />
                                        </Col>
                                    </Row>
                                </div>

                                <Modal className="map-modal" isOpen={this.state.isMapModalVisible}>
                                    <Map {...this.props} />
                                    <div style={{ cursor: 'pointer', borderRadius: 0, backgroundColor: '#6f2191', border: 0, textAlign: 'center', padding: 15, color: 'white' }} onClick={this.toggleModal}>Close</div>
                                </Modal>

                            </React.Fragment>
                        )
                }

            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    selectedPost: state.user.selectedPost,
    allPosts: state.user.allPosts,
    listFilter: state.user && state.user.listFilter,
    isLoading: state.user.isLoading,
    nearByProviders: state.user.nearByProviders,
    providers: state.user.providers,
    activeFilterMessage: state.user.activeFilterMessage,
    requestDetails: state.request.requestDetails,

})



const mapDispatchToProps = {
    ...UserActions
}

export default connect(mapStateToProps, mapDispatchToProps)(JobDetail)
