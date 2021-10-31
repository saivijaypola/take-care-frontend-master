import React from 'react';
import { Alert } from 'reactstrap';
export default function InfoBox(props) {
    return (
        <div className="component-wrapper">
            <div className="p-4">
                <Alert color="success">
                    <p className="alert-heading font16 bold"> {props.title}</p>
                    <p>
                       {props.desc}
                    </p>
                </Alert>
            </div>
        </div>

    )
}