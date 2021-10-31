import React, { Component } from 'react';
import { Progress, Modal, ModalBody, Button, Spinner } from "reactstrap";
import { Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import { getUser } from '../../../handler/authenticate';
import { ProfileAction } from '../../../redux/actions';
import { connect } from 'react-redux';

class VerifyPrice extends Component {
    constructor() {
        super()
        this.state = {
            isSent: false
        }
        this.requestForUpgrade = this.requestForUpgrade.bind(this)
    }
    componentDidUpdate(prevProps, prevState) {

        //is education stored 
        const { isBuyVerificationSent, isLoading } = this.props;
        if (prevProps.isLoading !== isLoading && isBuyVerificationSent) {
            this.setState({
                isSent: true
            })
        }
    }
    requestForUpgrade() {
        this.props.buyVerification({
            "order_price": "Rs 385.00",
            "tax_amt": "Rs 24.00",
            "order_total": "Rs 409.00",
            "provider_name": this.props.userDetails && this.props.userDetails.fullname,
            "email": getUser().email
        })
    }
    render() {
        const { isSent } = this.state
        return (
            <div className="verify-mini text-center-mobile">
                <Row>
                    <Col md="12">
                        <h6><b>Improve your profile strength with additional verification</b></h6>
                        <h4 style={{ fontWeight: 'bold' }}>INR 385</h4>
                        <p style={{ fontSize: 12 }}>{this.props.title}</p>
                        <a className="verify-button" onClick={() => this.requestForUpgrade()}>Request</a>
                    </Col>
                </Row>
                {/* {
                    this.props.isLoading ? (
                        <Modal className="spinner-modal" isOpen={true}>
                            <Spinner animation="border" />
                        </Modal>
                    ) : ''
                } */}
                {
                    isSent && (
                        <Modal isOpen={true}>
                            <ModalBody>
                                <h5>Verification Order Sent</h5>
                                <Button onClick={() => this.setState({ isSent: false })}>Close</Button>
                            </ModalBody>
                        </Modal>
                    )
                }

            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    userDetails: state.profile.userDetails,
    isLoading: state.profile.isLoading,
    isBuyVerificationSent: state.profile.isBuyVerificationSent
})

const mapDispatchToProps = {
    ...ProfileAction
}

export default connect(mapStateToProps, mapDispatchToProps)(VerifyPrice)