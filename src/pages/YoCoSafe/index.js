import React, { Component } from 'react';
import { Container } from "reactstrap";

//Import Components
import Section from "./section";
import Partners from "../../components/Shared/Partners";
import Feature from "../../components/Shared/Feature";
import FeatureDescription from "./feature-description";
import CTA from "./cta";
import Pricings from "./pricings";
import Trial from "./trial";

//Import Images
import user from "../../images/icon/user.svg";
import calendar from "../../images/icon/calendar.svg";
import sandclock from "../../images/icon/sand-clock.svg";
import classic02 from "../../images/saas/classic02.png";
import classic03 from "../../images/saas/classic03.png";
import yocoauth from "../../images/icon/yoco-auth.png";
import yocotrack from "../../images/icon/yoco-track.png";
import yocosafe from "../../images/icon/yoco-safe.png";

import range1 from "../../images/icon/yoyoco-safe-1.png";
import range2 from "../../images/icon/yoyoco-safe-2.png";
import range3 from "../../images/icon/yoyoco-safe-3.png";
import range4 from "../../images/icon/yoyoco-safe-4.png";
import range5 from "../../images/icon/yoyoco-safe-5.png";


class IndexclassNameicSaas extends Component {

    componentWillMount() {
        window.scrollTo({top:0})
    }
    state = {
        
        features : [
            { imgUrl : user, title : "Easy To Use", description : "Nisi aenean vulputate eleifend tellus vitae eleifend enim a Aliquam eleifend aenean elementum semper." },
            { imgUrl : calendar, title : "Daily Reports", description : "Allegedly, a Latin scholar established the origin of the established text by compiling unusual word" },
            { imgUrl : sandclock, title : "Real Time Zone", description : "It seems that only fragments of the original text remain in only fragments the Lorem Ipsum texts used today." },
        ],
        facilities1 : [
            { icon : yocosafe ,title : "Spiffy", subtitle : "Finding your companion", desc : "Follow the Spiffy strength score in each profile to find the individual that suits your service needs.", desc2: "Assess the detailed profile information which includes education and employment background, trainings and certification, reviews and ratings from other users."},
            { icon : yocoauth, title : "Authenticate", subtitle : "When your companion arrives", desc : "Ensure that the person you signed up is the one who shows up for providing the service.", desc2: "A randomly generated unique code will be sent to you as the companion arrives. You can validate the code, and cross check the digital photo ID and the physical ID proof, before allowing them to perform the service."},
            { icon : yocotrack, title : "Track", subtitle : "When your companion serves", desc : "Receive real-time status updates at each stage of the service.", desc2: "You can also request the companion to upload pictures and videos as status updates in proof of providing the service."},
        ],
        facilities2 : [
            { icon : "mdi-security" ,title : "Authenticate", desc : "To ensure that the person you signed up is the one who shows up for providing the service.A randomly generated unique code will be sent to you as the person arrive. You can validate the code, digital phot ID as well as physical ID proofs before allowing him to perform the service."},
            { icon : "mdi-clock-check-outline", title : "Track", desc : "Receive real-time status updates at each stage of the service.You can also request the companion to upload pictures and videos as part of the status update as proof of providing the service. "},
        ],
        yokorange : [
            { icon : range1 ,desc : "Educated individuals with a clean work experience history"},
            { icon : range2, desc : "Address proof and photo ID verified"},
            { icon : range3 ,desc : "Credible recommendations from verified sources (professors and others in responsible positions)"},
            { icon : range4, desc : "Police clearance certificate / comprehensive criminal and court record verified"},
            { icon : range5 ,desc : "Three consecutive 5 star ratings for their services to other users"},
        ],
    }
    
     
    render() {
        return (
            <React.Fragment>
                

                <section className="section overflow-hidden">
                    
                    {/* Render Feature Description */}
                    <FeatureDescription image1={classic02} image2={classic03} testimonials={this.state.testimonials} facilities1={this.state.facilities1} facilities2={this.state.facilities2} yokorange={this.state.yokorange} />


                </section>
            </React.Fragment>
        );
    }
}

export default IndexclassNameicSaas;