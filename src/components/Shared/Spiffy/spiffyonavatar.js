import React, { Component } from 'react';
import imgSpiffy0 from "../../../images/icon/yoyoco-safe-0.png";
import imgSpiffy1 from "../../../images/icon/yoyoco-safe-1.png";
import imgSpiffy2 from "../../../images/icon/yoyoco-safe-2.png";
import imgSpiffy3 from "../../../images/icon/yoyoco-safe-3.png";
import imgSpiffy4 from "../../../images/icon/yoyoco-safe-4.png";
import imgSpiffy5 from "../../../images/icon/yoyoco-safe-5.png";

import { ProfileAction } from "../../../redux/actions";
import { connect } from 'react-redux';

const icons = [
    imgSpiffy0,
    imgSpiffy1,
    imgSpiffy2,
    imgSpiffy3,
    imgSpiffy4,
    imgSpiffy5
]

export default class SpiffyOnAvatar extends Component {

    render() {
        return (
             
                <img src={icons[this.props.spiffyStrength]} style={{...this.props.style, width: this.props.width, height: this.props.height}} className={this.props.className} />
              
        )
    }
}
