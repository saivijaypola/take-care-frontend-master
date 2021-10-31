import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import { ProfileAction } from '../../redux/actions';
import { AvForm, AvField, AvGroup } from 'availity-reactstrap-validation';
import LaddaButton, { XL, SLIDE_UP } from 'react-ladda';
import nodata from "../../images/icon/nodata.png"
import edit from "../../images/icon/edit-2.png"
import trash from "../../images/icon/trash.png"

import Nodata from "../../components/Nodata/Nodata"
import {
    Row, Col,
    FormGroup,
    Label,
    Modal,
    ModalHeader,
    ModalBody,
    Button,

} from "reactstrap";

class Experience extends Component {
    constructor(props) {
        super(props)
        this.state = {
            allEmployments: [],
            employmentLoader: false,
            userId: '',
            job: '',
            company: '',
            fromYear: '',
            toYear: '',
            comments: '',
            selectedEmpId: '',
            isUpdate: false

        }
        this.toggleEmpModal = this.toggleEmpModal.bind(this)
        this.onChangeText = this.onChangeText.bind(this)
        this.handleSubmitEmployee = this.handleSubmitEmployee.bind(this)
        this.onEditEmployment = this.onEditEmployment.bind(this)
        this.onAdd = this.onAdd.bind(this)
    }
    onAdd() {
        this.setState({
            empModel: true,
            isUpdate: false,
            job: '',
            company: '',
            fromYear: '',
            toYear: '',
            comments: '',
            selectedEmpId: ''
        })
    }
    toggleEmpModal = () => {
        this.setState(prevState => ({
            empModel: !prevState.empModel
        }));
    }
    onChangeText(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    handleSubmitEmployee(event, errors, values) {
        if (errors && errors.length > 0) {

        } else {
            this.setState({
                employmentLoader: true,
                isUpdate: this.state.isUpdate
            })
            this.props.insertEmployment({
                empId: this.state.selectedEmpId !== '' && this.state.isUpdate ? this.state.selectedEmpId : '',
                isUpdate: this.state.isUpdate,
                userId: this.props.userId,
                job: this.state.job,
                company: this.state.company,
                fromYear: parseInt(this.state.fromYear),
                toYear: parseInt(this.state.toYear),
                comments: this.state.comments
            })
        }
    }
    componentDidMount() {
        if (this.props && this.props.employment) {
            const { employment } = this.props
            this.setState({
                allEmployments: employment
            })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        //is employment stored 
        const { isEmploymentStored, allEmployments, isEmploymentDeleted } = this.props;
        if (prevProps.isEmploymentStored !== isEmploymentStored || isEmploymentDeleted) {

            if (isEmploymentStored === 1 || isEmploymentDeleted) {
                this.setState({
                    empModel: false,
                    employmentLoader: false,
                    allEmployments
                })
                this.props.getSpiffyStrength({
                    userId: this.props.userId
                })
                this.props.getProfileCompletionProgress({
                    userId: this.props.userId
                })
            }
        }
    }
    removeExperience(expId) {
        this.props.deleteEmployment({
            "empId": expId
        })
    }
    onEditEmployment(item) {
        this.setState({
            userId: this.props.userId,
            job: item.jobTitle,
            company: item.companyName,
            fromYear: item.fromYear.toString(),
            toYear: item.toYear && item.toYear ? item.toYear.toString() : '',
            comments: item.description,
            selectedEmpId: item.employmentId,
            empModel: true,
            isUpdate: true
        })
    }
    renderExperienceItem = (emp, index) => <li key={index} style={{ boxShadow: '0 0 3px rgba(60, 72, 88, 0.15) !important', border: 'solid 0.5px #efefef', borderRadius: '10px !important' }} className={this.props.key === 0 ? "d-flex p-3 bg-white rounded " : "d-flex p-3 bg-white rounded  mt-4"} >

        <div className="content" style={{ width: '100%' }}>
            <Row>
                <Col md="10" xs="8">
                    <p className="title mb-0 font16">{emp.jobTitle}</p>
                    <p className="font-title mb-0"><Link to="#" className="text-primary">{emp.companyName}</Link> @{emp.description}</p>
                    <p className="font-title mb-0">{`${emp.fromYear}${emp.toYear && emp.toYear !== '' ? ' - ' + emp.toYear : ''}`}</p>
                </Col>
                <Col md="1" xs="2">
                    <img alt={"img_exp"} src={edit} onClick={() => this.onEditEmployment(emp)} style={{ width: 20, height: 20, cursor: 'pointer' }} />
                </Col>
                <Col md="1" xs="2">
                    <img alt={"img_exp"} src={trash} onClick={() => this.removeExperience(emp.employmentId)} style={{ width: 20, height: 20, cursor: 'pointer' }} />
                </Col>
            </Row>
        </div>
    </li>
    render() {
        const { employmentLoader, job, company, fromYear, toYear, comments } = this.state;
        const { allEmployments } = this.props

        return (
            <Fragment>
                <Col lg="12" className="clearfix">
                    <Link to="#" className="btn btn-outline-primary float-right" onClick={this.onAdd}> Add </Link>
                </Col>
                <Col lg="12" className="mt-4 pt-2 pt-sm-0">
                    <ul style={{ paddingLeft: 0 }}>
                        {
                            allEmployments && allEmployments.length > 0 ? (
                                allEmployments.map((emp, index) =>
                                    this.renderExperienceItem(emp, index)
                                )
                            ) : <Nodata img={nodata} title={"No Data Found"} desc="Please add your employment details here"></Nodata>
                        }
                    </ul>
                </Col>

                <Modal isOpen={this.state.empModel} role="dialog" autoFocus={true} centered={true}>
                    <ModalHeader toggle={this.toggleEmpModal}>Add Occupation Details</ModalHeader>
                    <ModalBody>
                        <AvForm className="login-form" onSubmit={this.handleSubmitEmployee}>
                            <Row>
                                <Col md={12}>
                                    <AvGroup className="form-group position-relative">
                                        <Label for="email">Job Title<span className="text-danger">*</span></Label>
                                        <AvField type="text" className="form-control" name="job" id="job" value={job} onChange={this.onChangeText} placeholder="Eg:Project Lead" required
                                            errorMessage=""
                                            validate={{
                                                required: { value: true, errorMessage: "Enter your job title" },
                                            }}
                                        />
                                    </AvGroup>
                                </Col>
                                <Col md={12}>
                                    <AvGroup className="form-group position-relative">
                                        <Label for="email">Company Name<span className="text-danger">*</span></Label>
                                        <AvField type="text" className="form-control" name="company" value={company} id="company" onChange={this.onChangeText} placeholder="Company Name" required
                                            errorMessage=""
                                            validate={{
                                                required: { value: true, errorMessage: "Enter your company name" },
                                            }}
                                        />
                                    </AvGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <AvGroup className="form-group position-relative">
                                        <Label for="email">From Year<span className="text-danger">*</span></Label>
                                        <AvField type="number" maxLength="4" className="form-control" value={fromYear} name="fromYear" id="fromYear" onChange={this.onChangeText} placeholder="Eg:2015" required
                                            errorMessage=""
                                            validate={{
                                                required: { value: true, errorMessage: "From year required" },
                                                minLength: { value: 4, errorMessage: 'Please Enter a valid year' },
                                                maxLength: { value: 4, errorMessage: 'Please Enter a valid year' },
                                                pattern: { value: '^[0-9]*$', errorMessage: 'Please Enter a valid year' }
                                            }}
                                        />
                                    </AvGroup>
                                </Col>
                                <Col md={6}>
                                    <AvGroup className="form-group position-relative">
                                        <Label for="email">To Year</Label>
                                        <AvField type="number" maxLength="4" className="form-control" value={toYear} name="toYear" id="toYear" onChange={this.onChangeText} placeholder="Eg:2020"
                                            validate={{
                                                minLength: { value: 4, errorMessage: 'Please Enter a valid year' },
                                                maxLength: { value: 4, errorMessage: 'Please Enter a valid year' },
                                                pattern: { value: '^[0-9]*$', errorMessage: 'Please Enter a valid year' }
                                            }}
                                        />
                                    </AvGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <FormGroup className="position-relative">
                                        <Label>Comments</Label>
                                        <i className="mdi mdi-comment-text-outline ml-3 icons"></i>
                                        <textarea name="comments" id="comments" value={comments} rows="4" className="form-control pl-5" onChange={this.onChangeText} placeholder="Your responsibility and contribution"></textarea>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>

                                </Col>
                            </Row>
                            <LaddaButton
                                loading={employmentLoader}
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
                            <Button color="secondary" onClick={this.toggleEmpModal}>Cancel</Button>
                        </AvForm>
                    </ModalBody>
                </Modal>
            </Fragment>
        )
    }
}
function mapStateToProps(state) {
    return {
        isEmploymentStored: state.profile && state.profile.isEmploymentStored,
        allEmployments: state.profile.allEmployments
    }
}

export default connect(mapStateToProps, { ...ProfileAction })(Experience)
