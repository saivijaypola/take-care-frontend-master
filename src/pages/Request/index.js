import React, { Component } from 'react'
import RequestItem from './RequestItem'
import { connect } from 'react-redux'
import { v4 as uuidv4 } from 'uuid';
import {
    Container, Row, Col, Button, Modal, Spinner, ModalBody
} from "reactstrap";
import { ProfileAction, RequestActions } from '../../redux/actions';
import FloatingInput from '../../components/Shared/GeoSuggest/FloatingInput';
import imgbg from "../../assets/images/account/bg.jpg";
import location from "../../images/icon/location.png";
import UserInfo from '../../components/Shared/UserInfo';
import { auth } from "firebase/app";
import { getUser } from '../../handler/authenticate';
import { getDeviceCurrentLocation } from '../../utils/location';


export class UserRequestList extends Component {
    constructor() {
        super()
        this.state = {
            latitude: 9.971229,
            longitude: 76.319763,
            selectedLocation: '',
            userLocation: '',
            isModalVisible: false
        }
        this.onSelectLocation = this.onSelectLocation.bind(this)
    }
    setLatitude() {
        this.setState({
            latitude: 9.971229
        })
        this.setState({
            longitude: 76.319763
        })
    }
    componentDidMount() {
        if (localStorage.getItem("userId") !== null) {
            if (this.props && this.props.selectedLocation) {
                const { latitude, longitude } = this.props && this.props.selectedLocation
                if (latitude && longitude) {
                    this.props.getRequests({
                        "latitude": latitude,
                        "longitude": longitude,
                        "radius": process.env.REACT_APP_PROVIDER_RADIUS ? parseFloat(process.env.REACT_APP_PROVIDER_RADIUS) : 40000
                    })
                }
            }


        }

    }
    componentWillReceiveProps(nextProps) {

        if (nextProps.selectedLocation !== this.props.selectedLocation) {

        }
    }
    onChangeText(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.isUserLoad !== prevState.isUserLoad) {
            if (nextProps.isUserLoad > 0) {
                return nextProps.isUserLoad;
            }
        }

        return null

    }
    onSelectLocation = (selectedLocation) => {
        this.setState({
            userLocation: selectedLocation
        }, () => {
            this.props.changeLocation(selectedLocation)
        })
    }
    searchLocation() {

        this.props.changeLocation(localStorage.getItem('userLocation'))
        var userLocation = JSON.parse(localStorage.getItem('userLocation'))
        this.props.getRequests({
            "latitude": userLocation.latitude,
            "longitude": userLocation.longitude,
            "radius": process.env.REACT_APP_PROVIDER_RADIUS ? parseFloat(process.env.REACT_APP_PROVIDER_RADIUS) : 40000
        })

    }
    async componentDidUpdate(prevProps) {
        const { requests, userLocation, selectedLocation, userDetails, isUserLoad, isUserLocationUpdated } = this.props;

        // alert(selectedLocation.locationTitle)
        if (prevProps.isUserLoad !== isUserLoad && userDetails) {
            /**
             * If userLocation - First Priority
             * Fetch all requests based on user location
             */
            if (userLocation) {

                this.props.changeLocation(userLocation)
                this.props.getRequests({
                    "latitude": userLocation.latitude,
                    "longitude": userLocation.longitude,
                    "radius": 50000
                })
            }

            else {
                /**
                 * If user location not found
                 * This will fetch the current device location
                 * and load all requests based on that geo data
                 */
                var currentLocation = await getDeviceCurrentLocation()
                if (currentLocation && !this.props.selectedLocation) {
                    var locationData = {
                        locationTitle: currentLocation.formatted_address,
                        latitude: currentLocation.geometry.latitude,
                        longitude: currentLocation.geometry.longitude
                    }

                    this.props.changeLocation(locationData)
                    this.props.getRequests({
                        "latitude": locationData.latitude,
                        "longitude": locationData.longitude,
                        "radius": process.env.REACT_APP_PROVIDER_RADIUS ? parseFloat(process.env.REACT_APP_PROVIDER_RADIUS) : 40000
                    })
                } else {
                    this.props.resetRequests()
                    this.props.changeLocation(null)
                }

            }
        }
        /**
         * Check the change in selected location
         * this will trigger , only if the user changes the locations
         */
        if (prevProps.selectedLocation !== selectedLocation && selectedLocation !== null && selectedLocation) {
            this.props.getRequests({
                "latitude": selectedLocation.latitude,
                "longitude": selectedLocation.longitude,
                "radius": process.env.REACT_APP_PROVIDER_RADIUS ? parseFloat(process.env.REACT_APP_PROVIDER_RADIUS) : 40000
            })

        }
        if (prevProps.isUserLocationUpdated !== isUserLocationUpdated && userLocation) {

            this.setState({
                isModalVisible: true
            })
        }
    }
    setDefaultLocation() {
        if (this.props.selectedLocation !== null) {
            var userLocationId = uuidv4()
            var locationParams = {
                "locationid": this.props.userLocation && this.props.userLocation.locationId ? this.props.userLocation.locationId : userLocationId,
                "locationTitle": this.state.userLocation.locationTitle,
                "userid": localStorage.getItem('userId').toString(),
                "user_latitude": this.state.userLocation.latitude,
                "user_longitude": this.state.userLocation.longitude
            }
            var userlocationParams = {
                "locationid": this.props.userLocation && this.props.userLocation.locationId ? this.props.userLocation.locationId : userLocationId,
                "locationTitle": this.state.userLocation.locationTitle,
                "userid": localStorage.getItem('userId').toString(),
                "latitude": this.state.userLocation.latitude,
                "longitude": this.state.userLocation.longitude
            }

            this.props.setUserLocation(locationParams)
            this.props.updateUserLocation(locationParams)
        } else {
            window.alert('Please select your location')
        }


    }
    render() {
        const { requests, userLocation, userDetails, isRequestLoading } = this.props
        console.log('REQUESTS', requests);
        return (
            <React.Fragment>

                <section className="section mt-60 padd50 whitegrad-bg">
                    <Container className="mt-lg-3 relative">
                        <Row>
                            <Col lg="12" className="relative">

                                <Row>
                                    <Col md="3">
                                        <h6 style={{marginTop: 10}} className="bold mobile-hide">Choose your location to find a service</h6>
                                    </Col>
                                    <Col md="4" xs="8" style={{ paddingLeft: 12 }}>
                                        <FloatingInput onSelectLocation={this.onSelectLocation} value={this.state.selectedLocation} label={"Enter your location"} initialLocation={userLocation && userLocation ? userLocation : ''}  {...this.props} />
                                    </Col>
                                    <Col md="2" className="mobile-hide">
                                        <Button onClick={() => this.setDefaultLocation()} className="set-default">Set as default</Button>
                                    </Col>
                                    <Col md="1" className="mobile-hide">
                                        <h6 style={{ marginTop: 10, textAlign: "right" }} className="bold">View</h6>
                                    </Col>
                                    <Col md="2" xs="4">
                                        <select className="form-control b-r-10 custom-select">
                                            <option value="">All</option>
                                            <option value="">Bookmarked</option>
                                        </select>
                                    </Col>
                                    <Col md="12" style={{ marginTop: 30 }} className="mobile-show">
                                        <Button onClick={() => this.setDefaultLocation()} className="set-default-mobile">Set as default</Button>
                                    </Col>
                                </Row>

                                <div className="requests-container hide-scroll">

                                    <div>
                                        <Row style={{ marginTop: 30 }}>
                                            {
                                                !isRequestLoading && requests && requests.length > 0 ? (
                                                    requests && requests.sort((a, b) => (a.createdAt > b.createdAt) - (a.createdAt < b.createdAt)).reverse().map((request, index) => (                                                        
                                                        <Col lg="4" key={index} >
                                                            <RequestItem key={index} request={request} {...this.props} />
                                                        </Col>                                                      
                                                    )
                                                    )
                                                ) : <Col lg="12" style={{ textAlign: 'center', padding: 30, marginTop: 20 }}>
                                                        <img src={location} style={{ width: 70, height: 70 }} />
                                                        <p style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 10, marginBottom: 0, fontSize:14 }}>No requests found on this location {`  ${this.props.selectedLocation ? this.props.selectedLocation.locationTitle ? this.props.selectedLocation.locationTitle : '' : ''}`}</p>
                                                        <p style={{ textAlign: 'center', color: '#A8A8A8' }}>If your location is not set, try changing the location</p>
                                                    </Col>

                                            }
                                            {
                                                isRequestLoading && (
                                                    <Modal className="spinner-modal" isOpen={true}>
                                                        <Spinner style={{ margin: "10px auto" }} animation="border" />
                                                    </Modal>
                                                )
                                            }
                                            <Modal isOpen={this.state.isModalVisible}>
                                                <ModalBody>
                                                    <div style={{ textAlign: 'center' }}>
                                                        <h6 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 1, color: '#861b8d' }}>Location updated</h6>
                                                        <p>You have changed your location</p>
                                                        <Button onClick={() => this.setState({ isModalVisible: false, modalMessage: '', modalDescription: '' })}>Close</Button>
                                                    </div>
                                                </ModalBody>
                                            </Modal>

                                        </Row>
                                    </div>

                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>
            </React.Fragment>

        )
    }
}

const mapStateToProps = (state) => ({
    requests: state.request.requests,
    selectedLocation: state.profile.selectedLocation,
    userDetails: state.profile.userDetails,
    isUserLoad: state.profile.isUserLoad,
    userLocation: state.profile.userLocation,
    isRequestLoading: state.profile.isRequestLoading,
    isUserLocationUpdated: state.profile.isUserLocationUpdated
})

const mapDispatchToProps = {
    ...RequestActions,
    ...ProfileAction

}

export default connect(mapStateToProps, mapDispatchToProps)(UserRequestList)
