import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import { Container, Row, Col, Input, Label, FormGroup, Button } from 'reactstrap';
import { AvForm, AvField, AvGroup } from 'availity-reactstrap-validation';

import user from "../../images/icon/user-orange.png";
import avatar from "../../images/icon/user-6.png";
import go from "../../images/icon/go.png";
import alert from "../../images/icon/alert-2.png";
import SectionTitle from "../../components/Shared/section-title";
import SectionTitleLeft from "../../components/Shared/section-title-left";
import OwlCarousel from 'react-owl-carousel';
// import images
import about from '../../assets/images/about.jpg';
import * as firebase from 'firebase';

import { AuthAction, ProfileAction, UserActions, RequestActions } from '../../redux/actions';
import LaddaButton, { XL, SLIDE_UP } from 'react-ladda';
import DialogBox from '../../components/Shared/dialog-box';
import FloatingInput from '../../components/Shared/GeoSuggest/FloatingInput';
import { setUser } from '../../handler/authenticate';
import imgbg from "../../assets/images/account/bg.jpg";

const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
export class Providers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedLocation: '',
            userLocation: '',
            loadSlide: true
        }
        this.onSelectLocation = this.onSelectLocation.bind(this)
    }
    onSelectLocation = (selectedLocation) => {
        this.setState({
            userLocation: selectedLocation
        }, () => {
            this.props.changeLocation(selectedLocation)
        })
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
        this.props.getProviders({
            locationData: {
                "user_latitude": this.props.selectedLocation && this.props.selectedLocation.latitude,
                "user_longitude": this.props.selectedLocation && this.props.selectedLocation.longitude,
                "user_radius": process.env.REACT_APP_PROVIDER_RADIUS ? parseFloat(process.env.REACT_APP_PROVIDER_RADIUS) : 40000
            },
            filters: myCustomFilter
        })
    }
    render() {
        const { isTermsDialogOpen, errorMsg } = this.state;
        return (
            <React.Fragment>
                <section className="new-purple" style={{ background: `url(${imgbg}) center center` }}>
                    <h2>User / New Request</h2>
                </section>
                <section className="new-bg">

                    <Container className="pop-where">
                        <div className="providers-header">


                            <Row>
                                <Col xs="1">
                                    <img src={user} />
                                </Col>
                                <Col xs="11">
                                    <p style={{fontSize:19, fontWeight:"bold"}}>Service providers in this area</p>
                                    <p className="font-title font14 ">Here are the profiles of some service providers near the area where you need this service.</p>
                                </Col>
                            </Row>
                        </div>
                        <div className="providers-slider">
                            {
                                this.props.providers && this.props.providers.length > 0 && this.state.loadSlide &&
                                <div>
                                    <OwlCarousel
                                        className="owl-theme mobile-hide"
                                        items={5}
                                        loop={false}
                                        nav={true}
                                        dots={false}
                                        margin={1}
                                        autoplay={true}
                                        key={this.props.providers}
                                    >
                                        {

                                            this.props.providers.map((provider, index) =>
                                                <div className="provider-card">
                                                    <img style={{width:90,height:90}}src={`${provider && provider.avatarUrl !== '' ? `${process.env.REACT_APP_ASSETS_BASE_URL}/Users/${provider && provider.userId}/Avatar/${provider.avatarUrl}` : avatar}`} />
                                                    <p style={{fontSize:16, fontWeight:"bold"}}>{provider.fullname}</p>
                                                    <p className="font-title font13">
                                                        {provider.aboutme}
                                                    </p>
                                                </div>
                                            )
                                        }



                                    </OwlCarousel>
                                    <OwlCarousel
                                        className="owl-theme mobile-show"
                                        items={1}
                                        loop={false}
                                        nav={true}
                                        dots={false}
                                        margin={1}
                                        autoplay={true}
                                        key={this.props.providers}
                                    >
                                        {

                                            this.props.providers.map((provider, index) =>
                                                <div className="provider-card">
                                                    <img style={{width:90,height:90}}src={`${provider && provider.avatarUrl !== '' ? `${process.env.REACT_APP_ASSETS_BASE_URL}/Users/${provider && provider.userId}/Avatar/${provider.avatarUrl}` : avatar}`} />
                                                    <p style={{fontSize:16, fontWeight:"bold"}}>{provider.fullname}</p>
                                                    <p className="font-title font13">
                                                        {provider.aboutme}
                                                    </p>
                                                </div>
                                            )
                                        }
                                    </OwlCarousel>
                                </div>
                            }

                        </div>
                        <div className="providers-footer" style={{ padding: "40px 0", textAlign: "center" }}>
                            <p style={{fontSize:16, fontWeight:"bold"}}>Connect with <b>{this.props.providers && this.props.providers.length}</b> more YoCo providers</p>
                            <br />
                            <Link to="user-signup"><a className="neat-button">Signup Here</a></Link>
                            <br /><br /><br />
                            <span>Already have an account? </span> <a className="purple-text"> <b><Link to="/sign-in">Login Here</Link></b></a>
                        </div>
                    </Container>
                </section>
                {/* Dialog Terms and condition */}
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    isRegistrationSuccess: state.auth.isRegistrationSuccess,
    loginUserId: state.auth.loginUserId,
    userBasicDetails: state.profile.userBasicDetails,
    selectedLocation: state.profile.selectedLocation,
    isUserLoad: state.profile.isUserLoad,
    providers: state.user.providers,
})

const mapDispatchToProps = {
    ...AuthAction,
    ...ProfileAction,
    ...UserActions,
    ...RequestActions,
}

export default connect(mapStateToProps, mapDispatchToProps)(Providers)
