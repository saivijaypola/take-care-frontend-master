import React, { Component } from 'react'
import RequestItem from './RequestItem'
import { connect } from 'react-redux'
import { v4 as uuidv4 } from 'uuid';
import {
    Container, Row, Col, Button, Modal, Spinner, ModalBody
} from "reactstrap";
import { ProfileAction, RequestActions } from '../../redux/actions';
import FloatingInput from '../../components/Shared/GeoSuggest/FloatingInput';
import imgbg from "../../assets/images/account/bg.jpg";
import location from "../../images/icon/location.png";
import walletimg from "../../images/icon/wallet.svg";
import UserInfo from '../../components/Shared/UserInfo';
import { auth } from "firebase/app";
import { getUser } from '../../handler/authenticate';
import { getDeviceCurrentLocation } from '../../utils/location';
import assets from '../../assets/images';


export class Wallet extends Component {
    constructor() {
        super()
        this.state = {

            isModalVisible: false
        }

    }

    componentDidMount() {


        if (localStorage.getItem("userId") !== null) {


            // this.props.getProviderWallet({ provider_id: localStorage.getItem('userId') })

        }


    }

    onChangeText(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    getWalletBalance(advanceTotal, payableTotal, amountPaid) {
        if (!isNaN(advanceTotal) && !isNaN(payableTotal) && !isNaN(amountPaid)) {
            const balance = (parseFloat(advanceTotal) + parseFloat(payableTotal)) - parseFloat(amountPaid)
            return balance.toFixed(2)
        } else {
            return 0.00
        }
    }
    render() {
        const { requests, orders, userLocation, isOrdersLoading, wallet } = this.props
        return (
            <React.Fragment>

                <section className="=">
                    <Container className="relative">
                        <Row>
                            <Col lg="12" className="relative">

                                <div className="requests-container">
                                    <div>
                                        <Row>
                                            <div className="lavendar-bg">
                                                <h1>Payment Instructions</h1>
                                                <Row>
                                                    <Col xs="6" md="3" className="payment-info-wrapper">
                                                        <img src={assets.images.info} />
                                                        <h4>Respond</h4>
                                                        <p>to the request with a quote</p>
                                                    </Col>
                                                    <Col xs="6" md="3" className="payment-info-wrapper">
                                                        <img src={assets.images.info} />
                                                        <h4>Remind</h4>
                                                        <p>the user to accept and pay for the quote</p>
                                                    </Col>
                                                    <Col xs="6" md="3" className="payment-info-wrapper">
                                                        <img src={assets.images.info} />
                                                        <h4>Receive</h4>
                                                        <p>a payment link in your registered email id</p>
                                                    </Col>
                                                </Row>


                                                {/* <div className="wallet">
                                                <img src={walletimg}></img>
                                                <h6>Rs. {wallet.payableTotal}</h6>
                                                <p>Balance</p>
                                            </div>
                                            <br />
                                            {/* <Button onClick={() => this.props.history.push('/provider/walletdetails/' + localStorage.getItem('userId'))} className="neat-button width100" style={{maxWidth:200,display:"block",margin:"0 auto"}}> Withdraw</Button> */}
                                            </div>
                                            {/* <Row>
                                            <Col xs="6">
                                                <div className="pay-card">
                                                    <p><b>Rs. {wallet.amountPaid}</b></p>
                                                    <p className="font-title">Amount Withdrawn</p>
                                                </div>
                                            </Col>
                                            <Col xs="6">
                                                <div className="pay-card">
                                                    <p><b>Rs. {this.getWalletBalance(wallet.advanceTotal, wallet.payableTotal, wallet.amountPaid)}</b></p>
                                                    <p className="font-title">Total Earnings</p>
                                                </div>
                                            </Col>
                                            {/* <Col xs="6">
                                                <div className="pay-card">
                                                    <h5><b>Rs. {wallet.payableTotal}</b></h5>
                                                    <p className="font-title">Payable Total</p>
                                                </div>
                                            </Col> */}
                                            <Col xs="12">

                                            </Col>
                                            {
                                                isOrdersLoading && (
                                                    <Modal className="spinner-modal" isOpen={true}>
                                                        <Spinner style={{ margin: "10px auto" }} animation="border" />
                                                    </Modal>
                                                )
                                            }
                                        </Row>
                                    </div>

                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>
            </React.Fragment>

        )
    }
}

const mapStateToProps = (state) => ({
    requests: state.request.requests,
    isOrdersLoading: state.request.isOrdersLoading,
    orders: state.request.orders,
    userDetails: state.profile.userDetails,
    isUserLoad: state.profile.isUserLoad,
    isRequestLoading: state.profile.isRequestLoading,
    isUserLocationUpdated: state.profile.isUserLocationUpdated,
    wallet: state.request.wallet
})

const mapDispatchToProps = {
    ...RequestActions,
    ...ProfileAction

}

export default connect(mapStateToProps, mapDispatchToProps)(Wallet)
