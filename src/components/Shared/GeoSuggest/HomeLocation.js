/* global google */
import React, { Component } from 'react'
import './FloatingInput.css'
import blackmarker from '../../../assets/images/icon/location-black.png'
import close from '../../../images/icon/close.svg'
import Geosuggest from 'react-geosuggest';
import "./geosuggest.css";
import "./ButtonRegular.css"
import { ProfileAction ,RequestActions} from "../../../redux/actions";
import { connect } from "react-redux";
import { getDeviceCurrentLocation } from "../../../utils/location"

class HomeLocation extends Component {

    constructor(props) {
        super(props)
        this.state = {
            deviceLocation: '',
            latitude: '',
            longitude: ''
        }
        this.onSuggestSelect = this.onSuggestSelect.bind(this)
        this.onContinue = this.onContinue.bind(this)
        this.clearText = this.clearText.bind(this)
    }


    onSuggestSelect(suggest) {

        if (suggest && suggest !== '') {



            this.setState({
                deviceLocation: suggest.description,
                latitude: suggest.location.lat,
                longitude: suggest.location.lng
            }, () => {
                this.onContinue()

            })

        } else {
            localStorage.removeItem('userLocation')
        }

    }
    clearText() {
        this.setState({
            deviceLocation: ''
        })
    }
    onContinue() {

        const { deviceLocation, latitude, longitude } = this.state
        if (deviceLocation !== '') {
            let locationData = {
                locationTitle: deviceLocation,
                latitude: latitude,
                longitude: longitude

            };
            this.props.onSelectLocation(locationData)
            //this.props.changeLocation(locationData)
            localStorage.setItem('userLocation', JSON.stringify(locationData));

        } else {

        }
    }
    resetLocation(){
        this.props.resetRequests()
        this.props.changeLocation(null)
    }
    render() {
         
        return (
            <React.Fragment>
                <img onClick={() => this.resetLocation() } className="geoclose" src={close}></img>
                <Geosuggest
                    placeholder={this.props.label}
                    initialValue={this.props.selectedLocation && this.props.selectedLocation.locationTitle}
                    value={this.props.value ? this.props.value : ''}
                    onSuggestSelect={this.onSuggestSelect}
                    autoComplete="off"
                    onEmptied={() => localStorage.removeItem('userLocation')}
                    location={new google.maps.LatLng(11.258753, 75.780411)}
                    radius="15" >
                </Geosuggest>
            </React.Fragment>
        )
    }
}
function mapStateToProps(state) {
    return {
        selectedLocation: state.profile.selectedLocation,
        userLocation: state.profile.userLocation
    }
}
export default connect(mapStateToProps, { ...ProfileAction,...RequestActions })(HomeLocation)