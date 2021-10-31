import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import { Container, Row, Col, Input, Label, FormGroup, Button, InputGroup, InputGroupText, InputGroupAddon, Modal, ModalBody } from 'reactstrap';

import where from "../../images/icon/where.png";
import go from "../../images/icon/go.png";
import alert from "../../images/icon/alert-2.png";
import SectionTitle from "../../components/Shared/section-title";
import SectionTitleLeft from "../../components/Shared/section-title-left";
// import images
import imgbg from "../../assets/images/account/bg.jpg";
import about from '../../assets/images/about.jpg';
import user from "../../images/icon/user.svg";
import * as firebase from 'firebase';
import axios from "axios";
import { AvForm, AvField, AvGroup } from 'availity-reactstrap-validation';
import AvInput from 'availity-reactstrap-validation/lib/AvInput';
import csc from 'country-state-city'
import { AuthAction, ProfileAction } from '../../redux/actions';
import LaddaButton, { XL, SLIDE_UP } from 'react-ladda';
import DialogBox from '../../components/Shared/dialog-box';
import FloatingInput from '../../components/Shared/GeoSuggest/FloatingInput';
import { setUser } from '../../handler/authenticate';

const assetsBaseUrl = process.env.REACT_APP_ASSETS_BASE_URL




const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
export class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedLocation: '',
            userId: '',
            fullName: '',
            email: '',
            phone: '',
            address1: '',
            address2: '',
            userCity: '',
            userState: 'Alabama',
            countries: [],
            states: [],
            userCountry: 'United States',
            aboutMe: '',
            userZipCode: '',
            myCountryCode: '+1',
            avatarUrl: '',
            loadProfileUpdate: false,
            userLocation: '',
            isLocationDetected: false,
            errorMessage: '',
            isModalVisible: false,
            isHelpModalVisible: false,
            modalMessage: '',
            userLocalProfile: ''
        }
        this.onSelectLocation = this.onSelectLocation.bind(this)
        this.handelSubmitProfile = this.handelSubmitProfile.bind(this)
        this.onChangeText = this.onChangeText.bind(this)
        this.onChangeCountry = this.onChangeCountry.bind(this)
        this.onChangeCountryCode = this.onChangeCountryCode.bind(this)
        this.getGeoInfo = this.getGeoInfo.bind(this)
        this.setCode = this.setCode.bind(this)
        this.initializeCountryState = this.initializeCountryState.bind(this)
    }
    onSelectLocation = (selectedLocation) => {
        this.setState({
            userLocation: selectedLocation
        }, () => {
            this.props.changeLocation(selectedLocation)
        })
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.userDetails !== prevState.userDetails) {
            if (nextProps.userDetails) {
                return nextProps.userDetails;
            }
        }
        if (nextProps.isProfileUpdate !== prevState.isProfileUpdate) {
            if (nextProps.isProfileUpdate > 0) {
                return nextProps.userDetails;
            }
        }
        return null
    }
    getGeoInfo = async () => {
        var response = await axios.get('https://ipapi.co/json')
        console.log("MY COUNTRY CODE", response.data.country_calling_code.toString())
        if (response.data.country_calling_code) {
            this.setCode(response.data.country_calling_code)
        }
    };
    setCode(code) {
        this.setState({
            myCountryCode: code
        })
    }

    toggleHelpModal() {
        this.setState({
            isHelpModalVisible: !this.state.isHelpModalVisible
        })
    }
    componentDidUpdate(prevProps, prevState) {
        const { isProfileUpdate, isProfileUpdating } = this.props;

        if (prevProps.isProfileUpdate !== isProfileUpdate && isProfileUpdating !== prevProps.isProfileUpdating) {
            if (isProfileUpdate === 1) {
                var target=localStorage.getItem("target")
                if(target){
                    localStorage.removeItem("target");
                    this.props.history.push(target)
                }
                else{
                this.props.history.push('/success')
                }
            }
        }
    }
    componentDidMount() {
        window.scrollTo(0, 0);
        this.props.getUserProfileById({
            userId: localStorage.getItem('userId')
        })
        var countries = csc.getAllCountries()
        this.initializeCountryState()
        console.log("countries", countries)
        this.setState({
            countries: countries
        })
        this.setState({
            userId: localStorage.getItem('userId'),
            fullName: localStorage.getItem('fullname')
        })
        if (this.props.userDetails && this.props.userDetails.country) {
            for (var i = 0; i < countries.length; i++) {
                if (countries[i].name == this.props.userDetails.country) {
                    var states = csc.getStatesOfCountry(countries[i].id)
                    this.setState({
                        states: states
                    })
                }
            }
        }
        if (this.props.userDetails && this.props.userDetails.countryCode) {
            this.setState({
                myCountryCode: this.props.userDetails.countryCode
            })
        } else {
            this.getGeoInfo()
        }
        try {
            if (this.props && this.props.userDetails) {
                const { userDetails } = this.props
                this.setState({
                    // fullName: userDetails.fullname,
                    userLocalProfile: userDetails,
                    email: userDetails.email,
                    phone: userDetails.phoneNumber ? userDetails.phoneNumber : '',
                    address1: userDetails.adressline1 ? userDetails.adressline1 : '',
                    address2: userDetails.adressline2 ? userDetails.adressline2 : '',
                    userId: userDetails.userId,
                    userLocation: this.props.userLocation ? this.props.userLocation : JSON.parse(localStorage.getItem('userLocation')),
                    userCity: userDetails.city ? userDetails.city : this.state.userCity,
                    userState: userDetails.state && userDetails.state !== "" ? userDetails.state : this.state.userState,
                    userCountry: userDetails.country ? userDetails.country : this.state.userCountry,
                    userZipCode: userDetails.zipCode ? userDetails.zipCode : this.state.userZipCode,
                    avatarUrl: userDetails.avatarUrl,
                    aboutMe: userDetails.aboutme ? userDetails.aboutme : ''
                }, () => {

                    this.props.changeLocation(this.state.userLocation)
                })
            }
        } catch (err) {

        }

    }
    onChangeText(event) {

        this.setState({
            [event.target.name]: event.target.value
        })
    }
    onChangeCountry(event) {
        console.log('COUNTRY ID', event.target.value)
        this.setState({
            [event.target.name]: event.target.value
        })

        var country = csc.getCountryById(event.target.value).name
        var states = csc.getStatesOfCountry(event.target.value)
        var phonecode = csc.getCountryById(event.target.value).phonecode
        this.setState({
            userCountry: country,
            states: states
        })
    }
    initializeCountryState() {
        const defaultCountryId = 101
        var country = csc.getCountryById("101")
        console.log('COUNTRY', country)
        var states = csc.getStatesOfCountry("101")
        console.log('states', states)
        // var phonecode = csc.getCountryById(event.target.value).phonecode
        this.setState({
            userCountry: country,
            states: states
        })
    }
    onChangeCountryCode(event) {
        this.setState({
            myCountryCode: event.target.value
        })
    }
    handelSubmitProfile(event, errors, values) {
        if (errors && errors.length > 0) {
            console.log("errors", errors)
        } else {
            const { fullName, email, phone, address1, address2, userCity, userState, userCountry, userZipCode, aboutMe, userId, userLocation } = this.state;
            this.setState({
                loadProfileUpdate: true,
                errorMessage: ''
            })

            //var userLocation = JSON.parse(localStorage.getItem('userLocation'))
            // var newLocation = userLocation ? userLocation : this.props.userLocation
            var userLocalProfile = { ...this.state.userLocalProfile }
            userLocalProfile.fullname = fullName.trim()
            userLocalProfile.email = email.toLowerCase().trim()
            userLocalProfile.phoneNumber = `${phone.trim()}`
            userLocalProfile.adressline1 = address1.trim()
            userLocalProfile.adressline2 = address2.trim()
            userLocalProfile.city = userCity.trim()
            userLocalProfile.state = userState.toString()
            userLocalProfile.country = userCountry
            userLocalProfile.zipCode = userZipCode.trim()
            userLocalProfile.aboutme = aboutMe.trim()
            userLocalProfile.updatedAt = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })

            this.setState({ userLocalProfile })

            this.props.updateUserProfile({
                "tblUser": {
                    // "fullname": fullName.trim(),
                    // "email": email.toLowerCase().trim(),
                    "phoneNumber": `${phone.trim()}`,
                    "countryCode": this.state.myCountryCode.toString(),
                    "adressline1": address1.trim(),
                    "adressline2": address2.trim(),
                    "city": userCity.trim(),
                    "state": userState.toString(),
                    "country": userCountry,
                    "zipCode": userZipCode.trim(),
                    "aboutme": aboutMe.trim(),
                    "updatedAt": new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
                },
                "id": userId
            })
            // var userLocationParams = {
            //     "locationid": this.state.userLocation && this.state.userLocation.locationId ? this.state.userLocation.locationId : uuidv4(),
            //     "locationtitle": userLocation.locationTitle,
            //     "userid": userId,
            //     "user_latitude": userLocation.latitude,
            //     "user_longitude": userLocation.longitude
            // }
            // this.props.updateUserLocation(userLocationParams)

            // var locationData = {
            //     locationTitle: this.state.userLocation.locationTitle,
            //     latitude: this.state.userLocation.latitude,
            //     longitude: this.state.userLocation.longitude
            // }
            // this.props.setUserLocation(userLocationParams)
            // this.props.changeLocation(locationData)
            this.props.setLocalProfile(this.state.userLocalProfile)

        }

    }
    render() {
        const { fullName, email, phone, address1, address2, userCity, userZipCode, aboutMe, errorMessage, userCountry, userState, myCountryCode } = this.state
        const { userLocation } = this.props
        return (
            <React.Fragment>
                <section className="new-purple" style={{ background: `url(${imgbg}) center center` }}>
                    <h2>User / New Request</h2>
                </section>
                <section className="new-bg">

                    <Container className="pop-where">
                        <div className="pop-header">
                            <Row>
                                <Col xs="1">
                                    <img className={this.props.avatarUrl ? "custom-profile-pic" : ""} src={this.props.avatarUrl !== '' ? `${assetsBaseUrl}/Users/${this.props.userDetails && this.props.userDetails.userId}/Avatar/${this.props.avatarUrl}` : user} />
                                </Col>
                                <Col xs="11">
                                    <p style={{fontSize:19, fontWeight:"bold"}}>{this.props.userDetails && this.props.userDetails.fullname}</p>
                                    <p className="font-title font14 ">{this.props.userDetails && this.props.userDetails.email}</p>
                                </Col>
                            </Row>
                        </div>
                        <br/>
                        <p style={{margin:"15px auto", marginBottom: 0, maxWidth:400}} className="font-title font14">
                                Please enter your address of residence here, NOT service delivery location. Please be assured that your informaiton is safe with us and will be used only for communication purposes.
                            </p>
                        <div className="new-profile">
                            
                            <AvForm className="login-form" onSubmit={this.handelSubmitProfile}>
                                <AvGroup className="form-group position-relative">
                                    <Label for="phone"> Phone No <span className="text-danger">*</span></Label>

                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">
                                            <select defaultValue={myCountryCode} onChange={this.onChangeCountryCode} className="form-control country-code">
                                                {
                                                    this.state.countries.map((country, index) =>

                                                        <option value={"+" + country.phonecode} key={`key_${index}`} selected={("+" + country.phonecode) == this.state.myCountryCode}>{"+" + country.phonecode + " (" + country.name + ")"}</option>
                                                    )
                                                }
                                            </select>
                                            {/* <InputGroupText>{this.state.myCountryCode}</InputGroupText> */}
                                        </InputGroupAddon>
                                        <AvInput
                                            type="telephone" maxlength="10" className="form-control" value={phone} name="phone" id="phone" onChange={this.onChangeText} placeholder="Enter Phone No" required
                                            errorMessage=""
                                            validate={{
                                                //pattern: { value: '^[0-9]{10}$', errorMessage: 'Invalid Phone Number' },
                                                required: { value: true, errorMessage: "Enter mobile no" },
                                                minLength: { value: 6, errorMessage: 'Invalid Phone Number' },
                                                maxLength: { value: 10, errorMessage: 'Invalid Phone Number' }
                                            }}
                                        />
                                    </InputGroup>
                                </AvGroup>

                                <AvGroup className="form-group position-relative">
                                    <Label for="email"> Address Line 1<span className="text-danger">*</span></Label>
                                    <AvField type="text" maxlength="200" className="form-control" value={address1} name="address1" id="address1" onChange={this.onChangeText} placeholder="Eg: 123 Street Name" required
                                        errorMessage=""
                                        validate={{
                                            required: { value: true, errorMessage: "Enter adress line 1" },
                                        }}
                                    />
                                </AvGroup>
                                <AvGroup className="form-group position-relative">
                                    <Label for="email"> Address Line 2</Label>
                                    <AvField type="text" maxlength="200" className="form-control" value={address2} name="address2" id="address2" onChange={this.onChangeText} placeholder="Apt / Unit"
                                        errorMessage=""
                                    />
                                </AvGroup>
                                <FormGroup>
                                    <Label>Country</Label>
                                    <select onChange={this.onChangeCountry} defaultValue={userCountry ? userCountry : 'India'} name="userCountry" className="form-control custom-select" id="Sortbylist-Shop">
                                        {
                                            this.state.countries.map((country, index) =>
                                                <option value={country.id} key={`key_${index}`} selected={country.name == userCountry}>{country.name}</option>
                                            )
                                        }
                                    </select>
                                </FormGroup>
                                <FormGroup>
                                    <Label>State<span className="text-danger">*</span></Label>
                                    <select key={'state_drp'} defaultValue={'Kerala'} className="form-control custom-select" name="userState" id="userState" onChange={this.onChangeText}>

                                        {
                                            this.state.states.map((state, index) =>
                                                <option value={state.name} key={`key_${index}`} selected={state.name === userState}>{state.name}</option>
                                            )
                                        }

                                    </select>
                                </FormGroup>
                                <AvGroup className="form-group position-relative">
                                    <Label>City<span className="text-danger">*</span></Label>
                                    <AvField type="text" className="form-control" value={userCity} name="userCity" id="userCity" onChange={this.onChangeText} placeholder="Enter city" required
                                        errorMessage=""
                                        validate={{
                                            required: { value: true, errorMessage: "Enter city" },
                                        }}
                                    />
                                    {/* <Input name="city" id="city" type="text" className="form-control" value={city} placeholder="City" onChange={this.onChangeText} /> */}
                                </AvGroup>
                                <AvGroup className="position-relative">
                                    <Label>Postal Code<span className="text-danger">*</span></Label>
                                    {/* <Input name="userZipCode" id="userZipCode" onChange={this.onChangeText} id="zipCode" value={userZipCode} type="text" className="form-control" placeholder="Postal Code" /> */}
                                    <AvField type="text" className="form-control" value={userZipCode} name="userZipCode" id="userZipCode" onChange={this.onChangeText} placeholder="Zip code / postal code" required
                                        errorMessage=""
                                        validate={{
                                            // pattern: {value: '^[0-9]*$', errorMessage: 'Please Enter a valid postal code'},
                                            maxLength: { value: 10, errorMessage: 'Please Enter a valid postal code' },
                                            required: { value: true, errorMessage: "Zip code / postal code" },
                                        }}
                                    />
                                </AvGroup>
                                <button className="trans-button">
                                    <img src={go} />
                                </button>

                                <Modal isOpen={this.state.isHelpModalVisible} role="dialog" autoFocus={true} centered={true}>
                                    <ModalBody>
                                        <p className="helpmodal">Please key in your exact location here and pick the most appropriate choice that shows in the dropdown options.
                                <br></br> <br></br>
                                All service requests within 40 Km of this location will be notified to you.
                            </p>
                                        <Button className="post-request" onClick={this.toggleHelpModal}>Close</Button>
                                    </ModalBody>
                                </Modal>
                                <Modal isOpen={this.state.isModalVisible}>
                                    <ModalBody>
                                        <div style={{ textAlign: 'center' }}>
                                            <h6 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 1, color: '#861b8d' }}>{this.state.modalMessage}</h6>
                                            <p>{this.state.modalDescription}</p>
                                            <Button onClick={() => this.setState({ isModalVisible: false, modalMessage: '', modalDescription: '' })}>Close</Button>
                                        </div>
                                    </ModalBody>
                                </Modal>
                            </AvForm>
                        </div>
                    </Container>
                </section>
                {/* Dialog Terms and condition */}
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    userDetails: state.profile.userDetails,
    isProfileUpdate: state.profile.isProfileUpdate,
    isProfileUpdating: state.profile.isProfileUpdating,
    isRegistrationSuccess: state.auth.isRegistrationSuccess,
    loginUserId: state.auth.loginUserId,
    userBasicDetails: state.profile.userBasicDetails,
    avatarUrl: state.profile.avatarUrl,
    isUserLoad: state.profile.isUserLoad,
})

const mapDispatchToProps = {
    ...AuthAction,
    ...ProfileAction
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
