import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import firebase from "firebase"
import help from '../../images/icon/help.svg'
import email from '../../images/icon/envelope.svg'
import phone from '../../images/icon/smartphone.svg'
import { Wallet } from "./Wallet";
import { RequestActions, ProfileAction } from "../../redux/actions";
import { connect } from "react-redux";
import { generateDigitalId } from "../../utils/helper";
import { Button, Col, Modal, ModalBody, Row, Spinner, Container } from "reactstrap";
import { scryRenderedComponentsWithType } from "react-dom/test-utils";
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



function WalletDetails(props) {

    const classes = useStyles();
    const [expanded, setExpanded] = useState(false)

    const [panel1, setPanel1] = useState(true)
    const [panel2, setPanel2] = useState(false)
    const [panel3, setPanel3] = useState(false)
    const [panel4, setPanel4] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [resOtp, setResOtp] = useState('')
    const [isOtpGenerated, setIsOtpGenerated] = useState(false)
    const [isEmailVerified, setIsEmailVerified] = useState(false)
    const [isMobileVerified, setIsMobileVerified] = useState(false)
    const [amountToWithdraw, setAmountToWithdraw] = useState(0.00)
    const [otp, setOtp] = useState('')

    //Modal
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [modalTitle, setModalTitle] = useState('')
    const [modalDescription, setModalDescription] = useState('')
    const [isError, setIsError] = useState(false)

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };


    const { wallet, userDetails } = props

    useEffect(() => {
        setAmountToWithdraw(parseFloat(wallet.advanceTotal) + parseFloat(wallet.payableTotal) - parseFloat(wallet.amountPaid))
    }, [wallet])

    const sendOtp = (type) => {
        setIsOtpGenerated(false)
        setIsLoading(true)
        var params = {
            email: userDetails && userDetails.email,
            mobile: userDetails && userDetails.phoneNumber,
            providerId: localStorage.getItem('userId'),
            type: type
        }
        axios.post(`${process.env.REACT_APP_SERVICES_URI}provider/email/verify`, params, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            let data = response.data;

            setIsOtpGenerated(true)
            setResOtp(data.otpCode)
            setIsLoading(false)
        }).catch((error) => {

            setIsOtpGenerated(false)
            setIsLoading(false)
            setIsError(true)
            setIsModalVisible(true)
            setModalTitle('Something went wrong')
            setModalDescription('Check your internet connection')
        });

    }
    const validateOtp = (type) => {
        if (otp === resOtp && type === "Email") {
            setIsError(false)
            setIsModalVisible(true)
            setIsEmailVerified(true)
            setOtp('')
            setModalTitle('You have successfully Verified your ' + type)

        } else if (otp === resOtp && type === "Mobile") {
            setIsError(false)
            setIsModalVisible(true)
            setIsMobileVerified(true)
            setOtp('')
            setModalTitle('You have successfully Verified Your ' + type)

        }
        else {
            setIsError(false)
            setOtp('')
            setIsModalVisible(true)
            setModalTitle('Failed to verify OTP')
        }
    }
    const closeModal = () => {
        setIsError(false)
        setIsModalVisible(false)
        setModalDescription('')
        setModalTitle('')
    }

    const onClickWithdrawAmount = () => {
        if (parseFloat(amountToWithdraw) > 0 && parseFloat(amountToWithdraw) <= parseFloat(wallet.totalBalance)) {
            var params = {
                payout_id: uuidv4(),
                provider_id: userDetails && userDetails.userId,
                withdraw_amount: amountToWithdraw,
                meta_data: {}
            }
            axios.post(`${process.env.REACT_APP_SERVICES_URI}wallet/payout`, params, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                if (response.status === 200) {
                    let data = response.data;
                    console.log('PAYOUT RESPONSE', data)
                    setIsLoading(false)
                    setIsError(true)
                    setIsModalVisible(true)
                    setModalTitle('Success')
                    setModalDescription('You will get an email with the payout link soon')
                }

            }).catch((error) => {
                setIsLoading(false)
                setIsError(true)
                setIsModalVisible(true)
                setModalTitle('Something went wrong')
                setModalDescription('Check your internet connection')
            });
        } else {
            setIsError(true)
            setIsModalVisible(true)
            setModalTitle('Invalid Amount')
            setModalDescription('Check your withdraw amount')
        }

    }
    return (
        <Container>
        <div className={classes.root + " payment-tabs"} style={{paddingBottom: 50}}>

            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    {expanded !== 'panel2' ?
                        <p><div className="image-holder font14 bold"><img src={help} /> </div>Authentication</p>
                        :
                        <p className="bold font16">Authentication</p>
                    }
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        <p className="bold font14"><img style={{ width: 22, marginRight: 5, marginTop: -5 }} src={email} /> Email Verification</p>
                        <p className="font-title">Once you click “Send OTP” below, the one-time password will be sent to your email.<br/> If info@yocoservices.com is not added as a contact, the email with the OTP may land in your spam / promotions folder.<br /> Once you have the OTP, come back here and enter it to complete verification.</p>
                        {
                            isEmailVerified ? (
                                <p style={{ fontWeight: 'bold', color: 'green' }}>{userDetails && userDetails.email}</p>
                            ) : <p>{userDetails && userDetails.email}</p>
                        }

                        {/* {
                            !isEmailVerified && isOtpGenerated && (
                                <Row>
                                    <Col xs="6">
                                        <input VALUE={otp} onChange={e => setOtp(e.target.value)} className="payment-text coupon-field" placeholder="Enter Otp" />
                                    </Col>
                                    <Col xs="3">
                                        <Button onClick={() => sendOtp('Email')} className="neat-button coupon-button">Resend</Button>
                                    </Col>
                                </Row>

                            )
                        } */}

                        {
                            !isEmailVerified && resOtp !== '' ? (
                                <Row>
                                    <Col xs="7">
                                        <input VALUE={otp} onChange={e => setOtp(e.target.value)} className="payment-text coupon-field" placeholder="Enter OTP" />
                                        <span onClick={() => sendOtp('Email')} style={{ textDecoration: 'underline' }}>Resend</span>
                                    </Col>
                                    <Col xs="5">
                                        <Button onClick={() => validateOtp('Email')} className="neat-button">Verify</Button>
                                    </Col>
                                </Row>
                            ) : !isEmailVerified ? <Col xs="8">
                                <Button onClick={() => sendOtp('Email')} className="neat-button">Send OTP</Button>
                            </Col> : ''
                        }

                        <hr />
                        {/* <h5><img style={{ width: 22, marginRight: 5, marginTop: -5 }} src={phone} />Mobile Verification</h5>
                        <p className="font-title">Please verify your mobile number. Once you click verify a One time Password will be sent to your mobile number.</p>
                        {
                            isMobileVerified ? (
                                <p style={{ fontWeight: 'bold', color: 'green' }}>{userDetails && userDetails.phoneNumber ? userDetails.phoneNumber : ''}</p>
                            ) : <p style={{ fontWeight: 'bold' }}>{userDetails && userDetails.phoneNumber}</p>
                        }

                        {
                            !isMobileVerified && isOtpGenerated && (
                                <Row>
                                    <Col xs="7">
                                        <input VALUE={otp} onChange={e => setOtp(e.target.value)} className="payment-text coupon-field" placeholder="Enter Otp" />
                                    </Col>
                                    <Col xs="5">
                                        <Button onClick={sendOtp('Mobile')} className="neat-button">Resend</Button>
                                    </Col>
                                </Row>

                            )
                        }

                        {
                            !isMobileVerified && resOtp !== '' ? (
                                <Col xs="8">
                                    <Button onClick={() => validateOtp('Mobile')} className="neat-button">Verify</Button>
                                </Col>
                            ) : !isMobileVerified ? <Col xs="8">
                                <Button onClick={() => sendOtp('Mobile')} className="neat-button">Send Otp</Button>
                            </Col> : ''
                        } */}

                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === 'panel3'} onChange={isEmailVerified && handleChange('panel3')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    {expanded !== 'panel3' ?
                        <p className="bold font14"><div className="image-holder"><img src={help} /> </div>Payout</p>
                        :
                        <p className="bold font16">Payout</p>
                    }
                </AccordionSummary>
                <AccordionDetails>
                    <Row>
                        <Col xs="12">
                            <p className="bold font14">{`Total Earnings  : ${(wallet.advanceTotal + wallet.payableTotal) - parseFloat(wallet.amountPaid)}`}</p>
                        </Col>
                        <Col xs="6">
                            <p>Amount to withdraw</p>
                            <input value={amountToWithdraw} onChange={e => setAmountToWithdraw(e.target.value)} className="payment-text coupon-field" />
                        </Col>
                        <Col xs="6">
                            <p>&nbsp;</p>
                            <Button disabled className="neat-button">Withdraw</Button>
                        </Col>
                    </Row>
                </AccordionDetails>
            </Accordion>

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
                            ) : <Button onClick={() => closeModal()}>Close</Button>
                        }
                    </div>
                </ModalBody>
            </Modal>
        </div>
        </Container>
    )
}
const mapStateToProps = (state, ownProps) => {
    return {
        wallet: state.request.wallet,
        userDetails: state.profile.userDetails
    }
}
export default connect(mapStateToProps, { ...RequestActions, ...ProfileAction })(WalletDetails)