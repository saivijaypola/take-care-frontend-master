import React, { Component } from 'react'
import { clearUserPreferences } from '../../utils/cache';
import firebase from "firebase";
import { ProfileAction } from "../../redux/actions";
import { connect } from 'react-redux';
import {
    Row, Col,
    Modal,
    Spinner,
    ModalHeader,
    ModalBody,
    Button,
    ModalFooter,

} from "reactstrap";
class Logout extends Component {
    constructor(props) {
        super(props);
        this.logoutYes = this.logoutYes.bind(this)
        this.logoutNo = this.logoutNo.bind(this)
    }
    logoutYes() {
        firebase.auth().signOut()
        var userId = localStorage.getItem('userId')
        this.props.history.push("/home");
        var userRef = firebase.database().ref('usermeta/'+userId+'/online');
        userRef.set(false);
        var userRef = firebase.database().ref('usermeta/'+userId+'/visible');
        userRef.set(false);
        var lastSeenRef = firebase.database().ref('usermeta/' + userId + '/lastseen');
        lastSeenRef.set(new Date().getTime())
        clearUserPreferences()
        this.props.clearUserData()
    }
    logoutNo() {
        this.props.history.goBack()
    }
    componentDidMount() {


    }
    render() {
        return (
            <div>
                <Modal style={{ marginTop: 150 }} isOpen={true}>
                    <ModalBody>
                        <p className="text-center bold font16">Are you sure?</p>
                        <br /><br />
                        <Row>
                            <Col xs="6">
                                <Button className="btn btn-primary width100" onClick={this.logoutYes}>Yes</Button>
                            </Col>
                            <Col xs="6">
                                <Button className="btn btn-sec width100" onClick={this.logoutNo}>No</Button>
                            </Col>
                        </Row>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        userBasicDetails: state.profile.userBasicDetails
    }
}
export default connect(mapStateToProps, { ...ProfileAction })(Logout)
