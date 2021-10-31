import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import { connect } from 'react-redux'
import OwlCarousel from 'react-owl-carousel';
import { ProfileAction, RequestActions } from '../../redux/actions';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import './style.css'
import gift from "../../images/icon/gift-1.png";
import hamper from "../../images/hamper.jpg";
class Delight extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }

    }
    componentDidMount() {
        window.scrollTo(0, 0)
        this.props.getDelights()
        this.props.getDelightsById({
            "productId": "0d658ac3-1e10-46ec-9474-a7f6ffb962b2"
        })
    }
    render() {
        const { delights } = this.props;
        return (
            <React.Fragment>
                <div style={{ paddingBottom: 200 }} className="safe-cover delight-cover">
                    <Container>
                        <Row className="align-items-center text-center">
                            <Col lg="12">
                                <h2>YoCo Delights</h2>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <div>
                    <Container className="relative rise-card2">
                        <div className="grey-header">
                            <Row>
                                <Col xs="1">
                                    <img style={{ width: 50, margin: "0 auto", display: "block" }} src={gift} />
                                </Col>
                                <Col xs="11">
                                    <h4 style={{marginBottom:0}}><b>Delightful options to make your loved ones smile</b></h4>
                                    <p className="font14 font-title">We showcase curated options for you to choose from so that delivering a surprise and smile to your friends or family is easy, even from a distance.</p>
                                </Col>
                            </Row>
                        </div>
                        <div style={{ padding: "70px 100px" }}>
                            <Row>
                                {delights && delights.nodes && delights.nodes.map((delight, index) =>
                                    <Col md="4">
                                        <div className="delight-card">
                                            <div style={{ minHeight: 280 }}>
                                                <img src={delight.coverImages[0]} />
                                            </div>
                                            <h4><b>{delight.productTitle}</b></h4>
                                            <p className="font-title font14">{delight.productDescription}</p>
                                            <h3>Rs {delight.price}</h3>
                                            <a onClick={() => this.props.history.push("delight/" + delight.productId)} className="hamper-button">Choose</a>
                                        </div>
                                    </Col>
                                )}
                            </Row>
                        </div>
                        <div className="delight-bottom">
                            <div className="or">
                                <span>OR</span>
                            </div>
                            <p>Get a trusted companion to put together a custom delight and deliver it to the location you choose.</p>
                            <br />
                            <a onClick={() => this.props.history.push("/build-delight")} className="hamper-button rad-button">Build a Custom Delight</a>
                        </div>
                    </Container>
                </div>

            </React.Fragment>
        );
    }
}
const mapStateToProps = (state) => ({

    delights: state.request.delights,

})

const mapDispatchToProps = {
    ...RequestActions
}

export default connect(mapStateToProps, mapDispatchToProps)(Delight)
