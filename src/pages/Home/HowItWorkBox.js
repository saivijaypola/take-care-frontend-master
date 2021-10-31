import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import { Col } from "reactstrap";
export class HowItWorkBox extends Component {
    render() {
        return (
            <React.Fragment>
            {
                this.props.contents.map((process, key) =>
                    <Col lg="4" md="6" xs="12" key={key} className="mt-4 pt-2">
                        <div className="bg-light p-3 py-5 rounded" style={{boxShadow:'0 0 3px rgba(60, 72, 88, 0.15) !important'}}>
                            <img src={process.image} className="avatar avatar-md-sm" alt={process.title}/>
                            <div className="mt-4">
                                <h5><Link to="" className="text-primary"> {process.title}</Link></h5>
                                <p className="font-title mt-3 mb-0">{ process.desc}</p>
                            </div>
                        </div>
                    </Col>
                )
            }
        </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(HowItWorkBox)
