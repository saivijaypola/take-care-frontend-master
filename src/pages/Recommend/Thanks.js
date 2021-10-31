import React, { Component } from 'react'



import like from '../../images/icon/like.png';
import { RecommendActions } from '../../redux/actions';

export default class Thanks extends Component {

    componentDidMount() {
        window.scrollTo(0, 0)
      }
    render() {
        return (
            <React.Fragment>
                <section className="text-center thanksbg">
                    <img src={like} data-aos="fade-up"></img>
                    <p className="bold font20" data-aos-delay="200" data-aos="fade-up">Thanks for posting your comment</p>
                    {/* <p className="font-title" data-aos-delay="400" data-aos="fade-up">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam
                    </p> */}
                   
                </section>
            </React.Fragment>

        )
    }
}

 