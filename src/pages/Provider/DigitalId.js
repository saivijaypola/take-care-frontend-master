import React, { Component } from 'react'

import { connect } from 'react-redux'
import { v4 as uuidv4 } from 'uuid';
import {
    Container, Row, Col, Button, Modal, Spinner, ModalBody

} from "reactstrap";
import user from "../../images/icon/user-6.png";
import { RequestActions } from '../../redux/actions';
import Spiffy from '../../components/Shared/Spiffy';
import SpiffyOnAvatar from '../../components/Shared/Spiffy/spiffyonavatar';


export class DigitalId extends Component {
    constructor(props) {
        super(props)
        this.state = {

            digitalId: ''
        }

    }
    componentDidMount() {
        this.props.getDigitalId({ "serviceOrderId": this.props.serviceorderid ? this.props.serviceorderid : this.props.match ? this.props.match.params.serviceorderid : '' })
    }
    componentDidUpdate(prevProps) {
        const { digitalId, provider, isDigitalIdLoading } = this.props
        if (digitalId !== prevProps.digitalId && isDigitalIdLoading !== prevProps.isDigitalIdLoading) {
            console.log('DATA DIGITAL ID', digitalId)
        }
    }

    render() {
        console.log('DIGITAL ID PROPS', this.props && this.props.digitalId)
        const { digitalId, provider, isDigitalIdLoading } = this.props
        return (
            <React.Fragment>
                {
                    digitalId && (
                        <Container style={{marginTop:150}}>
                            <div className="digital-modal relative">
                                <img src={`${provider && provider.avatarUrl !== '' ? `${process.env.REACT_APP_ASSETS_BASE_URL}/Users/${provider && provider.userId}/Avatar/${provider.avatarUrl}` : user}`} style={{ width: 200, height: 200, marginBottom: 15, borderRadius: 10 }} />
                                <SpiffyOnAvatar className={"spiffy-big"} spiffyStrength={provider.spiffy} />
                                {/* <img className="spiffy-big" src={imgSpiffy5}/> */}
                                <h5 style={{ fontSize: 20, marginBottom: 0 }}>{provider && provider.fullname}</h5>

                                <h5 style={{ fontSize: 50, color: '#861b8d', fontWeight: 'bold', marginBottom: 0 }}>{digitalId.digitalIdCode}</h5>
                                <p className="font-title">Order Digital Code</p>
                                <br /><br />
                            </div>
                        </Container>


                    )
                }

            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    digitalId: state.request.digitalId,
    isDigitalIdLoading: state.request.isDigitalIdLoading,
    provider: state.request.digitalId && state.request.digitalId.tblUserByProviderId
})

const mapDispatchToProps = {
    ...RequestActions

}

export default connect(mapStateToProps, mapDispatchToProps)(DigitalId)
