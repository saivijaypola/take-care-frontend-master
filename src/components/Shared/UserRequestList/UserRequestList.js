import React, { Component } from 'react'
import UserRequestCard from '../UserRequestCard/UserRequestCard'
import { connect } from 'react-redux'
import {
    Container, Row, Col 


} from "reactstrap";

export class UserRequestList extends Component {
    render() {
        return (
            <div>
                <Row>
                                            <Col lg="6">
                                            <UserRequestCard/>
                                            </Col>
                                            <Col lg="6">
                                            <UserRequestCard/>
                                            </Col>
                                            <Col lg="6">
                                            <UserRequestCard/>
                                            </Col>
                                            <Col lg="6">
                                            <UserRequestCard/>
                                            </Col>
                                        </Row>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(UserRequestList)
