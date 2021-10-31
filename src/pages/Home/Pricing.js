import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import SectionTitle from "../../components/Shared/section-title";

import PricingBox3 from "../../components/Shared/pricing-box3";

import insurance from "../../assets/images/icon/insurance.svg";

//import images
import cta from '../../images/coworking/cta.jpg';
import lightbulb from '../../images/icon/lightbulb.svg';
import tableImg from '../../images/icon/table.svg';
import star from '../../images/icon/star.svg';
import startUp from '../../images/icon/start-up.svg';

export class Pricing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pricings : [
                { id : 1, title : "Try for Free", image : lightbulb, price : "19", duration : "mo", desc : "Start working with Landrick that can provide everything you need to generate awareness, drive traffic, connect.", btnName : "Buy Now" },
                { id : 2, title : "Subscibe 'n' Save", image : tableImg, price : "39", duration : "mo", desc : "Start working with Landrick that can provide everything you need to generate awareness, drive traffic, connect.", btnName : "Get Started", isActive : true },
                { id : 3, title : "DEDICATED", image : star, price : "49", duration : "mo", desc : "Start working with Landrick that can provide everything you need to generate awareness, drive traffic, connect.", btnName : "Get Started" },
                { id : 4, title : "OFFICE", image : startUp, price : "59", duration : "mo", desc : "Start working with Landrick that can provide everything you need to generate awareness, drive traffic, connect.", btnName : "Try It Now" },
            ],
            isOpen: false
        }
      //  this.openModal = this.openModal.bind(this);
    }
    render() {
        return (
            <Container className="mt-100 mt-60">
            {/* section title */}
            <SectionTitle title="Choose The Pricing Plan" desc=" that can provide everything you need to generate awareness, drive traffic, connect." />

            <Row className="align-items-center">
                {/* Pricing */}
                <PricingBox3 pricings={this.state.pricings} />
            </Row>
        </Container>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Pricing)
