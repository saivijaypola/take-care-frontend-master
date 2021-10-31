import React, { Component } from 'react'
import { connect } from 'react-redux'
import './Map.css'
import GoogleMapReact from 'google-map-react';
import Marker from "../Marker/Marker";
import { UserActions } from '../../../redux/actions';
import { MyLocation } from '../MyLocation/MyLocation';
import { getDeviceCurrentLocation } from '../../../utils/location';
import { getDistance } from 'geolib';
export class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
         
            isLocationDetected:false,
            deviceLocation:''
        }
    }
   
    render() {
         const { selectedPost } = this.props;
        const center = {
            lat:selectedPost && selectedPost.latitude,
            lng: selectedPost && selectedPost.longitude
        }
        const { nearByProviders } = this.props
       
        return (
            <div style={{ height: 500 }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAP_APIKEY }}
                    defaultCenter={center}
                    defaultZoom={11}
                    clickableIcons={true}
                >
                    {
                        center && (
                            <MyLocation type={"left"} lat={center.lat}  lng={center.lng} text={"You are here"}  title={"Service Location"} description={selectedPost.locationTitle} />
                        )
                    }
                    {
                        nearByProviders && nearByProviders.length > 0 && (
                            nearByProviders.map((provider, index) =>
                                <Marker key={index} info={provider} index={index} text={provider.fullname} lat={provider.latitude} lng={provider.longitude} description={`${getDistance({latitude:center.lat,longitude:center.lng},{ latitude: provider.latitude, longitude : provider.longitude})/1000 } Km away from your service location`} {...this.props} />
                            )
                        )
                    }
                </GoogleMapReact>
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    selectedPost: state.user.selectedPost,
    allPosts: state.user.allPosts,
    isLoading: state.user.isLoading,
    nearByProviders: state.user.nearByProviders
})

const mapDispatchToProps = {
    ...UserActions
}

export default connect(mapStateToProps, mapDispatchToProps)(Map)

