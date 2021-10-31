import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import { Container, Row, Col, Input, Label, FormGroup, Button } from 'reactstrap';
import { AvForm, AvField, AvGroup } from 'availity-reactstrap-validation';

import where from "../../images/icon/where.png";
import go from "../../images/icon/go.png";
import alert from "../../images/icon/alert-2.png";
import SectionTitle from "../../components/Shared/section-title";
import SectionTitleLeft from "../../components/Shared/section-title-left";
// import images
import about from '../../assets/images/about.jpg';
import * as firebase from 'firebase';

import { AuthAction, ProfileAction } from '../../redux/actions';
import LaddaButton, { XL, SLIDE_UP } from 'react-ladda';
import DialogBox from '../../components/Shared/dialog-box';
import FloatingInput from '../../components/Shared/GeoSuggest/FloatingInput';
import { setUser } from '../../handler/authenticate';
import imgbg from "../../assets/images/account/bg.jpg";


const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
export class Where extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedLocation: '',
            userLocation: '',
        }
        this.onSelectLocation = this.onSelectLocation.bind(this)
    }
    componentDidMount() {
        window.scrollTo(0, 0)
    }
    onSelectLocation = (selectedLocation) => {
        this.setState({
            userLocation: selectedLocation
        }, () => {
            this.props.changeLocation(selectedLocation)
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
                        <div className="where">
                            <img src={where}/>
                            <p className="bold font20">Where do you want this service ?</p>
                            <p className="text-muted">
                            Please mention the exact location where service delivery is expected.<br/> For example, if it is Vyttila, mention that and not Ernakulam or Kochi.
                            </p>
                            <Row>
                                <Col md="11">
                                <FloatingInput onSelectLocation={this.onSelectLocation} value={this.state.selectedLocation} label={"Enter your location"}/>
                                </Col>
                                <Col md="1">
                                <Link to="providers"><img className="go" src={go}/></Link> 
                                </Col>
                            </Row>
                          
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
    isUserLoad: state.profile.isUserLoad,
})

const mapDispatchToProps = {
    ...AuthAction,
    ...ProfileAction
}

export default connect(mapStateToProps, mapDispatchToProps)(Where)
