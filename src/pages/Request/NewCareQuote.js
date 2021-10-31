import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    Container, Row, Col, Nav,
    NavItem,
    NavLink, TabContent,
    TabPane, Modal, Spinner, Button, Input, ModalBody
} from "reactstrap";
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
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
    KeyboardDateTimePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

const assetsBaseUrl = process.env.REACT_APP_ASSETS_BASE_URL
class RespondCare extends Component {

    constructor(props) {
        super(props)

        this.state = {
            advanceAmount: '0.00',
            totalAmount: '0.00',
            providerFeedback: '',
            isModalVisible: false,
            nature: false,
            step: "describe",
            chatId: "",
            terms: "",
            describe: "",
            // explain: this.props.userDetails.aboutme,
            explain: '',
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
            editMode: false

        }
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
    prevStep() {
        window.scrollTo(0, 0)
        switch (this.state.step) {
            case "maintenance":
                this.setState({
                    step: "describe"
                })
                break;
            case "summary":
                this.setState({
                    step: "maintenance"
                })
                break;
        }
    }
    nextStep() {
        window.scrollTo(0, 0)
        switch (this.state.step) {
            case "maintenance":
                if (this.state.advanceAmount === '') {
                    this.setState({
                        advanceAmount: '0.00'
                    })
                }
                if (this.state.payableOnCompletion === '') {
                    this.setState({
                        modalTitle: "",
                        modalDesc: "Please fill charges to deliver this services",
                        isModalVisible: true
                    })
                } else if (this.state.terms === '') {
                    this.setState({
                        modalTitle: "",
                        modalDesc: "Please mention your terms for this service.",
                        isModalVisible: true
                    })
                } else {
                    this.setState({
                        step: "summary"
                    })
                }

                break;
            case "describe":
                if (this.state.describe !== '') {
                    this.setState({
                        step: "maintenance"
                    })
                } else {
                    this.setState({
                        modalTitle: "",
                        modalDesc: "Brief description required ",
                        isModalVisible: true
                    })
                }
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

    onDateChange = (name, event) => {
        const target = event.target; // Do we need this?(unused in the function scope)!
        this.setState({
            [name]: event
        }, () => {
        });
    };
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

            var bal = parseFloat(this.state.payableOnCompletion) + parseFloat(this.state.advanceAmount)
            this.setState({
                totalAmount: isNaN(bal) ? '0.00' : bal.toString()
            })
        })
    }

    updateRequest() {
        const { serviceDetails, requestDetails } = this.props
        if (serviceDetails == null) {
            this.setState({
                providerFeedback: "Comments: " + this.state.describe + "\n" + "Quote terms: " + this.state.terms
            })
            var providerFeedback = "Comments: " + this.state.describe + "\n" + "Quote terms: " + this.state.terms
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

        const { chatId, isRequestUpdated, serviceDetails, failedToSendQuote } = this.props

        if (prevProps.isRequestUpdated !== isRequestUpdated && isRequestUpdated) {
            this.props.history.push(`/send-care-quote-success/${this.props.match.params.requestid}/${this.props.match.params.userId}`)
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

    }
    render() {
        const { requestDetails, serviceDetails, isRequestDetailsLoading, isRequestUpdating, selectedLocation, myCountryCode } = this.props
        console.log('REQ DET', requestDetails);
        return (
            <div>
                <React.Fragment>
                    <div className="provider-top-bar">
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
                    <Container className="relative" style={{ paddingTop: 50, paddingBottom: 50 }}>
                        <div className="delight-bottom card-shadow" style={{ textAlign: "unset" }}>
                            {
                                this.state.step == "describe" &&
                                <div className="build-box">
                                    <br />
                                    <h6 className="bold text-center">Briefly describe how you will handle this service request</h6>
                                    <textarea rows="3" className="big-input" name="describe" value={this.state.describe} id="describe" onChange={this.handleCharCount} placeholder="Write your comments here"></textarea>
                                    {/* <span className="font-title char-limit" style={{ paddingLeft: 5, fontSize: 10 }}>{this.state.chars_left}/240</span> */}
                                </div>
                            }
                            {
                                this.state.step == "maintenance" &&
                                <div className="build-box">
                                    <h6 className="bold text-center">Please mention the amount you will charge per visit</h6>
                                    <Input type="number" maxLength="7" name="payableOnCompletion" id="payableOnCompletion" value={this.state.payableOnCompletion} onChange={this.onChangeText} placeholder="Rs. 0.00" className="big-input"></Input>
                                    <br />
                                    <h6 className="bold text-center">Please mention any terms you may have for the service charge stated above.</h6>
                                    <textarea rows="3" className="big-input" name="terms" value={this.state.terms} id="terms" onChange={this.handleCharCount} placeholder="Write your comments here"></textarea>
                                    {/* <span className="font-title char-limit" style={{ paddingLeft: 5, fontSize: 10 }}>{this.state.chars_left}/240</span> */}
                                </div>
                            }
                            {
                                this.state.step == "summary" &&
                                <div className="build-box">
                                    {
                                        this.state.editMode ?
                                            <div>
                                                <p className="font16 text-center bold">Edit</p>
                                                <hr />
                                                <br />
                                                <h6 className="bold">Comments:</h6>
                                                <textarea rows="3" className="big-input" name="describe" value={this.state.describe} id="describe" onChange={this.handleCharCount} placeholder="Write your comments here"></textarea>
                                                {/* <span className="font-title char-limit" style={{ paddingLeft: 5, fontSize: 10 }}>{this.state.chars_left}/240</span> */}
                                                <h6 className="bold">Quote terms:</h6>
                                                <textarea rows="3" className="big-input" name="terms" value={this.state.terms} id="terms" onChange={this.handleCharCount} placeholder="Write your comments here"></textarea>
                                                <h6 className=""><b>My contact number: </b></h6>
                                                <Row>
                                                    <Col xs="4">
                                                        <select defaultValue={myCountryCode} onChange={this.onChangeCountryCode} className="form-control country-code width100">
                                                            {
                                                                this.state.countries.map((country, index) =>
                                                                    <option value={"+" + country.phonecode} key={`key_${index}`} selected={("+" + country.phonecode) == this.state.myCountryCode}>{"+" + country.phonecode + " (" + country.name + ")"}</option>
                                                                )
                                                            }
                                                        </select>
                                                    </Col>
                                                    <Col xs="8">
                                                        <Input type="text" maxLength="10" name="phoneNumber" id="phoneNumber" value={this.state.phoneNumber} onChange={this.onChangeText} placeholder="Enter Phone Number" className="big-input"></Input>
                                                    </Col>
                                                </Row>
                                                <Row className="special-labels">
                                                    <Col xs="6">
                                                        <h6 className="must-label bold pull-right" style={{ paddingTop: 6 }}>Per-visit Fee:</h6>
                                                    </Col>
                                                    <Col xs="6">
                                                        <Input type="text" maxLength="7" name="payableOnCompletion" id="payableOnCompletion" value={this.state.payableOnCompletion} onChange={this.onChangeText} placeholder="Rs. 0.00" className="big-input"></Input>
                                                    </Col>
                                                    <Col xs="12">
                                                        <hr />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs="6">
                                                        <br />
                                                        <a className="btn btn-primary" style={{ display: "block" }} onClick={() => this.updateRequest()}>Send Quote</a>
                                                    </Col>
                                                    <Col xs="6">
                                                        <br />
                                                        <a onClick={() => this.summaryEdit()} style={{ display: "block", textAlign: "center", fontSize: 13 }} className="btn btn-secondary">Save</a>
                                                    </Col>
                                                </Row>
                                            </div>
                                            :
                                            <div>
                                                <p className="text-center font20 bold">Summary</p>
                                                <h6 className="bold">Comments:</h6>
                                                <h6 className="font-title">{this.state.describe}</h6>
                                                <br />
                                                <h6 className="bold">Quote terms:</h6>
                                                <h6 className="font-title">{this.state.terms}</h6>
                                                <br />
                                                <h6 className=""><b>My contact number:</b></h6>
                                                <h6 className="font-title"> {this.state.myCountryCode} {this.state.phoneNumber}</h6>
                                                <br />
                                                <Row className="special-labels">
                                                    <Col xs="6">
                                                        <p className="must-label font14 bold pull-right">Per-visit Fee:</p>
                                                    </Col>
                                                    <Col xs="6">
                                                        <h6 className="bold" style={{ paddingTop: 4 }}>INR {this.state.payableOnCompletion}</h6>
                                                    </Col>
                                                    <Col xs="12">
                                                        <hr />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs="6">
                                                        <br />
                                                        <a className="btn btn-primary" style={{ display: "block" }} onClick={() => this.updateRequest()}>Send Quote</a>
                                                    </Col>
                                                    <Col xs="6">
                                                        <br />
                                                        <a onClick={() => this.summaryEdit()} style={{ display: "block", textAlign: "center", fontSize: 13 }} className="btn btn-secondary">Edit</a>
                                                    </Col>
                                                </Row>
                                            </div>
                                    }

                                </div>
                            }
                            <div className="text-center">
                                {this.state.step == "describe" ? "" : <img onClick={this.prevStep} style={{ paddingRight: 15 }} className="go-button-left" src={left} />}
                                {this.state.step == "summary" ? "" : <img onClick={this.nextStep} style={{ paddingLeft: 15 }} className="go-button-right" src={right} />}
                            </div>

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
                            <Button onClick={() => this.setState({ isModalVisible: false, modalMessage: '', modalDesc: '' })}>Close</Button>
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
    failedToSendQuote: state.request.failedToSendQuote
})

const mapDispatchToProps = {
    ...RequestActions,
    ...ProfileAction
}

export default connect(mapStateToProps, mapDispatchToProps)(RespondCare)
