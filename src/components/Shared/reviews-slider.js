import React, { Component } from 'react';
import { Media, Row, Col } from "reactstrap";
import StarRatings from 'react-star-ratings';

//Slider
import OwlCarousel from 'react-owl-carousel';
import '../../../node_modules/owl.carousel/dist/assets/owl.carousel.css';
import '../../../node_modules/owl.carousel/dist/assets/owl.theme.default.css';


class ReviewsSlider extends Component {
    state = {
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
        }
    }
    render() {
        return (
            <React.Fragment>

                <Row className="justify-content-center">
                    <Col lg="12">
                        <Row>
                            {
                                this.props.reviews.map((review, key) =>
                                    <Col key={key} lg="4">
                                        <Media className="customer-testi m-3" key={key} name="clientsreview">
                                            <Row>
                                                <Col lg="12">
                                                    <img src={review.img} style={{ height: 95, width: 95, margin: "10px 0px", display: "block" }} className="avatar avatar-small rounded shadow" alt="" />
                                                </Col>
                                                <Col lg="12">
                                                    <h4 className="bold">{review.name}<span style={{ fontSize: 14 }}>{' '}{review.qualification}</span></h4>
                                                    <h6>{review.post}</h6>
                                                    <p style={{ lineHeight: "1.4", fontSize: 14 }} className="text-muted">{review.desc1} </p>
                                                    <p style={{ lineHeight: "1.4", fontSize: 14 }} className="text-muted">{review.desc2} </p>
                                                    <p style={{ lineHeight: "1.4", fontSize: 14 }} className="text-muted">{review.desc3} </p>
                                                </Col>
                                            </Row>
                                        </Media>
                                    </Col>
                                )
                            }
                        </Row>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

export default ReviewsSlider;