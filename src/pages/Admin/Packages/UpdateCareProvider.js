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
import { Radio } from 'antd';
import providerData from '../provider.json';
import classnames from 'classnames';
import assets from '../../../assets/images';
import SearchProviderCard from '../../../components/Shared/AdminComponents/SearchProviderCard';
import { render } from '@testing-library/react';
import { FormRow } from '../AdminStyled';
import { useHistory } from "react-router";
import go from "../../../assets/images/go.png";
import left from "../../../images/icon/left.png";
import axios from "axios";

import {
    BrowserRouter as Router,
    useParams
} from "react-router-dom";
import { FormRowHorizontal } from '../AdminStyled';
import { AdminActions } from '../../../redux/actions';
import { useDispatch, useSelector } from "react-redux";
import { AvForm, AvField, AvGroup } from 'availity-reactstrap-validation';
import { countries } from "../../User/country";
import { isEmpty } from 'lodash';

export const UpdateCareProvider = ({ props }) => {
    const [searchType, setSearchType] = useState('name');
    const [currentTab, setCurrentTab] = useState('brief-explain')
    const [tabName, setTabName] = useState(currentTab === 'select-provider' ? 'Select Provider' : currentTab === 'common-info' ? 'Common Information' : '')
    const [inputs, setInputs] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState()
    const [providerDetails, setProviderDetails] = useState('');
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
    console.log("HISTORY", history.location.state.providerData);
    let { careid, requestid, currency } = useParams();
    const [selectedFee, setSelectedFee] = useState('Monthly Fee');
    const [finalAmount, setFinalAmount] = useState(0);

    const dispatch = useDispatch()
    const [selectedCurrency, setCurrency] = useState(currency !== '' ? currency : 'INR')

    const isLoadingProviderSearch = useSelector(state => state.admin.isLoading);
    const wildCardProviders = useSelector(state => state.admin.wildCardProviders);
    const failedToAddProvider = useSelector(state => state.admin.failedToAddProvider);
    const isUpdatedCareProvider = useSelector(state => state.admin.isUpdatedCareProvider);
    const isLoadingRedux = useSelector(state => state.admin.isLoading);
    const careRequestDetails = useSelector(state => state.admin.careRequestDetails);
    
    useEffect(() => {
        if (selectedCurrency) {
            getCurrencyRate()
        }
        window.scrollTo(0, 0)
        console.log("SELECTED CURRENCY", selectedCurrency)
    }, [selectedCurrency, grandTotal])

    useEffect(() => {
        if (history.location && history.location.state && history.location.state.providerData) {
            var providerDetails = history.location.state.providerData
            setProviderDetails(providerDetails)
            setInputs({
                serviceSupport: providerDetails.supportDescription,
                briefExplain: providerDetails.briefDescription,
                providerComment: providerDetails.yocoComments,
                monthlyFee: providerDetails.monthlyFee,
                serviceCharge: providerDetails.perVisitCharge,
                perVisit: providerDetails.noOfVisits,
            })
            setTotalProviderAmount(providerDetails.providerFee)
            setYocoServiceCharge(providerDetails.yocoServiceCharge)
            setGrandTotal(providerDetails.totalAmountInr)
            setCurrency(providerDetails.currnecyType)
        }
    }, [history])

    useEffect(() => {
        console.log("🚀 ~ file: AddNewPackage.js ~ line 70 ~ AddNewPackage ~ searchValue", searchValue)
        console.log('REQUEST DETAILS', careRequestDetails);

        const timeOutId = setTimeout(() => handleSearch(searchValue), 500);
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
    useEffect(() => {
        let serviceCharge = parseInt(totalProviderAmount) / 100 * 40
        setYocoServiceCharge(serviceCharge)
        setGrandTotal(parseInt(serviceCharge) + parseInt(totalProviderAmount))
    }, [totalProviderAmount])
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
                serviceCharge = parseFloat(providerDetails.monthlyFee) * parseFloat(yocoServiceCharge) / 100
                finalAmount = parseFloat(providerDetails.monthlyFee) + serviceCharge
                setFinalAmount(parseFloat(finalAmount).toFixed(2))
            } else if (event.target.value === 'Per Visit Fee') {
                serviceCharge = parseFloat(providerDetails.serviceCharge) * parseFloat(yocoServiceCharge) / 100
                finalAmount = parseFloat(providerDetails.serviceCharge) + serviceCharge
                setFinalAmount(parseFloat(finalAmount).toFixed(2))
            }
        }

        if (event.target.name === 'yocoServiceCharge') {
            if (selectedFee === 'Monthly Fee') {
                serviceCharge = parseFloat(providerDetails.monthlyFee) * parseFloat(event.target.value) / 100
                finalAmount = parseFloat(providerDetails.monthlyFee) + serviceCharge
                setYocoServiceCharge(event.target.value)
                setFinalAmount(parseFloat(finalAmount).toFixed(2))
            }
            if (selectedFee === 'Per Visit Fee') {
                serviceCharge = parseFloat(providerDetails.serviceCharge) * parseFloat(event.target.value) / 100
                finalAmount = parseFloat(providerDetails.serviceCharge) + serviceCharge
                setYocoServiceCharge(event.target.value)
                setFinalAmount(parseFloat(finalAmount).toFixed(2))
            }
        }

    }

    const onChange = e => {
        console.log('radio checked', e.target.value);
        setSearchType(e.target.value);

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
    const onClickConfirm = () => {
        // history.push(`/admin/package/${requestid}`)
        // console.log(requestid)
    }
    const handleSearch = (value) => {
        if (value && value.length > 3) {
            dispatch(AdminActions.wildCardSearch({
                type: searchType,
                value: value,
                offset: 0,
                pageSize: 100

            }))
        }

    }
    const prevStep = () => {
        window.scrollTo(0, 0)
        // if (currentTab === 'care-option-name') {
        //     setCurrentTab('care-option-name');
        //     setTabName("Common Information") }
        if (currentTab === 'brief-explain') {
            setCurrentTab('care-option-name');
            setTabName("Common Information")
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
            // } else if (currentTab === 'brief-explain' && inputs.briefExplain && inputs.briefExplain.length > 5 && inputs.serviceSupport && inputs.serviceSupport.length > 5 && inputs.providerComment && inputs.providerComment.length > 5 && inputs.monthlyFee && inputs.serviceCharge && inputs.perVisit && inputs.startDate) {
            //     setCurrentTab('care-option-name');
            //     setTabName("Common Information ")
            //     console.log('BRIEF EXPLAIN- 1', props);
        } else if (currentTab === 'brief-explain') {
            console.log('BRIEF EXPLAIN- 2', props);
            setTabName("Common Information");

            var params = {
                "careId": careid,
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

            let careProviderId = '';
            dispatch(AdminActions.updateCareProvider({
                careProviderId: history.location.state.providerData.careProviderId, data: params
            }))
            setIsLoading(true)
            setModalMessage('updating  care provider details...')

        }
    }
    const renderScreen = () => {

        if (currentTab === 'select-provider') {
            return (
                <>

                    <Row>
                        <div className="section-wrapper-provider">
                            <div className="select-type-section">
                                <p>Search By </p>
                                <Radio.Group onChange={onChange} value={searchType}>
                                    <Radio value={'name'}>Name</Radio>
                                    <Radio value={'email'}>Email</Radio>
                                    <Radio value={'phone'}>Phone No</Radio>

                                </Radio.Group>
                            </div>
                            <div className="search-text-wrapper">
                                <input type="text" name="searchText" className="provider-search-input" value={inputs.searchText} placeholder={`Type the provider ${searchType}`} onChange={e => setSearchValue(e.target.value)} />
                                <img src={assets.images.search} />
                                <br />

                            </div>
                            {isLoadingProviderSearch &&
                                <p style={{
                                    fontSize: 20,
                                    textAlign: 'left'
                                }}>Loading.....</p>
                            }

                            <Row>

                                {!isLoadingProviderSearch && isEmpty(wildCardProviders) && searchValue !== '' ?
                                    <p style={{fontSize:24, fontWeight:"bold"}}>No Result Found</p> :

                                    wildCardProviders && wildCardProviders.map((data, index) =>
                                        <Col lg="6">
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
                                <AvField type="select" maxlength="500" autofocus="autofocus" value={providerDetails.supportDescription ? providerDetails.supportDescription.trim() : ''} className="form-control" name="serviceSupport" id="serviceSupport" onChange={handleInputChange}
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
                                <AvField placeholder="Maximum 250 Characters" type="textarea" autofocus="autofocus" className="form-control" value={providerDetails.briefDescription ? providerDetails.briefDescription.trim() : ''} name="briefExplain" id="briefExplain" onChange={handleInputChange}
                                    errorMessage="Please enter the required information"
                                    validate={{
                                        required: { value: true },
                                        minLength: { value: 6 },
                                        maxLength: { value: 250 }
                                    }}
                                />

                                <Label for="providerComment"><p className="bold font16">YoCo Comments<span className="text-danger">*</span></p></Label>
                                <AvField placeholder="Maximum 250 Characters" type="textarea" maxlength="500" autofocus="autofocus" className="form-control" value={providerDetails.yocoComments ? providerDetails.yocoComments : ''} name="providerComment" id="providerComment" onChange={handleInputChange}
                                    errorMessage="Please enter the YoCo comments"
                                    validate={{
                                        required: { value: true },
                                        minLength: { value: 6 },
                                        maxLength: { value: 500 }
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
                                        <AvField type="number" className="text-input" required value={providerDetails.monthlyFee} name="monthlyFee" id="monthlyFee" onChange={handleInputChange}
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
                                        <AvField type="number" className="text-input" required value={providerDetails.perVisitCharge} name="serviceCharge" id="serviceCharge" onChange={handleInputChange}
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
                                        <AvField type="number" className="text-input" required value={providerDetails.noOfVisits} name="perVisit" id="perVisit" onChange={handleInputChange}
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
                        <Label><p className="bold font16" style={{ marginBottom: 15 }}>Service Charge Information</p></Label>
                        <AvForm>


                            {/* <Row>

                                <Col md="6">
                                    <AvGroup className="form-group position-relative">
                                        <Label for="visitType"><h6 className="bold">Subscription Type</h6></Label><br />
                                        <select className="text-input" name="visitType" onChange={handleInputChange}>
                                            <option value='monthly'>Monthly</option>
                                            <option value='onetime'>One-Time</option>
                                        </select>
                                    </AvGroup>

                                </Col>
                                <Col md="6">
                                    <AvGroup className="form-group position-relative">
                                        <Label for="startDate"><h6 className="bold">Start Date<span className="text-danger">*</span></h6></Label>
                                        <AvField type="date" className="text-input" required value={providerDetails.monthlyFee} name="startDate" id="startDate" onChange={handleInputChange}
                                            errorMessage="Please provide the start date"
                                        />
                                    </AvGroup>
                                </Col>
                            </Row>
                            <hr />
                            <br /> */}
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
                                        <Label for="yocoServiceCharge"><h6 className="bold">YoCo Service Fee %<span className="text-danger">*</span></h6></Label>
                                        <AvField type="number" maxlength="10" className="text-input" required value={providerDetails.yocoServiceCharge} name="yocoServiceCharge" id="yocoServiceCharge" onChange={handleInputChange}
                                            errorMessage="Please enter the YoCo service fee"
                                        />
                                    </AvGroup>
                                </Col>
                                <Col md="4">
                                    <AvGroup className="form-group position-relative">
                                        <Label for="finalAmount"><p className="bold">Final Amount<span className="text-danger">*</span></p></Label>
                                        {/* <AvField type="number" maxlength="10" className="text-input" required value={providerDetails.totalAmountInr} name="grandTotal" id="grandTotal" onChange={handleInputChange}
                                            errorMessage="Total amount cannot be empty"
                                        /> */}
                                        <p style={{ marginTop: 10, fontSize: 16 }} value={finalAmount}>INR {finalAmount}</p>
                                    </AvGroup>
                                </Col>
                            </Row>
                        </AvForm>
                        <br />

                        {
                            selectedCurrency && (
                                <div>
                                    <Label for="providerDetails.totalAmountInr"><p className="bold">Final (In user currency)<span className="text-danger">*</span></p></Label>
                                    <Row>

                                        <div className="provider-price-currency">
                                            <p style={{ marginLeft: 50, fontSize:16 }}><span>{`${selectedCurrency} ${Math.round(finalAmount / exchangeRate)}`}</span></p>
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
                            <SearchProviderCard data={selectedProvider} amount={`${selectedCurrency} ${Math.round(providerDetails.totalAmountInr / exchangeRate)}`} onSelect={onSelectProvider} type="display" />

                        </Col>
                        <Col md="6">
                            <div className="summery-content-wrapper">
                                <p style={{fontSize:16, fontWeight:"bold"}}>Services Supported : </p>
                                <p>{inputs.serviceSupport ? inputs.serviceSupport : ''}</p>
                                <p style={{fontSize:16, fontWeight:"bold"}}>Service Details : </p>
                                <p>{inputs.briefExplain ? inputs.briefExplain : ''}</p>
                                <p style={{fontSize:16, fontWeight:"bold"}}>YoCo Comments : </p>
                                <p>{inputs.providerComment ? inputs.providerComment : ''}</p>
                                <p style={{fontSize:16, fontWeight:"bold"}}>Subscription Type : </p>
                                <p>{inputs.visitType ? inputs.visitType : 'Monthly'}</p>
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
                    <Col md="8" lg="8">
                        <Row>
                            <p className="tab-title bold">{tabName}</p>
                        </Row>
                        <div className="delight-bottom card-shadow" style={{ marginTop: 120, marginBottom: 50 }}>
                            <div className="build-box build-box-admin">

                                {renderScreen()}

                                <br /><br />
                                {currentTab === 'brief-explain' &&
                                    <>
                                        <img onClick={() => history.push(`/admin/package-provider/${careid}/${requestid}`)} style={{ paddingRight: 15, marginTop: 15 }} className="go-button-left" src={left} />
                                        <Button className="btn btn-primary" onClick={nextStep}>Update</Button>
                                    </>
                                }
                            </div>

                        </div>
                        {
                            <Modal isOpen={isLoading && providerDetails.data !== '' && isUpdatedCareProvider === true} role="dialog" autoFocus={true} centered={true}>
                                <ModalBody>
                                    <div style={{ textAlign: 'center' }}>
                                        <p>Provider details updated successfully!</p>
                                        <Button onClick={() => { history.push(`/admin/care-package/${requestid}`); setIsLoading(false) }}>Ok</Button>
                                    </div>
                                </ModalBody>
                            </Modal>
                        }
                        {
                            <Modal isOpen={!isLoadingRedux && isUpdatedCareProvider === false} role="dialog" autoFocus={true} centered={true}>
                                <ModalBody>
                                    <div style={{ textAlign: 'center' }}>
                                        <p>Failed to update care provider, please try again.</p>
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
                    <Col md="4" lg="4">
                        {
                            !isLoadingRedux && careRequestDetails && (
                                <div className="admin-card card-shadow whitegrad-bg" style={{ marginTop: 120 }}>
                                    <div className="build-box build-box-admin">
                                        <p><b>Title: </b>{careRequestDetails.title}</p>
                                        <p><b>Description: </b>{careRequestDetails.description}</p>
                                        <p><b>Service Needed On: </b>{new Date(careRequestDetails.serviceNeedsOn).toDateString()}</p>
                                        <p><b>Location: </b>{careRequestDetails.locationTitle}</p>
                                    </div>
                                </div>
                            )
                        }
                    </Col>
                </Row>
            </Container>

        </div >
    )
}

const mapStateToProps = (state) => ({
    isLoadingRedux: state.admin.isLoading,
    failedToAddProvider: state.admin.failedToAddProvider,
    isUpdatedCareProvider: state.admin.isUpdatedCareProvider,
})

const mapDispatchToProps = {
    ...AdminActions,
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateCareProvider)
