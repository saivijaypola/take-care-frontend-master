import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Container, Row, Col, Modal, ModalBody, ModalFooter, ModalHeader, Table, Nav,
    NavItem,
    NavLink, TabContent,
    TabPane,
    Label,
    FormGroup,
    InputGroup, InputGroupAddon,
} from "reactstrap";
import OwlCarousel from 'react-owl-carousel';
import { ProfileAction, RequestActions, UserActions, AdminActions } from '../../redux/actions';
import { connect } from 'react-redux'
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { v4 as uuidv4 } from 'uuid';
import ReadMoreReact from 'read-more-react';
import './style.css'
import viewquote from "../../images/icon/viewquote.png";
import message from '../../images/icon/message-yellow.png'
import rejected from '../../images/icon/rejected.svg'
import envelope from "../../images/icon/chat-2.png";
import house from "../../assets/images/icon/house.png";
import FloatingInput from '../../components/Shared/GeoSuggest/FloatingInput';
import { getDistance } from 'geolib';
import ProviderCardForCare from '../../components/Shared/AdminComponents/ProviderCardForCare';
import RequestResponse from '../../components/Shared/Request/RequestResponse';
import classnames from 'classnames';
import like from "../../images/icon/like.svg";
import dislike from "../../images/icon/dislike.svg";
import likeFilled from "../../images/icon/like-filled.png";
import payCards from "../../images/pngegg.png";
import paypal from "../../images/paypal.png";
import num1after from "../../images/icon/1num.png";
import num2after from "../../images/icon/2num.png";
import num3after from "../../images/icon/3num.png";
import num4after from "../../images/icon/4num.png";
import checkOrange from "../../images/icon/check-orange.png";
import num1 from "../../images/icon/num1.png";
import num2 from "../../images/icon/num2.png";
import num3 from "../../images/icon/num3.png";
import num4 from "../../images/icon/num4.png";
import hat from "../../images/icon/hat.png";
import back from "../../images/icon/back.png";
import suitcase from "../../images/icon/suitcase.png";
import providerIcon from "../../images/icon/service-provider.svg";
import invoice from "../../images/icon/invoice.svg";
import termsIcon from "../../images/icon/accepted.svg";
import Timeline from '../../components/Shared/Timeline/CareUserTimeline';
import firebase from "firebase";
import _ from "lodash";
import exclamation from "../../images/icon/exclamation.png";
import user from "../../images/icon/user-6.png";
import UserStatus from '../../components/Shared/UserStatus/Userstatus'
import help2 from "../../images/icon/help-2.png";
import { Progress, Segment, Button, Icon, Input, Dropdown } from 'semantic-ui-react';
import { AvForm, AvField, AvGroup, AvInput } from 'availity-reactstrap-validation';
import csc from 'country-state-city'
import { countries } from "./country";
import axios from "axios";
import getSymbolFromCurrency from 'currency-symbol-map';
import { axiosPost, axiosGet } from '../../handler/apiHandler';
import discount from '../../images/icon/discount.svg';
import cancel from '../../images/icon/pink-cancel.svg';
import { PayPalButton } from "react-paypal-button-v2";
import check from "../../images/icon/check.svg";
import marker from '../../images/icon/marker.png'
import calendar from '../../images/icon/calendar.png';
import CareRenewal from '../../components/Shared/CareRenewal/CareRenewal';
import getCouponGql from '../../graphql/query/getCouponByCouponTitle';
import { query } from '../../graphql/graphqlHandler';

const assetsBaseUrl = process.env.REACT_APP_ASSETS_BASE_URL

const reasonToEndSub = [
    { key: 1, text: 'My requirement is over', value: 0 },
    { key: 2, text: 'I am not happy with the provider delivering the service', value: 1 },
    { key: 3, text: 'Service quality is poor', value: 2 },
    { key: 4, text: 'It is too expensive for me to continue', value: 3 },
    { key: 5, text: 'Other reasons', value: 4 },
]

class CareDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCare: [],
            isPricing: true,
            activeProviderTab: 0,
            activeTimelineTab: 0,
            activeTab: 'serviceTab',
            selectedCareProvider: [],
            selectedCareOrder: [],
            monthlyFee: 0,
            perVisitFee: 0,
            oneTimeFee: 0,
            totalPayableAmount: 0,
            mtpAmount: 0,
            pricingTerms: `All prices are cover the service charges. Any incidental expenses like medicines, 
            lab tests,doctor charges etc. will be charged extra as per actuals.`,
            metaData: null,
            amountPayable: 0,
            optedMtp: false,
            providerTotal: 0,
            isHelpModalVisible: false,
            isInfoModalOpen: false,
            step: 0,
            width1: '0%',
            width2: '0%',
            width3: '0%',
            nextScreen: 'Pricing',
            prevScreen: 'Service',
            fullName: '',
            email: '',
            phone: '',
            address1: '',
            address2: '',
            userCity: '',
            userState: '',
            countries: [],
            states: [],
            userCountry: '',
            aboutMe: '',
            userZipCode: '',
            myCountryCode: '+91',
            avatarUrl: '',
            loadProfileUpdate: false,
            userLocation: '',
            isLocationDetected: false,
            errorMessage: '',
            isModalVisible: false,
            isHelpModalVisible: false,
            modalMessage: '',
            userLocalProfile: '',
            selectedCurrency: null,
            isLoading: false,
            countryInfo: null,
            optedMtp: false,
            exchangeRate: 1,
            dollarRate: 1,
            isCouponApplied: 'Pending',
            couponCode: '',
            finalAmount: null,
            isError: false,
            percentageDeducted: '',
            isCouponVisible: false,
            paymentSelected: '',
            mtpSuccess: false,
            orderSuccess: false,
            orderId: '',
            isPayVisible: false,
            clickedPay: false,
            isRenew: null,
            isSubEnded: false,
            selectedOption: '',
            otherReasons: '',
            paymentVisible: false
        }
        this.toggle = this.toggle.bind(this)
        this.toggleProvider = this.toggleProvider.bind(this)
        this.initializeTimeline = this.initializeTimeline.bind(this)
        this.onClickYes = this.onClickYes.bind(this)
        this.onClickNo = this.onClickNo.bind(this)
        this.navigateToProfile = this.navigateToProfile.bind(this)
        this.onChangeText = this.onChangeText.bind(this)
        this.onChangeCountry = this.onChangeCountry.bind(this)
        this.onChangeCountryCode = this.onChangeCountryCode.bind(this)
        this.initializeCountryState = this.initializeCountryState.bind(this)
        this.applyCouponCode = this.applyCouponCode.bind(this)
        this.onPaymentError = this.onPaymentError.bind(this)
        this.onNavigateToCareOptions = this.onNavigateToCareOptions.bind(this)
        this.formatAMPM = this.formatAMPM.bind(this)
    }


    componentDidMount() {
        window.scrollTo(0, 200)
        this.getGeoInfo()
        var countries = csc.getAllCountries()
        this.initializeCountryState()
        this.setState({
            countries: countries
        })

        if (this.props.careDetails && this.props.careDetails && this.props.careDetails.length > 0) {
            let selectedCareDetails = this.props.careDetails.filter(data => data.careId === this.props.match.params.careid)
            console.log("🚀 ~ file: CareDetails.js ~ line 72 ~ CareDetails ~ componentDidMount ~ selectedCareDetails", selectedCareDetails)
            this.setState({
                selectedCare: selectedCareDetails
            }, () => {
                let providerTotal = this.state.selectedCare[0].tblCareProvidersByCareId.nodes.reduce((a, b) => a = a + b.totalAmountByUser, 0);
                let oneTimeFeeSum = this.state.selectedCare[0].tblPackagePricingsByCareId.nodes.reduce((a, b) => a = a + b.amount, 0);
                let mtpFee = this.state.selectedCare[0].mtpFee * this.state.selectedCare[0].noOfMtp;
                let crvFee = this.state.selectedCare[0].crvFee * this.state.selectedCare[0].noOfCrv;

                this.setState({
                    selectedCareProvider: this.state.selectedCare[0].tblCareProvidersByCareId && this.state.selectedCare[0].tblCareProvidersByCareId.nodes[0],
                    providerTotal: providerTotal,
                    oneTimeFee: oneTimeFeeSum + crvFee,
                    totalPayableAmount: (oneTimeFeeSum + crvFee),
                    amountPayable: (oneTimeFeeSum + crvFee),
                    finalAmount: (oneTimeFeeSum + crvFee),
                    mtpAmount: mtpFee,
                    selectedCurrency: this.state.selectedCare[0].userCurrency
                })
                if (selectedCareDetails[0] && selectedCareDetails[0].optedMtp === true) {
                    this.setState({
                        amountPayable: (oneTimeFeeSum + crvFee),
                        finalAmount: (oneTimeFeeSum + crvFee)
                    })
                }

            })
        }
        this.initializeTimeline()
        var params = {
            "careId": this.props.match.params.careid
        }
        this.props.getAllCareOrders(params)
        // this.props.getAllCareDetailsByRequestId({ requestId: this.props.match.params.requestid })
        // this.props.getRequestDetailsByRequestId({ requestId: this.props.match.params.requestid })
    }

    componentDidUpdate(prevProps, prevState) {

        if (prevProps.careOrders !== this.props.careOrders) {
            this.initializeTimeline()
        }

        if (prevState.selectedCurrency !== this.state.selectedCurrency && this.state.selectedCurrency) {
            this.getCurrencyRate()
        }
    }

    initializeTimeline() {
        if (this.props.match.params.careid) {
            var careId = this.props.match.params.careid
            if (careId && this.props.careOrders && this.props.careOrders.length > 0) {
                const metadataRef = firebase.database().ref('Care/' + careId + '/Metadata/');
                metadataRef.on('value', snapshot => {
                    const getMetadata = snapshot.val();
                    this.setState({
                        metaData: getMetadata,
                        activeTab: 'pricingTab'
                    })
                })
            }
        }
    }

    getCurrencyRate = () => {
        this.setState({
            isLoading: true
        })
        axios.get(`https://api.currencyfreaks.com/latest?apikey=61ab7b0f5bcd4722837983e3b05cfada&symbols=${this.state.selectedCare[0].userCurrency}&base=${this.state.selectedCurrency}`).then((response) => {
            let data = response.data;
            this.setState({
                exchangeRate: data.rates[this.state.selectedCare[0].userCurrency],
                isLoading: false
            })
        }).catch((error) => {
            this.setState({
                isLoading: false,
                selectedCurrency: this.state.selectedCare[0].userCurrency,
                exchangeRate: 1
            })
        });
        axios.get(`https://api.currencyfreaks.com/latest?apikey=61ab7b0f5bcd4722837983e3b05cfada&symbols=${this.state.selectedCurrency}&base=USD`).then((response) => {
            let data = response.data;
            this.setState({
                dollarRate: data.rates[this.state.selectedCurrency],
                isLoading: false
            })
        }).catch((error) => {

        });
    }

    formatAMPM = (date) => {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    getGeoInfo = () => {
        this.setState({
            isLoading: true
        })
        axios.get('https://ipapi.co/json').then((response) => {
            let data = response.data;
            this.setState({
                countryInfo: data,
                selectedCurrency: data.currency,
                isLoading: false
            })
        }).catch((error) => {
            console.log("GEOINFO", error)
            this.setState({
                isLoading: false
            })
        });
    };

    onNavigateToRequestDetails = () => {
        this.props.history.push(`/care-details-new/${this.props.match.params.requestid}/${this.props.match.params.careid}`)
    }

    onChangeText(event) {

        this.setState({
            [event.target.name]: event.target.value
        })
    }

    onChangeCountryCode(event) {
        this.setState({
            myCountryCode: event.target.value
        })
    }

    onChangeCountry(event) {
        this.setState({
            [event.target.name]: event.target.value
        })

        var country = csc.getCountryById(event.target.value).name
        var states = csc.getStatesOfCountry(event.target.value)
        var phonecode = csc.getCountryById(event.target.value).phonecode
        this.setState({
            userCountry: country,
            states: states
        })
    }

    initializeCountryState() {
        const defaultCountryId = 101
        var country = csc.getCountryById("101")
        var states = csc.getStatesOfCountry("101")
        this.setState({
            userCountry: country.name,
            states: states
        })
    }

    onNavigateToCareOptions = () => {
        this.props.history.push(`/subscription-next/${this.props.match.params.requestid}`)
    }

    toggleProvider(tab, careData) {
        if (this.state.activeProviderTab !== tab) {
            this.setState({
                activeProviderTab: tab,
                selectedCareProvider: careData
            });
        }
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    onClickYes = () => {
        this.nextStep()
        this.setState({
            amountPayable: this.state.mtpAmount,
            optedMtp: true
        })
    }

    onClickNo = () => {
        this.nextStep()
        this.setState({
            amountPayable: this.state.totalPayableAmount,
            optedMtp: false
        })
    }

    onClickPB = () => {
        this.setState({
            isInfoModalOpen: true
        })
    }

    onClickPayNow = () => {
        this.props.setMtpOpted(this.state.optedMtp)
        this.props.history.push(`/user/care-payment/${this.state.selectedCare[0].requestId}/${this.props.match.params.careid}`)
    }

    onClickPayMethod = (selection) => {
        this.setState({
            paymentSelected: selection
        })
    }

    uniqueCareProvider = (data, key) => {
        return [
            ...new Map(
                data.map(x => [key(x), x])
            ).values()
        ]
    }

    toggleModal = () => {
        this.setState({
            isHelpModalVisible: !this.state.isHelpModalVisible
        })
    }

    toggleInfoModal = () => {
        this.setState({
            isInfoModalOpen: !this.state.isInfoModalOpen
        })
    }

    revealCoupon = () => {
        this.setState({
            isCouponVisible: true
        })
    }

    onPaymentError = () => {

        this.setState({
            modalMessage: 'Payment Failed',
            modalDescription: 'Something went wrong, pelase try again',
            isError: true,
            isModalVisible: true
        })

    }

    applyCouponCode = async () => {
        var dbParams = {
            "couponTitle": this.state.couponCode.toString().toUpperCase().trim()
        }
        const couponResponse = await query(getCouponGql, dbParams);
        console.log('RESPONSE', couponResponse)
        if (couponResponse.error) {
            this.setState({
                isError: true,
                modalMessage: 'Network Failure',
                modalDescription: 'Check your internet connection',
                isModalVisible: true
            });
        }
        else if (couponResponse && couponResponse.tblCouponByCouponTitle && couponResponse.tblCouponByCouponTitle.percentageReduction && couponResponse.tblCouponByCouponTitle.expireOn) {

            this.setState({ isCouponApplied: 'Success', paymentVisible: false })
            var expiry = new Date(couponResponse.tblCouponByCouponTitle.expireOn)
            var today = new Date()

            if (expiry > today) {
                var percentage = couponResponse.tblCouponByCouponTitle.percentageReduction
                this.setState({ percentageDeducted: percentage })
                if (this.state.optedMtp) {
                    var totalPayable = (this.state.mtpAmount - (this.state.mtpAmount * percentage / 100))
                } else {
                    var totalPayable = (this.state.oneTimeFee - (this.state.oneTimeFee * percentage / 100))
                }

                if (isNaN(totalPayable)) {
                    this.setState({ isCouponApplied: 'Failed' })
                } else {
                    this.setState({ amountPayable: totalPayable })
                }
            } else {
                this.setState({ isCouponApplied: 'Failed' })
            }

        } else {
            this.setState({ isCouponApplied: 'Failed' })
        }

    }

    cancelCoupon = () => {
        this.setState({
            amountPayable: this.state.optedMtp ? this.state.mtpAmount : this.state.oneTimeFee,
            isCouponApplied: 'Pending',
            couponCode: '',

        })
    }

    updateMtpStatus = async (details, data) => {
        const apiResponse = await axiosGet(`care/updatestatus/${this.props.match.params.careid}/optedmtp`);
        if (apiResponse.error === null && apiResponse.response.status === 200) {
            this.setState({
                mtpSuccess: true,
                orderSuccess: true
            })
            this.props.updateMtpStatusSuccess(apiResponse.response)
        } else {
            this.setState({
                isModalVisible: true,
                modalDescription: "Could not process payment for 'Meet The Parent', please try again.",
                modalMessage: 'Payment Failed!',
            })
            this.props.updateMtpStatusFailed(apiResponse)
        }
    }

    createCareOrder = async (details, data) => {
        var amountPayableOnCompletion = parseFloat(this.state.finalAmount) - parseFloat(this.state.finalAmount)
        var notiAdvanceAmount = parseFloat(this.state.finalAmount)

        if (!isNaN(this.state.finalAmount)) {
            this.state.selectedCare[0] && this.state.selectedCare[0].tblCareProvidersByCareId && this.state.selectedCare[0].tblCareProvidersByCareId.nodes && this.state.selectedCare[0].tblCareProvidersByCareId.nodes.length > 0 && this.state.selectedCare[0].tblCareProvidersByCareId.nodes.map(async (provider, index) => {
                var countryCode = provider && provider.tblUserByProviderId && provider.tblUserByProviderId.countryCode && provider.tblUserByProviderId.countryCode.substring(1)
                var phoneNumber = provider && provider.tblUserByProviderId && provider.tblUserByProviderId.phoneNumber && provider.tblUserByProviderId.phoneNumber.substr(provider.tblUserByProviderId.phoneNumber.length - 10)
                var orderParams = {
                    "notification": {
                        "advanceAmount": !isNaN(notiAdvanceAmount) || notiAdvanceAmount !== '' ? notiAdvanceAmount : '0.00',
                        "orderTotal": parseFloat(this.state.totalPayableAmount),
                        "payableCompletion": amountPayableOnCompletion,
                        "phoneNumber": countryCode + "" + phoneNumber,
                        "providerEmail": provider && provider.tblUserByProviderId && provider.tblUserByProviderId.email,
                        "providerName": provider && provider.tblUserByProviderId && provider.tblUserByProviderId.fullname,
                        "recepientId": provider && provider.tblUserByProviderId && provider.tblUserByProviderId.userId,
                        "requestTitle": this.props.careRequestDetails && this.props.careRequestDetails.title,
                        "userName": this.props.careRequestDetails && this.props.careRequestDetails.tblUserByUserId && this.props.careRequestDetails.tblUserByUserId.fullname,
                    },
                    "order": {
                        "care_id": this.props.match.params.careid,
                        "provider_id": provider.providerId,
                        "order_accepted_on": new Date(),
                        "order_status": "Confirmed",
                        "user_full_name": this.state.fullName.trim(),
                        "country_code": this.state.myCountryCode,
                        "user_contact_no": this.state.phone.trim(),
                        "user_address": this.state.address1.trim() + ',' + ' ' + this.state.address2 && this.state.address2.trim() + this.state.address2 && ',' + this.state.address2 && ' ' + this.state.userCity.trim() + ',' + ' ' + this.state.userState + ',' + ' ' + this.state.userCountry + ',' + ' ' + this.state.userZipCode.trim(),
                        "selected_currency": this.state.selectedCurrency.trim(),
                        "provider_fee": parseFloat(provider && provider.providerFee),
                        "one_time_fee": parseFloat(this.state.oneTimeFee),
                        "service_charge": parseFloat(provider && provider.yocoServiceCharge),
                        "grand_total": parseFloat(provider && provider.totalAmountByUser),
                        "coupon_used": this.state.couponCode,
                        "metadata": this.state.countryInfo,
                        "total_payable": parseFloat(provider && provider.totalAmountByUser),
                        "care_provider_id": provider && provider.careProviderId
                    },
                }
                console.log("ORDER PARAMS", orderParams)
                //Create Order ApI Call
                const apiResponse = await axiosPost('care/new-order', orderParams);
                console.log('ORDER API RESPONSE', apiResponse);
                if (apiResponse.error) {
                    this.setState({
                        isModalVisible: true,
                        modalMessage: 'Failed to create order',
                        modalDescription: 'Check your internet connection',
                        isError: true
                    })
                    this.props.createCareOrderFailed(null)
                }
                else if (apiResponse.response.data.returnCode === 200) {
                    this.setState({
                        orderId: apiResponse.response.data.returnMessage
                    })
                    this.props.createCareOrderSuccess(apiResponse.response.data.returnMessage)
                    console.log('No Of Visits', provider.noOfVisits);

                    if (this.state.selectedCare[0] && this.props.match.params.careid) {
                        //Initialize Chat
                        const chatRef = firebase.database().ref('Care/' + this.props.match.params.careid + '/Metadata/' + apiResponse.response.data.returnMessage);
                        var metadataParams = {
                            orderId: apiResponse.response.data.returnMessage,
                            orderStatus: 'Confirmed',
                            orderCreatedOn: new Date(),
                            timeline: [
                                {
                                    title: 'CREATION',
                                    status: 'Confirmed',
                                    contactName: this.state.fullName,
                                    countryCode: this.state.myCountryCode,
                                    contactNumber: this.state.phone,
                                    contactAddress: this.state.address1.trim() + ',' + ' ' + this.state.address2.trim() + ',' + ' ' + this.state.userCity.trim() + ',' + ' ' + this.state.userState + ',' + ' ' + this.state.userCountry + ',' + ' ' + this.state.userZipCode.trim(),
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

                        chatRef.update(metadataParams)
                    }
                    this.setState({
                        orderSuccess: true
                    })
                }
                else if (!apiResponse.response.data.returnMessage) {
                    this.setState({
                        totalPayable: parseFloat(apiResponse.response.data.totalPayable),
                        isError: true,
                        modalMessage: 'Something went wrong with currency data',
                        modalDescription: 'Please try again or request to update service order',
                        isModalVisible: true
                    })
                }
            })

        } else if (this.state.isCouponApplied === 'Failed') {
            this.setState({
                isModalVisible: true,
                modalMessage: 'Coupon Invalid',
                modalDescription: 'Please remove the entered invalid coupon code or add a valid coupon code and try again',
                isError: true
            })
        } else {
            this.setState({
                isModalVisible: true,
                modalMessage: 'Something went wrong',
                modalDescription: 'Please try again later',
                isError: true
            })
        }
    }

    prevStep = () => {
        if (this.state.activeTab === 'pricingTab') {
            window.scrollTo(0, 200)
            this.setState({
                activeTab: 'serviceTab',
                nextScreen: 'Pricing',
                width1: '0%'
            })
        } else if (this.state.activeTab === 'addressTab') {
            window.scrollTo(0, 200)
            this.setState({
                activeTab: 'pricingTab',
                prevScreen: 'Service',
                nextScreen: 'Pricing',
                width2: '0%',
                isCouponVisible: false
            })
            this.cancelCoupon()
        }
        // else if (this.state.activeTab === 'paymentTab') {
        //     window.scrollTo(0, 200)
        //     this.setState({
        //         activeTab: 'addressTab',
        //         prevScreen: 'Pricing',
        //         // nextScreen: 'Payment',
        //         width3: '0%'
        //     })
        // }
    }

    nextStep = (event, errors, values) => {
        if (errors && errors.length > 0) {

        } else if (this.state.activeTab === 'serviceTab') {
            window.scrollTo(0, 200)
            this.setState({
                activeTab: 'pricingTab',
                nextScreen: 'Payment',
                prevScreen: 'Service',
                width1: '100%'
            })
        } else if (this.state.activeTab === 'pricingTab') {
            window.scrollTo(0, 200)
            this.setState({
                activeTab: 'addressTab',
                // nextScreen: 'Payment',
                prevScreen: 'Pricing',
                width2: '100%'
            })
        }
        else if (this.state.activeTab === 'addressTab') {
            window.scrollTo(0, 200)
            if (this.state.amountPayable > 0) {
                this.setState({
                    paymentVisible: true
                })
            } else {
                this.createCareOrder()
            }
        }
    }

    navigateToProfile = () => {
        this.props.history.push(`/care-provider-details/${this.props.match.params.requestid}/${this.props.match.params.careid}`);
        this.props.resetCareDetailsStatus(false)
    }

    handledrpdwnChange = (event, data) => {
        this.setState({ selectedOption: (data.options[data.value].text) })
    }

    render() {
        const screenWidth = window.innerWidth
        console.log('WIDTH', screenWidth);
        const { selectedCare, isPricing, activeProviderTab, selectedCareProvider, activeTab, width1, width2, width3, isCouponApplied, couponCode, percentageDeducted, isCouponVisible, paymentSelected, isPayVisible } = this.state;
        const { fullName, email, phone, address1, address2, userCity, userZipCode, userCountry, userState, myCountryCode, selectedCurrency, optedMtp, amountPayable, exchangeRate, orderSuccess, mtpSuccess } = this.state
        const { careRequestDetails, careDetails, careOrders } = this.props;
        return (
            <React.Fragment>
                {!orderSuccess ?
                    <section style={{ backgroundColor: !_.isEmpty(this.state.metaData) && this.state.metaData !== null && !isPayVisible ? '#fff' : '#f8f8f8' }}>
                        <div className="provider-top-bar">
                            <Container>
                                <Row>
                                    <Col onClick={() => { selectedCare[0] && selectedCare[0].status === 'Confirmed' ? this.props.history.push(`/user/orders`) : this.props.history.goBack(); }} xs="2" md='1' className="relative">
                                        <Row>
                                            <img src={back} />
                                            <span>Back</span>
                                        </Row>
                                    </Col>
                                    <Col xs='1' md='1'></Col>
                                    <Col xs="9" md='10'>
                                        <h6 style={{ fontSize: 18 }} className="bold">{`${careRequestDetails && careRequestDetails.title} - ${selectedCare[0] && selectedCare[0].careTitle}`}</h6>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                        <Container className="mt-lg-3">
                            <Row>
                                <Col md="12" xs="12" sm="12">
                                    <div className="requests-container" style={{ borderRadius: 20, marginBottom: 10 }}>
                                        <Row>
                                            {!_.isEmpty(this.state.metaData) && this.state.metaData !== null ?
                                                <Col md="12">
                                                    <Row>
                                                        <Col xs="12" style={{ marginLeft: 10 }}>
                                                            {
                                                                !isPayVisible ?

                                                                    <Row>
                                                                        <div className="" >
                                                                            {selectedCare[0] && selectedCare[0].tblCareProvidersByCareId && selectedCare[0].tblCareProvidersByCareId.nodes.map((data, index) =>
                                                                                careRequestDetails && careRequestDetails !== null && data !== null && (
                                                                                    <div className={`request-details-profile provider-box-wrapper ${index === activeProviderTab ? 'active-box' : ''}`} onClick={() => { this.toggleProvider(index, data); }}>
                                                                                        <Row>
                                                                                            <Col xs="12" md="12" className="box-wrapper">
                                                                                                <p style={{fontWeight:"bold",fontSize:16}} >{data.tblUserByProviderId.fullname}</p>
                                                                                                <p style={{ marginTop: -8 }} className="text font14">{data.supportDescription}</p>
                                                                                            </Col>
                                                                                        </Row>
                                                                                    </div>
                                                                                )
                                                                            )}

                                                                        </div>
                                                                        <Col >
                                                                            {selectedCare[0] && careRequestDetails && this.state.metaData && careOrders && careOrders.length > 0 && this.props.match.params.careid && selectedCare[0].tblCareProvidersByCareId && selectedCare[0].tblCareProvidersByCareId.nodes.length > 0 &&
                                                                                <Timeline myRequestDetails={careRequestDetails} orderDetails={careOrders.filter(x => x.careProviderId === selectedCareProvider.careProviderId)} serviceDetails={selectedCareProvider} {...this.props} chatId={this.props.match.params.careid} />
                                                                            }
                                                                            <Button onClick={() => this.setState({ isPayVisible: true, isRenew: true })} className="btn btn-primary" style={{ float: 'right' }}>
                                                                                Complete Payment
                                                                            </Button>
                                                                        </Col>
                                                                    </Row>
                                                                    :
                                                                    <CareRenewal myRequestDetails={careRequestDetails} orderDetails={careOrders} serviceDetails={selectedCare[0].tblCareProvidersByCareId.nodes} chatId={this.props.match.params.careid} isRenew={this.state.isRenew} {...this.props} />
                                                            }

                                                        </Col>
                                                    </Row>
                                                    <Modal isOpen={this.state.clickedPay} style={{ marginTop: 70 }}>
                                                        <ModalHeader>
                                                            <p className="bold purple-text" style={{ fontSize: 18 }}>
                                                                Choose an option to continue
                                                            </p>
                                                        </ModalHeader>
                                                        <ModalBody>
                                                            <Row>
                                                                <Button onClick={() => this.setState({ isPayVisible: true, clickedPay: false, isRenew: true })} className="post-request green-label" >
                                                                    Pay & Renew Subscription
                                                                </Button>
                                                                <Button onClick={() => this.setState({ clickedPay: false, isSubEnded: true })} className="post-request purple-label" style={{ marginLeft: '5%' }}>
                                                                    Pay & End Subscription
                                                                </Button>
                                                            </Row>
                                                        </ModalBody>
                                                        <ModalFooter>
                                                            <Button onClick={() => this.setState({ clickedPay: false })} className="post-request gray-label">Close</Button>
                                                        </ModalFooter>
                                                    </Modal>
                                                    <Modal isOpen={this.state.isSubEnded} role='dialog' ceneterd={true} style={{ marginTop: 100, marginBottom: 100 }}>
                                                        <ModalHeader>
                                                            <p className="bold purple-text" style={{ fontSize: 18 }}>Report an Issue</p>
                                                        </ModalHeader>
                                                        <ModalBody >

                                                            <p style={{fontSize:16, fontWeight:"bold"}}>Please let us know the reason to end subscription.</p>
                                                            <Dropdown
                                                                fluid
                                                                placeholder='Select'
                                                                clearable options={reasonToEndSub}
                                                                selection
                                                                Input
                                                                onChange={this.handledrpdwnChange} />
                                                            {
                                                                this.state.selectedOption === 'Other reasons' &&
                                                                <div style={{ padding: '2%', width: '100%' }}>
                                                                    <p style={{fontSize:14, fontWeight:"bold"}}>Please let us know the reason(s) here:</p>
                                                                    <textarea style={{ width: '80%', padding: '2%' }} name='otherReasons' id='other-reasons' rows='3' value={this.state.otherReasons} type="text" onChange={this.onChangeText}></textarea>
                                                                </div>
                                                            }
                                                        </ModalBody>
                                                        <ModalFooter>
                                                            <Row style={{ width: "100%" }}>
                                                                <Col style={{ float: 'left' }}>
                                                                    <Button onClick={() => this.setState({ isSubEnded: false, clickedPay: true, selectedOption: '', otherReasons: '' })} className="post-request gray-label" >
                                                                        Back
                                                                    </Button>
                                                                </Col>
                                                                <Col style={{ float: 'right' }}>
                                                                    <Button onClick={() => this.setState({ isSubEnded: false, isPayVisible: true, selectedOption: '', otherReasons: '', isRenew: false })} className="post-request purple-label" >
                                                                        Submit
                                                                    </Button>
                                                                </Col>

                                                            </Row>
                                                        </ModalFooter>
                                                    </Modal>
                                                </Col>
                                                :
                                                <Col md="12" xs="12" sm="12">

                                                    <>
                                                        {/* List all selected providers */}
                                                        <div style={{ width: '100%', justifyContent: 'center', paddingLeft: '20%', paddingRight: '20%', paddingTop: 50, height: 100 }}>
                                                            <Row>
                                                                <div style={{ width: screenWidth < 768 ? '12%' : '5%', height: '42%' }}>
                                                                    <img src={width1 === '0%' ? num1after : checkOrange} style={{ width: '80%', height: '80%', borderRadius: '50%', marginLeft: '10%', marginRight: '10%', marginTop: -15 }} className={width1 === '0%' ? 'zoom-in-out' : ''} />
                                                                    <p style={{ color: '#f2711c', marginTop: '15%', fontSize:14, fontWeight:"bold" }}>Services</p>
                                                                </div>
                                                                <div className='progress-bar-light-grey' style={{ width: screenWidth < 768 ? '32%' : '40%', height: 4, borderRadius: 2 }}>
                                                                    <div id='bar-one' className='progress-bar-orange' style={{ height: 4, width: width1 }}></div>
                                                                </div>
                                                                <div style={{ width: screenWidth < 768 ? '12%' : '5%', height: '42%' }}>
                                                                    <img src={width1 === '100%' && width2 === '0%' ? num2after : width2 === '100%' ? checkOrange : num2} style={{ width: '80%', height: '80%', borderRadius: '50%', marginLeft: '10%', marginRight: '10%', marginTop: -15 }} className={width1 === '100%' && width2 === '0%' ? 'zoom-in-out' : ''} />
                                                                    <p style={{ color: '#f2711c', marginTop: '15%', fontSize:14, fontWeight:"bold" }}>Pricing</p>
                                                                </div>
                                                                <div className='progress-bar-light-grey' style={{ width: screenWidth < 768 ? '32%' : '40%', height: 4, borderRadius: 2 }}>
                                                                    <div id='bar-two' className='progress-bar-orange' style={{ height: 4, width: width2 }}></div>
                                                                </div>
                                                                <div style={{ width: screenWidth < 768 ? '12%' : '5%', height: '42%' }}>
                                                                    <img src={width2 === '100%' && width3 === '0%' ? num3after : width3 === '100%' ? checkOrange : num3} style={{ width: '80%', height: '80%', borderRadius: '50%', marginLeft: '10%', marginRight: '10%', marginTop: -15 }} className={width2 === '100%' && width3 === '0%' ? 'zoom-in-out' : ''} />
                                                                    <p style={{ color: '#f2711c', marginTop: '15%', fontSize:14, fontWeight:"bold" }}>Payment</p>
                                                                </div>
                                                                {/* <div className='progress-bar-light-grey' style={{ width: '25%', height: 4, borderRadius: 2 }}>
                                                                    <div id='bar-three' className='progress-bar-orange' style={{ height: 4, width: width3 }}></div>
                                                                </div>
                                                                <div style={{ width: 40, height: 40 }}>
                                                                    <img src={width3 === '100%' && !this.state.completed ? num4after : this.state.completed ? checkOrange : num4} style={{ width: '80%', height: '80%', borderRadius: '50%', marginLeft: '10%', marginRight: '10%', marginTop: -15 }} className={width3 === '100%' && !this.state.completed ? 'zoom-in-out' : ''} />
                                                                    <p style={{ color: '#f2711c', marginTop: '15%' }}>Payment</p>
                                                                </div> */}
                                                            </Row>
                                                        </div>
                                                    </>

                                                    {
                                                        activeTab === 'serviceTab' ?
                                                            <div style={{ padding: '5%' }}>
                                                                <p className="bold" style={{ fontSize: 22 }}>SERVICE DETAILS</p>
                                                                <hr />
                                                                <Row>
                                                                    {selectedCare[0] && selectedCare[0].tblCareProvidersByCareId && selectedCare[0].tblCareProvidersByCareId.nodes.map((data, index) =>
                                                                        <>
                                                                            <Col key={index} md='6' lg='6'>
                                                                                <div className='service-details-card'>
                                                                                    <p className="bold" style={{ fontSize: 16 }}>
                                                                                        <img style={{ width: 80, height: 80, borderRadius: '50%', marginRight: '5%' }} src={data.tblUserByProviderId.avatarUrl !== '' ? `${assetsBaseUrl}/Users/${data.tblUserByProviderId.userId}/Avatar/${data.tblUserByProviderId.avatarUrl}` : user} className='hover-grow-1 pointer' onClick={this.navigateToProfile}></img>{data.tblUserByProviderId.fullname}</p>
                                                                                    <p style={{ color: '#5b5a61', fontWeight:"bold", fontSize:19 }}>{data.supportDescription}</p>
                                                                                    
                                                                                    <p style={{ color: '#5b5a61', fontSize: 14 }}>
                                                                                    <ReadMoreReact text={data.briefDescription}
                                                                                    className="text-muted text-left"
                                                                                    min={50}
                                                                                    ideal={90}
                                                                                    max={100}
                                                                                    readMoreText={"More..."} /></p>
                                                                                    <p style={{ color: '#848484', fontSize:14, fontWeight:"bold" }}>YoCo Comments:</p>
                                                                                    <p style={{ color: '#848484' }}>
                                                                                    <ReadMoreReact text={data.yocoComments}
                                                                                    className="text-muted text-left"
                                                                                    min={50}
                                                                                    ideal={90}
                                                                                    max={100}
                                                                                    readMoreText={"More..."} /></p>
                                                                                </div>
                                                                            </Col>
                                                                        </>
                                                                    )}
                                                                </Row>
                                                                <div>
                                                                    {activeTab !== 'serviceTab' &&
                                                                        <Button color='purple' floated='left' icon animated onClick={this.prevStep}>
                                                                            <Button.Content visible>Back<Icon name='left chevron' /></Button.Content>
                                                                            <Button.Content hidden>{this.state.prevScreen}</Button.Content>

                                                                        </Button>}
                                                                    {activeTab !== 'addressTab' &&
                                                                        <Button color='orange' floated='right' icon animated onClick={this.nextStep}>
                                                                            <Button.Content visible>Continue<Icon name='right chevron' /></Button.Content>
                                                                            <Button.Content hidden>{this.state.nextScreen}</Button.Content>

                                                                        </Button>}
                                                                </div>
                                                                <Modal isOpen={this.state.isModalVisible}>
                                                                    <ModalBody>
                                                                        <div style={{ textAlign: 'center' }}>
                                                                            <h6 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 1, color: '#861b8d' }}>{this.state.modalMessage}</h6>
                                                                            <p>{this.state.modalDescription}</p>
                                                                            <Button onClick={() => this.setState({ isModalVisible: false, modalMessage: '', modalDescription: '' })}>Close</Button>
                                                                        </div>
                                                                    </ModalBody>
                                                                </Modal>
                                                            </div>
                                                            :
                                                            activeTab === 'pricingTab' ?
                                                                <div style={{ padding: '5%' }}>
                                                                    <p className="bold" style={{ fontSize: 22 }}>PRICING DETAILS</p>
                                                                    <hr />
                                                                    {/* Payment Terms  */}
                                                                    <div style={{ padding: '2% 5% 2% 5%' }}>
                                                                        <p className="profile-sections bold font14">
                                                                            <img src={termsIcon}></img>Payment Terms</p>
                                                                        <div
                                                                            dangerouslySetInnerHTML={{
                                                                                __html: selectedCare[0] && selectedCare[0].paymentTerms
                                                                            }}></div>
                                                                        <Row style={{ padding: 5, paddingLeft: 15 }}>
                                                                            <p style={{ fontSize: 14 }}><b>Start Date:</b> TBD</p>
                                                                        </Row>
                                                                        <Row style={{ padding: 5, paddingLeft: 15 }}>
                                                                            <p style={{ fontSize: 14 }}><b>Cancellation:</b> 20 Day Notice</p>
                                                                        </Row>
                                                                        <Row style={{ padding: 5, paddingLeft: 15 }}>
                                                                            <p style={{ fontSize: 14 }}><b>Billing:</b> One month after the service commences.</p>
                                                                        </Row>
                                                                        {/* <p>{this.state.pricingTerms}</p> */}
                                                                    </div>
                                                                    <hr />
                                                                    <div style={{ padding: '2% 5% 2% 5%' }} >
                                                                        <p className="bold profile-sections font14">
                                                                            <img src={invoice}></img>Monthly Service Fee</p>
                                                                        <p style={{ fontSize: 15 }}>To be charged at the end of every subscription month. The total amount will vary according to the number of visits.</p>
                                                                        <Col xs='12' md='8' lg='8' style={{ marginLeft: 25 }}>
                                                                            <Row>
                                                                                <Col>
                                                                                    <h6><b>Service Provider</b></h6>
                                                                                </Col>
                                                                                <Col>
                                                                                    <h6><b>Monthly Fee</b></h6>
                                                                                </Col>
                                                                                <Col>
                                                                                    <h6><b>Per Visit Fee</b></h6>
                                                                                </Col>
                                                                            </Row>
                                                                        </Col>
                                                                        <hr style={{ marginTop: 5, width: '60%', left: '12%', position: 'absolute' }} />
                                                                        <br />
                                                                        {selectedCare[0] && selectedCare[0].tblCareProvidersByCareId && selectedCare[0].tblCareProvidersByCareId.nodes.map((data, index) => {
                                                                            return (<>
                                                                                <Col xs='12' md='8' lg='8' style={{ marginLeft: 25 }}>
                                                                                    <Row>
                                                                                        <Col><h6><b>{data.tblUserByProviderId.fullname}</b></h6></Col>
                                                                                        <Col>
                                                                                            <p>{`${selectedCare[0] && selectedCare[0].userCurrency} ${parseFloat(((data.monthlyFee + (data.monthlyFee * data.yocoServiceCharge / 100)) / data.currencyRate)).toFixed(2)}`}</p>
                                                                                        </Col>
                                                                                        <Col>
                                                                                            <p>{`${selectedCare[0] && selectedCare[0].userCurrency} ${parseFloat(((data.perVisitCharge + (data.perVisitCharge * data.yocoServiceCharge / 100)) / data.currencyRate)).toFixed(2)}`}</p>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                            </>)

                                                                        })}
                                                                    </div>
                                                                    <hr />
                                                                    {/* Meet The Parent  */}
                                                                    {selectedCare[0] && selectedCare[0].optedMtp !== true &&
                                                                        <Col>
                                                                            <div xs='12' className='pricing-details-card'>
                                                                                <Row>
                                                                                    <p style={{fontSize:16, fontWeight:"bold"}}>OPT FOR 'MEET THE PARENT' BEFORE CONFIRMING THE SUBSCRIPTION&nbsp;<img onClick={() => this.toggleModal()} style={{ width: 30, height: 30, marginLeft: 10 }} src={help2} /></p><br />
                                                                                </Row>
                                                                                <p style={{ marginTop: -5 }} className="bold font14 profile-sections">
                                                                                    <img src={invoice}></img>Meet The Parent</p>
                                                                                <table className="table request-table care-pricing">

                                                                                    <tr>
                                                                                        <td><span className="">Provider Fee</span></td>
                                                                                        <td><span className="bold">{selectedCare[0] && selectedCare[0].userCurrency} {parseFloat(selectedCare[0].mtpFee).toFixed(2)} x {selectedCare[0] && selectedCare[0].noOfMtp > 0 && selectedCare[0].noOfMtp} {selectedCare[0] && selectedCare[0].noOfMtp > 0 && selectedCare[0].noOfMtp === 1 ? 'Provider' : 'Providers'}</span></td>
                                                                                    </tr>

                                                                                </table>
                                                                                <br />
                                                                                {
                                                                                    <Modal isOpen={this.state.isHelpModalVisible} role="dialog" autoFocus={true} centered={true}>
                                                                                        <ModalHeader>
                                                                                            <p style={{ textAlign: 'center', fontSize:16, fontWeight:"bold" }}>What is 'Meet The Parent' ?</p>
                                                                                        </ModalHeader>
                                                                                        <ModalBody style={{ padding: 20 }}>
                                                                                            <p>Before paying the fees mentioned above and confirming the subscription, get a meet-and-greet session arranged for your parent and the service provider. Only if both parties are comfortable with each other, you need to proceed.</p>
                                                                                            <button className="post-request" onClick={this.toggleModal}>Okay</button>
                                                                                        </ModalBody>
                                                                                    </Modal>
                                                                                }
                                                                                <div style={{ paddingBottom: 10 }}>
                                                                                    <p style={{ textAlign: 'right', fontSize:16, fontWeight:"bold" }}>Pay <b style={{ color: '#ff8a00' }}>{selectedCare[0] && selectedCare[0].userCurrency} {this.state.mtpAmount}</b> and book 'Meet The Parent'</p>
                                                                                    <Button color='orange' floated='right' icon animated onClick={this.onClickYes}>
                                                                                        <Button.Content visible>Continue<Icon name='right chevron' /></Button.Content>
                                                                                        <Button.Content hidden>{this.state.nextScreen}</Button.Content>
                                                                                    </Button>
                                                                                </div>
                                                                            </div>
                                                                            <Row style={{ marginBottom: 8, marginTop: -8 }}>
                                                                                <hr style={{ width: '40%' }} />
                                                                                <h6 style={{ fontSize: 16, marginTop: 5, color: 'purple' }}><b>OR</b></h6>
                                                                                <hr style={{ width: '40%' }} />
                                                                            </Row>
                                                                        </Col>



                                                                    }

                                                                    <Col>
                                                                        <div className='pricing-details-card'>
                                                                            {/* Provider Fee */}
                                                                            <div >
                                                                                <Row>
                                                                                    <p style={{fontSize:16, fontWeight:"bold"}}>PROCEED TO CONFIRM THE SUBSCRIPTION</p><br />
                                                                                </Row>
                                                                                {
                                                                                    <Modal isOpen={this.state.isInfoModalOpen} >
                                                                                        <ModalHeader>
                                                                                            <p className="bold font16 purple-text">
                                                                                                Price Breakdown
                                                                                            </p>
                                                                                        </ModalHeader>
                                                                                        <ModalBody >
                                                                                            {selectedCare[0] && selectedCare[0].tblCareProvidersByCareId && selectedCare[0].tblCareProvidersByCareId.nodes.map((data, index) => {
                                                                                                let providerFee = ((data.monthlyFee + data.yocoServiceCharge) / data.currencyRate).toFixed(2)
                                                                                                let perVisitCharge = (data.perVisitCharge / data.currencyRate.toFixed(2))
                                                                                                return (<>
                                                                                                    <h6 className="pricing-provider-head">{`Provider : ${data.tblUserByProviderId.fullname}`}</h6>
                                                                                                    <table className="care-pricing table request-table " xs="12">
                                                                                                        <tr>
                                                                                                            <td><span className="">Monthly Fee</span></td>
                                                                                                            <td><span className="bold">{`${selectedCare[0] && selectedCare[0].userCurrency} ${parseFloat(providerFee).toFixed(2)}`}</span></td>
                                                                                                        </tr>
                                                                                                        <tr>
                                                                                                            <td><span className="">Per Visit Fee</span></td>
                                                                                                            <td><span className="bold">{selectedCare[0] && selectedCare[0].userCurrency} {parseFloat(perVisitCharge).toFixed(2)}</span></td>
                                                                                                        </tr>
                                                                                                        {parseInt(data.noOfVisits) !== 0 && parseInt(data.noOfVisits) !== 0 ?
                                                                                                            <tr>
                                                                                                                <td><span className="">No of Visit Specified</span></td>
                                                                                                                <td><span className="bold">{parseInt(data.noOfVisits)}</span></td>
                                                                                                            </tr> : parseInt(data.noOfVisits) == 0 ? <tr>
                                                                                                                <td><span className="">No of Visit Specified</span></td>
                                                                                                                <td><span className="bold">TBD</span></td>
                                                                                                            </tr> : ''
                                                                                                        }
                                                                                                        <hr />
                                                                                                        <tr>
                                                                                                            <td><span className="bold">Total</span></td>
                                                                                                            <td><span className="bold">{selectedCare[0] && selectedCare[0].userCurrency} {parseFloat(data.totalAmountInr / data.currencyRate).toFixed(2)}</span></td>
                                                                                                        </tr>
                                                                                                        <hr />
                                                                                                    </table>
                                                                                                </>
                                                                                                )
                                                                                            })}

                                                                                            <h6 className="pricing-provider-head">One Time Fee:</h6>
                                                                                            <table className="table request-table care-pricing">
                                                                                                <tr>
                                                                                                    <td><span className="">Criminal Record Verification</span></td>
                                                                                                    <td><span className="bold">{selectedCare[0] && selectedCare[0].userCurrency} {parseFloat(selectedCare[0] && selectedCare[0].crvFee).toFixed(2)} x {selectedCare[0] && selectedCare[0].noOfCrv > 0 && selectedCare[0].noOfCrv} {selectedCare[0] && selectedCare[0].noOfCrv > 0 && selectedCare[0].noOfCrv === 1 ? 'Provider' : 'Providers'}</span></td>
                                                                                                </tr>
                                                                                                {selectedCare[0] && selectedCare[0].tblPackagePricingsByCareId && selectedCare[0].tblPackagePricingsByCareId.nodes.filter(x => x.priceItem !== 'MEET THE PARENT').map((data, index) => {
                                                                                                    if (parseInt(data.amount) !== 0) {
                                                                                                        return (
                                                                                                            <tr>
                                                                                                                <td><span className="">{data.priceItem}</span></td>
                                                                                                                <td><span className="bold">{selectedCare[0] && selectedCare[0].userCurrency} {parseFloat(data.amount).toFixed(2)}</span></td>
                                                                                                            </tr>
                                                                                                        )
                                                                                                    }
                                                                                                }

                                                                                                )}
                                                                                                <hr />
                                                                                                <tr>
                                                                                                    <td><span className="price-span-title"><span>Total Amount</span></span></td>
                                                                                                    <td><span className="bold price-span">{`${selectedCare[0] && selectedCare[0].userCurrency} ${parseFloat(this.state.totalPayableAmount).toFixed(2)}`}</span></td>
                                                                                                </tr>
                                                                                            </table>
                                                                                            <br />
                                                                                        </ModalBody>
                                                                                        <ModalFooter>
                                                                                            <Row style={{ width: "100%" }}>
                                                                                                <Col xs="12">
                                                                                                    <button onClick={this.toggleInfoModal} className="close-button purple-button">
                                                                                                        Close
                                                                                                    </button>
                                                                                                </Col>
                                                                                            </Row>

                                                                                        </ModalFooter>
                                                                                    </Modal>
                                                                                }
                                                                            </div>
                                                                            {/* One Time fee  */}
                                                                            <div>
                                                                                <p className="bold font14 profile-sections">
                                                                                    <img src={invoice}></img>One Time Fee</p>
                                                                                <table className="table request-table care-pricing">
                                                                                    <tr>
                                                                                        <td><span className="">Criminal Record Verification</span></td>
                                                                                        <td><span className="bold">{selectedCare[0] && selectedCare[0].userCurrency} {parseFloat(selectedCare[0] && selectedCare[0].crvFee).toFixed(2)} &nbsp;x&nbsp; {selectedCare[0] && selectedCare[0].noOfCrv > 0 && selectedCare[0].noOfCrv} {selectedCare[0] && selectedCare[0].noOfCrv > 0 && selectedCare[0].noOfCrv === 1 ? 'Provider' : 'Providers'}</span></td>
                                                                                    </tr>
                                                                                    {selectedCare[0] && selectedCare[0].tblPackagePricingsByCareId && selectedCare[0].tblPackagePricingsByCareId.nodes.filter(x => x.priceItem !== 'MEET THE PARENT').map((data, index) => {
                                                                                        if (parseInt(data.amount) !== 0) {
                                                                                            return (
                                                                                                <tr>
                                                                                                    <td><span className="">{data.priceItem}</span></td>
                                                                                                    <td><span className="bold">{selectedCare[0] && selectedCare[0].userCurrency} {parseFloat(data.amount).toFixed(2)}</span></td>
                                                                                                </tr>
                                                                                            )
                                                                                        }
                                                                                    }

                                                                                    )}
                                                                                </table>
                                                                            </div>
                                                                            <hr style={{ marginTop: 5, width: '60%', left: '8%', position: 'absolute' }} />
                                                                            <br />
                                                                            <div>

                                                                                <table className="table request-table care-pricing">

                                                                                    <tr>
                                                                                        <td><span style={{ fontSize: 16 }} className=""><span>Total Amount</span></span></td>
                                                                                        <td><span style={{ fontSize: 14 }} className="bold">{`${selectedCare[0] && selectedCare[0].userCurrency} ${parseFloat(this.state.totalPayableAmount).toFixed(2)}`}</span></td>
                                                                                    </tr>
                                                                                    {/* <tr>
                                                                                        <td></td>
                                                                                        <td><span className="pointer" onClick={() => this.onClickPB()} style={{ fontSize: 12 }}><u>View Price Breakdown</u></span></td>
                                                                                    </tr> */}
                                                                                </table>
                                                                                <br />

                                                                            </div>
                                                                            {activeTab !== 'paymentTab' &&
                                                                                <div style={{ paddingBottom: 10 }}>
                                                                                    <p style={{ textAlign: 'right', fontSize:16, fontWeight:"bold" }}>Pay <b style={{ color: '#ff8a00' }}>{selectedCare[0] && selectedCare[0].userCurrency}    {this.state.totalPayableAmount}</b> and confirm the subscription</p>
                                                                                    <Button color='orange' floated='right' icon animated onClick={this.onClickNo}>
                                                                                        <Button.Content visible>Continue<Icon name='right chevron' /></Button.Content>
                                                                                        <Button.Content hidden>{this.state.nextScreen}</Button.Content>
                                                                                    </Button>
                                                                                </div>
                                                                            }
                                                                        </div>
                                                                    </Col>
                                                                    <div>
                                                                        {activeTab !== 'serviceTab' &&
                                                                            <Button color='purple' floated='left' icon animated onClick={this.prevStep}>
                                                                                <Button.Content visible>Back<Icon name='left chevron' /></Button.Content>
                                                                                <Button.Content hidden>{this.state.prevScreen}</Button.Content>

                                                                            </Button>}
                                                                    </div>
                                                                    <Modal isOpen={this.state.isModalVisible}>
                                                                        <ModalBody>
                                                                            <div style={{ textAlign: 'center' }}>
                                                                                <h6 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 1, color: '#861b8d' }}>{this.state.modalMessage}</h6>
                                                                                <p>{this.state.modalDescription}</p>
                                                                                <Button onClick={() => this.setState({ isModalVisible: false, modalMessage: '', modalDescription: '', isError: false })}>Close</Button>
                                                                            </div>
                                                                        </ModalBody>
                                                                    </Modal>
                                                                </div>
                                                                :
                                                                activeTab === 'addressTab' ?
                                                                    <div style={{ padding: '5%' }}>
                                                                        <AvForm className="login-form" onSubmit={this.nextStep}>
                                                                            <Row>
                                                                                <Col md='7'>
                                                                                    <div>
                                                                                        <p className="bold" style={{ fontSize: 22 }}>CONTACT DETAILS</p>
                                                                                        <p style={{fontSize:14, fontWeight:"bold"}}>Please provide the details of the contact person at the location of service, so that the service provider can coordinate with them.</p>
                                                                                        <br />
                                                                                        <Row>
                                                                                            <Col md={12}>
                                                                                                <AvGroup className="form-group position-relative">
                                                                                                    <Label for="email">Full Name<span className="text-danger">*</span></Label>
                                                                                                    <AvField type="text" maxlength="80" className="form-control" value={fullName} name="fullName" id="fullName" onChange={this.onChangeText} placeholder="Full Name" required
                                                                                                        errorMessage=""
                                                                                                        validate={{
                                                                                                            required: { value: true, errorMessage: "Enter your name" },
                                                                                                        }}
                                                                                                    />
                                                                                                </AvGroup>
                                                                                            </Col>
                                                                                            <Col md={12}>
                                                                                                <AvGroup className="form-group position-relative">
                                                                                                    <Label for="phone"> Phone No <span className="text-danger">*</span></Label>

                                                                                                    <InputGroup>
                                                                                                    <Col md={4}>
                                                                                                        <InputGroupAddon addonType="prepend">
                                                                                                            <select defaultValue={myCountryCode} onChange={this.onChangeCountryCode} className="form-control country-code">
                                                                                                                {
                                                                                                                    this.state.countries.map((country, index) =>

                                                                                                                        <option value={"+" + country.phonecode} key={`key_${index}`} selected={("+" + country.phonecode) == this.state.myCountryCode}>{"+" + country.phonecode + " (" + country.name + ")"}</option>
                                                                                                                    )

                                                                                                                }
                                                                                                            </select>
                                                                                                            {/* <InputGroupText>{this.state.myCountryCode}</InputGroupText> */}
                                                                                                        </InputGroupAddon>
                                                                                                        </Col>
                                                                                                        <Col md={8}>
                                                                                                        <AvInput
                                                                                                            type="telephone" minLength="6" maxlength="10"  className="form-control" value={phone} name="phone" id="phone" onChange={this.onChangeText} placeholder="Enter Phone No" required
                                                                                                            errorMessage=""
                                                                                                            validate={{
                                                                                                                //pattern: { value: '^[0-9]{10}$', errorMessage: 'Invalid Phone Number' },
                                                                                                                required: { value: true, errorMessage: "Enter mobile no" },
                                                                                                                minLength: { value: 6, errorMessage: 'Invalid Phone Number' },
                                                                                                                maxLength: { value: 10, errorMessage: 'Invalid Phone Number' }
                                                                                                            }}
                                                                                                        />
                                                                                                        </Col>
                                                                                                    </InputGroup>
                                                                                                </AvGroup>
                                                                                            </Col>
                                                                                        </Row>
                                                                                        <Row>
                                                                                            <Col md={6}>
                                                                                                <AvGroup className="form-group position-relative">
                                                                                                    <Label for="email"> Address Line 1<span className="text-danger">*</span></Label>
                                                                                                    <AvField type="text" maxlength="200" className="form-control" value={address1} name="address1" id="address1" onChange={this.onChangeText} placeholder="Eg: 123 Street Name" required
                                                                                                        errorMessage=""
                                                                                                        validate={{
                                                                                                            required: { value: true, errorMessage: "Enter adress line 1" },
                                                                                                        }}
                                                                                                    />
                                                                                                </AvGroup>
                                                                                            </Col>
                                                                                            <Col md={6}>
                                                                                                <AvGroup className="form-group position-relative">
                                                                                                    <Label for="email"> Address Line 2</Label>
                                                                                                    <AvField type="text" maxlength="200" className="form-control" value={address2} name="address2" id="address2" onChange={this.onChangeText} placeholder="Apt / Unit"
                                                                                                        errorMessage=""
                                                                                                    />
                                                                                                </AvGroup>

                                                                                            </Col>
                                                                                        </Row>

                                                                                        <Row>

                                                                                            <Col md={6}>
                                                                                                <FormGroup>
                                                                                                    <Label>Country<span className="text-danger">*</span></Label>
                                                                                                    <select onChange={this.onChangeCountry} key={'country_drp'} value={userCountry} name="userCountry" className="form-control custom-select" id="userCountry">
                                                                                                        {
                                                                                                            this.state.countries.map((country, index) =>
                                                                                                                <option value={country.name} key={`key_${index}`} selected={country.name === userCountry}>{country.name}</option>
                                                                                                            )
                                                                                                        }
                                                                                                    </select>
                                                                                                </FormGroup>
                                                                                            </Col>
                                                                                            <Col md={6}>
                                                                                                <FormGroup>
                                                                                                    <Label>State<span className="text-danger">*</span></Label>
                                                                                                    <select key={'state_drp'} defaultValue={'Kerala'} className="form-control custom-select" name="userState" id="userState" onChange={this.onChangeText}>

                                                                                                        {
                                                                                                            this.state.states.map((state, index) =>
                                                                                                                <option value={state.name} key={`key_${index}`} selected={state.name === userState}>{state.name}</option>
                                                                                                            )
                                                                                                        }

                                                                                                    </select>
                                                                                                </FormGroup>
                                                                                            </Col>
                                                                                        </Row>
                                                                                        <Row>
                                                                                            <Col md={6} style={{ marginTop: '2%' }}>
                                                                                                <AvGroup className="form-group position-relative">
                                                                                                    <Label>City<span className="text-danger">*</span></Label>
                                                                                                    <AvField type="text" className="form-control" value={userCity} name="userCity" id="userCity" onChange={this.onChangeText} placeholder="Enter city" required
                                                                                                        errorMessage=""
                                                                                                        validate={{
                                                                                                            required: { value: true, errorMessage: "Enter city" },
                                                                                                        }}
                                                                                                    />

                                                                                                    {/* <Input name="city" id="city" type="text" className="form-control" value={city} placeholder="City" onChange={this.onChangeText} /> */}
                                                                                                </AvGroup>
                                                                                            </Col>
                                                                                        </Row>
                                                                                        <Row>

                                                                                            <Col md={6}>
                                                                                                <AvGroup className="position-relative">
                                                                                                    <Label>Postal Code<span className="text-danger">*</span></Label>
                                                                                                    {/* <Input name="userZipCode" id="userZipCode" onChange={this.onChangeText} id="zipCode" value={userZipCode} type="text" className="form-control" placeholder="Postal Code" /> */}
                                                                                                    <AvField type="text" className="form-control" value={userZipCode} name="userZipCode" id="userZipCode" onChange={this.onChangeText} placeholder="Zip code / postal code" required
                                                                                                        errorMessage=""
                                                                                                        validate={{
                                                                                                            // pattern: {value: '^[0-9]*$', errorMessage: 'Please Enter a valid postal code'},
                                                                                                            maxLength: { value: 10, errorMessage: 'Please Enter a valid postal code' },
                                                                                                            required: { value: true, errorMessage: "Zip code / postal code" },
                                                                                                        }}
                                                                                                    />
                                                                                                </AvGroup>
                                                                                            </Col>
                                                                                        </Row>
                                                                                        {/* <FormGroup>
                                                                                            <Button color='orange' floated='right' icon animated>
                                                                                                <Button.Content visible>Continue<Icon name='right chevron' /></Button.Content>
                                                                                                <Button.Content hidden>{this.state.nextScreen}</Button.Content>
                                                                                            </Button>
                                                                                        </FormGroup> */}
                                                                                        <Modal isOpen={this.state.isHelpModalVisible} role="dialog" autoFocus={true} centered={true}>
                                                                                            <ModalBody>
                                                                                                <p className="helpmodal">Please key in your exact location here and pick the most appropriate choice that shows in the dropdown options.
                                                                                                    <br></br> <br></br>
                                                                                                    All service requests within 40 Km of this location will be notified to you.
                                                                                                </p>
                                                                                                <Button className="post-request" onClick={this.toggleHelpModal}>Close</Button>
                                                                                            </ModalBody>
                                                                                        </Modal>
                                                                                        <Modal isOpen={this.state.isModalVisible}>
                                                                                            <ModalBody>
                                                                                                <div style={{ textAlign: 'center' }}>
                                                                                                    <h6 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 1, color: '#861b8d' }}>{this.state.modalMessage}</h6>
                                                                                                    <p>{this.state.modalDescription}</p>
                                                                                                    <Button onClick={() => this.setState({ isModalVisible: false, modalMessage: '', modalDescription: '', isError: false })}>Close</Button>
                                                                                                </div>
                                                                                            </ModalBody>
                                                                                        </Modal>
                                                                                    </div>
                                                                                </Col>
                                                                                <Col md='5' className='trianglify-bg' style={{ borderRadius: '1%' }}>
                                                                                    <div className='pay-options'>
                                                                                        <Row style={{ padding: '5% 0%', marginTop: '5%' }}>
                                                                                            <Col xs='2'></Col>
                                                                                            <Col>
                                                                                                {
                                                                                                    isCouponApplied === 'Pending' ?
                                                                                                        <div style={{ margin: '5% 0%' }}>
                                                                                                            {!isCouponVisible &&

                                                                                                                <p className='add-coupon text-center' onClick={this.revealCoupon}>Have a coupon code ?</p>
                                                                                                            }
                                                                                                            {isCouponVisible &&
                                                                                                                <Input style={{ marginBottom: '5%' }} className='coupon-fade-in' type='text' placeholder='Enter Coupon Code' value={couponCode} onChange={e => this.setState({ couponCode: e.target.value })} icon='percent' iconPosition='left' action>
                                                                                                                    <input />
                                                                                                                    <Button type='submit' color='orange' className='coupon-fade-in' onClick={this.applyCouponCode}>Apply</Button>
                                                                                                                </Input>
                                                                                                            }


                                                                                                        </div>
                                                                                                        : isCouponApplied === 'Success' ? (
                                                                                                            <div className="coupon-div2" style={{ backgroundColor: '#EFDCF9' }}>
                                                                                                                <p><b>{`You have saved ${percentageDeducted}% of your order`}</b>
                                                                                                                    <img onClick={this.cancelCoupon} src={cancel} style={{ width: 20, marginLeft: 10 }} />
                                                                                                                </p>
                                                                                                            </div>
                                                                                                        ) : (
                                                                                                                <div className="coupon-div2" style={{ backgroundColor: '#EFDCF9' }}>
                                                                                                                    <p><b>{`Invalid Coupon Code`}</b>
                                                                                                                        <img onClick={this.cancelCoupon} src={cancel} style={{ width: 20, marginLeft: 10 }} />
                                                                                                                    </p>
                                                                                                                </div>
                                                                                                            )

                                                                                                }
                                                                                                <hr />
                                                                                                <Col xs='2'></Col>
                                                                                                <Row >
                                                                                                    <Col xs="7" md='7'>
                                                                                                        <p style={{fontSize:16, fontWeight:"bold"}}>Select your currency</p>
                                                                                                    </Col>
                                                                                                    <Col xs="5" md='5'>
                                                                                                        {
                                                                                                            selectedCurrency && (
                                                                                                                <select name="selectedCurrency" onChange={this.onChangeText} defaultValue={selectedCurrency} className="form-control custom-select">
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

                                                                                                {
                                                                                                    optedMtp ?
                                                                                                        <div>
                                                                                                            <Row style={{ padding: '5% 0%', marginTop: '5%' }}>
                                                                                                                <Col>
                                                                                                                    <p className='bold' style={{ fontSize: 16 }}>Meet The Parent Fee:</p>
                                                                                                                </Col>
                                                                                                                <Col>
                                                                                                                    <p className='bold' style={{ fontSize: 16 }}>{getSymbolFromCurrency(selectedCurrency)} {parseFloat(this.state.mtpAmount / exchangeRate).toFixed(2)}</p>
                                                                                                                </Col>
                                                                                                            </Row>
                                                                                                            {isCouponApplied === 'Success' &&
                                                                                                                <Row>
                                                                                                                    <Col>
                                                                                                                        <p className='bold' style={{ fontSize: 16 }}>Discount Applied:</p>
                                                                                                                    </Col>
                                                                                                                    <Col>
                                                                                                                        <p className='bold' style={{ fontSize: 16 }}>{getSymbolFromCurrency(selectedCurrency)} {parseFloat((this.state.mtpAmount - amountPayable) / exchangeRate).toFixed(2)}</p>
                                                                                                                    </Col>
                                                                                                                </Row>}
                                                                                                        </div>
                                                                                                        :
                                                                                                        <div>
                                                                                                            <Row>
                                                                                                                <Col>
                                                                                                                    <p className='bold' style={{ fontSize: 16 }}>One Time Fee:</p>
                                                                                                                </Col>
                                                                                                                <Col>
                                                                                                                    <p className='bold' style={{ fontSize: 16 }}>{getSymbolFromCurrency(selectedCurrency)} {parseFloat(this.state.oneTimeFee / exchangeRate).toFixed(2)}</p>
                                                                                                                </Col>
                                                                                                            </Row>
                                                                                                            {isCouponApplied === 'Success' &&
                                                                                                                <Row>
                                                                                                                    <Col>
                                                                                                                        <p className='bold' style={{ fontSize: 16 }}>Discount Applied:</p>
                                                                                                                    </Col>
                                                                                                                    <Col>
                                                                                                                        <p className='bold' style={{ fontSize: 16 }}>{getSymbolFromCurrency(selectedCurrency)} {parseFloat((this.state.oneTimeFee - amountPayable) / exchangeRate).toFixed(2)}</p>
                                                                                                                    </Col>
                                                                                                                </Row>}
                                                                                                        </div>
                                                                                                }
                                                                                                <hr />
                                                                                                {
                                                                                                    optedMtp ?
                                                                                                        <Row style={{ padding: '5% 0%', marginTop: '5%', marginBottom: '5%' }}>
                                                                                                            <Col>
                                                                                                                <p className='bold' style={{ fontSize: 20 }}>TOTAL: </p>
                                                                                                            </Col>
                                                                                                            <Col>
                                                                                                                <p className='bold' style={{ fontSize: 20 }}>{getSymbolFromCurrency(selectedCurrency)} {parseFloat(this.state.amountPayable / exchangeRate).toFixed(2)}</p>
                                                                                                            </Col>
                                                                                                        </Row > :
                                                                                                        <Row style={{ padding: '5% 0%', marginTop: '5%', marginBottom: '5%' }}>
                                                                                                            <Col>
                                                                                                                <p className='bold' style={{ fontSize: 20 }}>TOTAL: </p>
                                                                                                            </Col>
                                                                                                            <Col >
                                                                                                                <p className='bold' style={{ fontSize: 20 }}>{getSymbolFromCurrency(selectedCurrency)} {parseFloat(this.state.amountPayable / exchangeRate).toFixed(2)}</p>
                                                                                                            </Col>
                                                                                                        </Row>
                                                                                                }
                                                                                                {
                                                                                                    !this.state.paymentVisible ?
                                                                                                        <FormGroup>
                                                                                                            <Button color='orange' animated='vertical' style={{ width: '100%', marginBottom: '3%' }}>
                                                                                                                <Button.Content visible>ACCEPT&nbsp;&nbsp;&&nbsp;&nbsp;PAY</Button.Content>
                                                                                                                <Button.Content hidden>{getSymbolFromCurrency(selectedCurrency)} {parseFloat(amountPayable / exchangeRate).toFixed(2)}</Button.Content>
                                                                                                            </Button>
                                                                                                        </FormGroup>
                                                                                                        :
                                                                                                        <></>
                                                                                                }
                                                                                                <br />
                                                                                                {
                                                                                                    this.state.paymentVisible ?
                                                                                                        <PayPalButton
                                                                                                            amount={this.state.amountPayable}
                                                                                                            currency={selectedCurrency}
                                                                                                            onError={() => this.onPaymentError()}
                                                                                                            onSuccess={(details, data) => optedMtp ? this.updateMtpStatus(details, data) : this.createCareOrder(details, data)}
                                                                                                            options={{

                                                                                                                clientId: "AdPh6dusxjoGaQsfTCC1otVqTHaFhX-mas2ecoFVt4XZurdYTqEc_dDqHRYBe2q1mCOAAfM343YCjuGy"
                                                                                                            }}
                                                                                                        /> : <></>
                                                                                                }
                                                                                            </Col>
                                                                                            <Col xs='2'></Col>
                                                                                        </Row>

                                                                                    </div>
                                                                                    <div>
                                                                                        
                                                                                    </div>
                                                                                </Col>
                                                                            </Row>
                                                                        </AvForm>
                                                                        <Button color='purple' floated='left' icon animated onClick={this.prevStep}>
                                                                            <Button.Content visible>Back<Icon name='left chevron' /></Button.Content>
                                                                            <Button.Content hidden>{this.state.prevScreen}</Button.Content>
                                                                        </Button>
                                                                    </div>
                                                                    //==========------========-----========------============================================-------------============-----------
                                                                    :
                                                                    <div style={{ padding: '5%' }}>
                                                                        <p className="bold" style={{ fontSize: 22 }}>PAYMENT DETAILS</p>
                                                                        <hr />
                                                                        <Row>
                                                                            <Col md='7'>
                                                                                <Row style={{ padding: '0% 3%', paddingTop: '3%' }}>
                                                                                    <Col xs='8' md='10'>
                                                                                        <label class="mtp-container">
                                                                                            <input type="radio" name="mtp" onClick={() => this.onClickPayMethod('Paypal')} />
                                                                                            <span class="mtp-checkmark"><b style={{ marginLeft: 40, color: '#5b5a61' }}>PayPal</b></span>
                                                                                        </label>
                                                                                    </Col>
                                                                                    <Col xs='4' md='2'>
                                                                                        <img src={paypal} style={{ height: 40, width: 55 }} />
                                                                                    </Col>
                                                                                </Row>
                                                                                <b style={{ paddingLeft: '4%', color: '#848484' }}>You'll be redirected to PayPal to complete your payment</b>
                                                                                <hr />
                                                                                <Row style={{ paddingLeft: '3%' }}>
                                                                                    <Col xs='7' md='7' style={{ paddingTop: '2%' }}>
                                                                                        <label class="mtp-container">
                                                                                            <input type="radio" name="mtp" onClick={() => this.onClickPayMethod('Card')} />
                                                                                            <span class="mtp-checkmark"><b style={{ marginLeft: 40, fontSize: 18, color: '#5b5a61' }}>Credit&nbsp;/&nbsp;Debit&nbsp;Card</b></span>
                                                                                        </label>

                                                                                    </Col>
                                                                                    <Col xs='5' md='5'>
                                                                                        <img src={payCards} style={{ width: '100%', height: '100%' }} />
                                                                                    </Col>
                                                                                </Row>
                                                                                <hr />
                                                                                {
                                                                                    isCouponApplied === 'Pending' ?
                                                                                        <div style={{ margin: '5% 0%' }}>
                                                                                            {!isCouponVisible &&

                                                                                                <Button color='violet' animated='vertical' onClick={this.revealCoupon} style={{ width: '40%' }}>
                                                                                                    <Button.Content visible>Have a coupon code ?</Button.Content>
                                                                                                    <Button.Content hidden>Click to add</Button.Content>
                                                                                                </Button>
                                                                                            }
                                                                                            {isCouponVisible &&
                                                                                                <Row className='coupon-row'>
                                                                                                    <Col xs='8' md='9'>
                                                                                                        <div className="coupon-div-new coupon-fade-in relative" style={{ margin: '-0.5% -4%' }}>
                                                                                                            <Row>
                                                                                                                <Col xs="12">
                                                                                                                    <input value={couponCode} onChange={e => this.setState({ couponCode: e.target.value })} className="payment-text coupon-field-new" placeholder="Enter Coupon Code" />
                                                                                                                </Col>
                                                                                                            </Row>
                                                                                                            <img src={discount} />
                                                                                                        </div>
                                                                                                    </Col>
                                                                                                    <Col xs='4' md='3'>
                                                                                                        <Button color='violet' className='coupon-fade-in' onClick={this.applyCouponCode} style={{ fontSize: 16, width: '90%', height: '80%', marginTop: '4%', marginLeft: '-4%', position: 'absolute' }}>
                                                                                                            <Button.Content visible>Apply</Button.Content>
                                                                                                        </Button>
                                                                                                    </Col>
                                                                                                </Row>
                                                                                            }

                                                                                        </div>
                                                                                        : isCouponApplied === 'Success' ? (
                                                                                            <div className="coupon-div2" style={{ backgroundColor: '#EFDCF9' }}>
                                                                                                <p><b>{`You have saved ${percentageDeducted}% of your order`}</b>
                                                                                                    <img onClick={this.cancelCoupon} src={cancel} style={{ width: 20, marginLeft: 10 }} />
                                                                                                </p>
                                                                                            </div>
                                                                                        ) : (
                                                                                                <div className="coupon-div2" style={{ backgroundColor: '#EFDCF9' }}>
                                                                                                    <p><b>{`Invalid Coupon Code`}</b>
                                                                                                        <img onClick={this.cancelCoupon} src={cancel} style={{ width: 20, marginLeft: 10 }} />
                                                                                                    </p>
                                                                                                </div>
                                                                                            )

                                                                                }
                                                                            </Col>
                                                                            <Col md='5'>
                                                                                <div style={{ backgroundColor: '#f3f3f3', width: '100%', padding: '5%' }}>
                                                                                    <Row style={{ paddingVerticle: '2%' }}>
                                                                                        <Col xs="7">
                                                                                            <h4>Select your currency</h4>
                                                                                        </Col>
                                                                                        <Col xs="5">
                                                                                            {
                                                                                                selectedCurrency && (
                                                                                                    <select name="selectedCurrency" onChange={this.onChangeText} defaultValue={selectedCurrency} className="form-control custom-select custom-select-2">
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
                                                                                    {
                                                                                        optedMtp ?
                                                                                            <div>
                                                                                                <Row>
                                                                                                    <Col md='8'>
                                                                                                        <p className='bold' style={{ fontSize: 16 }}>Meet The Parent Fee:</p>
                                                                                                    </Col>
                                                                                                    <Col md='4'>
                                                                                                        <p className='bold' style={{ fontSize: 16 }}>{getSymbolFromCurrency(selectedCurrency)} {parseFloat(this.state.mtpAmount / exchangeRate).toFixed(2)}</p>
                                                                                                    </Col>
                                                                                                </Row>
                                                                                                {isCouponApplied === 'Success' &&
                                                                                                    <Row>
                                                                                                        <Col>
                                                                                                            <p className='bold' style={{ fontSize: 16 }}>Discount Applied:</p>
                                                                                                        </Col>
                                                                                                        <Col>
                                                                                                            <p className='bold' style={{ fontSize: 16 }}>{getSymbolFromCurrency(selectedCurrency)} {parseFloat(this.state.mtpAmount - (amountPayable / exchangeRate)).toFixed(2)}</p>
                                                                                                        </Col>
                                                                                                    </Row>}
                                                                                            </div>
                                                                                            :
                                                                                            <div>
                                                                                                <Row>
                                                                                                    <Col md='8'>
                                                                                                        <p className='bold' style={{ fontSize: 16 }}>One Time Fee:</p>
                                                                                                    </Col>
                                                                                                    <Col md='4'>
                                                                                                        <p className='bold' style={{ fontSize: 16 }}>{getSymbolFromCurrency(selectedCurrency)} {parseFloat(this.state.oneTimeFee / exchangeRate).toFixed(2)}</p>
                                                                                                    </Col>
                                                                                                </Row>
                                                                                                {isCouponApplied === 'Success' &&
                                                                                                    <Row>
                                                                                                        <Col>
                                                                                                            <p className='bold' style={{ fontSize: 16 }}>Discount Applied:</p>
                                                                                                        </Col>
                                                                                                        <Col>
                                                                                                            <p className='bold' style={{ fontSize: 16 }}>{getSymbolFromCurrency(selectedCurrency)} {parseFloat(this.state.finalAmount - (amountPayable / exchangeRate)).toFixed(2)}</p>
                                                                                                        </Col>
                                                                                                    </Row>}
                                                                                            </div>
                                                                                    }
                                                                                    <hr />
                                                                                    {
                                                                                        optedMtp ?
                                                                                            <Row>
                                                                                                <Col md='8'>
                                                                                                    <p className='bold' style={{ fontSize: 20 }}>TOTAL: </p>
                                                                                                </Col>
                                                                                                <Col md='4'>
                                                                                                    <p className='bold' style={{ fontSize: 20 }}>{getSymbolFromCurrency(selectedCurrency)} {parseFloat(this.state.mtpAmount / exchangeRate).toFixed(2)}</p>
                                                                                                </Col>
                                                                                            </Row> :
                                                                                            <Row>
                                                                                                <Col md='8'>
                                                                                                    <p className='bold' style={{ fontSize: 20 }}>TOTAL: </p>
                                                                                                </Col>
                                                                                                <Col md='4'>
                                                                                                    <p className='bold' style={{ fontSize: 20 }}>{getSymbolFromCurrency(selectedCurrency)} {parseFloat(this.state.finalAmount / exchangeRate).toFixed(2)}</p>
                                                                                                </Col>
                                                                                            </Row>
                                                                                    }
                                                                                    <Row style={{ padding: '5% 0%' }}>
                                                                                        <Col md='2'></Col>
                                                                                        <Col>
                                                                                            {
                                                                                                paymentSelected === 'Paypal' && this.state.finalAmount > 0 ?
                                                                                                    <PayPalButton
                                                                                                        amount={this.state.finalAmount}
                                                                                                        currency={selectedCurrency}
                                                                                                        onError={() => this.onPaymentError()}
                                                                                                        onSuccess={(details, data) => optedMtp ? this.updateMtpStatus(details, data) : this.createCareOrder(details, data)}
                                                                                                        options={{
                                                                                                            disableFunding: 'card',
                                                                                                            clientId: "AdPh6dusxjoGaQsfTCC1otVqTHaFhX-mas2ecoFVt4XZurdYTqEc_dDqHRYBe2q1mCOAAfM343YCjuGy"
                                                                                                        }}
                                                                                                    />
                                                                                                    :
                                                                                                    <Button color='orange' animated='vertical' onClick={optedMtp ? this.updateMtpStatus : this.createCareOrder} style={{ width: '100%' }}>
                                                                                                        <Button.Content visible>ACCEPT&nbsp;&nbsp;&&nbsp;&nbsp;PAY</Button.Content>
                                                                                                        <Button.Content hidden>{getSymbolFromCurrency(selectedCurrency)} {parseFloat(amountPayable / exchangeRate).toFixed(2)}</Button.Content>
                                                                                                    </Button>

                                                                                            }
                                                                                        </Col>
                                                                                        <Col md='2'></Col>
                                                                                    </Row>
                                                                                </div>
                                                                            </Col>
                                                                        </Row>
                                                                        <div style={{ padding: '3% 0%' }}>
                                                                            {activeTab !== 'serviceTab' &&
                                                                                <Button color='purple' floated='left' icon animated onClick={this.prevStep}>
                                                                                    <Button.Content visible>Back<Icon name='left chevron' /></Button.Content>
                                                                                    <Button.Content hidden>{this.state.prevScreen}</Button.Content>

                                                                                </Button>}


                                                                        </div>
                                                                        <Modal isOpen={this.state.isModalVisible}>
                                                                            <ModalBody>
                                                                                <div style={{ textAlign: 'center' }}>
                                                                                    <h6 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 1, color: '#861b8d' }}>{this.state.modalMessage}</h6>
                                                                                    <p>{this.state.modalDescription}</p>
                                                                                    <Button onClick={() => this.setState({ isModalVisible: false, modalMessage: '', modalDescription: '', isError: false })}>Close</Button>
                                                                                </div>
                                                                            </ModalBody>
                                                                        </Modal>
                                                                    </div>

                                                    }

                                                </Col>
                                            }
                                        </Row>
                                    </div>

                                </Col>


                                <Col md="12" xs="12" sm="12">

                                </Col>
                            </Row>
                        </Container>
                    </section>
                    :
                    mtpSuccess && orderSuccess ?
                        <div>
                            <div>
                                <Container className="relative whitegrad-bg">
                                    <div>
                                        <div className="text-center" style={{ padding: 25, paddingBottom: 20 }}>
                                            <p className="bold font22 purple-text">Meet The Parent payment successful.</p>
                                            <img style={{ width: 90 }} src={check} />
                                            <br />
                                            <br />
                                            <hr />
                                        </div>
                                        <p className="text-center font22 max560">Our Care Specialist will contact you soon with further details.</p>
                                    </div>
                                    <div className="text-center" style={{ padding: 40 }}>
                                        <a onClick={this.onNavigateToCareOptions} className="hamper-button">Back To Quotes</a>
                                    </div>
                                </Container>
                            </div>
                        </div>
                        :
                        orderSuccess && this.props.isLoadingUser === false && !mtpSuccess &&
                        <div>
                            <div>
                                <Container className="relative">
                                    <div>
                                        <div className="text-center" style={{ padding: 25, paddingBottom: 20 }}>
                                            <p className="bold font22 purple-text">Your order has been submitted successfully</p>
                                            <img style={{ width: 90 }} src={check} />
                                            <br /><br />
                                            <hr />
                                        </div>
                                        <Row style={{ paddingLeft: 20, paddingRight: 20 }}>
                                            <Col md="1"></Col>
                                            <Col md="6">
                                                <div style={{ paddingTop: 20 }}>
                                                    <p className="bold font20">Order Details</p>
                                                    <br></br>
                                                    <p className="bold font14">{this.props.careRequestDetails && this.props.careRequestDetails.title}
                                                    </p>
                                                    <p className="font-title" style={{ color: '#898889', marginBottom: 5 }}>{this.props.careRequestDetails && this.props.careRequestDetails.description}</p>
                                                    <br></br>
                                                    <p className="threeline" style={{ color: '#898889', marginBottom: 5 }}>
                                                        <img className="para-img" src={marker}></img><b>{this.props.careRequestDetails && this.props.careRequestDetails.locationTitle}</b></p>
                                                    <p className="threeline" style={{ color: '#898889', marginBottom: 5 }}>
                                                        <img className="para-img" src={calendar}></img><b>{new Date(this.props.careRequestDetails && this.props.careRequestDetails.serviceNeedsOn).toDateString() + ' ' + this.formatAMPM(new Date(this.props.careRequestDetails && this.props.careRequestDetails.serviceNeedsOn))}</b></p>
                                                </div>
                                            </Col>
                                            <Col md="4">
                                                <div style={{ paddingTop: 20 }}>
                                                    <p className="bold font20">Payment Summary</p>
                                                    <br></br>
                                                    <Table hover className="table">
                                                        <tr className="no-border">
                                                            <th className="font-title bold">Total Provider Amount :</th>
                                                            <td className="font-title">{`${selectedCurrency} ${parseFloat(this.state.providerTotal / exchangeRate).toFixed(2)}`}</td>
                                                        </tr>
                                                        <tr className="">
                                                            <th className="font-title bold">One Time Fee :</th>
                                                            <td className="font-title">{`${selectedCurrency} ${parseFloat(this.state.oneTimeFee / exchangeRate).toFixed(2)} `}</td>
                                                        </tr>
                                                        {
                                                            (amountPayable - this.state.finalAmount).toFixed(2) > 0 && isCouponApplied === "Success" &&
                                                            <tr className="">
                                                                <th className="font-title bold">Discount Applied :</th>
                                                                <td className="font-title" style={{ color: "#c10000" }}>   {selectedCurrency} {parseFloat((amountPayable - this.state.finalAmount) / exchangeRate).toFixed(2)}</td>
                                                            </tr>
                                                        }
                                                        <tr className="">
                                                            <th className="font-title bold">Total Amount Paid :</th>
                                                            <td className="font-title">{`${selectedCurrency} ${(this.state.finalAmount / exchangeRate).toFixed(2)} `}</td>
                                                        </tr>
                                                    </Table>
                                                </div>
                                            </Col>
                                            <Col md="1"></Col>
                                        </Row>
                                    </div>
                                    <div className="text-center" style={{ padding: 40 }}>
                                        <a onClick={() => this.props.history.goBack()} className="hamper-button">Track Order</a>
                                    </div>
                                </Container>
                            </div>
                        </div>
                }
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({

    careDetails: state.admin.carePackageDetails,
    isLoading: state.admin.isLoading,
    careRequestDetails: state.admin.careRequestDetails,
    isCareOrderCreated: state.request.isOrderCreated,
    orderId: state.request.orderId,
    isCareOrdersLoading: state.request.isCareOrdersLoading,
    careOrders: state.request.careOrders,
    mtpPaymentSuccess: state.user.mtpPaymentSuccess,
    mtpOpted: state.user.mtpOpted,
    isLoadingUser: state.user.isLoading
})

const mapDispatchToProps = {
    ...RequestActions,
    ...ProfileAction,
    ...UserActions,
    ...AdminActions
}

export default connect(mapStateToProps, mapDispatchToProps)(CareDetails)
