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
    Button, ModalBody
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

import {
    BrowserRouter as Router,
    useParams
} from "react-router-dom";
import { AdminActions } from '../../../redux/actions';
import { useDispatch, useSelector } from "react-redux"

export const AddNewCare = ({ props }) => {
    const [value, setValue] = React.useState('name');
    const [currentTab, setCurrentTab] = useState('care-option-name')
    const [tabName, setTabName] = useState(currentTab === 'select-provider' ? 'Select Provider' : currentTab === 'common-info' ? 'Common Information' : '')
    const [inputs, setInputs] = useState({});
    const [selectedProvider, setSelectedProvider] = useState()
    const [totalProviderAmount, setTotalProviderAmount] = useState(0)
    const [modalMessage, setModalMessage] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [onSuccess, setOnSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const history = useHistory();
    let { requestid } = useParams();

    const dispatch = useDispatch()
    const isLoadingRedux = useSelector(state => state.admin.isLoading)
    const failedToAddPackage = useSelector(state => state.admin.failedToAddPackage);
    const careRequestDetails = useSelector(state => state.admin.careRequestDetails)

    useEffect(() => {
        window.scrollTo(0, 0)
        console.log('USER ID', careRequestDetails.userId);
    }, [])

    const handleInputChange = (event) => {
        event.persist();
        setInputs(inputs => ({ ...inputs, [event.target.name]: event.target.value }));
    }

    const prevStep = () => {
        window.scrollTo(0, 0)
        if (currentTab === 'care-option-name') {
            history.push(`/admin/care-package/${requestid}`)
        }
    }
    const renderScreen = () => {

        if (currentTab === 'care-option-name') {
            return (
                <div>
                    <div>
                        <p className="bold font16">Enter Option Name</p>
                        <br />
                        <p style={{ float: 'left', fontWeight: 'bold', fontSize:15}}>YoCo Care -</p>
                        <input value={inputs.careOptionName} className="form-control" placeholder="Maximum 50 Characters" onChange={handleInputChange} name="careOptionName" type="text" maxLength="50" >
                        </input>
                        <br />
                    </div>
                    <div>
                        <p className="bold font16">Description</p>
                        <textarea value={inputs.careDescription} className="form-control" rows="4" placeholder="Maximum 100 Characters" onChange={handleInputChange} name="careDescription" type="text" maxLength='130'>

                        </textarea>
                    </div>
                </div>
            )
        }

    }

    const onClickSubmit = () => {
        if (!inputs.careOptionName) {
            setIsModalVisible(true);
            setModalMessage('Please enter care option name')
        } else if (!inputs.careDescription) {
            setIsModalVisible(true);
            setModalMessage('Please enter care description')
        } else {
            var params = {
                "requestId": requestid,
                "careTitle": inputs.careOptionName,
                "careDescription": inputs.careDescription,
                "userId": careRequestDetails.userId
            }
            dispatch(AdminActions.addNewCarePackage(params))
            setIsLoading(true)
            setModalMessage('Adding new care option...')
            setIsModalVisible(true)
        }
    }

    const onClickCancel = () => {
        history.push(`/admin/care-package/${requestid}`)
    }

    return (
        <div className='whitegrad-bg'>
            <Container>
                <Row>
                    <Col md="8" lg="8">
                        <Row>
                            <p className="tab-title font14">{tabName}</p>
                        </Row>
                        <div className="delight-bottom card-shadow" style={{ marginBottom: 50, marginTop: 150 }}>
                            <div className="build-box build-box-admin">
                                {renderScreen()}

                                <br /><br />
                                {
                                    currentTab === 'care-option-name' &&
                                    <>
                                        <Button style={{ marginRight: 20 }} className="btn btn-primary" onClick={onClickSubmit} >Create</Button>
                                        <Button className="btn btn-secondary" onClick={onClickCancel}>Cancel</Button>
                                    </>
                                }
                            </div>

                        </div>
                        <Modal isOpen={isModalVisible} role="dialog" autoFocus={true} centered={true}>
                            <ModalBody>
                                <div style={{ textAlign: 'center' }}>
                                    <p>{modalMessage}</p>
                                    <Button onClick={() => { setIsModalVisible(false); setModalMessage('') }}>Ok</Button>
                                </div>
                            </ModalBody>
                        </Modal>
                        <Modal isOpen={isLoading && !isLoadingRedux && failedToAddPackage === false && failedToAddPackage !== null} role="dialog" autoFocus={true} centered={true}>
                            <ModalBody>
                                <div style={{ textAlign: 'center' }}>
                                    <p>New care option added successfully!</p>
                                    <Button onClick={() => { history.push(`/admin/care-package/${requestid}`); setIsLoading(false) }}>Ok</Button>
                                </div>
                            </ModalBody>
                        </Modal>
                        <Modal isOpen={!isLoadingRedux && failedToAddPackage && isModalVisible} role="dialog" autoFocus={true} centered={true}>
                            <ModalBody>
                                <div style={{ textAlign: 'center' }}>
                                    <p>Failed to add new care option, please try again.</p>
                                    <Button onClick={() => { setIsModalVisible(false); history.push(`/admin/care-package/${requestid}`) }}>Ok</Button>
                                </div>
                            </ModalBody>
                        </Modal>
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
                                <div className="admin-card card-shadow" style={{ marginBottom: 50, marginTop: 150 }}>
                                    <div className="build-box build-box-admin">
                                        <p><b>Title: </b>{careRequestDetails.title}</p>
                                        <p><b>Description: </b>{careRequestDetails.description}</p>
                                        <p><b>Service Needed On: </b>{new Date(careRequestDetails.serviceNeedsOn).toDateString()}</p>
                                        {/* <p><b>Health Care: </b>{careRequestDetails.isHealthcare === true ? 'Yes' : 'No'}</p> */}
                                        <p><b>Location: </b>{careRequestDetails.locationTitle}</p>
                                    </div>
                                </div>
                            )
                        }
                    </Col>
                </Row>
            </Container>

        </div>
    )
}

const mapStateToProps = (state) => ({
    isLoadingRedux: state.admin.isLoading,
    failedToAddPackage: state.admin.failedToAddPackage,
    newPackageDetails: state.admin.newPackageDetails,
})

const mapDispatchToProps = {
    ...AdminActions,
}

export default connect(mapStateToProps, mapDispatchToProps)(AddNewCare)
