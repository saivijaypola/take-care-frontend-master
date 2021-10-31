import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Container, Row, Col, Modal, Button, ModalBody } from "reactstrap";
import OwlCarousel from 'react-owl-carousel';
import { ProfileAction, RequestActions, UserActions } from '../../redux/actions';
import { connect } from 'react-redux'
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { v4 as uuidv4 } from 'uuid';
import './style.css'
import check from "../../images/icon/check.svg";
import message from '../../images/icon/message-yellow.png'
import quote from '../../images/icon/quote-yellow.png'
import hamper from "../../images/hamper.jpg";
import FloatingInput from '../../components/Shared/GeoSuggest/FloatingInput';
import { getDistance } from 'geolib';
class PostSuccess extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }


    componentDidMount() {
        window.scrollTo(0, 0)
    }
    render() {
        const { delight } = this.props;
        console.log('PROPS', this.props);
        return (
            <React.Fragment>
                {/* <div style={{ paddingBottom: 200, backgroundImage:"none", backgroundColor:"#960096" }} className="safe-cover">
                    <Container>
                        <Row className="align-items-center text-center">
                            <Col lg="12">
                                <h2>Success</h2>
                            </Col>
                        </Row>
                    </Container>
                </div> */}
                <div className="whitegrad-bg">
                    <Container className="relative">
                       <div className="text-center" style={{padding:100, paddingBottom:20}}>
                       {
                                this.props.editRequest ?
                                    <p className="bold font22 purple-text">
                                        Your changes have been saved.
                                    </p>
                                    :
                                    <p className="bold font22 purple-text">
                                        Your request has been posted
                                    </p>
                            }
                           <img style={{width:90}} src={check}/>
                           <br/>
                           <br />
                           <p className="font-title font14 max560">
                           Your request is now posted and notified to the service providers in that location.
                           </p>
                           <br/>
                           <p className="bold font22">What's next?</p>
                       </div>
                       <div className="next-grey">
                           <Row>
                           <Col md="2"></Col>
                               <Col md="4">
                               <div className="next-card">
                                        <img src={message}/>
                                        <h6 className="bold">CHAT</h6>
                                        <p className="font14">
                                        View profiles of providers and evaluate their credibility. Initiate a chat with the ones that interest you.
                                        </p>
                                   </div>
                               </Col>
                               <Col md="4">
                                   <div className="next-card">
                                        <img src={quote}/>
                                        <h6 className="bold">QUOTE</h6>
                                        <p className="font14">
                                        Alternatively, service providers interested in your request may provide quotes too.
                                        </p>
                                   </div>
                               </Col>
                               <Col md="2"></Col>
                           </Row>
                       </div>
                       <div className="text-center" style={{padding:40}}>
                            <a onClick={()=>this.props.history.push("/user/requests")} className="hamper-button">View Request</a>
                       </div>
                    </Container>
                </div>

            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({

    delights: state.request.delights,
    delight: state.request.delight,
    selectedLocation: state.profile.selectedLocation

})

const mapDispatchToProps = {
    ...RequestActions,
    ...ProfileAction,
    ...UserActions
}

export default connect(mapStateToProps, mapDispatchToProps)(PostSuccess)
