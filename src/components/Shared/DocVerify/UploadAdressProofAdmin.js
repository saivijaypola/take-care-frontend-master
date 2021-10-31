import React, { Component } from 'react';
import { Progress } from "reactstrap";
import { Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import UploadAdressProofModal from './UploadAdressProofModal';
import tick from "../../../images/icon/tick-6.png";
import warning from "../../../images/icon/warning.png";
import { connect } from 'react-redux';
import { ProfileAction, DocumentsActions } from '../../../redux/actions';
import { getUser } from '../../../handler/authenticate';
import * as firebase from 'firebase';


class UploadAdressProofAdmin extends Component {

    constructor(props) {
        super()
        this.state = {
            isModelOpen: false,
            allDocuments: [],
            isVerified: false,
            isUploaded: false,
            isAdressProofUploaded: false
        }
        this.onUploadComplete = this.onUploadComplete.bind(this)
    }
    componentDidMount() {
        if (this.props.userId) {


        }

    }
    onChangeText(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    onToggleUploadModel = (isOpen) => {
        this.setState({
            isModelOpen: isOpen
        });
    }
    onUploadComplete = (isUploaded) => {
        this.setState({
            isUploaded: true
        })
    }
    componentDidUpdate(prevProps, prevState) {

        if (this.props.userId !== prevProps.userId) {
            this.props.getAllDocuments({
                userId: this.props.userId,
                idType: "Photo Id"
            })
        }
        //is employment stored 
        const { allDocuments } = this.props;
        if (prevProps.allDocuments !== allDocuments && allDocuments && allDocuments.length > 0) {

            //Verify Address Proof If atleast one is verified

            this.setState({
                isAdressProofUploaded: true
            }, () => {
                var verifiedAddressProofs = allDocuments.filter((document) => document.idType === "Adress Proof" && document.isVerified)
                this.setState({
                    isVerified: verifiedAddressProofs.length > 0 ? true : false
                })

            })
        }

    }

    render() {
        const { text, desc, img, allDocuments, adressProof } = this.props
        const { isModelOpen, isVerified, isAdressProofUploaded, isUploaded } = this.state
        return (
            <div className="upload-card-mini" style={{ borderColor: isUploaded || isAdressProofUploaded ? "rgb(255 233 249)" : "", borderWidth: isUploaded || isAdressProofUploaded ? 4 : 0.5 }} onClick={() => this.onToggleUploadModel(true)}>
                <img src={img}></img>
                <h5>{text}</h5>
                <p className="text-muted">{desc}</p>
                {
                    isVerified && isAdressProofUploaded ? (
                        <img src={tick} style={{ width: 30, height: 40 }} />
                    ) : ''
                }
                {
                    adressProof && adressProof.length > 0 && !isVerified ? (
                        <img src={warning} style={{ width: 30, height: 40 }} alt={"Adress Proof"} />
                    ) : ''
                }
                <UploadAdressProofModal onUploadComplete={() => this.onUploadComplete()} isModelOpen={isModelOpen} onToggle={() => this.onToggleUploadModel()} />
            </div>
        );
    }
}
function mapStateToProps(state) {
    return {
        isDocumentUpdated: state.profile.isDocumentUpdated,
        isDocUploading: state.profile.isDocUploading,
        allDocuments: state.documents.allDocuments,
        adressProof: state.documents.adressProof
    }
}
export default connect(mapStateToProps, { ...ProfileAction, ...DocumentsActions })(UploadAdressProofAdmin);