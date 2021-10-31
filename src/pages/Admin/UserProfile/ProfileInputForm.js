import React, { Component } from 'react'
import { connect } from 'react-redux'
import { v4 as uuidv4 } from 'uuid';
import {
    Row, Col,
    FormGroup,
    Input,
    Label, Modal, ModalBody, Button, InputGroup, InputGroupText, InputGroupAddon

} from "reactstrap";
import axios from "axios";
import { AvForm, AvField, AvGroup } from 'availity-reactstrap-validation';
import { ProfileAction } from '../../../redux/actions';
import LaddaButton, { XL, SLIDE_UP } from 'react-ladda';
import help from "../../../images/icon/help-2.png";
import FloatingInput from '../../../components/Shared/GeoSuggest/FloatingInput';
import { states_india } from './data_state';
import AvInput from 'availity-reactstrap-validation/lib/AvInput';
import csc from 'country-state-city'


class ProfileInputForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userId: '',
            fullName: '',
            countries: [],
            email: '',
            phone: '',
            address1: '',
            address2: '',
            userCity: '',
            userState: 'Kerala',
            userCountry: 'India',
            aboutMe: '',
            userZipCode: '',
            avatarUrl: '',
            loadProfileUpdate: false,
            userLocation: '',
            isLocationDetected: false,
            errorMessage: '',
            isModalVisible: false,
            isHelpModalVisible: false,
            modalMessage: '',
            myCountryCode: '+91',
            userLocalProfile: ''
        }
        this.toggleHelpModal = this.toggleHelpModal.bind(this)
        this.handelSubmitProfile = this.handelSubmitProfile.bind(this)
        this.onChangeText = this.onChangeText.bind(this)
        this.onSelectLocation = this.onSelectLocation.bind(this)
        this.getGeoInfo = this.getGeoInfo.bind(this)
        this.setCode = this.setCode.bind(this)
        this.onChangeCountryCode = this.onChangeCountryCode.bind(this)
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.userDetails !== prevState.userDetails) {
            if (nextProps.userDetails) {
                return nextProps.userDetails;
            }
        }
        return null
    }
    toggleHelpModal() {
        this.setState({
            isHelpModalVisible: !this.state.isHelpModalVisible
        })
    }
    getGeoInfo = async () => {
        var response = await axios.get('https://ipapi.co/json')
        console.log(response.data.country_calling_code.toString())
        if (response.data.country_calling_code) {
            this.setCode(response.data.country_calling_code)
        }
    };
    setCode(code) {
        this.setState({
            myCountryCode: code
        })
    }
    onChangeCountryCode(event) {
        this.setState({
            myCountryCode: event.target.value
        })
    }
    componentDidMount() {
        var countries = csc.getAllCountries()

        this.setState({
            countries: countries
        })
        try {

            if (this.props && this.props.userDetails && this.props.userDetails.countryCode) {
                this.setState({
                    myCountryCode: this.props.userDetails.countryCode
                })
            } else {
                this.getGeoInfo()
            }
            if (this.props && this.props.userDetails) {
                const { userDetails } = this.props

                this.setState({
                    fullName: userDetails.fullname,
                    userLocalProfile: userDetails,
                    email: userDetails.email,
                    phone: userDetails.phoneNumber ? userDetails.phoneNumber : '',
                    address1: userDetails.adressline1 ? userDetails.adressline1 : '',
                    address2: userDetails.adressline2 ? userDetails.adressline2 : '',
                    userId: userDetails.userId,
                    userLocation: this.props.userLocation ? this.props.userLocation : JSON.parse(localStorage.getItem('userLocation')),
                    userCity: userDetails.city ? userDetails.city : this.state.userCity,
                    userState: userDetails.state ? userDetails.state : this.state.userState,
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
    componentWillReceiveProps(nextProps) {

    }
    onChangeText(event) {

        this.setState({
            [event.target.name]: event.target.value
        })
    }

    onSelectLocation = (selectedLocation) => {
        this.setState({
            userLocation: selectedLocation
        })
    }

    componentDidUpdate(prevProps, prevState) {
        const { isProfileUpdate, userLocation, isProfileUpdating, isUserLocationUpdated, selectedLocation } = this.props;

        if (prevProps.userLocation !== userLocation) {
            this.setState({
                userLocation: userLocation
            }, () => {
                localStorage.setItem('userLocation', JSON.stringify(userLocation))
            })
        }
        //Is profile updated 
        if (prevProps.isProfileUpdate !== isProfileUpdate && isProfileUpdating !== prevProps.isProfileUpdating) {
            if (isProfileUpdate === 1) {
                this.setState({
                    loadProfileUpdate: false,
                    isModalVisible: true,
                    modalMessage: 'Success',
                    modalDescription: 'Personal Details have been saved'
                }, () => {
                    this.props.getProfileCompletionProgress({
                        userId: this.state.userId
                    })
                    this.props.getSpiffyStrength({
                        userId: this.state.userId
                    })
                })

            } else if (isProfileUpdate === 2) {
                alert("Profile Update Failed")
                this.setState({
                    loadProfileUpdate: false,
                    modalMessage: 'Failed to Update',
                    modalDescription: 'Something went wrong, try again later',
                    isModalVisible: true
                })
            }
        }

    }

    handelSubmitProfile(event, errors, values) {
        if (errors && errors.length > 0) {

        } else {
            const { fullName, email, phone, address1, address2, userCity, userState, userCountry, userZipCode, aboutMe, userId, userLocation, myCountryCode } = this.state;
            this.setState({
                loadProfileUpdate: true,
                errorMessage: ''
            })

            //var userLocation = JSON.parse(localStorage.getItem('userLocation'))
            // var newLocation = userLocation ? userLocation : this.props.userLocation
            if (userLocation) {
                var userLocalProfile = { ...this.state.userLocalProfile }

                userLocalProfile.fullname = fullName.trim()
                userLocalProfile.email = email.toLowerCase().trim()
                userLocalProfile.countryCode = myCountryCode.toString()
                userLocalProfile.phoneNumber = `${phone.trim()}`
                userLocalProfile.adressline1 = address1.trim()
                userLocalProfile.adressline2 = address2.trim()
                userLocalProfile.city = userCity.trim()
                userLocalProfile.state = userState
                userLocalProfile.country = userCountry
                userLocalProfile.zipCode = userZipCode.trim()
                userLocalProfile.aboutme = aboutMe.trim()
                userLocalProfile.updatedAt = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })

                this.setState({ userLocalProfile })

                this.props.updateUserProfile({
                    "tblUser": {
                        "fullname": fullName.trim(),
                        "email": email.toLowerCase().trim(),
                        "phoneNumber": `${phone.trim()}`,
                        "countryCode": this.state.myCountryCode.toString(),
                        "adressline1": address1.trim(),
                        "adressline2": address2.trim(),
                        "city": userCity.trim(),
                        "state": userState,
                        "country": userCountry,
                        "zipCode": userZipCode.trim(),
                        "aboutme": aboutMe.trim(),
                        "updatedAt": new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
                    },
                    "id": userId
                })
                var userLocationParams = {
                    "locationid": this.state.userLocation && this.state.userLocation.locationId ? this.state.userLocation.locationId : uuidv4(),
                    "locationtitle": userLocation.locationTitle,
                    "userid": userId,
                    "user_latitude": userLocation.latitude,
                    "user_longitude": userLocation.longitude
                }
                this.props.updateUserLocation(userLocationParams)

                var locationData = {
                    locationTitle: this.state.userLocation.locationTitle,
                    latitude: this.state.userLocation.latitude,
                    longitude: this.state.userLocation.longitude
                }
                this.props.setUserLocation(userLocationParams)
                this.props.changeLocation(locationData)
                this.props.setLocalProfile(this.state.userLocalProfile)

            }
            else {
                this.setState({
                    errorMessage: "Location is mandatory",
                    loadProfileUpdate: false
                })
            }
        }

    }
    render() {
        const { fullName, email, phone, address1, address2, userCity, userZipCode, aboutMe, errorMessage, userCountry, userState, myCountryCode } = this.state
        const { userLocation } = this.props

        return (

            <AvForm className="login-form" onSubmit={this.handelSubmitProfile}>
                <Row>
                    <Col md={12}>

                        <AvGroup className="form-group position-relative">
                            <Label for="email">Full Name<span className="text-danger">*</span></Label>
                            <AvField type="text" maxlength="80" className="form-control" value={fullName} name="fullName" id="fullName" onChange={this.onChangeText} placeholder="Full Name" required
                                errorMessage=""
                                validate={{
                                    required: { value: true, errorMessage: "Enter your name" },
                                }}
                            />
                        </AvGroup>
                    </Col>

                    <Col md={6}>
                        <Row>
                            <Col xs="10">
                                <FormGroup className="position-relative">
                                    <Label>Email</Label>
                                    <Input name="email" id="email" maxlength="80" readOnly type="text" value={email} className="form-control" onChange={this.onChangeText} />
                                </FormGroup>
                            </Col>
                            <Col xs="2">
                                <img onClick={this.toggleHelpModal} className="help-img" src={help}></img>
                            </Col>
                        </Row>


                    </Col>
                    <Col md={6}>
                        <FormGroup className="position-relative">
                            <Label>Select your location <span className="text-danger">*</span></Label>
                            <FloatingInput onSelectLocation={this.onSelectLocation} label={"Enter your location"} initialLocation={userLocation && userLocation ? userLocation : this.props.selectedLocation} value={this.state.userLocation} {...this.props} />
                            {
                                errorMessage !== '' && (
                                    <span className="text-danger" style={{ fontSize: 12 }}>{this.state.errorMessage}</span>
                                )
                            }
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <AvGroup className="form-group position-relative">
                            <Label for="phone"> Phone No <span className="text-danger">*</span></Label>

                            <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                    <select onChange={this.onChangeCountryCode} className="form-control country-code">
                                        {
                                            this.state.countries.map((country, index) =>
                                                <option value={"+" + country.phonecode} key={`key_${index}`} selected={("+" + country.phonecode) == this.state.myCountryCode}>{"+" + country.phonecode + " (" + country.name + ")"}</option>
                                            )
                                        }
                                    </select>
                                </InputGroupAddon>
                                <AvInput
                                    type="telephone" maxlength="10" className="form-control" value={phone} name="phone" id="phone" onChange={this.onChangeText} placeholder="Enter Phone No" required
                                    errorMessage=""
                                    validate={{
                                        pattern: { value: '^[0-9]{10}$', errorMessage: 'Invalid Phone Number' },
                                        required: { value: true, errorMessage: "Enter mobile no" },
                                        minLength: { value: 10, errorMessage: 'Invalid Phone Number' },
                                        maxLength: { value: 10, errorMessage: 'Invalid Phone Number' }
                                    }}
                                />
                            </InputGroup>
                        </AvGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <AvGroup className="form-group position-relative">
                            <Label for="email"> Address Line 1<span className="text-danger">*</span></Label>
                            <AvField type="text" maxlength="200" className="form-control" value={address1} name="address1" id="address1" onChange={this.onChangeText} placeholder="Eg: 123 Street Name" required
                                errorMessage=""
                                validate={{
                                    required: { value: true, errorMessage: "Enter adress line 1" },
                                }}
                            />
                        </AvGroup>
                    </Col>
                    <Col md={6}>
                        <AvGroup className="form-group position-relative">
                            <Label for="email"> Address Line 2</Label>
                            <AvField type="text" maxlength="200" className="form-control" value={address2} name="address2" id="address2" onChange={this.onChangeText} placeholder="Apt / Unit"
                                errorMessage=""
                            />
                        </AvGroup>

                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <AvGroup className="form-group position-relative">
                            <Label>City</Label>
                            <AvField type="text" className="form-control" value={userCity} name="userCity" id="userCity" onChange={this.onChangeText} placeholder="Enter city" required
                                errorMessage=""
                                validate={{
                                    required: { value: true, errorMessage: "Enter city" },
                                }}
                            />
                            {/* <Input name="city" id="city" type="text" className="form-control" value={city} placeholder="City" onChange={this.onChangeText} /> */}
                        </AvGroup>
                    </Col>
                    <Col md={6}>
                        <AvGroup>
                            <Label for="email"> State<span className="text-danger">*</span></Label>
                            <select key={'state_drp'} defaultValue={this.props.userDetails.state && this.props.userDetails.state ? this.props.userDetails.state : userState} className="form-control custom-select" name="userState" id="userState" onChange={this.onChangeText}>
                                {
                                    states_india.map((state, index) =>
                                        <option value={state} key={`key_${index}`}>{state}</option>
                                    )
                                }

                            </select>
                        </AvGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <Label>Country</Label>
                            <select defaultValue={myCountryCode} onChange={this.onChangeText} name="userCountry" className="form-control custom-select" id="Sortbylist-Shop">
                                <option>India</option>
                            </select>
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <AvGroup className="position-relative">
                            <Label>Postal Code</Label>
                            {/* <Input name="userZipCode" id="userZipCode" onChange={this.onChangeText} id="zipCode" value={userZipCode} type="text" className="form-control" placeholder="Postal Code" /> */}
                            <AvField type="text" className="form-control" value={userZipCode} name="userZipCode" id="userZipCode" onChange={this.onChangeText} placeholder="Enter Postal Code" required
                                errorMessage=""
                                validate={{
                                    required: { value: true, errorMessage: "Enter Postal Code" },
                                }}
                            />
                        </AvGroup>
                    </Col>
                    <Col md={12}>
                        <AvGroup className="position-relative">
                            <Label>About Me</Label>
                            <AvField type="textarea" maxlength="250" className="form-control" value={aboutMe} name="aboutMe" id="aboutMe" onChange={this.onChangeText} placeholder="Enter something about you" required
                                errorMessage=""
                                validate={{
                                    required: { value: true, errorMessage: "Enter something about you" },
                                }}
                            />
                        </AvGroup>
                    </Col>

                </Row>
                <Row>
                    <Col sm="12">
                        <LaddaButton
                            loading={this.state.loadProfileUpdate}
                            className="submitBnt btn btn-primary pull-right"
                            data-color="#eee"
                            data-size={XL}
                            data-style={SLIDE_UP}
                            data-spinner-size={30}
                            data-spinner-color="#ddd"
                            data-spinner-lines={12}
                        >
                            Save
                       </LaddaButton>
                    </Col>
                </Row>
                <Modal isOpen={this.state.isHelpModalVisible} role="dialog" autoFocus={true} centered={true}>
                    <ModalBody>
                        <p className="helpmodal">Please key in your exact location here and pick the most appropriate choice that shows in the dropdown options.
                                <br></br> <br></br>
                                All service requests within 40km of this location will be notified to you.
                            </p>
                        <Button className="post-request" onClick={this.toggleHelpModal}>Close</Button>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.isModalVisible}>
                    <ModalBody>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 1, color: '#861b8d' }}>{this.state.modalMessage}</p>
                            <p>{this.state.modalDescription}</p>
                            <Button onClick={() => this.setState({ isModalVisible: false, modalMessage: '', modalDescription: '' })}>Close</Button>
                        </div>
                    </ModalBody>
                </Modal>
            </AvForm>

        )
    }

}
const mapStateToProps = (state) => ({
    userDetails: state.profile.userDetails,
    isProfileUpdate: state.profile.isProfileUpdate,
    userLocation: state.profile.userLocation,
    isProfileUpdating: state.profile.isProfileUpdating,
    selectedLocation: state.profile.selectedLocation,
    isUserLocationUpdated: state.profile.isUserLocationUpdated

})

export default connect(mapStateToProps, { ...ProfileAction })(ProfileInputForm)