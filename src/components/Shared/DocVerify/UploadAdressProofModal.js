import React, { Component } from 'react'
import { connect } from 'react-redux'
import { v4 as uuidv4 } from 'uuid';
import {
    Row, Col, Progress,
    FormGroup,
    Label,
    Modal,
    ModalHeader,
    ModalBody,
    Button,

} from "reactstrap";
import * as firebase from 'firebase';
import { AvForm } from 'availity-reactstrap-validation';
import LaddaButton, { XL, SLIDE_UP } from 'react-ladda';
import UploadService from "../../../handler/fileUploadService";
import { ProfileAction, DocumentsActions } from '../../../redux/actions';

const assetsBaseUrl = process.env.REACT_APP_ASSETS_BASE_URL


class UploadDocumentModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLaddaLoader: false,
            file: [],
            uploadedDocuments: [],
            userId: '',
            uploadprogress: 0,
            documentType: 'ind_voter_id',
            errorMessage: '',
            isDocumentUpdated: false
        }
        this.handleSubmitUpload = this.handleSubmitUpload.bind(this);
        this.selectFiles = this.selectFiles.bind(this)
        this.onChangeText = this.onChangeText.bind(this)
        this.onToggleModel = this.onToggleModel.bind(this)
    }

    onChangeText(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    selectFiles(event) {

        this.setState({
            file: event.target.files[0]
        })
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.isAdressProofUploadDone) {
            if (nextProps.isAdressProofUploadDone && nextProps.isAdressProofUpdated) {
                return nextProps;
            }
        }
        return null

    }
    componentDidUpdate(prevProps, prevState) {


        const { isAdressProofUploadDone, isAdressProofUploading, isAdressProofUpdated } = this.props;
        if (prevProps.isAdressProofUploadDone !== isAdressProofUploadDone && prevProps.isAdressProofUpdated !== isAdressProofUpdated) {

            if (isAdressProofUploadDone && !isAdressProofUploading && isAdressProofUpdated) {

                this.onToggleModel(false)
                this.props.onUploadComplete(true)
                this.setState({
                    uploadprogress: 0
                })

            } else if (!isAdressProofUploadDone && !isAdressProofUploading) {
                this.onToggleModel(false)
                alert("Duplicate document found")
            }
        } else if (prevProps.isAdressProofUploadDone !== isAdressProofUploadDone && !isAdressProofUpdated && prevProps.isAdressProofUploading !== isAdressProofUploading) {
            this.onToggleModel(false)
        }

    }

    handleSubmitUpload(event, errors, values) {
        var that = this
        if (errors && errors.length > 0) {

        } else {
            let jwtToken = firebase.auth().onAuthStateChanged(function (user) {
                if (user) {

                    user.getIdToken().then(function (idToken) {
                        let currentFile = that.state.file;
                        //   return idToken;
                        UploadService.upload(currentFile, {
                            "userId": user.uid,
                            "documenttype": that.state.documentType,
                            "isVerified": false,
                            "idType": "Adress Proof"
                        }, 'document', user, (event) => {
                            that.setState({
                                uploadprogress: (Math.round((100 * event.loaded) / event.total))
                            }, () => {

                            })
                        }).then((response) => {

                            if (response.data.data && response.data.data) {

                                that.setState({
                                    uploadedDocuments: response.data,
                                    uploadprogress:0,
                                    userId: user.uid,
                                }, () => {
                                    that.onToggleModel(false)
                                    that.props.getSpiffyStrength({
                                        userId: user.uid
                                    })
                                    that.props.getAllDocuments({
                                        userId: user.uid,
                                        idType: "Adress Proof"
                                    })
                                })
                            }
                        }).catch(() => {
                            that.setState({
                                uploadprogress: 0
                            })
                        });
                    });
                }
            });
        }
    }

    onToggleModel = (isOpen) => {
        this.props.onToggle(isOpen);
    }
    render() {
        const { isLaddaLoader } = this.state;
        const { isModelOpen } = this.props;
        return (
            <Modal isOpen={isModelOpen} role="dialog" autoFocus={true} centered={true}>
                <ModalHeader toggle={this.onToggleMode}>Upload Address Proof</ModalHeader>
                <ModalBody>
                    <AvForm className="login-form" onSubmit={this.handleSubmitUpload}>
                        <Row>
                            <Col md={12}>
                                <FormGroup>
                                    <Label>ID Type</Label>
                                    <select className="form-control custom-select" name="documentType" id="Sortbylist-Shop" onChange={this.onChangeText}>
                                        <option value="ind_voter_id">Voters ID</option>
                                        <option value="ind_driving_license">Driving Licence</option>
                                        <option value="ind_passport">Passport</option>
                                        <option value="ind_pan">Indian PAN</option>
                                        <option value="ind_aadhaar">Adhaar</option>
                                        <option>Other</option>
                                    </select>
                                </FormGroup>
                            </Col>
                            <Col md={12}>
                                <FormGroup>
                                    <Label>Browse</Label>
                                    <input type="file" onChange={this.selectFiles} className="form-control" />
                                </FormGroup>
                            </Col>
                        </Row>
                        <LaddaButton
                            loading={isLaddaLoader}
                            className="submitBnt btn btn-primary pull-right"
                            data-color="#eee"
                            data-size={XL}
                            data-style={SLIDE_UP}
                            data-spinner-size={30}
                            data-spinner-color="#ddd"
                            data-spinner-lines={12}
                        >
                            Upload
                        </LaddaButton>
                        {' '}
                        <Button color="secondary" onClick={() => this.onToggleModel(false)}>Cancel</Button>

                    </AvForm>
                    {
                        this.state.uploadprogress > 0 ? (
                            <div>
                                <Progress className="position-relative mt-4 mb-4" value={this.state.uploadprogress} />
                                <p>Verifiying...</p>
                            </div>

                        ) : ''
                    }

                </ModalBody>

            </Modal>
        )
    }
}

function mapStateToProps(state) {
    return {
        isAdressProofUploadDone: state.profile.isAdressProofUploadDone,
        isAdressProofUpdated: state.profile.isAdressProofUpdated,
        isAdressProofUploading: state.profile.isAdressProofUploading,
        userDetails: state.profile.userDetails,
    }
}
export default connect(mapStateToProps, { ...ProfileAction, ...DocumentsActions })(UploadDocumentModal)
