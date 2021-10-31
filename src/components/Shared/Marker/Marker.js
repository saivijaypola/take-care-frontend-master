import React, { Component } from 'react'
import { connect } from 'react-redux'
import marker from '../../../assets/images/icon/green-mark.png'
import './Marker.css'
import PopOver from '../Popover/Popover';

export class Marker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isMarkerShow: false
        }
    }
    onClickMarker = () => {

        this.setState({
            isMarkerShow: !this.state.isMarkerShow
        })
        //this.props.resetPopUp(id, prevState)
    }
    render() {
        const { lng, lat, text, description, index, info } = this.props;
        const { isMarkerShow } = this.state;
        return (

            <div className="marker-top marker" onClick={() => this.onClickMarker()}>
                <img className="" src={marker} alt="icon"></img>
                {
                    isMarkerShow ?
                        <PopOver lat={lat} text={text} info={info} lng={lng} description={description} {...this.props} />
                        : ''}
                {/* {index === 0 &&!isMarkerShow&&
                    <PopOver lat={lat} text={text} lng={lng} description={description} />
                } */}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Marker)
