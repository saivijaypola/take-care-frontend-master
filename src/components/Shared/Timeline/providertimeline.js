import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router";
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
import SpiffyOnAvatar from "../../Shared/Spiffy/spiffyonavatar";
import inprogress from '../../../images/icon/clock-2.png'
import user from "../../../images/icon/user-6.png";
import firebase from "firebase"
import { generateDigitalId } from "../../../utils/helper";
import axios from "axios";
import _ from "lodash";

import {
    Container, Row, Col, Nav,
    NavItem,
    NavLink, TabContent,
    TabPane, Modal, Spinner, Input, Button, ModalBody
} from "reactstrap";
import { axiosPost } from '../../../handler/apiHandler';
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
        marginBottom: 0
    },
}));

export default function ProviderTimeLine(props) {

    const history = useHistory();


    const classes = useStyles();
    const { myRequestDetails, providerDetails } = props


    const [inProgressComment, setInPorgressComment] = useState('')
    const { serviceDetails, orderDetails, requestDetails } = props
    const [activePanel, setActivePanel] = useState('Default')
    const [chatId, setChatId] = useState(props.chatId)
    const [metadata, setMetadata] = useState('')
    const [isModalVisible, setIsModalVisible] = useState(false)

    const [workCompleteComments, setWorkCompleteComments] = useState('')
    const [chars_left, setCharsLeft] = useState(240)


    const [panel0, setPanel0] = useState(false)
    const [panel1, setPanel1] = useState(false)
    const [panel2, setPanel2] = useState(false)
    const [panel3, setPanel3] = useState(false)
    const [panel4, setPanel4] = useState(false)

    const [orderId, setOrderId] = useState('')

    const setInitialPanelVisiblity = (metadata) => {

        setPanel0(metadata && metadata[0].isActiveForProvider)
        setPanel1(metadata && metadata[1].isActiveForProvider)
        setPanel2(metadata && metadata[2].isActiveForProvider)
        setPanel3(metadata && metadata[3].isActiveForProvider)
        setPanel4(metadata && metadata[4].isActiveForProvider)
    }


    //Set Digital Id
    const [digitalId, setDigitalId] = useState('')

    useEffect(() => {

        if (chatId) {
            const metadataRef = firebase.database().ref(chatId + '/Metadata/timeline');
            metadataRef.on('value', snapshot => {
                const getMetadata = snapshot.val();

                setMetadata(getMetadata)
                setInitialPanelVisiblity(getMetadata)
            })

            const orderRef = firebase.database().ref(chatId + '/Metadata');
            orderRef.on('value', snapshot => {
                const getOrderData = snapshot.val();

                if (getOrderData) {
                    setOrderId(getOrderData.orderId)
                }
            }, [])
        }

    }, [])

    const copyToClipboard = (e) => {
        navigator.clipboard.writeText(`${process.env.REACT_APP_BASE_DOMAIN}/${serviceDetails && serviceDetails.serviceOrderId}`)
        alert('Copied')
    };
    const shareDigitalId = () => {

        try {
            if (navigator.share) {
                navigator.share({
                    title: 'Gigin',
                    url: `${process.env.REACT_APP_BASE_DOMAIN}/${serviceDetails && serviceDetails.serviceOrderId}`
                }).then(() => {

                })
                    .catch(console.error);
            }
        } catch (err) {
            alert(err)
        }

    }

    const handleChange = (panel) => (event, isExpanded) => {


        if (metadata[panel].isActiveForProvider == false) {

        } else {
            if (panel === 0) {
                setPanel0(isExpanded)
            } else if (panel === 1) {
                setPanel1(isExpanded)
            } else if (panel === 2) {
                setPanel2(isExpanded)
            } else if (panel === 3) {
                setPanel3(isExpanded)
            } else if (panel === 4) {
                setPanel4(isExpanded)
            }


            // alert(panelActivity[0])
        }

    };


    const updateOrderStatus = async (status) => {


        // Send Notification


        var dbParams = {

            orderId: orderId,
            status: status


        }
        const apiResponse = await axiosPost('order/status', dbParams);

        var amountPayableOnCompletion = parseFloat(serviceDetails && serviceDetails.orderTotalAmount) - parseFloat(serviceDetails && serviceDetails.advanceAmount)
        var notiAdvanceAmount = serviceDetails && serviceDetails.advanceAmount
        var countryCode = myRequestDetails && myRequestDetails.tblUserByUserId && myRequestDetails.tblUserByUserId.countryCode && myRequestDetails.tblUserByUserId.countryCode.substring(1)
        var phoneNumber = myRequestDetails && myRequestDetails.tblUserByUserId && myRequestDetails.tblUserByUserId.phoneNumber && myRequestDetails.tblUserByUserId.phoneNumber.substr(myRequestDetails.tblUserByUserId.phoneNumber.length - 10)
        var notifyParams = {
            "userName": myRequestDetails && myRequestDetails.tblUserByUserId && myRequestDetails.tblUserByUserId.fullname,
            "userEmail": myRequestDetails && myRequestDetails.tblUserByUserId && myRequestDetails.tblUserByUserId.email,
            "recepientId": myRequestDetails && myRequestDetails.tblUserByUserId && myRequestDetails.tblUserByUserId.userId,
            "phoneNumber": countryCode + "" + phoneNumber,
            "requestTitle": myRequestDetails && myRequestDetails.title,
            "providerName": serviceDetails && serviceDetails.tblUserByProviderId && serviceDetails.tblUserByProviderId.fullname,
            "providerEmail": serviceDetails && serviceDetails.tblUserByProviderId && serviceDetails.tblUserByProviderId.email,
            "payableCompletion": amountPayableOnCompletion,
            "orderTotal": serviceDetails && serviceDetails.orderTotalAmount,
            "status": status
        }

        var notifyStatus = axiosPost('workstatus/notify', notifyParams)

    }



    const startWork = () => {
        //console.log('MESSAGE', inProgressComment)

        // var amountPayableOnCompletion = parseFloat(serviceDetails && serviceDetails.orderTotalAmount) - parseFloat(serviceDetails && serviceDetails.advanceAmount)
        // var notiAdvanceAmount = serviceDetails && serviceDetails.advanceAmount
        // var notifyParams = {
        //     "userName": myRequestDetails && myRequestDetails.tblUserByUserId && myRequestDetails.tblUserByUserId.fullname,
        //     "userEmail": myRequestDetails && myRequestDetails.tblUserByUserId && myRequestDetails.tblUserByUserId.email,
        //     "requestTitle": myRequestDetails && myRequestDetails.title,
        //     "providerName": serviceDetails && serviceDetails.tblUserByProviderId && serviceDetails.tblUserByProviderId.fullname,
        //     "providerEmail": serviceDetails && serviceDetails.tblUserByProviderId && serviceDetails.tblUserByProviderId.email,
        //     "payableCompletion": amountPayableOnCompletion,
        //     "orderTotal": serviceDetails && serviceDetails.orderTotalAmount,
        //     "status": "Work Started"
        // }

        // var notifyStatus = axiosPost('workstatus/notify', notifyParams)
        // console.log('NOTIFY STATUS', notifyStatus)



        var timelineData = metadata

        //Hide Order Summary for User & Provider
        timelineData[0].isActiveForProvider = true

        //Enable InProgress for User & Hide for Provider

        timelineData[1].isActiveForProvider = true

        timelineData[0].isActiveForUser = true
        timelineData[1].isActiveForUser = true
        timelineData[2].isActiveForUser = true
        timelineData[2].isActiveForProvider = true


        //Update Provider comments in Progress
        timelineData[1].providerComments = inProgressComment


        timelineData[1].updatedOn = new Date()

        //Update the status to in progress in timeline
        timelineData[1].status = 'In Progress'


        timelineData[2].providerComments = workCompleteComments
        timelineData[1].isActiveForUser = true
        timelineData[2].isActiveForUser = true
        timelineData[2].isActiveForProvider = true
        timelineData[2].updatedOn = new Date().toDateString()
        timelineData[3].isActiveForProvider = true
        timelineData[2].isUserVerified = true


        setMetadata(timelineData)
        const metadataRef = firebase.database().ref(chatId + '/Metadata/timeline');

        metadataRef.update(timelineData)


        updateOrderStatus('Work Started')

        setPanel1(false)
    }

    const onChangeText = (event) => {
        setInPorgressComment(event.target.value)
    }

    const onChangeWorkCompleteComments = (event) => {
        setCharsLeft(240 - event.target.value.length)
        setWorkCompleteComments(event.target.value)
    }

    const updateVerificationId = () => {
        var digitalId = generateDigitalId()
        setDigitalId(digitalId)
        var timelineData = metadata
        timelineData[2].updatedOn = new Date()
        timelineData[2].digitalId = digitalId
        timelineData[2].isActiveForUser = true
        setMetadata(timelineData)
        const metadataRef = firebase.database().ref(chatId + '/Metadata/timeline');
        metadataRef.update(timelineData)
        setIsModalVisible(true)
    }

    const onWorkCompletion = () => {

            // var timelineData = metadata
            // timelineData[3].isActiveForUser = true
        // timelineData[3].providerComments = workCompleteComments
        // timelineData[3].updatedOn = new Date()
        // timelineData[4].isActiveForUser = true
        // timelineData[4].isActiveForProvider = false

        // setMetadata(timelineData)
        // const metadataRef = firebase.database().ref(chatId + '/Metadata/timeline');
        // metadataRef.update(timelineData)
        // updateOrderStatus('Work Completed')

        history.push(`/provider/update-order/${myRequestDetails && myRequestDetails.requestId}/${myRequestDetails && myRequestDetails.tblUserByUserId && myRequestDetails.tblUserByUserId.userId}`)
    }


    const verifyDifitalid = () => {

        var timelineData = metadata

        //Set provider Comments
        timelineData[2].providerComments = workCompleteComments
        timelineData[1].isActiveForUser = true
        timelineData[2].isActiveForUser = true
        timelineData[2].isActiveForProvider = true
        timelineData[2].updatedOn = new Date().toDateString()
        timelineData[3].isActiveForProvider = true
        timelineData[2].isUserVerified = true

        //Update the status to in progress in timeline
        // timelineData[3].status = 'Completed'

        setMetadata(timelineData)
        const metadataRef = firebase.database().ref(chatId + '/Metadata/timeline');
        setIsModalVisible(false)
        metadataRef.set(timelineData)
    }

    return (
        <div className={classes.root}>


            <Accordion className="isactive" expanded={metadata && metadata[0].isActiveForProvider === false ? false : panel0} onChange={handleChange(0)}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                ><div className="forimage">
                        <Typography className={classes.heading}> <img src={completed} />CREATION</Typography>
                    </div>
                </AccordionSummary>
                <AccordionDetails>
                    <Row>
                        <Col xs="12">
                            <p style={{ fontSize: 14, fontWeight: 600 }}>Accepted On: <span style={{color:"#6e6969"}}>{new Date(metadata && metadata[0].createdOn).toDateString()}</span></p>
                        </Col>
                        <Col xs="12">
                            <span style={{ fontSize: 14, fontWeight: "bold" }}>Provider Comments:</span>
                        </Col>
                        <Col xs="12">
                            <p className="font-title" style={{ fontSize: 13, marginBottom: 10, color:"#6e6969" }}>{serviceDetails.providerComments}</p>
                        </Col>
                        <Col xs="12">
                            <span style={{ fontSize: 14, fontWeight: "bold" }}>User Contact Details</span>
                        </Col>
                        <Col xs="12">
                            <p className="font-title" style={{ fontSize: 13, marginBottom: 0, marginTop: 0, color:"#6e6969", fontWeight:"bold" }}>Contact Name: {metadata && metadata[0].contactName}</p>
                            <p className="font-title" style={{ fontSize: 13, marginBottom: 0, marginTop: 0, color:"#6e6969", fontWeight:"bold" }}>Phone Number: {metadata && metadata[0].countryCode} {metadata && metadata[0].contactNumber}</p>
                            <p className="font-title" style={{ fontSize: 13, marginBottom: 0, marginTop: 0, color:"#6e6969", fontWeight:"bold" }}>Address: {metadata && metadata[0].contactAddress}</p>
                            </Col>
                        <Col xs="1"></Col>
                        <Col xs="11">
                            <br />
                            {
                                serviceDetails && (
                                    <table className="table order-table bold">
                                        <tr className="no-border">
                                            <td>Advance Amount</td>
                                            <th>Rs. {parseFloat(serviceDetails.advanceAmount).toFixed(2)}</th>

                                        </tr>
                                        <tr className="no-border">
                                            <td>Payable On Completion</td>
                                            <th>Rs. {parseFloat(serviceDetails.orderTotalAmount - serviceDetails.advanceAmount).toFixed(2)}</th>

                                        </tr>
                                        <tr>
                                            <td>Total Amount</td>
                                            <th style={{color:"#f19c00"}}>Rs. {parseFloat(serviceDetails.orderTotalAmount).toFixed(2)}</th>
                                        </tr>

                                    </table>
                                )
                            }

                        </Col>
                    </Row>


                </AccordionDetails>
            </Accordion>
            <Accordion className={metadata && metadata[1].updatedOn != "" ? "isactive" : ""} expanded={metadata && metadata[1].isActiveForProvider === false ? false : panel1} onChange={handleChange(1)} >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                >
                    <div className="forimage">
                        <Typography className={classes.heading}> <img src={metadata && metadata[1].updatedOn != "" ? completed : inprogress} />INITIATION</Typography>
                    </div>
                </AccordionSummary>
                <AccordionDetails>

                    <Typography>
                        <Row>
                            <Col xs="12">
                                {
                                    metadata && metadata[1].updatedOn !== '' && (
                                        <span style={{ fontSize: 14, fontWeight: 600 }}>Updated On: {new Date(metadata && metadata[1].updatedOn).toDateString()}</span>
                                    )
                                }
                            </Col>

                        </Row>
                        <Row>
                            {
                                metadata && metadata[1].updatedOn !== '' ? (
                                    <div>
                                        <Col xs="12">
                                            <span style={{ fontSize: 13, fontWeight: 600 }}>Provider Comments:</span>
                                        </Col>
                                        <Col xs="12">
                                            <p className="font-title" style={{ fontSize: 13, marginBottom: 0 }}>{metadata && metadata[1].providerComments}</p>
                                        </Col>
                                    </div>
                                ) :
                                    <div>
                                        <Col xs="12">
                                            <Input type="text" name="inprogress-comment" id="inprogress-comment" onChange={onChangeText} placeholder="Write your comments" className="order-comments"></Input>
                                            <span onClick={() => startWork()} className={"purple-label"}> Start Work</span>

                                        </Col>

                                    </div>
                            }
                            <Col xs="12">
                                {
                                    metadata && metadata[1].updatedOn !== '' && (
                                        <span className={"green-label"}>Work Started</span>

                                    )

                                }
                            </Col>

                        </Row>

                        {/* <span className={`${metadata && metadata[1].updatedOn != "" ? 'green-label' : 'gray-label'  }`}>{metadata && metadata[1].updatedOn != "" ? 'Work Pending' : 'Work Started'}</span> */}
                        {/* <span className="gray-label">Work Pending</span> */}
                        {/* <textarea rows="4" className="order-comments" type="text" name="inprogress-comment" id="inprogress-comment" onChange={onChangeWorkCompleteComments} maxLength="240" placeholder="Write your comments" className="order-comments"></textarea> */}
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion className={metadata && metadata[2].updatedOn != "" ? "isactive" : ""} expanded={metadata && metadata[2].isActiveForProvider === false ? false : panel2} onChange={handleChange(2)}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                >
                    <div className="forimage">
                        <Typography className={classes.heading}> <img src={metadata && metadata[2].updatedOn != "" ? completed : verify} />AUTHENTICATION</Typography>
                    </div>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>

                        {/* <textarea rows="4" className="order-comments" type="text" name="inprogress-comment" id="inprogress-comment" onChange={onChangeWorkCompleteComments} maxLength="240" placeholder="Write your comments" className="order-comments"></textarea>
                        <span>{chars_left} / 240 </span> */}
                        <Row>
                            {/* <Col xs="6">
                                <Button onClick={() => verifyDifitalid()} className="complete-work">Completed</Button>
                            </Col> */}
                            {/* <Col xs="12" style={{ marginBottom: 10 }}>
                                {
                                    metadata && !metadata[2].isProviderVerified ? (
                                        <span className={"gray-label"}>Not yet verified by user</span>

                                    ) :
                                        <span className={"green-label"}>Verified By User</span>
                                }
                            </Col> */}
                            {

                                <Col xs="6" style={{ marginLeft: 10 }}>
                                    <Button onClick={() => updateVerificationId()} className="view-digital">View Digital ID <img src={verify}></img></Button>
                                </Col>

                            }

                        </Row>
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion className={metadata && metadata[3].updatedOn != "" ? "isactive" : ""} expanded={metadata && metadata[3].isActiveForProvider === false ? false : panel3} onChange={handleChange(3)}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                >
                    <div className="forimage">
                        <Typography className={classes.heading}> <img src={metadata && metadata[3].updatedOn != "" ? completed : verify} />COMPLETION</Typography>
                    </div>
                </AccordionSummary>
                <AccordionDetails>

                    <Typography>
                        <Row>
                            <Col xs="12">
                                {
                                    metadata && metadata[3].updatedOn !== '' && (
                                        <span style={{ fontSize: 14, fontWeight: 600 }}>Updated On: {new Date(metadata && metadata[3].updatedOn).toDateString()}</span>
                                    )
                                }
                            </Col>
                        </Row>
                        <Row>
                            {
                                metadata && metadata[3].updatedOn !== '' ? (
                                    <div>
                                        <Col xs="12">
                                            <span style={{ fontSize: 13, fontWeight: 600 }}>Your Comments:</span>
                                        </Col>
                                        <Col xs="12">
                                            <p className="font-title" style={{ fontSize: 13, marginBottom: 0 }}>{metadata && metadata[3].providerComments}</p>
                                        </Col>
                                    </div>
                                ) :
                                    <div>
                                        <Col xs="12">
                                            {/* <Input type="text" name="completion-comment" id="completion-comment" onChange={(e) => setWorkCompleteComments(e.target.value)} placeholder="Write your comments" className="order-comments"></Input> */}
                                            <span onClick={() => onWorkCompletion()} className={"purple-label"}>Is Service Completed ?</span>

                                        </Col>

                                    </div>
                            }
                            <Col xs="12">
                                {
                                    metadata && metadata[3].updatedOn !== '' && (
                                        <span className={"green-label"}>Delivered</span>
                                    )
                                }
                                {/* <span onClick={() => onWorkCompletion()} className={"purple-label"}>Update status</span> */}
                            </Col>
                        </Row>
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion className={metadata && metadata[4].updatedOn != "" ? "isactive" : ""} expanded={metadata && metadata[4].isActiveForProvider === false ? false : panel4} onChange={handleChange(4)}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                >
                    <div className="forimage">
                        <Typography className={classes.heading}> <img src={metadata && metadata[4].updatedOn != "" ? completed : verify} />APPROVAL</Typography>
                    </div>
                </AccordionSummary>
                <AccordionDetails>

                    <Typography>
                        <Row>
                            <Col xs="12">
                                {
                                    metadata && metadata[4].updatedOn !== '' && (
                                        <span style={{ fontSize: 14, fontWeight: 600 }}>Updated On: {new Date(metadata && metadata[4].updatedOn).toDateString()}</span>
                                    )
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12">
                                {
                                    metadata && metadata[4].updatedOn !== '' && metadata && metadata[4].status === 'Approved' ? (
                                        <span className="green-label">Approved</span>
                                    ) : metadata && metadata[4].status === 'Disputed' ? (
                                        <span className="red-label">Disputed</span>
                                    ) : <span className="gray-label">Not yet Approved</span>
                                }
                            </Col>
                        </Row>
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Modal isOpen={isModalVisible}>
                <ModalBody>
                    <div className="digital-modal">
                        <img src={`${serviceDetails && serviceDetails.tblUserByProviderId && serviceDetails.tblUserByProviderId.avatarUrl !== '' ? `${process.env.REACT_APP_ASSETS_BASE_URL}/Users/${serviceDetails.tblUserByProviderId && serviceDetails.providerId}/Avatar/${serviceDetails.tblUserByProviderId.avatarUrl}` : user}`} style={{ width: 200, height: 200, marginBottom: 15, borderRadius: 10 }} />
                        <SpiffyOnAvatar className={"spiffy-big"} spiffyStrength={!_.isEmpty(serviceDetails.tblUserByProviderId.spiffy) && serviceDetails.tblUserByProviderId.spiffy[0]} />
                        {/* <img className="spiffy-big" src={imgSpiffy5}/> */}
                        <p style={{ fontSize: 20, marginBottom: 0, fontWeight:"bold" }}>{serviceDetails.tblUserByProviderId && serviceDetails.tblUserByProviderId.fullname}</p>

                        <p style={{ fontSize: 50, color: '#861b8d', fontWeight: 'bold', marginBottom: 0 }}>{orderDetails && orderDetails.digitalIdCode}</p>
                        <p className="font-title">Order Digital Code</p>
                        <br /><br />
                        <hr />
                        <Row>
                            {/* <Col xs="2">
                                <ShareIcon onClick={() => shareDigitalId()} style={{ width: 30 }} />
                            </Col>
                            <Col xs="6">
                                <h6 onClick={() => shareDigitalId()}>
                                    SHARE DIGITAL ID TO YOUR SERVICE LOCATION
                                </h6>


                            </Col> */}
                            <Col xs="2">
                                <CancelIcon onClick={() => setIsModalVisible(false)} />
                            </Col>
                            <Col xs="2">
                                <p onClick={() => setIsModalVisible(false)}><b>Close</b></p>
                            </Col>
                        </Row>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    );
}