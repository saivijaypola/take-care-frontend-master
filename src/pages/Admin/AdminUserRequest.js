import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import {
    Container, Row, Col, Button, Modal, Spinner, ModalBody
} from "reactstrap";
import _ from "lodash";
import FloatingInput from '../../components/Shared/GeoSuggest/FloatingInput';
import { AdminActions, RequestActions } from '../../redux/actions';
import { useDispatch, useSelector } from "react-redux"
import { RequestBoard } from '../../components/Shared/AdminComponents/RequestBoard';
import assets from '../../assets/images';

import { RequestContentWrapper, SearchWrapper } from './AdminStyled'

export const AdminUserRequest = ({ requests, ...props }) => {
    const [selectedLocation, setSelectedLocation] = useState()
    const allUserRequest = useSelector(state => state.request.requests)
    const isRequestLoading = useSelector(state => state.request.isRequestLoading)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(RequestActions.getAllAdminUserRequest())
    }, [])

    useEffect(() => {


    }, [allUserRequest])
    const onSelectLocation = (selectedLocation) => {
        setSelectedLocation(selectedLocation)
        dispatch(RequestActions.getRequests({
            "latitude": selectedLocation.latitude,
            "longitude": selectedLocation.longitude,
            "radius": process.env.REACT_APP_PROVIDER_RADIUS ? parseFloat(process.env.REACT_APP_PROVIDER_RADIUS) : 40000
        }))

    }
    const OnClickViewAllRequest = () => {
        dispatch(RequestActions.getAllAdminUserRequest())
    }

    const { userLocation } = props;
    return (
        <React.Fragment>
            <section className="section mt-60 whitegrad-bg">
                <Container className="mt-lg-3 relative">
                    <Row>
                        <Col lg="12" className="relative">

                            <SearchWrapper>
                                <Col md="3">
                                    <p className="bold mobile-hide font14">Choose your location</p>
                                </Col>
                                <Col md="4" xs="8" style={{ paddingLeft: 12 }}>
                                    <FloatingInput onSelectLocation={onSelectLocation} value={selectedLocation} label={"Enter your location"} initialLocation={userLocation && userLocation ? userLocation : ''}  {...props} />
                                </Col>
                                <Col md="1" xs="4">
                                    <p className="bold font14">OR</p>
                                </Col>
                                <Col md="2" className="">
                                    <Button onClick={() => OnClickViewAllRequest()} className="set-default">View All Request</Button>
                                </Col>


                            </SearchWrapper>
                            <RequestContentWrapper>
                                {/* <div className="requests-container"> */}
                                {
                                    isRequestLoading && (
                                        <Modal className="spinner-modal" isOpen={true}>
                                            <Spinner style={{ margin: "10px auto" }} animation="border" />
                                        </Modal>
                                    )
                                }
                                {!isRequestLoading && !_.isEmpty(allUserRequest) ?
                                    allUserRequest.map((request, index) =>
                                        <Col lg="4" key={index} >
                                            <RequestBoard key={request} request={request} {...props} />
                                        </Col>
                                    )
                                    :
                                    <Col lg="12" style={{ textAlign: 'center', padding: 30 }}>
                                        <img src={assets.images.location} style={{ width: 70, height: 70 }} />
                                        <p style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 0, marginBottom: 0 }}>No requests found on this location </p>

                                    </Col>

                                }
                                {/* </div> */}
                            </RequestContentWrapper>
                        </Col>
                    </Row>
                </Container>

            </section>
        </React.Fragment>
    )
}

const mapStateToProps = (state) => ({
    userLocation: state.profile.userLocation,
    requests: state.request.requests,
    isRequestLoading: state.request.isRequestLoading,
})

const mapDispatchToProps = {
    ...RequestActions
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminUserRequest)
