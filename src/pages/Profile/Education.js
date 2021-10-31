import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import { ProfileAction } from '../../redux/actions';
import { AvForm, AvField, AvGroup } from 'availity-reactstrap-validation';
import LaddaButton, { XL, SLIDE_UP } from 'react-ladda';
import { v4 as uuidv4 } from 'uuid';
import nodata from "../../images/icon/nodata.png"
import Nodata from "../../components/Nodata/Nodata"
import edit from "../../images/icon/edit-2.png"
import trash from "../../images/icon/trash.png"
import {
    Row, Col,
    FormGroup,
    Label,
    Modal,
    ModalHeader,
    ModalBody,
    Button,

} from "reactstrap";
class Education extends Component {
    constructor(props) {
        super(props)
        this.state = {
            degree: '',
            fromYear: '',
            toYear: '',
            educationid: '',
            userId: '',
            isUpdate: false,
            college: '',
            educationLoader: false
        }
        this.toggleEducationModal = this.toggleEducationModal.bind(this)
        this.onChangeText = this.onChangeText.bind(this)
        this.handleSubmitEducation = this.handleSubmitEducation.bind(this)
        this.onAdd = this.onAdd.bind(this)
        this.onEdit = this.onEdit.bind(this)
    }
 
    toggleEducationModal = () => {
        this.setState(prevState => ({
            educationModel: !prevState.educationModel
        }));
    }
    onChangeText(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    componentDidUpdate(prevProps, prevState) {

        //is education stored 
        const { isEducationStored, allEducations } = this.props;
        if (prevProps.isEducationStored !== isEducationStored) {
            if (isEducationStored === 1) {

                this.setState({
                    educationModel: false,
                    educationLoader: false,
                    allEducations
                }, () => {
                    this.props.getSpiffyStrength({
                        userId: this.props.userId
                    })
                    this.props.getProfileCompletionProgress({
                        userId: this.props.userId
                    })
                })

            }
        }

    }

    handleSubmitEducation(event, errors, values) {
       
        if (errors && errors.length > 0) {

        } else {
            this.setState({
                educationLoader: true
            })
            this.props.insertEducation({
                isUpdate: this.state.isUpdate,
                educationid: this.state.isUpdate && this.state.educationid !== '' ? this.state.educationid : uuidv4(),
                degreeTitle: this.state.degree,
                fromYear: parseInt(this.state.fromYear),
                toYear: parseInt(this.state.toYear),
                userId: this.props.userId,
                college: this.state.college
            })
        }
    }
    onDeleteEducation(educationId) {
        this.props.deleteEducation({
            educationId: educationId
        })
    }
    onAdd() {
        this.setState({
            isUpdate: false,
            educationModel: true,
            educationid:'',
            degree:'',
            fromYear:'',
            toYear:'',
            userId:'',
            college:'',
        })
    }
    onEdit(education) {
        this.setState({
            isUpdate: true,
            educationModel: true,
            educationid: education.educationid,
            degree: education.degreeTitle,
            fromYear: education.fromYear.toString(),
            toYear: education.toYear && education.toYear ? education.toYear.toString() : '',
            userId: this.props.userId,
            college: education.college
        })
    }
    render() {
        const { allEducations } = this.props;
        
        const { educationLoader, educationid, degree, fromYear, toYear, userId, college } = this.state
        return (
            <React.Fragment>
                <Col lg="12" className="clearfix">
                    <Link to="#" className="btn btn-outline-primary float-right" onClick={this.onAdd}> Add </Link>
                </Col>
                <Col lg="12" className="mt-4 pt-2 pt-sm-0">
                    <ul style={{ paddingLeft: 0 }}>
                        {
                            allEducations && allEducations.length > 0 ? (
                                allEducations.map((edu, index) =>
                                    <li key={index} style={{ boxShadow: '0 0 3px rgba(60, 72, 88, 0.15) !important', border: 'solid 0.5px #efefef', borderRadius: '10px !important' }} className={this.props.key === 0 ? " d-flex p-3 bg-white rounded" : "d-flex p-3 bg-white rounded mt-4"}>
                                        <div className="icons text-center rounded-pill mr-3 mt-2">
                                            {/* <img src={image} className="avatar avatar-ex-sm" alt="" /> */}
                                        </div>
                                        <div className="content" style={{ width: '100%' }}>
                                            <Row>
                                                <Col md="10" xs="8">
                                                    <p style={{fontSize:16, fontWeight:"bold"}} className="title mb-0">{edu.degreeTitle}</p>
                                                    <p className="font-title mb-0">{edu.college}</p>
                                                    <p className="font-title mb-0">{`${edu.fromYear}${edu.toYear && edu.toYear!=='' ? ' - ' + edu.toYear : '' }`}</p>
                                                </Col>
                                                <Col md="1" xs="2">
                                                    <img src={edit} onClick={() => this.onEdit(edu)} style={{ width: 20, height: 20, cursor: 'pointer' }} />
                                                </Col>
                                                <Col md="1" xs="2">
                                                    <img src={trash} onClick={() => this.onDeleteEducation(edu.educationid)} style={{ width: 20, height: 20, cursor: 'pointer' }} />
                                                </Col>
                                            </Row>
                                        </div>
                                    </li>
                                )

                            ) : <Nodata img={nodata} title={"No Data Found"} desc="Please add your education details here"></Nodata>
                        }
                    </ul>
                </Col>
                <Modal isOpen={this.state.educationModel} role="dialog" autoFocus={true} centered={true}>
                    <ModalHeader toggle={this.toggleEducationModal}>Add Education Details</ModalHeader>
                    <ModalBody>
                        <AvForm className="login-form" onSubmit={this.handleSubmitEducation}>
                            <Row>
                                <Col md={12}>
                                    <AvGroup className="form-group position-relative">
                                        <Label for="email">Course Title<span className="text-danger">*</span></Label>
                                        <AvField type="text" className="form-control" name="degree" value={degree} id="degree" onChange={this.onChangeText} placeholder="Eg:Bachelor Of Computer Application" required
                                            errorMessage=""
                                            validate={{
                                                required: { value: true, errorMessage: "Enter your course title" },
                                            }}
                                        />
                                    </AvGroup>
                                </Col>


                            </Row>
                            <Row>
                                <Col md={12}>
                                    <AvGroup className="form-group position-relative">
                                        <Label for="email">College/University Name <span className="text-danger">*</span></Label>
                                        <AvField type="text" className="form-control" name="college" value={college} id="college" onChange={this.onChangeText} placeholder="College Name" required
                                            errorMessage=""
                                            validate={{
                                                required: { value: true, errorMessage: "Enter your college name" },
                                            }}
                                        />
                                    </AvGroup>
                                </Col>


                            </Row>
                            <Row>
                                <Col md={6}>
                                    <AvGroup className="form-group position-relative">
                                        <Label for="email">From Year<span className="text-danger">*</span></Label>
                                        <AvField type="number" maxLength="4" className="form-control" value={fromYear} name="fromYear" onChange={this.onChangeText} id="fromYear" placeholder="Eg:2015" required
                                            errorMessage=""
                                            validate={{
                                                required: { value: true, errorMessage: "Start year required" },
                                            }}
                                        />
                                    </AvGroup>
                                </Col>
                                <Col md={6}>
                                    <AvGroup className="form-group position-relative">
                                        <Label for="email">End Year</Label>
                                        <AvField type="number" maxLength="4" className="form-control" value={toYear} name="toYear" onChange={this.onChangeText} id="toYear" placeholder="Eg:2020" />
                                    </AvGroup>
                                </Col>
                            </Row>
                            <LaddaButton
                                loading={educationLoader}
                                className="submitBnt btn btn-primary pull-right"
                                data-color="#eee"
                                data-size={XL}
                                data-style={SLIDE_UP}
                                data-spinner-size={30}
                                data-spinner-color="#ddd"
                                data-spinner-lines={12}
                            >
                                Save
                             </LaddaButton>
                            {' '}
                            <Button color="secondary" onClick={this.toggleEducationModal}>Cancel</Button>

                        </AvForm>

                    </ModalBody>

                </Modal>
            </React.Fragment>
        )
    }

}

const mapStateToProps = (state) => ({
    isEducationStored: state.profile.isEducationStored,
    allEducations: state.profile && state.profile.allEducations,
})


export default connect(mapStateToProps, { ...ProfileAction })(Education)
