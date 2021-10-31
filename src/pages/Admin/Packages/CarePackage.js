import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import packageOption from '../packagesOptions.json';
import ProviderPackageCard from '../../../components/Shared/AdminComponents/ProviderPackageCard';
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
    ModalBody,
    Button
} from "reactstrap";
import {
    BrowserRouter as Router,
    useParams
} from "react-router-dom";
import { useHistory } from "react-router";
import house from "../../../assets/images/icon/house.png";
import go from "../../../assets/images/go.png";
import back from "../../../images/icon/back.png";
import userIcon from "../../../assets/images/user.svg";
import add from "../../../images/icon/add-3.png";
import { useDispatch, useSelector } from "react-redux"
import { AdminActions, RequestActions } from '../../../redux/actions';
import moment from 'moment';
import UserTimeline from '../../../components/Shared/Timeline/CareUserTimeline';
import ProviderTimeline from '../../../components/Shared/Timeline/CareProviderTimeline';

const assetsBaseUrl = process.env.REACT_APP_ASSETS_BASE_URL


export const CarePackage = ({ ...props }) => {

    const history = useHistory();
    let { requestid } = useParams();
    const dispatch = useDispatch()
    const isLoading = useSelector(state => state.admin.isLoading)
    const careDetails = useSelector(state => state.admin.carePackageDetails)
    const isStatusUpdated = useSelector(state => state.admin.isStatusUpdated)
    const failedToUpdateStatus = useSelector(state => state.admin.failedToUpdateStatus)
    const titleUpdated = useSelector(state => state.admin.titleUpdated)
    const descUpdated = useSelector(state => state.admin.descUpdated)
    const careOrders = useSelector(state => state.request.careOrders)
    const careRequestDetails = useSelector(state => state.admin.careRequestDetails)
    const [modalMessage, setModalMessage] = useState('')
    const [isModalVisible, setModalVisible] = useState(false)
    const [submitClicked, setSubmitClicked] = useState(false)
    const [selectedCare, setSelectedCare] = useState(null)
    const [providerTimeline, setProviderTimeline] = useState(false)
    const [userTimeline, setUserTimeline] = useState(false)
    const [selectedCareProvider, setSelectedCP] = useState([])
    const [activeProviderTab, setActivePT] = useState(0)
    const [editTitle, setEditTitle] = useState([false, false, false, false, false, false])
    const [editDesc, setEditDesc] = useState([false, false, false, false, false, false])
    const [careDescription, setCareDesc] = useState()
    const [careTitle, setCareTitle] = useState()
    const [updateEdit, setUpdateEdit] = useState(false)
    const [updateModal, setUpdateModal] = useState(false)
    console.log('CARE DETAILS', careDetails);

    const onNavigateNewPackage = () => {
        history.push(`/admin/new-care/${requestid}`);
    }
    const navigateCareProviders = (careId) => {
        history.push(`/admin/package-provider/${careId}/${requestid}`);
    }
    useEffect(() => {
        dispatch(AdminActions.getAllCareDetailsByRequestId({
            requestId: requestid
        }))
        dispatch(AdminActions.getRequestDetailsByRequestId({
            requestId: requestid
        }))

    }, [])

    useEffect(() => {
        if (careDetails && careDetails.length > 0) {
            let selectedCareDetails = careDetails.filter(x => x.status === 'Confirmed')
            console.log('SELECTED CARE', selectedCareDetails[0]);
            setSelectedCare(selectedCareDetails)
            setSelectedCP(selectedCareDetails && selectedCareDetails.length > 0 && selectedCareDetails[0].tblCareProvidersByCareId && selectedCareDetails[0].tblCareProvidersByCareId.nodes[0])

            if (selectedCareDetails && selectedCareDetails.length > 0) {
                var params = {
                    'careId': selectedCareDetails[0].careId
                }
                dispatch(RequestActions.getAllCareOrders(params))
            }
        }
    }, [careDetails])

    useEffect(() => {
        if (isStatusUpdated && submitClicked) {
            setModalVisible(isStatusUpdated)
            dispatch(AdminActions.getAllCareDetailsByRequestId({
                requestId: requestid
            }))
        }
        if (failedToUpdateStatus && submitClicked) {
            setModalVisible(failedToUpdateStatus)
        }

    }, [isStatusUpdated, failedToUpdateStatus])

    useEffect(() => {
        if (updateEdit){
            setUpdateModal(true)
            if (titleUpdated) {
                dispatch(AdminActions.getAllCareDetailsByRequestId({
                    requestId: requestid
                }))
            }
            if (descUpdated) {
                dispatch(AdminActions.getAllCareDetailsByRequestId({
                    requestId: requestid
                }))
            }
        }
    }, [titleUpdated, descUpdated])

    const handleTitleChange = (event) => {
        event.persist();
        setCareTitle(event.target.value)
    }

    const toggleTitleEdit = (index) => {
        setEditTitle(prevState => prevState.map((item, idx) => idx === index ? true : false))
    }

    const handleDescChange = (event) => {
        event.persist();
        setCareDesc(event.target.value)
    }

    const toggleDescEdit = (index) => {
        setEditDesc(prevState => prevState.map((item, idx) => idx === index ? true : false))
    }

    const onClickSubmit = (careId) => {
        dispatch(AdminActions.updateCarePackageStatus({
            careid: careId,
            status: 'done'
        }))

        setModalMessage('Submitting care package details')
        setSubmitClicked(false)
    }

    const handleSubmit = (index, careId) => {
        if(editTitle[index]){
            dispatch(AdminActions.updateCareTitle({
                careId: careId,
                careTitle: {
                    careTitle: careTitle
                }
            }))
            setEditTitle([false, false, false, false, false, false])
            setUpdateEdit(true)
        }

        if(editDesc[index]){
            dispatch(AdminActions.updateCareDesc({
                careId: careId,
                careDesc: {
                    careDescription: careDescription
                }
            }))
            setEditDesc([false, false, false, false, false, false])
            setUpdateEdit(true)
        }
    }

    const onClickButton = (button) => {
        dispatch(AdminActions.setButtonClicked(button))
    }

    const toggleProvider = (tab, careData) => {
        if (activeProviderTab !== tab) {
            setActivePT(tab)
            setSelectedCP(careData)
        }
    }

    return (
        <section style={{ paddingTop: 120 }} className="whitegrad-bg">
            <Container>
                {
                    !providerTimeline && !userTimeline ?
                        <Row>
                            {

                                !isLoading && careDetails ?
                                    careDetails.map((careData, index) =>
                                        <Col md="4">
                                            <div className="category-card admin-package-card">
                                                <img className='button-ani pointer' style={{ width: 55 }} src={house} onClick={() => handleSubmit(index, careData.careId)}/>
                                                {
                                                    editTitle[index] ?
                                                    <textarea style={{textAlign: 'center', marginTop: 20, marginBottom: 20}} maxLength="50" className="form-control" rows="1" name="careTitle" type="text" onChange={handleTitleChange} value={careTitle}></textarea>
                                                    :
                                                    <p className="bold font20" onClick={() => { toggleTitleEdit(index); setCareTitle(careData.careTitle); setEditDesc([false, false, false, false, false, false])}} className="bold">{careData.careTitle} </p>
                                                }
                                                
                                                <div style={{ height: '13%' }} className="">
                                                    {
                                                        editDesc[index] ?
                                                            <textarea maxLength="130" className="form-control" rows="3" name="careDescription" type="text" onChange={handleDescChange} value={careDescription}></textarea>
                                                            :
                                                            <p onClick={() => { toggleDescEdit(index); setCareDesc(careData.careDescription); setEditTitle([false, false, false, false, false, false])}} className="font-title font14">{careData.careDescription}</p>
                                                    }
                                                </div>
                                                <hr />
                                                <div style={{ height: 80 }}>
                                                    {careData.tblCareProvidersByCareId && careData.tblCareProvidersByCareId.nodes && careData.tblCareProvidersByCareId.nodes.map((serviceItem) =>
                                                        <div className="package-list-wrapper" style={{ paddingTop: 5 }}>
                                                            <Col style={{ height: 40 }}>
                                                                <p className="bold font14" style={{ marginRight: '0.4rem', textAlign: 'left' }}>{serviceItem.tblUserByProviderId.fullname}: </p>
                                                            </Col>
                                                            <Col style={{ height: 40 }} className="text-overflow-fade"> <p className="font-title font14" style={{ textAlign: 'left' }}>{serviceItem.supportDescription}</p></Col>
                                                        </div>
                                                    )}
                                                </div>
                                                <hr />
                                                <div style={{ marginTop: 0, marginBottom: 10 }} className="package-description-wrapper">
                                                    <Row>
                                                        <Col>
                                                            <p style={{ fontSize: 16, fontWeight: 'bold' }}>Status:</p>
                                                        </Col>
                                                        <Col>
                                                            <p className="font-title" style={{ color: careData.status === 'draft' ? 'orange' : careData.status === 'done' ? 'purple' : 'green', fontSize: 16, fontWeight: 'bold' }}>{careData.status === 'draft' ? 'Draft' : careData.status === 'done' ? 'Submitted' : 'Confirmed'}</p>
                                                        </Col>
                                                    </Row>
                                                </div>

                                                <Row>
                                                    {
                                                        careData.status !== 'Confirmed' &&
                                                        <Col xs='6'>
                                                            <Button className="hover-grow-0 pointer btn btn-secondary full-width" onClick={() => { onClickButton('Pricing'); navigateCareProviders(careData.careId) }}>Pricing</Button>
                                                        </Col>}
                                                    {
                                                        careData.noOfMtp !== null && careData.status !== 'Confirmed' &&
                                                        <Col xs='6'>
                                                            <Button className="btn btn-secondary hover-grow-0 pointer full-width" onClick={() => { onClickButton('Providers'); navigateCareProviders(careData.careId) }}>Providers</Button>
                                                        </Col>
                                                    }
                                                </Row>
                                                {
                                                    careData.tblCareProvidersByCareId && careData.tblCareProvidersByCareId.nodes.length === careData.noOfMtp && careData.status !== 'Confirmed' ?
                                                        <Row>
                                                            <Col xs='12'>
                                                                <Button className="accept hover-grow-0 pointer full-width" style={{ marginTop: 10 }} onClick={() => { onClickSubmit(careData.careId); setSubmitClicked(true) }}>Submit</Button>
                                                            </Col>
                                                        </Row>
                                                        :
                                                        careData.status === 'Confirmed' &&
                                                        <Row>
                                                            <Col xs='12'>
                                                                <Button className="accept hover-grow-0 pointer full-width" onClick={() => setUserTimeline(true)} style={{ marginTop: 10 }}>User Timeline</Button>
                                                            </Col>
                                                            <Col xs='12'>
                                                                <Button className="accept hover-grow-0 pointer full-width" onClick={() => setProviderTimeline(true)} style={{ marginTop: 10 }}>Provider Timeline</Button>
                                                            </Col>
                                                        </Row>
                                                }

                                            </div>
                                            {
                                                <Modal isOpen={false} role="dialog" autoFocus={true} centered={true}>
                                                    <ModalBody>
                                                        <div style={{ textAlign: 'center' }}>
                                                            <p className="bold font16">Are you sure you want to submit?</p>
                                                            <Button style={{ marginRight: 10 }} className="btn btn-primary" onClick={() => { onClickSubmit(careData.careId); setModalVisible(false) }}>Yes</Button>
                                                            <Button style={{ marginLeft: 10 }} onClick={() => { setModalVisible(false); setSubmitClicked(false) }}>No</Button>
                                                        </div>
                                                    </ModalBody>
                                                </Modal>
                                            }
                                            {
                                                <Modal isOpen={isModalVisible && isStatusUpdated} role="dialog" autoFocus={true} centered={true}>
                                                    <ModalBody>
                                                        <div style={{ textAlign: 'center' }}>
                                                            <p className="font16 bold">Care package submitted successfully!</p>
                                                            <Button onClick={() => { setModalMessage(''); setModalVisible(false) }}>Ok</Button>
                                                        </div>
                                                    </ModalBody>
                                                </Modal>
                                            }
                                            {
                                                <Modal isOpen={isModalVisible && failedToUpdateStatus} role="dialog" autoFocus={true} centered={true}>
                                                    <ModalBody>
                                                        <div style={{ textAlign: 'center' }}>
                                                            <p className="font16">Failed to submit the care package, please try again.</p>
                                                            <Button onClick={() => { setModalMessage(''); setModalVisible(false) }}>Okay</Button>
                                                        </div>
                                                    </ModalBody>
                                                </Modal>
                                            }
                                            {
                                                <Modal isOpen={updateModal && titleUpdated} role="dialog" autoFocus={true} centered={true}>
                                                    <ModalBody>
                                                        <div style={{ textAlign: 'center' }}>
                                                            <h4>Title updated successfully!</h4>
                                                            <Button onClick={() => { setUpdateModal(false); setUpdateEdit(false); dispatch(AdminActions.resetCareUpdate()) }}>Ok</Button>
                                                        </div>
                                                    </ModalBody>
                                                </Modal>
                                            }
                                            {
                                                <Modal isOpen={updateModal && !titleUpdated && titleUpdated !== null} role="dialog" autoFocus={true} centered={true}>
                                                    <ModalBody>
                                                        <div style={{ textAlign: 'center' }}>
                                                            <h4>Title update failed, please try again.</h4>
                                                            <Button onClick={() => { setUpdateModal(false); setUpdateEdit(false); dispatch(AdminActions.resetCareUpdate()) }}>Ok</Button>
                                                        </div>
                                                    </ModalBody>
                                                </Modal>
                                            }
                                            {
                                                <Modal isOpen={updateModal && descUpdated} role="dialog" autoFocus={true} centered={true}>
                                                    <ModalBody>
                                                        <div style={{ textAlign: 'center' }}>
                                                            <h4>Description updated successfully!</h4>
                                                            <Button onClick={() => { setUpdateModal(false); setUpdateEdit(false); dispatch(AdminActions.resetCareUpdate()) }}>Okay</Button>
                                                        </div>
                                                    </ModalBody>
                                                </Modal>
                                            }
                                            {
                                                <Modal isOpen={updateModal && !descUpdated && descUpdated !== null} role="dialog" autoFocus={true} centered={true}>
                                                    <ModalBody>
                                                        <div style={{ textAlign: 'center' }}>
                                                            <h4>Failed to update description, please try again.</h4>
                                                            <Button onClick={() => { setUpdateModal(false); setUpdateEdit(false); dispatch(AdminActions.resetCareUpdate()) }}>Okay</Button>
                                                        </div>
                                                    </ModalBody>
                                                </Modal>
                                            }
                                            {
                                                <Modal isOpen={isLoading} role="dialog" autoFocus={true} centered={true}>
                                                    <ModalBody>
                                                        <div style={{ textAlign: 'center' }}>
                                                            <p className="font16">{modalMessage}</p>
                                                        </div>
                                                    </ModalBody>
                                                </Modal>
                                            }
                                        </Col>
                                    )

                                    : (<>{
                                        <Modal isOpen={isLoading} role="dialog" autoFocus={true} centered={true}>
                                            <ModalBody>
                                                <div style={{ textAlign: 'center' }}>
                                                    <p className="bold font20">Loading...</p>
                                                </div>
                                            </ModalBody>
                                        </Modal>
                                    }</>)
                            }
                            <Col xs='12' md='4'>
                                <div style={{ height: 450, paddingTop: 180 }} className="add-prov card-shadow" onClick={onNavigateNewPackage}>
                                    <p style={{ textAlign: 'center', color: '#5e2490', fontSize:19 }}><b>Add Care Package</b></p>
                                    <img className="pointer hover-grow-0" src={add} />
                                </div>
                            </Col>
                        </Row>
                        :
                        userTimeline ?
                            <Row>
                                <div className="provider-top-bar">
                                    <Container>
                                        <Row>
                                            <Col onClick={() => setUserTimeline(false)} xs="2" md='1' className="relative">
                                                <Row>
                                                    <img src={back} />
                                                    <span>Back</span>
                                                </Row>
                                            </Col>
                                            <Col xs='1' md='1'></Col>
                                            <Col xs="9" md='10'>
                                                <h6 style={{ fontSize: 18 }} className="bold">{`${careRequestDetails && careRequestDetails.title} - ${selectedCare[0] && selectedCare[0].careTitle}`}</h6>
                                            </Col>
                                        </Row>
                                    </Container>
                                </div>
                                <Col xs="12" style={{ marginLeft: 10, marginTop: 40 }}>
                                    {
                                        <Row>
                                            <div className="" >
                                                {selectedCare[0] && selectedCare[0].tblCareProvidersByCareId && selectedCare[0].tblCareProvidersByCareId.nodes.map((data, index) =>
                                                    careRequestDetails && careRequestDetails !== null && data !== null && (
                                                        <div className={`request-details-profile provider-box-wrapper ${index === activeProviderTab ? 'active-box' : ''}`} onClick={() => { toggleProvider(index, data); }}>
                                                            <Row>
                                                                <Col xs="12" md="12" className="box-wrapper">
                                                                    <p className="font16 bold">{data.tblUserByProviderId.fullname}</p>
                                                                    <p style={{ marginTop: -8 }} className="text font14">{data.supportDescription}</p>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    )
                                                )}

                                            </div>
                                            <Col >
                                                {selectedCare[0] && selectedCareProvider && careRequestDetails && careOrders && careOrders.length > 0 && selectedCare[0].careId && selectedCare[0].tblCareProvidersByCareId && selectedCare[0].tblCareProvidersByCareId.nodes.length > 0 &&
                                                    <UserTimeline myRequestDetails={careRequestDetails} orderDetails={careOrders.filter(x => x.careProviderId === selectedCareProvider.careProviderId)} serviceDetails={selectedCareProvider} {...props} chatId={selectedCare[0].careId} />
                                                }
                                            </Col>
                                        </Row>
                                    }

                                </Col>
                            </Row>
                            :
                            providerTimeline ?
                                <Row>
                                    <div className="provider-top-bar">
                                        <Container>
                                            <Row>
                                                <Col onClick={() => setProviderTimeline(false)} xs="2" md='1' className="relative">
                                                    <Row>
                                                        <img src={back} />
                                                        <span>Back</span>
                                                    </Row>
                                                </Col>
                                                <Col xs='1' md='1'></Col>
                                                <Col xs="9" md='10'>
                                                    <p style={{ fontSize: 18 }} className="bold">{`${careRequestDetails && careRequestDetails.title} - ${selectedCare[0] && selectedCare[0].careTitle}`}</p>
                                                </Col>
                                            </Row>
                                        </Container>
                                    </div>
                                    <Col xs="12" style={{ marginLeft: 10, marginTop: 40, marginBottom: 20 }}>
                                        {
                                            <Row>
                                                <div className="" >
                                                    {selectedCare[0] && selectedCare[0].tblCareProvidersByCareId && selectedCare[0].tblCareProvidersByCareId.nodes.map((data, index) =>
                                                        careRequestDetails && careRequestDetails !== null && data !== null && (
                                                            <div className={`request-details-profile provider-box-wrapper ${index === activeProviderTab ? 'active-box' : ''}`} onClick={() => { toggleProvider(index, data); }}>
                                                                <Row>
                                                                    <Col xs="12" md="12" className="box-wrapper">
                                                                        <p className="bold font16">{data.tblUserByProviderId.fullname}</p>
                                                                        <p style={{ marginTop: -8 }} className="text font14">{data.supportDescription}</p>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        )
                                                    )}

                                                </div>
                                                <Col >
                                                    {selectedCare[0] && selectedCareProvider && careRequestDetails && careOrders && careOrders.length > 0 && selectedCare[0].careId && selectedCare[0].tblCareProvidersByCareId && selectedCare[0].tblCareProvidersByCareId.nodes.length > 0 &&
                                                        <ProviderTimeline chatId={selectedCare[0].careId} orderId={careOrders.filter(x => x.careProviderId === selectedCareProvider.careProviderId)[0].careOrderId} orderDetails={careOrders.filter(x => x.careProviderId === selectedCareProvider.careProviderId)} myRequestDetails={careRequestDetails} serviceDetails={selectedCareProvider}  {...props} />
                                                    }
                                                </Col>
                                            </Row>
                                        }

                                    </Col>
                                </Row>
                                :
                                <></>
                }
            </Container>
        </section >

    )
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CarePackage)
