import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Input, Label } from 'reactstrap';

// import images
import americanEx from '../../assets/images/payments/american-ex.png';
import discover from '../../assets/images/payments/discover.png';
import masterCard from '../../assets/images/payments/master-card.png';
import paypal from '../../assets/images/payments/paypal.png';
import visa from '../../assets/images/payments/visa.png';
import mail from '../../images/icon/mail-2.png';
import pin from '../../images/icon/placeholder.png';
import socialNetwork from '../../images/icon/insta-like.png';

class Footer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            grid1: [
                { title: "About us", link: "/page-aboutus" },
                { title: "Services", link: "/page-services" },
                { title: "Team", link: "/page-team" },
                { title: "Pricing", link: "/page-pricing" },
                { title: "Project", link: "/page-work" },
                { title: "Careers", link: "/page-jobs" },
                { title: "Blog", link: "/page-blog" },
                { title: "Login", link: "/page-cover-login" },
            ],
            grid2: [
                { title: "Terms of Services", link: "/page-terms" },
                { title: "Privacy Policy", link: "/page-privacy" },
                { title: "Documentation", link: "/documentation" },
                { title: "Changelog", link: "/changelog" },
                { title: "Components", link: "/components" },
            ]
        };
    }

    render() {
        return (
            <React.Fragment>
                <footer className={this.props.isLight ? "footer bg-light mobile-hide" : "footer mobile-hide"}>
                    <Container>
                        <Row>
                            <Link className={this.props.isLight ? "logo-footer text-dark" : "logo-footer"} to="#">YoCo LLC<span className="text-primary">.</span></Link>
                        </Row>
                        <Row>
                            <Col lg="7" md='7' xs="12" className="mb-0 mb-md-4 pb-0 pb-md-2" name="footercolumn">

                                <div className="footer-div">
                                    <br />
                                    <img className="footer-icon" src={pin}></img>
                                    <p style={{ float: "left" }} className={this.props.isLight ? "text-muted" : ""}>
                                        <span >Address:</span><br />
                                        <Row style={{ marginTop: 15 }}>
                                            <Col lg="6">
                                                <p><b>USA</b></p>
                                                <p>16192 Coastal Highway,Lewes<br /> Delaware 19958</p>
                                            </Col>
                                            <Col lg="6">
                                                <p><b>INDIA</b></p>
                                                <p style={{ fontSize: 14 }}> LGCL Bamboo Forest, Unit 12, Bangalore 560099</p>
                                            </Col>
                                        </Row>

                                    </p>
                                </div>
                            </Col>
                            <Col>
                                <div className="footer-div">
                                    <br />
                                    <img className="footer-icon" src={mail}></img>
                                    <p style={{ float: "left" }} className={this.props.isLight ? "text-muted" : ""}>
                                        <span>Have any questions?</span>
                                        <br />
                                        <Row style={{ marginTop: 15 }}>
                                            <Col>
                                            Mail us at: <br />
                                        info@yocoservices.com
                                        </Col>
                                        </Row>
                                    </p>

                                </div>
                            </Col>
                            <Col>
                                <div className="footer-div">
                                    <br />
                                    <img className="footer-icon" src={socialNetwork}></img>
                                    <p style={{ float: "left" }} className={this.props.isLight ? "text-muted" : ""}>
                                        <span>Find us on:</span>
                                        <br />
                                        <Row>
                                            <Col>
                                            <ul className="list-unstyled social-icon social mb-0 mt-4">
                                                <li className="list-inline-item mr-1"><a href="https://www.facebook.com/YoCo-Services-113423320431903" className="rounded" target='_blank'><i className="mdi mdi-facebook" title="Facebook"></i></a></li>
                                                <li className="list-inline-item mr-1"><a href="https://www.instagram.com/yococare/" className="rounded" target='_blank'><i className="mdi mdi-instagram" title="Instagram"></i></a></li>
                                                <li className="list-inline-item mr-1"><a href="https://twitter.com/YoCoCare" className="rounded" target='_blank'><i className="mdi mdi-twitter" title="Twitter"></i></a></li>
                                                <li className="list-inline-item mr-1"><a href="https://www.youtube.com/channel/UCu4wJae_-MJ9y5meT9SgLTA/featured" target='_blank' className="rounded"><i className="mdi mdi-youtube" title="YouTube"></i></a></li>
                                            </ul>
                                            </Col>
                                        </Row>
                                    </p>
                                </div>
                            </Col>

                            {/* <Col lg="2" md="4" xs="12" className="mt-4 mt-sm-0 pt-2 pt-sm-0" name="footercolumn">
                        <h4 className={this.props.isLight ? "text-dark footer-head" : "text-light footer-head"}>Company</h4>
                        <ul className="list-unstyled footer-list mt-4">
                            {
                                this.state.grid1.map((grid, key) =>
                                <li key={key}><Link to={grid.link} className={this.props.isLight ? "text-muted" : "text-foot"}><i className="mdi mdi-chevron-right mr-1"></i> {grid.title}</Link></li>
                                )
                            }
                        </ul>
                    </Col> */}

                            {/* <Col lg="3" md="4" xs="12" className="mt-4 mt-sm-0 pt-2 pt-sm-0" name="footercolumn">
                        <h4 className={this.props.isLight ? "text-dark footer-head" : "text-light footer-head"}>Usefull Links</h4>
                        <ul className="list-unstyled footer-list mt-4">
                            {
                                this.state.grid2.map((grid, key) =>
                                <li key={key}><Link to={grid.link} className={this.props.isLight ? "text-muted" : "text-foot"}><i className="mdi mdi-chevron-right mr-1"></i> {grid.title}</Link></li>
                                )
                            }
                        </ul>
                    </Col> */}

                            {/* <Col lg="4" md="4" xs="12" className="mt-4 mt-sm-0 pt-2 pt-sm-0" name="footercolumn">
                                <h4 className={this.props.isLight ? "text-dark footer-head" : "text-light footer-head"}>Newsletter</h4>
                                <p className="mt-4">Sign up and receive the latest tips via email.</p>
                                <Form>
                                    <Row>
                                        <Col lg="12">
                                            <div className={this.props.isLight ? "foot-subscribe foot-white form-group position-relative" : "foot-subscribe form-group position-relative"}>
                                                <Label className={this.props.isLight ? "text-muted" : ""}>Your Email Address <span className="text-danger">*</span></Label>
                                                <i className="mdi mdi-email ml-3 icons"></i>
                                                <Input type="email" name="email" id="emailsubscribe" className={this.props.isLight ? "form-control bg-light border pl-5 rounded" : "form-control pl-5 rounded"} placeholder="Email Id: " required />
                                            </div>
                                        </Col>
                                        <Col lg="12">
                                            <Input type="submit" id="submitsubscribe" name="send" className="btn btn-primary rounded w-100" value="Subscribe" />
                                        </Col>
                                    </Row>
                                </Form>
                            </Col> */}
                        </Row>
                    </Container>
                </footer>
                <footer className="footer footer-bar mobile-hide">
                    <Container className="text-center">
                        <Row className="align-items-center">
                            <Col sm="6">
                                <div className="text-sm-left">
                                    <p className="mb-0">© 2020-21 YoCo. Developed by <Link to="#" target="_blank" className="text-success">YoCo</Link>.</p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </footer>
            </React.Fragment>
        );
    }
}

export default Footer;
