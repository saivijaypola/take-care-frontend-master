import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    Container, Row, Col, Nav,
    NavItem,
    NavLink, TabContent,
    TabPane, Modal, Spinner, Button, Input, ModalBody
} from "reactstrap";
import ImageUploader from 'react-images-upload';

import closeicon from '../../images/icon/close.svg';
import DateTimePicker from 'react-datetime-picker';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import Checkbox from '@material-ui/core/Checkbox';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import profile from "../../assets/images/client/05.jpg";
import marker from "../../images/icon/marker.png";
import calendar from "../../images/icon/calendar_b.svg";
import go from "../../images/icon/go.png";
import left from "../../images/icon/left.png";
import right from "../../images/icon/right.png";
import back from "../../images/icon/back.png";
import user from "../../images/icon/user-6.png";
import { RequestActions, ProfileAction } from "../../redux/actions";
import { v4 as uuidv4 } from 'uuid';
import { getDistance } from 'geolib';
import firebase from "firebase"
import csc from 'country-state-city'
import axios from "axios";
import ChatButton from '../../components/Shared/Chat/ChatButton';
import UploadPicture from "../../handler/fileUploadBills";
import UploadWork from "../../handler/fileUploadWork";
import { th } from 'date-fns/locale';

const assetsBaseUrl = process.env.REACT_APP_ASSETS_BASE_URL
class RequesMain extends Component {

    constructor(props) {
        super(props)

        this.state = {
            advanceAmount: '0.00',
            bills: [],
            pictures: [],
            totalAmount: '0.00',
            providerFeedback: '',
            providerComments: "",
            additionalExpense: 0.00,
            balanceAmount: "0.00",
            isModalVisible: false,
            step: "additional",
            chatId: "",
            terms: "",
            describe: "",
            explain: "",
            payableOnCompletion: '',
            countries: [],
            myCountryCode: '+91',
            serviceOrderId: '',
            chars_left: 240,
            modalTitle: '',
            modalDesc: '',
            phoneNumber: '',
            displayDate: new Date(),
            possibleDate: new Date((new Date().getTime() + 86400000)).toISOString().slice(0, -8),
            editMode: false,
            uploadprogress: 0,
            filePath: [],
            workPath: [],
            isSuccess: false,
            timeline: []
        }
        this.onDrop = this.onDrop.bind(this);
        this.onDrop2 = this.onDrop2.bind(this);
        this.handleCharCount = this.handleCharCount.bind(this)
        this.onChangeText = this.onChangeText.bind(this)
        this.updateRequest = this.updateRequest.bind(this)
        this.onDateChange = this.onDateChange.bind(this)
        this.getGeoInfo = this.getGeoInfo.bind(this)
        this.setCode = this.setCode.bind(this)
        this.onChangeCountryCode = this.onChangeCountryCode.bind(this)
        this.prevStep = this.prevStep.bind(this)
        this.nextStep = this.nextStep.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.summaryEdit = this.summaryEdit.bind(this)
        this.deleteBill = this.deleteBill.bind(this)
        this.addFilePathsToFirebase = this.addFilePathsToFirebase.bind(this)
        this.addWorkPathsToFirebase = this.addWorkPathsToFirebase.bind(this)
        this.onConfirmBills = this.onConfirmBills.bind(this)
        this.onConfirmWork = this.onConfirmWork.bind(this)
        this.confirmRequest = this.confirmRequest.bind(this)
    }
    getGeoInfo = async () => {
        var response = await axios.get('https://ipapi.co/json')
        console.log(response.data.country_calling_code.toString())
        if (response.data.country_calling_code) {
            this.setCode(response.data.country_calling_code)
        }
    };
    summaryEdit() {
        this.setState({
            editMode: !this.state.editMode
        })
    }
    deleteBill(index) {
        var bills = this.state.bills
        bills.splice(index, 1);
        this.setState({
            bills: bills,
        });
    }
    deletePicture(index) {
        var pictures = this.state.pictures
        pictures.splice(index, 1);
        this.setState({
            pictures: pictures,
        });
    }
    onDrop(picture) {
        this.setState({
            bills: picture,
        }, () => {
            console.log('BILLS', this.state.bills)
        });
    }
    onDrop2(picture) {
        this.setState({
            pictures: picture,
        }, () => {
            console.log('WORK', this.state.pictures)
        });
    }
    onConfirmBills() {
        if (this.state.bills.length > 0) {
            var that = this
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {

                    user.getIdToken().then(function (idToken) {
                        for (var i = 0; i < that.state.bills.length; i++) {
                            UploadPicture.upload(that.state.bills[i], {
                                "providerId": localStorage.getItem('userId'),
                                "orderId": that.props.orderDetails && that.props.orderDetails.orderId,
                                "idType": "Bill",
                            }, user, (event) => {
                                that.setState({
                                    uploadprogress: (Math.round((100 * event.loaded) / event.total))
                                }, () => {
                                    console.log('UPLOAD PROGRESS', that.state.uploadprogress)
                                });
                            }).then((response) => {
                                console.log('RESPONSE', response)
                                if (response.data.data && response.data.data) {
                                    var files = that.state.filePath
                                    files.push(`Users/${localStorage.getItem('userId')}/Bills/${that.props.orderDetails.orderId}/${response.data.data[0]}`)
                                    that.setState({
                                        filePath: files
                                    }, () => {
                                        console.log('FILE', that.state.filePath)
                                    })
                                }
                            })
                        }

                    })
                }
            })
        }
    }

    onConfirmWork() {
        if (this.state.pictures.length > 0) {
            var that = this
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {

                    user.getIdToken().then(function (idToken) {
                        for (var i = 0; i < that.state.pictures.length; i++) {
                            UploadWork.upload(that.state.pictures[i], {
                                "providerId": localStorage.getItem('userId'),
                                "orderId": that.props.orderDetails && that.props.orderDetails.orderId,
                                "idType": "Work",
                            }, user, (event) => {
                                that.setState({
                                    uploadprogress: (Math.round((100 * event.loaded) / event.total))
                                }, () => {
                                    console.log('UPLOAD PROGRESS', that.state.uploadprogress)
                                });
                            }).then((response) => {
                                console.log('RESPONSE', response)
                                if (response.data.data && response.data.data) {
                                    var files = that.state.workPath
                                    files.push(`Users/${localStorage.getItem('userId')}/Work/${that.props.orderDetails.orderId}/${response.data.data[0]}`)
                                    that.setState({
                                        workPath: files
                                    }, () => {
                                        console.log('FILE', that.state.workPath)
                                    })
                                }
                            })
                        }

                    })
                }
            })
        }
    }

    prevStep() {
        window.scrollTo(0, 0)
        switch (this.state.step) {
            case "pow":
                this.setState({
                    step: "additional"
                })
                break;
            case "comments":
                this.setState({
                    step: "pow"
                })
                break;
            case "summary":
                this.setState({
                    step: "comments"
                })
                break;
        }
    }
    nextStep() {
        window.scrollTo(0, 0)
        switch (this.state.step) {
            case "additional":
                this.onConfirmBills()
                if (this.state.additionalExpense === '') {
                    this.setState({
                        additionalExpense: "0.00"
                    })
                }
                this.setState({
                    step: "pow"
                })
                break;
            case "pow":
                this.onConfirmWork()
                this.addFilePathsToFirebase()

                this.setState({
                    step: "comments"
                })
                break;
            case "comments":
                this.addWorkPathsToFirebase()
                this.setState({
                    step: "summary"
                })
                break;
        }
    }
    handleChange(event) {
        console.log(event)
        this.setState({
            [event.target.name]: event.target.value
        })
    };
    setCode(code) {
        this.setState({
            myCountryCode: code
        })
    }
    onChangeCountryCode(event) {
        this.setState({
            myCountryCode: event.target.value
        })
    }
    handleCharCount(event) {
        if (event.target.value.length < 241) {
            this.setState({
                chars_left: 240 - event.target.value.length,
                [event.target.name]: event.target.value
            });
        }

    }
    onSuccessNavigation() {
        this.props.history.push(`/provider/timeline/${this.props.match.params.requestid}/${this.props.match.params.userId}`)
    }
    onDateChange = (name, event) => {
        const target = event.target; // Do we need this?(unused in the function scope)!

        this.setState({
            [name]: event.target.value
        }, () => {

            // Prints the new value.
        });
    };
    addFilePathsToFirebase() {

        const orderMetaRef = firebase.database().ref(`Orders/${this.props.orderDetails.orderId}/Bills`);

        orderMetaRef.set(this.state.filePath);
    }
    addWorkPathsToFirebase() {

        const workMetaRef = firebase.database().ref(`Orders/${this.props.orderDetails.orderId}/Work`);

        workMetaRef.set(this.state.workPath);
    }
    componentDidMount() {
        var countries = csc.getAllCountries()
        this.setState({
            countries: countries
        })
        if (this.props && this.props.userDetails && this.props.userDetails.countryCode) {
            this.setState({
                myCountryCode: this.props.userDetails.countryCode
            })
        } else {
            this.getGeoInfo()
        }
        this.props.enableChat({
            chatid: uuidv4(),
            requestId: this.props.match.params.requestid,
            userid: this.props.match.params.userId,
            providerid: localStorage.getItem('userId'),
            isactive: true
        })
        const { chatId } = this.props
        if (localStorage.getItem('userId')) {
            this.props.getRequestDetails({
                requestId: this.props.match.params.requestid
            })

            this.props.getServiceDetails({
                requestid: this.props.match.params.requestid, providerid: localStorage.getItem('userId')
            })
            if (this.props && this.props.userDetails) {
                this.setState({
                    phoneNumber: this.props.userDetails && this.props.userDetails.phoneNumber
                })
            }


        }


    }

    onChangeText(event) {

        this.setState({
            [event.target.name]: event.target.value
        }, () => {

            //var bal = parseFloat(this.state.actualExpense) + parseFloat(this.props.serviceDetails && this.props.serviceDetails.orderTotalAmount) - parseFloat(this.props.serviceDetails && this.props.serviceDetails.advanceAmount)*2
            var bal = parseFloat(this.state.additionalExpense) + parseFloat(this.props.serviceDetails && this.props.serviceDetails.orderTotalAmount) - parseFloat(this.props.serviceDetails && this.props.serviceDetails.advanceAmount)
            this.setState({
                balanceAmount: isNaN(bal) ? '0.00' : bal.toString()
            })
        })
    }

    confirmRequest() {
        var claimData = {
            body: {
                "orderId": this.props.orderDetails && this.props.orderDetails.orderId,
                "workStatus": "Completed",
                "claimAmount": parseFloat(this.state.additionalExpense).toFixed(2),
                "providerCurrency": "INR"
            },
            serviceOrderId: this.props.serviceDetails && this.props.serviceDetails.serviceOrderId
        }
        this.props.addOrderClaim(claimData)
        this.setState({
            isSuccess: true
        })
        var orderTimeline = []
        var orderMetadata = ''
        const metadataRef = firebase.database().ref(this.props.chatId + '/Metadata');
        console.log('CHAT ID', this.props.chatId)
        metadataRef.once('value', snapshot => {
            orderMetadata = snapshot.val();

            //Update Order Basic Info
            //orderData.orderStatus= 'Completed'

            //Update timeline
            orderTimeline = orderMetadata.timeline
            orderTimeline[3].status = 'Completed'
            orderTimeline[3].updatedOn = new Date()
            orderTimeline[4].isActiveForUser = true


        })
        metadataRef.update(orderMetadata)

        //const metadataRef = firebase.database().ref(chatId + '/Metadata/timeline');


    }

    updateRequest() {
        const { serviceDetails, requestDetails } = this.props
        if (serviceDetails == null) {
            this.setState({
                providerFeedback: "About Me: " + this.state.explain + "\n" + "Comments: " + this.state.describe + "\n" +
                    "Quote terms: " + this.state.terms
            })
            var providerFeedback = "About Me: " + this.state.explain + "\n" + "Comments: " + this.state.describe + "\n" +
                "Quote terms: " + this.state.terms
        } else {
            var providerFeedback = this.state.providerFeedback
        }

        if (this.props.userDetails.avatarUrl == "") {
            if (this.state.advanceAmount && this.state.advanceAmount > 0) {
                this.setState({
                    modalDesc: "Please update your profile picture before proceeding",
                    modalTitle: "",
                    isModalVisible: true,
                })
            } else {
                this.setState({
                    modalDesc: "Please update your profile picture before proceeding",
                    modalTitle: "",
                    isModalVisible: true,
                    advanceAmount: '0'
                })
            }

        }
        else if (this.state.payableOnCompletion && this.state.phoneNumber && this.state.advanceAmount && requestDetails) {
            if (isNaN(this.state.payableOnCompletion) || isNaN(this.state.phoneNumber) || isNaN(this.state.advanceAmount) || this.state.phoneNumber.length != 10 || parseFloat(this.state.totalAmount) < 0) {
                if (this.state.advanceAmount && this.state.advanceAmount > 0) {
                    this.setState({
                        modalDesc: "Please enter a valid amount and contact number",
                        modalTitle: "Please Enter Valid Details",
                        isModalVisible: true
                    })
                } else {
                    this.setState({
                        modalDesc: "Please enter a valid amount and contact number",
                        modalTitle: "Please Enter Valid Details",
                        isModalVisible: true,
                        advanceAmount: '0'
                    }, () => {

                        var bal = parseFloat(this.state.payableOnCompletion) + parseFloat(this.state.advanceAmount)
                        this.setState({
                            totalAmount: isNaN(bal) ? '0.00' : bal.toString()
                        })
                    })
                }

            }
            else {
                if (new Date(this.state.possibleDate) >= new Date()) {
                    var countryCode = requestDetails && requestDetails.tblUserByUserId && requestDetails.tblUserByUserId.countryCode && requestDetails.tblUserByUserId.countryCode.substring(1)
                    var phoneNumber = requestDetails && requestDetails.tblUserByUserId && requestDetails.tblUserByUserId.phoneNumber && requestDetails.tblUserByUserId.phoneNumber.substring(requestDetails.tblUserByUserId.phoneNumber.length - 10)
                    var params = {
                        "serviceid": serviceDetails && serviceDetails.serviceOrderId ? serviceDetails.serviceOrderId : uuidv4(),
                        "requestid": this.props.match.params.requestid,
                        "userid": this.props.match.params.userId,
                        "providerid": localStorage.getItem('userId'),
                        "order_total_amount": parseFloat(this.state.totalAmount.toString().trim()),
                        "advance_amount": parseFloat(this.state.advanceAmount.toString().trim()),
                        "amount_paid": 0.00,
                        "payment_method": "Bank",
                        "countryCode": this.state.myCountryCode.toString(),
                        "phone_number": this.state.phoneNumber.trim(),
                        "phoneNumber": countryCode + "" + phoneNumber,
                        "service_needed_on": this.state.possibleDate,
                        "provider_comments": providerFeedback.trim(),
                        "user_comments": "",
                        "order_status": "Pending",
                        "userEmail": requestDetails && requestDetails.tblUserByUserId && requestDetails.tblUserByUserId.email,
                        "userName": requestDetails && requestDetails.tblUserByUserId && requestDetails.tblUserByUserId.fullname,
                        "requestTitle": requestDetails.title,
                        "providerName": localStorage.getItem('fullName').toString()
                    }

                    this.props.sendQuote(params)

                } else {
                    this.setState({
                        modalDesc: "Please enter a valid date",
                        modalTitle: "Selected date is a past date",
                        isModalVisible: true
                    })
                }

            }
        }
        else {
            if (this.state.advanceAmount && this.state.advanceAmount > 0) {
                this.setState({
                    modalDesc: "Please enter a valid amount and contact number",
                    modalTitle: "Please Enter Valid Details",
                    isModalVisible: true
                })
            } else {
                this.setState({
                    modalDesc: "Please enter a valid amount and contact number",
                    modalTitle: "Please Enter Valid Details",
                    isModalVisible: true,
                    advanceAmount: '0'
                }, () => {

                    var bal = parseFloat(this.state.payableOnCompletion) + parseFloat(this.state.advanceAmount)
                    this.setState({
                        totalAmount: isNaN(bal) ? '0.00' : bal.toString()
                    })
                })
            }

        }

    }
    initializeTimeline() {
        if (this.props.chatId) {
            const { chatId } = this.props
            if (chatId) {
                const metadataRef = firebase.database().ref(chatId + '/Metadata');
                metadataRef.on('value', snapshot => {
                    const getMetadata = snapshot.val();

                    this.setState({
                        metadata: getMetadata
                    })
                })
            }
        }
    }
    componentDidUpdate(prevProps) {

        const { chatId, isRequestUpdated, serviceDetails, failedToSendQuote, orderClaimId } = this.props

        if (prevProps.isRequestUpdated !== isRequestUpdated && isRequestUpdated) {
            this.props.history.push(`/send-quote-success/${this.props.match.params.requestid}/${this.props.match.params.userId}`)
            this.setState({
                modalDesc: "Your quote has been sent",
                modalTitle: "",
                editing: false,
                isModalVisible: true
            })

            this.props.getServiceDetails({
                requestid: this.props.match.params.requestid, providerid: localStorage.getItem('userId')
            })
            this.setState({
                isModalVisible: true
            })
        }
        if (prevProps.serviceDetails !== serviceDetails) {
            this.props.getOrderDetails({ serviceorderid: serviceDetails && serviceDetails.serviceOrderId })
        }
        if (prevProps.serviceDetails === null && !isRequestUpdated && prevProps.failedToSendQuote !== this.props.failedToSendQuote && failedToSendQuote === true) {
            this.setState({
                modalDesc: "Failed to send quote",
                modalTitle: "Check your intenet connection",
                editing: true,
                isModalVisible: true
            })
        }
        if (prevProps.userDetails !== this.props.userDetails) {
            this.setState({
                phoneNumber: this.props.userDetails && this.props.userDetails.phoneNumber
            })
        }
        if (chatId !== prevProps.chatId) {
            if (chatId) {
                this.initializeTimeline()
            }
        }
        if (prevProps.orderClaimId !== orderClaimId) {
            if (orderClaimId === 0) {
                //Failed
            } else {
                //Success
            }
        }

    }
    render() {

        const { requestDetails, serviceDetails, isRequestDetailsLoading, isRequestUpdating, selectedLocation, myCountryCode } = this.props
        return (
            <div>
                <React.Fragment>
                    <div className="provider-top-bar" style={{ zIndex: 101 }}>
                        <Container>
                            <Row>
                                <Col onClick={() => this.props.history.push(`/provider/request-details/${this.props.match.params.requestid}/${this.props.match.params.userId}`)} xs="2" md='1' className="relative">
                                    <Row>
                                        <img src={back} />
                                        <span>Back</span>
                                    </Row>
                                </Col>
                                <Col xs='1' md='1'></Col>
                                <Col xs="9" md='10'>
                                    <h6 style={{ fontSize: 18 }} className="bold">{requestDetails && requestDetails.title}</h6>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                    <Container className="relative rise-card2" style={{ marginTop: 165 }}>
                        {this.state.step == "summary"
                            ?
                            <div className="summary" style={{ paddingTop: 0, backgroundColor:"#f8f8f8" }}>
                                <div style={{ padding: "16px 25px" }}>
                                    <Row>
                                        <Col xs="1">

                                        </Col>
                                        <Col xs="11">
                                            <p className="font16 bold">Summary</p>
                                        </Col>
                                    </Row>
                                </div>
                                <div style={{ padding: 30 }}>
                                    <Row>
                                        <Col md="1">

                                        </Col>
                                        <Col md="7">
                                            {
                                                this.state.edit
                                                    ?
                                                    <div>
                                                        <h6 className="font-title bold">Completion comments:</h6>
                                                        <textarea rows="4" value={this.state.providerComments} onChange={this.handleChange} className="form-control" name="providerComments" type="text" >
                                                        </textarea>


                                                        <br />

                                                        <br />

                                                        <br />
                                                        {
                                                            this.state.editPost
                                                                ?
                                                                <a onClick={this.updateRequest} className="hamper-button">Update</a>
                                                                :
                                                                <a onClick={this.toggleEdit} className="hamper-button">Save</a>
                                                        }

                                                    </div>
                                                    :
                                                    <div>
                                                        <h6 className="font-title bold">Documents uploaded:</h6>
                                                        <Row>
                                                            {
                                                                this.state.pictures.length > 0 &&
                                                                this.state.pictures.map((pic, index) =>
                                                                    <Col xs="4">
                                                                        <div className="relative">
                                                                            <img className="upload-preview" src={URL.createObjectURL(pic)} />
                                                                            {/* <img onClick={() => this.deleteBill(index)} className="preview-close" src={closeicon} /> */}
                                                                        </div>
                                                                    </Col>

                                                                )

                                                            }
                                                        </Row>
                                                        <br />
                                                        <h6 className="font-title bold">Receipts:</h6>
                                                        <Row>
                                                            {
                                                                this.state.bills.length > 0 &&
                                                                this.state.bills.map((pic, index) =>
                                                                    <Col xs="4">
                                                                        <div className="relative">
                                                                            <img className="upload-preview" src={URL.createObjectURL(pic)} />
                                                                            {/* <img onClick={() => this.deleteBill(index)} className="preview-close" src={closeicon} /> */}
                                                                        </div>
                                                                    </Col>

                                                                )

                                                            }
                                                        </Row>
                                                        <br />
                                                        <h6 className="font-title bold">Completion comments:</h6>
                                                        <p className="font-title">{this.state.providerComments}</p>
                                                        <hr />
                                                        <h6 className="font-title bold">Payment Summary</h6>
                                                        <p className="font-title bold">{this.state.description}</p>
                                                        <Row>
                                                            <Col xs="9">
                                                                <h6 className="bold font-title">Advance for purchase of any items</h6>
                                                            </Col>
                                                            <Col xs="3">
                                                                <h6 className="bold text-right">Rs. {serviceDetails && serviceDetails.advanceAmount}</h6>
                                                            </Col>
                                                            <Col xs="9">
                                                                <h6 className="bold font-title">Service charge</h6>
                                                            </Col>
                                                            <Col xs="3">
                                                                <h6 className="bold text-right">Rs. {parseFloat(serviceDetails && serviceDetails.orderTotalAmount) - parseFloat(serviceDetails && serviceDetails.advanceAmount)}</h6>
                                                            </Col>
                                                            <Col xs="9">
                                                                <p className="bold font14">Total</p>
                                                            </Col>
                                                            <Col xs="3">
                                                                <p className="bold font14 text-right">Rs. {serviceDetails && serviceDetails.orderTotalAmount}</p>
                                                            </Col>
                                                            <Col xs="9">
                                                                <p className="bold font14">Additional expenses incurred</p>
                                                            </Col>
                                                            <Col xs="3">
                                                                <p className="bold font14 text-right">Rs. {this.state.additionalExpense}</p>
                                                            </Col>
                                                            <Col xs="9">
                                                                <p className="bold font14">Balance Amount</p>
                                                            </Col>
                                                            <Col xs="3">
                                                                <p className="bold font14 text-right">Rs. {this.state.balanceAmount}</p>
                                                            </Col>
                                                        </Row>
                                                        <hr />
                                                        <br />
                                                        <a onClick={this.confirmRequest} className="hamper-button">CONFIRM</a>
                                                        {/* <a onClick={this.toggleEdit} style={{ marginLeft: 10 }} className="hamper-button edit-button">Edit</a> */}
                                                        {
                                                            <Modal isOpen={this.state.isSuccess} role="dialog" autoFocus={true} centered={true}>
                                                                <ModalBody>
                                                                    <div className="d-block">
                                                                        <p className="alert-heading text-center" style={{ color: 'green', fontWeight:"bold", fontSize:18}}>Success</p>
                                                                        <p className="text-center" style={{ fontSize:18, fontWeight:"bold"}}>
                                                                            Status updated successfully
                                                                    </p>
                                                                        <div className="button-align">
                                                                            <Button onClick={() => this.onSuccessNavigation()}>Okay</Button>
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
                            :
                            <div className="delight-bottom" style={{ textAlign: "unset" }}>
                                {
                                    this.state.step == "additional" &&
                                    <div className="build-box">
                                        <p className="font16 bold text-center">Any additional expenses incurred which you would like to reimburse?</p>
                                        <Row>
                                            <Col xs="8">
                                                <h6 className="bold font-title">Advance for purchase of any items</h6>
                                            </Col>
                                            <Col xs="4">
                                                <h6 className="bold text-right">Rs. {serviceDetails && serviceDetails.advanceAmount}</h6>
                                            </Col>
                                            <Col xs="8">
                                                <h6 className="bold font-title">Service charge</h6>
                                            </Col>
                                            <Col xs="4">
                                                <h6 className="bold text-right">Rs. {parseFloat(serviceDetails && serviceDetails.orderTotalAmount) - parseFloat(serviceDetails && serviceDetails.advanceAmount)}</h6>
                                            </Col>
                                            <Col xs="8">
                                                <p className="bold font14">Total</p>
                                            </Col>
                                            <Col xs="4">
                                                <p className="font14 bold text-right">Rs. {serviceDetails && serviceDetails.orderTotalAmount}</p>
                                            </Col>
                                            <Col xs="8">
                                                <p className="font14 bold">Additional expenses incurred</p>
                                            </Col>
                                            <Col xs="1">
                                                <p className="font14 bold">Rs.</p>
                                            </Col>
                                            <Col xs="3">
                                                <Input type="text" maxLength="7" name="additionalExpense" id="additionalExpense" value={this.state.additionalExpense} onChange={this.onChangeText} placeholder="0.00" className="big-input"></Input>
                                            </Col>
                                            <Col xs="8">
                                                <p className="font14 bold">Balance Amount</p>
                                            </Col>
                                            <Col xs="4">
                                                <p className="font14 bold text-right">Rs. {this.state.balanceAmount}</p>
                                            </Col>
                                        </Row>
                                        <br />
                                        <div className="text-center width100">
                                            {/* <a className="hamper-button">Upload Receipts</a> */}
                                            <ImageUploader
                                                withIcon={false}
                                                buttonText='Upload Receipts'
                                                buttonClassName='hamper-button'
                                                withPreview={false}
                                                withLabel={false}
                                                onChange={this.onDrop}
                                                imgExtension={['.jpg', '.gif', '.png', '.gif', '.jpeg']}
                                                maxFileSize={5242880}
                                            />
                                            <Row>
                                                {
                                                    this.state.bills.length > 0 &&
                                                    this.state.bills.map((pic, index) =>
                                                        <Col xs="4">
                                                            <div className="relative">
                                                                <img className="upload-preview" src={URL.createObjectURL(pic)} />
                                                                <img onClick={() => this.deleteBill(index)} className="preview-close" src={closeicon} />
                                                            </div>
                                                        </Col>

                                                    )

                                                }
                                            </Row>

                                        </div>
                                        {/* <span className="font-title char-limit" style={{ paddingLeft: 5, fontSize: 10 }}>{this.state.chars_left}/240</span> */}
                                    </div>
                                }
                                {
                                    this.state.step == "pow" &&
                                    <div className="build-box">
                                        <p className="font16 bold text-center">Do you have any images to
                                    upload as a proof of work completion?</p>
                                        <br />
                                        <div className="text-center width100">
                                            <ImageUploader
                                                withIcon={false}
                                                buttonText='Upload Images'
                                                buttonClassName='hamper-button'
                                                withPreview={false}
                                                withLabel={false}
                                                onChange={this.onDrop2}
                                                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                                                maxFileSize={5242880}
                                            />
                                            <Row>
                                                {
                                                    this.state.pictures.length > 0 &&
                                                    this.state.pictures.map((pic, index) =>
                                                        <Col xs="4">
                                                            <div className="relative">
                                                                <img className="upload-preview" src={URL.createObjectURL(pic)} />
                                                                <img onClick={() => this.deletePicture(index)} className="preview-close" src={closeicon} />
                                                            </div>
                                                        </Col>

                                                    )

                                                }
                                            </Row>
                                        </div>

                                    </div>
                                }
                                {
                                    this.state.step == "comments" &&
                                    <div className="build-box">
                                        <p className="font16 bold text-center">Any service completion comments?</p>
                                        <br />
                                        <textarea name="providerComments" onChange={this.onChangeText} rows="4" style={{ width: "100%" }}>

                                        </textarea>

                                    </div>
                                }
                            </div>
                        }
                        <div className="text-center" style={{backgroundColor:"#f8f8f8"}}>
                            {this.state.step == "additional" ? "" : <img onClick={this.prevStep} style={{ paddingRight: 15 }} className="go-button-left" src={left} />}
                            {this.state.step == "summary" ? "" : <img onClick={this.nextStep} style={{ paddingLeft: 15 }} className="go-button-right" src={right} />}
                        </div>

                    </Container>
                </React.Fragment>




                {
                    isRequestDetailsLoading || isRequestUpdating && (
                        <Modal className="spinner-modal" isOpen={true}>
                            <Spinner style={{ margin: "10px auto" }} animation="border" />
                        </Modal>
                    )
                }
                <Modal isOpen={this.state.isModalVisible}>
                    <ModalBody>
                        <div style={{ textAlign: 'center' }}>
                            <h6 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 1, color: '#861b8d' }}>{this.state.modalTitle}</h6>
                            <p>{this.state.modalDesc}</p>
                            <Button onClick={() => this.setState({ isModalVisible: false, modalMessage: '', modalDescription: '' })}>Close</Button>
                        </div>
                    </ModalBody>
                </Modal>
            </div >
        )
    }
}

const mapStateToProps = (state) => ({
    requestDetails: state.request.requestDetails,
    serviceDetails: state.request.serviceDetails,
    isRequestDetailsLoading: state.request.isRequestDetailsLoading,
    isRequestUpdating: state.request.isRequestUpdating,
    isRequestUpdated: state.request.isRequestUpdated,
    chatId: state.request.chatId,
    selectedLocation: state.profile.selectedLocation,
    userDetails: state.profile.userDetails,
    failedToSendQuote: state.request.failedToSendQuotem,
    orderDetails: state.request.orderDetails,
    orderClaimId: state.request.orderClaimId,
})

const mapDispatchToProps = {
    ...RequestActions,
    ...ProfileAction
}

export default connect(mapStateToProps, mapDispatchToProps)(RequesMain)
