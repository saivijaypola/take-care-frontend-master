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
import checkGreen from '../../../images/icon/check-green.png'
import checkGray from '../../../images/icon/square-with-round-corners.png'
import checkGray2 from '../../../images/icon/check-gray-2.png'
import SpiffyOnAvatar from "../Spiffy/spiffyonavatar";
import inprogress from '../../../images/icon/clock-2.png'
import add from '../../../images/icon/add.png'
import add2 from '../../../images/icon/add-2.png'
import user from "../../../images/icon/user-6.png";
import firebase from "firebase"
import { generateDigitalId } from "../../../utils/helper";
import axios from "axios";
import _, { indexOf } from "lodash";
import moment from 'moment';
import ImageUploader from 'react-images-upload';
import closeicon from '../../../images/icon/close.svg';
import go from "../../../images/icon/go.png";
import left from "../../../images/icon/left.png";
import right from "../../../images/icon/right.png";
import calendar from "../../../images/icon/calendar-3.png";
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
    KeyboardDateTimePicker,
} from '@material-ui/pickers';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import DateFnsUtils from '@date-io/date-fns';
import UploadBills from '../../../handler/fileUploadCareBills';
import { BillImageWrapper, BillImage, ClaimAmountWrapper, ModelImage } from "./TimeLine.styled";

import {
    Container, Row, Col, Nav,
    NavItem,
    NavLink, TabContent,
    TabPane, Modal, ModalHeader, ModalFooter, Spinner, Input, Button, ModalBody, Alert
} from "reactstrap";
import { axiosPost } from '../../../handler/apiHandler';
import { time } from 'date-fns/locale/af';
import classnames from 'classnames';
import ImageUploading from "react-images-uploading";

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

const assetsBaseUrl = process.env.REACT_APP_ASSETS_BASE_URL

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

export default function CareProviderTimeLine(props) {

    const history = useHistory();


    const classes = useStyles();
    const { myRequestDetails, providerDetails, chatId, orderId } = props
    const imgClass = useStylesImage();

    const [inProgressComment, setInPorgressComment] = useState('')
    const { serviceDetails, orderDetails } = props
    const [activePanel, setActivePanel] = useState('Default')
    const [metadata, setMetadata] = useState('')
    const [billsData, setBillsData] = useState('')
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [modalDescription, setModalDescription] = useState('')
    const [modalTitle, setModalTitle] = useState('')
    const [serviceCompleted, setServiceCompleted] = useState(false)

    const [workCompleteComments, setWorkCompleteComments] = useState('')
    const [chars_left, setCharsLeft] = useState(240)
    const [billingDate, setBillingDate] = useState()
    const [additionalExpenses, setAdditionalExpenses] = useState('')
    const [step, setStep] = useState('additional')
    const [bills, setBills] = useState([])
    const [nextDate, setNextDate] = useState(null)
    const [isCompletionSuccess, setCompletionSuccess] = useState(false)
    const [visitIndex, setVisitIndex] = useState()
    const [uploadProgress, setUploadProgress] = useState(0)
    const [filePath, setFilePath] = useState([])
    const [activeTab, setActiveTab] = useState('timelineTab')
    const [imagePopUpModal, setImagePopUpModal] = useState(false)
    const [popupImageUrl, setPopupImageUrl] = useState('')
    const [isCareModalVisible, setCareModalVisible] = useState(false)
    const [alphadata, setAlphadata] = useState('')

    const [check1, setCheck1] = useState(false)
    const [check2, setCheck2] = useState(false)
    const [check3, setCheck3] = useState(false)

    const [panel0, setPanel0] = useState(false)
    const [panel1, setPanel1] = useState(false)
    const [panel2, setPanel2] = useState(false)
    const [panel3, setPanel3] = useState(false)

    const setInitialPanelVisiblity = (metadata) => {

        setPanel0(metadata && metadata[0].isActiveForProvider)
        setPanel1(metadata && metadata[1].isActiveForProvider)
        setPanel2(metadata && metadata[2].isActiveForProvider)
        setPanel3(metadata && metadata[3].isActiveForProvider)
    }


    //Set Digital Id
    const [digitalId, setDigitalId] = useState('')

    useEffect(() => {
        if (chatId) {
            const alphadataRef = firebase.database().ref('Care/' + chatId + '/Metadata/' + orderId);
            alphadataRef.on('value', snapshot => {
                const getAlphadata = snapshot.val();
                if (getAlphadata) {
                    console.log('ALPHA DATA', getAlphadata);
                    setAlphadata(getAlphadata)
                }
            })

            const metadataRef = firebase.database().ref('Care/' + chatId + '/Metadata/' + orderId + '/timeline');
            metadataRef.on('value', snapshot => {
                const getMetadata = snapshot.val();
                console.log('METADATA', getMetadata);
                setMetadata(getMetadata)
                setInitialPanelVisiblity(getMetadata)
                if (getMetadata[2] && getMetadata[2].providerTasks && getMetadata[2].providerTasks[0].startDate !== '') {
                    var date = new Date(getMetadata[2].providerTasks[0].startDate)
                    date.setDate(date.getDate() + 30)
                    setBillingDate(date)
                }
                // if(getMetadata[1].maskOn && getMetadata[1].wellInformed){
                //     setPanel1(false)
                // }
            })

            const billdataRef = firebase.database().ref('Orders/Care/' + chatId + '/' + orderId + '/Bills/Visits');
            billdataRef.on('value', snapshot => {
                const getBilldata = snapshot.val();
                setBillsData(getBilldata)
            })
        }

    }, [orderId])

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
            }
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

    const finishTask = (index) => {
        var timelineData = metadata

        //Update Provider comments in Progress

        timelineData[2].providerTasks[index].providerComments = inProgressComment
        timelineData[2].providerTasks[index].additionalExpenses = additionalExpenses
        timelineData[2].updatedOn = new Date().toDateString()
        timelineData[2].nextVisitDate = new Date(nextDate).toDateString()
        timelineData[2].lastVisitDate = new Date().toString()
        timelineData[2].providerTasks[index].taskFinished = true
        timelineData[2].providerTasks[index].finishDate = new Date().toDateString()
        timelineData[3].completedTasks[index].completed = true
        timelineData[3].isActiveForProvider = true
        timelineData[3].isActiveForUser = true
        if (metadata && metadata[2].providerTasks[metadata[2].providerTasks.length - 1].taskFinished) {
            timelineData[2].status = 'COMPLETED'
        }

        setMetadata(timelineData)
        const metadataRef = firebase.database().ref('Care/' + chatId + '/Metadata/' + orderId + '/timeline');

        metadataRef.update(timelineData)

        setCompletionSuccess(true)
    }

    const deleteTask = (index) => {
        const metadataRef = firebase.database().ref('Care/' + chatId + '/Metadata/' + orderId + '/timeline/2/providerTasks/' + index);
        metadataRef.remove()
        const metadataRef2 = firebase.database().ref('Care/' + chatId + '/Metadata/' + orderId + '/timeline/3/completedTasks/' + index);
        metadataRef2.remove()
    }

    const onSanitize = () => {
        var timelineData = metadata

        timelineData[1].maskOn = true
        timelineData[1].updatedOn = new Date().toDateString()
        if (timelineData[1].wellInformed) {
            timelineData[1].status = 'INITIATED'
            timelineData[2].isActiveForProvider = true
        }

        setMetadata(timelineData)
        const metadataRef = firebase.database().ref('Care/' + chatId + '/Metadata/' + orderId + '/timeline');

        metadataRef.update(timelineData)
    }

    const box1 = () => {
        var timelineData = metadata

        timelineData[1].box1 = true
        timelineData[1].updatedOn = new Date().toDateString()
        if (timelineData[1].box2 && timelineData[1].box3) {
            timelineData[1].status = 'INITIATED'
            timelineData[2].isActiveForProvider = true
        }

        setMetadata(timelineData)
        const metadataRef = firebase.database().ref('Care/' + chatId + '/Metadata/' + orderId + '/timeline');

        metadataRef.update(timelineData)
    }

    const box2 = () => {
        var timelineData = metadata

        timelineData[1].box2 = true
        timelineData[1].updatedOn = new Date().toDateString()
        if (timelineData[1].box1 && timelineData[1].box3) {
            timelineData[1].status = 'INITIATED'
            timelineData[2].isActiveForProvider = true
        }

        setMetadata(timelineData)
        const metadataRef = firebase.database().ref('Care/' + chatId + '/Metadata/' + orderId + '/timeline');

        metadataRef.update(timelineData)
    }

    const box3 = () => {
        var timelineData = metadata

        timelineData[1].box3 = true
        timelineData[1].updatedOn = new Date().toDateString()
        if (timelineData[1].box2 && timelineData[1].box1) {
            timelineData[1].status = 'INITIATED'
            timelineData[2].isActiveForProvider = true
        }

        setMetadata(timelineData)
        const metadataRef = firebase.database().ref('Care/' + chatId + '/Metadata/' + orderId + '/timeline');

        metadataRef.update(timelineData)
    }

    const onInfo = () => {
        var timelineData = metadata

        timelineData[1].wellInformed = true
        timelineData[1].updatedOn = new Date().toDateString()
        if (timelineData[1].maskOn) {
            timelineData[1].status = 'INITIATED'
            timelineData[2].isActiveForProvider = true
        }

        setMetadata(timelineData)
        const metadataRef = firebase.database().ref('Care/' + chatId + '/Metadata/' + orderId + '/timeline');

        metadataRef.update(timelineData)
    }

    const startTask = (index) => {

        var timelineData = metadata

        //Update the status to in progress in timeline
        timelineData[1].status = 'STARTED'
        timelineData[2].status = 'IN PROGRESS'
        timelineData[2].updatedOn = new Date().toDateString()

        setMetadata(timelineData)
        const metadataRef = firebase.database().ref('Care/' + chatId + '/Metadata/' + orderId + '/timeline');

        metadataRef.update(timelineData)
        //updateOrderStatus('Work Started')
    }

    const onAdd = () => {
        setCareModalVisible(false)
        if (!metadata[2].providerTasks) {
            var timelineData = metadata

            timelineData[0].isActiveForProvider = true
            timelineData[0].isActiveForUser = true
            timelineData[1].status = 'STARTED'
            timelineData[2].isActiveForProvider = true
            timelineData[2].status = 'IN PROGRESS'
            timelineData[3].status = ''
            timelineData[3].isActiveForProvider = false
            timelineData[3].isActiveForUser = false
            timelineData[2].updatedOn = new Date().toDateString()
            timelineData[3].isActiveForProvider = false

            setMetadata(timelineData)
            const metadataRef0 = firebase.database().ref('Care/' + chatId + '/Metadata/' + orderId + '/timeline');

            metadataRef0.update(timelineData)

            var tasks = {
                providerTasks: [
                    {
                        startDate: new Date().toDateString(),
                        taskStarted: true,
                        providerComments: '',
                        additionalExpenses: 0,
                        taskFinished: false
                    }
                ]
            }
            const metadataRef = firebase.database().ref('Care/' + chatId + '/Metadata/' + orderId + '/timeline/2/');
            metadataRef.update(tasks)

            var compTasks = {
                completedTasks: [
                    {
                        completed: false,
                        approved: false,
                        disputed: false,
                        userComments: ''
                    }
                ]
            }
            const metadataRef2 = firebase.database().ref('Care/' + chatId + '/Metadata/' + orderId + '/timeline/3/');
            metadataRef2.update(compTasks)
        } else {
            var timelineData = metadata

            timelineData[0].isActiveForProvider = true
            timelineData[0].isActiveForUser = true
            timelineData[1].status = 'STARTED'
            timelineData[2].status = 'IN PROGRESS'
            timelineData[2].updatedOn = new Date().toDateString()
            timelineData[3].status = ''
            timelineData[3].isActiveForProvider = false
            timelineData[3].isActiveForUser = false

            timelineData[2].providerTasks[timelineData[2].providerTasks.length] =
            {
                startDate: new Date().toDateString(),
                taskStarted: true,
                providerComments: '',
                additionalExpenses: 0,
                taskFinished: false
            }
            timelineData[3].completedTasks[timelineData[3].completedTasks.length] =
            {
                completed: false,
                approved: false,
                disputed: false,
                userComments: ''
            }
            const metadataRef = firebase.database().ref('Care/' + chatId + '/Metadata/' + orderId + '/timeline');
            metadataRef.update(timelineData)

        }
    }

    const onDateChange = (event) => {
        setNextDate(event)
    }

    const deleteBill = (index) => {
        var pics = bills
        var newBills = pics.slice(index, index + 1)
        setBills(newBills)
    }

    const onDrop = (picture) => {
        console.log('PICTURE', picture);
        setBills(picture)
    }

    const onConfirmBills = () => {
        if (bills.length > 0) {
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {

                    user.getIdToken().then(function (idToken) {
                        for (var i = 0; i < bills.length; i++) {
                            UploadBills.upload(bills[i].file, {
                                "careId": chatId,
                                "careOrderId": orderId,
                                "taskNo": visitIndex,
                            }, user, (event) => {
                                setUploadProgress(Math.round((100 * event.loaded) / event.total))
                            }).then((response) => {
                                console.log('RESPONSE', response)
                                if (response.data.data && response.data.data) {
                                    var files = filePath
                                    files.push(`Care/${chatId}/bills/${orderId}/tasks/${visitIndex}/${response.data.data[0]}`)
                                    setFilePath(files)
                                }
                            })
                        }

                    })
                }
            })
        }
    }

    const addFilePathsToFirebase = () => {
        const orderMetaRef = firebase.database().ref(`Orders/Care/${chatId}/${orderId}/Bills/Visits/${visitIndex}`);
        orderMetaRef.set(filePath)
    }

    const prevStep = () => {
        window.scrollTo(0, 0)
        switch (step) {
            case "comments":
                setStep('additional')
                break;
            case "nextDate":
                addFilePathsToFirebase()
                setStep('comments')
                break;
            case "summary":
                setStep('nextDate')
                break;
        }
    }

    const nextStep = () => {
        window.scrollTo(0, 0)
        switch (step) {
            case "additional":
                if (additionalExpenses === '') {
                    setIsModalVisible(true)
                    setModalTitle('Please enter any additional expenses incurred.')
                    setModalDescription('If there are no additional expenses incurred, please enter 0.')
                } else {
                    onConfirmBills()
                    setStep('comments')
                }
                break;
            case "comments":
                if (inProgressComment === '') {
                    setIsModalVisible(true)
                    setModalTitle('Please provide service completion comments.')
                } else {
                    addFilePathsToFirebase()
                    setStep('nextDate')
                }
                break;
            case "nextDate":
                if (nextDate === null) {
                    setIsModalVisible(true)
                    setModalTitle('Please select the next visit date.')
                } else {
                    setStep('summary')
                }
                break;
        }
    }

    const completeService = (index) => {
        setVisitIndex(index)
        setServiceCompleted(true)
        window.scrollTo(0, 0)
    }

    const onSuccessNavigation = () => {
        setCompletionSuccess(false)
        setServiceCompleted(false)
    }

    const onChangeText = (event) => {
        setInPorgressComment(event.target.value)
    }

    const onChangeAmount = (event) => {
        setAdditionalExpenses(event.target.value)
    }

    const onChangeWorkCompleteComments = (event) => {
        setCharsLeft(240 - event.target.value.length)
        setWorkCompleteComments(event.target.value)
    }

    const toggle = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab)
        }
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

    const onChange = (imageList, addUpdateIndex) => {
        setBills(imageList);
    };

    return (
        <div className={classes.root}>
            <Nav pills className="nav-justified profile-tabs vertipadd">
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === 'timelineTab' }) + ""}
                        onClick={() => { toggle('timelineTab'); }}
                    >
                        <div className="text-center pt-1 pb-1">
                            <p style={{ color: activeTab === 'timelineTab' && '#fff', fontSize:16 }} className="bold title font-weight-normal mb-0">TIMELINE</p>
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
                                <p style={{ color: activeTab === 'historyTab' && '#fff', fontSize: 16}} className="bold title font-weight-normal mb-0">HISTORY</p>
                            </div>
                        </NavLink>
                    </NavItem>}
            </Nav>
            <TabContent activeTab={activeTab}>
                <TabPane tabId='timelineTab' className="p-3">
                    {!serviceCompleted ?
                        <div>
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
                                            <span style={{ fontSize: 14, fontWeight: 600 }}>Accepted on: {moment(metadata && metadata[0].createdOn).format('LL')}</span>
                                        </Col>
                                        <Col xs="12">
                                            <span style={{ fontSize: 13, fontWeight: 600 }}>Service Supported:</span>
                                        </Col>
                                        <Col xs="12">
                                            <p className="font-title" style={{ fontSize: 13, marginBottom: 0 }}>{serviceDetails && serviceDetails.supportDescription}</p>
                                        </Col>
                                        <Col xs="12">
                                            <span style={{ fontSize: 13, fontWeight: 600 }}>Care Description:</span>
                                        </Col>
                                        <Col xs="12">
                                            <p className="font-title" style={{ fontSize: 13, marginBottom: 0 }}>{orderDetails && orderDetails.tblCarePackageByCareId && orderDetails.tblCarePackageByCareId.careDescription}</p>
                                        </Col>
                                        <Col xs="12">
                                            <span style={{ fontSize: 13, fontWeight: 600 }}>User Contact Details:</span>
                                        </Col>
                                        <Col xs="12">
                                            <p className="font-title" style={{ fontSize: 13, marginBottom: 0, marginTop: 0 }}>{metadata && metadata[0].contactName}</p>
                                            <p className="font-title" style={{ fontSize: 13, marginBottom: 0, marginTop: 0 }}>{metadata && metadata[0].contactAddress}</p>
                                            <p className="font-title" style={{ fontSize: 13, marginBottom: 0, marginTop: 0 }}>{metadata && metadata[0].countryCode} {metadata && metadata[0].contactNumber}</p>
                                        </Col>
                                        <Col xs="1"></Col>
                                        <Col xs="11">
                                            <br />
                                            {
                                                serviceDetails && (
                                                    <table className="table order-table">
                                                        <tr className="no-border">
                                                            <td>Provider Fee</td>
                                                            <th>{'INR'} {parseFloat(serviceDetails.monthlyFee).toFixed(2)}</th>

                                                        </tr>
                                                        <tr className="no-border">
                                                            <td>Per Visit Charge</td>
                                                            <th>{'INR'} {parseFloat(serviceDetails.perVisitCharge).toFixed(2)}</th>

                                                        </tr>

                                                    </table>
                                                )
                                            }
                                        </Col>
                                    </Row>


                                </AccordionDetails>
                            </Accordion>
                            <Accordion className={metadata && metadata[1].status === 'STARTED' ? "isactive" : ""} expanded={metadata && metadata[1].isActiveForProvider === false ? false : panel1} onChange={handleChange(1)} >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel2a-content"
                                    id="panel2a-header"
                                >
                                    <div className="forimage">
                                        <Typography className={classes.heading}> <img src={metadata && metadata[1].status === 'STARTED' ? completed : inprogress} />INITIATION</Typography>
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails>

                                    <Typography>
                                        <Row>
                                            <Col xs="12">
                                                {
                                                    metadata && metadata[1].updatedOn !== '' && (
                                                        <span style={{ fontSize: 14, fontWeight: 600 }}>Updated On: {moment(metadata && metadata[1].updatedOn).format('LL')}</span>
                                                    )
                                                }
                                            </Col>

                                        </Row>
                                        <Row>
                                            {serviceDetails && serviceDetails.supportDescription === 'Fundamentals' ?
                                                <div style={{ paddingTop: 20 }}>
                                                    <Col xs="12">
                                                        <table className="table">
                                                            <tr className="no-border">
                                                                <td xs="8" style={{ fontSize: 13 }}>I have the contact of the person who will receive this service.</td>
                                                                <th onClick={() => !metadata[1].box1 && box1()}><img className="pointer" src={metadata && metadata[1].box1 === true ? checkGreen : checkGray} style={{ width: 20, height: 20 }} /></th>
                                                            </tr>
                                                            <tr className="no-border">
                                                                <td xs="8" style={{ fontSize: 13 }}>I will call them at least once every week.</td>
                                                                <th onClick={() => !metadata[1].box2 && box2()}><img className="pointer" src={metadata && metadata[1].box2 === true ? checkGreen : checkGray} style={{ width: 20, height: 20 }} /></th>
                                                            </tr>
                                                            <tr className="no-border">
                                                                <td xs="8" style={{ fontSize: 13 }}>I will visit them, if required, based on their convenience.</td>
                                                                <th onClick={() => !metadata[1].box3 && box3()}><img className="pointer" src={metadata && metadata[1].box3 === true ? checkGreen : checkGray} style={{ width: 20, height: 20 }} /></th>
                                                            </tr>
                                                        </table>
                                                    </Col>
                                                </div>
                                                :
                                                serviceDetails && serviceDetails.supportDescription === 'Weekly Vitals' ?
                                                    <div style={{ paddingTop: 20 }}>
                                                        <Col xs="12">
                                                            <table className="table">
                                                                <tr className="no-border">
                                                                    <td xs="8" style={{ fontSize: 13 }}>I have the contact of the person who will receive this service.</td>
                                                                    <th onClick={() => !metadata[1].box1 && box1()}><img className="pointer" src={metadata && metadata[1].box1 === true ? checkGreen : checkGray} style={{ width: 20, height: 20 }} /></th>
                                                                </tr>
                                                                <tr className="no-border">
                                                                    <td xs="8" style={{ fontSize: 13 }}>I will visit them weekly to check their vitals.</td>
                                                                    <th onClick={() => !metadata[1].box2 && box2()}><img className="pointer" src={metadata && metadata[1].box2 === true ? checkGreen : checkGray} style={{ width: 20, height: 20 }} /></th>
                                                                </tr>
                                                                <tr className="no-border">
                                                                    <td xs="8" style={{ fontSize: 13 }}>I will make the results available to the main user as well as the end user.</td>
                                                                    <th onClick={() => !metadata[1].box3 && box3()}><img className="pointer" src={metadata && metadata[1].box3 === true ? checkGreen : checkGray} style={{ width: 20, height: 20 }} /></th>
                                                                </tr>
                                                            </table>
                                                        </Col>
                                                    </div>
                                                    :
                                                    serviceDetails && serviceDetails.supportDescription === 'Monthly Testing' ?
                                                        <div style={{ paddingTop: 20 }}>
                                                            <Col xs="12">
                                                                <table className="table">
                                                                    <tr className="no-border">
                                                                        <td xs="8" style={{ fontSize: 13 }}>I have the contact of the person who will receive this service.</td>
                                                                        <th onClick={() => !metadata[1].box1 && box1()}><img className="pointer" src={metadata && metadata[1].box1 === true ? checkGreen : checkGray} style={{ width: 20, height: 20 }} /></th>
                                                                    </tr>
                                                                    <tr className="no-border">
                                                                        <td xs="8" style={{ fontSize: 13 }}>I will call them at least once a week to check on them.</td>
                                                                        <th onClick={() => !metadata[1].box2 && box2()}><img className="pointer" src={metadata && metadata[1].box2 === true ? checkGreen : checkGray} style={{ width: 20, height: 20 }} /></th>
                                                                    </tr>
                                                                    <tr className="no-border">
                                                                        <td xs="8" style={{ fontSize: 13 }}>I will visit them on a monthly basis for any lab tests required.</td>
                                                                        <th onClick={() => !metadata[1].box3 && box3()}><img className="pointer" src={metadata && metadata[1].box3 === true ? checkGreen : checkGray} style={{ width: 20, height: 20 }} /></th>
                                                                    </tr>
                                                                </table>
                                                            </Col>
                                                        </div>
                                                        :
                                                        serviceDetails && serviceDetails.supportDescription === 'Post Hospitalization Care' ?
                                                            <div style={{ paddingTop: 20 }}>
                                                                <Col xs="12">
                                                                    <table className="table">
                                                                        <tr className="no-border">
                                                                            <td xs="8" style={{ fontSize: 13 }}>I have the contact of the person who will receive this service.</td>
                                                                            <th onClick={() => !metadata[1].box1 && box1()}><img className="pointer" src={metadata && metadata[1].box1 === true ? checkGreen : checkGray} style={{ width: 20, height: 20 }} /></th>
                                                                        </tr>
                                                                        <tr className="no-border">
                                                                            <td xs="8" style={{ fontSize: 13 }}>I will call them immediately and find out what is needed.</td>
                                                                            <th onClick={() => !metadata[1].box2 && box2()}><img className="pointer" src={metadata && metadata[1].box2 === true ? checkGreen : checkGray} style={{ width: 20, height: 20 }} /></th>
                                                                        </tr>
                                                                        <tr className="no-border">
                                                                            <td xs="8" style={{ fontSize: 13 }}>I will take care of any requirements they may have in connection with a post-hospitalization routine.</td>
                                                                            <th onClick={() => !metadata[1].box3 && box3()}><img className="pointer" src={metadata && metadata[1].box3 === true ? checkGreen : checkGray} style={{ width: 20, height: 20 }} /></th>
                                                                        </tr>
                                                                    </table>
                                                                </Col>
                                                            </div>
                                                            :
                                                            serviceDetails && serviceDetails.supportDescription === 'Weekly Companion' ?
                                                                <div style={{ paddingTop: 20 }}>
                                                                    <Col xs="12">
                                                                        <table className="table">
                                                                            <tr className="no-border">
                                                                                <td xs="8" style={{ fontSize: 13 }}>I have the contact of the person who will receive this service.</td>
                                                                                <th onClick={() => !metadata[1].box1 && box1()}><img className="pointer" src={metadata && metadata[1].box1 === true ? checkGreen : checkGray} style={{ width: 20, height: 20 }} /></th>
                                                                            </tr>
                                                                            <tr className="no-border">
                                                                                <td xs="8" style={{ fontSize: 13 }}>I will call them right away and establish a connection.</td>
                                                                                <th onClick={() => !metadata[1].box2 && box2()}><img className="pointer" src={metadata && metadata[1].box2 === true ? checkGreen : checkGray} style={{ width: 20, height: 20 }} /></th>
                                                                            </tr>
                                                                            <tr className="no-border">
                                                                                <td xs="8" style={{ fontSize: 13 }}>I will visit every week and be a companion for them.</td>
                                                                                <th onClick={() => !metadata[1].box3 && box3()}><img className="pointer" src={metadata && metadata[1].box3 === true ? checkGreen : checkGray} style={{ width: 20, height: 20 }} /></th>
                                                                            </tr>
                                                                        </table>
                                                                    </Col>
                                                                </div>
                                                                :
                                                                serviceDetails && serviceDetails.supportDescription === 'Daily Essentials' ?
                                                                    <div style={{ paddingTop: 20 }}>
                                                                        <Col xs="12">
                                                                            <table className="table">
                                                                                <tr className="no-border">
                                                                                    <td xs="8" style={{ fontSize: 13 }}>I have the contact of the person who will receive this service.</td>
                                                                                    <th onClick={() => !metadata[1].box1 && box1()}><img className="pointer" src={metadata && metadata[1].box1 === true ? checkGreen : checkGray} style={{ width: 20, height: 20 }} /></th>
                                                                                </tr>
                                                                                <tr className="no-border">
                                                                                    <td xs="8" style={{ fontSize: 13 }}>I will call them right away and establish a connection.</td>
                                                                                    <th onClick={() => !metadata[1].box2 && box2()}><img className="pointer" src={metadata && metadata[1].box2 === true ? checkGreen : checkGray} style={{ width: 20, height: 20 }} /></th>
                                                                                </tr>
                                                                                <tr className="no-border">
                                                                                    <td xs="8" style={{ fontSize: 13 }}>I will ensure that all essentials – food and medicine – are well stocked at their house, at all times.</td>
                                                                                    <th onClick={() => !metadata[1].box3 && box3()}><img className="pointer" src={metadata && metadata[1].box3 === true ? checkGreen : checkGray} style={{ width: 20, height: 20 }} /></th>
                                                                                </tr>
                                                                            </table>
                                                                        </Col>
                                                                    </div>
                                                                    :
                                                                    serviceDetails && serviceDetails.supportDescription === 'Customized Option' ?
                                                                        <div style={{ paddingTop: 20 }}>
                                                                            <Col xs="12">
                                                                                <table className="table">
                                                                                    <tr className="no-border">
                                                                                        <td xs="8" style={{ fontSize: 13 }}>I have the contact of the person who will receive this service.</td>
                                                                                        <th onClick={() => !metadata[1].box1 && box1()}><img className="pointer" src={metadata && metadata[1].box1 === true ? checkGreen : checkGray} style={{ width: 20, height: 20 }} /></th>
                                                                                    </tr>
                                                                                    <tr className="no-border">
                                                                                        <td xs="8" style={{ fontSize: 13 }}>I will call them right away and establish a connection.</td>
                                                                                        <th onClick={() => !metadata[1].box2 && box2()}><img className="pointer" src={metadata && metadata[1].box2 === true ? checkGreen : checkGray} style={{ width: 20, height: 20 }} /></th>
                                                                                    </tr>
                                                                                    <tr className="no-border">
                                                                                        <td xs="8" style={{ fontSize: 13 }}>I will ensure that their requirements are met – whether it is calls or visits that are needed from me.</td>
                                                                                        <th onClick={() => !metadata[1].box3 && box3()}><img className="pointer" src={metadata && metadata[1].box3 === true ? checkGreen : checkGray} style={{ width: 20, height: 20 }} /></th>
                                                                                    </tr>
                                                                                </table>
                                                                            </Col>
                                                                        </div>
                                                                        :
                                                                        <></>
                                            }
                                            <Col xs="12">
                                                {
                                                    metadata && metadata[1].status === 'INITIATED' ? (
                                                        <span onClick={() => setCareModalVisible(true)} className="purple-label pointer">Start Work</span>
                                                    )
                                                        :
                                                        metadata && metadata[1].status === 'STARTED' ? (
                                                            <span className="green-label">Work Started</span>
                                                        )
                                                            :
                                                            <span className="gray-label">Pending</span>
                                                }

                                            </Col>
                                            <Modal isOpen={isCareModalVisible} style={{ marginTop: 70 }}>
                                                <ModalHeader>
                                                    <p className="bold purple-text" style={{ fontSize: 18 }}>
                                                        Safety Checklist
                                                            </p>
                                                </ModalHeader>
                                                <ModalBody>
                                                    <div style={{ paddingTop: 20 }}>
                                                        <Col xs="12">
                                                            <table className="table">
                                                                <tr className="no-border">
                                                                    <td xs="8" style={{ fontSize: 13 }}>I will be masked up at all times during the service.</td>
                                                                    <th onClick={() => !check1 && setCheck1(true)}><img className="pointer" src={check1 ? checkGreen : checkGray} style={{ width: 20, height: 20 }} /></th>
                                                                </tr>
                                                                <tr className="no-border">
                                                                    <td xs="8" style={{ fontSize: 13 }}>I will sanitize my hands thoroughly before delivering the service.</td>
                                                                    <th onClick={() => !check2 && setCheck2(true)}><img className="pointer" src={check2 === true ? checkGreen : checkGray} style={{ width: 20, height: 20 }} /></th>
                                                                </tr>
                                                                <tr className="no-border">
                                                                    <td xs="8" style={{ fontSize: 13 }}>I will maintain physical distance wherever possible.</td>
                                                                    <th onClick={() => !check3 && setCheck3(true)}><img className="pointer" src={check3 === true ? checkGreen : checkGray} style={{ width: 20, height: 20 }} /></th>
                                                                </tr>
                                                            </table>
                                                        </Col>
                                                    </div>
                                                </ModalBody>
                                                <ModalFooter>
                                                    <Button onClick={() => check1 && check2 && check3 && onAdd()} className={check1 && check2 && check3 ? "btn btn-primary post-request" : "post-request gray-label"} style={{ width: '40%' }}>Start Visit</Button>
                                                </ModalFooter>
                                            </Modal>
                                        </Row>

                                        {/* <span className={`${metadata && metadata[1].updatedOn != "" ? 'green-label' : 'gray-label'  }`}>{metadata && metadata[1].updatedOn != "" ? 'Work Pending' : 'Work Started'}</span> */}
                                        {/* <span className="gray-label">Work Pending</span> */}
                                        {/* <textarea rows="4" className="order-comments" type="text" name="inprogress-comment" id="inprogress-comment" onChange={onChangeWorkCompleteComments} maxLength="240" placeholder="Write your comments" className="order-comments"></textarea> */}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion className={metadata && metadata[2].status === 'COMPLETED' ? "isactive" : ""} expanded={metadata && metadata[2].isActiveForProvider === false ? false : panel2} onChange={handleChange(2)}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel2a-content"
                                    id="panel2a-header"
                                >
                                    <div className="forimage">
                                        <Typography className={classes.heading}> <img src={metadata && metadata[2].status === 'COMPLETED' ? completed : inprogress} />UPDATION</Typography>
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails>

                                    <Typography>
                                        <Row>
                                            <Col xs="12">
                                                {
                                                    metadata && metadata[2].updatedOn !== '' && (
                                                        <span style={{ fontSize: 14, fontWeight: 600 }}>Updated On: {moment(metadata && metadata[2].updatedOn).format('LL')}</span>
                                                    )
                                                }
                                            </Col>
                                        </Row>
                                        <Col xs="12">
                                            <Row>
                                                {
                                                    metadata && metadata[2].providerTasks && metadata[2].providerTasks.map((task, index) =>
                                                        !task.taskFinished &&
                                                        <div xs="4" className="care-tasks">
                                                            <div className="care-tasks-thumbnail" style={{ backgroundColor: task.taskFinished ? ' #5e2490' : '#d3d3d3' }}>
                                                                <p style={{ textAlign: 'center', alignSelf: 'center', fontSize: 30, color: '#fff' }}>Visit {index + 1}</p>
                                                            </div>

                                                            <Col className="button-flex" style={{ paddingTop: 10 }}>
                                                                <span onClick={() => completeService(index)} className="purple-label">Is Service Completed ?</span>
                                                                {/* {
                                                            metadata && metadata[0].isFundamentals && (index === metadata[2].providerTasks.length - 1) && !task.taskFinished &&
                                                            <span onClick={() => deleteTask(index)} className={"red-label"}>Delete Task</span>
                                                        } */}
                                                            </Col>
                                                            {
                                                                <Modal isOpen={isModalVisible}>
                                                                    <ModalBody>
                                                                        <p style={{fontSize:14}}>{modalDescription}</p>
                                                                        <Button onClick={() => { setIsModalVisible(false); setModalDescription('') }}>Ok</Button>
                                                                    </ModalBody>
                                                                </Modal>
                                                            }
                                                        </div>
                                                    )
                                                }
                                                {/* {
                                            metadata && metadata[0].isFundamentals &&
                                            <div xs="4" className="care-tasks">
                                                <p style={{ textAlign: 'center', fontSize: 18, fontWeight: 600 }}>ADD VISIT DETAILS</p>
                                                <Col>
                                                    <img onClick={() => onAdd()} src={add2} className="add-card-icon" />
                                                </Col>
                                            </div>
                                        } */}
                                                {
                                                    metadata && metadata[2].providerTasks && metadata[2].providerTasks.filter(x => !x.taskFinished).length === 0 &&
                                                    <Row>
                                                        <Col xs="12" style={{ paddingTop: 10, paddingBottom: 10 }}>
                                                            {
                                                                <span style={{ fontSize: 14, fontWeight: 600 }}>Visit {metadata[2].providerTasks.length}: Completed</span>
                                                            }
                                                        </Col>
                                                        <Col xs="12">
                                                            {
                                                                metadata && metadata[2].nextVisitDate !== '' && (
                                                                    <span style={{ fontSize: 14, fontWeight: 600 }}>Next Visit Date: {moment(metadata && metadata[2].nextVisitDate).format('LL')}</span>
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

                            <Accordion className={metadata && metadata[3].status === 'COMPLETED' ? "isactive" : ""} expanded={metadata && metadata[3].isActiveForProvider === false ? false : panel3} onChange={handleChange(3)}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel2a-content"
                                    id="panel2a-header"
                                >
                                    <div className="forimage">
                                        <Typography className={classes.heading}> <img src={metadata && metadata[3].status === 'APPROVED' ? completed : verify} />APPROVAL</Typography>
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails>

                                    <Typography>
                                        <Row>
                                            <Col xs="12">
                                                {
                                                    metadata && metadata[3].updatedOn !== '' && (
                                                        <span style={{ fontSize: 14, fontWeight: 600 }}>Updated On: {moment(metadata && metadata[3].updatedOn).format('LL')}</span>
                                                    )
                                                }
                                            </Col>
                                        </Row>
                                        <Col xs="12">
                                            <span style={{ fontSize: 14, fontWeight: 600 }}>Visits pending for approval by the user:</span>
                                        </Col>
                                        <Col xs="12">
                                            <Row>
                                                {
                                                    metadata && metadata[3].completedTasks && metadata[3].completedTasks.length > 0 &&
                                                    <div xs="4" className="care-tasks">
                                                        <div className="care-tasks-thumbnail" style={{ backgroundColor: ' #5e2490' }}>
                                                            <p style={{ textAlign: 'center', alignSelf: 'center', fontSize: 30, color: '#fff' }}>Visit {metadata[3].completedTasks.length}</p>
                                                        </div>
                                                        {metadata[3].completedTasks[metadata[3].completedTasks.length - 1].userComments !== '' &&
                                                            <div>
                                                                <Col>
                                                                    <span style={{ fontSize: 12, fontWeight: 600 }}>User Comments: </span>
                                                                </Col>
                                                                <Col>
                                                                    <span className="font-title">{metadata[3].completedTasks[metadata[3].completedTasks.length - 1].userComments}</span>
                                                                </Col>
                                                            </div>}

                                                        <Col style={{ paddingTop: 10, marginLeft: -15 }}>
                                                            {
                                                                metadata[3].completedTasks[metadata[3].completedTasks.length - 1].approved ? (
                                                                    <Col cs="12">
                                                                        <span className="green-label">Approved</span>

                                                                    </Col>
                                                                ) : metadata[3].completedTasks[metadata[3].completedTasks.length - 1].disputed && (
                                                                    <Col cs="12">
                                                                        <span className="red-label">Disputed</span>
                                                                    </Col>
                                                                )
                                                            }
                                                        </Col>
                                                    </div>
                                                }
                                            </Row>
                                        </Col>
                                        {/* <Col>
                                            <span style={{ fontSize: 12, fontWeight: 600 }}>YOU WILL RECEIVE THE PAYMENT BY: {moment(billingDate).format('LL')}</span>
                                        </Col> */}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                        :
                        <div>
                            <div className="delight-bottom" style={{ textAlign: "unset", marginBottom: -40 }}>
                                {
                                    step == "additional" &&
                                    <div className="build-box">
                                        <p style={{ marginBottom: 30 }} className="bold text-center font16">Any additional expenses
                                    incurred which you would like to reimburse?</p>
                                        <Row>
                                            <Col xs="8">
                                                <p className="bold font14">Additional expenses incurred</p>
                                            </Col>
                                            <Col xs="1">
                                                <p className="bold font14">INR</p>
                                            </Col>
                                            <Col xs="3">
                                                <Input type="text" maxLength="7" name="additionalExpense" id="additionalExpense" value={additionalExpenses} onChange={onChangeAmount} placeholder="0.00" className="big-input"></Input>
                                            </Col>
                                        </Row>
                                        <br />
                                        <div className="text-center width100">
                                            {/* <a className="hamper-button">Upload Receipts</a> */}
                                            <ImageUploading
                                                multiple
                                                value={bills}
                                                onChange={onChange}
                                                maxNumber={69}
                                                dataURLKey="data_url"
                                            >
                                                {({
                                                    imageList,
                                                    onImageUpload,
                                                    onImageRemoveAll,
                                                    onImageUpdate,
                                                    onImageRemove,
                                                    isDragging,
                                                    dragProps
                                                }) => (
                                                        <div>
                                                            <Button className="btn btn-primary" onClick={onImageUpload} >Upload Receipts</Button>
                                                            <Row style={{marginTop: 20}}>
                                                                {
                                                                    imageList.map((pic, index) =>
                                                                        <Col key={index} xs="4">
                                                                            <div className="relative">
                                                                                <img className="upload-preview" src={pic.data_url} />
                                                                                <img onClick={() => onImageRemove(index)} className="preview-close pointer" src={closeicon} />
                                                                            </div>
                                                                        </Col>

                                                                    )

                                                                }
                                                            </Row>
                                                        </div>
                                                    )}
                                            </ImageUploading>


                                        </div>
                                    </div>
                                }
                                {
                                    step == "comments" &&
                                    <div className="build-box">
                                        <p className="bold text-center font16">Any service completion comments?</p>
                                        <br />
                                        <textarea name="providerComments" onChange={onChangeText} rows="4" style={{ width: "100%", padding: 10 }}>

                                        </textarea>

                                    </div>
                                }
                                {
                                    step == "nextDate" &&
                                    <div className="text-center">
                                        <img style={{ width: 70, marginBottom: 5 }} src={calendar} />
                                        <p className="bold font16">When is the next scheduled visit?</p>
                                        <p className="font-title">Please select the next visit date.</p>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <Grid container justify="space-around">
                                                <KeyboardDatePicker
                                                    margin="normal"
                                                    minDate={new Date()}
                                                    disablePast={true}
                                                    id="date-picker"
                                                    label="Select date"
                                                    clearLabel
                                                    value={nextDate}
                                                    onChange={(event) => onDateChange(event)}
                                                />
                                            </Grid>
                                        </MuiPickersUtilsProvider>
                                        <br />
                                        <br />
                                    </div>
                                }
                                {
                                    step == "summary" &&
                                    <div className="summary" style={{ paddingTop: 0 }}>
                                        <div style={{ padding: "16px 25px" }}>
                                            <Row>
                                                <Col xs="1">

                                                </Col>
                                                <Col xs="11">
                                                    <p className="bold font16">Summary</p>
                                                </Col>
                                            </Row>
                                        </div>
                                        <div style={{ padding: 30 }}>
                                            <Row>
                                                <Col md="1">

                                                </Col>
                                                <Col md="7">
                                                    {
                                                        <div>
                                                            <p className="font-title bold font14">Uploaded Receipts:</p>
                                                            <Row>
                                                                {
                                                                    bills.length > 0 &&
                                                                    bills.map((pic, index) =>
                                                                        <Col xs="4">
                                                                            <div className="relative">
                                                                                <img className="upload-preview" src={pic.data_url} />
                                                                                {/* <img onClick={() => this.deleteBill(index)} className="preview-close" src={closeicon} /> */}
                                                                            </div>
                                                                        </Col>

                                                                    )

                                                                }
                                                            </Row>
                                                            <br />
                                                            <p className="font-title bold">Completion comments:</p>
                                                            <p className="font-title">{inProgressComment}</p>
                                                            <hr />
                                                            <Row>
                                                                <Col xs="9">
                                                                    <p className="bold">Additional expenses incurred</p>
                                                                </Col>
                                                                <Col xs="3">
                                                                    <p className="bold text-right">INR {additionalExpenses}</p>
                                                                </Col>
                                                            </Row>
                                                            <hr />
                                                            <Row>
                                                                <Col xs="7">
                                                                    <p className="bold" style={{fontSize:13}}>Next Visit Date</p>
                                                                </Col>
                                                                <Col xs="5">
                                                                    <p className="bold text-right" style={{fontSize:13}}>{moment(nextDate).format('LL')}</p>
                                                                </Col>
                                                            </Row>
                                                            <hr />
                                                            <br />
                                                            <a onClick={() => finishTask(visitIndex)} className="btn btn-primary">CONFIRM</a>
                                                            {/* <a onClick={this.toggleEdit} style={{ marginLeft: 10 }} className="hamper-button edit-button">Edit</a> */}
                                                            {
                                                                <Modal isOpen={isCompletionSuccess} role="dialog" autoFocus={true} centered={true}>
                                                                    <ModalBody>
                                                                        <div className="d-block">
                                                                            <p className="alert-heading text-center" style={{ color: 'green', fontSize:19 }}>Success</p>
                                                                            <p className="text-center">
                                                                                Status updated successfully
                                                                    </p>
                                                                            <div className="button-align">
                                                                                <Button onClick={() => { setCompletionSuccess(false); setServiceCompleted(false) }}>Ok</Button>
                                                                            </div>
                                                                        </div>
                                                                    </ModalBody>
                                                                </Modal>
                                                            }
                                                        </div>
                                                    }
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                }
                                {
                                    <Modal isOpen={isModalVisible}>
                                        <ModalBody>
                                            <p style={{fontSize:14}}><b>{modalTitle}</b></p>
                                            <p style={{ paddingTop: 10, fontSize:13}}>{modalDescription}</p>
                                            <div className="text-center">
                                                <Button onClick={() => { setIsModalVisible(false); setModalDescription(''); setModalTitle('') }}>Ok</Button>
                                            </div>
                                        </ModalBody>
                                    </Modal>
                                }
                            </div>
                            <div className="text-center">
                                {step == "additional" ? "" : <img onClick={prevStep} style={{ paddingRight: 15 }} className="go-button-left" src={left} />}
                                {step == "summary" ? "" : <img onClick={nextStep} style={{ paddingLeft: 15 }} className="go-button-right" src={right} />}
                            </div>
                        </div>
                    }
                </TabPane>
                <TabPane tabId='historyTab' className="p-3">
                    {
                        alphadata && alphadata.history && alphadata.history.map((month, index) =>
                    <div>
                        <Accordion className={month.isPaid ? "isactive" : ""} expanded={!month.paid && true} onChange={handleChange(2)}>
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
                                                            <span style={{ fontSize: 12 }}><b>Bills: </b>{billsData && billsData[index] && billsData[index].length > 0 ? '' : 'No Bills Uploaded'}</span>
                                                            <div className={imgClass.root}>
                                                                <GridList className={imgClass.gridList} cols={2.5}>
                                                                    {!_.isEmpty(billsData) && !_.isEmpty(billsData[index]) &&
                                                                        billsData[index].map((data, index) =>
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

        </div>
    );
}