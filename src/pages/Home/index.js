import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Row, Col } from 'reactstrap';
import Slider from './Slider';
import About from './About';
import { Link } from "react-router-dom";
import OwlCarousel from 'react-owl-carousel';

//Import reuseable components
import BlogBox from "../../components/Shared/blog-box";
import BoxContent from '../../components/Shared/box-content';
import SectionTitle from "../../components/Shared/section-title";
import Partners from '../../components/Shared/Partners';
import Feature from "../../components/Shared/Feature";
import HomeLocation from '../../components/Shared/GeoSuggest/HomeLocation';
import { AuthAction, ProfileAction } from '../../redux/actions';

import ModalVideo from 'react-modal-video'
//Service Image
import del1 from '../../images/del1.png';
import del2 from '../../images/del2.png';
import del3 from '../../images/del3.png';
import hand from '../../images/hand.png';

import devi from '../../images/devi.png';
import manya from '../../images/manya.png';
import gigin from '../../images/gigin.png';

import flower from "../../assets/images/icon/flower.png";
import check from "../../images/icon/group.png"
import health from "../../assets/images/icon/drug.png";
import video from "../../assets/images/icon/video.svg";
import house from "../../assets/images/icon/house.png";
import user from "../../images/icon/user-6.png"
import essentials from "../../assets/images/icon/essentials.png";
import technical from "../../assets/images/icon/technical.png";
import lab from "../../assets/images/icon/lab-2.png";
import sandClock from "../../assets/images/icon/sand-clock.svg";
import { Pricing } from './Pricing';
import ProcessBox from "../../components/Shared/process-box";
import WhatWeDo from "./what-we-do";
//Import AOS animation
import AOS from 'aos';
import ReadMoreReact from 'read-more-react';
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
            responsive: {
                0: {
                    items: 1,
                },
                550: {
                    items: 1,
                },
                650: {
                    items: 2,
                },
                1000: {
                    items: 3,
                },
            },
            selectedLocation: '',
            userLocation: '',
            opinions: [
                { id: 1, avatar: manya, name: "Manya Naidu", video: "https://www.youtube.com/embed/8Fd_R9J8FZY", para: false, location: "New York, USA" },
                {
                    id: 2, avatar: gigin, name: "Gigin Krishnan", video: false, para: "As an expat in USA, ensuring preventive healthcare for my parents back home is a top priority for me. I’ve tried different options in the past and recently stumbled upon YoCo.\n\
                    It seemed and sounded different; so I signed up for their ‘weekly vitals’ and ‘monthly lab tests’ packages as a trial. But what they delivered was truly beyond my expectations - the experience of a truly “trusted companion” serving my parents who felt just like family.\n\
                    Initially I was worried my parents won’t be comfortable with this whole idea. But the service was so personalised that now they themselves have asked me to sign up for the ‘fundamentals’ package too. They have been bowled over", location: "USA"
                },
                {
                    id: 3, avatar: devi, name: "Devi Jayan", video: false, para: "Thank you YoCo for helping me give the best birthday surprise to my sister!\
                \nThe provider went out of her way to deliver the service with additional personal touches, like a hand-written card. She found the most beautiful bouquet and a delicious cake. She also got to the house really early to make sure my sister got the gifts first thing in the morning.\
                \nI will come back to YoCo for sure!", location: "Chicago, USA"
                },
                {
                    id: 3, avatar: user, name: "Anup Philip", video: false, para: "I was not sure about this concept initially and wondered if I can entrust important work with people I meet online. I needed help with creating a rental agreement and couriering it to a tenant. YoCo support was very helpful in helping me when I had questions.\
                \nI placed a request and was so excited to see responses in 2 minutes! I was able to finalise a provider quickly and got my work done soon too. Such a huge relief, really!\
                \nThe platform is quick and easy; I will use it again for sure. ", location: "Illinois, USA"
                },
                {
                    id: 4, avatar: user, name: "NSS of Chicago", video: false, para: "We used this service for delivering a wreath to a member’s father’s funeral. We needed someone to drop it personally. It was done in a respectable manner.\
                \nWe are very happy with the provider who helped us. She was a college student and communicated very well with us. She took care of the specifications we had requested for the wreath.", location: "USA"
                },
                {
                    id: 5, avatar: user, name: "Lakshmi Mohan", video: false, para: "YoCo is the best service I have come across in a very long time.\
                \nI had been worried about regular medical check-ups for my parents during COVID. Thanks to YoCo, I found a doctor who provides them with services in the safest settings.", location: "New Jersey, USA"
                },
            ],
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
        this.onSelectLocation = this.onSelectLocation.bind(this)
        //Initilize Aos Animation
        AOS.init();
    }
    onSelectLocation = (selectedLocation) => {
        this.setState({
            userLocation: selectedLocation
        }, () => {
            this.props.changeLocation(selectedLocation)
        })
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
                    <section id="home" name="home">
                        {/* <Slider {...this.props} /> */}
                        <Container>
                            <div className="spotlight">
                                <p style={{fontSize:16, color:"white"}}>Wherever you live, stay connected to your roots with YoCo.</p>
                                <h4 style={{fontSize:17}}> Find a trusted companion for every unique need that requires your presence back home.</h4>
                                <div className="relative" style={{ maxWidth: 450 }}>
                                    <HomeLocation onSelectLocation={this.onSelectLocation} value={this.state.selectedLocation} label={"Enter the location where you need the service"} />
                                    <a onClick={() => this.props.history.push('/pre-request')} className="home-go">GO</a>
                                </div>

                            </div>
                            <img className="hand" src={hand} />
                        </Container>


                    </section>
                    {/* <div className="covid-vacinnation-wrappper">

                        <div className="covid-content">

                            <h3>THE COMPLETE VACCINATION PACKAGE  </h3><span> Get your parents a vaccination buddy! </span>
                            <button onClick={() => this.props.history.push("/YoCoCare")}> Yes, let's do that</button>
                        </div>
                    </div> */}

                    <section id="experience">
                        <Container>
                            <div className="section-title text-center pt-5">
                                <p className="title mb-2 bold font16">The YoCo Experience</p>
                                <p className="font-title para-desc mx-auto mb-0">Users around the world share their stories of finding trusted companions. </p>
                                <hr /><br />
                            </div>
                            <div>

                                <OwlCarousel
                                    className="owl-theme"
                                    items={3}
                                    loop
                                    margin={1}
                                    dots={true}
                                    responsive={this.state.responsive}
                                    autoplay={false}
                                >
                                    {
                                        this.state.opinions.map((opinion, key) =>
                                            <div className="opinion-card">
                                                <Row>
                                                    <Col xs="2">
                                                        <img src={opinion.avatar} />
                                                    </Col>
                                                    <Col xs="10">
                                                        <h6>{opinion.name}</h6>
                                                        <span className="font-title">{opinion.location}</span>
                                                    </Col>
                                                </Row>
                                                {
                                                    opinion.video &&
                                                    <div style={{ paddingTop: 15, paddingRight: 20 }}>
                                                        <iframe width="100%" height="240px" src={opinion.video}>
                                                        </iframe>
                                                    </div>

                                                }
                                                {
                                                    opinion.para &&
                                                    <p>
                                                        <ReadMoreReact text={opinion.para}
                                                            min={160}
                                                            ideal={200}
                                                            max={400}
                                                            readMoreText={"Read More"} />

                                                    </p>
                                                }

                                            </div>
                                        )
                                    }
                                </OwlCarousel>
                            </div>
                        </Container>


                    </section>
                    {/* Partners */}
                    <section className="pt-5 pb-5 border-bottom">
                        <section id="service" name="service">


                            <Container>
                                <div className="section-title text-center pt-1">
                                    <p className="title mb-2 bold font16">Solutions</p>
                                </div>
                                <Row>
                                    <Col md="6">
                                        <div className="service-card">
                                            <img src={care_sub} />
                                            <p style={{fontSize:23, fontWeight:"bold"}}>YoCo Care</p>

                                            {/* <p className="font-title">Even while you are away from home, be present for your parents and elderly family back home by being in charge of their health and wellbeing. Choose from our packages or make your own package to ensure consistent care for your loved ones and peace of mind for yourself.</p> */}
                                            <p className="text-muted">We will find you a suitable person, who can be
                                            like your own family member, to take care of
                                            the health and well-being requirements of your
                                            dear ones.</p>
                                            <Row>
                                                <Col className="text-center" xs="12">
                                                    <span> PREVENTIVE CARE  </span><span> MEDICAL CARE</span>
                                                </Col>
                                                <Col className="text-center" xs="12">
                                                    <span>COMPANION CARE </span>
                                                </Col>
                                            </Row>
                                            <hr className="small-hr" />
                                            <Row>
                                                <Col xs="12">
                                                    {/* <h6 className="font-title text-center" style={{ fontSize: 12 }}>Know more about our offerings, understand how a subscription works, and make your own package</h6> */}
                                                    <h6 className="text-muted text-center" style={{ fontSize: 12 }}>Choose from our offerings or customize your own package</h6>
                                                </Col>
                                            </Row>
                                            <div className="left width100">
                                                {
                                                    this.state.signedIn ?
                                                        <a onClick={() => this.props.history.push("/YoCoCare")} className="hamper-button">VIEW OPTIONS</a>
                                                        :
                                                        <a onClick={() => this.props.history.push("/join")} className="hamper-button">VIEW OPTIONS</a>
                                                }
                                            </div>
                                        </div>
                                    </Col>

                                    <Col md="6">
                                        <div className="service-card">
                                            <img src={service} />
                                            <p style={{fontSize:23, fontWeight:"bold"}}>YoCo Buddy</p>
                                            <p className="text-muted">Errand, chore or the more serious stuff – find a
                                            reliable person whom you can trust as your own
                                            friend to get the task done!</p>
                                            <Row>
                                                <Col className="text-center" xs="12">
                                                    <span>
                                                        BANK WORK  </span><span> TAX PAYMENTS</span><span>HOME MAINTENANCE </span>
                                                </Col>
                                                <Col className="text-center" xs="12">
                                                    <span>
                                                        PURCHASE & DELIVERY </span><span> THOUGHTFUL GIFTS</span><span>ANY OTHER ASSISTANCE </span>
                                                </Col>
                                            </Row>

                                            <hr className="small-hr" />
                                            <Row>
                                                <Col xs="12">
                                                    {/* <h6 className="font-title text-center" style={{ fontSize: 12 }}>Experience for free how this works, with no obligation whatsoever.</h6> */}
                                                    <h6 className="text-muted text-center" style={{ fontSize: 12 }}>A network of 7000+ qualified professionals and students ready to provide diverse services</h6>
                                                </Col>
                                            </Row>

                                            {/* <img className="one-time" src={check} />
                                            <h6 className="bold text-center">
                                                7000+
                                            </h6> */}

                                            {/* <hr className="small-hr" />
                                            <Row>
                                                <Col xs="12">
                                                    <h6 className="text-muted text-center" style={{ fontSize: 12 }}>Experience for free how this works, with no obligation whatsoever.</h6>
                                                </Col>
                                            </Row> */}

                                            <div className="left width100">
                                                {
                                                    this.state.signedIn ?
                                                        <a onClick={() => this.props.history.push("/user/new-post")} className="hamper-button">FIND A SERVICE</a>
                                                        :
                                                        <a onClick={() => this.props.history.push("/join")} className="hamper-button">FIND A SERVICE</a>
                                                }
                                            </div>
                                        </div>
                                    </Col>
                                    {/* <Col md="4">
                                        <div className="service-card">
                                            <img src={yoco_delight} />
                                            <h2>YoCo Delights</h2>
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
                                                <a onClick={() => this.props.history.push("/YoCoDelights")} className="hamper-button">Choose a delight</a>
                                            </div>
                                        </div>
                                    </Col> */}
                                </Row>
                            </Container>

                        </section>

                        <section id="safe" name="safe">
                            <br></br>
                            <WhatWeDo />
                        </section>
                        <section id="how" name="how">

                            <Container className="mt-100 mt-60" >
                                <Row className="justify-content-center">
                                    <Col className="text-center">
                                        <div className="section-title">
                                            <p className="title mb-4 font16">How It Works</p>
                                            <p className="font-title para-desc mx-auto mb-0">A new way to provide care and support to your loved ones in 3 easy steps. </p>
                                            <div className="mt-3">
                                                <Link to="#" onClick={() => this.setState({ isOpen: true })} id="playbtn" className="btn btn-primary mt-2 mr-2">Watch Video &nbsp; <i className="mdi mdi-play"></i></Link>&nbsp;
                                                {/* <Link to="#" onClick={() => this.setState({ isOpen: true })} id="playbtn" className="video-play-icon watch text-white title-dark mb-2 ml-2"><i className="mdi mdi-play play-icon-circle text-center d-inline-block mr-2 rounded-pill text-white title-dark position-relative play play-iconbar"></i> Watch Video</Link> */}
                                            </div>
                                        </div>
                                        <br></br>
                                    </Col>
                                </Row>
                                <Row>
                                    {/*  How It Works*/}
                                    <ProcessBox processes={this.state.processes} />
                                </Row>
                            </Container>
                        </section>
                        <section id="aboutus" name="aboutus">
                            <Teams />
                        </section>
                    </section>
                </React.Fragment>
                <ModalVideo channel='youtube' isOpen={this.state.isOpen} videoId='2VPnNV_TDEE' onClose={() => this.setState({ isOpen: false })} />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {
    ...AuthAction,
    ...ProfileAction
}

export default connect(mapStateToProps, mapDispatchToProps)(index)
