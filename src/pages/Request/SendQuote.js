import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    Container, Row, Col, Nav,
    NavItem,
    NavLink, TabContent,
    TabPane, Modal, Spinner, Input, Button, ModalBody
} from "reactstrap";
import DateTimePicker from 'react-datetime-picker';
import TextField from '@material-ui/core/TextField';
import profile from "../../assets/images/client/05.jpg";
import marker from "../../images/icon/marker.png";
import calendar from "../../images/icon/calendar_b.svg";
import user from "../../images/icon/user-6.png";
import { RequestActions, ProfileAction } from "../../redux/actions";
import { v4 as uuidv4 } from 'uuid';
import { getDistance } from 'geolib';
import firebase from "firebase"
import csc from 'country-state-city'
import axios from "axios";
import _ from "lodash";
import moment from 'moment';

const assetsBaseUrl = process.env.REACT_APP_ASSETS_BASE_URL
class RequesMain extends Component {

    constructor(props) {
        super(props)

        this.state = {
            advanceAmount: '0.00',
            totalAmount: '0.00',
            providerFeedback: '',
            isModalVisible: false,
            payableOnCompletion: '',
            countries: [],
            myCountryCode: '+91',
            serviceOrderId: '',
            chars_left: 1000,
            modalTitle: '',
            modalDesc: '',
            phoneNumber: '',
            displayDate: new Date(),
            possibleDate: new Date((new Date().getTime() + 86400000)).toISOString().slice(0, -8),
            editing: true

        }
        this.handleCharCount = this.handleCharCount.bind(this)
        this.onChangeText = this.onChangeText.bind(this)
        this.updateRequest = this.updateRequest.bind(this)
        this.enableEdit = this.enableEdit.bind(this)
        this.onDateChange = this.onDateChange.bind(this)
        this.getGeoInfo = this.getGeoInfo.bind(this)
        this.setCode = this.setCode.bind(this)
        this.onChangeCountryCode = this.onChangeCountryCode.bind(this)
    }
    getGeoInfo = async () => {
        var response = await axios.get('https://ipapi.co/json')
        console.log(response.data.country_calling_code.toString())
        if (response.data.country_calling_code) {
            this.setCode(response.data.country_calling_code)
        }
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
        if (event.target.value.length < 1001) {
            this.setState({
                chars_left: 1000 - event.target.value.length,
                [event.target.name]: event.target.value
            });
        }

    }
    onDateChange = (name, event) => {
        const target = event.target; // Do we need this?(unused in the function scope)!

        this.setState({
            [name]: event.target.value
        }, () => {

            // Prints the new value.
        });
    };
    componentDidMount() {
        var countries = csc.getAllCountries()
        console.log("countries", countries)
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
    enableEdit() {
        this.setState({
            editing: true
        })
    }
    updateRequest() {
        const { serviceDetails, requestDetails } = this.props
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
                        "provider_comments": this.state.providerFeedback.trim(),
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
    componentDidUpdate(prevProps) {

        const { isRequestUpdated, serviceDetails, failedToSendQuote } = this.props

        if (prevProps.isRequestUpdated !== isRequestUpdated && isRequestUpdated) {
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
        if (serviceDetails && prevProps.serviceDetails !== serviceDetails) {
            console.log("🚀 ~ file: SendQuote.js ~ line 268 ~ RequesMain ~ componentDidUpdate ~ serviceDetails", serviceDetails)
            if (serviceDetails.orderStatus == "Pending" && this.state.editing == true) {
                this.setState({
                    editing: false
                })
            }
            this.setState({
                advanceAmount: serviceDetails.advanceAmount,
                totalAmount: serviceDetails.orderTotalAmount,
                phoneNumber: serviceDetails.phoneNumber,
                myCountryCode: serviceDetails.countryCode,
                possibleDate: serviceDetails && !_.isNull(serviceDetails.serviceNeededOn) && serviceDetails.serviceNeededOn.slice(0, -9),
                displayDate: serviceDetails.serviceNeededOn,
                chars_left: !_.isNull(serviceDetails.serviceNeededOn) && 1000 - serviceDetails.providerComments.length,
                payableOnCompletion: parseFloat(serviceDetails.orderTotalAmount) - parseFloat(serviceDetails.advanceAmount),
                providerFeedback: serviceDetails.providerComments
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

    }
    render() {
        const { requestDetails, serviceDetails, isRequestDetailsLoading, isRequestUpdating, selectedLocation, myCountryCode } = this.props

        return (
            <div>
                <React.Fragment>


                    <React.Fragment>
                        {
                            requestDetails && !requestDetails.isCareSubscription ? (
                                !this.state.editing ?

                                    <React.Fragment>
                                        <table className="table text-right">
                                            <tr className="no-border">
                                                <td className="text-right">
                                                    Advance Amount:
                                                </td>
                                                <th>
                                                    Rs. {parseFloat(this.state.advanceAmount).toFixed(2)}
                                                </th>
                                            </tr>
                                            <tr>
                                                <td className="text-right">
                                                    Payable on Completion:
                                                </td>
                                                <th>
                                                    Rs. {parseFloat(this.state.payableOnCompletion).toFixed(2)}
                                                </th>
                                            </tr>
                                            <tr style={{ color: "#f19c00" }}>
                                                <th className="text-right font16">
                                                    Total
                                                </th>
                                                <th >
                                                    Rs. {parseFloat(this.state.totalAmount).toFixed(2)}
                                                </th>
                                            </tr>
                                        </table>
                                        <h6>Contact Number:
                                            <br /><br /><b>{this.state.myCountryCode} {this.state.phoneNumber}</b></h6><hr />
                                        <h6 style={{ marginTop: 10 }}>Service will be provided on:
                                            <br /><br />
                                            <b>{this.state.possibleDate && moment(this.state.possibleDate).format('LL')}</b></h6>
                                        <p className="quote-comments">
                                            {this.state.providerFeedback}
                                        </p>
                                        <Button onClick={() => this.enableEdit()} className="quote-button post-request">Edit</Button>
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        <Row className="special-labels">
                                            <Col xs="6">
                                                <label className="pull-right">Advance Amount</label>
                                            </Col>
                                            <Col xs="6">
                                                <Input type="text" maxLength="6" defaultValue="0.00" name="advanceAmount" id="advanceAmount" value={this.state.advanceAmount} onChange={this.onChangeText} placeholder="0.00" className="big-input"></Input>
                                            </Col>
                                            <Col xs="6">
                                                <label className="must-label pull-right">Payable on Completion</label>
                                            </Col>
                                            <Col xs="6">
                                                <Input type="text" maxLength="7" name="payableOnCompletion" id="payableOnCompletion" value={this.state.payableOnCompletion} onChange={this.onChangeText} placeholder="0.00" className="big-input"></Input>
                                            </Col>
                                            <Col xs="12">
                                                <hr />
                                            </Col>
                                            <Col xs="4">

                                            </Col>
                                            <Col xs="8">
                                                <span style={{ fontSize: 18, color: "#f19c00" }}>Total <b style={{ fontSize: 22 }}>Rs. {parseFloat(this.state.totalAmount).toFixed(2)}</b></span>
                                            </Col>
                                            {/* <Col md="6">
                                <label>Contact Number</label>
                                <Input type="text" maxLength="10" name="phoneNumber" id="phoneNumber" value={this.state.phoneNumber} onChange={this.onChangeText} placeholder="Phone Number" className="big-input"></Input>
                            </Col> */}
                                            <Col md="12">
                                                <label>Comments</label>
                                                <textarea rows="4" className="big-input" name="providerFeedback" value={this.state.providerFeedback} id="providerFeedback" onChange={this.handleCharCount} placeholder="Write your comments here"></textarea>
                                                <span className="font-title char-limit" style={{ paddingLeft: 5, fontSize: 10 }}>{this.state.chars_left}/1000</span>

                                            </Col>
                                            <Col xs="12">
                                                <TextField
                                                    style={{ marginBottom: 15 }}
                                                    id="datetime-local"

                                                    label="Service will be provided on"
                                                    type="datetime-local"
                                                    defaultValue={this.state.possibleDate}
                                                    onChange={(event) => this.onDateChange("possibleDate", event)}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </Col>
                                            <Col xs="12">
                                                <label className="must-label">Contact Number</label>
                                            </Col>
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
                                        <Button onClick={() => this.updateRequest()} style={{ marginTop: 10 }} className="quote-button post-request">Send Quote</Button>
                                    </React.Fragment>) : (
                                !this.state.editing ?

                                    <React.Fragment>
                                        <table className="table text-right">

                                            <tr style={{ color: "#f19c00" }}>
                                                <td className="text-left bold">
                                                    Per Visit Fee
                                                </td>
                                                <th className="text-left">
                                                    Rs. {parseFloat(this.state.payableOnCompletion).toFixed(2)}
                                                </th>
                                            </tr>

                                        </table>
                                        <h6>Contact Number:
                                            <br /><b>{this.state.myCountryCode} {this.state.phoneNumber}</b></h6><br />
                                        <h6 style={{ marginTop: 10 }}>Service will be provided on:
                                            <br />
                                            <b>{this.state.possibleDate && moment(this.state.possibleDate).format('LL')}</b></h6><br />
                                        <p className="quote-comments">
                                            {this.state.providerFeedback}
                                        </p>
                                        <Button onClick={() => this.enableEdit()} className="quote-button post-request">Edit</Button>
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        <Row className="special-labels">

                                            <Col xs="6">
                                                <label className="must-label pull-right" style={{fontSize:15}}>Per Visit Fee</label>
                                            </Col>
                                            <Col xs="6">
                                                <Input type="text" maxLength="7" name="payableOnCompletion" id="payableOnCompletion" value={this.state.payableOnCompletion} onChange={this.onChangeText} placeholder="0.00" className="big-input"></Input>
                                            </Col>
                                            <Col xs="12">
                                                <hr />
                                            </Col>
                                            <Col xs="4">

                                            </Col>
                                            <Col xs="8">
                                                <span style={{ fontSize: 17, color: "#f19c00" }}>  <b style={{ fontSize: 22 }}>INR {parseFloat(this.state.totalAmount).toFixed(2)}</b></span>
                                            </Col>
                                            {/* <Col md="6">
                                <label>Contact Number</label>
                                <Input type="text" maxLength="10" name="phoneNumber" id="phoneNumber" value={this.state.phoneNumber} onChange={this.onChangeText} placeholder="Phone Number" className="big-input"></Input>
                            </Col> */}
                                            <Col md="12">
                                                <label style={{fontSize:14}}>Comments</label>
                                                <textarea rows="4" className="big-input" name="providerFeedback" value={this.state.providerFeedback} id="providerFeedback" onChange={this.handleCharCount} placeholder="Write your comments here"></textarea>
                                                <span className="font-title char-limit" style={{ paddingLeft: 5, fontSize: 10 }}>{this.state.chars_left}/1000</span>

                                            </Col>
                                            <Col xs="12">
                                                <TextField
                                                    style={{ marginBottom: 15, fontSize:13 }}
                                                    id="datetime-local"
                                                    label="Service will be provided on"
                                                    type="datetime-local"
                                                    defaultValue={this.state.possibleDate}
                                                    onChange={(event) => this.onDateChange("possibleDate", event)}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </Col>
                                            <Col xs="12">
                                                <label className="must-label"  style={{fontSize:13 }}>Contact Number</label>
                                            </Col>
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
                                        <Button onClick={() => this.updateRequest()} style={{ marginTop: 10 }} className="quote-button post-request">Send Quote</Button>
                                    </React.Fragment>)
                        }
                        <br />

                    </React.Fragment>


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
    selectedLocation: state.profile.selectedLocation,
    userDetails: state.profile.userDetails,
    failedToSendQuote: state.request.failedToSendQuote
})

const mapDispatchToProps = {
    ...RequestActions,
    ...ProfileAction
}

export default connect(mapStateToProps, mapDispatchToProps)(RequesMain)
