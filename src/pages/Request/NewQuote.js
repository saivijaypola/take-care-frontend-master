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
class RequesMain extends Component {

    constructor(props) {
        super(props)

        this.state = {
            advanceAmount: '0.00',
            totalAmount: '0.00',
            providerFeedback: '',
            isModalVisible: false,
            nature: false,
            step: "nature",
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
            case "purchase":
                this.setState({
                    step: "nature"
                })
                break;
            case "maintenance":
                this.setState({
                    step: "nature"
                })
                break;
            case "others":
                this.setState({
                    step: "nature"
                })
                break;
            case "moreinfo":
                this.setState({
                    step: "nature"
                })
                break;
            case "describe":
                switch (this.state.nature) {
                    case "purchase":
                        this.setState({
                            step: "purchase"
                        })
                        break;
                    case "maintenance":
                        this.setState({
                            step: "maintenance"
                        })
                        break;
                    case "others":
                        this.setState({
                            step: "others"
                        })
                        break;
                }

                break;
            case "when":
                this.setState({
                    step: "describe"
                })
                break;
            case "explain":
                this.setState({
                    step: "when"
                })
                break;
            case "summary":
                this.setState({
                    step: "explain"
                })
                break;
        }
    }
    nextStep() {
        window.scrollTo(0, 0)
        switch (this.state.step) {
            case "nature":
                if (this.state.nature == "") {
                    this.setState({
                        modalTitle: "",
                        modalDesc: "Choose one of the four options to continue ",
                        isModalVisible: true
                    })
                } else {
                    this.setState({
                        step: this.state.nature
                    })
                }
                break;
            case "purchase":
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
                        modalDesc: "Please fill all the fields.",
                        isModalVisible: true
                    })
                } else {
                    this.setState({
                        step: "describe"
                    })
                }

                break;
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
                        step: "describe"
                    })
                }

                break;
            case "others":
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
                        modalDesc: "Please fill all the fields.",
                        isModalVisible: true
                    })
                } else {
                    this.setState({
                        step: "describe"
                    })
                }

                break;
            case "describe":
                if (this.state.describe !== '') {
                    this.setState({
                        step: "when"
                    })
                } else {
                    this.setState({
                        modalTitle: "",
                        modalDesc: "Brief description required ",
                        isModalVisible: true
                    })
                }

                break;
            case "when":
                this.setState({
                    step: "explain"
                })
                break;
            case "explain":
                if (this.state.explain !== '') {
                    this.setState({
                        step: "summary"
                    })
                } else {
                    this.setState({
                        modalTitle: "",
                        modalDesc: "About yourself required",
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

        const { chatId, isRequestUpdated, serviceDetails, failedToSendQuote } = this.props

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
                    <Container className="relative rise-card2" style={{ marginTop: 165 }}>
                        <div className="delight-bottom" style={{ textAlign: "unset" }}>
                            {
                                this.state.step == "nature" &&
                                <div className="build-box">
                                    <p className="bold font14 text-center">What is the nature of the request?</p>
                                    <FormControl component="fieldset">
                                        <RadioGroup aria-label="" value={this.state.nature} name="nature" onChange={this.handleChange}>
                                            <FormControlLabel value="purchase" control={<Radio />} label="Purchase of items or making payments for the service is required." />
                                            <FormControlLabel value="maintenance" control={<Radio />} label="Maintenance work required, for which site visit and estimation should happen." />
                                            <FormControlLabel value="others" control={<Radio />} label="No purchase or maintenance is required. But I can undertake this request." />
                                            <FormControlLabel value="moreinfo" control={<Radio />} label="The request is not clear and I need more information." />
                                        </RadioGroup>
                                    </FormControl>
                                </div>

                            }
                            {
                                this.state.step == "purchase" &&
                                <div className="build-box">
                                    <h6 className="bold text-center">Enter an advance amount ONLY if you
                                        need money to purchase items or make some payments.</h6>
                                    <Input type="text" maxLength="6" defaultValue="0.00" name="advanceAmount" id="advanceAmount" value={this.state.advanceAmount} onChange={this.onChangeText} placeholder="Rs. 0.00" className="big-input"></Input><br />
                                    <h6 className="bold text-center">What are your charges to deliver this service?</h6>
                                    <Input type="text" maxLength="7" name="payableOnCompletion" id="payableOnCompletion" value={this.state.payableOnCompletion} onChange={this.onChangeText} placeholder="Rs. 0.00" className="big-input"></Input><br />
                                    <h6 className="bold text-center">Total Amount</h6>
                                    <Input type="text" maxLength="7" name="payableOnCompletion" id="payableOnCompletion" value={parseFloat(this.state.totalAmount).toFixed(2)} disabled></Input>
                                    <br /><br />
                                    <h6 className="bold text-center">Please mention any terms you may have for the service charge stated above.</h6>
                                    <textarea rows="3" className="big-input" name="terms" value={this.state.terms} id="terms" onChange={this.handleCharCount} placeholder="Write your comments here"></textarea>
                                    {/* <span className="font-title char-limit" style={{ paddingLeft: 5, fontSize: 10 }}>{this.state.chars_left}/240</span> */}
                                </div>
                            }
                            {
                                this.state.step == "maintenance" &&
                                <div className="build-box">
                                    <h6 className="bold text-center">What are your charges to deliver this service?</h6>
                                    <Input type="text" maxLength="7" name="payableOnCompletion" id="payableOnCompletion" value={this.state.payableOnCompletion} onChange={this.onChangeText} placeholder="Rs. 0.00" className="big-input"></Input>
                                    <br />
                                    <h6 className="bold text-center">Please mention any terms you may have for the service charge stated above.</h6>
                                    <textarea rows="3" className="big-input" name="terms" value={this.state.terms} id="terms" onChange={this.handleCharCount} placeholder="Write your comments here"></textarea>
                                    {/* <span className="font-title char-limit" style={{ paddingLeft: 5, fontSize: 10 }}>{this.state.chars_left}/240</span> */}
                                </div>
                            }
                            {
                                this.state.step == "others" &&
                                <div className="build-box">
                                    <h6 className="bold text-center">What are your charges to deliver this service?</h6>
                                    <Input type="text" maxLength="7" name="payableOnCompletion" id="payableOnCompletion" value={this.state.payableOnCompletion} onChange={this.onChangeText} placeholder="0.00" className="big-input"></Input>
                                    <h6 className="bold text-center">Please mention any terms you may have for the service charge stated above.</h6>
                                    <textarea rows="3" className="big-input" name="terms" value={this.state.terms} id="terms" onChange={this.handleCharCount} placeholder="Write your comments here"></textarea>
                                    {/* <span className="font-title char-limit" style={{ paddingLeft: 5, fontSize: 10 }}>{this.state.chars_left}/240</span> */}
                                </div>
                            }
                            {
                                this.state.step == "moreinfo" &&
                                <div className="build-box">
                                    <h6 className="bold">For your privacy and security reasons do not share your contact number while gathering more information about the request.</h6>
                                    <p className="bold">
                                        Do not discuss payment methods. Once you submit a quote, we will
                                        guide you through on how you can get your payment. For any
                                        questions please visit help section or contact support.
                                    </p>
                                    <p className="bold">
                                        Do not message to say “Hi I can do this work”. Send a quote
                                        instead.
                                    </p>
                                    <ChatButton key={"chatProvider"} chatId={this.props.chatId} {...this.props} />
                                </div>
                            }
                            {
                                this.state.step == "describe" &&
                                <div className="build-box">
                                    <h6 className="bold text-center">Briefly describe how you will handle this service request</h6>
                                    <textarea rows="3" className="big-input" name="describe" value={this.state.describe} id="describe" onChange={this.handleCharCount} placeholder="Write your comments here"></textarea>
                                    {/* <span className="font-title char-limit" style={{ paddingLeft: 5, fontSize: 10 }}>{this.state.chars_left}/240</span> */}
                                </div>
                            }
                            {
                                this.state.step == "when" &&
                                <div className="build-box">
                                    <h6 className="bold text-center">When are you going to this service?</h6>
                                    <div className="force-center">
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <KeyboardDateTimePicker
                                                margin="normal"
                                                id="time-picker"
                                                disablePast={true}
                                                label="Service will be provided on"
                                                value={this.state.possibleDate}
                                                onChange={(event) => this.onDateChange("possibleDate", event)}
                                            />
                                        </MuiPickersUtilsProvider>
                                        {/* <TextField
                                            style={{ marginBottom: 15 }}
                                            id="datetime-local"
                                            label="Service will be provided on"
                                            type="datetime-local"
                                            defaultValue={this.state.possibleDate}
                                            onChange={(event) => this.onDateChange("possibleDate", event)}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        /> */}
                                    </div>

                                </div>
                            }
                            {
                                this.state.step == "explain" &&
                                <div className="build-box">
                                    <h6 className="bold text-center">Briefly explain about yourself and how you can be a trusted companion</h6>
                                    {/* <h7 className="font-title text-center" style={{ fontSize: 12 }}>Edit as per the Service request</h7> */}
                                    <textarea rows="3" className="big-input" name="explain" value={this.state.explain} id="explain" onChange={this.handleCharCount} placeholder="Write your comments suitable for the service request"></textarea>
                                    {/* <span className="font-title char-limit" style={{ paddingLeft: 5, fontSize: 10 }}>{this.state.chars_left}/240</span> */}
                                </div>
                            }
                            {
                                this.state.step == "summary" &&
                                <div className="build-box">
                                    {
                                        this.state.editMode ?
                                            <div>
                                                <p className="text-center font16 bold">Edit</p>
                                                <h6 className="bold">About Me:</h6>
                                                <textarea rows="3" className="big-input" name="explain" value={this.state.explain} id="explain" onChange={this.handleCharCount} placeholder="Write your comments here"></textarea>
                                                {/* <span className="font-title char-limit" style={{ paddingLeft: 5, fontSize: 10 }}>{this.state.chars_left}/240</span> */}
                                                <h6 className="bold">Comments:</h6>
                                                <textarea rows="3" className="big-input" name="describe" value={this.state.describe} id="describe" onChange={this.handleCharCount} placeholder="Write your comments here"></textarea>
                                                {/* <span className="font-title char-limit" style={{ paddingLeft: 5, fontSize: 10 }}>{this.state.chars_left}/240</span> */}
                                                <h6 className="bold">Quote terms:</h6>
                                                <textarea rows="3" className="big-input" name="terms" value={this.state.terms} id="terms" onChange={this.handleCharCount} placeholder="Write your comments here"></textarea>
                                                {/* <span className="font-title char-limit" style={{ paddingLeft: 5, fontSize: 10 }}>{this.state.chars_left}/240</span> */}
                                                <h6 className=""><b>Service will be provided on: </b></h6>
                                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                    <KeyboardDateTimePicker
                                                        margin="normal"
                                                        id="time-picker"
                                                        disablePast={true}
                                                        label="Service will be provided on"
                                                        value={this.state.possibleDate}
                                                        onChange={(event) => this.onDateChange("possibleDate", event)}
                                                    />
                                                </MuiPickersUtilsProvider>

                                                <h6 className="" style={{ marginTop: 10 }}><b>My contact number: </b></h6>

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
                                                    {
                                                        this.state.nature == "purchase" &&
                                                        <React.Fragment>
                                                            <Col xs="6">
                                                                <label className="pull-right">Advance Amount</label>
                                                            </Col>
                                                            <Col xs="6">
                                                                <Input type="text" maxLength="6" defaultValue="0.00" name="advanceAmount" id="advanceAmount" value={this.state.advanceAmount} onChange={this.onChangeText} placeholder="Rs. 0.00" className="big-input"></Input>
                                                            </Col>
                                                        </React.Fragment>
                                                    }
                                                    <Col xs="6">
                                                        <label className="must-label pull-right">Payable on Completion</label>
                                                    </Col>
                                                    <Col xs="6">
                                                        <Input type="text" maxLength="7" name="payableOnCompletion" id="payableOnCompletion" value={this.state.payableOnCompletion} onChange={this.onChangeText} placeholder="Rs. 0.00" className="big-input"></Input>
                                                    </Col>
                                                    <Col xs="12">
                                                        <hr />
                                                    </Col>
                                                    <Col xs="4">

                                                    </Col>
                                                    <Col xs="8">
                                                        <span style={{ fontSize: 16 }}>Total <b style={{ fontSize: 19 }}>Rs. {parseFloat(this.state.totalAmount).toFixed(2)}</b></span>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs="6">
                                                        <br />
                                                        <a className="send-quote-button" style={{ display: "block" }} onClick={() => this.updateRequest()}>Send Quote</a>
                                                    </Col>
                                                    <Col xs="6">
                                                        <br />
                                                        <a onClick={() => this.summaryEdit()} style={{ display: "block", textAlign: "center", fontSize: 13 }} className="hamper-button edit-button">Save</a>
                                                    </Col>
                                                </Row>
                                            </div>
                                            :
                                            <div>
                                                <p className="text-center font16 bold">Summary</p>
                                                <h6 className="bold">About Me:</h6>
                                                <p className="font-title">{this.state.explain}</p>
                                                <h6 className="bold">Comments:</h6>
                                                <p className="font-title">{this.state.describe}</p>
                                                <h6 className="bold">Quote terms:</h6>
                                                <p className="font-title">{this.state.terms}</p>
                                                <h6 className=""><b>Service will be provided on: </b></h6>
                                                <p className="font-title">{this.state.possibleDate && new Date(this.state.possibleDate).toDateString()}</p>
                                                <h6 className=""><b>My contact number: </b></h6>
                                                <p className="font-title"> {this.state.myCountryCode} {this.state.phoneNumber}</p>
                                                <Row className="special-labels">
                                                    {
                                                        this.state.nature == "purchase" &&
                                                        <React.Fragment>
                                                            <Col xs="6">
                                                                <label className="pull-right">Advanceghhg Amount</label>
                                                            </Col>
                                                            <Col xs="6">
                                                                <h6 className="bold" style={{ paddingTop: 6 }}>Rs. {this.state.advanceAmount}</h6>
                                                            </Col>
                                                        </React.Fragment>
                                                    }

                                                    <Col xs="6">
                                                        <label className="must-label pull-right">Payable on Completion</label>
                                                    </Col>
                                                    <Col xs="6">
                                                        <h6 className="bold" style={{ paddingTop: 6 }}>Rs. {this.state.payableOnCompletion}</h6>
                                                    </Col>
                                                    <Col xs="12">
                                                        <hr />
                                                    </Col>
                                                    <Col xs="4">

                                                    </Col>
                                                    <Col xs="8">
                                                        <span style={{ fontSize: 16 }}>Total <b style={{ fontSize: 19 }}>Rs. {parseFloat(this.state.totalAmount).toFixed(2)}</b></span>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs="6">
                                                        <br />
                                                        <a className="send-quote-button" style={{ display: "block" }} onClick={() => this.updateRequest()}>Send Quote</a>
                                                    </Col>
                                                    <Col xs="6">
                                                        <br />
                                                        <a onClick={() => this.summaryEdit()} style={{ display: "block", textAlign: "center", fontSize: 13 }} className="hamper-button edit-button">Edit</a>
                                                    </Col>
                                                </Row>
                                            </div>
                                    }

                                </div>
                            }
                            <div className="text-center">
                                {this.state.step == "nature" ? "" : <img onClick={this.prevStep} style={{ paddingRight: 15 }} className="go-button-left" src={left} />}
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

export default connect(mapStateToProps, mapDispatchToProps)(RequesMain)
