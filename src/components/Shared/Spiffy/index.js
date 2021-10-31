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

class SpiffyIcon extends Component {


    constructor() {
        super()
        this.state = {
            strength: 0,
            userData: null
        }
    }
    componentDidMount() {
        if (localStorage.getItem("userId") !== null) {
            this.setState({
                userId: localStorage.getItem("userId")
            }, () => {
                this.props.getSpiffyStrength({
                    userId: this.state.userId
                })
            })
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.spiffyStrength !== prevState.spiffyStrength) {
            if (nextProps.spiffyStrength) {
                return nextProps;
            }
        }
        return null
    }
    componentDidUpdate(prevProps, prevState) {
        const { spiffyStrength } = this.props;
        if (prevProps.spiffyStrength !== spiffyStrength && spiffyStrength) {
            this.setState({
                userData: spiffyStrength
            }, () => {

            })
        }

    }
    render() {
        return (
             
                <img src={icons[this.props && this.props.spiffyStrength ? this.props.spiffyStrength : 0 ]} style={{...this.props.style}} className={this.props.className} />
              
        )
    }
}
function mapStateToProps(state) {
    return {
        spiffyStrength: state.profile.spiffyStrength
    }
}
export default connect(mapStateToProps, { ...ProfileAction })(SpiffyIcon)