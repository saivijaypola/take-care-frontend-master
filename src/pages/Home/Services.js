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
import flower from "../../assets/images/icon/flower.png";
import health from "../../assets/images/icon/drug.png";
import service from "../../images/icon/service.png";
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


export class Services extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
                    <section id="home" name="home">
                        <Slider {...this.props} />
                    </section>
                    <section>
                        <div className="gradient-cool">

                        </div>
                       
                        <Container>
                            <Row>
                                <Col md="4">
                                    <div className="service-card">
                                        <img src={service}/>
                                        <p style={{fontSize:23, fontWeight:"bold"}}>YoCo YoCo Care</p>
                                        <p className="font-title">While you are away from home, you need not bear the guilt of not being present for your parents and elderly family. For all their health and well-being needs, we have got you covered.</p>
                                        <span>
                                        FUNDAMENTALS </span><span> WEEKLY VITALS </span><span> MONTHLY TESTING </span><span> POST HOSPITALISATION CARE </span><span> WEEKLY COMPANION </span><span> DAILY ESSENTIALS
                                        </span>
                                        <div className="left width100">
                                        <a className="neat-button">Customise your subscription</a>
                                        </div>
                                    </div>
                                </Col>
                               
                                <Col md="4">
                                <div className="service-card">
                                        <img src={service}/>
                                        <p style={{fontSize:23, fontWeight:"bold"}}>YoCo One-Time Assistance</p>
                                        <p className="font-title">For each of the unique needs back home that require your presence, find a trusted companion on YoCo instead!</p>
                                        <span>
                                        HOME HEALTHCARE </span><span> CARE & COMPANIONSHIP </span><span> DOCUMENTATION </span><span> TECHNICAL ASSISTANCE </span><span> HOUSE MAINTENANCE </span><span> BILL & TAX PAYMENTS </span><span> DELIVERY OF ESSENTIALS
                                        </span>
                                        <div className="left width100">
                                        <a onClick={()=> this.props.history.push("/YoCoBuddy")} className="neat-button">Find a service</a>
                                        </div>
                                    </div>
                                </Col>
                                <Col md="4">
                                <div className="service-card">
                                        <img src={service}/>
                                        <h2>YoCo Delights</h2>
                                        <p className="font-title">One of the best things you can do from a distance is giving a surprise! Choose a delightful option from our curated list of partner offering</p>
                                        <span>
                                        HAMPERS </span><span> FLOWERS </span><span> CHOCOLATES </span><span> CAKES
                                        </span>
                                        <div className="left width100">
                                        <a className="neat-button">Choose a delight</a>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                  
                    </section>
                    {/* Partners */}
                </React.Fragment>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Services)
