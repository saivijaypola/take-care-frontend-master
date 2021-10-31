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
class DelightItem extends Component {
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
        return (
            <React.Fragment>
                <div style={{ paddingBottom: 200 }} className="safe-cover delight-cover">
                    <Container>
                        <Row className="align-items-center text-center">
                            <Col lg="12">
                                <h2>Yoco Delights</h2>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <div>
                    <Container className="relative rise-card2">
                       <div className="text-center" style={{padding:80, paddingBottom:20}}>
                           <img style={{width:90}} src={check}/>
                           <br/>
                           <h2 className="bold purple-text">Your request is posted!</h2>
                           <p className="font-title font14 max560">
                           We are so excited that you have chosen YoCo to delight your loved ones! The YoCo Delights request you posted has been notified to service providers in the area of delivery.
                           </p>
                           <br/>
                           <h2 className="bold">What's next?</h2>
                       </div>
                       <div className="next-grey">
                           <Row>
                           <Col md="2"></Col>
                               <Col md="4">
                               <div className="next-card">
                                        <img src={message}/>
                                        <h6 className="bold">CHAT</h6>
                                        <p className="font14">
                                        Once you click "View Request" below, you can see the details of the service providers in the area you need the delivery. You can choose your preferred providers based on their credentials and initiate a conversation with them to give more details / customise your request further.
                                        </p>
                                   </div>
                               </Col>
                               <Col md="4">
                                   <div className="next-card">
                                        <img src={quote}/>
                                        <h6 className="bold">QUOTE</h6>
                                        <p className="font14">
                                        You can also go through the quotes you may have received from the service providers in the area. Choose what suits you and respond to them accordingly.
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

export default connect(mapStateToProps, mapDispatchToProps)(DelightItem)
