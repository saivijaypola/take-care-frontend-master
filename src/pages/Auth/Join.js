import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import {
    Container, Row, Col, Input, Label, FormGroup, Button, Modal,
    ModalBody
} from 'reactstrap';

export class Join extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isCheckAcceptUser: false,
            isCheckAcceptProvider: false,
            isModalVisible: false,
            error: ""
        }
        this.handleCheck = this.handleCheck.bind(this)
        this.findProvider = this.findProvider.bind(this)
        this.becomeProvider = this.becomeProvider.bind(this)
        this.toggleModal = this.toggleModal.bind(this)
    }
    componentDidMount() {
        window.scrollTo(0, 0);
    }
    handleCheck(event) {
        this.setState({
            [event.target.name]: event.target.checked
        })
    }
    findProvider() {
        if (this.state.isCheckAcceptUser) {
            this.props.history.push("/user-signup")
        }
        else {
            this.setState({
                error: "Please accept terms and conditions",
                isModalVisible: true
            })
        }
    }
    becomeProvider() {
        if (this.state.isCheckAcceptProvider) {
            this.props.history.push("/provider-signup")
        }
        else {
            this.setState({
                error: "Please accept terms and conditions",
                isModalVisible: true
            })
        }
    }
    toggleModal() {
        this.setState({
            isModalVisible: !this.state.isModalVisible
        })
    }
    render() {
        return (
            <section className="whitegrad-bg height-top-sign-in d-flex align-items-center">
                <Container>
                    <Row>
                        <Col md="6">
                            <div className="join-card">
                                <p className="font22">LOOKING FOR HELP</p>
                                <br />
                                <FormGroup>
                                    <div className="custom-control custom-checkbox">
                                        <Input type="checkbox" name="isCheckAcceptUser" className="custom-control-input" id="customCheck1" onChange={this.handleCheck} value={this.state.isCheckAcceptUser} />
                                        <Label className="custom-control-label" for="customCheck1">I Accept <Link to="legal/resources/pubuser/2" className="text-primary">Terms & Conditions</Link> and <Link to="legal/resources/pubuser/1" className="text-primary">Privacy Policy</Link> </Label>
                                        <br /><br />
                                        <a onClick={this.findProvider} id="buyButton" class="btn btn-primary buy2">SIGN UP AS A USER</a>
                                    </div>
                                </FormGroup>
                            </div>
                        </Col>
                        <Col md="6">
                            <div className="join-card">
                                <p className="font22">WANT TO HELP</p>
                                <br />
                                <FormGroup>
                                    <div className="custom-control custom-checkbox">
                                        <Input type="checkbox" name="isCheckAcceptProvider" className="custom-control-input" id="customCheck2" onChange={this.handleCheck} value={this.state.isCheckAcceptProvider} />
                                        <Label className="custom-control-label" for="customCheck2">I Accept <Link to="/legal/resources/pubprovider/2/" target="_blank" className="text-primary">Terms & Conditions</Link> and <Link to="/legal/resources/pubprovider/1" target="_blank" className="text-primary">Privacy Policy</Link></Label>
                                        <br /><br />
                                        <a id="buyButton" class="btn btn-primary" onClick={this.becomeProvider}>SIGN UP AS A PROVIDER</a>
                                    </div>
                                </FormGroup>
                            </div>
                        </Col>
                    </Row>
                    <Modal isOpen={this.state.isModalVisible}>
                        <ModalBody>
                            <h6>{this.state.error}</h6>
                            <Button onClick={this.toggleModal}>Close</Button>
                        </ModalBody>

                    </Modal>
                </Container>
            </section>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Join)
