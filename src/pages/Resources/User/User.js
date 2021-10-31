import React, { Component } from 'react'
import { connect } from 'react-redux'
import VerticalTabsUser from '../../../components/Layout/VerticalTabsUser'


import {
    Container

} from "reactstrap";

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
                    <VerticalTabsUser tabId={this.props.match.params.tabId}></VerticalTabsUser>
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
