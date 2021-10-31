import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ShareIcon from '@material-ui/icons/Share';
import imgSpiffy5 from "../../../images/icon/yoyoco-safe-5.png";
import CancelIcon from '@material-ui/icons/Cancel';
import edit from '../../../images/icon/edit.svg'
import completed from '../../../images/icon/checked.png'
import verify from '../../../images/icon/verify.png'
import inprogress from '../../../images/icon/clock-2.png'
import checkGreen from '../../../images/icon/check-green.png'
import checkGray from '../../../images/icon/check-gray.png'
import checkGray2 from '../../../images/icon/check-gray-2.png'
import user from "../../../images/icon/user-6.png";
import SpiffyOnAvatar from "../Spiffy/spiffyonavatar";
import DigitalId from '../../../pages/Provider/DigitalId';
import { useSelector } from 'react-redux'
import { BillImageWrapper, BillImage, ClaimAmountWrapper, ModelImage } from "./TimeLine.styled";
import _ from "lodash";
import moment from 'moment';
import classnames from 'classnames';
import payCards from "../../../images/pngegg.png";
import paypal from "../../../images/paypal.png";
import cancel from '../../../images/icon/pink-cancel.svg';
import { Progress, Segment, Button, Icon } from 'semantic-ui-react';

//Grid Style 
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { PayPalButton } from "react-paypal-button-v2";
import { Dropdown } from 'semantic-ui-react';
import discount from '../../../images/icon/discount.svg';
import { countries } from "../../../pages/User/country";
import getSymbolFromCurrency from 'currency-symbol-map';

import firebase from "firebase"

import axios from "axios";
import {
    Container, Row, Col, Nav,
    NavItem,
    NavLink, TabContent,
    TabPane, Modal, Spinner, Input, ModalBody, ModalHeader, ModalFooter
} from "reactstrap";
import { axiosPost } from '../../../handler/apiHandler';
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}));


const useStylesImage = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        margin: 15,
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
        borderWidth: 5
    },
    title: {
        color: '#ffffff',
    },
    titleBar: {
        background:
            'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
}));
const assetsBaseUrl = process.env.REACT_APP_ASSETS_BASE_URL


export default function UserTimeLine(props) {
    const classes = useStyles();
    const imgClass = useStylesImage();


    const [inProgressComment, setInPorgressComment] = useState('')
    const { serviceDetails, orderDetails, myRequestDetails } = props
    const [activePanel, setActivePanel] = useState('Default')
    const [chatId, setChatId] = useState(props.chatId)
    const [metadata, setMetadata] = useState('')
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isApproveModalVisible, toggleApproveModal] = useState(false)
    const [isDisputeModalVisible, toggleDisputeModal] = useState(false)
    const [isDisputed, toggleDispute] = useState(false)
    const [digitalId, setDigitalId] = useState('')
    const [expanded, setExpanded] = useState(false);
    const [panel0, setPanel0] = useState(false)
    const [panel1, setPanel1] = useState(false)
    const [panel2, setPanel2] = useState(false)
    const [panel3, setPanel3] = useState(false)
    const [orderId, setOrderId] = useState('')
    const [workStatus, setWorkStatus] = useState('')
    const [workApprovalStatus, setWorkApprovalStatus] = useState('Pending-Completion')
    const orderClaimAmountDetails = useSelector(state => state.user.orderClaims)
    const [billsImageArray, setBillsImageArray] = useState([])
    const [claimAmount, setClaimAmount] = useState()
    const [imagePopUpModal, setImagePopUpModal] = useState(false)
    const [popupImageUrl, setPopupImageUrl] = useState('')
    const [billingDate, setBillingDate] = useState()
    const [activeTab, setActiveTab] = useState('timelineTab')
    const [isEnded, toggleEnded] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [otherReasons, setOtherReasons] = useState('');
    const [nextVisit, setNextVisit] = useState(null)
    const [isIssueReported, setIssueReported] = useState(false)
    const [clickedPay, setClickedPay] = useState(false)
    const [todayDate] = useState(new Date('2021-08-28'))
    const [lastVisitDate, setLastVisitDate] = useState()
    const [alphadata, setAlphadata] = useState('')
    const [href, setHref] = useState('')

    const setInitialPanelVisiblity = (metadata) => {

        setPanel0(metadata && metadata[0].isActiveForUser)
        setPanel1(metadata && metadata[1].isActiveForUser)
        setPanel2(metadata && metadata[2].isActiveForUser)
        setPanel3(metadata && metadata[3].isActiveForUser)
    }

    const reasonToEndSub = [
        { key: 1, text: 'My requirement is over', value: 0 },
        { key: 2, text: 'I am not happy with the provider delivering the service', value: 1 },
        { key: 3, text: 'Service quality is poor', value: 2 },
        { key: 4, text: 'It is too expensive for me to continue', value: 3 },
        { key: 5, text: 'Other reasons', value: 4 },
    ]

    const reasonsForIssue = [
        { key: 1, text: 'I am not happy with the provider delivering the service', value: 0 },
        { key: 2, text: 'Service quality is poor', value: 1 },
        { key: 3, text: 'Other reasons', value: 2 },
    ]

    const handledrpdwnChange = (event, data) => {
        setSelectedOption(data.options[data.value].text)
        var option = data.options[data.value].text
        if (option !== 'Other reasons') {
            var href = `https://wa.me/918129123104?text=${option.replaceAll(' ', '%20')}`
            setHref(href)
        }
    }

    useEffect(() => {

        if (chatId) {
            const alphadataRef = firebase.database().ref('Care/' + chatId + '/Metadata/' + orderDetails[0].careOrderId);
            alphadataRef.on('value', snapshot => {
                const getAlphadata = snapshot.val();
                if (getAlphadata) {
                    console.log('ALPHA DATA', getAlphadata);
                    setAlphadata(getAlphadata)
                }
            })

            const metadataRef = firebase.database().ref('Care/' + chatId + '/Metadata/' + orderDetails[0].careOrderId + '/timeline');
            metadataRef.on('value', snapshot => {
                const getMetadata = snapshot.val();
                if (getMetadata) {

                    setMetadata(getMetadata)
                    setInitialPanelVisiblity(getMetadata)
                    if (getMetadata[2].providerTasks && getMetadata[2].providerTasks[0].startDate !== '') {
                        var date = new Date(getMetadata[2].providerTasks[0].startDate)
                        date.setDate(date.getDate() + 30)
                        setBillingDate(date)
                    }
                    if (getMetadata[2].nextVisitDate !== '') {
                        var date = new Date(getMetadata[2].nextVisitDate)
                        setNextVisit(date)
                    }

                }

            }, [])

            const billdataRef = firebase.database().ref('Orders/Care/' + chatId + '/' + orderDetails[0].careOrderId + '/Bills/Visits');
            billdataRef.on('value', snapshot => {
                const images = snapshot.val();
                setBillsImageArray(images)
            })

            const orderRef = firebase.database().ref('Care/' + chatId + '/Metadata/' + orderDetails[0].careOrderId);
            orderRef.on('value', snapshot => {
                const getOrderData = snapshot.val();
                if (getOrderData) {
                    setOrderId(getOrderData.orderId)
                }


            }, [])

        }


    }, [orderDetails])

    useEffect(() => {
        if (!_.isEmpty(orderClaimAmountDetails)) {
            const orderDetails = orderClaimAmountDetails.nodes;
            const sumOfClaimAmount = !_.isEmpty(orderDetails) && _.reduce(orderDetails, function (a, b) {
                return { claimAmountInProviderCurrency: a.claimAmountInProviderCurrency + b.claimAmountInProviderCurrency }
            })
            setClaimAmount(sumOfClaimAmount);

        }
    }, [orderClaimAmountDetails])



    const updateOrderStatus = async (status) => {



        var amountPayableOnCompletion = parseFloat(serviceDetails && serviceDetails.orderTotalAmount) - parseFloat(serviceDetails && serviceDetails.advanceAmount)
        var notiAdvanceAmount = serviceDetails && serviceDetails.advanceAmount
        var countryCode = serviceDetails && serviceDetails.tblUserByProviderId && serviceDetails.tblUserByProviderId.countryCode && serviceDetails.tblUserByProviderId.countryCode.substring(1)
        var phoneNumber = serviceDetails && serviceDetails.tblUserByProviderId && serviceDetails.tblUserByProviderId.phoneNumber && serviceDetails.tblUserByProviderId.phoneNumber.substr(serviceDetails.tblUserByProviderId.phoneNumber.length - 10)
        var notifyParams = {
            "userName": myRequestDetails && myRequestDetails.tblUserByUserId && myRequestDetails.tblUserByUserId.fullname,
            "userEmail": myRequestDetails && myRequestDetails.tblUserByUserId && myRequestDetails.tblUserByUserId.email,
            "requestTitle": myRequestDetails && myRequestDetails.title,
            "recepientId": serviceDetails && serviceDetails.tblUserByProviderId && serviceDetails.tblUserByProviderId.userId,
            "phoneNumber": countryCode + "" + phoneNumber,
            "providerName": serviceDetails && serviceDetails.tblUserByProviderId && serviceDetails.tblUserByProviderId.fullname,
            "providerEmail": serviceDetails && serviceDetails.tblUserByProviderId && serviceDetails.tblUserByProviderId.email,
            "advanceAmount": serviceDetails && serviceDetails.advanceAmount,
            "payableCompletion": amountPayableOnCompletion,
            "orderTotal": serviceDetails && serviceDetails.orderTotalAmount,
            "status": status
        }

        var dbParams = {
            orderId: orderId,
            status: status

        }

        const apiResponse = await axiosPost('order/status', dbParams);
        if (status == "Approved") {
            var notifyStatus = axiosPost('workstatus/approve', notifyParams)
        }
    }

    const approveAdmin = (status, index) => {
        setWorkStatus(status)
        console.log('APPROVED');
        var payData = alphadata

        payData.history[payData.history.length - 1].visit[index].status = 'Approved'
        payData.timeline[3].completedTasks[index].approved = true
        payData.timeline[3].completedTasks[index].disputed = false
        payData.timeline[3].status = 'APPROVED'
        payData.timeline[2].status = ''
        payData.timeline[1].status = 'INITIATED'

        const paydataRef = firebase.database().ref('Care/' + chatId + '/Metadata/' + orderId)
        paydataRef.update(payData)
    }

    const approve = (status, index) => {

        setWorkStatus(status)
        var timelineData = metadata

        if (!alphadata.history) {
            var history = {
                history: [
                    {
                        visit: [
                            {
                                finishDate: timelineData[2].providerTasks[index].finishDate,
                                providerComments: timelineData[2].providerTasks[index].providerComments,
                                additionalExpenses: timelineData[2].providerTasks[index].additionalExpenses,
                                currency: 'INR',
                                status: status === 'Approved' ? 'Approved' : 'Disputed',
                            }
                        ],
                        isPaid: false
                    }
                ]
            }

            const metadataRef = firebase.database().ref('Care/' + chatId + '/Metadata/' + orderId);
            metadataRef.update(history)

        } 
        
        console.log('LOGIC', alphadata.history[alphadata.history.length - 1].isPaid);
        if (alphadata.history && alphadata.history[alphadata.history.length - 1].isPaid) {
            console.log('LOGIC CORRECT');
            var historyData = alphadata

            historyData.history[historyData.history.length] =
            {
                visit: [
                    {
                        finishDate: timelineData[2].providerTasks[index].finishDate,
                        providerComments: timelineData[2].providerTasks[index].providerComments,
                        additionalExpenses: timelineData[2].providerTasks[index].additionalExpenses,
                        currency: 'INR',
                        status: status === 'Approved' ? 'Approved' : 'Disputed',
                    }
                ],
                isPaid: false
            }

            const metadataRef = firebase.database().ref('Care/' + chatId + '/Metadata/' + orderId);
            metadataRef.update(historyData)

        } else {
            var historyData = alphadata

            historyData.history[historyData.history.length - 1].visit[historyData.history[historyData.history.length - 1].visit.length] =
            {
                finishDate: timelineData[2].providerTasks[index].finishDate,
                providerComments: timelineData[2].providerTasks[index].providerComments,
                additionalExpenses: timelineData[2].providerTasks[index].additionalExpenses,
                currency: 'INR',
                status: status === 'Approved' ? 'Approved' : 'Disputed',
            }
            historyData.history[historyData.history.length - 1].isPaid = false
            
            const metadataRef = firebase.database().ref('Care/' + chatId + '/Metadata/' + orderId);
            metadataRef.update(historyData)
        }

        timelineData[3].isActiveForUser = true
        timelineData[3].isActiveForProvider = true
        timelineData[3].updatedOn = new Date()
        if (status === 'Approved') {
            timelineData[1].status = 'INITIATED'
            timelineData[2].status = ''
            timelineData[3].completedTasks[index].approved = true
            timelineData[3].status = 'APPROVED'
        } else {
            timelineData[3].completedTasks[index].disputed = true
            timelineData[3].status = 'DISPUTED'
        }
        timelineData[3].completedTasks[index].userComments = ''

        setMetadata(timelineData)
        const metadataRef = firebase.database().ref('Care/' + chatId + '/Metadata/' + orderDetails[0].careOrderId + '/timeline');
        metadataRef.update(timelineData)
        if (status === "Disputed") {
            toggleDispute(true)
        }
        toggleApproveModal(false)
        toggleDisputeModal(false)
    }

    const endSubscription = () => {
        toggleEnded(true)
    }

    const verifyDigitalid = () => {

        var timelineData = metadata
        timelineData[2].isProviderVerified = true
        setMetadata(timelineData)
        const metadataRef = firebase.database().ref(chatId + '/Metadata/timeline');
        metadataRef.update(timelineData)
        setIsModalVisible(false)
    }

    const handleChange = (panel) => (event, isExpanded) => {


        if (metadata[panel] && metadata[panel].isActiveForUser == false) {

        } else {
            if (panel === 0) {
                setPanel0(isExpanded)
            } else if (panel === 1) {
                setPanel1(isExpanded)
            } else if (panel === 2) {
                setPanel2(isExpanded)
            }
            else if (panel === 3) {
                setPanel3(isExpanded)
            }

            // alert(panelActivity[0])
        }

    };
    const render_paypalButton = () => {
        return (
            <PayPalButton
                amount={!_.isEmpty(claimAmount) && claimAmount.claimAmountInUserCurrency}
                currency="USD"
                onError={() => alert("Payment Failed")}
                onSuccess={() => approve('Approved')}
                options={{
                    clientId: "AdPh6dusxjoGaQsfTCC1otVqTHaFhX-mas2ecoFVt4XZurdYTqEc_dDqHRYBe2q1mCOAAfM343YCjuGy"
                }}
            />
        )
    }

    const startWork = () => {


    }
    const copyToClipboard = (e) => {
        navigator.clipboard.writeText(`${process.env.REACT_APP_BASE_DOMAIN}/${serviceDetails && serviceDetails.serviceOrderId}`)
        alert('Copied')
    };

    const onChangeText = (event) => {
        if (event.target.name === 'other-reasons') {
            setOtherReasons(event.target.value)
        }
        var option = event.target.value
        var link = `https://wa.me/918129123104?text=${option.replaceAll(' ', '%20')}`
        setHref(link)
    }
    const shareDigitalId = () => {
        try {
            if (navigator.share) {
                navigator.share({
                    title: 'Digital Id',
                    url: `${process.env.REACT_APP_BASE_DOMAIN}/provider/digitalid/${serviceDetails && serviceDetails.serviceOrderId}`
                }).then(() => {

                })
                    .catch(console.error);
            }
        } catch (err) {
            alert(err)
        }

    }

    const toggle = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab)
        }
    }

    return (
        <React.Fragment>
            <div style={{ marginRight: '1%' }}>
                <Nav pills className="nav-justified profile-tabs vertipadd">
                    <NavItem>
                        <NavLink
                            className={classnames({ active: activeTab === 'timelineTab' }) + ""}
                            onClick={() => { toggle('timelineTab'); }}
                        >
                            <div className="text-center pt-1 pb-1">
                                <p style={{ color: activeTab === 'timelineTab' && '#fff' }} className="bold font16 title font-weight-normal mb-0">TIMELINE</p>
                            </div>
                        </NavLink>
                    </NavItem>
                    {metadata && metadata[3].completedTasks && metadata[3].completedTasks.filter(x => x.approved || x.disputed).length > 0 &&
                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === 'historyTab' }) + ""}
                                onClick={() => { toggle('historyTab'); }}
                            >
                                <div className="text-center pt-1 pb-1">
                                    <p style={{ color: activeTab === 'historyTab' && '#fff' }} className="bold font16 title font-weight-normal mb-0">HISTORY</p>
                                </div>
                            </NavLink>
                        </NavItem>}
                </Nav>
                <TabContent activeTab={activeTab} className="user-timeline">
                    <TabPane tabId='timelineTab' className="p-3">
                        <Accordion className="isactive" expanded={metadata && metadata[0].isActiveForUser === false ? false : panel0} onChange={handleChange(0)}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <div className="forimage">
                                    <Typography className={classes.heading}> <img src={completed} />CREATION</Typography>
                                </div>
                            </AccordionSummary>

                            <AccordionDetails>
                                <Row>
                                    <Col xs="12">
                                        <span style={{ fontSize: 14, fontWeight: 600 }}>Accepted On: {metadata && metadata[0].createdOn ? moment(metadata && metadata[0].createdOn).format('LL') : ''}</span>
                                    </Col>
                                    <Col xs="12">
                                        <span style={{ fontSize: 13, fontWeight: 600 }}>Services Supported:</span>
                                    </Col>
                                    <Col xs="12">
                                        <p className="font-title" style={{ fontSize: 13, marginBottom: 0 }}>{serviceDetails.supportDescription ? serviceDetails.supportDescription : ''}</p>
                                    </Col>
                                    <Col xs="12">
                                        <span style={{ fontSize: 13, fontWeight: 600 }}>Service Details:</span>
                                    </Col>
                                    <Col xs="12">
                                        <p className="font-title" style={{ fontSize: 13, marginBottom: 0 }}>{serviceDetails.briefDescription ? serviceDetails.briefDescription : ''}</p>
                                    </Col>
                                    <Col xs="12">
                                        <span style={{ fontSize: 13, fontWeight: 600 }}>Contact Number: {serviceDetails && serviceDetails.tblUserByProviderId && serviceDetails.tblUserByProviderId.countryCode && serviceDetails.tblUserByProviderId.countryCode} {serviceDetails && serviceDetails.tblUserByProviderId && serviceDetails.tblUserByProviderId.phoneNumber ? serviceDetails.tblUserByProviderId.phoneNumber : ''}</span>
                                    </Col>
                                    {/* <Col xs="12">
                                    <span style={{ fontSize: 13, fontWeight: 600 }}>Service will be provided on: {myRequestDetails.serviceNeedsOn && moment(myRequestDetails.serviceNeedsOn).format('LL')}</span>
                                </Col> */}
                                    <Col xs="1"></Col>
                                    <Col xs="11">
                                        <br />
                                        {
                                            serviceDetails && (
                                                <table className="table order-table">
                                                    <tr className="no-border">
                                                        <td>Provider Fee</td>
                                                        <th>{serviceDetails.currnecyType} {parseFloat((serviceDetails.monthlyFee + serviceDetails.yocoServiceCharge) / serviceDetails.currencyRate).toFixed(2)}</th>

                                                    </tr>
                                                    <tr className="no-border">
                                                        <td>Per Visit Charge</td>
                                                        <th>{serviceDetails.currnecyType} {parseFloat(serviceDetails.perVisitCharge / serviceDetails.currencyRate).toFixed(2)}</th>

                                                    </tr>
                                                </table>
                                            )
                                        }

                                    </Col>
                                </Row>


                            </AccordionDetails>


                        </Accordion>
                        <Accordion className={metadata && metadata[1].status === 'STARTED' ? "isactive" : ""} expanded={metadata && metadata[1].isActiveForUser === false ? false : panel1} onChange={handleChange(1)} >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2a-content"
                                id="panel2a-header"
                            ><div className="forimage">
                                    <Typography className={classes.heading}>  <img src={metadata && metadata[1].status === 'STARTED' ? completed : inprogress} />INITIATION</Typography>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    <Col xs="12">
                                        <span style={{ fontSize: 14, fontWeight: 600 }}>Updated On: {metadata && metadata[1].updatedOn ? moment(metadata && metadata[1].updatedOn).format('LL') : ''}</span>
                                    </Col>
                                    {serviceDetails && serviceDetails.supportDescription === 'Fundamentals' ?
                                        <div>
                                            <Col xs="12">
                                                <table className="table">
                                                    <tr className="no-border">
                                                        <td xs="8" style={{ fontSize: 13 }}>Service provider has the contact of the end-user.</td>
                                                        <th><img src={metadata && metadata[1].box1 === true ? checkGreen : checkGray2} style={{ width: 20, height: 20 }} /></th>
                                                    </tr>
                                                    <tr className="no-border">
                                                        <td xs="8" style={{ fontSize: 13 }}>Service provider will call the end-user at least once a week to check on them.</td>
                                                        <th><img src={metadata && metadata[1].box2 === true ? checkGreen : checkGray2} style={{ width: 20, height: 20 }} /></th>
                                                    </tr>
                                                    <tr className="no-border">
                                                        <td xs="8" style={{ fontSize: 13 }}>Service provider will visit the end-user, if required, based on their convenience.</td>
                                                        <th><img src={metadata && metadata[1].box3 === true ? checkGreen : checkGray2} style={{ width: 20, height: 20 }} /></th>
                                                    </tr>
                                                </table>
                                            </Col>
                                        </div>
                                        :
                                        serviceDetails && serviceDetails.supportDescription === 'Weekly Vitals' ?
                                            <div>
                                                <Col xs="12">
                                                    <table className="table">
                                                        <tr className="no-border">
                                                            <td xs="8" style={{ fontSize: 13 }}>Service provider has the contact of the end-user.</td>
                                                            <th><img src={metadata && metadata[1].box1 === true ? checkGreen : checkGray2} style={{ width: 20, height: 20 }} /></th>
                                                        </tr>
                                                        <tr className="no-border">
                                                            <td xs="8" style={{ fontSize: 13 }}>Service provider will visit the end-user weekly to check their vitals.</td>
                                                            <th><img src={metadata && metadata[1].box2 === true ? checkGreen : checkGray2} style={{ width: 20, height: 20 }} /></th>
                                                        </tr>
                                                        <tr className="no-border">
                                                            <td xs="8" style={{ fontSize: 13 }}>Service provider will make the results available to the main user as well as the end-user.</td>
                                                            <th><img src={metadata && metadata[1].box3 === true ? checkGreen : checkGray2} style={{ width: 20, height: 20 }} /></th>
                                                        </tr>
                                                    </table>
                                                </Col>
                                            </div>
                                            :
                                            serviceDetails && serviceDetails.supportDescription === 'Monthly Testing' ?
                                                <div>
                                                    <Col xs="12">
                                                        <table className="table">
                                                            <tr className="no-border">
                                                                <td xs="8" style={{ fontSize: 13 }}>Service provider has the contact of the end-user.</td>
                                                                <th><img src={metadata && metadata[1].box1 === true ? checkGreen : checkGray2} style={{ width: 20, height: 20 }} /></th>
                                                            </tr>
                                                            <tr className="no-border">
                                                                <td xs="8" style={{ fontSize: 13 }}>Service provider will call the end-user at least once a week to check on them.</td>
                                                                <th><img src={metadata && metadata[1].box2 === true ? checkGreen : checkGray2} style={{ width: 20, height: 20 }} /></th>
                                                            </tr>
                                                            <tr className="no-border">
                                                                <td xs="8" style={{ fontSize: 13 }}>Service provider will visit the end-user on a monthly basis for any lab tests required.</td>
                                                                <th><img src={metadata && metadata[1].box3 === true ? checkGreen : checkGray2} style={{ width: 20, height: 20 }} /></th>
                                                            </tr>
                                                        </table>
                                                    </Col>
                                                </div>
                                                :
                                                serviceDetails && serviceDetails.supportDescription === 'Post Hospitalization Care' ?
                                                    <div>
                                                        <Col xs="12">
                                                            <table className="table">
                                                                <tr className="no-border">
                                                                    <td xs="8" style={{ fontSize: 13 }}>Service provider has the contact of the end-user.</td>
                                                                    <th><img src={metadata && metadata[1].box1 === true ? checkGreen : checkGray2} style={{ width: 20, height: 20 }} /></th>
                                                                </tr>
                                                                <tr className="no-border">
                                                                    <td xs="8" style={{ fontSize: 13 }}>Service provider will call the end-user immediately and find out what is needed.</td>
                                                                    <th><img src={metadata && metadata[1].box2 === true ? checkGreen : checkGray2} style={{ width: 20, height: 20 }} /></th>
                                                                </tr>
                                                                <tr className="no-border">
                                                                    <td xs="8" style={{ fontSize: 13 }}>Service provider will take care of any requirements the end-user may have in connection with a post-hospitalization routine.</td>
                                                                    <th><img src={metadata && metadata[1].box3 === true ? checkGreen : checkGray2} style={{ width: 20, height: 20 }} /></th>
                                                                </tr>
                                                            </table>
                                                        </Col>
                                                    </div>
                                                    :
                                                    serviceDetails && serviceDetails.supportDescription === 'Weekly Companion' ?
                                                        <div>
                                                            <Col xs="12">
                                                                <table className="table">
                                                                    <tr className="no-border">
                                                                        <td xs="8" style={{ fontSize: 13 }}>Service provider has the contact of the end-user.</td>
                                                                        <th><img src={metadata && metadata[1].box1 === true ? checkGreen : checkGray2} style={{ width: 20, height: 20 }} /></th>
                                                                    </tr>
                                                                    <tr className="no-border">
                                                                        <td xs="8" style={{ fontSize: 13 }}>Service provider will call the end-user right away and establish a connection.</td>
                                                                        <th><img src={metadata && metadata[1].box2 === true ? checkGreen : checkGray2} style={{ width: 20, height: 20 }} /></th>
                                                                    </tr>
                                                                    <tr className="no-border">
                                                                        <td xs="8" style={{ fontSize: 13 }}>Service provider will visit the end-user every week and be a companion for them.</td>
                                                                        <th><img src={metadata && metadata[1].box3 === true ? checkGreen : checkGray2} style={{ width: 20, height: 20 }} /></th>
                                                                    </tr>
                                                                </table>
                                                            </Col>
                                                        </div>
                                                        :
                                                        serviceDetails && serviceDetails.supportDescription === 'Daily Essentials' ?
                                                            <div>
                                                                <Col xs="12">
                                                                    <table className="table">
                                                                        <tr className="no-border">
                                                                            <td xs="8" style={{ fontSize: 13 }}>Service provider has the contact of the end-user.</td>
                                                                            <th><img src={metadata && metadata[1].box1 === true ? checkGreen : checkGray2} style={{ width: 20, height: 20 }} /></th>
                                                                        </tr>
                                                                        <tr className="no-border">
                                                                            <td xs="8" style={{ fontSize: 13 }}>Service provider will call the end-user right away and establish a connection.</td>
                                                                            <th><img src={metadata && metadata[1].box2 === true ? checkGreen : checkGray2} style={{ width: 20, height: 20 }} /></th>
                                                                        </tr>
                                                                        <tr className="no-border">
                                                                            <td xs="8" style={{ fontSize: 13 }}>Service provider will ensure that all essentials – food and medicine – are well stocked at the end-user's house, at all times.</td>
                                                                            <th><img src={metadata && metadata[1].box3 === true ? checkGreen : checkGray2} style={{ width: 20, height: 20 }} /></th>
                                                                        </tr>
                                                                    </table>
                                                                </Col>
                                                            </div>
                                                            :
                                                            serviceDetails && serviceDetails.supportDescription === 'Customized Option' ?
                                                                <div>
                                                                    <Col xs="12">
                                                                        <table className="table">
                                                                            <tr className="no-border">
                                                                                <td xs="8" style={{ fontSize: 13 }}>Service provider has the contact of the end-user.</td>
                                                                                <th><img src={metadata && metadata[1].box1 === true ? checkGreen : checkGray2} style={{ width: 20, height: 20 }} /></th>
                                                                            </tr>
                                                                            <tr className="no-border">
                                                                                <td xs="8" style={{ fontSize: 13 }}>Service provider will call the end-user right away and establish a connection.</td>
                                                                                <th><img src={metadata && metadata[1].box2 === true ? checkGreen : checkGray2} style={{ width: 20, height: 20 }} /></th>
                                                                            </tr>
                                                                            <tr className="no-border">
                                                                                <td xs="8" style={{ fontSize: 13 }}>Service provider will ensure that the end-user's requirements are met – whether it is calls or visits that are needed from them.</td>
                                                                                <th><img src={metadata && metadata[1].box3 === true ? checkGreen : checkGray2} style={{ width: 20, height: 20 }} /></th>
                                                                            </tr>
                                                                        </table>
                                                                    </Col>
                                                                </div>
                                                                :
                                                                <></>
                                    }
                                    <Col xs="12">
                                        {
                                            metadata && metadata[1].status === 'STARTED' ? (
                                                <span className="green-label">Work Started</span>
                                            ) : <span className="gray-label">Pending</span>
                                        }

                                    </Col>
                                </Typography>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion className={metadata && metadata[2].status === 'COMPLETED' ? "isactive" : ""} expanded={metadata && metadata[2].isActiveForUser === false ? false : panel2} onChange={handleChange(2)}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2a-content"
                                id="panel2a-header"
                            >
                                <div className="forimage">
                                    <Typography className={classes.heading}>  <img src={metadata && metadata[2].status === 'COMPLETED' ? completed : inprogress} />UPDATION</Typography>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    {
                                        metadata && metadata[2].updatedOn !== '' &&
                                        <Col xs="12">
                                            <span style={{ fontSize: 14 }}><b>Updated On:</b> {metadata && metadata[2].updatedOn ? moment(metadata && metadata[2].updatedOn).format('LL') : ''}</span>
                                        </Col>
                                    }
                                    <Col xs="12">
                                        <Row>
                                            {
                                                metadata && metadata[2].providerTasks && metadata[2].providerTasks.map((task, index) =>
                                                    !task.taskFinished &&
                                                    <div xs="4" className="care-tasks">
                                                        <div className="care-tasks-thumbnail" style={{ backgroundColor: task.taskStarted ? ' #5e2490' : '#d3d3d3' }}>
                                                            <p style={{ textAlign: 'center', alignSelf: 'center', fontSize: 30, color: '#fff' }}>Visit {index + 1}</p>
                                                        </div>
                                                        <Col>
                                                            <span style={{ fontSize: 12, fontWeight: 600 }}>Date Started: </span>
                                                        </Col>
                                                        <Col>
                                                            <span className="font-title">{task.startDate ? moment(task.startDate).format('LL') : ''}</span>
                                                        </Col>
                                                        <Col style={{ paddingTop: 10 }}>
                                                            {
                                                                <span className="orange-label">In Progress</span>
                                                            }
                                                        </Col>
                                                    </div>
                                                )
                                            }
                                            {
                                                metadata && metadata[2].providerTasks && metadata[2].providerTasks.filter(x => !x.taskFinished).length === 0 &&
                                                <Row style={{ marginLeft: 0 }}>
                                                    <Col xs="12" style={{ paddingTop: 10, paddingBottom: 10 }}>
                                                        {
                                                            <span style={{ fontSize: 14 }}><b>Visit {metadata[2].providerTasks.length}:</b> Completed</span>
                                                        }
                                                    </Col>
                                                    <Col xs="12">
                                                        {
                                                            metadata && metadata[2].nextVisitDate !== '' && (
                                                                <span style={{ fontSize: 14 }}><b>Next Visit Date:</b> {moment(metadata && metadata[2].nextVisitDate).format('LL')}</span>
                                                            )
                                                        }
                                                    </Col>
                                                </Row>
                                            }
                                        </Row>
                                    </Col>
                                </Typography>
                            </AccordionDetails>
                        </Accordion>


                        <Accordion className={metadata && metadata[3].status === 'COMPLETED' ? "isactive" : ""} expanded={metadata && metadata[3].isActiveForUser === false ? false : panel3} onChange={handleChange(3)}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2a-content"
                                id="panel2a-header"
                            >
                                <div className="forimage">
                                    <Typography className={classes.heading}>  <img src={metadata && metadata[3].status === 'APPROVED' ? completed : verify} />APPROVAL</Typography>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    {
                                        metadata && metadata[3].updatedOn !== '' && (
                                            <Col xs="12">
                                                <span style={{ fontSize: 14 }}><b>Updated On:</b>  {moment(metadata && metadata[3].updatedOn).format('LL')}</span>
                                            </Col>
                                        )
                                    }
                                    {
                                        metadata && metadata[3].completedTasks && metadata[3].completedTasks.length > 0 && !metadata[3].completedTasks[metadata[3].completedTasks.length - 1].approved && !metadata[3].completedTasks[metadata[3].completedTasks.length - 1].disputed ?
                                            <Col xs="12">
                                                <span style={{ fontSize: 14, fontWeight: 600 }}>Approve visits to initiate payment to the provider.</span>
                                            </Col>
                                            :
                                            metadata && metadata[3].completedTasks && metadata[3].completedTasks.length > 0 &&
                                            <Col xs="12" style={{ paddingTop: 10, paddingBottom: 10 }}>
                                                <span style={{ fontSize: 14 }}><b>Visit {metadata[3].completedTasks.length}:</b> {metadata[3].completedTasks[metadata[3].completedTasks.length - 1].approved ? 'Approved' : 'Disputed'}</span>
                                            </Col>
                                    }

                                    <Col xs="12">
                                        <Row>
                                            {
                                                metadata && metadata[3].completedTasks && metadata[3].completedTasks.length > 0 && !metadata[3].completedTasks[metadata[3].completedTasks.length - 1].approved && !metadata[3].completedTasks[metadata[3].completedTasks.length - 1].disputed ?
                                                    <div xs="4" className="care-tasks">
                                                        <div className="care-tasks-thumbnail" style={{ backgroundColor: ' #5e2490', marginBottom: 10 }}>
                                                            <p style={{ textAlign: 'center', alignSelf: 'center', fontSize: 30, color: '#fff' }}>Visit {metadata[3].completedTasks.length}</p>
                                                        </div>
                                                        {metadata[3].completedTasks[metadata[3].completedTasks.length - 1].userComments !== '' &&
                                                            <div>
                                                                <Col>
                                                                    <span style={{ fontSize: 12, fontWeight: 600 }}>Your comments: </span>
                                                                </Col>
                                                                <Col>
                                                                    <span className="font-title">{metadata[3].completedTasks[metadata[3].completedTasks.length - 1].userComments}</span>
                                                                </Col>
                                                            </div>}
                                                        <Col>
                                                            <span style={{ fontSize: 12, fontWeight: 600 }}>Comments from provider: </span>
                                                        </Col>
                                                        <Col>
                                                            <span className="font-title">{metadata[2].providerTasks[metadata[3].completedTasks.length - 1].providerComments}</span>
                                                        </Col>
                                                        <Col>
                                                            <span style={{ fontSize: 12, fontWeight: 600 }}>Additional amount to be paid: </span>
                                                        </Col>
                                                        <Col>
                                                            <span className="font-title">{metadata[2].providerTasks[metadata[3].completedTasks.length - 1].additionalExpenses}</span>
                                                        </Col>
                                                        <Col>
                                                            <span style={{ fontSize: 12, fontWeight: 600 }}>Bills: </span>
                                                        </Col>
                                                        {
                                                            billsImageArray && billsImageArray[metadata[3].completedTasks.length - 1] && billsImageArray[metadata[3].completedTasks.length - 1].length > 0 &&
                                                            <Col>
                                                                <span className="font-title"></span>
                                                            </Col>
                                                        }
                                                        <div className={imgClass.root}>
                                                            <GridList className={imgClass.gridList} cols={2.5}>
                                                                {!_.isEmpty(billsImageArray) && !_.isEmpty(billsImageArray[metadata[3].completedTasks.length - 1]) &&
                                                                    billsImageArray[metadata[3].completedTasks.length - 1].map((data, index) =>
                                                                        <GridListTile key={index}>
                                                                            <BillImage src={`${assetsBaseUrl}/${data}`} alt={"Bill"} onClick={() => {
                                                                                setPopupImageUrl(data);
                                                                                setImagePopUpModal(true);
                                                                            }} />

                                                                            <GridListTileBar
                                                                                title={"Bill"}
                                                                                classes={{
                                                                                    root: imgClass.titleBar,
                                                                                    title: imgClass.title,
                                                                                }}

                                                                            />
                                                                        </GridListTile>
                                                                    )
                                                                }

                                                            </GridList>
                                                        </div>

                                                        <Col style={{ paddingTop: 10 }}>
                                                            {
                                                                metadata[3].completedTasks[metadata[3].completedTasks.length - 1].approved ? (
                                                                    <Col cs="12" style={{ marginLeft: -15 }}>
                                                                        <span className="green-label">Approved</span>

                                                                    </Col>
                                                                ) : metadata[3].completedTasks[metadata[3].completedTasks.length - 1].disputed ? (
                                                                    <Col cs="12">
                                                                        <span className="red-label">Disputed</span>
                                                                    </Col>
                                                                ) : <React.Fragment>
                                                                            <Row>
                                                                                <Col xs="6">

                                                                                    <Button onClick={() => approve('Approved', metadata[3].completedTasks.length - 1)} className="post-request purple-label">
                                                                                        Approve
                                                                            </Button>

                                                                                </Col>

                                                                                <Col xs="6">
                                                                                    <Button onClick={() => approve('Disputed', metadata[3].completedTasks.length - 1)} className="post-request red-label">Dispute</Button>
                                                                                </Col>
                                                                            </Row>
                                                                        </React.Fragment>
                                                            }
                                                        </Col>
                                                    </div>
                                                    :
                                                    <Col xs="12">
                                                        <span style={{ fontSize: 14 }}>For more details about the previous visits, please check the <b>'History'</b> tab.</span>
                                                    </Col>
                                            }
                                        </Row>
                                    </Col>
                                    {/* <Col>
                                    <span style={{ fontSize: 12, fontWeight: 600 }}>YOU WILL RECEIVE THE INVOICE FOR ADDITIONAL EXPENSES, IF ANY, BY: {moment(billingDate).format('LL')}</span>
                                </Col> */}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <div style={{ justifyContent: 'flex-end', marginTop: '5%' }}>

                            <p onClick={() => setIssueReported(true)} className="report-issue">
                                Report an Issue
                        </p>
                        </div>
                        <Modal isOpen={isModalVisible}>
                            <ModalBody>
                                <div className="digital-modal">
                                    <img src={`${serviceDetails && serviceDetails.tblUserByProviderId && serviceDetails.tblUserByProviderId.avatarUrl !== '' ? `${process.env.REACT_APP_ASSETS_BASE_URL}/Users/${serviceDetails.tblUserByProviderId && serviceDetails.providerId}/Avatar/${serviceDetails.tblUserByProviderId.avatarUrl}` : user}`} style={{ width: 200, height: 200, marginBottom: 15, borderRadius: 10 }} />
                                    {/* <SpiffyOnAvatar className={"spiffy-big"} spiffyStrength={serviceDetails && serviceDetails.tblUserByProviderId && serviceDetails.tblUserByProviderId.spiffy[0]} /> */}
                                    <SpiffyOnAvatar className={"spiffy-big"} spiffyStrength={!_.isEmpty(serviceDetails && serviceDetails.tblUserByProviderId && serviceDetails.tblUserByProviderId.spiffy) && serviceDetails.tblUserByProviderId.spiffy[0]} />

                                    {/* <img className="spiffy-big" src={imgSpiffy5}/> */}
                                    <p style={{ fontSize: 20, marginBottom: 0, }}>{serviceDetails.tblUserByProviderId && serviceDetails.tblUserByProviderId.fullname}</p>

                                    <p style={{ fontSize: 50, color: '#861b8d', fontWeight: 'bold', marginBottom: 0 }}>{orderDetails && orderDetails.digitalIdCode}</p>
                                    <p className="font-title">Order Digital Code</p>
                                    <br /><br />
                                    <hr />
                                    <Row>
                                        <Col xs="2">
                                            <ShareIcon onClick={() => shareDigitalId()} style={{ width: 30 }} />
                                        </Col>
                                        <Col xs="6">
                                            <p className= "bold" onClick={() => shareDigitalId()}>
                                                SHARE DIGITAL ID TO YOUR SERVICE LOCATION
                                        </p>
                                            {/* <Button style={{ backgroundColor: '#890c67' }} onClick={() => copyToClipboard()}>Copy DigitalId Url</Button> */}

                                        </Col>
                                        <Col xs="2">
                                            <CancelIcon onClick={() => setIsModalVisible(false)} />
                                        </Col>
                                        <Col xs="2">
                                            <p className="bold" onClick={() => setIsModalVisible(false)}>Close</p>
                                        </Col>
                                    </Row>
                                </div>
                            </ModalBody>
                        </Modal>
                        <Modal isOpen={isDisputeModalVisible} style={{ marginTop: 70 }} >
                            <ModalBody>
                                <p className="text-center font16 bold">Are you sure you want to dispute the order?</p>
                                <br /><br />
                                <Row>
                                    <Col xs="6">
                                        <Button onClick={() => approve('Disputed')} className="post-request red-label">Dispute</Button>
                                    </Col>

                                    <Col xs="6">
                                        <Button onClick={() => toggleDisputeModal(false)} className="post-request gray-label">Cancel</Button>
                                    </Col>
                                </Row>
                            </ModalBody>
                        </Modal>
                        <Modal isOpen={isApproveModalVisible} style={{ marginTop: 70 }}>
                            {!_.isEmpty(claimAmount) && claimAmount.claimAmountInProviderCurrency > 0 ?
                                <ModalBody>
                                    <p className="bold font16 text-center">Pay and confirm your order</p>
                                    <br /><br />
                                    <Row>
                                        <Col xs="12">
                                            {render_paypalButton()}
                                            <Button onClick={() => toggleApproveModal(false)} className="post-request gray-label">Cancel</Button>
                                        </Col>
                                    </Row>
                                </ModalBody>
                                :
                                <ModalBody>
                                    <p className="bold font16 text-center">Are you sure</p>
                                    <br /><br />
                                    <Row>
                                        <Col xs="6">
                                            <Button onClick={() => approve('Approved')} className="post-request purple-label">Approve</Button>
                                        </Col>

                                        <Col xs="6">
                                            <Button onClick={() => toggleApproveModal(false)} className="post-request gray-label">Cancel</Button>
                                        </Col>
                                    </Row>
                                </ModalBody>
                            }

                        </Modal>
                        <Modal isOpen={isDisputed} style={{ marginTop: 70 }}>
                            <ModalHeader>
                                <p className="bold purple-text" style={{ fontSize: 18 }}>
                                    Dispute Submitted!
                            </p>
                            </ModalHeader>
                            <ModalBody>
                                <p style={{fontSize:16, fontWeight: "bold"}}>Sorry for the inconvenience! We will be in touch with you to resolve this soon.</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button onClick={() => toggleDispute(false)} className="post-request gray-label">Close</Button>
                            </ModalFooter>
                        </Modal>

                        <Modal isOpen={isIssueReported} role='dialog' ceneterd={true} style={{ marginTop: 100, marginBottom: 100 }}>
                            <ModalHeader>
                                <p className="bold purple-text" style={{ fontSize: 18 }}>
                                    Report an Issue
                            </p>
                            </ModalHeader>
                            <ModalBody >

                                <p style={{fontSize:16, fontWeight: "bold"}}>Please let us know the details of the issue you want to report</p>
                                <Dropdown
                                    fluid
                                    placeholder='Select'
                                    clearable options={reasonsForIssue}
                                    selection
                                    Input
                                    onChange={handledrpdwnChange} />
                                {
                                    selectedOption === 'Other reasons' &&
                                    <div style={{ padding: '2%', width: '100%' }}>
                                        <p style={{fontSize:14}}>Please let us know the reasons here:</p>
                                        <textarea style={{ width: '80%', padding: '2%' }} name='other-reasons' id='other-reasons' rows='3' value={otherReasons} type="text" onChange={onChangeText}></textarea>
                                    </div>
                                }
                            </ModalBody>
                            <ModalFooter>
                                <Row style={{ width: "100%" }}>
                                    <Col style={{ float: 'left' }}>
                                        <Button onClick={() => { setIssueReported(false); setSelectedOption('') }} style={{ width: '100%' }} className="btn btn-secondary" >
                                            Close
                                    </Button>
                                    </Col>
                                    <Col style={{ float: 'right' }}>
                                        <Button onClick={() => { setSelectedOption(''); setOtherReasons('') }} style={{ width: '100%' }} className="btn btn-primary" >
                                            <a onClick={() => setIssueReported(false)} href={href} target='_blank' style={{ color: '#fff' }}>Submit</a>
                                        </Button>
                                    </Col>

                                </Row>
                            </ModalFooter>
                        </Modal>

                        <Modal isOpen={isEnded} role='dialog' ceneterd={true} style={{ marginTop: 100, marginBottom: 100 }}>
                            <ModalHeader>
                                <p className="bold purple-text" style={{ fontSize: 18 }}>
                                    End Subscription
                            </p>
                            </ModalHeader>
                            <ModalBody >

                                <h4>Please let us know why you want to end this subscription</h4>
                                <Dropdown
                                    fluid
                                    placeholder='Select'
                                    clearable options={reasonToEndSub}
                                    selection
                                    Input
                                    onChange={handledrpdwnChange} />
                                {
                                    selectedOption === 'Other reasons' &&
                                    <div style={{ padding: '2%', width: '100%' }}>
                                        <h5>Please let us know the reasons here:</h5>
                                        <textarea style={{ width: '80%', padding: '2%' }} name='other-reasons' id='other-reasons' rows='3' value={otherReasons} type="text" onChange={onChangeText}></textarea>
                                    </div>
                                }
                            </ModalBody>
                            <ModalFooter>
                                <Row style={{ width: "100%" }}>
                                    <Col style={{ float: 'left' }}>
                                        <Button onClick={() => { toggleEnded(false); setSelectedOption('') }} className="close-button purple-button" >
                                            Close
                                    </Button>
                                    </Col>
                                    <Col style={{ float: 'right' }}>
                                        <Button onClick={() => { toggleEnded(false); setSelectedOption('') }} className="close-button purple-button" >
                                            Submit
                                    </Button></Col>

                                </Row>
                            </ModalFooter>
                        </Modal>


                        <Modal isOpen={imagePopUpModal} style={{ marginTop: 70 }}>
                            <ModalBody>
                                <ModelImage src={`${assetsBaseUrl}/${popupImageUrl}`} />
                                <Button onClick={() => {
                                    setImagePopUpModal(false)
                                }} className="post-request gray-label">Close</Button>
                            </ModalBody>
                        </Modal>
                    </TabPane>
                    <TabPane tabId='historyTab' className="p-3">
                        {
                            alphadata && alphadata.history && alphadata.history.map((month, index) =>
                                <div>
                                    <Accordion className={month.isPaid ? "isactive" : ""} expanded={metadata && metadata[2].isActiveForProvider === false ? false : panel2} onChange={handleChange(2)}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel2a-content"
                                            id="panel2a-header"
                                        >
                                            <div className="forimage">
                                                <Typography className={classes.heading}> <img src={month.isPaid ? completed : inprogress} />MONTH {index + 1}</Typography>
                                            </div>
                                        </AccordionSummary>
                                        <AccordionDetails>

                                            <Typography>
                                                <Col xs="12">
                                                    <Row>
                                                        {
                                                            month.visit && month.visit.map((task, index) =>
                                                                <div xs="4" className="care-tasks">
                                                                    <div className="care-tasks-thumbnail" style={{ backgroundColor: '#5e2490' }}>
                                                                        <p style={{ textAlign: 'center', alignSelf: 'center', fontSize: 30, color: '#fff' }}>Visit {index + 1}</p>
                                                                    </div>

                                                                    <Col className="button-flex" style={{ paddingTop: 10 }}>
                                                                        <span style={{ fontSize: 12 }}><b>Completed On: </b>{moment(task.finishDate).format('LL')}</span>
                                                                    </Col>
                                                                    <Col className="button-flex" style={{ paddingTop: 10 }}>
                                                                        <span style={{ fontSize: 12 }}><b>Completion Comments: </b>{task.providerComments}</span>
                                                                    </Col>
                                                                    <Col className="button-flex" style={{ paddingTop: 10 }}>
                                                                        <span style={{ fontSize: 12 }}><b>Additional Expenses: </b>{task.currency} {task.additionalExpenses}</span>
                                                                    </Col>
                                                                    <Col className="button-flex" style={{ paddingTop: 10 }}>
                                                                        <span style={{ fontSize: 12 }}><b>Status: </b>{task.status}</span>
                                                                    </Col>
                                                                    <Col className="button-flex" style={{ paddingTop: 10 }}>
                                                                        <span style={{ fontSize: 12 }}><b>Bills: </b>{billsImageArray && billsImageArray[index] && billsImageArray[index].length > 0 ? '' : 'No Bills Uploaded'}</span>
                                                                        <div className={imgClass.root}>
                                                                            <GridList className={imgClass.gridList} cols={2.5}>
                                                                                {!_.isEmpty(billsImageArray) && !_.isEmpty(billsImageArray[index]) &&
                                                                                    billsImageArray[index].map((data, index) =>
                                                                                        <GridListTile key={index}>
                                                                                            <BillImage src={`${assetsBaseUrl}/${data}`} alt={"Bill"} onClick={() => {
                                                                                                setPopupImageUrl(data);
                                                                                                setImagePopUpModal(true);
                                                                                            }} />

                                                                                            <GridListTileBar
                                                                                                title={"Bill"}
                                                                                                classes={{
                                                                                                    root: imgClass.titleBar,
                                                                                                    title: imgClass.title,
                                                                                                }}

                                                                                            />
                                                                                        </GridListTile>
                                                                                    )
                                                                                }

                                                                            </GridList>
                                                                        </div>
                                                                    </Col>
                                                                    {
                                                                        localStorage.getItem('role') && localStorage.getItem('role').toString() === 'admin' && task.status === 'Disputed' ?
                                                                            <Col>
                                                                                <Button onClick={() => approveAdmin('Approved', metadata[3].completedTasks.length - 1)} className="post-request purple-label">
                                                                                    Approve
                                                                            </Button>
                                                                            </Col>
                                                                            :
                                                                            <></>
                                                                    }
                                                                </div>
                                                            )
                                                        }
                                                    </Row>
                                                </Col>
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                </div>
                            )}
                        <Modal isOpen={imagePopUpModal} style={{ marginTop: 70 }}>
                            <ModalBody>
                                <ModelImage src={`${assetsBaseUrl}/${popupImageUrl}`} />
                                <Button onClick={() => {
                                    setImagePopUpModal(false)
                                }} className="post-request gray-label">Close</Button>
                            </ModalBody>
                        </Modal>
                    </TabPane>
                </TabContent>
            </div >
        </React.Fragment>
    );
}