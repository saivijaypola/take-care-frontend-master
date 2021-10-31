import React, { Component } from 'react'
import { connect } from 'react-redux'
import firebase from "firebase"
import { UserActions } from '../../../redux/actions';
import { formatAMPM } from "../../../utils/helper";
import ReactMoment from './LastSeen';
const assetsBaseUrl = process.env.REACT_APP_ASSETS_BASE_URL
export class UserStatus extends Component {


    constructor() {
        super()
        this.state = {
            visible: false,
            online: false,
            lastOnline:""
        }
    }
    componentDidMount() {
        const { userId } = this.props
        var visibleRef = firebase.database().ref('usermeta/' + userId + '/visible');
        visibleRef.on('value', snapshot => {
            const isVisible = snapshot.val();
            this.setState({ visible: isVisible });
        });
        var lastSeenRef = firebase.database().ref('usermeta/' + userId + '/lastseen');
        lastSeenRef.on('value', snapshot => {
            var lastSeen = snapshot.val();
            var now = new Date()
            if(lastSeen){
                this.setState(
                    {
                        lastOnline:lastSeen
                    }
                )
            }else{
                now.setMonth(now.getMonth() - 1)
                lastSeen=now.getTime()
                this.setState(
                    {
                        lastOnline:lastSeen
                    }
                )
                
            }
            
        });
        var onlineRef = firebase.database().ref('usermeta/' + userId + '/online');
        onlineRef.on('value', snapshot => {
            const isOnline = snapshot.val();
            this.setState({ online: isOnline });
        });
    }
    render() {
        return (
            <React.Fragment>
                {
                    this.state.visible ?
                        <span style={{ fontSize: 13 }}> <span style={{ fontSize: 11, marginRight: 14 }}>🟢</span> Online</span>
                        :
                        <span style={{ fontSize: 11 }}> <span style={{ fontSize: 11, marginRight: 14 }}>🟡</span> Away &nbsp; | &nbsp; Last seen:  <ReactMoment timestamp={this.state.lastOnline} />  </span> 
                }
                        

            </React.Fragment>

        )
    }
}

const mapStateToProps = (state) => ({


})

const mapDispatchToProps = {

    ...UserActions
}

export default connect(mapStateToProps, mapDispatchToProps)(UserStatus)
