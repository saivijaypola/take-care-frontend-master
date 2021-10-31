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
import UploadService from "../../handler/fileUploadService";
import { ProfileAction } from '../../redux/actions';

class UploadDocModel extends Component {
    static propTypes = {

    }
    constructor(props) {
        super(props);
        this.state = {
            isLaddaLoader: false,
            file: [],
            uploadprogress: 0,
            documentType: '',
            errorMessage: ''
        }
        this.handleSubmitUpload = this.handleSubmitUpload.bind(this);
        this.selectFiles = this.selectFiles.bind(this)
        this.onChangeText = this.onChangeText.bind(this)
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
    componentDidUpdate(prevProps, prevState) {

        //is education stored 
        const { isDocumentUploadDone, isUploading } = this.props;
        if (prevProps.isDocumentUploadDone !== isDocumentUploadDone && prevProps.isUploading !== isUploading) {
            if (isDocumentUploadDone && !isUploading) {
                this.onToggleModel()
                this.setState({
                    uploadprogress: 0
                })
            }else if(!isDocumentUploadDone && !isUploading){
                alert("Duplicate document found")
            }
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
                        UploadService.upload(currentFile, user, (event) => {
                            that.setState({
                                uploadprogress: (Math.round((100 * event.loaded) / event.total))
                            },()=>{
                                 
                            })
                        }).then((response) => {

                            if (response.data.data && response.data.data.length > 0) {

                                that.props.updateDocumentUpload(
                                    {
                                        "documentInput": {
                                            "uploadid": uuidv4(),
                                            "userId": user.uid,
                                            "documenttype": that.state.documentType,
                                            "isVerified": false,
                                            "filename": response.data.data[0],
                                            "createdAt": new Date(),
                                            "updatedAt": new Date()
                                        }
                                    }
                                )
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
    onToggleModel = () => {
        this.props.onToggle();

    }
    render() {
        const { isLaddaLoader } = this.state;
        const { isModelOpen } = this.props;
        return (
            <Modal isOpen={isModelOpen} role="dialog" autoFocus={true} centered={true}>
                <ModalHeader toggle={this.onToggleMode}>Upload Documents</ModalHeader>
                <ModalBody>
                    <AvForm className="login-form" onSubmit={this.handleSubmitUpload}>
                        <Row>
                            <Col md={12}>
                                <FormGroup>
                                    <Label>ID Type</Label>
                                    <select className="form-control custom-select" name="documentType" id="Sortbylist-Shop" onChange={this.onChangeText}>
                                        <option>Voters ID</option>
                                        <option>Driving Licence</option>
                                        <option>Passport</option>
                                        <option>Indian PAN</option>
                                        <option>Adhaar</option>
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
                        <Button color="secondary" onClick={this.onToggleModel}>Cancel</Button>

                    </AvForm>
                    {
                        this.state.uploadprogress > 0 ? (
                            <Progress className="position-relative mt-4 mb-4" value={this.state.uploadprogress} />
                        ):''
                    }
                  
                </ModalBody>

            </Modal>
        )
    }
}

function mapStateToProps(state) {
    return {
        isDocumentUploadDone: state.profile.isDocumentUploadDone,
        isUploading: state.profile.isUploading,
        userDetails: state.profile.userDetails
    }
}
export default connect(mapStateToProps, { ...ProfileAction })(UploadDocModel)
