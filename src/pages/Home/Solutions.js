import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Row, Col } from 'reactstrap';
import Slider from './Slider';
import About from './About';
import { Link } from "react-router-dom";

//Import reuseable components
import BlogBox from "../../components/Shared/blog-box";
import BoxContent from '../../components/Shared/box-content';
import SectionTitle from "../../components/Shared/section-title";
import Partners from '../../components/Shared/Partners';
import Feature from "../../components/Shared/Feature";


import ModalVideo from 'react-modal-video'
//Service Image
import del1 from '../../images/del1.png';
import del2 from '../../images/del2.png';
import del3 from '../../images/del3.png';

import flower from "../../assets/images/icon/flower.png";
import check from "../../images/icon/group.png"
import health from "../../assets/images/icon/drug.png";
import video from "../../assets/images/icon/video.svg";
import house from "../../assets/images/icon/house.png";
import essentials from "../../assets/images/icon/essentials.png";
import technical from "../../assets/images/icon/technical.png";
import lab from "../../assets/images/icon/lab-2.png";
import sandClock from "../../assets/images/icon/sand-clock.svg";
import { Pricing } from './Pricing';
import ProcessBox from "../../components/Shared/process-box";
import WhatWeDo from "./what-we-do";
//Import AOS animation
import AOS from 'aos';
import '../../../node_modules/aos/dist/aos.css';
import { Teams } from './Team';
import service from "../../images/icon/service.png";
import care_sub from "../../images/icon/care_sub.png";
import yoco_delight from "../../images/icon/yoco_delight.png";
export class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signedIn: false,
            processes: [
                { id: 1, title: "Describe your service needs", desc: "Search for the service needed. YoCo will instantly connect you to trusted individuals near your location of service.", link: "#" },
                { id: 2, title: "Hire your trusted companion", desc: "YoCo Safe feature will help you zero in on a reliable individual. Get to know the person, discuss customization and pricing, before you finalize.", link: "#" },
                { id: 3, title: "Secure payments and tracking", desc: "Make secure payments and sign up for the service. Receive live updates and track the status of your service at each stage.", link: "#" },
            ],
            services: [
                { id: 1, imgUrl: health, title: "Healthcare", description: "Get instantly connected with local health professionals who provide in-home services like nursing care, physiotherapy and routine health checkup" },
                { id: 2, imgUrl: flower, title: "Wellbeing", description: "Reliable individuals can thoughtfully serve by spending time with the elderly and providing them companionship, or accompanying them for doctor visits" },
                { id: 3, imgUrl: lab, title: "Lab Tests", description: "Avoid the commute to provide samples; qualified professionals can handle this safely at the convenience of your home" },
                { id: 6, imgUrl: house, title: "Property Maintenance", description: "We have experts who gauge and coordinate any maintenance work required at home or other properties" },
                { id: 4, imgUrl: essentials, title: "Utility Support", description: "You can rely on our pool of enthusiastic individuals who can take up simple tasks like helping with bank transactions, paying utility bills or land taxes, deliver groceries, medicines or any essentials" },
                { id: 5, imgUrl: technical, title: "Technical Assistance", description: "Guidance to use laptops and other smart devices; help with resolving internet and connectivity problems" },
            ],
            isPWAShown: false,
            isOpen: false
        }

        //Initilize Aos Animation
        AOS.init();
    }

    deferredPrompt;
    deferredPromptRejected = false



    componentDidMount() {
        //Refresh Aos Animation whenever components will render
        AOS.refresh();
        document.body.classList = "";
        document.getElementById('topnav').classList.add('bg-white');
        window.addEventListener("scroll", this.scrollNavigation, true);
        // document.getElementById("partners").classList.add("mt-5");
        if (localStorage.getItem("userId") !== null) {
            // localStorage.removeItem("userId");

        }
        if (localStorage.getItem("userId")) {
            this.setState({
                signedIn: true
            })
        }
        localStorage.removeItem("target");
        if (!this.deferredPrompt) {

            return;
        }
        this.deferredPrompt.prompt();

        this.deferredPrompt.userChoice
            .then((choiceResult) => {

                if (choiceResult.outcome === 'accepted') {
                    // no matter the outcome, the prompt cannot be reused ON MOBILE
                    // for 3 months or until browser cache is cleared?
                } else {
                    this.deferredPromptRejected = true;
                }

            });
    }
    // Make sure to remove the DOM listener when the component is unmounted.
    componentWillUnmount() {
        window.removeEventListener("scroll", this.scrollNavigation, true);
    }

    scrollNavigation = () => {
        var doc = document.documentElement;
        var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
        if (top > 80) {
            document.getElementById('topnav').classList.add('nav-sticky');
        }
        else {
            document.getElementById('topnav').classList.remove('nav-sticky');
        }
    }
    render() {
        return (
            <div>

                <React.Fragment>
                    
                    {/* Partners */}
                    <section className="pt-5 pb-5" style={{marginTop:60}}>
                        <section id="service" name="service">


                            <Container>
                                <Row>
                                    <Col md="4">
                                        <div className="service-card">
                                            <img src={care_sub} />
                                            <p style={{fontSize:23, fontWeight:"bold"}}>YoCo Care</p>
          
                                            <p className="font-title">Even while you are away from home, be present for your parents and elderly family back home by being in charge of their health and wellbeing. Choose from our packages or make your own package to ensure consistent care for your loved ones and peace of mind for yourself.</p>

                                            <Row>
                                                <Col className="text-center" xs="12">
                                                    <span>
                                                        PREVENTIVE CARE  </span><span> MEDICAL CARE</span><span>COMPANION CARE </span>
                                                </Col>
                                            </Row>
                                            <hr className="small-hr" />
                                            <Row>
                                                <Col xs="12">
                                                    <h6 className="font-title text-center" style={{ fontSize: 12 }}>Know more about our offerings, understand how a subscription works, and make your own package</h6>
                                                </Col>
                                            </Row>
                                            <div className="left width100">
                                            <a  onClick={() => this.props.history.push("/YoCoCare")}className="neat-button">Get care</a>
                                            </div>
                                        </div>
                                    </Col>

                                    <Col md="4">
                                        <div className="service-card">
                                            <img src={service} />
                                            <p style={{fontSize:22, fontWeight:"bold"}}>YoCo Buddy</p>
                                            <p className="font-title">For each of the unique needs back home that require your presence, find a trusted companion on YoCo instead!</p>
                                            <hr className="custom-hr" />
                                            <img className="one-time" src={check} />
                                            <h6 className="bold text-center">
                                                7000+
                                            </h6>
                                            <Row>
                                                <Col xs="12">
                                                    <h6 className="font-title text-center" style={{ fontSize: 12 }}>A network of qualified professionals and students ready to provide diverse services</h6>
                                                </Col>
                                            </Row>
                                            <hr className="small-hr" />
                                            <Row>
                                                <Col xs="12">
                                                    <h6 className="font-title text-center" style={{ fontSize: 12 }}>Experience for free how this works, with no obligation whatsoever.</h6>
                                                </Col>
                                            </Row>

                                            <div className="left width100">
                                                {
                                                    this.state.signedIn ?
                                                        <a onClick={() => this.props.history.push("/user/new-post")} className="neat-button">Find a service</a>
                                                        :
                                                        <a onClick={() => this.props.history.push("/YoCoBuddy")} className="neat-button">Find a service</a>
                                                }

                                            </div>
                                        </div>
                                    </Col>
                                    <Col md="4">
                                        <div className="service-card">
                                            <img src={yoco_delight} />
                                            <p style={{fontSize:22, fontWeight:"bold"}}>YoCo Delights</p>
                                            <p className="font-title">To celebrate a special occasion, to convey season’s greetings, or to simply experience the joy of gifting, you deserve to have some unique options.</p>
                                            <img style={{ width: "33%", padding: 10 }} src={del1} />
                                            <img style={{ width: "33%", padding: 10 }} src={del2} />
                                            <img style={{ width: "33%", padding: 10 }} src={del3} />
                                            <hr className="small-hr" />
                                            <Row>
                                                <Col xs="12">
                                                    <h6 className="font-title text-center" style={{ fontSize: 12 }}>Make your loved ones feel special by choosing a delightful option from our curated list of seasonal partner offerings.</h6>
                                                </Col>
                                            </Row>
                                            <div className="left width100">
                                                <a onClick={() => this.props.history.push("/YoCoDelights")} className="neat-button">Choose a delight</a>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Container>

                        </section>
                    </section>
                </React.Fragment>
                 
            </div>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(index)
