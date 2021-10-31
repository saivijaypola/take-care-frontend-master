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
import _ from "lodash";

import { AdminActions } from '../../redux/actions';

import CandidateCard from '../../components/Shared/CandidateCard/CandidateCard';
import { AdminCandidateCard } from '../../components/Shared/CandidateCard/AdminCandidateCard';
import { RequestContentWrapper, SearchWrapper, PaginationWrapper } from './AdminStyled'
import Pagination from "react-js-pagination";
import { CircularProgress } from '@material-ui/core';
import "./AdminStyle.css"
import assets from '../../assets/images';
export class AdminProviderList extends Component {
    constructor(props) {

        super(props);
        this.state = {
            providerList: [],
            pageSize: 30,
            offset: 1,
            activePage: 1,
            searchText: '',
            searchType: ''
        }
    }

    componentDidMount() {
        this.props.getAllProviders({
            pageSize: this.state.pageSize,
            offset: this.state.offset
        });
    }
    handlePageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`);

        this.setState({
            activePage: pageNumber,
            offset: pageNumber !== 1 ? ((pageNumber - 1) * 30) : pageNumber
        }, () => {
            this.props.getAllProviders({
                pageSize: this.state.pageSize,
                offset: this.state.offset
            });
            window.scroll(0, 0);
        });
    }
    onClickSearch = () => {
        if (this.state.searchText && this.state.searchText.length > 3) {
            this.props.wildCardSearch({
                type: this.state.searchType !== '' ? this.state.searchType : 'name',
                value: this.state.searchText
            })
        }
    }
    onChangeFilter = (e) => {
        this.setState({
            searchType: e.target.value
        })
    }
    onChangeSearchText = (e) => {
        this.setState({
            searchText: e.target.value
        }, () => {
            // if (this.state.searchText && this.state.searchText.length > 3) {
            //     this.props.wildCardSearch({
            //         type: this.state.searchType !== '' ? this.state.searchType : 'name',
            //         value: this.state.searchText
            //     })
            // }
        })

        console.log("🚀 ~ file: AdminProviderList.js ~ line 62 ~ AdminProviderList ~ e", e.target.value)

    }
    _renderProviders(provider, index) {

        return (<div className="item" key={index} > <CandidateCard key={index} data={provider} {...this.props} /></div >)
    }
    render() {

        const { isLoading, providerList } = this.props;
        return (<React.Fragment>
            <section className="section mt-60 whitegrad-bg">
                <Container className="mt-lg-3 relative">
                    <Row>
                        <p><b>All Provider List</b></p>

                    </Row>
                    <Row>
                        <Col lg="12" className="relative">
                            <div className="search-text-wrapper">
                                <select onChange={(e) => {
                                    this.onChangeFilter(e)
                                }}>
                                    <option>Select Filter Type</option>
                                    <option value="name">Name</option>
                                    <option value="email">Email</option>
                                    <option value="phone">Phone No</option>

                                </select>
                                <input type="text" name="searchText" className="provider-search-input" value={this.state.searchText} placeholder={`Type here `} onChange={(e) => this.onChangeSearchText(e)} />
                                <img src={assets.images.search} onClick={() => this.onClickSearch()} />
                                <br />

                            </div>

                            <RequestContentWrapper>
                                {/* <div className="requests-container"> */}
                                {isLoading ?



                                    < CircularProgress />

                                    :

                                    !isLoading && providerList ? (
                                        providerList.map((provider, index) =>
                                            <Col lg="4" key={index} >
                                                <AdminCandidateCard key={index}
                                                    type="edit-user"
                                                    data={provider}
                                                    selectedPost={[]} {...this.props} /> </Col>
                                        )

                                    ) :
                                        <Col lg="12" style={{ textAlign: 'center', padding: 30 }}>
                                            <img src={assets.images.userIcon} style={{ width: 70, height: 70 }} />
                                            <p style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 0, marginBottom: 0, fontSize:15 }}>No user found </p>

                                        </Col>
                                }
                                 {!isLoading && this.state.searchText === "" &&
                                    <PaginationWrapper>
                                        <Pagination
                                            activePage={this.state.activePage}
                                            itemsCountPerPage={this.state.pageSize}
                                            totalItemsCount={5000}
                                            pageRangeDisplayed={5}
                                            onChange={this.handlePageChange.bind(this)}
                                        />
                                    </PaginationWrapper>
                                } 
                            </RequestContentWrapper>
                        </Col>
                    </Row>
                </Container>
            </section>
        </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    providerList: state.admin.providerList,
    isLoading: state.admin.isLoading
})

const mapDispatchToProps = {
    ...AdminActions
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminProviderList)