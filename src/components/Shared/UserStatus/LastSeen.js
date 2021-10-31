import React  from 'react';
import Moment from 'react-moment';
 
export default class LastSeen extends React.Component {
    render() {
        return (
            <Moment fromNow>{this.props.timestamp}</Moment>
        );
    }
}