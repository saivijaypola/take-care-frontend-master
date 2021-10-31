import React, { Component } from 'react';
import { Progress } from "reactstrap";
import { Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import UploadPhotoIdModel from './UploadPhotoIdModel';
import tick from "../../../images/icon/tick-6.png";
import warning from "../../../images/icon/warning.png";
import { connect } from 'react-redux';
import { ProfileAction, DocumentsActions } from '../../../redux/actions';
import { getUser } from '../../../handler/authenticate';
import * as firebase from 'firebase';


class UploadPhotoProofAdmin extends Component {

    constructor(props) {
        console.log("🚀 ~ file: UploadPhotoProofAdmin.js ~ line 17 ~ UploadPhotoProofAdmin ~ constructor ~ props", props)
        super()
        this.state = {
            isModelOpen: false,
            allDocuments: [],
            isVerified: false,
            isUploaded: false,
            isPhotoIdUploaded: false
        }
        this.onUploadComplete = this.onUploadComplete.bind(this)
    }
    componentWillMount() {



        if (this.props.userId) {
            this.props.getAllDocuments({
                userId: this.props.userId,
                idType: "Photo Id"
            })

        }


    }
    onUploadComplete = (isUploaded) => {
        this.setState({
            isUploaded: true
        })
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
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.allDocuments !== prevState.allDocuments) {
            if (nextProps.allDocuments > 0) {
                return nextProps.allDocuments;
            }
        }
        return null


    }
    componentDidUpdate(prevProps, prevState) {

        //is employment stored 
        const { allDocuments } = this.props;

        if (prevProps.allDocuments !== allDocuments && allDocuments && allDocuments.length > 0) {

            //Verify Photo Proof If atleast one is verified

            this.setState({
                isPhotoIdUploaded: true
            }, () => {
                var verifiedPhotoId = allDocuments.filter((document) => document.idType === "Photo Id" && document.isVerified)

                this.setState({
                    isVerified: verifiedPhotoId.length > 0 ? true : false
                })


            })

        }
    }

    render() {
        console.log("🚀 ~ file: UploadPhotoProofAdmin.js ~ line 17 ~ UploadPhotoProofAdmin ~ constructor ~ props", this.props)
        const { text, desc, img, allDocuments } = this.props
        const { isModelOpen, isVerified, isUploaded, isPhotoIdUploaded } = this.state
        return (
            <div className="upload-card-mini" style={{ borderColor: isUploaded || isPhotoIdUploaded ? "rgb(255 233 249)" : "", borderWidth: isUploaded || isPhotoIdUploaded ? 4 : 0.5 }} onClick={() => this.onToggleUploadModel(true)}>
                <img src={img}></img>
                <h5>{text}</h5>
                <p className="text-muted">{desc}</p>
                {
                    isVerified ? (
                        <img key={'img_tick'} src={tick} style={{ width: 30, height: 40 }} />
                    ) : ''
                }
                {
                    allDocuments && allDocuments.length > 0 && isPhotoIdUploaded && !isVerified ? (
                        <div>
                            <img src={warning} key={"img_warning"} style={{ width: 30, height: 40 }} alt={"Photo Proof"} />

                        </div>
                    ) : ''
                }

                {/* < UploadPhotoIdModel onUploadComplete={() => this.onUploadComplete()} isModelOpen={isModelOpen} onToggle={() => this.onToggleUploadModel()} /> */}
            </div>
        );
    }
}
function mapStateToProps(state) {
    return {
        isPhotoIdUpdated: state.profile.isPhotoIdUpdated,
        isUploading: state.profile.isUploading,
        allDocuments: state.documents.allDocuments
    }
}
export default connect(mapStateToProps, { ...ProfileAction, ...DocumentsActions })(UploadPhotoProofAdmin);