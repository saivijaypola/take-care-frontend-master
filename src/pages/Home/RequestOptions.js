import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Row, Col } from 'reactstrap';
import { Link } from "react-router-dom";

//Import reuseable components


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
import ProcessBox from "../../components/Shared/process-box";
//Import AOS animation
import AOS from 'aos';
import '../../../node_modules/aos/dist/aos.css';
import service from "../../images/icon/service.png";
import care_sub from "../../images/icon/care_sub.png";
import yoco_delight from "../../images/icon/yoco_delight.png";
export class RequestOptions extends Component {
    constructor(props) {
        super(props);
        this.state = {
           
        }
        this.findService=this.findService.bind(this)

    }
    findService(){
        var userId = localStorage.getItem("userId")
            if (!userId) {
                this.props.history.push("/YoCoBuddy")
            }
            else{
                this.props.history.push("/user/new-post")
            }
        
    }


    componentDidMount() {
        //Refresh Aos Animation whenever components will render
       
    }
    // Make sure to remove the DOM listener when the component is unmounted.


    render() {
        return (
            <div>

                <React.Fragment>

                    {/* Partners */}
                    <section className="pt-5 mt-5 pb-5 border-bottom border-top">
                        <section id="service" name="service">
                            <Container>
                                <Row>
                                    <Col md="4">
                                        <div className="service-card small-service-card">
                                            <img src={care_sub} />
                                            <p style={{fontSize:23, fontWeight:"bold"}}>YoCo Care</p>
                                            <p className="font-title">For any healthcare and wellbeing requirement of your loved ones back home, we have a solution!</p>
                                            <div className="left width100">
                                            <a  onClick={() => this.props.history.push("/YoCoCare")}className="neat-button">Customize</a>
                                            </div>
                                        </div>
                                    </Col>

                                    <Col md="4">
                                        <div className="service-card small-service-card">
                                            <img src={service} />
                                            <p style={{fontSize:23, fontWeight:"bold"}}>YoCo Buddy</p>
                                            <p className="font-title">7000+ provider network to help with your<br/> unique one-off needs at home.</p>
                                            <div className="left width100">
                                                <a onClick={this.findService} className="neat-button">Find a service</a>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md="4">
                                        <div className="service-card small-service-card">
                                            <img src={yoco_delight} />
                                            <p style={{fontSize:23, fontWeight:"bold"}}>YoCo Delights</p>
                                            <p className="font-title">Curated gifting options to put a smile<br/> on a dear one's face.</p>
                                        
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

export default connect(mapStateToProps, mapDispatchToProps)(RequestOptions)
