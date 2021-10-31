import React, { Component } from 'react'
import { connect } from 'react-redux'
import blue_dot from'../../../assets/images/icon/blue_tick.png'
import './MyLocation.css'

export class MyLocation extends Component {
    render() {
        const { pop,lat,lng,description } = this.props;
        return (
            <div className="dp-bottom">
                <img className="" src={blue_dot} alt="Profile DP"></img>
                {/* <PopOver lat={lat} text={"You are here"} lng={lng} description={description} /> */}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(MyLocation)
