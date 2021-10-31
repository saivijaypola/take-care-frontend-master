import React, { useState, useEffect } from 'react'
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
    ModalBody, Button,
    Label
} from "reactstrap";
import { Form, Radio } from 'semantic-ui-react'
import providerData from '../provider.json';
import classnames from 'classnames';
import assets from '../../../assets/images';
import SearchProviderCard from '../../../components/Shared/AdminComponents/SearchProviderCard';
import { render } from '@testing-library/react';
import { FormRow } from '../AdminStyled';
import { useHistory } from "react-router";
import go from "../../../assets/images/go.png";
import left from "../../../images/icon/left.png";
import right from "../../../images/icon/right.png";
import axios from "axios";
import search from "../../../images/icon/search.png";
import {
    BrowserRouter as Router,
    useParams
} from "react-router-dom";
import { FormRowHorizontal } from '../AdminStyled';
import { AdminActions } from '../../../redux/actions';
import { useDispatch, useSelector } from "react-redux";
import { AvForm, AvField, AvGroup } from 'availity-reactstrap-validation';
import { countries } from "../../User/country";
import { isEmpty, lowerCase } from 'lodash';

export const AddNewPackage = ({ props }) => {
    const [searchType, setSearchType] = useState('name');
    const [currentTab, setCurrentTab] = useState('select-provider')
    const [tabName, setTabName] = useState(currentTab === 'select-provider' ? 'Select Provider' : currentTab === 'common-info' ? 'Common Information' : '')
    const [inputs, setInputs] = useState({
        perVisit: 0,
        serviceCharge: 0,
        monthlyFee: 0

    });
    const [selectedProvider, setSelectedProvider] = useState()
    const [totalProviderAmount, setTotalProviderAmount] = useState(0)
    const [yocoServiceCharge, setYocoServiceCharge] = useState(40)
    const [grandTotal, setGrandTotal] = useState(0)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [exchangeRate, setExchangeRate] = useState(1)
    const [dollarCharge, setdollarCharge] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [modalMessage, setModalMessage] = useState('Loading...')
    const [searchValue, setSearchValue] = useState('');
    const history = useHistory();
    let { careid, requestid, currency } = useParams();
    const [selectedFee, setSelectedFee] = useState('Monthly Fee');
    const [finalAmount, setFinalAmount] = useState(0);

    const dispatch = useDispatch()
    const [selectedCurrency, setCurrency] = useState(currency !== '' ? currency : 'INR')

    const isLoadingProviderSearch = useSelector(state => state.admin.isLoading);
    const wildCardProviders = useSelector(state => state.admin.wildCardProviders);
    const failedToAddProvider = useSelector(state => state.admin.failedToAddProvider);
    const isLoadingRedux = useSelector(state => state.admin.isLoading);
    const careRequestDetails = useSelector(state => state.admin.careRequestDetails);

    useEffect(() => {
        if (selectedCurrency) {
            getCurrencyRate()
        }
        // window.scrollTo(0, 0)
    }, [selectedCurrency, grandTotal])

    useEffect(() => {
        var splitStr = searchValue.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
        }
        var joinStr = splitStr.join(' ');
        const timeOutId = setTimeout(() => handleSearch(joinStr), 500);
        return () => clearTimeout(timeOutId);
    }, [searchValue]);

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
        });
        axios.get(`https://api.currencyfreaks.com/latest?apikey=61ab7b0f5bcd4722837983e3b05cfada&symbols=${selectedCurrency}&base=USD`).then((response) => {
            let data = response.data;
            setdollarCharge(data.rates[selectedCurrency])
            setIsLoading(false)
        }).catch((error) => {

        });
    }

    const onChangeText = (event) => {
        setCurrency(event.target.value)
    }

    const handleInputChange = (event) => {
        event.persist();
        setInputs(inputs => ({ ...inputs, [event.target.name]: event.target.value }));
        //Calculate Provider

        var serviceCharge = 0;
        var finalAmount = 0;

        if (event.target.name === 'monthlyFee') {
            if (selectedFee === 'Monthly Fee') {
                serviceCharge = parseFloat(event.target.value) * parseFloat(yocoServiceCharge) / 100
                finalAmount = parseFloat(event.target.value) + serviceCharge
                setFinalAmount(parseFloat(finalAmount).toFixed(2))
            }
        }

        if (event.target.name === 'serviceCharge') {
            if (selectedFee === 'Per Visit Fee') {
                serviceCharge = parseFloat(event.target.value) * parseFloat(yocoServiceCharge) / 100
                finalAmount = parseFloat(event.target.value) + serviceCharge
                setFinalAmount(parseFloat(finalAmount).toFixed(2))
            }
        }

        if (event.target.name === 'feeType') {
            setSelectedFee(event.target.value)
            if (event.target.value === 'Monthly Fee') {
                serviceCharge = parseFloat(inputs.monthlyFee) * parseFloat(yocoServiceCharge) / 100
                finalAmount = parseFloat(inputs.monthlyFee) + serviceCharge
                setFinalAmount(parseFloat(finalAmount).toFixed(2))
            } else if (event.target.value === 'Per Visit Fee') {
                serviceCharge = parseFloat(inputs.serviceCharge) * parseFloat(yocoServiceCharge) / 100
                finalAmount = parseFloat(inputs.serviceCharge) + serviceCharge
                setFinalAmount(parseFloat(finalAmount).toFixed(2))
            }
        }

        if (event.target.name === 'yocoServiceCharge') {
            if (selectedFee === 'Monthly Fee') {
                serviceCharge = parseFloat(inputs.monthlyFee) * parseFloat(event.target.value) / 100
                finalAmount = parseFloat(inputs.monthlyFee) + serviceCharge
                setYocoServiceCharge(event.target.value)
                setFinalAmount(parseFloat(finalAmount).toFixed(2))
            }
            if (selectedFee === 'Per Visit Fee') {
                serviceCharge = parseFloat(inputs.serviceCharge) * parseFloat(event.target.value) / 100
                finalAmount = parseFloat(inputs.serviceCharge) + serviceCharge
                setYocoServiceCharge(event.target.value)
                setFinalAmount(parseFloat(finalAmount).toFixed(2))
            }
        }

    }

    const onChange = (value) => {
        setSearchType(value);
    };

    const onSelectProvider = (providerId, data) => {
        if (providerId) {

            window.scrollTo(0, 0)
            setCurrentTab('brief-explain');
            setTabName("Common Information")
            setSelectedProvider(data)

        }
    }

    const onClickEdit = () => {
        setCurrentTab('select-provider');
        setTabName('Select Provider')
    }

    const handleSearch = (value) => {
        if (value && value.length > 3) {
            dispatch(AdminActions.wildCardSearch({
                type: searchType,
                value: value,
                offset: 0,
                pageSize: 100,
                filter: lowerCase

            }))
        }

    }
    const prevStep = () => {
        window.scrollTo(0, 0)
        if (currentTab === 'select-provider') {
            setCurrentTab('care-option-name');
            setTabName("Add Care Option")
        } else if (currentTab === 'brief-explain') {
            setCurrentTab('select-provider');
            setTabName("Select Provider")
        } else if (currentTab === 'summary') {
            setCurrentTab('brief-explain');
            setTabName("Common Information")
        }
    }
    const nextStep = () => {
        window.scrollTo(0, 0)
        if (currentTab === 'care-option-name') {
            setCurrentTab('select-provider');
            setTabName("Select Provider")
        } else if (currentTab === 'select-provider') {
            setCurrentTab('brief-explain');
            setTabName("Common Information")
        } else if (currentTab === 'brief-explain' && inputs.briefExplain && inputs.briefExplain.length > 5 && inputs.serviceSupport && inputs.serviceSupport.length > 5 && inputs.providerComment && inputs.providerComment.length > 5 && inputs.monthlyFee && inputs.serviceCharge) {
            setCurrentTab('summary');
            setTabName("Summary")
        } else if (currentTab === 'summary') {

            var params = {
                "careId": careid,
                "providerId": selectedProvider.userId,
                "supportDescription": inputs.serviceSupport,
                "briefDescription": inputs.briefExplain,
                "yocoComments": inputs.providerComment,
                "monthlyFee": inputs.monthlyFee,
                "perVisitCharge": inputs.serviceCharge,
                "noOfVisits": inputs.perVisit ? inputs.perVisit : 0,
                "visitType": inputs.visitType ? inputs.visitType : 'Monthly',
                "providerFee": totalProviderAmount,
                "yocoServiceCharge": yocoServiceCharge,
                "totalAmountInr": grandTotal,
                "currnecyType": selectedCurrency,
                "exchangeRate": exchangeRate,
                "totalUserCurrencyAmount": (Math.round(grandTotal / exchangeRate))
            }
            dispatch(AdminActions.addNewCareProvider(params))
            setIsLoading(true)
            console.log('PARAMS', params);
            setModalMessage('Adding new care provider...')
        }
    }

    const renderScreen = () => {

        if (currentTab === 'select-provider') {
            return (
                <>

                    <Row>
                        <div style={{ width: '100%' }}>
                            <div className="select-type-section">
                                <Form>
                                    <Row>
                                        <Form.Field style={{ marginLeft: 15 }}>
                                            <p className="bold font16">Search By </p>
                                        </Form.Field>
                                        <Row>
                                            <Form.Field style={{ marginLeft: 30 }}><Radio style={{ fontSize: 16 }} label='Name' name='radioGroup' value='name' checked={searchType === 'name'} onChange={() => onChange('name')} /></Form.Field>
                                            <Form.Field style={{ marginLeft: 20 }}><Radio style={{ fontSize: 16 }} label='Email' name='radioGroup' value='email' checked={searchType === 'email'} onChange={() => onChange('email')} /></Form.Field>
                                            <Form.Field style={{ marginLeft: 20 }}><Radio style={{ fontSize: 16 }} label='Phone No' name='radioGroup' value='phone' checked={searchType === 'phone'} onChange={() => onChange('phone')} /></Form.Field>
                                        </Row>
                                    </Row>
                                </Form>
                            </div>
                            <div className="search-text-wrapper">
                                <input type="text" name="searchText" className="provider-search-input" value={inputs.searchText} placeholder={`Type the provider ${searchType}`} onChange={e => setSearchValue(e.target.value)} />
                                <img src={search} />
                                <br />

                            </div>

                            <Row>

                                {!isLoadingProviderSearch && isEmpty(wildCardProviders) && searchValue !== '' ?
                                    <p style={{ textAlign: 'center', paddingTop: 100, width: '100%', fontSize: 19 }}>No Results Found</p>
                                    :
                                    wildCardProviders && wildCardProviders.map((data, index) =>
                                        <Col lg='10'>
                                            <SearchProviderCard data={data} onSelect={onSelectProvider} type="list" />
                                        </Col>

                                    )}
                            </Row>
                        </div>

                    </Row>
                </>
            )
        } else if (currentTab === 'brief-explain') {
            return (
                <div>
                    <div>
                        <AvForm>
                            <AvGroup className="form-group position-relative">
                                <Label for="serviceSupport"><p className="bold font16">Services Supported<span className="text-danger">*</span></p></Label>
                                <br />
                                <AvField type="select" autofocus="autofocus" value={inputs.serviceSupport ? inputs.serviceSupport.trim() : ''} className="form-control custom-select" name="serviceSupport" id="serviceSupport" onChange={handleInputChange}
                                    errorMessage="Please enter the services provided">
                                    <option> Select </option>
                                    <option>Fundamentals</option>
                                    <option>Weekly Vitals</option>
                                    <option>Monthly Testing</option>
                                    <option>Post Hospitalization Care</option>
                                    <option>Weekly Companion</option>
                                    <option>Daily Essentials</option>
                                    <option>Customized Service</option>

                                </AvField>

                                <Label for="briefExplain"><p className="bold font16">Service Details<span className="text-danger">*</span></p></Label>
                                <AvField placeholder="Maximum 200 Characters" type="textarea" autofocus="autofocus" className="form-control" value={inputs.briefExplain ? inputs.briefExplain.trim() : ''} name="briefExplain" id="briefExplain" onChange={handleInputChange}
                                    errorMessage="Please enter the required information"
                                    validate={{
                                        required: { value: true },
                                        minLength: { value: 6 },
                                        maxLength: { value: 250 }
                                    }}
                                />

                                <Label for="providerComment"><p className="bold font16">YoCo Comments<span className="text-danger">*</span></p></Label>
                                <AvField placeholder="Maximum 200 Characters" type="textarea" maxlength="500" autofocus="autofocus" className="form-control" value={inputs.providerComment ? inputs.providerComment : ''} name="providerComment" id="providerComment" onChange={handleInputChange}
                                    errorMessage="Please enter the YoCo comments"
                                    validate={{
                                        required: { value: true },
                                        minLength: { value: 6 },
                                        maxLength: { value: 250 }
                                    }}
                                />
                            </AvGroup>
                        </AvForm>
                    </div>
                    <div className="section-wrapper-info">
                        <Label><p className="bold font16">Provider Price Info (INR)</p></Label>
                        <br />
                        <AvForm>
                            <Row>
                                <Col md="6">
                                    <AvGroup className="form-group position-relative">
                                        <Label for="monthlyFee"><p className="bold">Monthly provider fee<span className="text-danger">*</span></p></Label>
                                        <AvField type="number" className="text-input" required value={inputs.monthlyFee} name="monthlyFee" id="monthlyFee" onChange={handleInputChange}
                                            errorMessage="Please enter the monthly proider fee"
                                            validate={{
                                                required: { value: true },
                                                minLength: { value: 1 },
                                                maxLength: { value: 10 }
                                            }}
                                        />
                                    </AvGroup>
                                </Col>
                                <Col md="6">
                                    <AvGroup className="form-group position-relative">
                                        <Label for="serviceCharge"><p className="bold">Service charge per visit<span className="text-danger">*</span></p></Label>
                                        <AvField type="number" className="text-input" required value={inputs.serviceCharge} name="serviceCharge" id="serviceCharge" onChange={handleInputChange}
                                            errorMessage="Please enter the service charge per visit"
                                            validate={{
                                                required: { value: true },
                                                minLength: { value: 1 },
                                                maxLength: { value: 10 }
                                            }}
                                        />
                                    </AvGroup>
                                </Col>
                                {/* <Col md="4">
                                    <AvGroup className="form-group position-relative">
                                        <Label for="perVisit"><h6 className="bold">No of visits: <span className="text-danger">*</span></h6></Label>
                                        <AvField type="number" className="text-input" required value={inputs.perVisit} name="perVisit" id="perVisit" onChange={handleInputChange}
                                            errorMessage="Please enter the number of visits"
                                            validate={{
                                                required: { value: true },
                                                minLength: { value: 1 },
                                                maxLength: { value: 10 }
                                            }}
                                        />
                                    </AvGroup>
                                </Col> */}
                            </Row>
                        </AvForm>
                    </div>
                    <hr />
                    <div className="section-wrapper-info">
                        <Label><p style={{ marginBottom: 15, fontSize:16, fontWeight:"bold" }} className="bold">Service Charge Info</p></Label>
                        <AvForm>

                            <Row>
                                <Col md="4">
                                    <AvGroup className="form-group position-relative">
                                        <Label for="feeType"><p className="bold">Fee Type<span className="text-danger">*</span></p></Label>
                                        <AvField type="select" className="text-input" name="feeType" id="feeType" onChange={handleInputChange}
                                            errorMessage="Total service charge cannot be empty">
                                            <option>Monthly Fee</option>
                                            <option>Per Visit Fee</option>
                                        </AvField>

                                    </AvGroup>
                                </Col>
                                <Col md="4">
                                    <AvGroup className="form-group position-relative">
                                        <Label for="yocoServiceCharge"><p className="bold">YoCo Fee %<span className="text-danger">*</span></p></Label>
                                        <AvField type="number" maxlength="10" className="text-input" required value={yocoServiceCharge} name="yocoServiceCharge" id="yocoServiceCharge" onChange={handleInputChange}
                                            errorMessage="Please enter the YoCo service fee"
                                        />
                                    </AvGroup>
                                </Col>
                                <Col md="4">
                                    <AvGroup className="form-group position-relative">
                                        <Label for="finalAmount"><p className="bold">Final Amount<span className="text-danger">*</span></p></Label>
                                        {/* <AvField type="number" maxlength="10" className="text-input" disabled required value={grandTotal} name="finalAmount" id="finalAmount" onChange={handleInputChange}
                                            errorMessage="Total amount cannot be empty"
                                        /> */}
                                        <p style={{ marginTop: 10, fontSize:16, fontWeight: "bold" }}>INR {finalAmount}</p>
                                    </AvGroup>
                                </Col>
                            </Row>
                        </AvForm>
                        <br />

                        {
                            selectedCurrency && (
                                <div>
                                    <Label for="grandTotal"><p className="bold">Final (In user currency)<span className="text-danger">*</span></p></Label>
                                    <Row>

                                        <div className="provider-price-currency">
                                            <p style={{ marginLeft: 50, fontSize:16, fontWeight:"bold" }}><span>{`${selectedCurrency} ${Math.round(finalAmount / exchangeRate)}`}</span></p>
                                        </div>
                                    </Row>
                                </div>
                            )

                        }

                    </div>
                </div>
            )

        } else if (currentTab === 'summary') {
            return (
                <Row className="summery-wrapper">
                    <Row>
                        <Col md="6">
                            <SearchProviderCard data={selectedProvider} currency={`${selectedCurrency}`} monthly={`${Math.round(inputs.monthlyFee / exchangeRate)}`} perVisit={`${Math.round(inputs.serviceCharge / exchangeRate)}`} serviceFee={`${yocoServiceCharge}`} onSelect={onSelectProvider} type="display" />

                        </Col>
                        <Col md="6">
                            <div className="summery-content-wrapper">
                                <p style={{fontSize:16, fontWeight:"bold"}}>Services Supported : </p>
                                <p>{inputs.serviceSupport ? inputs.serviceSupport : ''}</p>
                                <p style={{fontSize:16, fontWeight:"bold"}}>Service Details : </p>
                                <p>{inputs.briefExplain ? inputs.briefExplain : ''}</p>
                                <p style={{fontSize:16, fontWeight:"bold"}}>YoCo Comments : </p>
                                <p>{inputs.providerComment ? inputs.providerComment : ''}</p>
                            </div>
                        </Col>
                    </Row>
                </Row>
            )
        }
    }


    return (
        <div className='whitegrad-bg'>
            <Container>
                <Row>
                    <Col>
                        <Row>
                            <p className="tab-title font14">{tabName}</p>
                        </Row>
                        <div className="delight-bottom card-shadow" style={{ marginTop: 120, marginBottom: 50, paddingLeft: 50, paddingRight: 50 }}>
                            <div className="build-box build-box-admin" style={{ marginTop: 10 }}>

                                {renderScreen()}

                                <br /><br />
                                {currentTab !== 'select-provider' && currentTab !== 'summary' &&
                                    <>
                                        <img onClick={prevStep} style={{ paddingRight: 15 }} className="go-button-left" src={left} />
                                        <img onClick={nextStep} style={{ paddingLeft: 15 }} className="go-button-right" src={right} />
                                    </>
                                }
                                {currentTab === 'summary' &&
                                    <>
                                        <img onClick={prevStep} style={{ paddingRight: 15, marginTop: 15 }} className="go-button-left" src={left} />
                                        <Button onClick={nextStep}>Finish</Button>
                                    </>
                                }
                            </div>

                        </div>
                        {
                            <Modal isOpen={isLoading && !isLoadingRedux && failedToAddProvider === false && failedToAddProvider !== null} role="dialog" autoFocus={true} centered={true}>
                                <ModalBody>
                                    <div style={{ textAlign: 'center' }}>
                                        <p>New care provider added successfully!</p>
                                        <Button onClick={() => { history.push(`/admin/care-package/${requestid}`); setIsLoading(false) }}>Ok</Button>
                                    </div>
                                </ModalBody>
                            </Modal>
                        }
                        {
                            <Modal isOpen={!isLoadingRedux && failedToAddProvider} role="dialog" autoFocus={true} centered={true}>
                                <ModalBody>
                                    <div style={{ textAlign: 'center' }}>
                                        <p>Failed to add new care provider, please try again.</p>
                                        <Button onClick={() => history.push(`/admin/care-package/${requestid}`)}>Ok</Button>
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
                    </Col>
                    {currentTab !== 'summary' &&
                        <Col md="5" lg="5">
                            {
                                !isLoadingRedux && careRequestDetails && (
                                    <div className="admin-card card-shadow whitegrad-bg" style={{ marginTop: 150, marginBottom: 50 }}>
                                        <div className="build-box build-box-admin">
                                            <p><b>Title: </b>{careRequestDetails.title}</p>
                                            <p><b>Description: </b>{careRequestDetails.description}</p>
                                            <p><b>Service Needed On: </b>{new Date(careRequestDetails.serviceNeedsOn).toDateString()}</p>
                                            <p><b>Location: </b>{careRequestDetails.locationTitle}</p>
                                        </div>
                                    </div>
                                )
                            }
                        </Col>}
                </Row>
            </Container>

        </div >
    )
}

const mapStateToProps = (state) => ({
    isLoadingRedux: state.admin.isLoading,
    failedToAddProvider: state.admin.failedToAddProvider,
})

const mapDispatchToProps = {
    ...AdminActions,
}

export default connect(mapStateToProps, mapDispatchToProps)(AddNewPackage)
