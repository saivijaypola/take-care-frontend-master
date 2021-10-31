import React, { Component } from 'react'
import { connect } from 'react-redux'
import './Nodata.css'
import nodata from "../../images/icon/nodata.png"

export class Nodata extends Component {
    render() {
        return (
            <div className="text-center no-data">
                <img src={this.props.img}></img>
                <h4>{this.props.title}</h4>
                <p className="text-muted">{this.props.desc}</p>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Nodata)
