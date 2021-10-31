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
import UserInfo from '../../components/Shared/UserInfo';
import { auth } from "firebase/app";
import { getUser } from '../../handler/authenticate';
import { getDeviceCurrentLocation } from '../../utils/location';


export class ProviderOrders extends Component {
    constructor() {
        super()
        this.state = {

            isModalVisible: false
        }

    }

    componentDidMount() {


        if (localStorage.getItem("userId") !== null) {
             

            this.props.getProviderOrders({ provider_id: localStorage.getItem('userId') })
        }
        this.props.getProviderCareOrders({ providerId: localStorage.getItem('userId') })


    }

    onChangeText(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    render() {
        const { requests, orders, userLocation, isOrdersLoading, careOrders } = this.props
        var allOrders = orders && orders !== null && careOrders !== null ? orders.concat(careOrders) : orders === null && careOrders !== null ? careOrders : orders !== null && careOrders === null ? orders : []
        const latestOrders = allOrders && allOrders.length > 1 ? allOrders.sort((a, b) => (a.orderAcceptedOn > b.orderAcceptedOn) - (a.orderAcceptedOn < b.orderAcceptedOn)).reverse() : allOrders
        console.log('CARE ORDERS', allOrders)
        return (
            <React.Fragment>

                <section className="section mt-60 padd50 whitegrad-bg">
                    <Container className="mt-lg-3 relative">
                        <Row>
                            <Col lg="12" className="relative">

                                <div className="requests-container">
                                    <div>
                                        <Row>
                                            {
                                                !isOrdersLoading && allOrders && allOrders.length > 0 ? (
                                                    latestOrders && latestOrders.map((order, index) =>
                                                        <Col lg="4" key={index} >
                                                            <RequestItem key={index} request={order} {...this.props} />
                                                        </Col>
                                                    )
                                                ) : <Col lg="12" style={{ textAlign: 'center', padding: 30 }}>
                                                        <img src={location} style={{ width: 70, height: 70 }} />
                                                        <p style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 0, marginBottom: 0, fontSize:14 }}>No Orders found</p>
                                                        <p style={{ textAlign: 'center', color: '#A8A8A8' }}>Check later</p>
                                                    </Col>

                                            }
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
    careOrders: state.request.providerCareOrders,
    isCareOrdersLoading: state.request.isProviderCareOrdersLoading
})

const mapDispatchToProps = {
    ...RequestActions,
    ...ProfileAction

}

export default connect(mapStateToProps, mapDispatchToProps)(ProviderOrders)
