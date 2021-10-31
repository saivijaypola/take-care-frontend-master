import React, { Component } from 'react'
import { connect } from 'react-redux'
import { v4 as uuidv4 } from 'uuid';
import { Link } from "react-router-dom";
import {
    Container, Row, Col, Button


} from "reactstrap";

import Requests from '../Request';
import { AvForm, AvField, AvGroup } from 'availity-reactstrap-validation';
import classnames from 'classnames';
import Progressbar from '../../components/Shared/Progressbar';
import UploadCard from '../../components/Shared/PhotoVerify/UploadPhotoProof';
import VerifyPrice from '../../components/Shared/PhotoVerify/VerifyPrice';
import FloatingInput from '../../components/Shared/GeoSuggest/FloatingInput';
import { getDeviceCurrentLocation } from "../../utils/location"

//Import Images
import imgbg from "../../assets/images/account/bg.jpg";
import profile from "../../assets/images/client/05.jpg";
import address from "../../images/icon/paper.png";
import photoproof from "../../images/icon/frame.png";

import emailicon from "../../images/icon/email.png";
import reservation from "../../images/icon/reservation.png";
import range2 from "../../images/icon/2range.png";
import tiles from "../../images/tiles.png";

import { ProfileAction, RequestActions } from '../../redux/actions';
import InfoBox from '../../components/Shared/InfoBox';
import SpiffyIcon from '../../components/Shared/Spiffy';
import Spiffy from '../../components/Shared/Spiffy';
import UserInfo from '../../components/Shared/UserInfo';
import UploadAdressProof from '../../components/Shared/DocVerify/UploadAdressProof';
import UploadPhotoProof from '../../components/Shared/PhotoVerify/UploadPhotoProof';

export class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: "1",
            isAlertVisible: false,
            userLocation: '',
            latitude: 9.971229,
            longitude: 76.319763
        }
        this.toggle = this.toggle.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.searchLocation = this.searchLocation.bind(this);
    }

    componentDidMount() {
        

    }

    toggleTrainingModal = () => {
        this.setState(prevState => ({
            trainingModel: !prevState.trainingModel
        }));
    }

    render() {
        const { laddaLoader, fullName, email, avatarUrl, allEducations, userId } = this.state;
        const { isUserLoad, userDetails, allEmployments, allTraining } = this.props;
        const { userLocation, selectedLocation } = this.props
        return (
            <React.Fragment>
                <section className="bg-profile d-table w-100" style={{ background: `url(${imgbg}) center center` }}>
                    <Container>
                        <Row>

                            <Col lg="12">
                                {

                                    userDetails && (
                                        <UserInfo {...this.props} />
                                    )
                                }

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
    selectedLocation: state.profile.selectedLocation
})

const mapDispatchToProps = {
    ...ProfileAction,
    ...RequestActions
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
