import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import Profile from '.';
import { ProfileAction } from '../../../redux/actions';
import { AvForm, AvField, AvGroup } from 'availity-reactstrap-validation';
import LaddaButton, { XL, SLIDE_UP } from 'react-ladda';
import nodata from "../../../images/icon/nodata.png"
import Nodata from "../../../components/Nodata/Nodata"
import edit from "../../../images/icon/edit-2.png"
import { v4 as uuidv4 } from 'uuid';
import trash from "../../../images/icon/trash.png"
import {
    Row, Col,
    FormGroup,
    Label,
    Modal,
    ModalHeader,
    ModalBody,
    Button,

} from "reactstrap";
export class Training extends Component {

    constructor(props) {
        super(props)

        this.state = {
            trainingLaddaLoader: false,
            title: '',
            year: '',
            authority: '',
            userId: '',
            trainingModel: false,
            trainingId: '',
            isUpdate: false,
            trainingDesc: ''
        }
        this.toggleTrainingModal = this.toggleTrainingModal.bind(this)
        this.onChangeText = this.onChangeText.bind(this)
        this.onEdit = this.onEdit.bind(this)
        this.onAdd = this.onAdd.bind(this)
        this.handleSubmitTraining = this.handleSubmitTraining.bind(this)
    }
    onChangeText(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    onAdd() {
        this.setState({
            isUpdate: false,
            trainingModel: true,
            trainingId: '',
            title: '',
            year: '',
            authority: '',
            trainingDesc: '',
            userId: '',
        })
    }
    onEdit(training) {
        this.setState({
            isUpdate: true,
            trainingModel: true,
            trainingId: training.trainingId,
            title: training.title,
            year: training.year.toString(),
            authority: training.issuingAuthority,
            trainingDesc: training.trainingDesc,
            userId: this.props.userId,
        })
    }
    toggleTrainingModal = () => {
        this.setState(prevState => ({
            trainingModel: !prevState.trainingModel
        }));
    }
    handleSubmitTraining(event, errors, values) {
        if (errors && errors.length > 0) {

        } else {
            this.setState({
                trainingLaddaLoader: true
            })
            this.props.insertTraining({
                isUpdate: this.state.isUpdate,
                trainingId: this.state.isUpdate && this.state.trainingId !== '' ? this.state.trainingId : uuidv4(),
                title: this.state.trainingTitle,
                year: parseInt(this.state.trainingYear),
                authority: this.state.authority,
                userId: this.props.userId,
                description: this.state.trainingDesc
            })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        //is employment stored 

        const { isTrainingInsert, allTraining } = this.props;
        //Is trainingLoaded
        if (prevProps.isTrainingInsert !== isTrainingInsert) {

            if (isTrainingInsert) {
                this.setState({
                    trainingModel: false,
                    trainingLaddaLoader: false,
                    allTraining
                }, () => {
                    this.props.getProfileCompletionProgress({
                        userId: this.props.userId
                    })
                })
            }
        }
    }
    render() {

        const { allTraining } = this.props
        const { trainingLaddaLoader } = this.state
        return (
            <React.Fragment>
                <Col lg="12" className="clearfix">
                    <Link to="#" className="btn btn-outline-primary float-right" onClick={this.onAdd}> Add </Link>
                </Col>
                <Col lg="12" className="mt-4 pt-2 pt-sm-0">
                    <ul style={{ paddingLeft: 0 }}>
                        {
                            allTraining && allTraining.length > 0 ? (
                                allTraining.map((training, index) =>
                                    <li key={this.props.key} style={{ boxShadow: '0 0 3px rgba(60, 72, 88, 0.15) !important', border: 'solid 0.5px #efefef', borderRadius: '10px !important' }} className={this.props.key === 0 ? "d-flex p-3 bg-white rounded " : "d-flex p-3 bg-white rounded  mt-4"} >
                                        <div className="content">
                                            <Row>
                                                <Col md="10" xs="8">
                                                    <p className="title mb-0 font16">{training && training.title}</p>
                                                    <p className="text-muted mb-0"><Link to="#" className="text-primary">{training && training.issuingAuthority}</Link> @{training && training.description}</p>
                                                    <p className="text-muted mb-0">{training && training.year}</p>
                                                </Col>
                                                <Col md="1" xs="2">
                                                    {/* <img src={edit} onClick={() => this.onEdit(training)} style={{ width: 20, height: 20, cursor: 'pointer' }} /> */}
                                                </Col>
                                                <Col md="1" xs="2">
                                                    {/* <img src={trash} onClick={() => this.onDeleteEducation(training.educationid)} style={{ width: 20, height: 20, cursor: 'pointer' }} /> */}
                                                </Col>
                                            </Row>
                                        </div>
                                    </li>
                                )
                            ) : <Nodata img={nodata} title={"No Data Found"} desc="Please add your training details here"></Nodata>
                        }
                    </ul>
                </Col>
                <Modal isOpen={this.state.trainingModel} role="dialog" autoFocus={true} centered={true}>
                    <ModalHeader toggle={this.toggleTrainingModal}>Add Training Details</ModalHeader>
                    <ModalBody>
                        <AvForm className="login-form" onSubmit={this.handleSubmitTraining}>
                            <Row>
                                <Col md={12}>
                                    <AvGroup className="form-group position-relative">
                                        <Label for="email">Training Title<span className="text-danger">*</span></Label>
                                        <AvField type="text" className="form-control" name="trainingTitle" id="trainingTitle" value={this.state.title} onChange={this.onChangeText} placeholder="Eg:React Native Training" required
                                            errorMessage=""
                                            validate={{
                                                required: { value: true, errorMessage: "Enter your training title" },
                                            }}
                                        />
                                    </AvGroup>
                                </Col>
                                <Col md={12}>
                                    <AvGroup className="form-group position-relative">
                                        <Label for="email">Issuing Authority<span className="text-danger">*</span></Label>
                                        <AvField type="text" value={this.state.authority} className="form-control" name="authority" id="authority" onChange={this.onChangeText} placeholder="Issuing authority" required
                                            errorMessage=""
                                            validate={{
                                                required: { value: true, errorMessage: "Enter your authority name" },
                                            }}
                                        />
                                    </AvGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <AvGroup className="form-group position-relative">
                                        <Label for="email">Year<span className="text-danger">*</span></Label>
                                        <AvField type="number" maxLength="4" value={this.state.year} className="form-control" name="trainingYear" id="trainingYear" onChange={this.onChangeText} placeholder="Eg:2015" required
                                            errorMessage=""
                                            validate={{
                                                required: { value: true, errorMessage: " year required" },
                                            }}
                                        />
                                    </AvGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>

                                    <FormGroup className="position-relative">
                                        <Label>Description</Label>
                                        <i className="mdi mdi-comment-text-outline ml-3 icons"></i>
                                        <textarea name="trainingDesc" value={this.state.trainingDesc} id="trainingDesc" rows="4" className="form-control pl-5" onChange={this.onChangeText} placeholder="Your training description"></textarea>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>

                                </Col>
                            </Row>
                            <LaddaButton
                                loading={trainingLaddaLoader}
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
                            <Button color="secondary" onClick={this.toggleTrainingModal}>Cancel</Button>

                        </AvForm>

                    </ModalBody>

                </Modal>
            </React.Fragment>

        )
    }
}

const mapStateToProps = (state) => ({
    allTraining: state.profile.allTraining,
    isTrainingInsert: state.profile.isTrainingInsert,
})

export default connect(mapStateToProps, { ...ProfileAction })(Training)
