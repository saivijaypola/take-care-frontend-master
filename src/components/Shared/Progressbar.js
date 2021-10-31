import React, { Component } from 'react';
import { Progress } from "reactstrap";
import { Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import { ProfileAction } from "../../redux/actions";
import { connect } from 'react-redux';

class Progressbar extends Component {

    constructor() {
        super()
        this.state = {
            userId: ''
        }
    }

    componentDidMount() {
        if (localStorage.getItem("userId") !== null) {
            this.setState({
                userId: localStorage.getItem("userId")
            }, () => {
                this.props.getProfileCompletionProgress({
                    userId: this.state.userId
                })
            })
        }

    }
    render() {
        return (
            <div>
                <Progress className="position-relative green-bar" value={`${this.props.profileCompletionProgress}`} />
                <div className="progress-value d-block mt-1 text-muted h6">{`${this.props.profileCompletionProgress}%`}</div>
            </div>
        );
    }
}
function mapStateToProps(state) {
    return {
        profileCompletionProgress: state.profile.profileCompletionProgress
    }
}

export default connect(mapStateToProps, { ...ProfileAction })(Progressbar)