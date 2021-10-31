import React, { Component } from 'react'
import { connect } from 'react-redux'
import profile from "../../../images/icon/user.png"
export class Reference extends Component {
    render() {
        const {recommend} = this.props
        return (
            <div className="reference">
                <h6 className="bold"> <img src={profile}></img> <span className="job-name">{recommend.name} </span><br/>
                <span className="job-title">{recommend.jobTitle}</span></h6>
                <p className="font-title">
                    {recommend.comment}
                </p>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Reference)
