import React, { Component } from 'react';
import { Row, Col } from "reactstrap";

class SectionTitle extends Component {
    render() {
        return (
            <React.Fragment>
                <Row className={this.props.isLeft ? "" : "justify-content-center"}>
                    <Col xs="12" className={this.props.isLeft ? "" : "text-center"}>
                        <div className="section-title mb-4 pb-2" name="maintitle">
                            <h4 className="title mb-4" name="sectiontitle"> {this.props.title} </h4>
                            {this.props.subtitle ? <h6 className="bold">{this.props.subtitle}</h6> : <span></span>}
                            <p className={this.props.isLeft ? "text-muted para-desc mb-0" : "text-muted para-desc mx-auto mb-0"} name="sectiondesc">{this.props.desc}<br />{this.props.line2 ? this.props.line2 : ''} </p>
                            <br></br>
                            <p className={this.props.isLeft ? "text-muted para-desc mb-0" : "text-muted para-desc mx-auto mb-0"} name="sectiondesc2">{this.props.desc2} </p>
                            <br></br>
                            <p className={this.props.isLeft ? "text-muted para-desc mb-0" : "text-muted para-desc mx-auto mb-0"} name="sectiondesc2">{this.props.desc3 && this.props.desc3} </p>
                        </div>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

export default SectionTitle;