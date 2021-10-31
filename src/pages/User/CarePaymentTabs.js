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
import { RequestActions, UserActions } from "../../redux/actions";
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
import { axiosPost, axiosGet, axiosPostExternal } from '../../handler/apiHandler';
import check from "../../images/icon/check.svg";
import message from '../../images/icon/message-yellow.png'
import quote from '../../images/icon/quote-yellow.png'
import { parse } from 'date-fns';
import { set } from 'lodash';
import { setMtpOpted } from '../../redux/actions/UserActions';



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

function CarePaymentInfo(props) {


  const { serviceDetails, requestDetails, userDetails } = props;
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [countryInfo, setCountryInfo] = useState({})
  const [selectedCurrency, setCurrency] = useState(null)

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
  const [mtpAmount, setMtpAmount] = useState(0)
  const [grandTotal, setGrandTotal] = useState(0)
  const [monthlyFee, setMonthlyFee] = useState(0)
  const [perVisitFee, setperVisitFee] = useState(0)
  const [oneTimeFeeSum, setoneTimeFeeSum] = useState(0)
  const [providerTotal, setProviderTotal] = useState(0)
  const [totalPayableAmount, settotalPayableAmount] = useState(0)

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
  const [mtpSuccess, setMtpSuccess] = useState(false)


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

    if (userDetails && userDetails.countryCode) {
      setCountryCode(userDetails.countryCode)
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
      setCurrency(serviceDetails.userCurrency)
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
      let monthlySum = serviceDetails.tblCareProvidersByCareId.nodes.reduce((a, b) => a = a + b.monthlyFee, 0);
      let perVisitSum = serviceDetails.tblCareProvidersByCareId.nodes.reduce((a, b) => a = a + b.perVisitCharge, 0);
      let oneTimeFeeSum = serviceDetails.tblPackagePricingsByCareId.nodes.reduce((a, b) => a = a + b.amount, 0);
      let serviceCharge = serviceDetails.tblCareProvidersByCareId.nodes.reduce((a, b) => a = a + b.yocoServiceCharge, 0);
      let providerTotal = serviceDetails.tblCareProvidersByCareId.nodes.reduce((a, b) => a = a + b.totalAmountByUser, 0);
      let mtpFee = serviceDetails.mtpFee * serviceDetails.noOfMtp;
      let crvFee = serviceDetails.crvFee * serviceDetails.noOfCrv;
      setMtpAmount(parseFloat(mtpFee).toFixed(2))
      setMonthlyFee(parseFloat(monthlySum).toFixed(2))
      setperVisitFee(parseFloat(perVisitSum).toFixed(2))
      setoneTimeFeeSum(parseFloat(oneTimeFeeSum + crvFee).toFixed(2))
      setProviderTotal(parseFloat(providerTotal).toFixed(2))
      settotalPayableAmount(parseFloat(providerTotal + oneTimeFeeSum + crvFee).toFixed(2))
      setServiceCharge(parseFloat((parseFloat(serviceCharge)) + (1.99 * dollarCharge)).toFixed(2))
      var grandTotal = parseFloat(totalPayableAmount).toFixed(2)
      setGrandTotal(grandTotal)
      setTotalPayable(parseFloat(grandTotal))
      if (props.mtpOpted === true) {
        setPayPalAmount(parseFloat(mtpAmount).toFixed(2))
      } else {
        setPayPalAmount(parseFloat(grandTotal).toFixed(2))
      }
    }

  }, [exchangeRate, serviceDetails])


  const getCurrencyRate = () => {
    setIsLoading(true)
    axios.get(`https://api.currencyfreaks.com/latest?apikey=61ab7b0f5bcd4722837983e3b05cfada&symbols=${serviceDetails.userCurrency}&base=${selectedCurrency}`).then((response) => {
      let data = response.data;
      setExchangeRate(data.rates[serviceDetails.userCurrency])
      setIsLoading(false)
    }).catch((error) => {
      setIsLoading(false)
      setCurrency(serviceDetails.userCurrency)
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
        onSuccess={(details, data) => props.mtpOpted === true ? updateMtpStatus(details, data) : createCareOrder(details, data)}
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

  const updateMtpStatus = async (details, data) => {
    const apiResponse = await axiosGet(`care/updatestatus/${props.match.params.careid}/optedmtp`);
    console.log('UPDATE MTP', apiResponse);
    if (apiResponse.error === null && apiResponse.response.status === 200) {
      setMtpSuccess(true)
      setOrderSuccess(true)
      props.updateMtpStatusSuccess(apiResponse.response)
    } else {
      setIsModalVisible(true)
      setModalDescription("Could not process payment for 'Meet The Parent', please try again.")
      setModalTitle('Payment Failed!')
      props.updateMtpStatusFailed(apiResponse)
    }
  }

  const createCareOrder = async (details, data) => {

    var amountPayableOnCompletion = parseFloat(grandTotal) - parseFloat(grandTotal)
    var notiAdvanceAmount = parseFloat(grandTotal)

    if (isContactCaptured && !isNaN(totalPayable)) {
      serviceDetails && serviceDetails.tblCareProvidersByCareId && serviceDetails.tblCareProvidersByCareId.nodes && serviceDetails.tblCareProvidersByCareId.nodes.length > 0 && serviceDetails.tblCareProvidersByCareId.nodes.map(async (provider, index) => {
        var countryCode = provider && provider.tblUserByProviderId && provider.tblUserByProviderId.countryCode && provider.tblUserByProviderId.countryCode.substring(1)
        var phoneNumber = provider && provider.tblUserByProviderId && provider.tblUserByProviderId.phoneNumber && provider.tblUserByProviderId.phoneNumber.substr(provider.tblUserByProviderId.phoneNumber.length - 10)
        var orderParams = {
          "notification": {
            "advanceAmount": !isNaN(notiAdvanceAmount) || notiAdvanceAmount !== '' ? notiAdvanceAmount : '0.00',
            "orderTotal": parseFloat(totalPayableAmount),
            "payableCompletion": amountPayableOnCompletion,
            "phoneNumber": countryCode + "" + phoneNumber,
            "providerEmail": provider && provider.tblUserByProviderId && provider.tblUserByProviderId.email,
            "providerName": provider && provider.tblUserByProviderId && provider.tblUserByProviderId.fullname,
            "recepientId": provider && provider.tblUserByProviderId && provider.tblUserByProviderId.userId,
            "requestTitle": requestDetails && requestDetails.title,
            "userName": requestDetails && requestDetails.tblUserByUserId && requestDetails.tblUserByUserId.fullname,
          },
          "order": {
            "care_id": serviceDetails.careId,
            "provider_id": provider.providerId,
            "order_accepted_on": new Date(),
            "order_status": "Confirmed",          
            "user_full_name": contactName.trim(),
            "country_code": myCountryCode,
            "user_contact_no": contactNumber.trim(),
            "user_address": contactAddress.trim(),
            "selected_currency": selectedCurrency.trim(),
            "provider_fee": parseFloat(provider && provider.providerFee),
            "one_time_fee": parseFloat(oneTimeFeeSum),
            "service_charge": parseFloat(provider && provider.yocoServiceCharge),
            "grand_total": parseFloat(provider && provider.totalAmountByUser),
            "coupon_used": couponCode,
            "metadata": countryInfo,
            "total_payable": parseFloat(provider && provider.totalAmountByUser),
            "care_provider_id": provider && provider.careProviderId
          },
        }
        console.log("ORDER PARAMS", orderParams)
        //Create Order ApI Call
        const apiResponse = await axiosPost('care/new-order', orderParams);
        console.log('ORDER API RESPONSE', apiResponse);
        if (apiResponse.error) {
          setIsModalVisible(true)
          setModalTitle('Failed to create order')
          setModalDescription('Check your internet connection')
          setIsError(true)
          props.createCareOrderFailed(null)
        }
        else if (apiResponse.response.data.returnCode === 200) {
          setOrderId(apiResponse.response.data.returnMessage)
          props.createCareOrderSuccess(apiResponse.response.data.returnMessage)
          console.log('No Of Visits', provider.noOfVisits);

          if (serviceDetails && serviceDetails.careId ) {
            //Initialize Chat
            const chatRef = firebase.database().ref('Care/' + serviceDetails.careId + '/Metadata/' + apiResponse.response.data.returnMessage);
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
                  isActiveForUser: true,
                  isFundamentals: provider.noOfVisits === '0' ? true : false
                },
                {
                  title: 'INITIATION',
                  status: '',
                  updatedOn: '',
                  maskOn: false,
                  wellInformed: false,
                  isActiveForProvider: true,
                  isActiveForUser: true,
                  providerComments: '',
                  communicated: false,
                  weeklyCall: false,
                  availableOnCall: false
                },
                {
                  title: 'UPDATION',
                  status: '',
                  nextVisitDate: '',
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
      })

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
    // if (providerId)
    props.history.push(`/care-details/${props.match.params.requestid}/${props.match.params.careid}`)
  }
  const onNavigateToCareOptions = () => {
    props.history.push(`/subscription-next/${props.match.params.requestid}`)
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
                  <p style={{fontSize:14}}><div className="image-holder"><img src={help} /> </div>Request Details</p>
                  :
                  <p style={{fontSize:16, fontWeight:"bold"}}>Request Details</p>
                }
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <p className="bold font14">{requestDetails && requestDetails.title}
                  </p>
                  <p className="font-title" style={{ color: '#898889', marginBottom: 5 }}>{requestDetails && requestDetails.description}</p>
                  <p className="threeline" style={{ color: '#898889', marginBottom: 5 }}>
                    <img className="para-img" src={marker}></img><b>{requestDetails && requestDetails.locationTitle}</b></p>
                  <p className="threeline" style={{ color: '#898889', marginBottom: 5 }}>
                    <img className="para-img" src={calendar}></img><b>{new Date(requestDetails && requestDetails.serviceNeedsOn).toDateString() + ' ' + formatAMPM(new Date(requestDetails && requestDetails.serviceNeedsOn))}</b></p>
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
                  <p style={{fontSize:14, fontWeight:"bold"}}><div className="image-holder"><img src={verify} /> </div>Quote Details</p>
                  :
                  <p style={{fontSize:16, fontWeight:"bold"}}>Quote Details</p>
                }
              </AccordionSummary>
              <AccordionDetails>
                <Col xs="12">
                  <div>
                    <p className="bold font14">{serviceDetails && serviceDetails.careTitle}</p>
                    <p className="font-title">{serviceDetails && serviceDetails.careDescription}</p>
                  </div>
                  <Row>
                    {props.mtpOpted !== true ?
                      <table className="table request-table">
                        <tr>
                          <td><span className="">Total Provider Fee</span></td>
                          <td><span className="bold">{serviceDetails.userCurrency} {providerTotal}</span></td>
                        </tr>
                        <tr>
                          <td><span className="">One Time Fee</span></td>
                          <td><span className="bold">{serviceDetails.userCurrency} {oneTimeFeeSum}</span></td>
                        </tr>
                        <tr className="border-top">
                          <td><span style={{ fontSize: 21 }} className="bold">Total</span></td>
                          <td><span style={{ fontSize: 21, color: '#ff8a00' }} className="bold">{serviceDetails.userCurrency} {totalPayableAmount}</span></td>
                        </tr>
                      </table>
                      :
                      <table className="table request-table">
                        <tr>
                          <td><span className="">Meet The Parent Fee</span></td>
                          <td><span className="bold">{serviceDetails.userCurrency} {mtpAmount}</span></td>
                        </tr>
                      </table>
                    }
                  </Row>
                </Col >
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel3' || !isContactCaptured} onChange={handleChange('panel3')}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3bh-content"
                id="panel3bh-header"
              >
                {expanded !== 'panel3' && isContactCaptured ?
                  <p style={{fontSize:14}}><div className="image-holder"><img src={contact} /> </div>Contact Details</p>
                  :
                  <p style={{ fontSize:16, fontWeight:"bold"}}>Contact Details</p>
                }

              </AccordionSummary>
              <AccordionDetails>
                <Row>
                  <Col xs="12">
                    <p className="">
                      Please provide the details of the contact person at the location of service, so that the service provider can coordinate with them.
             </p>
                  </Col>
                  <Col xs="12">
                    <label>Contact Name</label>
                    <input maxLength="50" onChange={e => setContactName(e.target.value)} defaultValue={contactName} className="payment-text" type="text"></input>
                    <label>Phone Number</label>
                    <Row>
                      <Col xs="4" sm="3" md="2" lg="2">
                        <select onChange={onChangeCountryCode} className="form-control country-code">
                          {
                            countriesList.map((country, index) =>
                              <option value={"+" + country.phonecode} key={`key_${index}`} selected={("+" + country.phonecode) == myCountryCode}>{"+" + country.phonecode + " (" + country.name + ")"}</option>
                            )
                          }
                        </select>
                      </Col>
                      <Col xs="6" sm="6" md="4" lg="3">
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

            <Accordion expanded={isContactCaptured} onChange={handleChange('panel4')}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel4bh-content"
                id="panel4bh-header"
              >
                {expanded !== 'panel4' || !isContactCaptured ?
                  <p style={{ fontSize:14, fontWeight:"bold"}}><div className="image-holder"><img src={card} /> </div>Payment Details</p>
                  :
                  <p style={{fontSize:16, fontWeight:"bold"}}>Payment Details</p>
                }
              </AccordionSummary>
              <AccordionDetails>
                <Row style={{ borderTop: "1px dashed #cccc", paddingTop: 13 }}>
                  <Col xs="7">
                    <p style={{ fontSize:19,fontWeight:"bold"}}>Select your currency</p>
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
                            <p><b>{`You have saved ${percentageDeducted}% of your order`}</b>
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

                  </Col>
                  <Col xs="12">

                  </Col>
                  <Col xs="12">

                    {props.mtpOpted !== true ?
                      <div style={{ margin: "0 -31px" }}>
                        <table className="table payment-flow-table">
                          <tr className="no-border">
                            <th style={{ fontWeight: 600 }}>Total Provider Amount :</th>
                            <td>{`${selectedCurrency} ${parseFloat(providerTotal / exchangeRate).toFixed(2)}`}</td>
                          </tr>
                          <tr className="">
                            <th style={{ fontWeight: 600 }}>One Time Fee :</th>
                            <td>{`${selectedCurrency} ${parseFloat(oneTimeFeeSum / exchangeRate).toFixed(2)} `}</td>
                          </tr>
                          {
                            (totalPayable - grandTotal).toFixed(2) > 0 && isCouponApplied === "Success" &&
                            <tr className="">
                              <th style={{ fontWeight: 600 }}>Discount Applied :</th>
                              <td style={{ color: "#c10000" }}>{selectedCurrency} {parseFloat(totalPayable - grandTotal).toFixed(2)}</td>
                            </tr>
                          }

                          <tr>
                            <td></td>
                            <td></td>
                          </tr>
                        </table>
                        <span style={{ marginRight: 15, marginBottom: 15 }} className="pull-right bold">You Pay &nbsp;&nbsp;&nbsp; {`${selectedCurrency} `} {totalPayable && (totalPayable / exchangeRate).toFixed(2)}</span>
                      </div>
                      :
                      <div style={{ margin: "0 -31px" }}>
                        <table className="table payment-flow-table">
                          <tr className="no-border">
                            <th style={{ fontWeight: 600 }}>Meet The Parent Fee :</th>
                            <td>{`${selectedCurrency} ${parseFloat(mtpAmount / exchangeRate).toFixed(2)}`}</td>
                          </tr>
                          {
                            (totalPayable - grandTotal).toFixed(2) > 0 && isCouponApplied === "Success" &&
                            <tr className="">
                              <th style={{ fontWeight: 600 }}>Discount Applied :</th>
                              <td style={{ color: "#c10000" }}>{selectedCurrency} {parseFloat(totalPayable - grandTotal).toFixed(2)}</td>
                            </tr>
                          }
                          <tr>
                            <td></td>
                            <td></td>
                          </tr>
                        </table>
                        <span style={{ marginRight: 15, marginBottom: 15 }} className="pull-right bold">You Pay &nbsp;&nbsp;&nbsp; {`${selectedCurrency} `} {mtpAmount && (mtpAmount / exchangeRate).toFixed(2)}</span>
                      </div>
                    }
                  </Col>
                  <Col xs="12">
                    <div className="payment-bottom">
                      {props.mtpOpted !== true ?
                        <Row>
                          <Col xs="6">
                            <span style={{ fontSize: 19 }}>{`${selectedCurrency} `} {totalPayable && (totalPayable / exchangeRate).toFixed(2)}</span>
                          </Col>
                          <Col xs="6" className="text-right">

                            {
                              !isNaN(paypalAmount) && paypalAmount > 0 ? (
                                <a onClick={() => setIsPayPalModalVisible(true)} className="pay-continue">CONTINUE
                                  <img src={chev}></img>
                                </a>
                              ) : (
                                  <a onClick={() => createCareOrder()} className="pay-continue">CONTINUE
                                    <img src={chev}></img>
                                  </a>
                                )
                            }
                          </Col>
                        </Row>
                        :
                        <Row>
                          <Col xs="6">
                            <span style={{ fontSize: 19 }}>{`${selectedCurrency} `} {mtpAmount && (mtpAmount / exchangeRate).toFixed(2)}</span>
                          </Col>
                          <Col xs="6" className="text-right">

                            {
                              !isNaN(paypalAmount) && paypalAmount > 0 ? (
                                <a onClick={() => setIsPayPalModalVisible(true)} className="pay-continue">CONTINUE
                                  <img src={chev}></img>
                                </a>
                              ) : (
                                  <a onClick={() => updateMtpStatus()} className="pay-continue">CONTINUE
                                    <img src={chev}></img>
                                  </a>
                                )
                            }
                          </Col>
                        </Row>
                      }
                    </div>
                  </Col>
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
            <Modal isOpen={isModalVisible}>
              <ModalBody>
                <div style={{ textAlign: 'center' }}>
                  <h6 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 1, color: '#861b8d' }}>{modalTitle}</h6>
                  <p>{modalDescription}</p>
                  <Button onClick={() => closeModal()}>Close</Button>
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
                    <p style={{fontSize:24}}><b>20%</b></p>
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
          mtpSuccess && orderSuccess ?
            <div>
              <div>
                <Container className="relative rise-card2">
                  <div>
                    <div className="text-center" style={{ padding: 25, paddingBottom: 20 }}>
                      <p className="bold font22 purple-text">Success</p>
                      <img style={{ width: 90 }} src={check} />
                      <br />
                      <br />
                      <p className="font-title font14 max560">
                        Meet The Parent payment successful.
                  </p>
                      <br />
                      <hr />
                    </div>
                    <p className="text-center font22 max560">Our Care Specialist will contact you soon with further details.</p>
                  </div>
                  <div className="text-center" style={{ padding: 40 }}>
                    <a onClick={onNavigateToCareOptions} className="hamper-button">Back To Quotes</a>
                  </div>
                </Container>
              </div>
            </div>
            :
            orderSuccess && props.isLoadingUser === false && !mtpSuccess &&
            <div>
              <div>
                <Container className="relative rise-card2">
                  <div>
                    <div className="text-center" style={{ padding: 25, paddingBottom: 20 }}>
                      <p className="bold font22 purple-text">Success</p>
                      <img style={{ width: 90 }} src={check} />
                      <br />
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
                          <p className="bold font20">Order Details</p>
                          <br></br>
                          <p className="bold font14">{requestDetails && requestDetails.title}
                          </p>
                          <p className="font-title" style={{ color: '#898889', marginBottom: 5 }}>{requestDetails && requestDetails.description}</p>
                          <br></br>
                          <p className="threeline" style={{ color: '#898889', marginBottom: 5 }}>
                            <img className="para-img" src={marker}></img><b>{requestDetails && requestDetails.locationTitle}</b></p>
                          <p className="threeline" style={{ color: '#898889', marginBottom: 5 }}>
                            <img className="para-img" src={calendar}></img><b>{new Date(requestDetails && requestDetails.serviceNeedsOn).toDateString() + ' ' + formatAMPM(new Date(requestDetails && requestDetails.serviceNeedsOn))}</b></p>
                        </div>
                      </Col>
                      <Col md="4">
                        <div style={{ paddingTop: 20 }}>
                          <p className="bold font20">Payment Summary</p>
                          <br></br>
                          <Table hover className="table">
                            <tr className="no-border">
                              <th className="font-title bold">Total Provider Amount :</th>
                              <td className="font-title">{`${selectedCurrency} ${parseFloat(providerTotal/exchangeRate).toFixed(2)}`}</td>
                            </tr>
                            <tr className="">
                              <th className="font-title bold">One Time Fee :</th>
                              <td className="font-title">{`${selectedCurrency} ${parseFloat(oneTimeFeeSum/exchangeRate).toFixed(2)} `}</td>
                            </tr>
                            {
                              (totalPayable - grandTotal).toFixed(2) > 0 && isCouponApplied === "Success" &&
                              <tr className="">
                                <th className="font-title bold">Discount Applied :</th>
                                <td className="font-title" style={{ color: "#c10000" }}>   {selectedCurrency} {parseFloat((totalPayable - grandTotal)/exchangeRate).toFixed(2)}</td>
                              </tr>
                            }
                            <tr className="">
                              <th className="font-title bold">Total Amount Paid :</th>
                              <td className="font-title">{`${selectedCurrency} ${totalPayable && (totalPayable/exchangeRate).toFixed(2)} `}</td>
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
      </div >
    </React.Fragment>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    isOrderCreated: state.request.isOrderCreated,
    orderId: state.request.orderId,
    mtpOpted: state.user.mtpOpted,
    mtpPaymentSuccess: state.user.mtpPaymentSuccess,
    isLoadingUser: state.user.isLoading
  }
}
export default connect(mapStateToProps, { ...RequestActions, ...UserActions })(CarePaymentInfo)