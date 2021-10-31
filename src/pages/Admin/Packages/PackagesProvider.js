import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'
import "../AdminStyle.css";
import {
    Container,
    Row,
    Col,
    Spinner,
    Modal,
    Nav,
    NavItem,
    NavLink, TabContent,
    TabPane,
    Table,
    ModalBody, Button
} from "reactstrap";
import { Radio } from 'antd';
import { useHistory } from "react-router";
import {
    BrowserRouter as Router,
    useParams
} from "react-router-dom";

import providerData from '../provider.json';
import SearchProviderCard from '../../../components/Shared/AdminComponents/SearchProviderCard';
import ProviderPackageCard from '../../../components/Shared/AdminComponents/ProviderPackageCard';
import { FormRow, FormRowHorizontal } from '../AdminStyled';
import assets from '../../../assets/images';
import ProviderCardForCare from '../../../components/Shared/AdminComponents/ProviderCardForCare';
import { AdminActions, RequestActions } from '../../../redux/actions';
import { useDispatch, useSelector } from "react-redux";
import edit from "../../../images/icon/edit-2.png";
import back from "../../../images/icon/back.png";
import add from "../../../images/icon/add-3.png";
import axios from "axios";

//Editor 
import { EditorState, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { convertToHTML } from 'draft-convert';
import { countries } from "../../User/country";
import moment from 'moment';

import { Select } from 'antd';
const { Option } = Select;

export const PackagesProvider = ({ props }) => {

    const [value, setValue] = React.useState('onetime');
    const [fieldOne, setFieldOne] = useState('Activation Charge');
    const [fieldTwo, setFieldTwo] = useState('MEET THE PARENT');
    const [fieldThree, setFieldThree] = useState('CRIMINAL RECORD VERIFICATION');
    const [fieldFour, setFieldFour] = useState('Expedited Fee');
    const [fieldFive, setFieldFive] = useState('PAYMENT TERMS');
    const [billingDate, setBillingDate] = useState(new Date())
    const [priceOne, setPriceOne] = useState(0);
    const [priceTwo, setPriceTwo] = useState(0);
    const [priceThree, setPriceThree] = useState(0);
    const [priceFour, setPriceFour] = useState(0);
    const [priceFive, setPriceFive] = useState('');
    const [selectedCurrency, setCurrency] = useState(null)
    const [inputs, setInputs] = useState({
        priceOne: 0,
        priceTwo: 0,
        priceThree: 0,
        priceFour: 0,
        noOfMtp: '',
        noOfCrv: '',
        billingDate: new Date()
    });
    const [isModalVisible, setIsModalVisible] = useState(false)
    const history = useHistory();
    let { careid, requestid } = useParams();
    const [selectedCare, setSelectedCare] = useState([])
    const careDetails = useSelector(state => state.admin.carePackageDetails)
    const failedToAddOtherPricing = useSelector(state => state.admin.failedToAddOtherPricing);
    const failedToUpdatePricing = useSelector(state => state.admin.failedToUpdatePricing);
    const isPricingUpdated = useSelector(state => state.admin.isPricingUpdated);
    const careRequestDetails = useSelector(state => state.admin.careRequestDetails)
    const isLoadingRedux = useSelector(state => state.admin.isLoading)
    const buttonClicked = useSelector(state => state.admin.buttonClicked)
    const [isLoading, setIsLoading] = useState(false)
    const [isPreview, setIsPreview] = useState(false)
    const [modalMessage, setModalMessage] = useState('')
    const [careForFieldOne, setcareForFieldOne] = useState('NAME');
    const [careForFieldTwo, setcareForFieldTwo] = useState('ADDRESS');
    const [careForFieldThree, setcareForFieldThree] = useState('DETAILS');
    const [careForFieldFour, setcareForFieldFour] = useState('SERVICE NEEDS ON');
    const [subsFieldOne, setSubsFieldOne] = useState('NAME');
    const [subsFieldTwo, setSubsFieldTwo] = useState('START DATE');
    const [subsFieldThree, setSubsFieldThree] = useState('CANCELLATION');
    const [subsFieldFour, setSubsFieldFour] = useState('SERVICES');
    const [subsFieldFive, setSubsFieldFive] = useState('OPTION');
    const [exchangeRate, setExchangeRate] = useState(1);
    const [dollarCharge, setdollarCharge] = useState(1)

    useEffect(() => {
        if (selectedCurrency) {
            getCurrencyRate()
        }
        // window.scrollTo(0, 0)
    }, [selectedCurrency])


    const getCurrencyRate = () => {
        setIsLoading(true)
        axios.get(`https://api.currencyfreaks.com/latest?apikey=61ab7b0f5bcd4722837983e3b05cfada&symbols=INR&base=${selectedCurrency}`).then((response) => {
            let data = response.data;
            setExchangeRate(data.rates.INR)
            setIsLoading(false)
        }).catch((error) => {
            setIsLoading(false)
            setCurrency('INR')
            setExchangeRate(1)
        })
        axios.get(`https://api.currencyfreaks.com/latest?apikey=61ab7b0f5bcd4722837983e3b05cfada&symbols=${selectedCurrency}&base=USD`).then((response) => {
            let data = response.data;
            setdollarCharge(data.rates[selectedCurrency])
            setIsLoading(false)
        }).catch((error) => {

        });
    }

    //Text Editor Section **
    const [editorState, setEditorState] = useState(
        EditorState.createWithContent(ContentState.createFromText('All prices cover the service charges. Any incidental expenses like medicines, lab tests, doctor charges etc. will be charged extra as per actuals.'))
    );
    const onChangeText = (event) => {
        setCurrency(event.target.value)
    }


    const [convertedContent, setConvertedContent] = useState(convertToHTML(editorState.getCurrentContent()));
    const handleEditorChange = (state) => {
        setEditorState(state);
        convertContentToHTML();
    }
    const convertContentToHTML = () => {
        let currentContentAsHTML = convertToHTML(editorState.getCurrentContent());
        setConvertedContent(currentContentAsHTML);
    }

    const dispatch = useDispatch()

    useEffect(() => {
        if (careDetails && careDetails.length > 0) {
            let selectedCareDetails = careDetails.filter(data => data.careId === careid)
            console.log("🚀 ~ file: PackagesProvider.js ~ line 102 ~ useEffect ~ selectedCareDetails", selectedCareDetails)
            setSelectedCare(selectedCareDetails)
            setFieldOne(selectedCareDetails && selectedCareDetails[0].tblPackagePricingsByCareId && selectedCareDetails[0].tblPackagePricingsByCareId.nodes.length > 0 && selectedCareDetails[0].tblPackagePricingsByCareId.nodes[0] && selectedCareDetails[0].tblPackagePricingsByCareId.nodes[0].priceItem ? selectedCareDetails[0].tblPackagePricingsByCareId.nodes[0].priceItem : 'Activation Charge')
            setFieldTwo('MEET THE PARENT')
            setFieldThree('CRIMINAL RECORD VERIFICATION')
            setFieldFour(selectedCareDetails && selectedCareDetails[0].tblPackagePricingsByCareId && selectedCareDetails[0].tblPackagePricingsByCareId.nodes.length > 0 && selectedCareDetails[0].tblPackagePricingsByCareId.nodes[1] && selectedCareDetails[0].tblPackagePricingsByCareId.nodes[1].priceItem ? selectedCareDetails[0].tblPackagePricingsByCareId.nodes[1].priceItem : 'Expedited Fee')
            setInputs({
                priceOne: selectedCareDetails && selectedCareDetails[0].tblPackagePricingsByCareId && selectedCareDetails[0].tblPackagePricingsByCareId.nodes.length > 0 && selectedCareDetails[0].tblPackagePricingsByCareId.nodes[0] && selectedCareDetails[0].tblPackagePricingsByCareId.nodes[0].amount ? selectedCareDetails[0].tblPackagePricingsByCareId.nodes[0].amount : 0,
                priceTwo: selectedCareDetails && selectedCareDetails[0].mtpFee ? selectedCareDetails[0].mtpFee : 0,
                priceThree: selectedCareDetails && selectedCareDetails[0].crvFee ? selectedCareDetails[0].crvFee : 0,
                priceFour: selectedCareDetails && selectedCareDetails[0].tblPackagePricingsByCareId && selectedCareDetails[0].tblPackagePricingsByCareId.nodes.length > 0 && selectedCareDetails[0].tblPackagePricingsByCareId.nodes[1] && selectedCareDetails[0].tblPackagePricingsByCareId.nodes[1].amount ? selectedCareDetails[0].tblPackagePricingsByCareId.nodes[1].amount : 0,
                billingDate: selectedCareDetails && selectedCareDetails[0].billingDate ? selectedCareDetails[0].billingDate : new Date(),
                noOfMtp: selectedCareDetails && selectedCareDetails[0].noOfMtp ? selectedCareDetails[0].noOfMtp : '',
                noOfCrv: selectedCareDetails && selectedCareDetails[0].noOfCrv ? selectedCareDetails[0].noOfCrv : '',
            })
            setCurrency(selectedCareDetails && selectedCareDetails[0].userCurrency ? selectedCareDetails[0].userCurrency : null)

        } else {
            // history.goBack();
        }

    }, [careDetails])

    const onChange = e => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
    };

    // function focusEditor() {
    //     editor.current.focus();
    // }

    useEffect(() => {
        // focusEditor()
    }, []);

    const handleInputChange = (event) => {
        event.persist();
        setInputs(inputs => ({ ...inputs, [event.target.name]: event.target.value }));

        if (event.target.name === 'fieldOne') {
            setFieldOne(event.target.value)
        }
        if (event.target.name === 'fieldTwo') {
            setFieldTwo(event.target.value)
        }
        if (event.target.name === 'fieldThree') {
            setFieldThree(event.target.value)
        }
        if (event.target.name === 'fieldFour') {
            setFieldFour(event.target.value)
        }
        if (event.target.name === 'fieldFive') {
            setFieldFive(event.target.value)
        }
        if (event.target.name === 'priceOne') {
            setPriceOne(event.target.value)
        }
        if (event.target.name === 'priceTwo') {
            setPriceTwo(event.target.value)
        }
        if (event.target.name === 'priceThree') {
            setPriceThree(event.target.value)
        }
        if (event.target.name === 'priceFour') {
            setPriceFour(event.target.value)
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0)
        console.log('INPUTS', inputs);
    }, [])

    const onNavigateNewProvider = () => {
        history.push(`/admin/new-package/${careid}/${requestid}/${selectedCurrency}`);
    }
    const navigateCareListPage = () => {
        history.push(`/admin/care-package/${requestid}`);
    }

    const onClickEdit = (item) => {
        history.push({
            pathname: `/admin/update-careprovider/${careid}/${requestid}/${selectedCurrency}`,

            state: { providerData: item }

        });
    }

    const onClickUpdate = (priceId, priceItem, amount) => {
        var params = {
            "priceId": priceId,
            "pricingData": {
                "priceId": priceId,
                "priceItem": priceItem,
                "amount": parseFloat(amount),
            }
        }
        dispatch(AdminActions.updatePricing(params))
        setModalMessage('Updating...')
    }

    const onClickSubmit = () => {
        console.log("editorState", convertedContent)
        if (fieldOne && fieldTwo && fieldThree && fieldFour && fieldFive && inputs.billingDate && inputs.noOfCrv && inputs.noOfMtp && selectedCurrency !== null) {
            var params = {
                "priceList": [
                    {
                        "title": fieldOne,
                        "value": inputs.priceOne ? parseInt(inputs.priceOne) : 0
                    },
                    {
                        "title": fieldFour,
                        "value": inputs.priceFour ? parseInt(inputs.priceFour) : 0
                    },

                ],
                "billingDate": new Date(),
                "careId": careid,
                "paymentTerms": convertedContent,
                "userCurrency": selectedCurrency,
                "mtpFee": inputs.priceTwo ? parseInt(inputs.priceTwo) : 0,
                "crvFee": inputs.priceThree ? parseInt(inputs.priceThree) : 0,
                "noOfMtp": inputs.noOfMtp ? parseInt(inputs.noOfMtp) : 0,
                "noOfCrv": inputs.noOfCrv ? parseInt(inputs.noOfCrv) : 0,
            }
            dispatch(AdminActions.addOtherPricing(params))
            setIsLoading(true)
            setModalMessage('Adding other pricing details...')
        } else {
            setIsModalVisible(true)
        }
    }

    const onClickCancel = () => {
        history.push(`/admin/care-package/${requestid}`)
    }

    const servicesNeeded = careRequestDetails && careRequestDetails.description && careRequestDetails.description.split('Services needed: ')
    const startDate = careRequestDetails && careRequestDetails.serviceNeedsOn && careRequestDetails.serviceNeedsOn.split('T')

    return (
        <div className="whitegrad-bg">

            <Container>

                <Col md="12" lg="12">
                    {
                        !isPreview ?
                            <div>
                                {
                                    buttonClicked !== null && buttonClicked === 'Providers' ?
                                        <div>
                                            <div className="provider-top-bar">
                                                <Container>
                                                    <Row>
                                                        <Col onClick={navigateCareListPage} xs="2" md='1' className="relative">
                                                            <Row>
                                                                <img src={back} />
                                                                <span>Back</span>
                                                            </Row>
                                                        </Col>
                                                        <Col xs='1' md='1'></Col>
                                                        <Col xs="9" md='10'>
                                                            <h6 style={{ fontSize: 18 }} className="bold">{selectedCare[0] && selectedCare[0].careTitle}</h6>
                                                        </Col>
                                                    </Row>
                                                </Container>
                                            </div>
                                            <Row className="visit-type-wrapper" >

                                                <Row style={{ marginBottom: 50, marginTop: 150 }}>

                                                    {
                                                        selectedCare[0] && selectedCare[0].tblCareProvidersByCareId && selectedCare[0].tblCareProvidersByCareId.nodes && selectedCare[0].tblCareProvidersByCareId.nodes.map((data, index) =>


                                                            <Col xs='12' md='4' lg="4">

                                                                <ProviderCardForCare style={{ marginTop: -10 }} data={data} amount={data.amount} monthly={`${Math.round(data.monthlyFee / exchangeRate)}`} perVisit={`${Math.round(data.perVisitCharge / exchangeRate)}`} serviceFee={`${data.yocoServiceCharge}`} type="display" />

                                                            </Col>
                                                        )
                                                    }
                                                    {
                                                        selectedCare[0] && selectedCare[0].noOfMtp && selectedCare[0].noOfMtp !== null && selectedCare[0].noOfMtp !== selectedCare[0].tblCareProvidersByCareId.nodes.length &&
                                                        <Col xs='12' md='4'>
                                                            <div style={{ height: 350, paddingTop: 130 }} className="add-prov card-shadow" onClick={onNavigateNewProvider}>
                                                                <p style={{ textAlign: 'center', color: '#5e2490', fontSize:19, fontWeight:"bold" }}>Add Provider</p>
                                                                <img className="pointer" src={add} />
                                                            </div>
                                                        </Col>
                                                    }
                                                    {/* <div style={{ 'padding-top': '25px' }}>
                                            <Row >

                                            </Row>
                                        </div> */}
                                                </Row>

                                            </Row>
                                        </div>

                                        :
                                        buttonClicked !== null && buttonClicked === 'Pricing' ?

                                            <div>
                                                <Row className="visit-type-wrapper">
                                                    <div style={{ marginBottom: 50, marginTop: 150, padding: 20, borderRadius: 10 }} className="card-shadow whitegrad-bg">
                                                        <p style={{ color: 'purple', textAlign: 'center', fontWeight:"bold", fontSize:19 }}>Other Details</p>

                                                        <div className="provider-package-form">
                                                            <FormRowHorizontal>
                                                                <h5 style={{ fontSize: 16.5}}>Billing Date</h5>
                                                                <p style={{ fontSize: 16, padding: 5 }}>One month after the service commences.</p>
                                                            </FormRowHorizontal>
                                                            <FormRowHorizontal>
                                                                <h5 style={{ fontSize: 16.5}}>User Currency</h5>

                                                                <select onChange={onChangeText} value={selectedCurrency} className="form-control country-select">
                                                                    {
                                                                        countries.map((country, index) =>
                                                                            <option key={index} value={country.currency}>{`${country.currency}`}</option>
                                                                        )
                                                                    }
                                                                </select>


                                                            </FormRowHorizontal>
                                                            <FormRowHorizontal>

                                                                <input type="text" value={fieldOne} name="fieldOne" onChange={handleInputChange} />
                                                                <input type="number" value={inputs.priceOne} name="priceOne" onChange={handleInputChange} />

                                                            </FormRowHorizontal>
                                                            <FormRowHorizontal>
                                                                <h5 style={{ fontSize: 16.5}}>Meet The Parent</h5>
                                                                <input type="number" value={inputs.priceTwo} name="priceTwo" onChange={handleInputChange} />
                                                                <input type="number" value={inputs.noOfMtp} name="noOfMtp" placeholder={'No of Sp'} onChange={handleInputChange} />
                                                            </FormRowHorizontal>
                                                            <FormRowHorizontal>
                                                                <h5 style={{ fontSize: 16.5}}>Criminal Record Verification</h5>
                                                                <input type="number" value={inputs.priceThree} name="priceThree" onChange={handleInputChange} />
                                                                <input type="number" value={inputs.noOfCrv} placeholder={'No of Sp'} name="noOfCrv" onChange={handleInputChange} />

                                                            </FormRowHorizontal>
                                                            <FormRowHorizontal>
                                                                <input type="text" value={fieldFour} name="fieldFour" onChange={handleInputChange} />
                                                                <input type="number" value={inputs.priceFour} name="priceFour" onChange={handleInputChange} />

                                                            </FormRowHorizontal>
                                                            <br />
                                                            <FormRow>
                                                                <h4>Payment Terms</h4>

                                                                <Editor
                                                                    editorState={editorState}
                                                                    onEditorStateChange={handleEditorChange} />


                                                            </FormRow>

                                                            <FormRowHorizontal>
                                                                <Row className="package-form-submit">
                                                                    <Button className="btn btn-primary" style={{ marginRight: 10 }} onClick={onClickSubmit}>Save</Button>
                                                                    <Button className="btn btn-secondary" style={{ marginLeft: 10 }} onClick={onClickCancel}>Cancel</Button>
                                                                </Row>
                                                            </FormRowHorizontal>
                                                        </div>
                                                    </div>
                                                </Row>
                                                <Modal isOpen={isModalVisible}>
                                                    <ModalBody>
                                                        <div style={{ textAlign: 'center' }}>
                                                            <p>Please enter required details</p>
                                                            <Button onClick={() => setIsModalVisible(false)}>Close</Button>
                                                        </div>
                                                    </ModalBody>
                                                </Modal>
                                                {
                                                    <Modal isOpen={isLoading && failedToAddOtherPricing === false && failedToAddOtherPricing !== null} role="dialog" autoFocus={true} centered={true}>
                                                        <ModalBody>
                                                            <div style={{ textAlign: 'center' }}>
                                                                <p>Other pricing details added successfully!</p>
                                                                <Button onClick={() => history.push(`/admin/care-package/${requestid}`)}>Ok</Button>
                                                            </div>
                                                        </ModalBody>
                                                    </Modal>
                                                }
                                                {
                                                    <Modal isOpen={!isLoading && failedToAddOtherPricing} role="dialog" autoFocus={true} centered={true}>
                                                        <ModalBody>
                                                            <div style={{ textAlign: 'center' }}>
                                                                <p>Failed to add other pricing details, please try again.</p>
                                                                <Button onClick={() => history.push(`/admin/care-package/${requestid}`)}>Ok</Button>
                                                            </div>
                                                        </ModalBody>
                                                    </Modal>
                                                }
                                                {
                                                    <Modal isOpen={isPricingUpdated} role="dialog" autoFocus={true} centered={true}>
                                                        <ModalBody>
                                                            <div style={{ textAlign: 'center' }}>
                                                                <p>Pricing details updated successfully!</p>
                                                                <Button onClick={() => setModalMessage('')}>Ok</Button>
                                                            </div>
                                                        </ModalBody>
                                                    </Modal>
                                                }
                                                {
                                                    <Modal isOpen={failedToUpdatePricing} role="dialog" autoFocus={true} centered={true}>
                                                        <ModalBody>
                                                            <div style={{ textAlign: 'center' }}>
                                                                <p>Failed to update pricing details, please try again.</p>
                                                                <Button onClick={() => setModalMessage('')}>Ok</Button>
                                                            </div>
                                                        </ModalBody>
                                                    </Modal>
                                                }

                                                <Modal isOpen={isLoadingRedux} role="dialog" autoFocus={true} centered={true}>
                                                    <ModalBody>
                                                        <div style={{ textAlign: 'center' }}>
                                                            <p>{modalMessage}</p>
                                                        </div>
                                                    </ModalBody>
                                                </Modal>
                                            </div>

                                            :
                                            <div style={{ height: 500, marginTop: 80 }}>
                                                <h3 style={{ textAlign: 'center', paddingTop: 250 }}>Go &nbsp;<Button onClick={onClickCancel} className="hamper-button">Back</Button>&nbsp; and visit again</h3>
                                            </div>
                                }
                            </div>
                            :
                            <div>
                                <Row className="package-top-button">
                                    <div onClick={() => setIsPreview(false)}>
                                        <img src={assets.images.backButton} />
                                        <h2>Back</h2>
                                    </div>

                                </Row>
                                <Row style={{ paddingLeft: 20, paddingRight: 20 }}>
                                    <Col md="5">
                                        <div style={{ paddingTop: 20 }}>
                                            <div className="neat-button add-new-button"><h3 className="bold">CUSTOMER</h3></div>
                                            <br></br>
                                            {
                                                careRequestDetails && careRequestDetails.tblUserByUserId &&
                                                <Table hover className="table">
                                                    <tr className="no-border">
                                                        <th className="font-title bold">NAME :</th>
                                                        <td className="font-title">{careRequestDetails.tblUserByUserId.fullname}</td>
                                                    </tr>
                                                    <tr className="">
                                                        <th className="font-title bold">ADDRESS :</th>
                                                        <td className="font-title">{careRequestDetails.tblUserByUserId.city}, {careRequestDetails.tblUserByUserId.state}, {careRequestDetails.tblUserByUserId.country} </td>
                                                    </tr>
                                                    <tr className="">
                                                        <th className="font-title bold">EMAIL :</th>
                                                        <td className="font-title">{careRequestDetails.tblUserByUserId.email}</td>
                                                    </tr>
                                                    <tr className="">
                                                        <th className="font-title bold">MOBILE :</th>
                                                        <td className="font-title">{careRequestDetails.tblUserByUserId.countryCode && careRequestDetails.tblUserByUserId.countryCode} {careRequestDetails.tblUserByUserId.phoneNumber}</td>
                                                    </tr>
                                                </Table>
                                            }
                                        </div>
                                    </Col>
                                    <Col md="1"></Col>
                                    <Col md="5">
                                        <div style={{ paddingTop: 20 }}>
                                            <div className="neat-button add-new-button"><h3 className="bold">CARE FOR</h3></div>
                                            <br></br>
                                            {
                                                careRequestDetails && careRequestDetails.tblUserByUserId &&
                                                <div className="provider-package-form">
                                                    <FormRowHorizontal>
                                                        <input type="text" value={careForFieldOne} name="careForFieldOne" onChange={handleInputChange} />
                                                        <input type="text" value={careRequestDetails.tblUserByUserId.fullname} name="careForValueOne" onChange={handleInputChange} />
                                                    </FormRowHorizontal>
                                                    <FormRowHorizontal>
                                                        <input type="text" value={careForFieldTwo} name="careForFieldTwo" onChange={handleInputChange} />
                                                        <input type="text" value={careRequestDetails.locationTitle} name="careForValueTwo" onChange={handleInputChange} />
                                                    </FormRowHorizontal>
                                                    <FormRowHorizontal>
                                                        <input type="text" value={careForFieldThree} name="careForFieldThree" onChange={handleInputChange} />
                                                        <textarea rows="4" value={servicesNeeded[0]} name="careForValueThree" onChange={handleInputChange} />
                                                    </FormRowHorizontal>
                                                    <FormRowHorizontal>
                                                        <input type="text" value={careForFieldFour} name="careForFieldFour" onChange={handleInputChange} />
                                                        <input type="text" value={startDate[0]} name="careForValueFour" onChange={handleInputChange} />
                                                    </FormRowHorizontal>
                                                </div>
                                            }
                                        </div>
                                    </Col>
                                </Row>
                                <Row style={{ paddingLeft: 20, paddingRight: 20 }}>
                                    <Col md="5">
                                        <div style={{ paddingTop: 20 }}>
                                            <div className="neat-button add-new-button"><h3 className="bold">SUBSCRIPTION</h3></div>
                                            <br></br>
                                            {
                                                careRequestDetails && careRequestDetails.tblUserByUserId &&
                                                <div className="provider-package-form">
                                                    <FormRowHorizontal>
                                                        <input type="text" value={subsFieldOne} name="subsFieldOne" onChange={handleInputChange} />
                                                        <input type="text" value={careRequestDetails.title} name="subsValueOne" onChange={handleInputChange} />
                                                    </FormRowHorizontal>
                                                    <FormRowHorizontal>
                                                        <input type="text" value={subsFieldTwo} name="subsFieldTwo" onChange={handleInputChange} />
                                                        <input type="text" value={startDate[0]} name="subsValueOne" onChange={handleInputChange} />
                                                    </FormRowHorizontal>
                                                    <FormRowHorizontal>
                                                        <input type="text" value={subsFieldThree} name="subsFieldThree" onChange={handleInputChange} />
                                                        <input rows="4" value="20 Day Notice" name="subsValueOne" onChange={handleInputChange} />
                                                    </FormRowHorizontal>
                                                    <FormRowHorizontal>
                                                        <input type="text" value={subsFieldFour} name="subsFieldFour" onChange={handleInputChange} />
                                                        <textarea type="text" value={servicesNeeded[1]} name="subsValueOne" onChange={handleInputChange} />
                                                    </FormRowHorizontal>
                                                    {
                                                        selectedCare[0] && selectedCare[0].tblCareProvidersByCareId.nodes && selectedCare[0].tblCareProvidersByCareId.nodes.map(a => a.supportDescription).map((data, index) =>
                                                            <FormRowHorizontal>
                                                                <input type="text" value={subsFieldFive + ' ' + ++index} name="subsFieldFive" onChange={handleInputChange} />
                                                                <textarea type="text" value={data} name="subsValueOne" onChange={handleInputChange} />
                                                            </FormRowHorizontal>
                                                        )}
                                                </div>
                                            }
                                        </div>
                                    </Col>
                                    <Col md="1"></Col>
                                    <Col md="5">
                                        <div style={{ paddingTop: 20 }}>
                                            <div className="neat-button add-new-button"><h3 className="bold">PRICING</h3></div>
                                            <br></br>
                                            <div className="provider-package-form">
                                                <FormRowHorizontal>
                                                    <h5>Billing  Date</h5>
                                                    <input type="date" value={selectedCare[0] && selectedCare[0].billingDate && selectedCare[0].billingDate} name="billingDate" onChange={handleInputChange} />
                                                </FormRowHorizontal>
                                                <FormRowHorizontal>
                                                    <input type="text" value={fieldOne} name="fieldOne" onChange={handleInputChange} />
                                                    <input type="text" value={selectedCare[0] && selectedCare[0].tblPackagePricingsByCareId && selectedCare[0].tblPackagePricingsByCareId.nodes.length > 0 && selectedCare[0].tblPackagePricingsByCareId.nodes[3].amount} name="priceOne" onChange={handleInputChange} />
                                                </FormRowHorizontal>
                                                <FormRowHorizontal>
                                                    <input type="text" value={fieldTwo} name="fieldTwo" onChange={handleInputChange} />
                                                    <input type="text" value={selectedCare[0] && selectedCare[0].tblPackagePricingsByCareId && selectedCare[0].tblPackagePricingsByCareId.nodes.length > 0 && selectedCare[0].tblPackagePricingsByCareId.nodes[2].amount} name="priceTwo" onChange={handleInputChange} />
                                                </FormRowHorizontal>
                                                <FormRowHorizontal>
                                                    <input type="text" value={fieldThree} name="fieldThree" onChange={handleInputChange} />
                                                    <input type="text" value={selectedCare[0] && selectedCare[0].tblPackagePricingsByCareId && selectedCare[0].tblPackagePricingsByCareId.nodes.length > 0 && selectedCare[0].tblPackagePricingsByCareId.nodes[1].amount} name="priceThree" onChange={handleInputChange} />
                                                </FormRowHorizontal>
                                                <FormRowHorizontal>
                                                    <input type="text" value={fieldFour} name="fieldFour" onChange={handleInputChange} />
                                                    <input type="text" value={selectedCare[0] && selectedCare[0].tblPackagePricingsByCareId && selectedCare[0].tblPackagePricingsByCareId.nodes.length > 0 && selectedCare[0].tblPackagePricingsByCareId.nodes[0].amount} name="priceFour" onChange={handleInputChange} />
                                                </FormRowHorizontal>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <Col>
                                    <div className="neat-button add-new-button"><h3 className="bold">SERVICE PROVIDERS</h3></div>
                                    <Row className="visit-type-wrapper" >

                                        <Row>
                                            {
                                                selectedCare[0] && selectedCare[0].tblCareProvidersByCareId && selectedCare[0].tblCareProvidersByCareId.nodes && selectedCare[0].tblCareProvidersByCareId.nodes.map((data, index) =>
                                                    <Col lg="4">
                                                        <ProviderCardForCare data={data} amount={data.amount} type="display" />
                                                        {/* <ProviderPackageCard data={data} /> */}
                                                    </Col>
                                                )}
                                        </Row>

                                    </Row>
                                </Col>
                            </div>
                    }

                </Col>
            </Container>
        </div>
    )
}

const mapStateToProps = (state) => ({
    failedToAddOtherPricing: state.admin.failedToAddOtherPricing,
    isLoadingRedux: state.admin.isLoading,
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(PackagesProvider)
