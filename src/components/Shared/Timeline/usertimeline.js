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
import user from "../../../images/icon/user-6.png";
import SpiffyOnAvatar from "../../Shared/Spiffy/spiffyonavatar";
import DigitalId from '../../../pages/Provider/DigitalId';
import { useSelector } from 'react-redux'
import { BillImageWrapper, BillImage, ClaimAmountWrapper, ModelImage } from "./TimeLine.styled";
import _ from "lodash";



//Grid Style 
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { PayPalButton } from "react-paypal-button-v2";

import firebase from "firebase"

import axios from "axios";
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
    console.log("🚀 ~ file: usertimeline.js ~ line 78 ~ UserTimeLine ~ props", props)
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
    const [panel4, setPanel4] = useState(false)
    const [orderId, setOrderId] = useState('')
    const [workStatus, setWorkStatus] = useState('')
    const [workApprovalStatus, setWorkApprovalStatus] = useState('Pending-Completion')
    const orderClaimAmountDetails = useSelector(state => state.user.orderClaims)
    const [billsImageArray, setBillsImageArray] = useState([])
    const [claimAmount, setClaimAmount] = useState()
    const [imagePopUpModal, setImagePopUpModal] = useState(false)
    const [popupImageUrl, setPopupImageUrl] = useState('')


    const setInitialPanelVisiblity = (metadata) => {

        setPanel0(metadata && metadata[0].isActiveForUser)
        setPanel1(metadata && metadata[1].isActiveForUser)
        setPanel2(metadata && metadata[2].isActiveForUser)
        setPanel3(metadata && metadata[3].isActiveForUser)
        setPanel4(metadata && metadata[4].isActiveForUser)
    }

    useEffect(() => {

        if (chatId) {
            const metadataRef = firebase.database().ref(chatId + '/Metadata/timeline');
            metadataRef.on('value', snapshot => {
                const getMetadata = snapshot.val();
                if (getMetadata) {

                    setMetadata(getMetadata)
                    setInitialPanelVisiblity(getMetadata)
                }

            }, [])



            const orderRef = firebase.database().ref(chatId + '/Metadata');
            orderRef.on('value', snapshot => {
                const getOrderData = snapshot.val();

                if (getOrderData) {
                    setOrderId(getOrderData.orderId)
                }


            }, [])

        }


    }, [])

    useEffect(() => {
        console.log("🚀 ~ file: usertimeline.js ~ line 111 ~ useEffect ~ images")
        if (!_.isEmpty(metadata) && !_.isEmpty(metadata[3]) && metadata[3].updatedOn !== '' && !_.isNull(orderId)) {
            const orderRef = firebase.database().ref(`Orders/${orderId}`);
            orderRef.on('value', snapshot => {
                const images = snapshot.val();
                setBillsImageArray(images)
                console.log("🚀 ~ file: usertimeline.js ~ line 111 ~ useEffect ~ images", images)

            })

            //Call Claim Details
            props.getOrderClaimsByOrder({
                orderId: orderId
            });

        }

    }, [metadata])

    useEffect(() => {
        if (!_.isEmpty(orderClaimAmountDetails)) {
            const orderDetails = orderClaimAmountDetails.nodes;
            const sumOfClaimAmount = !_.isEmpty(orderDetails) && _.reduce(orderDetails, function (a, b) {
                return { claimAmountInProviderCurrency: a.claimAmountInProviderCurrency + b.claimAmountInProviderCurrency }
            })
            setClaimAmount(sumOfClaimAmount);
            console.log("🚀 ~ file: usertimeline.js ~ line 176 ~ sumOfClaimAmount ~ sumOfClaimAmount", sumOfClaimAmount)
            console.log("🚀 ~ file: usertimeline.js ~ line 173 ~ useEffect ~ orderDetails", orderDetails)

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
        // console.log(notifyParams)

        var dbParams = {
            orderId: orderId,
            status: status

        }

        const apiResponse = await axiosPost('order/status', dbParams);
        if (status == "Approved") {
            var notifyStatus = axiosPost('workstatus/approve', notifyParams)
        }
    }

    const approve = (status) => {
        updateOrderStatus(status)


        setWorkStatus(status)
        var timelineData = metadata
        timelineData[4].isActiveForUser = true
        timelineData[4].isActiveForProvider = true
        timelineData[4].status = status
        timelineData[4].updatedOn = new Date()
        setMetadata(timelineData)
        const metadataRef = firebase.database().ref(chatId + '/Metadata/timeline');
        metadataRef.update(timelineData)
        if (status == "Disputed") {
            toggleDispute(true)
        }
        toggleApproveModal(false)
        toggleDisputeModal(false)
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


        if (metadata[panel].isActiveForUser == false) {

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
            else if (panel === 4) {
                setPanel4(isExpanded)
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
        setInPorgressComment(event.target.value)
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
    return (
        <div className={classes.root}>
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
                            <span style={{ fontSize: 14, fontWeight: 600}}>Accepted On: {metadata && metadata[1].updatedOn ? metadata && metadata[1].updatedOn : ''}</span>
                        </Col><br />
                        <Col xs="12">
                            <span style={{ fontSize: 13, fontWeight: 600}}>Provider Comments:</span>
                        </Col><br />
                        <Col xs="12">
                            <p className="font-title" style={{ fontSize: 13, marginBottom: 10 }}>{serviceDetails.providerComments ? serviceDetails.providerComments : ''}</p>
                        </Col><br />
                        <Col xs="12">
                            <span style={{ fontSize: 13, fontWeight: 600}}>Contact Number: {serviceDetails.countryCode && serviceDetails.countryCode} {serviceDetails.phoneNumber ? serviceDetails.phoneNumber : ''}</span>
                        </Col><br />
                        <Col xs="12">
                            <span style={{ fontSize: 13, fontWeight: 600 }}>Service will be provided on: {serviceDetails.serviceNeededOn && new Date(serviceDetails.serviceNeededOn).toDateString()}</span>
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
            <Accordion className={metadata && metadata[1].updatedOn != "" ? "isactive" : ""} expanded={metadata && metadata[1].isActiveForUser === false ? false : panel1} onChange={handleChange(1)} >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                ><div className="forimage">
                        <Typography className={classes.heading}>  <img src={metadata && metadata[2].updatedOn != "" ? completed : inprogress} />INITIATION</Typography>
                    </div>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        <Col xs="12">
                            <span style={{ fontSize: 14, fontWeight: 600 }}>Updated On: {metadata && metadata[1].updatedOn ? new Date(metadata && metadata[1].updatedOn).toDateString() : ''}</span>
                        </Col><br />
                        <Col xs="12">
                            <span style={{ fontSize: 13, fontWeight: 600 }}>Provider Comments:</span>
                        </Col>
                        <Col xs="12">
                            <p className="font-title" style={{ fontSize: 13, marginBottom: 0 }}>{metadata && metadata[1].providerComments}</p>
                        </Col><br />
                        <Col xs="12">
                            {
                                metadata && metadata[1].updatedOn !== '' ? (
                                    <span className="green-label">Work Started</span>
                                ) : <span className="gray-label">Pending</span>
                            }

                        </Col>
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion className={metadata && metadata[2].updatedOn != "" ? "isactive" : ""} expanded={metadata && metadata[2].isActiveForUser === false ? false : panel2} onChange={handleChange(2)}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                >
                    <div className="forimage">
                        <Typography className={classes.heading}>  <img src={metadata && metadata[2].updatedOn != "" ? completed : verify} />AUTHENTICATION</Typography>
                    </div>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        <Col xs="12">
                            <span style={{ fontSize: 14, fontWeight: 600 }}>Updated On: {metadata && metadata[2].updatedOn ? new Date(metadata && metadata[2].updatedOn).toDateString() : ''}</span>
                        </Col>
                        <Col xs="12">
                            {

                                metadata && !metadata[2].isProviderVerified && (
                                    <Button onClick={() => setIsModalVisible(true)} className="view-digital purple-label" >View Digital ID</Button>

                                )
                            }
                        </Col>

                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion className={metadata && metadata[3].updatedOn != "" ? "isactive" : ""} expanded={metadata && metadata[3].isActiveForUser === false ? false : panel3} onChange={handleChange(3)}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                >
                    <div className="forimage">
                        <Typography className={classes.heading}>  <img src={metadata && metadata[3].updatedOn != "" ? completed : verify} />COMPLETION</Typography>
                    </div>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        <Col xs="12">
                            <span style={{ fontSize: 14, fontWeight: 600 }}>Updated On: {metadata && metadata[3].updatedOn ? new Date(metadata && metadata[3].updatedOn).toDateString() : ''}</span>
                        </Col><br />
                        <Col xs="12">
                            <span style={{ fontSize: 13, fontWeight: 600 }}>Provider Comments:</span>
                        </Col>
                        <Col xs="12">
                            <p className="font-title" style={{ fontSize: 13, marginBottom: 0 }}>{metadata && metadata[3].providerComments}</p>
                        </Col>
                        <Col xs="12">
                            {
                                metadata && metadata[3].updatedOn !== '' ? (
                                    <span className="green-label">Delivered</span>
                                ) : <span className="gray-label">Not Delivered</span>
                            }
                        </Col>
                    </Typography>
                </AccordionDetails>
            </Accordion>


            <Accordion className={metadata && metadata[4].updatedOn != "" ? "isactive" : ""} expanded={metadata && metadata[4].isActiveForUser === false ? false : panel4} onChange={handleChange(4)}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                >
                    <div className="forimage">
                        <Typography className={classes.heading}>  <img src={metadata && metadata[4].updatedOn != "" ? completed : verify} />APPROVAL</Typography>
                    </div>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        {
                            metadata && metadata[4].updatedOn !== '' && (
                                <Col xs="12">
                                    <span style={{ fontSize: 14, fontWeight: 600 }}>Updated On:  {new Date(metadata && metadata[4].updatedOn).toDateString()}</span>
                                </Col>
                            )
                        }

                        <div className={imgClass.root}>
                            <GridList className={imgClass.gridList} cols={2.5}>
                                {!_.isEmpty(billsImageArray) && !_.isEmpty(billsImageArray.Bills) &&
                                    billsImageArray.Bills.map((data, index) =>
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
                                {!_.isEmpty(billsImageArray) && !_.isEmpty(billsImageArray.Work) &&
                                    billsImageArray.Work.map((data, index) =>
                                        <GridListTile key={index}>
                                            <BillImage src={`${assetsBaseUrl}/${data}`} alt={"Work Image"} onClick={() => {
                                                setPopupImageUrl(data);
                                                setImagePopUpModal(true);
                                            }} />

                                            <GridListTileBar
                                                title={"Work Image"}
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
                        <ClaimAmountWrapper>
                            {
                                !_.isEmpty(claimAmount) &&
                                <>
                                    <Col xs="12">
                                        <span style={{ fontSize: 16, fontWeight: 600 }}>{`Additional Amount: $ ${claimAmount.claimAmountInUserCurrency}`}</span>
                                    </Col>
                                </>

                            }

                        </ClaimAmountWrapper>


                        {
                            metadata && metadata[4].status === 'Approved' ? (
                                <Col cs="12">
                                    <span className="green-label">Approved</span>

                                </Col>
                            ) : metadata && metadata[4].status === 'Disputed' ? (
                                <Col cs="12">
                                    <span className="red-label">Disputed</span>
                                </Col>
                            ) : <React.Fragment>
                                        <Row>
                                            <Col xs="6">
                                                {!_.isEmpty(claimAmount) && claimAmount.claimAmountInProviderCurrency > 0 ?
                                                    <Button onClick={() => toggleApproveModal(true)} className="post-request purple-label">
                                                        Approve & Pay
                                                </Button>
                                                    :
                                                    <Button onClick={() => toggleApproveModal(true)} className="post-request purple-label">
                                                        Approve
                                                </Button>
                                                }
                                            </Col>

                                            <Col xs="6">
                                                <Button onClick={() => toggleDisputeModal(true)} className="post-request red-label">Dispute</Button>
                                            </Col>
                                        </Row>
                                    </React.Fragment>
                        }

                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Modal isOpen={isModalVisible}>
                <ModalBody>
                    <div className="digital-modal whitegrad-bg">
                        <img src={`${serviceDetails && serviceDetails.tblUserByProviderId && serviceDetails.tblUserByProviderId.avatarUrl !== '' ? `${process.env.REACT_APP_ASSETS_BASE_URL}/Users/${serviceDetails.tblUserByProviderId && serviceDetails.providerId}/Avatar/${serviceDetails.tblUserByProviderId.avatarUrl}` : user}`} style={{ width: 200, height: 200, marginBottom: 15, borderRadius: 10 }} />
                        {/* <SpiffyOnAvatar className={"spiffy-big"} spiffyStrength={serviceDetails && serviceDetails.tblUserByProviderId && serviceDetails.tblUserByProviderId.spiffy[0]} /> */}
                        <SpiffyOnAvatar className={"spiffy-big"} spiffyStrength={!_.isEmpty(serviceDetails.tblUserByProviderId.spiffy) && serviceDetails.tblUserByProviderId.spiffy[0]} />

                        {/* <img className="spiffy-big" src={imgSpiffy5}/> */}
                        <p style={{ fontSize: 20, marginBottom: 0,fontWeight:"bold" }}>{serviceDetails.tblUserByProviderId && serviceDetails.tblUserByProviderId.fullname}</p>

                        <p style={{ fontSize: 50, color: '#861b8d', fontWeight: 'bold', marginBottom: 0 }}>{orderDetails && orderDetails.digitalIdCode}</p>
                        <p className="font-title">Order Digital Code</p>
                        <br /><br />
                        <hr />
                        <Row>
                            <Col xs="1" style={{ cursor:"pointer"}}>
                                <ShareIcon onClick={() => shareDigitalId()}  />
                            </Col>
                            <Col xs="7" style={{ cursor:"pointer"}}>
                                <p style={{fontSize: 13, fontWeight:"bolder", color:'blueviolet'}} onClick={() => shareDigitalId()}>
                                    SHARE DIGITAL ID TO YOUR SERVICE LOCATION
                                </p>
                                {/* <Button style={{ backgroundColor: '#890c67' }} onClick={() => copyToClipboard()}>Copy DigitalId Url</Button> */}

                            </Col>
                            
                            <Col xs="4" style={{ cursor:"pointer"}} >
                                
                                <Button onClick={() => setIsModalVisible(false)} className="filter-apply-button">Close</Button>
                                
                            </Col>
                        </Row>
                    </div>
                </ModalBody>
            </Modal>
            <Modal isOpen={isDisputeModalVisible} style={{ marginTop: 70, backgroundColor: "#f8f8f8" }}>
                <ModalBody>
                    <p className="text-center bold font16">Are you sure you want to dispute the order?</p>
                    <br /><br />
                    <Row>
                        <Col xs="6">
                            <Button onClick={() => approve('Disputed')} className="post-request red-label width100">Dispute</Button>
                        </Col>

                        <Col xs="6">
                            <Button onClick={() => toggleDisputeModal(false)} className="post-request gray-label width100">Cancel</Button>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
            <Modal isOpen={isApproveModalVisible} style={{ marginTop: 70 }}>
                {!_.isEmpty(claimAmount) && claimAmount.claimAmountInProviderCurrency > 0 ?
                    <ModalBody>
                        <p className="text-center bold font16">Pay and confirm your order</p>
                        <br /><br />
                        <Row>
                            <Col xs="12">
                                {render_paypalButton()}
                                <Button onClick={() => toggleApproveModal(false)} className="post-request gray-label width100">Cancel</Button>
                            </Col>
                        </Row>
                    </ModalBody>
                    :
                    <ModalBody>
                        <p className="bold font16 text-center">Are you sure?</p>
                        <br /><br />
                        <Row>
                            <Col xs="6">
                                <Button onClick={() => approve('Approved')} className="post-request purple-label width100">Approve</Button>
                            </Col>

                            <Col xs="6">
                                <Button onClick={() => toggleApproveModal(false)} className="post-request gray-label width100">Cancel</Button>
                            </Col>
                        </Row>
                    </ModalBody>
                }

            </Modal>
            <Modal isOpen={isDisputed} style={{ marginTop: 70 }}>
                <ModalBody>
                    <p>
                        <b>
                            Your dispute has been submitted. Sorry for the inconvenience caused to you.
                            <br />
                            A YoCo Care specialist will get in touch with you soon to resolve this.
                            </b>
                    </p>
                    <Button onClick={() => toggleDispute(false)} className="post-request gray-label">Close</Button>
                </ModalBody>
            </Modal>

            <Modal isOpen={imagePopUpModal} style={{ marginTop: 70 }}>
                <ModalBody>
                    <ModelImage src={`${assetsBaseUrl}/${popupImageUrl}`} />
                    <Button onClick={() => {
                        setImagePopUpModal(false)
                    }} className="post-request gray-label">Close</Button>
                </ModalBody>
            </Modal>
        </div >
    );
}