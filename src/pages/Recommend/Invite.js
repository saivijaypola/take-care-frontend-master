import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Row, Col, Input, Label, FormGroup, Button } from 'reactstrap';
import SectionTitleCheck from "../../components/Shared/section-title-check";

import check from '../../images/icon/tick-6.png';


import { RecommendActions } from '../../redux/actions';
import DialogBox from '../../components/Shared/dialog-box';
import ProfileCard from "../../components/Shared/UserProfileCard";


export class Invite extends Component {
    constructor(props) {
        super(props);
        this.state = {
            features1: [
                { icon: check, title: "Mention how you know the person you are recommending" },
                { icon: check, title: "You may include the qualities that you like in the person." },
                { icon: check, title: "You may also point out their special skills." },
                { icon: check, title: "If you have information on their background pertaining to education and work experience, please mention that too." },
            ],
            name: '',
            email: '',
            name: '',
            jobTitle: '',
            password: '',
            errorMsg: '',
            fbprofile: '',
            linkedinUrl: '',
            phoneNumber: '',
            comment: '',
            confirmpassword: '',
            isCheckAccept: false,
            isErrorModalVisible: false,
            saveRecommendLoader: false

        }
        this.onChangeText = this.onChangeText.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.isRecommendUpdated !== prevState.isRecommendUpdated) {
            if (nextProps.isRecommendUpdated) {
                return nextProps.isRecommendUpdated;
            }
        }
        // if(nextProps.recommendation !== prevState.recommendation){
        //      return nextProps.recommendation
        // }
        return null;
    }
    componentDidMount() {
        this.props.getInvitation({
            "recommendationId": this.props.match.params.inviteId
        })
    }
    componentDidUpdate(prevProps, prevState) {
        const { isRecommendUpdated, recommendation } = this.props;

        if (prevProps.isRecommendUpdated !== isRecommendUpdated) {
            if (isRecommendUpdated) {

                this.setState({
                    saveRecommendLoader: false
                }, () => {
                    this.props.history.push({
                        pathname: `/invitation/thanks/`
                    })
                })
                // this.props.history.push({
                //     pathname:"/invite/thanks"
                // })
            } else if (!isRecommendUpdated) {

                this.setState({
                    saveRecommendLoader: false
                })
            }
        }
        if (prevProps.recommendation !== recommendation) {
            this.setState({
                name: recommendation.name
            })
        }
    }
    onChangeText(event) {

        this.setState({
            [event.target.name]: event.target.value
        });

    }
    handleSubmit(event, errors, values) {
        const { name, jobTitle, comment } = this.state
        if (errors && errors.length > 0) {

        } else {
            if (jobTitle !== '' && comment !== '' && name !== '') {

                this.setState({
                    saveRecommendLoader: true,
                    errorMsg: ''
                }, () => {
                    var updateInvite = {
                        "recommendId": this.props.match.params.inviteId,
                        "recommendInput": {
                            "name": name,
                            "jobTitle": jobTitle,
                            "isCommentPublic": true,
                            "isContactPublic": false,
                            "comment": comment,
                            "isVerified":true,
                            "updatedAt": new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
                        }
                    }
                    this.props.updateInvite(updateInvite)
                })


            } else {
                this.setState({
                    isErrorModalVisible: true
                })
            }
        }


    }
    onCheckAccept = () => {
        this.setState(prevState => ({
            isCheckAccept: !prevState.isCheckAccept
        }))
    }

    handleCloseErrorDialog = () => {
        this.setState({
            isErrorModalVisible: false
        })
    }

    render() {
        const { isErrorModalVisible, name, comment, jobTitle } = this.state;
        const { recommendation } = this.props
        const userDetails = recommendation && recommendation.tblUserByUserId
        return (
            <React.Fragment>

                <section className="bg-home fixheight">

                    <Container>
                        <Row>
                            <Col lg="5">
                                <br className="mobile-hide"></br>
                                <p style={{fontSize:16, fontWeight:"bold"}}>Users can see your recommendation on <span style={{ color: "#a34890", fontWeight: '200' }}>{userDetails && userDetails.fullname}'s</span> profile.</p>
                                <SectionTitleCheck
                                    desc="Some pointers:"
                                    features={this.state.features1}
                                    class="mdi-18px h5 mr-2"
                                    className="small-check"
                                >
                                </SectionTitleCheck>
                                <p>Any information that will help our users make an informed choice to serve their ageing parents or loved ones can go in here.</p>

                            </Col>
                            <Col lg="5">
                                <FormGroup>
                                    <Input type="text" name="name" id="name" value={name} onChange={this.onChangeText} placeholder="Enter your fullname" />
                                </FormGroup>
                                <FormGroup>
                                    <Input type="text" name="jobTitle" id="job" value={jobTitle} onChange={this.onChangeText} placeholder="Enter your job title here" />
                                </FormGroup>
                                <FormGroup>
                                    <Input type="textarea" onChange={this.onChangeText} maxLength={750} name="comment" id="exampleText" placeholder="Enter your recommendation here" />
                                </FormGroup>
                                <Row style={{ marginTop: 15 }}>
                                    <Col lg="6" xs="6">
                                        <a onClick={this.handleSubmit} className="btn btn-primary width120 pull-right">Submit</a>
                                    </Col>
                                    <Col lg="6" xs="6">
                                        <a className="btn btn-grey width120">Cancel</a>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                </section>
                {/* Dialog Terms and condition */}
                <DialogBox
                    isDialogOpen={isErrorModalVisible}
                    title={"Warning"}
                    handleClose={this.handleCloseErrorDialog}
                    message={"All fields are mandatory, Please check the missing fields."}
                    handleClickDialog={this.handleCloseErrorDialog}
                />
            </React.Fragment>

        )
    }
}

const mapStateToProps = (state) => ({
    isRecommendUpdated: state.recommend.isRecommendUpdated,
    recommendation: state.recommend.recommendation,

})

const mapDispatchToProps = {
    ...RecommendActions

}

export default connect(mapStateToProps, mapDispatchToProps)(Invite)
