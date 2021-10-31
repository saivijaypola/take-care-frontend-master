import React, { Component } from 'react'
import { connect } from 'react-redux'
import VerticalTabs from '../../../components/Layout/VerticalTabs'

import { Link } from "react-router-dom";
import {
    Container, Row, Col,
    Button,

} from "reactstrap";

// import './style.css'


//Import Images
import { Tab } from 'semantic-ui-react'
import { ProfileAction } from '../../../redux/actions';




export class policy extends Component {
    constructor(props) {
        super(props);
        this.state = {

            isModelOpen: false
        }

        this.onChangeText = this.onChangeText.bind(this);
        this.onToggleUploadModel = this.onToggleUploadModel.bind();
    }

    componentDidMount() {
        if (localStorage.getItem("userId") !== null) {
            this.setState({
                userId: localStorage.getItem("userId")
            }, () => {
                this.props.getUserProfileById({
                    userId: this.state.userId
                })
            })
        }
    }
    componentDidUpdate(prevProps, prevState) {
        const { isUserLoad, userDetails, allEducations, allEmployments, isProfileUpdate, isTrainingInsert, allTraining } = this.props;
        if (prevProps.isUserLoad !== isUserLoad && userDetails) {
            this.setState({
                fullName: userDetails.fullname,
                email: userDetails.email,
                phone: userDetails.phoneNumber,
                address1: userDetails.adressline1,
                address2: userDetails.adressline2,
                city: userDetails.city,
                userState: userDetails.state,
                country: userDetails.country,
                zipCode: userDetails.zipCode,
                avatarUrl: userDetails.avatarUrl,
                aboutMe: userDetails.aboutme,
                allEducations,
                allEmployments

            })
        }



    }
    onChangeText(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    onToggleUploadModel = () => {
        this.setState(prevState => ({
            isModelOpen: !prevState.isModelOpen
        }));
    }


    render() {

        // alert(this.props)
        const {
            fullName,
            userId, avatarUrl, email, isModelOpen } = this.state;
        const { isUserLoad, userDetails } = this.props;
        return (
            <React.Fragment>
                <section class="bg-half bg-light d-table w-100 hahaha">
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-lg-12 text-center">
                                <div class="page-next-level">
                                    <p style={{fontSize:16, fontWeight:"bold"}} class="title"> We are here to help! </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <Container>
                    <VerticalTabs tabId={this.props.match.params.tabId}></VerticalTabs>
                </Container>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    userDetails: state.profile.userDetails,
    isUserLoad: state.profile.isUserLoad,
    isDocumentUploadDone: state.profile.isDocumentUploadDone,
    isUploading: state.profile.isUploading,

})

const mapDispatchToProps = {
    ...ProfileAction
}

export default connect(mapStateToProps, mapDispatchToProps)(policy)
