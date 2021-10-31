import React, { useState } from 'react';
import { Container } from 'reactstrap';
import SectionTitle from "../../components/Shared/section-title";
import ReviewsSlider from "../../components/Shared/reviews-slider";

//Import Images
import img1 from "../../images/client/01.jpg";
import img2 from "../../images/client/02.jpg";
import img3 from "../../images/client/03.jpg";

export const Teams = () => {

    const [blogs] = useState(
        {
            reviews: [
                { id: 1, img: img1, name: "Yogesh Vijayan", post: "Founder & CEO", desc1: "With 19+ years of experience in IT and Management consulting, he has worked with global brands to drive their strategic initiatives in solving business problems and enabling innovation, transformation and operational excellence.", desc2: "Living in USA, away from his family, exposed him to the challenges faced by expatriates in balancing career aspirations with personal obligations.  Identifying this need to support families back home, especially with regard to health care, led him to combine his expertise with the possibilities of the gig economy workforce in creating this unique platform. ", desc3: "", qualification: '' },
                { id: 2, img: img2, name: "Jayan Nair", post: "Chief Marketing Officer", desc1: "As a marketing and communication leader with over 25 years of experience, the one learning that drives him is that customers embrace simple solutions that untangle complex challenges. The idea behind this platform – where care is just a touch away – is one that resonates with him, for the same reason.", desc2: "Having worked with leading pharmaceutical and health care services companies for many years, and with entrepreneurial expertise extending from entertainment to tourism domains, Jayan brings a wealth of diverse experience to YoCo.", desc3: "", qualification: '' },
                { id: 3, img: img3, name: "Dr. Freemu Varghese", post: "Chief Medical Officer", desc1: "A veteran doctor certified by the American Board of Internal Medicine and Nephrology, he has multiple years of experience in treating complicated illnesses and wounds. He also has a fellowship in critical care medicine and is currently the Chief of Nephrology at Diagnostic Clinic of Houston and the Medical Director at Quality Dialysis Inc., Houston.", desc2: "He is the chief visionary at YoCo ensuring that all programs, services and investments are aligned with our company’s vision; thus, creating and capturing customer value.", desc3: "", qualification: 'MD, FACP' }
            ]
        }
    )

    return (
        <Container className="mt-100 mt-60">
            {/* section title */}
            <SectionTitle title="About Us" subtitle=""
                desc="Inspired by the immigrant experiences of our three Directors, who live and work in the United States of America, it is one simple idea that we focus on: ensuring that physical distance does not come in the way of caring for our loved ones. To this end, we connect expats in various countries to service providers in their hometowns, using technology. We build trust and create job opportunities too, along the way."
                desc2="The YoCo mission is to make the world a closer-knit place by connecting people and making their lives hassle-free. "
                desc3="We are headquartered in Chicago, Illinois, and have regional offices in Bengaluru and Kochi in India."
            />

            {/* clients slider */}
            {/* <ReviewsSlider reviews={blogs.reviews} /> */}
        </Container>
    )
}