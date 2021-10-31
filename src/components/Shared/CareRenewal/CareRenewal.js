import React, { createContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import cancel from '../../../images/icon/pink-cancel.svg'
import { countries } from "../../../pages/User/country";
import axios from "axios";
import { UserActions } from "../../../redux/actions";
import firebase from "firebase"
import { PayPalButton } from "react-paypal-button-v2";
import { useDispatch } from 'react-redux';
import { Input, Button } from 'semantic-ui-react'
import {
    Container, Row, Col, Modal, ModalBody, ModalFooter, ModalHeader,
    Table
} from "reactstrap";
import check from "../../../images/icon/check.svg";
import getSymbolFromCurrency from 'currency-symbol-map';
import getCouponGql from '../../../graphql/query/getCouponByCouponTitle';
import { query } from '../../../graphql/graphqlHandler';


export default function CareRenewal(props) {
    console.log('PROPS', props);
    const { serviceDetails, orderDetails, myRequestDetails, isRenew } = props
    const [chatId, setChatId] = useState(props.chatId)
    const [metadata, setMetadata] = useState('')
    const [paydata, setPaydata] = useState('')
    const [isCouponVisible, setCouponVisible] = useState(false)
    const [percentageDeducted, setPercentageDeducted] = useState(null)
    const [selectedCurrency, setCurrency] = useState(orderDetails[0] && orderDetails[0].selectedCurrency)
    const [exchangeRate, setExchangeRate] = useState(1)
    const [paymentSelected, setPayment] = useState('')
    const [couponCode, setCouponCode] = useState('')
    const [isCouponApplied, setIsCouponApplied] = useState('Pending')
    const [totalAmount, setTotalAmount] = useState(0)
    const [finalAmount, setFinalAmount] = useState()
    const [isError, setIsError] = useState(false)
    const [modalTitle, setModalTitle] = useState('')
    const [modalDescription, setModalDescription] = useState('')
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [orders, setOrders] = useState()
    const [totalExpenses, setTotalExpenses] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [orderSuccess, setOrderSuccess] = useState(false)
    const [payVisible, setPayVisible] = useState(false)

    const dispatch = useDispatch()

    useEffect(() => {
        window.scrollTo(0, 0)
        if (chatId) {
            const metadataRef = firebase.database().ref('Care/' + chatId + '/Metadata/');
            metadataRef.on('value', snapshot => {
                const getMetadata = snapshot.val();
                var orders = []
                var visits = []
                if (getMetadata && orderDetails) {
                    setMetadata(getMetadata)
                    for (var i = 0; i < orderDetails.length; i++) {
                        var order = getMetadata[orderDetails[i].careOrderId]
                        orders.push(order)
                    }
                }

                if (orders && orders.length > 0) {
                    for (var i = 0; i < orders.length; i++) {
                        var visit = orders[i].history && orders[i].history[orders[i].history.length - 1].visit
                        if (visit && visit !== undefined) {
                            for (var j = 0; j < visit.length; j++) {
                                var v = visit[j]
                                visits.push(v)
                            }
                        }

                    }
                    let additionalExpenses = visits.reduce((a, b) => parseFloat(a) + parseFloat(b.additionalExpenses), 0);
                    setTotalExpenses(additionalExpenses)
                }

                var paymentData = []
                var totals = []
                for (var i = 0; i < orderDetails.length; i++) {
                    var monthlyFee = serviceDetails.filter(x => x.careProviderId === orderDetails[i].careProviderId)[0].monthlyFee;
                    var perVisitFee = serviceDetails.filter(x => x.careProviderId === orderDetails[i].careProviderId)[0].perVisitCharge;
                    var yocoFee = parseFloat(serviceDetails.filter(x => x.careProviderId === orderDetails[i].careProviderId)[0].yocoServiceCharge) / 100;
                    var noOfVisits = orders.filter(x => x.orderId === orderDetails[i].careOrderId)[0].history ? orders.filter(x => x.orderId === orderDetails[i].careOrderId)[0].history[orders.filter(x => x.orderId === orderDetails[i].careOrderId)[0].history.length - 1].visit.length : 0;
                    var additionalExpenses = orders.filter(x => x.orderId === orderDetails[i].careOrderId)[0].history ? orders.filter(x => x.orderId === orderDetails[i].careOrderId)[0].history[orders.filter(x => x.orderId === orderDetails[i].careOrderId)[0].history.length - 1].visit.reduce((a, b) => parseFloat(a) + parseFloat(b.additionalExpenses), 0) : 0

                    var providerFee = parseFloat(monthlyFee) + (parseFloat(perVisitFee) * parseFloat(noOfVisits)) + parseFloat(additionalExpenses)
                    var totalAmount = parseFloat(providerFee) + (parseFloat(yocoFee) * parseFloat(providerFee))
                    var total = {
                        totalAmount: parseFloat(totalAmount).toFixed(2)
                    }
                    totals.push(total)

                    var details = {
                        providerName: serviceDetails.filter(x => x.careProviderId === orderDetails[i].careProviderId)[0].tblUserByProviderId.fullname,
                        supportDescription: serviceDetails.filter(x => x.careProviderId === orderDetails[i].careProviderId)[0].supportDescription,
                        monthlyFee: serviceDetails.filter(x => x.careProviderId === orderDetails[i].careProviderId)[0].monthlyFee,
                        perVisitFee: serviceDetails.filter(x => x.careProviderId === orderDetails[i].careProviderId)[0].perVisitCharge,
                        yocoFee: parseFloat(serviceDetails.filter(x => x.careProviderId === orderDetails[i].careProviderId)[0].yocoServiceCharge) / 100,
                        noOfVisits: orders.filter(x => x.orderId === orderDetails[i].careOrderId)[0].history ? orders.filter(x => x.orderId === orderDetails[i].careOrderId)[0].history[orders.filter(x => x.orderId === orderDetails[i].careOrderId)[0].history.length - 1].visit.length : 0,
                        additionalExpenses: orders.filter(x => x.orderId === orderDetails[i].careOrderId)[0].history ? orders.filter(x => x.orderId === orderDetails[i].careOrderId)[0].history[orders.filter(x => x.orderId === orderDetails[i].careOrderId)[0].history.length - 1].visit.reduce((a, b) => parseFloat(a) + parseFloat(b.additionalExpenses), 0) : 0,
                        totalAmount: totalAmount
                    }
                    paymentData.push(details)

                    let grandTotal = totals.reduce((a, b) => parseFloat(a) + parseFloat(b.totalAmount), 0);
                    setTotalAmount(parseFloat(grandTotal).toFixed(2))
                    setFinalAmount(parseFloat(grandTotal).toFixed(2))
                    console.log('GT', grandTotal);
                }
                setOrders(paymentData)

            }, [])

            metadataRef.on('value', snapshot => {
                const getMetadata = snapshot.val();
                if (getMetadata && orderDetails) {
                    setPaydata(getMetadata)
                }
            })
        }
    }, [orderDetails])

    useEffect(() => {
        getGeoInfo()
    }, [])

    const getGeoInfo = () => {
        setIsLoading(true)
        axios.get('https://ipapi.co/json').then((response) => {
            let data = response.data;
            setCurrency(data.currency)
            setIsLoading(false)
        }).catch((error) => {
            console.log("GEOINFO", error)
            setCurrency(orderDetails[0] && orderDetails[0].selectedCurrency)
            setIsLoading(false)

        });
    };

    useEffect(() => {
        console.log('GET CURRENCY RATE', selectedCurrency);
        if (selectedCurrency && orderDetails[0]) {
            getCurrencyRate()
        }

    }, [selectedCurrency])

    const getCurrencyRate = () => {
        setIsLoading(true)
        axios.get(`https://api.currencyfreaks.com/latest?apikey=61ab7b0f5bcd4722837983e3b05cfada&symbols=INR&base=${selectedCurrency}`).then((response) => {
            let data = response.data;
            setExchangeRate(data.rates['INR'])
            setIsLoading(false)
        }).catch(() => {
            setIsLoading(false)
            setCurrency(orderDetails[0].selectedCurrency)
            setExchangeRate(1)
        });
    }

    const cancelCoupon = () => {
        setTotalAmount(totalAmount)
        setFinalAmount(parseFloat(totalAmount).toFixed(2))
        setIsCouponApplied('Pending')
        setCouponCode('')
    }

    const revealCoupon = () => {
        setCouponVisible(true)
    }


    const applyCouponCode = async () => {
        var dbParams = {
            "couponTitle": couponCode.toString().toUpperCase().trim()
        }
        const couponResponse = await query(getCouponGql, dbParams);
        console.log(couponResponse)
        if (couponResponse.error) {
            setIsError(true)
            setModalTitle("Network failure")
            setModalDescription("Check your internet connection")
            setIsModalVisible(true)
        }
        else if (couponResponse && couponResponse.tblCouponByCouponTitle && couponResponse.tblCouponByCouponTitle.percentageReduction && couponResponse.tblCouponByCouponTitle.expireOn) {

            setPayVisible(false)
            setIsCouponApplied('Success')
            var expiry = new Date(couponResponse.tblCouponByCouponTitle.expireOn)
            var today = new Date()

            if (expiry > today) {
                var percentage = couponResponse.tblCouponByCouponTitle.percentageReduction
                setPercentageDeducted(percentage)
                var totalPayable = (totalAmount - (totalAmount * percentage / 100))
                if (isNaN(totalPayable)) {
                    setIsCouponApplied("Failed")
                } else {
                    setFinalAmount(parseFloat(totalPayable).toFixed(2))
                }

            }
        } else {
            setIsCouponApplied("Failed")
        }

    }

    const onPaymentError = () => {
        setModalTitle("Payment Failed")
        setModalDescription("Something went wrong, please try again")
        setIsError(true)
        setIsModalVisible(true)
    }

    const createCareOrder = () => {
        setOrderSuccess(true)
        dispatch(UserActions.updateRequestStatus({
            requestId: props.match.params.requestid,
            requestData: {
                status: isRenew ? 'Renewed' : 'Completed'
            }
        }))
        // setIsModalVisible(true)
        // setModalTitle('SUCCESS!')
        // setModalDescription('Payment successful')
        //props.history.push(`/care-renew-success/${props.match.params.requestid}/${props.match.params.careid}`)

        for (var i = 0; i < orderDetails.length; i++) {
            var timelineData = metadata[orderDetails[i].careOrderId]

            const deleteData = firebase.database().ref('Care/' + chatId + '/Metadata/' + orderDetails[i].careOrderId + '/timeline/');
            deleteData.remove()

            var newData = {
                timeline: [
                    {
                        title: 'CREATION',
                        status: 'Confirmed',
                        contactName: timelineData.timeline[0].contactName,
                        countryCode: timelineData.timeline[0].countryCode,
                        contactNumber: timelineData.timeline[0].contactNumber,
                        contactAddress: timelineData.timeline[0].contactAddress,
                        createdOn: new Date(),
                        isActiveForProvider: true,
                        isActiveForUser: true,
                    },
                    {
                        title: 'INITIATION',
                        status: '',
                        updatedOn: '',
                        box1: false,
                        box2: false,
                        box3: false,
                        isActiveForProvider: true,
                        isActiveForUser: true,
                        providerComments: '',
                    },
                    {
                        title: 'UPDATION',
                        status: '',
                        nextVisitDate: '',
                        lastVisitDate: '',
                        isActiveForProvider: false,
                        isActiveForUser: true,
                        digitalId: '',
                        updatedOn: ''
                    },
                    {
                        title: 'APPROVAL',
                        status: '',
                        isActiveForProvider: false,
                        isActiveForUser: false,
                        updatedOn: ''
                    },
                ]
            }

            const metadataRef = firebase.database().ref('Care/' + chatId + '/Metadata/' + orderDetails[i].careOrderId);

            if (isRenew) {
                metadataRef.update(newData)
            }

            var payData = metadata[orderDetails[i].careOrderId].history

            payData[payData.length - 1].isPaid = true

            const paydataRef = firebase.database().ref('Care/' + chatId + '/Metadata/' + orderDetails[i].careOrderId + '/history/');
            paydataRef.update(payData)
        }

        if (!paydata.Payments) {
            var params = {
                month: [
                    {
                        isPaid: true,
                        paymentDate: new Date().toDateString(),
                        paymentType: isRenew ? 'Renewal' : 'End',
                        totalAmount: totalAmount,
                        discountApplied: isCouponApplied === 'Success' ? true : false,
                        discountPercent: percentageDeducted,
                        finalAmount: finalAmount
                    }
                ]
            }

            const metadataRef = firebase.database().ref('Care/' + chatId + '/Payments/');
            metadataRef.update(params)
        } else {
            var payment = paydata.Payments

            payment.month[payment.month.length] =
            {
                isPaid: true,
                paymentDate: new Date().toDateString(),
                paymentType: isRenew ? 'Renewal' : 'End',
                totalAmount: totalAmount,
                discountApplied: isCouponApplied === 'Success' ? true : false,
                discountPercent: percentageDeducted,
                finalAmount: finalAmount
            }

            const metadataRef = firebase.database().ref('Care/' + chatId + '/Payments/');
            metadataRef.update(payment)
        }
    }

    const onChangeText = (event) => {
        setCurrency(event.target.value)
    }

    const closeModal = () => {
        setIsModalVisible(false);
        props.history.push(`/user/orders`)
    }

    const clickedPay = () => {
        if (finalAmount > 0) {
            setPayVisible(true)
        } else {
            createCareOrder()
        }
    }

    return (
        <React.Fragment>
            {!orderSuccess ?
                <section>
                    <div style={{ padding: '3%', backgroundColor: '#fff', marginTop: '2%' }} className="card-shadow">
                        <Row>
                            <Col md='8'>
                                <div style={{ width: '100%', padding: '2%', borderRadius: '2%' }} >
                                    <Row style={{ paddingVertical: '2%' }}>
                                        <Col xs='12' style={{ marginBottom: '5%' }}>
                                            <p className="bold" style={{ fontSize: 22 }}>PAYMENT DETAILS</p>
                                            <hr style={{ width: '40%', position: 'absolute', left: '2%', top: '50%', borderColor: '#5e2490', borderWidth: 3 }} />
                                        </Col>
                                        <Col xs="7">
                                            <p className='bold font16'>Select your currency</p>
                                        </Col>
                                        <Col xs="5">
                                            {
                                                selectedCurrency && (
                                                    <select onChange={onChangeText} defaultValue={selectedCurrency} className="form-control custom-select custom-select-2">
                                                        {
                                                            countries.map((country, index) =>
                                                                <option key={index} value={country.currency}>{`${country.currency}`}</option>
                                                            )
                                                        }
                                                    </select>
                                                )
                                            }

                                        </Col>
                                    </Row>
                                    <hr />
                                    <Col xs='12'>
                                        {
                                            <Row>
                                                <Col xs='12'>
                                                    <Row>
                                                        <Col xs='3'>
                                                            <p className="font14">Provider</p>
                                                        </Col>
                                                        <Col xs='2'>
                                                            <p className="font14">Monthly</p>
                                                        </Col>
                                                        <Col xs='2'>
                                                            <p className="font14">Per Visit</p>
                                                        </Col>
                                                        <Col xs='1'>
                                                            <p className="font14">Visits</p>
                                                        </Col>
                                                        <Col xs='2'>
                                                            <p className="font14">Additional Expenses</p>
                                                        </Col>
                                                        <Col xs='2'>
                                                            <p>Total</p>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                {
                                                    orders && orders.map((order) =>
                                                        <Col xs='12'>
                                                            <hr />
                                                            <Row>
                                                                <Col xs='3'>
                                                                    <p className='bold font15'>{order.providerName}</p>
                                                                    <p>({order.supportDescription})</p>
                                                                </Col>
                                                                <Col xs='2'>
                                                                    <p className='bold'>{getSymbolFromCurrency(`${selectedCurrency}`)} {parseFloat((parseFloat(order.monthlyFee) + (parseFloat(order.yocoFee) * parseFloat(order.monthlyFee))) / exchangeRate).toFixed(2)}</p>
                                                                </Col>
                                                                <Col xs='2'>
                                                                    <p className='bold'>{getSymbolFromCurrency(`${selectedCurrency}`)} {parseFloat((parseFloat(order.perVisitFee) + (parseFloat(order.yocoFee) * parseFloat(order.perVisitFee))) / exchangeRate).toFixed(2)}</p>
                                                                </Col>
                                                                <Col xs='1'>
                                                                    <p className='bold'>{order.noOfVisits}</p>
                                                                </Col>
                                                                <Col xs='2'>
                                                                    <p className='bold'>{getSymbolFromCurrency(`${selectedCurrency}`)} {parseFloat((parseFloat(order.additionalExpenses) + (parseFloat(order.yocoFee) * parseFloat(order.additionalExpenses))) / exchangeRate).toFixed(2)}</p>
                                                                </Col>
                                                                <Col xs='2'>
                                                                    <p className='bold'>{getSymbolFromCurrency(`${selectedCurrency}`)} {parseFloat(order.totalAmount / exchangeRate).toFixed(2)}</p>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    )
                                                }
                                            </Row>
                                        }
                                        <Modal isOpen={isModalVisible} style={{ marginTop: 70 }}>
                                            <ModalHeader>
                                                <p className="bold purple-text" style={{ fontSize: 18 }}>
                                                    {modalTitle}
                                                </p>
                                            </ModalHeader>
                                            <ModalBody>
                                                <p>{modalDescription}</p>
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button onClick={() => closeModal()} className="post-request purple-label">OK</Button>
                                            </ModalFooter>
                                        </Modal>
                                    </Col>

                                    <hr />
                                    <Row>
                                        <Col md='8'>
                                            {
                                                isCouponApplied === 'Pending' ?
                                                    <Row style={{ margin: '0%' }} >
                                                        {!isCouponVisible &&
                                                            <p className='add-coupon text-center' onClick={() => revealCoupon()}>Have a Coupon Code ?</p>
                                                        }
                                                        {
                                                            isCouponVisible &&
                                                            <Input className='coupon-fade-in' type='text' placeholder='Enter Coupon Code' onChange={e => setCouponCode(e.target.value)} icon='percent' iconPosition='left' action>
                                                                <input />
                                                                <Button type='submit' color='orange' onClick={() => applyCouponCode()}>Apply</Button>
                                                            </Input>
                                                        }
                                                    </Row>
                                                    : isCouponApplied === 'Success' ? (
                                                        <div className="coupon-div2">
                                                            <p className='font15'><b>{`You have saved ${percentageDeducted}% of your order`}</b>
                                                                <img onClick={cancelCoupon} src={cancel} style={{ width: 20, marginLeft: 10 }} />
                                                            </p>
                                                        </div>
                                                    ) : (
                                                            <div className="coupon-div2">
                                                                <p><b>{`Invalid Coupon Code`}</b>
                                                                    <img onClick={cancelCoupon} src={cancel} style={{ width: 20, marginLeft: 10 }} />
                                                                </p>
                                                            </div>
                                                        )

                                            }
                                        </Col><br /><br />
                                        <Col md='4'>
                                            <Row>
                                                <Col><p className='bold font16'>TOTAL: </p></Col>
                                                <Col><p className='font16' style={{ color: 'orange', fontWeight:"bolder" }}>{getSymbolFromCurrency(selectedCurrency)} {parseFloat(finalAmount / exchangeRate).toFixed(2)}</p></Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </div>
                            </Col><br /><br />
                            <Col md='4' xs='12' style={{ padding: '-5% 0%', marginTop: '5%' }} className='trianglify-bg'>
                                <div className='pay-options'>

                                    <Row style={{ padding: '5% 0%', marginTop: '5%' }}>
                                        <Col xs='2'></Col>
                                        <Col>
                                            <Row style={{ padding: '5% 0%', marginTop: '5%', marginBottom: '5%' }}>
                                                <Col><p style={{fontSize:16, fontWeight:"bolder"}}>Total:</p></Col>
                                                <Col><p className='font16' style={{ color: 'orange', fontWeight:"bolder" }}>{getSymbolFromCurrency(selectedCurrency)} {parseFloat(finalAmount / exchangeRate).toFixed(2)}</p></Col>
                                            </Row>
                                            {isCouponApplied === 'Success' &&
                                            <Row style={{ padding: '5% 0%', marginTop: '5%', marginBottom: '5%' }}>
                                                <Col>
                                                    <p className='bold' style={{ fontSize: 16 }}>Discount:</p>
                                                </Col>
                                                <Col>
                                                    <p className='bold' style={{ fontSize: 16 }}>{getSymbolFromCurrency(selectedCurrency)} {parseFloat((finalAmount - totalAmount) / exchangeRate).toFixed(2)}</p>
                                                </Col>
                                            </Row>}
                                            <hr />
                                            {isCouponApplied === 'Success' &&
                                            <Row style={{ padding: '5% 0%', marginTop: '5%', marginBottom: '5%' }}>
                                                <Col>
                                                    <h3 className='bold'>Final:</h3>
                                                </Col>
                                                <Col>
                                                    <h3 className='bold'>{getSymbolFromCurrency(selectedCurrency)} {parseFloat((finalAmount) / exchangeRate).toFixed(2)}</h3>
                                                </Col>
                                            </Row>}
                                            {
                                                !payVisible &&
                                                <Button style={{ width: '100%', margin: '5% 0%' }} color='purple' onClick={() => clickedPay()}>Accept & Pay</Button>
                                            }
                                            {
                                                payVisible &&
                                                <PayPalButton
                                                    amount={finalAmount}
                                                    currency={selectedCurrency}
                                                    onError={() => onPaymentError()}
                                                    onSuccess={(details, data) => createCareOrder(details, data)}
                                                    options={{
                                                        clientId: "AdPh6dusxjoGaQsfTCC1otVqTHaFhX-mas2ecoFVt4XZurdYTqEc_dDqHRYBe2q1mCOAAfM343YCjuGy"
                                                    }}
                                                />

                                            }
                                        </Col>
                                        <Col xs='2'></Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </section>
                :
                orderSuccess && isRenew ?

                    <div className='whitegrad-bg' style={{ paddingTop: 50, paddingBottom: 50 }}>
                        <Container className="relative rise-card2">
                            <div className="text-center" style={{ marginTop: 200, padding: 80, paddingBottom: 20 }}>
                                <p style={{fontSize:22}}>Payment Successful</p>
                                <img style={{ width: 90 }} src={check} />
                                <br />
                                <p className="bold purple-text font22"> Your Subscription has been renewed successfully</p>


                                <br /><hr />
                                {/* <h2 sm className="bold purple-text">Thank you for your subscription</h2> */}
                                <Row style={{ paddingLeft: 20, paddingRight: 20 }}>
                                    {/* <Col style={{float: 'right', marginRight: 20}}><h4 className='bold'>Amount Paid: </h4></Col> */}
                                    <Col md="1"></Col>

                                    <Col md="10">
                                        <div style={{ paddingTop: 20 }}>
                                            <p className="bold" style={{fontSize: 18}}>Payment Summary</p>
                                            <br></br>
                                            <Table hover className="table">
                                                <tr className="no-border">
                                                    <th className="font-title bold">Total Amount Paid :</th>
                                                    <td className="font-title bold" style={{ color: 'orange' }}>{getSymbolFromCurrency(selectedCurrency)} {parseFloat(finalAmount / exchangeRate).toFixed(2)}</td>
                                                </tr>
                                            </Table></div>
                                    </Col>
                                    <Col md="1"></Col>
                                </Row>
                            </div>
                            <div className="next-grey">


                                <Row>
                                    <Col xs="12" md="12">
                                        <div className="next-step">
                                            <p style={{ fontSize: 18 }}>Our Care Specialist will contact you soon with further details.</p>

                                        </div>
                                    </Col>
                                </Row>
                            </div>

                            <div className="text-center" style={{ padding: 40 }}>
                                <a onClick={() => props.history.push(`/user/orders`)} className="hamper-button">Back to Orders</a>
                            </div>


                        </Container>
                    </div>
                    : orderSuccess && !isRenew &&
                    < div className='whitegrad-bg' style={{ paddingTop: 50, paddingBottom: 50 }}>
                        <Container className="relative rise-card2">
                            <div className="text-center" style={{ marginTop: 200, padding: 80, paddingBottom: 20 }}>
                                <h2 className="bold purple-text"> Your Payment has been completed successfully</h2>


                                <br /><hr />
                                <h2 sm className="bold purple-text">Thank you for your subscription</h2>
                            </div>
                            <div className="next-grey" style={{ paddingTop: 20 }}>



                                <h3 className="bold">Payment Summary</h3>
                                <br></br>
                                <Table hover className="table">
                                    <tr className="no-border">
                                        <th className="font-title bold">Total Amount Paid :</th>
                                        <td className="font-title bold" style={{ color: 'orange' }}>{getSymbolFromCurrency(selectedCurrency)} {parseFloat(finalAmount / exchangeRate).toFixed(2)}</td>
                                    </tr>


                                </Table>
                            </div>




                            <div className="text-center" style={{ padding: 40 }}>
                                <a onClick={() => props.history.push(`/user/orders`)} className="hamper-button">Back to Request</a>
                            </div>


                        </Container>
                    </div>

            }
        </React.Fragment >
    );

}