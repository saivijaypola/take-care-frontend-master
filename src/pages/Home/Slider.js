// React Basic and Bootstrap
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, FormGroup, Button } from 'reactstrap';

//Slider
import OwlCarousel from 'react-owl-carousel';
import '../../../node_modules/owl.carousel/dist/assets/owl.carousel.css';
import '../../../node_modules/owl.carousel/dist/assets/owl.theme.default.css';

// Modal Video 
import ModalVideo from 'react-modal-video'
import '../../../node_modules/react-modal-video/scss/modal-video.scss';

// import images
import bg01 from '../../assets/images/coworking/bg01.jpg';
import bg02 from '../../assets/images/coworking/bg02.jpg';
import bg03 from '../../assets/images/coworking/bg03.jpg';

class Slider extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            isOpen: false,
            items: [
                {
                    id: 1,
                    image: bg01,
                    subtitle: "",
                    title: "A platform for you and your family",
                    desc: "We help you find reliable individuals for all your healthcare and essential needs.",
                },
                {
                    id: 2,
                    image: bg02,
                    subtitle: "",
                    title: "Safety of your loved ones is important",
                    desc: "YoCo Safe feature helps you zero in on individuals whom you can trust."
                },
                {
                    id: 3,
                    image: bg03,
                    subtitle: "",
                    title: "Care is just a touch away",
                    desc: "A new way to provide care and support for your loved ones."
                },

            ],
        }
        this.openModal = this.openModal.bind(this);
        this.findProvider = this.findProvider.bind(this);
    }

    openModal() {
        this.setState({ isOpen: true })
    }
    findProvider(){
        if (localStorage.getItem('role') == "user") {
            this.props.history.push('/user/requests')
        }else if (localStorage.getItem('role') == "provider") {
            this.props.history.push('/provider/requests')
        }
        else {
            this.props.history.push('/YoCoBuddy')
        }
    }

    ele = (id) => {
        if (id === 1) {
            return <React.Fragment>
                <div className="mt-4 pt-2 animated fadeInUpBig animation-delay-11">
                    <a href="#service" className="btn btn-primary buy2 mt-2"><i style={{paddingRight:10}} className="mdi mdi-email"></i>Find A Provider</a>
                </div>
            </React.Fragment>
        }
        else if (id === 2) {
            return <React.Fragment>
                <div className="mt-4 pt-2 animated fadeInUpBig animation-delay-11">
                    <Link to="/yocosafe" className="btn btn-primary mt-2"><i style={{paddingRight:10}}className="mdi mdi-email"></i>Read More</Link>
                </div>
            </React.Fragment>
        }
        else {
            return <React.Fragment>
                <div className="watch-video mt-4 pt-2 animated fadeInUpBig animation-delay-11">
                <Link to="#" onClick={() => this.setState({ isOpen: true })} id="playbtn"  className="btn btn-primary mt-2 mr-2">Watch Video &nbsp; <i className="mdi mdi-play"></i></Link>
                </div>
            </React.Fragment>
        }
    }

    render() {
        return (
            <React.Fragment>
                <section className="main-slider">
                    <OwlCarousel
                        className="slides"
                        items={1}
                        loop
                        navSpeed={1500}
                        fluidSpeed={1000}
                        autoplaySpeed={200}
                        dots={false}
                        autoplay={true}
                    >
                        {this.state.items.map((item, key) =>
                            <div key={key} className="bg-slider d-flex align-items-center" style={{ backgroundImage: `url(${item.image})` }}>
                                <div className="bg-overlay"></div>
                                <Container>
                                    <Row className="justify-content-center">
                                        <Col lg="12" className="text-center">
                                            <div className="title-heading mt-4">
                                                <h6 className="text-light para-dark animated fadeInDownBig animation-delay-1">{item.subtitle}</h6>
                                                <h1 className="heading mb-3 text-white title-dark animated fadeInUpBig animation-delay-3">{item.title}</h1>
                                                <p className="para-desc text-light para-dark mx-auto animated fadeInUpBig animation-delay-7">{item.desc}</p>
                                                {this.ele(item.id)}
                                            </div>
                                        </Col>
                                    </Row>
                                </Container>
                            </div>
                        )}
                    </OwlCarousel>
                    <ModalVideo channel='youtube' isOpen={this.state.isOpen} videoId='2VPnNV_TDEE' onClose={() => this.setState({ isOpen: false })} />
                </section>

            </React.Fragment>
        );
    }
}

export default Slider;
