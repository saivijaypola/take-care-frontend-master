import React, { useEffect, useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import help from '../../images/icon/help.svg'
import marker from '../../images/icon/marker.png'
import help2 from "../../images/icon/help-2.png";
import calendar from '../../images/icon/calendar.png'
import discount from '../../images/icon/discount.svg'
import chev from '../../images/icon/chev-right-white.svg'
import cancel from '../../images/icon/pink-cancel.svg'
import checked from '../../images/icon/checked.svg'
import verify from '../../images/icon/verify.svg'
import contact from '../../images/icon/contact-list.svg'
import card from '../../images/icon/credit.svg'
import { countries } from "./country";
import axios from "axios";
import { RequestActions } from "../../redux/actions";
import firebase from "firebase"
import csc from 'country-state-city'
import { PayPalButton } from "react-paypal-button-v2";
import { Icon, Input } from 'semantic-ui-react'
import {
  Container, Row, Col, Spinner, Modal, Button, ModalBody, ModalFooter,
  Table
} from "reactstrap";
import { connect } from 'react-redux';
import { PaymentFlow } from './PaymentFlow';
import { states_india } from '../Profile/data_state';
import { axiosPost, axiosPostExternal } from '../../handler/apiHandler';
import check from "../../images/icon/check.svg";
import message from '../../images/icon/message-yellow.png'
import quote from '../../images/icon/quote-yellow.png'



const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

function PaymentInfo(props) {


  const { serviceDetails, requestDetails, userDetails, providerDetails, chatId } = props;


  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [countryInfo, setCountryInfo] = useState({})
  const [selectedCurrency, setCurrency] = useState(null)
  console.log("🚀 ~ file: PaymentTabs.js ~ line 63 ~ PaymentInfo ~ selectedCurrency", selectedCurrency)

  const [contactName, setContactName] = useState('')
  const [contactAddress, setContactAddress] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [isContactCaptured, setContactCaptured] = useState(false)
  const [exchangeRate, setExchangeRate] = useState(1)
  const [dollarCharge, setdollarCharge] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isHelpModalVisible, setHelpModal] = useState(false)


  const [advanceAmount, setAdvanceAMount] = useState(0)
  const [orderTotalAmount, setOrderTotalAmount] = useState(0)
  const [payableOnCompletion, setPayableOnCompletion] = useState(0)
  const [serviceCharge, setServiceCharge] = useState(0)
  const [grandTotal, setGrandTotal] = useState(0)

  const [providerId, setProviderId] = useState('')

  // const [couponCode, setCouponCode] = useState('3D0S1R1BA3Y')
  const [couponCode, setCouponCode] = useState('')
  const [percentageDeducted, setPercentageDeducted] = useState('')
  const [isCouponApplied, setIsCouponApplied] = useState('Pending')

  const [isPaymentNeeded, setIsPaymentNeeded] = useState(false)
  const [totalPayable, setTotalPayable] = useState(0.00)

  const [orderId, setOrderId] = useState('')

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isPayPalModalVisible, setIsPayPalModalVisible] = useState(false)

  const [isDiscountModalVisible, setIsDiscountModalVisible] = useState(false)


  const [modalTitle, setModalTitle] = useState('')
  const [modalDescription, setModalDescription] = useState('')
  const [countriesList, setCountries] = useState([])
  const [myCountryCode, setCountryCode] = useState('+91')
  const [metadata, setMetaData] = useState(null)
  const [myChatId, setMyChatId] = useState('')
  const [orderSuccess, setOrderSuccess] = useState(false)


  //Paypal
  const [paid, setPaid] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [paypalAmount, setPayPalAmount] = useState(null)
  const paypalRef = React.useRef();



  const [isError, setIsError] = useState(false)

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    var countriesList = csc.getAllCountries()
    setCountries(countriesList)

    if (serviceDetails && chatId) {
      setProviderId(serviceDetails.providerId)
      setMyChatId(chatId)
    }
    console.log("hehe", userDetails)
    if (userDetails && userDetails.countryCode) {
      setCountryCode(userDetails.countryCode)
      setContactNumber(userDetails.phoneNumber)
    }


  }, [serviceDetails])

  useEffect(() => {
    getGeoInfo()
  }, [])

  const toggleModal = () => {
    setHelpModal(!isHelpModalVisible);
  }

  const getGeoInfo = () => {
    setIsLoading(true)
    axios.get('https://ipapi.co/json').then((response) => {
      let data = response.data;

      setCountryInfo(data)
      setCurrency(data.currency)
      setIsLoading(false)
    }).catch((error) => {
      console.log("GEOINFO", error)
      setCurrency('USD')
      setIsLoading(false)

    });
  };

  useEffect(() => {
    if (selectedCurrency) {
      getCurrencyRate()
    }

  }, [selectedCurrency])


  useEffect(() => {
    if (serviceDetails) {
      setAdvanceAMount(parseFloat(serviceDetails && (serviceDetails.advanceAmount / exchangeRate).toFixed(2)))
      setOrderTotalAmount(parseFloat(serviceDetails && (serviceDetails.orderTotalAmount / exchangeRate).toFixed(2)))
      setPayableOnCompletion(parseFloat((parseFloat(serviceDetails && serviceDetails.orderTotalAmount) - parseFloat(serviceDetails && serviceDetails.advanceAmount)) / exchangeRate).toFixed(2))
      setServiceCharge(parseFloat((parseFloat((serviceDetails && (serviceDetails.orderTotalAmount) / exchangeRate) * 20) / 100) + (1.99 * dollarCharge)).toFixed(2))
      var grandTotal = parseFloat((serviceDetails && (serviceDetails.orderTotalAmount) / exchangeRate) + parseFloat(getServiceCharge(serviceDetails && serviceDetails.orderTotalAmount)) + (1.99 * dollarCharge)).toFixed(2)
      setGrandTotal(grandTotal)
      setTotalPayable(parseFloat(grandTotal))
      setPayPalAmount(parseFloat(grandTotal).toFixed(2))
      // if (serviceDetails && serviceDetails.serviceOrderId && couponCode) {
      //   applyCouponCode()
      // }
    }

  }, [exchangeRate, serviceDetails])


  const getCurrencyRate = () => {
    setIsLoading(true)
    axios.get(`https://api.currencyfreaks.com/latest?apikey=61ab7b0f5bcd4722837983e3b05cfada&symbols=INR&base=${selectedCurrency}`).then((response) => {
      let data = response.data;
      setExchangeRate(data.rates.INR)
      setIsLoading(false)
    }).catch((error) => {
      setIsLoading(false)
      setCurrency('INR')
      setExchangeRate(1)
    });
    axios.get(`https://api.currencyfreaks.com/latest?apikey=61ab7b0f5bcd4722837983e3b05cfada&symbols=${selectedCurrency}&base=USD`).then((response) => {
      let data = response.data;
      setdollarCharge(data.rates[selectedCurrency])
      setIsLoading(false)
    }).catch((error) => {

    });
  }



  const onChangeText = (event) => {
    setCurrency(event.target.value)
  }
  const onChangeCountryCode = (event) => {
    setCountryCode(event.target.value)
  }

  const submitPayment = () => {
    // alert(requestDetails.userId)
    if (providerId) {
      props.history.push(`/provider-details/${this.props.macth.params.requestid}/${providerId}`)
    }

  }
  const onPaymentError = () => {
    setModalTitle("Payment Failed")
    setModalDescription("Something went wrong, please try again")
    setIsError(true)
    setIsModalVisible(true)
  }
  const render_paypalButton = () => {
    return (
      <PayPalButton
        amount={paypalAmount}
        currency={selectedCurrency}
        onError={() => onPaymentError()}
        onSuccess={(details, data) => createOrder(details, data)}
        options={{
          clientId: "AdPh6dusxjoGaQsfTCC1otVqTHaFhX-mas2ecoFVt4XZurdYTqEc_dDqHRYBe2q1mCOAAfM343YCjuGy"
        }}
      />
    )
  }

  const varifyContactDetails = () => {
    if (contactName.trim() !== '' && contactAddress.trim() !== '' && contactNumber.trim() !== '' && contactNumber.trim().length === 10) {
      setContactCaptured(true)
      setExpanded(false)
    } else {
      setIsError(true)
      if (contactNumber.trim().length !== 10) {
        setModalTitle('Invalid phone number')
        setModalDescription('Please enter a valid phone number')
      } else {
        setModalTitle('All fields are mandatory')
        setModalDescription('')
      }
      setIsModalVisible(true)
    }
  }


  const closeModal = () => {
    setIsModalVisible(false)
    setModalTitle('')
    setModalDescription('')
    setIsError(false)
  }

  const initializeTimeline = () => {
    if (props.chatId) {
      const { chatId } = this.props
      if (chatId) {
        const metadataRef = firebase.database().ref(chatId + '/Metadata');
        metadataRef.on('value', snapshot => {
          const getMetadata = snapshot.val();
          this.setState({
            metaData: getMetadata
          })
        })
      }
    }
  }


  const applyCouponCode = async () => {
    setPayPalAmount(null)
    var dbParams = {
      "service_order_id": serviceDetails && serviceDetails.serviceOrderId,
      "couponCode": couponCode.toString().trim()
    }
    const couponResponse = await axiosPost('apply/coupon', dbParams);
    console.log(couponResponse)
    if (couponResponse.error) {
      setIsError(true)
      setModalTitle("Network failure")
      setModalDescription("Check your internet connection")
      setIsModalVisible(true)
    }
    else if (couponResponse && couponResponse.response && couponResponse.response.data && couponResponse.response.data.isCouponApplied === "Success") {

      var amount = parseFloat(couponResponse.response.data && couponResponse.response.data.totalAmount).toFixed(2)

      setIsCouponApplied(couponResponse.response.data && couponResponse.response.data.isCouponApplied)
      if (couponResponse.response.data && couponResponse.response.data.isCouponApplied === "Success") {
        var percentage = couponResponse.response.data.percentage
        setPercentageDeducted(percentage)
        var totalPayable = amount / exchangeRate
        if (isNaN(totalPayable)) {
          setIsCouponApplied("Failed")
        } else {
          setTotalPayable(totalPayable)
          setPayPalAmount(parseFloat(totalPayable).toFixed(2))

        }

      }


    } else {
      setIsCouponApplied("Failed")
    }

    // setIsDiscountModalVisible(true)
  }


  const getServiceCharge = (amount) => {
    return parseFloat(((amount / exchangeRate) * 20) / 100).toFixed(2)
  }


  const createOrder = async (details, data) => {

    var amountPayableOnCompletion = parseFloat(serviceDetails && serviceDetails.orderTotalAmount) - parseFloat(serviceDetails && serviceDetails.advanceAmount)
    var notiAdvanceAmount = serviceDetails && serviceDetails.advanceAmount

    //console.log('PAYMENT PAYPAL', details, data)
    if (isContactCaptured && !isNaN(totalPayable) && isCouponApplied !== 'Failed') {
      var countryCode = serviceDetails && serviceDetails.tblUserByProviderId && serviceDetails.tblUserByProviderId.countryCode && serviceDetails.tblUserByProviderId.countryCode.substring(1)
      var phoneNumber = serviceDetails && serviceDetails.tblUserByProviderId && serviceDetails.tblUserByProviderId.phoneNumber && serviceDetails.tblUserByProviderId.phoneNumber.substr(serviceDetails.tblUserByProviderId.phoneNumber.length - 10)
      var orderParams = {
        order: {
          "service_order_id": serviceDetails.serviceOrderId,
          "order_accepted_on": new Date(),
          "order_status": "Confirmed",
          "user_full_name": contactName.trim(),
          "country_code": myCountryCode,
          "user_contact_no": contactNumber.trim(),
          "user_address": contactAddress.trim(),
          "selected_currency": selectedCurrency.trim(),
          "advance_amount": parseFloat(advanceAmount),
          "payable_on_completion": parseFloat(payableOnCompletion),
          "total_amount": parseFloat(orderTotalAmount),
          "service_charge": parseFloat(serviceCharge),
          "grand_total": parseFloat(grandTotal),
          "coupon_used": couponCode,
          "metadata": countryInfo
        },
        notification: {
          "userName": requestDetails && requestDetails.tblUserByUserId && requestDetails.tblUserByUserId.fullname,
          "requestTitle": requestDetails && requestDetails.title,
          "recepientId": serviceDetails && serviceDetails.tblUserByProviderId && serviceDetails.tblUserByProviderId.userId,
          "phoneNumber": countryCode + "" + phoneNumber,
          "providerName": serviceDetails && serviceDetails.tblUserByProviderId && serviceDetails.tblUserByProviderId.fullname,
          "providerEmail": serviceDetails && serviceDetails.tblUserByProviderId && serviceDetails.tblUserByProviderId.email,
          "advanceAmount": !isNaN(notiAdvanceAmount) || notiAdvanceAmount !== '' ? notiAdvanceAmount : '0.00',
          "payableCompletion": amountPayableOnCompletion,
          "orderTotal": serviceDetails && serviceDetails.orderTotalAmount
        }
      }
      console.log("notification", orderParams)
      //Create Order ApI Call
      const apiResponse = await axiosPost('order', orderParams);
      if (apiResponse.error) {
        setIsModalVisible(true)
        setModalTitle('Failed to create order')
        setModalDescription('Check your internet connection')
        setIsError(true)
        props.createOrderFailed(null)
      }
      else if (apiResponse.response.data.returnCode === 200) {
        setOrderId(apiResponse.response.data.returnMessage)
        props.createOrderSuccess(apiResponse.response.data.returnMessage)

        if (myChatId) {
          //Initialize Chat
          const chatRef = firebase.database().ref(myChatId + '/Metadata');
          var metadataParams = {
            orderId: apiResponse.response.data.returnMessage,
            orderStatus: 'Confirmed',
            orderCreatedOn: new Date(),
            timeline: [
              {
                title: 'CREATION',
                status: 'Confirmed',
                contactName: contactName,
                countryCode: myCountryCode,
                contactNumber: contactNumber,
                contactAddress: contactAddress,
                createdOn: new Date(),
                isActiveForProvider: true,
                isActiveForUser: true
              },
              {
                title: 'INITIATION',
                status: 'In Progress',
                updatedOn: '',
                isActiveForProvider: true,
                isActiveForUser: true,
                providerComments: ''
              },
              {
                title: 'AUTHENTICATION',
                status: 'Completed',
                isActiveForProvider: true,
                isActiveForUser: true,
                isUserVerified: false,
                isProviderVerified: false,
                providerComments: '',
                digitalId: '',
                updatedOn: ''
              },
              {
                title: 'COMPLETION',
                status: 'Verification',
                isActiveForProvider: true,
                isActiveForUser: true,
                providerComments: '',
                digitalId: '',
                updatedOn: ''
              },
              {
                title: 'APPROVAL',
                status: '',
                isActiveForProvider: true,
                isActiveForUser: false,
                providerComments: '',
                userComments: '',
                updatedOn: ''
              },
            ]
          }

          chatRef.update(metadataParams)
        }
        setOrderSuccess(true)
      }
      else if (!apiResponse.response.data.returnMessage) {

        setTotalPayable(parseFloat(apiResponse.response.data.totalPayable))
        setIsError(true)
        setModalTitle('Something went wrong with currency data')
        setModalDescription('Please try again or request to update service order')
        setIsModalVisible(true)
      }
    } else if (isCouponApplied === 'Failed') {
      setIsModalVisible(true)
      setModalTitle('Coupon Invalid')
      setModalDescription('Please remove the entered invalid coupon code or add a valid coupon code and try again')
      setIsError(true)
    } else {
      setIsModalVisible(true)
      setModalTitle('Something went wrong')
      setModalDescription('Please try again later')
      setIsError(true)
    }

  }

  const onNavigateToRequestDetails = () => {
    if (providerId)
      props.history.push(`/provider-details/${props.match.params.requestid}/${providerId}`)
  }

  const formatAMPM = (date) => {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }
  const cancelCoupon = () => {
    setTotalPayable(totalPayable)
    setPayPalAmount(parseFloat(totalPayable).toFixed(2))
    setIsCouponApplied('Pending')
    setCouponCode('')
  }

  const resetError = () => {
    setIsError(false)
    setModalDescription('')
    setModalTitle('')
  }

  return (
    <React.Fragment>
      <div>
        {!orderSuccess ?
          < div className={classes.root + " payment-tabs"}>

            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                {expanded !== 'panel1' ?
                  <p className="font14 bold"><div className="image-holder"><img src={help} /> </div>Request Details</p>
                  :
                  <p className="font18 bold">Request Details</p>
                }
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <p className="bold font14">{requestDetails && requestDetails.title}
                  </p>
                  <p className="font-title threeline" style={{ color: '#6e6969', marginBottom: 5 }}>{requestDetails && requestDetails.description}</p><br />
                  <p className="threeline" style={{ color: '#6e6969', marginBottom: 5 }}>
                    <img className="para-img" src={marker}></img>{requestDetails && requestDetails.locationTitle}</p>
                  <p className="threeline" style={{ color: '#6e6969', marginBottom: 5 }}>
                    <img className="para-img" src={calendar}></img><b>{new Date(serviceDetails && serviceDetails.serviceNeededOn).toDateString() + ' ' + formatAMPM(new Date(serviceDetails && serviceDetails.serviceNeededOn))}</b></p>
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2bh-content"
                id="panel2bh-header"
              >
                {expanded !== 'panel2' ?
                  <p className="font14 bold"><div className="image-holder"><img src={verify} /> </div>Quote Details</p>
                  :
                  <p className="font18 bold">Quote Details</p>
                }
              </AccordionSummary>
              <AccordionDetails>
                <table className="table request-table">
                  <tr>
                    <td><span className="">Advance</span></td>
                    <td><span className="bold">Rs {serviceDetails && serviceDetails.advanceAmount}</span></td>
                  </tr>
                  <tr>
                    <td><span className="">Payable on completion</span></td>
                    <td><span className="bold">Rs {(parseFloat(serviceDetails && serviceDetails.orderTotalAmount) - parseFloat(serviceDetails && serviceDetails.advanceAmount)).toString()}</span></td>
                  </tr>
                  <tr className="border-top">
                    <td><span style={{ fontSize: 21 }} className="bold">Total</span></td>
                    <td><span style={{ fontSize: 21, color: '#ff8a00' }} className="bold">Rs {parseFloat(serviceDetails && serviceDetails.orderTotalAmount).toString()}</span></td>
                  </tr>
                </table>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel3' || !isContactCaptured} onChange={handleChange('panel3')}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3bh-content"
                id="panel3bh-header"
              >
                {expanded !== 'panel3' && isContactCaptured ?
                  <p className="font14 bold"><div className="image-holder"><img src={contact} /> </div>Contact Details</p>
                  :
                  <p className="font16 bold">Contact Details</p>
                }

              </AccordionSummary>
              <AccordionDetails>
                <Row>
                  <Col xs="12">
                    <p className="font-title">
                      Please provide the details of the contact person at the location of service, so that the service provider can coordinate with them.
             </p>
                  </Col><br /><br />
                  <Col xs="12">
                    <label>Contact Name</label>
                    <input maxLength="50" onChange={e => setContactName(e.target.value)} defaultValue={contactName} className="payment-text" type="text"></input>
                    <label>Phone Number</label>
                    <Row>
                      <Col xs="4">
                        <select onChange={onChangeCountryCode} className="form-control country-code">
                          {
                            countriesList.map((country, index) =>
                              <option value={"+" + country.phonecode} key={`key_${index}`} selected={("+" + country.phonecode) == myCountryCode}>{"+" + country.phonecode + " (" + country.name + ")"}</option>
                            )
                          }
                        </select>
                      </Col>
                      <Col xs="8">
                        <input minLength="10" value={contactNumber} maxLength="10" onChange={e => setContactNumber(e.target.value)} className="payment-text" type="text"></input>
                      </Col>
                    </Row>

                    <br />
                    <label>Address</label>
                    <textarea maxLength="200" onChange={e => setContactAddress(e.target.value)} rows="4" className="payment-text" type="text"></textarea>
                  </Col>
                  <Col xs="12">
                    <Button onClick={() => varifyContactDetails()} className="neat-button">{isContactCaptured ? 'Update' : 'Save'}</Button>
                  </Col>
                </Row>
              </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === 'panel4' || isContactCaptured} onChange={handleChange('panel4')}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel4bh-content"
                id="panel4bh-header"
              >
                {expanded !== 'panel4' ?
                  <p className="font14 bold"><div className="image-holder"><img src={card} /> </div>Payment Details</p>
                  :
                  <p className="font16 bold">Payment Details</p>
                }
              </AccordionSummary>
              <AccordionDetails>
                <Row style={{ borderTop: "1px dashed #cccc", paddingTop: 13 }}>
                  <Col xs="7">
                    <p className="bold" style={{fontSize:18}}>Select your currency</p>
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
                  <Col xs="12">

                    {
                      isCouponApplied === 'Pending' ?
                        <div className="coupon-div relative">
                          <Row>
                            <Col xs="8">
                              <input VALUE={couponCode} onChange={e => setCouponCode(e.target.value)} className="payment-text coupon-field" placeholder="Enter Coupon Code" />
                            </Col>
                            <Col xs="4">
                              <a onClick={() => applyCouponCode()} className="apply">APPLY</a>
                            </Col>
                          </Row>
                          <img src={discount} />
                        </div>
                        : isCouponApplied === 'Success' ? (
                          <div className="coupon-div2">
                            <p className="font14 bold"><b>{`You have saved ${percentageDeducted}% of your order`}</b>
                              <img onClick={cancelCoupon} src={cancel} style={{ width: 20, marginLeft: 10 }} />
                            </p>
                          </div>
                        ) : (
                            <div className="coupon-div2">
                              <p className="font14 bold"><b>{`Invalid Coupon Code`}</b>
                                <img onClick={cancelCoupon} src={cancel} style={{ width: 20, marginLeft: 10 }} />
                              </p>
                            </div>
                          )

                    }



                  </Col>
                  <Col xs="12">

                  </Col>
                  <Col xs="12">

                    <div style={{ margin: "0 -31px" }}>
                      <table className="table payment-flow-table bold">
                        <tr className="no-border">
                          <th style={{ fontWeight: 600 }}>Advance Amount :</th>
                          <td>{`${selectedCurrency} ${parseFloat(advanceAmount).toFixed(2)}`}</td>
                        </tr>
                        <tr className="">
                          <th style={{ fontWeight: 600 }}>Payable on Completion :</th>
                          <td>{`${selectedCurrency} ${parseFloat(payableOnCompletion).toFixed(2)} `}</td>
                        </tr>
                        {/* <tr>
                    <th> <b style={{ fontWeight: "bold" }}>Total Amount :</b></th>
                    <td><b>{`${selectedCurrency} ${parseFloat(orderTotalAmount).toFixed(2)}`}</b></td>
                  </tr> */}
                        <tr className="">
                          <th style={{ fontWeight: 600 }}>Service Fee :  <img onClick={toggleModal} style={{ width: 24 }} src={help2}></img></th>
                          <td>{`${serviceCharge}`}</td>
                        </tr>
                        {
                          (totalPayable - grandTotal).toFixed(2) > 0 && isCouponApplied === "Success" &&
                          <tr className="">
                            <th style={{ fontWeight: 600 }}>Discount Applied :</th>
                            <td style={{ color: "#c10000" }}>   {selectedCurrency} {parseFloat(totalPayable - grandTotal).toFixed(2)}</td>
                          </tr>
                        }

                        {/* <tr className="extra-bold grand">
                    <th>Grand Total :</th>
                    <td style={{ minWidth: 130 }}>{`${selectedCurrency} ${grandTotal}`}</td>
                  </tr> */}
                        <tr>
                          <td></td>
                          <td></td>
                        </tr>
                      </table>
                      <span style={{ marginRight: 15, marginBottom: 15, fontWeight:"bolder" }} className="pull-right">You Pay &nbsp;&nbsp;&nbsp;<span style={{color: "#f19c00", fontSize:16}}> {`${selectedCurrency} `} {totalPayable && totalPayable.toFixed(2)}</span></span>
                    </div>
                  </Col>
                  {/* <Col xs="6">
              <span className="block" style={{ marginTop: 12, fontSize: 14 }}>Enter Coupon Code</span>
            </Col>

            <Col xs="6">
              <input VALUE={couponCode} onChange={e => setCouponCode(e.target.value)} className="payment-text coupon-field" placeholder="Coupon Code" />
            </Col>
            <Col xs="12">
              <a onClick={() => applyCouponCode()} className="orange-label">APPLY</a>
            </Col>
            <Col xs="12">
              <table className="table payment-flow-table">
                {
                  (totalPayable - grandTotal).toFixed(2) != 0.00 &&

                  <tr className="">
                    <th>Discount Applied :</th>
                    <td style={{ color: "#c10000", minWidth: 140 }}>
                      {selectedCurrency} {(totalPayable - grandTotal).toFixed(2)}
                    </td>
                  </tr>
                }

              </table>
            </Col>

            <Col xs="12">
              <div className="payment-summary">
                <table>
                  <tr>
                    <td>
                      Total Payable :
                    </td>
                    <td>
                      <b>{`${selectedCurrency} `} {totalPayable && totalPayable.toFixed(2)}</b>
                    </td>
                  </tr>
                </table>
              </div>
            </Col> */}
                  <Col xs="12">
                    <div className="payment-bottom">
                      <Row>
                        <Col xs="6">
                          <span style={{ fontSize: 19 }}>{`${selectedCurrency} `} {totalPayable && totalPayable.toFixed(2)}</span>
                        </Col>
                        <Col xs="6" className="text-right">
                          {/* <a onClick={() => setIsPayPalModalVisible(true)} className="pay-continue">CONTINUE
                      <img src={chev}></img>
                    </a> */}

                          {
                            !isNaN(paypalAmount) && paypalAmount > 0 ? (
                              <a onClick={() => setIsPayPalModalVisible(true)} className="pay-continue" style={{color:"white"}}>CONTINUE
                                <img src={chev}></img>
                              </a>
                            ) : (
                                <a onClick={() => createOrder()} className="pay-continue" style={{color:"white"}}>CONTINUE
                                  <img src={chev}></img>
                                </a>
                              )
                          }
                        </Col>
                      </Row>
                    </div>
                  </Col>
                  {/* <Col xs="6">
              <Button className="neat-button cancel-button"> Cancel</Button>
            </Col>
            <Col xs="6">

              <Button onClick={() => setIsPayPalModalVisible(true)} className="neat-button width100"> Submit</Button>
            </Col> */}
                </Row>
              </AccordionDetails>
            </Accordion>
            <Modal isOpen={isHelpModalVisible} role="dialog" autoFocus={true} centered={true}>
              <ModalBody>
                <p className="helpmodal">YoCo charges you a small fee to make services available. We do not take a cut from the amount you agree to pay to the service provider.
                            </p>
                <Button className="post-request" onClick={toggleModal}>Close</Button>
              </ModalBody>
            </Modal>
            {
              isLoading ? (
                <Modal className="spinner-modal" isOpen={true}>
                  <Spinner animation="border" />
                </Modal>
              ) : ''
            }
            <Modal isOpen={isModalVisible}>
              <ModalBody>
                <div style={{ textAlign: 'center' }}>
                  <h6 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 1, color: '#861b8d' }}>{modalTitle}</h6>
                  <p>{modalDescription}</p>
                  {
                    isError ? (
                      <Button onClick={() => closeModal()}>Close</Button>
                    ) : <Button onClick={onNavigateToRequestDetails}>Close</Button>
                  }

                </div>
              </ModalBody>
            </Modal>
            <Modal isOpen={isPayPalModalVisible && selectedCurrency && paypalAmount}>
              <ModalBody>

                <div style={{ textAlign: 'center' }}>
                  <h6 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 1, color: '#861b8d' }}>You Pay {selectedCurrency + ' '}{paypalAmount}</h6>

                  {
                    paypalAmount && paypalAmount !== null && selectedCurrency && selectedCurrency !== null && (
                      render_paypalButton(selectedCurrency)
                    )
                  }
                  <Button onClick={() => setIsPayPalModalVisible(false)}>Close</Button>
                </div>
              </ModalBody>
            </Modal>
            <Modal className="coupon-modal" isOpen={isDiscountModalVisible}>
              <Row>
                <Col xs="6">
                  <div className="percent-section">
                    <p className="font24 bold"><b>20%</b></p>
                    <h6>SAVED</h6>
                  </div>
                </Col>
                <Col xs="6">
                  <div className="details-section">
                    <img src={checked} />
                    <h6><span>{couponCode}</span> APPLIED</h6>
                    <p className="font-title font14">
                      {/* Lorem ipsum dolor sit amet is a popular dummy text */}
                    </p>
                    <a className="font14" style={{ color: "purple" }} onClick={() => setIsDiscountModalVisible(false)}>CLOSE</a>
                  </div>
                </Col>
              </Row>
            </Modal>
          </div>

          :

          <div>
            <div>
              <Container className="relative rise-card2">
                <div>
                  <div className="text-center" style={{ padding: 25, paddingBottom: 20 }}>
                  <p className="bold font20 purple-text">Success</p>
                    <img style={{ width: 90 }} src={check} />
                    <br /><br />
                    <p className="font-title font14 max560">
                      Your order has been submitted successfully.
                  </p>
                    <br />
                    <hr />
                  </div>
                  <Row style={{ paddingLeft: 20, paddingRight: 20 }}>
                    <Col md="1"></Col>
                    <Col md="6">
                      <div style={{ paddingTop: 20 }}>
                        <p className="bold font20">Order details</p>
                        <br></br>
                        <p className="bold font14">{requestDetails && requestDetails.title}
                        </p>
                        <p className="font-title threeline" style={{ color: '#898889', marginBottom: 5 }}>{requestDetails && requestDetails.description}</p>
                        <br></br>
                        <p className="threeline" style={{ color: '#898889', marginBottom: 5 }}>
                          <img className="para-img" src={marker}></img><b>{requestDetails && requestDetails.locationTitle}</b></p>
                        <p className="threeline" style={{ color: '#898889', marginBottom: 5 }}>
                          <img className="para-img" src={calendar}></img><b>{new Date(serviceDetails && serviceDetails.serviceNeededOn).toDateString() + ' ' + formatAMPM(new Date(serviceDetails && serviceDetails.serviceNeededOn))}</b></p>
                      </div>
                    </Col>
                    <Col md="4">
                      <div style={{ paddingTop: 20 }}>
                        <p className="bold font20">Payment Summary</p>
                        <br></br>
                        <Table hover className="table">
                          <tr className="no-border">
                            <th className="font-title bold">Advance Amount :</th>
                            <td className="font-title bold">{`${selectedCurrency} ${parseFloat(advanceAmount).toFixed(2)}`}</td>
                          </tr>
                          <tr className="">
                            <th className="font-title bold">Payable on Completion :</th>
                            <td className="font-title bold">{`${selectedCurrency} ${parseFloat(payableOnCompletion).toFixed(2)} `}</td>
                          </tr>
                          {
                            (totalPayable - grandTotal).toFixed(2) > 0 && isCouponApplied === "Success" &&
                            <tr className="">
                              <th className="font-title bold">Discount Applied :</th>
                              <td className="font-title bold" style={{ color: "#c10000" }}>   {selectedCurrency} {parseFloat(totalPayable - grandTotal).toFixed(2)}</td>
                            </tr>
                          }
                          <tr className="">
                            <th className="font-title bold">Service Fee :</th>
                            <td className="font-title bold">{`${selectedCurrency} ${parseFloat(serviceCharge).toFixed(2)} `}</td>
                          </tr>
                          <tr className="">
                            <th className="font-title bold">Total Amount Paid :</th>
                            <td className="font-title bold">{`${selectedCurrency} ${totalPayable && totalPayable.toFixed(2)} `}</td>
                          </tr>
                        </Table>
                      </div>
                    </Col>
                    <Col md="1"></Col>
                  </Row>
                </div>
                <div className="text-center" style={{ padding: 40 }}>
                  <a onClick={onNavigateToRequestDetails} className="hamper-button">Track Order</a>
                </div>
              </Container>
            </div>
          </div>
        }
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    isOrderCreated: state.request.isOrderCreated,
    orderId: state.request.orderId
  }
}
export default connect(mapStateToProps, { ...RequestActions })(PaymentInfo)