import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Col } from "reactstrap";
import next from "../../images/icon/double-next.png";

class ProcessBox extends Component {
    render() {
        var length = this.props.processes.length;
        return (
            <React.Fragment>
                {
                    this.props.processes.map((process, key) =>
                        <Col md="4" className="mt-4 pt-2" key={key}>
                            <div className="work-process rounded" style={{boxShadow:'0 0 3px rgba(60, 72, 88, 0.15) !important',border:'solid 0.5px #efefef', borderRadius:'10px !important'}}>
                                <div className="countbox">{key+1}</div>
                                <h5 className="">{process.title}</h5>
                                <p className="text-muted para">{process.desc}</p>
                                <img src={next}></img>
                            </div>
                        </Col>
                    )
                }        
            </React.Fragment>
        );
    }
}

export default ProcessBox;