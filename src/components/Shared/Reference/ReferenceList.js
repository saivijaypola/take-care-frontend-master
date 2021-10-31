import React, { Component } from 'react'
import { connect } from 'react-redux'
import Reference from './Reference'
export class ReferenceList extends Component {
    render() {
        return (
            <div>
                <Reference></Reference>
                <Reference></Reference>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(ReferenceList)
